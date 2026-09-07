import { useEffect } from "react";
import isiOSDevice from "../../../../hooks/utils/isiOSDevice";

export default function Header({ attributes, source, RichText, setAttributes, __, wrapper, previewSrc, showActions = true, showTitle = true, isImagesFlipbook = false, onTrack }) {
  const { downloadButton, protect, downloadButtonText, fullscreenButton, fullscreenButtonText, showName, titleFontSize, title, adobeEmbedder, newWindow, actionsPosition } = attributes;

  useEffect(() => { }, []);

  const normalizedViewer = adobeEmbedder === true ? "adobe" : (adobeEmbedder === false ? "default" : adobeEmbedder || "default"); 
  

  const manageDownload = (e) => {
    onTrack?.("fullscreen");

    // Premium "open in new tab": let the anchor navigate.
    if (e.currentTarget.target !== "_self") {
      return;
    }

    e.preventDefault();

    // Both dFlip-backed viewers own their fullscreen: the engine re-lays out the book
    // for the new viewport, which requestFullscreen() on the wrapper cannot do -- that
    // just stretches the box and leaves the book at its inline size. FlipbookViewer
    // puts the close (x) control inside dFlip's fullscreen container.
    if (["flipbook", "slider"].includes(normalizedViewer)) {
      window.dispatchEvent(new CustomEvent("PDFP_TOGGLE_FLIPBOOK_FULLSCREEN", { detail: { wrapper } }));
      return;
    }

    const iframeWrapper = wrapper?.querySelector(".iframe_wrapper");

    if (typeof iframeWrapper?.requestFullscreen === "function") {
      // A browser can still refuse the request (an editor canvas iframe without the
      // fullscreen permission, for one), so keep the CSS fullscreen as the fallback.
      Promise.resolve(iframeWrapper.requestFullscreen()).catch(() => {
        wrapper?.classList.add("pdfp_fullscreen_opened");
      });
    } else if (isiOSDevice() && !isImagesFlipbook && source) {
      // iOS Safari has no Element.requestFullscreen, so the file itself is the fallback.
      window.open(source, "_blank", "noreferrer");
    } else {
      // An image-gallery flipbook has no file to open, so use the CSS fullscreen the
      // wrapper already styles (overlay + .pdfp_fullscreen_close).
      wrapper?.classList.add("pdfp_fullscreen_opened");
    }
  };

  return (
    <>
      {normalizedViewer !== "adobe" && (
        <div className={`pdfp_header pdfp_header_${actionsPosition}`}>
          {showName && showTitle && <RichText tagName="p" value={title} allowedFormats={[]} style={{ fontSize: titleFontSize, margin: "20px" }} onChange={(title) => setAttributes({ title })} placeholder={__("Title", "pdfp")} />}
          {((downloadButton && !isImagesFlipbook) || fullscreenButton) && !protect && showActions && (
            <div className="cta_wrapper">

              {/* An image-gallery flipbook has no PDF behind it -- `source` still holds
                  whatever file was picked earlier, so offering it would download the
                  wrong document. dFlip hides its own download control the same way. */}
              {downloadButton && !protect && !isImagesFlipbook && (
                <a
                  className="pdfp_download pdfp_download_btn button"
                  download
                  target="blank"
                  href={source}
                  rel="noreferrer"
                  // Reported, not intercepted: the anchor keeps its native behaviour and
                  // the event is flushed immediately, because a download can unload the
                  // page before the queue's normal pagehide flush would fire.
                  onClick={() => onTrack?.("download")}
                >
                  {(() => {
                    let label = "Download File"; 
                    label = downloadButtonText; 
                    return label;
                  })()}
                </a>
              )}

              {fullscreenButton && !protect && (
                <a 
                  className="button" 
                  href={isImagesFlipbook ? "#" : (normalizedViewer === "flipbook" ? source : previewSrc)}
                  rel="noreferrer" 
                  onClick={manageDownload} 
                  target={(() => {
                    let target = "_self";
                    target = newWindow ? "blank" : "_self";
                    return target;
                  })()}
                >
                  {(() => {
                    let label = "View Fullscreen";
                    label = fullscreenButtonText; 
                    return label;
                  })()}
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
