import { Button, PanelBody, PanelRow, SelectControl, TextControl } from "@wordpress/components";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Notice, Label } from "../../../../../../../bpl-tools/Components";
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
        { label: __("Default", "pdf-poster"), value: "default" }, 
    ];

    if (flipbookAvailable) {
        viewerOptions.push(
            // "(New)" in the text, not a chip: these are <option> elements in a native
            // select, which renders no markup. The metabox marks the same two entries
            // with pdfp_new_badge(), where markup is possible.
            { label: __("FlipBook (New)", "pdf-poster"), value: "flipbook" },
            { label: __("Slider (New)", "pdf-poster"), value: "slider" },
        );
    } 

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Viewers", "pdf-poster")} <PanelNewBadge /></div>} initialOpen={true}>

            <SelectControl
                className="mt10"
                label={__("Viewer", "pdf-poster")}
                help={__("Select the PDF viewer engine.", "pdf-poster")}
                value={selectedViewer}
                options={viewerOptions}
                onChange={(v) => {
                     setAttributes({ adobeEmbedder: v });
                }}
            />

            {/* Source fields sit beside the engine picker, mirroring the metabox General
                section order: Viewer -> PDF Source -> Flipbook Source -> Flipbook Pages. */}
            {/* Mirrors bpl-tools' InlineMediaUpload, which hands back only the URL. render.php
                resolves the file from fileId before the URL, so a stale id left behind here
                keeps serving the previous PDF on the front end. Picking from the library
                records the new id; a typed URL has no attachment, so the id is cleared. */}
            <div className="mt10">
                <Label className="mb5">{__("Upload PDF", "pdf-poster")}</Label>
                <PanelRow className="bPlInlineMediaUpload">
                    <TextControl value={file} onChange={(url) => setAttributes({ file: url, fileId: 0 })} placeholder={__("Upload PDF", "pdf-poster")} />
                    <MediaUpload
                        allowedTypes={["application/pdf"]}
                        onSelect={(media) => setAttributes({ file: media.url, fileId: media.id || 0 })}
                        render={({ open }) => <Button className="button button-primary" onClick={open} label={__("Upload PDF", "pdf-poster")}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M7.4,10h1.59v5c0,0.55,0.45,1,1,1h4c0.55,0,1-0.45,1-1v-5h1.59c0.89,0,1.34-1.08,0.71-1.71L12.7,3.7 c-0.39-0.39-1.02-0.39-1.41,0L6.7,8.29C6.07,8.92,6.51,10,7.4,10z M5,19c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1s-0.45-1-1-1H6 C5.45,18,5,18.45,5,19z" />
                            </svg>
                        </Button>}
                    />
                </PanelRow>
            </div>

            {isFlipbookEngine && (
                <>
                    <SelectControl className="mt10" label={__("Flipbook Source", "pdf-poster")} value={flipbookSourceType} options={[
                        { label: __("PDF File", "pdf-poster"), value: "pdf" },
                        { label: __("Image Gallery", "pdf-poster"), value: "images" },
                    ]} onChange={(flipbookSourceType) => setAttributes({ flipbookSourceType })} help={__("Build the flipbook from a PDF file or from an ordered set of images.", "pdf-poster")} />

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
                                                {flipbookImages.length ? `${__("Edit Images", "pdf-poster")} (${flipbookImages.length})` : __("Select Images", "pdf-poster")}
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
                                            {__("Clear images", "pdf-poster")}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </PanelRow>
                    )}
                </>
            )}

            <Notice status='premium' isIcon={true}>
                {__('The Adobe Viewer and Continuous Scroll engines above are Premium. Premium also adds PDF import straight from Google Drive and Dropbox.', "pdf-poster")}
            </Notice>
        </PanelBody>
    )
}


export default Viewers
