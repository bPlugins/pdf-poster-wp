import PDF from "../../../../icons/PDF";

const PopupTrigger = ({ popupOptions, fullscreenPDF, onPreload }) => {
    const { enabled, text, triggerType, image, imagePdfIcon } = popupOptions;

    if (!enabled) return null;

    // The viewer is not loaded until its popup is wanted. Hover, keyboard focus and the
    // start of a tap all come just before the click, so they start it a moment early.
    const preloadProps = onPreload ? { onMouseEnter: onPreload, onFocus: onPreload, onTouchStart: onPreload } : {};

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
