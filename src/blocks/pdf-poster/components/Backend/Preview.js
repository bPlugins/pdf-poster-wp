import { Fragment, useMemo, useEffect, useRef, useState } from "react";
import { RichText } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import SocialShare from "../Common/SocialShare";
import safeFileUrl, { isGoogleViewerUrl, GOOGLE_VIEWER_SANDBOX } from "../../../../hooks/utils/safeFileUrl";

const Preview = ({ attributes, setAttributes, isSelected, isPreset = false, id }) => {
  const exampleFile = "http://localhost/freemius/wp-content/uploads/2022/02/temp.pdf";
  const {
    file: rawFile = pdfp?.placeholder || exampleFile,
    title,
    titleFontSize,
    height,
    width,
    showName,
    print,
    onlyPDF,
    downloadButton,
    downloadButtonText,
    fullscreenButton,
    fullscreenButtonText,
    protect,
    thumbMenu,
    hrScroll,
    initialPage,
    zoomLevel,
    additional,
    adobeEmbedder,
    adobeOptions,
    align,
    popupBtnStyle,
    CSS,
    popupBtnText,
    socialShare,
  } = attributes;

  const { enabled: socialEnabled, position: socialPosition } = socialShare || {};

  // Author input: only http(s) may reach the iframe src or the download href.
  const file = safeFileUrl(rawFile);

  const adobeRef = useRef();
  const [previewSrc, setPreviewSrc] = useState(null);

  const protectedOption = useMemo(() => {
    return {
      showPrintPDF: false,
      showDownloadPDF: false,
      showAnnotationTools: false,
      embedMode: adobeOptions.embedMode,
    };
  }, []);

  useEffect(() => {
    if (!adobeEmbedder && adobeRef.current) {
      adobeRef.current.innerHTML = "";
    }

    if (adobeRef?.current && adobeOptions.embedMode != "LIGHT_BOX") {
      renderPDF(protect ? protectedOption : adobeOptions);
    }
  }, [adobeOptions, adobeEmbedder, file, protect]);

  useEffect(() => {
    if (document.getElementById(id)) {
      document.getElementById(id).style.height = height.desktop || height;
    }
  }, [adobeOptions.embedMode]);

  const renderPDF = (options) => {
    if (typeof AdobeDC != "undefined") {
      var adobeDCView = new AdobeDC.View({
        clientId: fpdfAdmin?.adobeClientKey,
        divId: id,
      });
      adobeDCView.previewFile(
        {
          content: { location: { url: file } },
          metaData: { fileName: title || " " },
        },
        options
      );
    }
  };

  useEffect(() => {
    let source = "";
    if (file.includes(window.location.origin)) {
      let zoom = "&z=auto";
      if (zoomLevel) {
        zoom = `&z=${zoomLevel / 100}`;
      }
      source = `${pdfp?.dir}assets/pdfjs-new/web/viewer.html?file=${file}${zoom}&raw=${onlyPDF ? "1" : ""}&nobaki=${!protect && downloadButton ? "vera" : "false"}&stdono=${print && !protect ? "vera" : "false"}&open=false&onlypdf=${onlyPDF ? "vera" : "false"}&hrscroll=${hrScroll ? "vera" : "false"
        }&side=${thumbMenu}#page=${initialPage}`;
    } else if (isGoogleViewerUrl(file)) {
      source = file;
    }
    setPreviewSrc(source);
  }, [onlyPDF, thumbMenu, initialPage, protect, hrScroll, file, zoomLevel]);

  useEffect(() => {
    let CSS = `.${id}btn {background: ${popupBtnStyle?.background}; color: ${popupBtnStyle?.color}; padding: ${popupBtnStyle?.padding?.top}px ${popupBtnStyle?.padding?.right}px ${popupBtnStyle?.padding?.bottom}px ${popupBtnStyle?.padding?.left}px}`;
    setAttributes({ CSS });
  }, [popupBtnStyle, id, height]);

  const normalizedViewer = adobeEmbedder === true ? "adobe" : (adobeEmbedder === false ? "default" : adobeEmbedder);

  return (
    <div>
      {normalizedViewer === "adobe" ? (
        <>
          {fpdfAdmin?.adobeClientKey ? (
            <div
              className="pdfp_editor_wrapper pdfp_wrapper"
              ref={adobeRef}
              style={{
                width: `${adobeOptions?.embedMode === "LIGHT_BOX" ? "fit-content" : width} `,
              }}
              data-align={align}
            >
              {!isSelected ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    minHeight: "400px",
                  }}
                ></div>
              ) : (
                ""
              )}
              {adobeOptions?.embedMode === "LIGHT_BOX" ? (
                <>
                  <style>{CSS}</style>
                  <button
                    className={`${id}btn`}
                    onClick={() => {
                      !isPreset && renderPDF(protect ? protectedOption : adobeOptions);
                    }}
                  >
                    {popupBtnText || file?.split(".").slice(0, -1).join(".")}
                  </button>
                </>
              ) : (
                <div id={id} style={{ height }}></div>
              )}
            </div>
          ) : (
            <div style={{ padding: "20px", border: "1px solid #ddd" }}>
              <h2>{__("Adobe Client Key Required to use Adobe Embedder", "pdf-poster")}</h2>

              <a className="button button-primary" target="_blank" rel="noreferrer" href={`${pdfp?.siteUrl}/wp-admin/edit.php?post_type=pdfposter&page=fpdf-settings#tab=cloud-api`}>
                {__("Generate Client key", "pdf-poster")}
              </a>
            </div>
          )}
        </>
      ) : (
        <>
          <div className={`pdfp_wrapper ${isSelected && "pdfp_editor_wrapper"} ${additional.Class}`} style={{ width }}>
            {socialEnabled && socialPosition === "top" && <SocialShare attributes={attributes} />}
            {showName && !isPreset && <RichText tagName="p" value={title} allowedFormats={[]} style={{ fontSize: titleFontSize, margin: "20px" }} onChange={(title) => setAttributes({ title })} placeholder={__("Title", "pdf-poster")} />}

            {file.includes("dropbox.com") ? (
              <div style={{ border: "2px solid #ddd" }}>
                <p>{file}</p>
                <p>{__("Preview is not available for dropbox", "pdf-poster")}</p>
              </div>
            ) : (
              <Fragment>
                <div className="cta_wrapper">
                  {downloadButton && !protect && (
                    <a className="pdfp_download" onClick={(e) => e.preventDefault()} download href={file}>
                      <button className="pdfp_download_btn">{downloadButtonText}</button>
                    </a>
                  )}

                  {fullscreenButton && !protect && (
                    <a href={previewSrc} rel="noreferrer" onClick={(e) => e.preventDefault()} target="_blank">
                      <button>{fullscreenButtonText}</button>
                    </a>
                  )}
                </div>

                <div className="iframe_wrapper">
                  <div className="pdfp_frame_overlay"></div>
                  <iframe className="pdfp_iframe" height={height.desktop || height} style={{ height: height.desktop || height }} src={previewSrc} sandbox={isGoogleViewerUrl(previewSrc) ? GOOGLE_VIEWER_SANDBOX : undefined}></iframe>
                </div>
              </Fragment>
            )}
            {socialEnabled && socialPosition === "bottom" && <SocialShare attributes={attributes} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Preview;
