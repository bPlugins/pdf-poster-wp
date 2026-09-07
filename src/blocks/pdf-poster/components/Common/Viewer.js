import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import PDFJSViewer from "./PDFJSViewer";
import FlipbookViewer from "./FlipbookViewer";
import Style from "./Style";
import SocialShare from "./SocialShare";
import PopupTrigger from "./PopupTrigger";
import matchProtocol from "../../../../hooks/utils/matchProtocol";
import toSiteRelativeUrl, { isSiteLocalUrl } from "../../../../hooks/utils/toSiteRelativeUrl";
import isEdgeBrowser from "../../../../hooks/utils/isEdgeBrowser";
import { hasFlipbookEngine } from "../../utils";
import useTracking from "../../../../hooks/useTracking";
import Watermark from "./Watermark";
import { encodeWatermarkParam } from "./watermarkSVG";
// import { isOldiPhoneOrIPad } from "../utils";

const Viewer = ({ attributes, RichText, setAttributes, __, isBackend = false, isSelected = false, id }) => {
  const { adobeEmbedder, file, protect, alert: enableAlert, additional, socialShare, align, print, onlyPDF, downloadButton, thumbMenu, hrScroll, isHideRightToolbar, initialPage, zoomLevel, sidebarOpen, defaultBrowser = false, popupOptions, actionsPosition, annotationMode, openLinksInNewTab, progressiveLoading = true, keyboardNav = false, rtlMode = "off", themeMode = "light", trackingEnabled = true, watermark } = attributes;
  const { enabled } = (popupOptions || {});
  const { position: socialPosition, enabled: socialEnabled } = (socialShare || {});

  const isRtl = rtlMode === "on" || (rtlMode === "auto" && !!(typeof pdfp !== "undefined" && pdfp?.is_rtl));

  const prefersDark = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [systemDark, setSystemDark] = useState(prefersDark);
  useEffect(() => {
    if (themeMode !== "auto" || typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange); };
  }, [themeMode]);
  const effectiveTheme = themeMode === "auto" ? (systemDark ? "dark" : "light") : themeMode;

  const [source, setSource] = useState("");
  const [gviewError, setGviewError] = useState(false);
  const ref = useRef();

  useEffect(() => {
    // Order matters: a site URL loses its scheme along with its host, so there is
    // nothing left for matchProtocol to patch; a remote URL stays absolute and still
    // gets the page's scheme.
    const normalize = (url) => matchProtocol(toSiteRelativeUrl(url));

    const verifyProtectedContent = async () => {
      let isProtected = false;
      // Protection logic removed

      if (!isProtected) {
        setSource(normalize(file));
      }
    };

    verifyProtectedContent();
  }, [file]);

  const [previewSrc, setPreviewSrc] = useState(null);

  // The default engine is an iframe, so the mark has to be drawn inside it -- the config
  // travels as one base64url param and custom.js hooks pagerendered. Same pattern as
  // rtl / theme / keyboardnav.
  const wmParam = encodeWatermarkParam(watermark);

  useEffect(() => {
    let iframeSrc = "";
    const showSidePanel = window.innerWidth >= 768 ? sidebarOpen : false;

    const getSafeEncodedUrl = (url) => {
      try {
        // Decode first to avoid double encoding, then encode
        return encodeURIComponent(decodeURIComponent(url));
      } catch (e) {
        return encodeURIComponent(url);
      }
    };
    


    const encodedSource = getSafeEncodedUrl(source);

    // Google fetches the PDF server-side, so that branch needs an absolute URL --
    // and resolving against the page gives the public host, which is the one Google
    // can actually reach.
    const absoluteSource = (() => {
      try {
        return new URL(source, window.location.href).href;
      } catch (e) {
        return source;
      }
    })();
    const gviewSrc = `//docs.google.com/gview?embedded=true&url=${getSafeEncodedUrl(absoluteSource)}`;

    const viewerBase = toSiteRelativeUrl(pdfp?.dir ?? "");

    if (isSiteLocalUrl(source) || gviewError) {
      if (isEdgeBrowser() && defaultBrowser && !gviewError) {
        iframeSrc = gviewSrc;
      } else {
        let zoom = "&z=auto";
        let proParams = "";
        // proParams removed

        // Free viewer options passed through to assets/pdfjs-new/web/custom.js.
        const freeParams = `&annotationMode=${annotationMode !== false ? "1" : "0"}&openLinksInNewTab=${openLinksInNewTab ? "1" : "0"}&progressive=${progressiveLoading !== false ? "1" : "0"}&keyboardnav=${keyboardNav ? "1" : "0"}&rtl=${isRtl ? "1" : "0"}&theme=${themeMode}&track=${!isBackend && trackingEnabled !== false ? "1" : "0"}${wmParam ? `&wm=${wmParam}` : ""}`;

        iframeSrc = `${viewerBase}assets/pdfjs-new/web/viewer.html?file=${encodedSource}${zoom}&nobaki=${!protect && downloadButton ? "vera" : "false"}&stdono=${print && !protect ? "vera" : "false"}&open=${showSidePanel}&onlypdf=${onlyPDF ? "vera" : "false"}${freeParams}${proParams}`;
      }
    } else if (source.includes(".google.com")) {
      iframeSrc = source;
    } else if (source) {
      // Fallback for other origin files - use Google Docs Viewer
      iframeSrc = gviewSrc;
    }
    setPreviewSrc(iframeSrc);
  }, [onlyPDF, thumbMenu, initialPage, protect, hrScroll, source, zoomLevel, print, downloadButton, sidebarOpen, isHideRightToolbar, gviewError, annotationMode, openLinksInNewTab, progressiveLoading, keyboardNav, isRtl, themeMode, trackingEnabled, isBackend, wmParam]);

  const requestedViewer = adobeEmbedder === true ? "adobe" : (adobeEmbedder === false ? "default" : (adobeEmbedder || "default"));

  // FlipBook and Slider are free, but they need dFlip on disk; Adobe and Scroll are
  // premium. A stored value we can't draw (a Pro export, or a package built without
  // the engine) would render an empty container, so fall back to the PDF.js viewer.
  // Mirrors the server-side clamp in PDFP_Functions::pdfp_resolve_viewer().
  const currentViewer = ["flipbook", "slider"].includes(requestedViewer) && hasFlipbookEngine()
    ? requestedViewer
    : "default";

  // Image-gallery flipbook can render without a PDF source, so it needs its own "has content" path.
  const fbImages = Array.isArray(attributes.flipbookImages) ? attributes.flipbookImages.filter(Boolean) : [];
  const useImagesFlipbook = ["flipbook", "slider"].includes(currentViewer) && attributes.flipbookSourceType === "images" && fbImages.length > 0;
  const hasContent = source || useImagesFlipbook;

  // Document Insights. Never in the editor: `isBackend` is already the flag that tells
  // the block preview and the metabox preview apart from a real visit, so previews are
  // excluded by construction rather than by a setting. `hasContent` gates the view so a
  // container still waiting on its file cannot count as read.
  const track = useTracking({
    enabled: !isBackend && trackingEnabled !== false,
    targetRef: ref,
    ready: !!hasContent,
  });

  // Which overlay strategy this engine allows -- decided for the user, not asked.
  // Settled by measuring each engine's real DOM:
  //   default   -> drawn inside its own iframe (see the &wm= param above)
  //   slider    -> dFlip builds measurable .df-page elements, so one mark per page
  //   flipbook  -> dFlip's 3D mode draws every page into a SINGLE canvas and its
  //                .df-page divs are 0x0, so per-page is impossible: container
  //   gview     -> cross-origin iframe we can't script into: container
  const isGview = typeof previewSrc === "string" && previewSrc.includes("google.com/gview");
  const isWatermarked = !!(watermark?.enabled && (watermark.apply || ["screen"]).includes("screen"));
  const wmMode = currentViewer === "slider"
    ? "dflip"
    : (currentViewer === "flipbook" || isGview) ? "container" : "iframe";

  const fullscreenPDF = () => {
    if (["flipbook", "slider"].includes(currentViewer)) {
      ref.current?.classList.add("pdfp_fullscreen_opened");
      return;
    }

    if (typeof ref.current?.querySelector(".iframe_wrapper").requestFullscreen === "function") {
      ref.current?.querySelector(".iframe_wrapper").requestFullscreen();
    } else {
      ref.current?.classList.add("pdfp_fullscreen_opened");
    }
  };

  const closeFullscreen = () => {
    ref.current?.classList.remove("pdfp_fullscreen_opened");
  };

  return (
    <div ref={ref} dir={isRtl ? "rtl" : undefined} data-pdfp-theme={effectiveTheme} data-pdfp-wm={isWatermarked ? "1" : undefined} className={`pdfp_wrapper pdfp_viewer_${currentViewer} ${additional?.Class} ${id} align-${align} ${enabled ? "pdfp_popup_enabled" : ""} ${protect ? "pdfp_protected" : ""} ${isRtl ? "pdfp_rtl" : ""} ${isWatermarked ? "pdfp_watermarked" : ""}`.trim()}>
      <Style attributes={attributes} id={id} />
      <div className="pdfp_fullscreen_overlay"></div>
      <div className="pdfp_fullscreen_close" onClick={closeFullscreen}>
        &times;
      </div>
      {hasContent && (
        <>
          <PopupTrigger popupOptions={popupOptions} fullscreenPDF={fullscreenPDF} />
          {socialEnabled && socialPosition === "top" && !enabled && <SocialShare attributes={attributes} />}
          {!enabled && <Header attributes={attributes} source={source} previewSrc={previewSrc} RichText={RichText} setAttributes={setAttributes} __={__} wrapper={ref.current} showTitle={true} showActions={actionsPosition === "top"} isImagesFlipbook={useImagesFlipbook} onTrack={track} />}

          {["flipbook", "slider"].includes(currentViewer) && <FlipbookViewer key={`${currentViewer}-${enabled ? 'popup' : 'normal'}-${isRtl ? 'rtl' : 'ltr'}-${effectiveTheme}-${useImagesFlipbook ? 'img' + fbImages.length : 'pdf'}`} attributes={attributes} source={source} viewerType={currentViewer} isRtl={isRtl} theme={effectiveTheme} />}

          {isWatermarked && wmMode !== "iframe" && <Watermark watermark={watermark} mode={wmMode} targetRef={ref} theme={effectiveTheme} />}

          {currentViewer === "default" && <PDFJSViewer source={previewSrc} attributes={attributes} setAttributes={setAttributes} __={__} wrapper={ref.current} isBackend={isBackend} isSelected={isSelected} onGViewError={() => setGviewError(true)} />}

          {!enabled && actionsPosition === "bottom" && <Header attributes={attributes} source={source} previewSrc={previewSrc} RichText={RichText} setAttributes={setAttributes} __={__} wrapper={ref.current} showTitle={false} showActions={true} isImagesFlipbook={useImagesFlipbook} onTrack={track} />}
          {socialEnabled && socialPosition === "bottom" && !enabled && <SocialShare attributes={attributes} />}
        </>
      )}
    </div>
  );
};

export default Viewer;
