import { PanelBody, SelectControl, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { ToggleControl, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";
import { InlineMediaUpload } from "../../../../../../../bpl-tools/Components/MediaControl/MediaControl";
import Label from "../../../../../../../bpl-tools/Components/Label/Label";

const Popup = ({ attributes, updatePopupOptions }) => {
    const { popupOptions } = attributes;
    // triggerAlignment defaults here as well as in block.json: a block saved before the
    // attribute existed carries a popupOptions object without it, and object defaults are
    // not deep-merged, so the saved object wins and the key stays undefined.
    const { enabled, text, triggerType, image, imagePdfIcon, imageHeight, imageWidth, triggerAlignment = "center" } = popupOptions;

    return (
        <PanelBody
            className="bPlPanelBody"
            title={<div className="pdfp-panel-icon">{PDFIcon} {__("Popup", "pdf-poster")}</div>} initialOpen={false}>
            <ToggleControl className="mt10" label={__("Enable Popup", "pdf-poster")} id="popupOptions.enabled" checked={enabled} onChange={(value) => updatePopupOptions("enabled", value)} help={__("Open the PDF document in a modal popup.", "pdf-poster")} />

            {enabled && <>

                {/* trigger type - image/button */}
                <SelectControl className="mt10" label={__("Trigger Type", "pdf-poster")} value={triggerType} onChange={(value) => updatePopupOptions("triggerType", value)} help={__("Select the trigger type for the popup.", "pdf-poster")} options={[
                    { label: __("Button", "pdf-poster"), value: "button" },
                    { label: __("Image", "pdf-poster"), value: "image" }
                ]} />

                {/* Alignment */}
                <SelectControl className="mt10" label={__("Alignment", "pdf-poster")} value={triggerAlignment} onChange={(value) => updatePopupOptions("triggerAlignment", value)} help={__("Select the alignment for the popup trigger.", "pdf-poster")} options={[
                    { label: __("Left", "pdf-poster"), value: "left" },
                    { label: __("Center", "pdf-poster"), value: "center" },
                    { label: __("Right", "pdf-poster"), value: "right" }
                ]} />

                {triggerType === 'image' && <>
                    <InlineMediaUpload value={image} onChange={(value) => updatePopupOptions("image", value)} label={__("Image", "pdf-poster")} help={__("Select an image to use as the popup trigger.", "pdf-poster")} />

                    <UnitControl
                        label={<Label className="gap5">{__("Image Height", "pdf-poster")} </Label>}
                        labelPosition="top"
                        className="mb10"
                        onChange={(value) => updatePopupOptions("imageHeight", value)}
                        value={imageHeight}
                        units={[
                            { value: "px", label: "px", default: 200 },
                            { value: "%", label: "%", default: 100 },
                            { value: "vh", label: "vh", default: 100 },
                        ]}
                        isResetValueOnUnitChange={true}
                        help={__("Set the height for the trigger image.", "pdf-poster")}
                    />

                    <UnitControl
                        className="mt10"
                        label={<Label className="gap5">{__("Image Width", "pdf-poster")}  </Label>}
                        labelPosition="top"
                        onChange={(value) => updatePopupOptions("imageWidth", value)}
                        value={imageWidth}
                        units={[
                            { value: "px", label: "px", default: 300 },
                            { value: "%", label: "%", default: 100 },
                            { value: "vw", label: "vw", default: 100 },
                        ]}
                        isResetValueOnUnitChange={true}
                        help={__("Set the width for the trigger image.", "pdf-poster")}
                    />

                    <ToggleControl className="mt10" label={__("Enable PDF Icon", "pdf-poster")} id="popupOptions.imagePdfIcon" checked={imagePdfIcon} onChange={(value) => updatePopupOptions("imagePdfIcon", value)} help={__("Show a PDF icon over the trigger image.", "pdf-poster")} />
                </>}

                {triggerType === "button" && <TextControl value={text} onChange={(text) => updatePopupOptions("text", text)} placeholder="Open PDF" label={__("Button Text", "pdf-poster")} help={__("Customize the text for the popup trigger button.", "pdf-poster")} />}

            </>}

        </PanelBody>
    )
}

export default Popup;
