import PDF from "../../../../icons/PDF";

const PopupTrigger = ({ popupOptions, fullscreenPDF }) => {
    const { enabled, text, triggerType, image, imagePdfIcon } = popupOptions;

    if (!enabled) return null;

    return (
        <div className={`popup-trigger ${triggerType === "image" ? "popup-trigger-image" : "popup-trigger-button"}`}>
            {triggerType === "button" && (
                <button className="popup-btn" onClick={fullscreenPDF}>
                    {text}
                </button>
            )}
            {triggerType === "image" && (
                <div className="popup-trigger-image" >
                    {imagePdfIcon && <PDF width="30px" height="30px" />}
                    {image ? <img src={image} alt={text || 'View PDF'} onClick={fullscreenPDF} /> : <div className="popup-trigger-text" onClick={fullscreenPDF}>{text || 'View PDF'}</div>}
                </div>
            )}
        </div>
    );
};

export default PopupTrigger;