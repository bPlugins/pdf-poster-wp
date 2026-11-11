import { useEffect, useState } from "react";
import useCoverState from "../../../../hooks/useCoverState";
import { coverBoxProps } from "./coverStyle";

/**
 * Auto Thumbnail -- "Cover first".
 *
 * Stands in for EVERY engine (Default, Adobe, FlipBook, Scroll, Slider) until the
 * visitor asks for the document: Viewer.js mounts nothing else and fetches nothing while
 * this is showing, so the page has paid for one image. The markup matches what
 * render.php printed before this script ran (PDFP_Cover::markup), so hydrating it does
 * not flash. Its look is the standard one in coverStyle.js.
 *
 * Front end: the cover comes in the attributes, resolved by render.php.
 * Block editor: there is no render.php, so it asks the admin cover store
 * (assets/admin/js/auto-thumbnail.js), which also makes the cover if it is missing.
 */
const CoverPoster = ({ attributes, isBackend = false, onOpen, __ }) => {
  const { cover: serverCover, title = "", coverButtonText = "", file = "", fileId = 0 } = attributes;
  const editorState = useCoverState(isBackend ? fileId : 0);
  const cover = isBackend ? editorState?.cover || null : serverCover;
  const making = isBackend && editorState?.making;

  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [cover?.src]);

  const text = coverButtonText || __("Open document", "pdf-poster");
  const name = title || decodeURIComponent((file.split("?")[0].split("/").pop() || "").replace(/\.pdf$/i, ""));
  // Every cover uses the standard look (designing it is a Pro feature), so a design
  // stored by a Pro install is ignored here exactly as render.php ignores it.
  const { className, style, showButton } = coverBoxProps({ ...attributes, coverStyle: {} });

  return (
    <div className={className} style={style}>
      <button type="button" className="pdfp_cover_open" aria-label={`${text} ${title}`.trim()} onClick={onOpen}>
        <span className="pdfp_cover_media">
          {cover?.src && !failed ? (
            <img
              className="pdfp_cover_img"
              src={cover.src}
              srcSet={cover.srcset || undefined}
              sizes={cover.sizes || undefined}
              width={cover.width || undefined}
              height={cover.height || undefined}
              alt={cover.alt || ""}
              decoding="async"
              onError={() => setFailed(true)}
            />
          ) : (
            <span className="pdfp_cover_fallback">
              <span className="pdfp_cover_doc" aria-hidden="true">PDF</span>
              <span className="pdfp_cover_name">{making ? __("Making cover…", "pdf-poster") : name}</span>
            </span>
          )}
        </span>
        {showButton && <span className="pdfp_cover_btn">{text}</span>}
      </button>
    </div>
  );
};

export default CoverPoster;
