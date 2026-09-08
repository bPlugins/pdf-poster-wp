import { PanelBody, ToggleControl, TextControl } from "@wordpress/components";
import { Notice } from "../../../../../../../bpl-tools/Components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";

const Actions = ({ setAttributes, attributes }) => {
    const { protect, downloadButton, print, fullscreenButtonText, fullscreenButton, adobeEmbedder } = attributes;

    const normalizedViewer = adobeEmbedder === true ? "adobe" : (adobeEmbedder === false ? "default" : adobeEmbedder);

    // Mirrors Viewer's `useImagesFlipbook`. In that state the pages are images, there is no
    // file behind them, and Header suppresses the Download button -- so the toggle and its
    // label would have no effect and are hidden rather than left as dead controls.
    const fbImages = Array.isArray(attributes.flipbookImages) ? attributes.flipbookImages.filter(Boolean) : [];
    const useImagesFlipbook = ["flipbook", "slider", "scroll"].includes(normalizedViewer)
        && attributes.flipbookSourceType === "images"
        && fbImages.length > 0;

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Actions", "pdfp")}</div>} initialOpen={false}>
            {!protect && (
                <>
                    <ToggleControl className="mt10" label={__("Allow Printing", "pdfp")} id="print" checked={print} onChange={() => setAttributes({ print: !print })} help={__("Allow visitors to print the PDF document.", "pdfp")} />

                    {!useImagesFlipbook && (
                        <ToggleControl className="mt10" label={__("Download Button", "pdfp")} id="downloadButton" checked={downloadButton} onChange={() => setAttributes({ downloadButton: !downloadButton })} help={__("Display a download button at the top of the viewer.", "pdfp")} />
                    )}
                </>
            )}

            {!protect && (
                <>
                    <ToggleControl className="mt10" label={__("Fullscreen Button", "pdfp")} id="fullscreenButton" checked={fullscreenButton} onChange={() => setAttributes({ fullscreenButton: !fullscreenButton })} help={__("Display a fullscreen toggle button at the top of the viewer.", "pdfp")} />

                    {fullscreenButton && (
                        <TextControl className="mt10" label={__("Fullscreen Label", "pdfp")} help={__("Customize the text for the fullscreen button.", "pdfp")} value={fullscreenButtonText} onChange={(fullscreenButtonText) => setAttributes({ fullscreenButtonText })} />
                    )}
                </>
            )}

            <Notice status='premium' isIcon={true}>
                {__('Unlock a custom Download Button label, opening the fullscreen view in a new tab, and moving the action buttons to the bottom of the viewer—available exclusively in Premium.', 'pdfp')}
            </Notice>
        </PanelBody>
    )
}

export default Actions
