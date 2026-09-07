import { Button, PanelBody, PanelRow, SelectControl } from "@wordpress/components";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Notice, InlineMediaUpload } from "../../../../../../../bpl-tools/Components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";
import { hasFlipbookEngine } from "../../../utils";
import { PanelNewBadge } from "../../../../../Components/NewBadge";

// Adobe needs the premium PDF Embed bridge and Scroll is premium-only. Both stay listed
// so they keep selling, but picking one opens the upgrade modal instead of storing a
// value that would render an empty container. 

const Viewers = ({ setAttributes, attributes }) => {
    const { file, adobeEmbedder, flipbookSourceType = "pdf", flipbookImages = [] } = attributes;
    const requestedViewer = adobeEmbedder === true ? "adobe" : (adobeEmbedder === false ? "default" : (adobeEmbedder || "default"));

    // FlipBook and Slider are free, but they render through dFlip. Only offer engines
    // this build can actually draw, and show Default as selected for anything else.
    const flipbookAvailable = hasFlipbookEngine();
    const isFlipbookEngine = ["flipbook", "slider"].includes(requestedViewer) && flipbookAvailable;
    const selectedViewer = isFlipbookEngine ? requestedViewer : "default";

    const viewerOptions = [
        { label: __("Default", "pdfp"), value: "default" }, 
    ];

    if (flipbookAvailable) {
        viewerOptions.push(
            // "(New)" in the text, not a chip: these are <option> elements in a native
            // select, which renders no markup. The metabox marks the same two entries
            // with pdfp_new_badge(), where markup is possible.
            { label: __("FlipBook (New)", "pdfp"), value: "flipbook" },
            { label: __("Slider (New)", "pdfp"), value: "slider" },
        );
    } 

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Viewers", "pdfp")} <PanelNewBadge /></div>} initialOpen={true}>

            <SelectControl
                className="mt10"
                label={__("Viewer", "pdfp")}
                help={__("Select the PDF viewer engine.", "pdfp")}
                value={selectedViewer}
                options={viewerOptions}
                onChange={(v) => {
                     setAttributes({ adobeEmbedder: v });
                }}
            />

            {/* Source fields sit beside the engine picker, mirroring the metabox General
                section order: Viewer -> PDF Source -> Flipbook Source -> Flipbook Pages. */}
            <InlineMediaUpload className="mt10" label={__("Upload PDF", "pdfp")} types={["application/pdf"]} onChange={(file) => setAttributes({ file })} value={file} placeholder={__("Upload PDF", "pdfp")} />

            {isFlipbookEngine && (
                <>
                    <SelectControl className="mt10" label={__("Flipbook Source", "pdfp")} value={flipbookSourceType} options={[
                        { label: __("PDF File", "pdfp"), value: "pdf" },
                        { label: __("Image Gallery", "pdfp"), value: "images" },
                    ]} onChange={(flipbookSourceType) => setAttributes({ flipbookSourceType })} help={__("Build the flipbook from a PDF file or from an ordered set of images.", "pdfp")} />

                    {flipbookSourceType === "images" && (
                        <PanelRow>
                            <div style={{ width: "100%" }}>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        multiple
                                        gallery
                                        allowedTypes={["image"]}
                                        onSelect={(imgs) => setAttributes({ flipbookImages: (imgs || []).map((img) => img.url).filter(Boolean) })}
                                        render={({ open }) => (
                                            <Button variant="secondary" onClick={open}>
                                                {flipbookImages.length ? `${__("Edit Images", "pdfp")} (${flipbookImages.length})` : __("Select Images", "pdfp")}
                                            </Button>
                                        )}
                                    />
                                </MediaUploadCheck>
                                {flipbookImages.length > 0 && (
                                    <>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                            {flipbookImages.map((url, i) => (
                                                <img key={i} src={url} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "2px" }} />
                                            ))}
                                        </div>
                                        <Button variant="link" isDestructive onClick={() => setAttributes({ flipbookImages: [] })}>
                                            {__("Clear images", "pdfp")}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </PanelRow>
                    )}
                </>
            )}

            <Notice status='premium' isIcon={true}>
                {__('The Adobe Viewer and Continuous Scroll engines above are Premium. Premium also adds PDF import straight from Google Drive and Dropbox.', 'pdfp')}
            </Notice>
        </PanelBody>
    )
}


export default Viewers
