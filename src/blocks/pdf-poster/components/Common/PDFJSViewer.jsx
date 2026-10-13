import React, { Fragment, useEffect, useRef, useState } from "react";
// import { loadFrameIfNotLoaded } from '../../../hooks/utils/loadFrameIfNotLoaded';
// import isEdgeBrowser from "../../../hooks/utils/isEdgeBrowser";
const exampleFile = "http://localhost/freemius/wp-content/uploads/2022/02/temp.pdf";
import "./../../style.scss";

/**
 * The URL the viewer will really request.
 *
 * `source` is normally the bundled viewer wrapped around the PDF
 * (`.../viewer.html?file=<encoded url>`), so the thing worth probing -- and worth
 * naming in an error -- is the `file` parameter, not the wrapper.
 */
const extractFileParam = (url) => {
  if (typeof url !== "string" || !url.includes("viewer.html")) return url;
  try {
    return new URL(url, window.location.origin).searchParams.get("file") || url;
  } catch (e) {
    return url;
  }
};

/**
 * Turn a 404 into something the reader can act on.
 *
 * "Missing PDF file." is what PDF.js says, and it is the least useful three words in
 * the plugin: it names no file and suggests no cause. A 404 on a PDF that used to work
 * almost always means the stored URL outlived the file -- the site moved domain, went
 * HTTPS, was cloned to staging, or the media item was deleted or re-uploaded.
 *
 * Only someone who can edit posts is shown the URL: a visitor cannot act on it, and it
 * leaks the site's internal paths. Inside an editor the answer is yes by definition --
 * the editor's own `pdfp` payload has no capability flag to consult.
 */
const describeMissingFile = (url, __, canDiagnose) => {
  if (!canDiagnose) {
    return __("This document is currently unavailable.", "pdf-poster");
  }

  return `${__("The PDF file could not be found (404).", "pdf-poster")} ${__("The saved link may point at a file that was moved, renamed or deleted -- re-select the file on this poster to repair it.", "pdf-poster")}\n${url}`;
};

const describeWrongType = (contentType, __) => {
  const type = String(contentType || "").split(";")[0].trim().toLowerCase();

  if (type.startsWith("image/")) {
    return __("This address points at an image, not a PDF. The saved media item may have been replaced -- re-select the file on this poster.", "pdf-poster");
  }
  if (type === "text/html") {
    return __("The server returned a web page instead of the PDF. The file is usually blocked by a login requirement, a hotlink protection rule or a security plugin.", "pdf-poster");
  }
  return null;
};

const describeBadResponse = (url, __, canDiagnose, probe) => {
  if (!canDiagnose) {
    return __("This document is currently unavailable.", "pdf-poster");
  }

  const wrongType = probe && probe.contentType ? describeWrongType(probe.contentType, __) : null;
  if (wrongType) {
    return `${wrongType}\n${url}`;
  }

  const detail = probe && probe.status
    // translators: %d is an HTTP status code, e.g. 403. Substituted with replace() rather
    // than through the i18n package: this component is bundled into view.js, which is
    // enqueued without wp-i18n, so that import would read window.wp.i18n off undefined.
    ? __("The server answered with HTTP %d.", "pdf-poster").replace("%d", probe.status)
    : __("The server did not return the file as expected.", "pdf-poster");

  return `${__("The PDF could not be loaded.", "pdf-poster")} ${detail} ${__("A 403 usually means a security plugin, hotlink protection or the server's permissions are blocking the file; a 5xx means the server itself failed.", "pdf-poster")}\n${url}`;
};

// How far ahead of the viewport an inline poster starts loading, so a reader scrolling
// down meets a document that is already on its way rather than an empty frame.
const LOAD_AHEAD = "300px";

