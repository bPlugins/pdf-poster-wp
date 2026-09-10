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
    return __("This document is currently unavailable.", "pdfp");
  }

  return `${__("The PDF file could not be found (404).", "pdfp")} ${__("The saved link may point at a file that was moved, renamed or deleted -- re-select the file on this poster to repair it.", "pdfp")}\n${url}`;
};

function PDFJSViewer({ __, attributes, source = pdfp?.placeholder || exampleFile, className, isBackend = false, isSelected = false, onGViewError }) {
  const { hrScroll, title, socialShare } = attributes;
  const { position } = (socialShare || {});
  const [isLoaded, setIsLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  // Bumped by Retry. It is the iframe's React key, so incrementing it tears the frame
  // down and builds a fresh one -- which is what "retry" has to mean here. Reloading
  // the whole page (the old behaviour) re-requested the same URL from the same server
  // and could never change the outcome, while throwing away unsaved editor work.
  const [attempt, setAttempt] = useState(0);

  // `isLoaded` is read by the Google-Viewer timeout but must NOT re-run the effect:
  // the effect clears pdfError on entry, so re-running it the moment the iframe fires
  // onLoad could wipe an error that PDF.js is about to report (a 404 still loads
  // viewer.html successfully -- `documenterror` follows afterwards). A ref gives the
  // timeout the current value without making it a dependency.
  const isLoadedRef = useRef(false);
  isLoadedRef.current = isLoaded;

  // Who gets the failing URL and the repair hint rather than a bare apology.
  const canDiagnose = isBackend || (typeof pdfp !== "undefined" && !!pdfp?.canEdit);

  useEffect(() => {
    // Reset error when source changes
    setPdfError(null);
    setIsLoaded(false);

    if (!source) return;

    // HTTP HEAD check to pre-validate the URL
    const validatePdfUrl = async (url) => {
      // Don't check GView URLs as they are already a proxy
      if (url.includes("google.com/gview")) return;

      const fileToValidate = extractFileParam(url);

      try {
        // Mostly advisory: proxies answer HEAD with 405, or 403 on an unexpected
        // Cache-Control -- neither means the PDF is unreachable, so those keep loading.
        //
        // 404 is the exception, and it is worth catching here rather than waiting for
        // PDF.js. By the time PDF.js reports it, all the user is told is "Missing PDF
        // file." -- true, but useless: the usual cause is a URL saved before the site
        // changed domain or the media was replaced, and nobody can guess that from
        // those three words. We know the URL, so we say it.
        const response = await fetch(fileToValidate, { method: "HEAD" });
        if (response.status === 404) {
          setPdfError(describeMissingFile(fileToValidate, __, canDiagnose));
          return;
        }
        if (!response.ok) {
          console.warn(`PDF pre-check returned HTTP ${response.status}. Continuing load attempt.`);
          return;
        }
        const contentLength = response.headers.get("Content-Length");
        if (contentLength && parseInt(contentLength, 10) === 0) {
          setPdfError(__("The PDF file is empty or corrupted (0 bytes).", "pdfp"));
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

      // PDF.js only ever raises its missing-file string for a hard 404, so rewrite that
      // one case into the actionable message instead of passing three useless words on.
      const raw = event.data.message || "";
      if (/missing pdf/i.test(raw)) {
        setPdfError(describeMissingFile(extractFileParam(source), __, canDiagnose));
        return;
      }

      setPdfError(raw || __("An error occurred while loading the PDF.", "pdfp"));
    };

    window.addEventListener("message", handleMessage);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("message", handleMessage);
    };
  }, [source, onGViewError, __, attempt, canDiagnose]);

  // In the block editor the canvas is an iframe, so the fullscreen state lives on the
  // button's own document -- the top-level `document` has no fullscreen element to exit.
  const exitFullScreen = (e) => {
    const doc = e.currentTarget?.ownerDocument || document;
    if (doc.fullscreenElement) doc.exitFullscreen();
  };

  const handleLoad = () => {
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
          {__("Retry", "pdfp")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {source.includes("dropbox.com") ? (
        <div className="dropbox-embed-sdfsdfsdf" style={{ border: "2px solid #ddd" }}>
          {/* Working from render.php */}
          <p>{__("Preview is not available for dropbox", "pdfp")}</p>
        </div>
      ) : (
        <Fragment>
          <div className={`iframe_wrapper ${className} ${hrScroll ? "pdfp_horizontal_scroll" : ""}`}>
            {/*
              Click-shield for the block editor. An iframe swallows every mouse event,
              so without a cover the block can't be clicked to select or dragged in the
              list -- but leaving the cover up unconditionally meant the PDF could never
              be scrolled, clicked or paged through in the editor at all.

              Selected = interactive, deselected = shielded: the same bargain core's
              embed blocks strike. The front end never had a shield (isBackend is false
              there) and its markup is unchanged.
            */}
            {isBackend && !isSelected && <div className="pdfp-embed-overlay"></div>}
            {!(isBackend && isSelected) && <div className="pdfp_frame_overlay"></div>}
            {pdfError ? (
              renderError(pdfError)
            ) : (
              <iframe key={attempt} className="pdfp_iframe" src={source} title={title} onLoad={handleLoad}></iframe>
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
