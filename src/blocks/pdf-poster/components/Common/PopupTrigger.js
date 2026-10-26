import { useEffect, useRef } from "react";
import PDF from "../../../../icons/PDF";

// How long the pointer has to rest on a trigger before its document starts loading.
// Long enough that sweeping across a row of popup buttons loads none of them, short
// enough that it still starts well before the click.
const HOVER_INTENT_MS = 150;

const PopupTrigger = ({ popupOptions, fullscreenPDF, onPreload }) => {
    const { enabled, text, triggerType, image, imagePdfIcon } = popupOptions;
    const hoverTimer = useRef(null);

    useEffect(() => () => clearTimeout(hoverTimer.current), []);

    if (!enabled) return null;

    // The viewer is not loaded until its popup is wanted. A resting pointer, keyboard
    // focus and the start of a tap all come just before the click, so they start it a
    // moment early. Focus and touch are deliberate, so they do not wait.
    const preloadProps = onPreload ? {
        onMouseEnter: () => {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = setTimeout(onPreload, HOVER_INTENT_MS);
        },
        onMouseLeave: () => clearTimeout(hoverTimer.current),
        onFocus: onPreload,
        onTouchStart: onPreload,
    } : {};

    return (
        <div className={`popup-trigger ${triggerType === "image" ? "popup-trigger-image" : "popup-trigger-button"}`}>
            {triggerType === "button" && (
                <button className="popup-btn" onClick={fullscreenPDF} {...preloadProps}>
                    {text}
                </button>
            )}
            {triggerType === "image" && (
                <div className="popup-trigger-image" {...preloadProps}>
                    {imagePdfIcon && <PDF width="30px" height="30px" />}
                    {image ? <img src={image} alt={text || 'View PDF'} onClick={fullscreenPDF} /> : <div className="popup-trigger-text" onClick={fullscreenPDF}>{text || 'View PDF'}</div>}
                </div>
            )}
        </div>
    );
};

export default PopupTrigger;