function PDFJSViewer({ __, attributes, source = pdfp?.placeholder || exampleFile, className, isBackend = false, isSelected = false, onGViewError, forceLoad = false }) {
  const { hrScroll, title, socialShare } = attributes;
  const { position } = (socialShare || {});
  const [isLoaded, setIsLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  /*
    The viewer is only pointed at its PDF once the poster can actually be seen.

    Loading every poster up front is what made a page of popup buttons misbehave: each
    hidden poster ran a full PDF.js instance at 0x0, competing for the same connection,
    and a document laid out at zero width could come back blank when its popup opened.
    The editor keeps loading at once -- the author is looking straight at it.
  */
  const [isActive, setIsActive] = useState(isBackend);
  const wrapperRef = useRef(null);
  const iframeRef = useRef(null);

  const isLoadedRef = useRef(false);
  isLoadedRef.current = isLoaded;
  const probeRef = useRef(null);

  const canDiagnose = isBackend || (typeof pdfp !== "undefined" && !!pdfp?.canEdit);

  // A popup trigger hovered, focused or tapped asks for the document before the click,
  // so the popup usually opens on a viewer that has already started.
  useEffect(() => {
    if (forceLoad) setIsActive(true);
  }, [forceLoad]);

  useEffect(() => {
    if (isActive) return;

    const target = wrapperRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setIsActive(true);
      return;
    }

    // A popup's wrapper is display:none until it opens, so it never intersects before
    // then -- the same observer covers inline posters, popups (fullscreen or the CSS
    // fallback), tabs and accordions without knowing which one it is in.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setIsActive(true);
        observer.disconnect();
      }
    }, { rootMargin: LOAD_AHEAD });

    observer.observe(target);
    return () => observer.disconnect();
  }, [isActive]);

  useEffect(() => {
    // Reset error when source changes
    setPdfError(null);
    setIsLoaded(false);
    // Cleared with it, so a failed or cross-origin pre-check cannot describe this load
    // using what the previous one found.
    probeRef.current = null;

    if (!source || !isActive) return;

    // HTTP HEAD check to pre-validate the URL
    const validatePdfUrl = async (url) => {
      if (url.includes("google.com/gview")) return;

      const fileToValidate = extractFileParam(url);

      try {
        const response = await fetch(fileToValidate, { method: "HEAD" });

        probeRef.current = {
          status: response.status,
          contentType: response.headers.get("Content-Type"),
        };

        if (response.status === 404) {
          setPdfError(describeMissingFile(fileToValidate, __, canDiagnose));
          return;
        }
        if (!response.ok) {
          console.warn(`PDF pre-check returned HTTP ${response.status}. Continuing load attempt.`);
          return;
        }

        const wrongType = describeWrongType(response.headers.get("Content-Type"), __);
        if (wrongType) {
          setPdfError(canDiagnose ? `${wrongType}\n${fileToValidate}` : __("This document is currently unavailable.", "pdf-poster"));
          return;
        }

        const contentLength = response.headers.get("Content-Length");
        if (contentLength && parseInt(contentLength, 10) === 0) {
          setPdfError(__("The PDF file is empty or corrupted (0 bytes).", "pdf-poster"));
        }
      } catch (error) {
        // If fetch fails due to CORS, we just let PDF.js try anyway
        console.warn("PDF pre-check failed (likely CORS). Continuing load attempt.", error);
      }
    };

    validatePdfUrl(source);

    let timeoutId;
    if (source.includes("google.com/gview")) {
      // Set a 10 second timeout for GView
      timeoutId = setTimeout(() => {
        if (!isLoadedRef.current && typeof onGViewError === "function") {
          console.warn("Google Docs Viewer took too long to load. Falling back to PDF.js.");
          onGViewError();
        }
      }, 10000);
    }

    // Listen for messages from custom.js inside the iframe
    const handleMessage = (event) => {
      if (!event.data || event.data.type !== "PDFP_ERROR") return;

      // Every viewer on the page posts to the same window, so only our own frame's
      // error is ours to show -- otherwise one broken file put its error on every
      // poster, and Retry "fixed" the healthy one by simply not hearing it again.
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;

      // PDF.js only ever raises its missing-file string for a hard 404, so rewrite that
      // one case into the actionable message instead of passing three useless words on.
      const raw = event.data.message || "";
      if (/missing pdf/i.test(raw)) {
        setPdfError(describeMissingFile(extractFileParam(source), __, canDiagnose));
        return;
      }

      // Same treatment for the other PDF.js string that names nothing: it covers a 403,
      // a 5xx and a broken byte-range response alike, and the pre-check usually knows
      // which one it was.
      if (/unexpected server response/i.test(raw)) {
        setPdfError(describeBadResponse(extractFileParam(source), __, canDiagnose, probeRef.current));
        return;
      }

      setPdfError(raw || __("An error occurred while loading the PDF.", "pdf-poster"));
    };

    // The viewer posts to its parent, which is the editor canvas iframe rather than the
    // top window when the block is rendered there.
    const messageTarget = wrapperRef.current?.ownerDocument?.defaultView || window;
    messageTarget.addEventListener("message", handleMessage);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      messageTarget.removeEventListener("message", handleMessage);
    };
  }, [source, onGViewError, __, attempt, canDiagnose, isActive]);

  // In the block editor the canvas is an iframe, so the fullscreen state lives on the
  // button's own document -- the top-level `document` has no fullscreen element to exit.
  const exitFullScreen = (e) => {
    const doc = e.currentTarget?.ownerDocument || document;
    if (doc.fullscreenElement) doc.exitFullscreen();
  };

  const handleLoad = () => {
    // A frame with no src yet fires load for about:blank -- that is not the viewer.
    if (!isActive) return;
    setIsLoaded(true);
  };

  const renderError = (message) => (
    <div className="pdfp_error_container">
      <div className="pdfp_error_box">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {/* The editor-facing message carries the failing URL on its own line. */}
        {String(message).split("\n").map((line, i) => (
          <p key={i} className={i === 0 ? undefined : "pdfp_error_detail"}>{line}</p>
        ))}
        <button onClick={() => setAttempt((n) => n + 1)} className="pdfp_retry_btn">
          {__("Retry", "pdf-poster")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {source.includes("dropbox.com") ? (
        <div className="dropbox-embed-sdfsdfsdf" style={{ border: "2px solid #ddd" }}>
          <p>{__("Preview is not available for dropbox", "pdf-poster")}</p>
        </div>
      ) : (
        <Fragment>
          <div ref={wrapperRef} className={`iframe_wrapper ${className} ${hrScroll ? "pdfp_horizontal_scroll" : ""}`}>
            {isBackend && !isSelected && <div className="pdfp-embed-overlay"></div>}
            {!(isBackend && isSelected) && <div className="pdfp_frame_overlay"></div>}
            {pdfError ? (
              renderError(pdfError)
            ) : (
              // Rendered without a src until active, so the frame already holds its size
              // under every height rule and the page does not shift when it loads.
              <iframe key={attempt} ref={iframeRef} className="pdfp_iframe" src={isActive ? source : undefined} title={title} onLoad={handleLoad}></iframe>
            )}
            <span className="close" onClick={exitFullScreen}>
              &times;
            </span>
          </div>
        </Fragment>
      )}
    </>
  );
}

export default PDFJSViewer;
