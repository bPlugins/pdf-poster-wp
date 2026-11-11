import { Button, Notice as WPNotice, PanelBody, SelectControl, Spinner, TextControl } from "@wordpress/components";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { __, sprintf } from "@wordpress/i18n";
import { Notice } from "../../../../../../../bpl-tools/Components";
import { PDFIcon } from "../../../../../icons/PDF";
import { PanelNewBadge } from "../../../../../Components/NewBadge";
import useCoverState from "../../../../../hooks/useCoverState";

const ERRORS = {
    unreadable: __("This PDF could not be read from the browser.", "pdf-poster"),
    password: __("This PDF is password protected.", "pdf-poster"),
    invalid: __("This file does not look like a valid PDF.", "pdf-poster"),
    timeout: __("Reading this PDF took too long.", "pdf-poster"),
    failed: __("The cover could not be made.", "pdf-poster"),
};

/**
 * Auto Thumbnail. Sits right under Viewer: "Cover first" is a choice about how the
 * viewer appears, and the cover itself belongs to the PDF picked there.
 */
const Cover = ({ attributes, setAttributes }) => {
    const { coverFirst = "default", coverButtonText = "", fileId = 0, protect, popupOptions } = attributes;
    const store = typeof window !== "undefined" ? window.pdfpCover : null;
    const config = (typeof window !== "undefined" && window.pdfpCoverConfig) || {};
    const state = useCoverState(fileId);

    const siteDefault = config.coverFirstDefault ? __("On", "pdf-poster") : __("Off", "pdf-poster");
    const mode = coverFirst === true ? "on" : coverFirst === false ? "off" : coverFirst;
    const effectiveOn = mode === "on" || (mode === "default" && !!config.coverFirstDefault);

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Cover", "pdf-poster")} <PanelNewBadge /></div>} initialOpen={false}>

            {protect && (
                <WPNotice status="warning" isDismissible={false} className="mt10">
                    {__("Covers are not shown while Protect Content is on, so page 1 never becomes a public image.", "pdf-poster")}
                </WPNotice>
            )}

            <SelectControl
                className="mt10"
                label={__("Cover first", "pdf-poster")}
                value={mode}
                disabled={!!protect || !!popupOptions?.enabled}
                onChange={(value) => setAttributes({ coverFirst: value })}
                options={[
                    { label: sprintf(__("Site default (%s)", "pdf-poster"), siteDefault), value: "default" },
                    { label: __("On", "pdf-poster"), value: "on" },
                    { label: __("Off", "pdf-poster"), value: "off" },
                ]}
                help={popupOptions?.enabled
                    ? __("The popup already shows a trigger instead of the viewer.", "pdf-poster")
                    : __("Show the PDF's cover with an Open button. The viewer and the PDF load only when it is clicked — in every viewer type.", "pdf-poster")}
            />

            {effectiveOn && !protect && !popupOptions?.enabled && (
                <TextControl
                    className="mt10"
                    label={__("Button text", "pdf-poster")}
                    value={coverButtonText}
                    placeholder={__("Open document", "pdf-poster")}
                    onChange={(value) => setAttributes({ coverButtonText: value })}
                />
            )}

            <div className="pdfp-cover-panel mt10">
                {!fileId && (
                    <p className="pdfp-cover-panel__help">
                        {__("Covers are made for PDFs from your Media Library. Files from other sites show a plain PDF card instead.", "pdf-poster")}
                    </p>
                )}

                {!!fileId && !store && (
                    <p className="pdfp-cover-panel__help">{__("Cover tools are not available on this screen.", "pdf-poster")}</p>
                )}

                {!!fileId && store && (
                    <>
                        <div className="pdfp-cover-panel__row">
                            <div className="pdfp-cover-panel__thumb">
                                {state?.thumb ? <img src={state.thumb} alt="" /> : state?.making ? <Spinner /> : <span>PDF</span>}
                            </div>
                            <div className="pdfp-cover-panel__status">
                                {!state && <span>{__("Checking…", "pdf-poster")}</span>}
                                {state?.making && <span>{__("Making cover…", "pdf-poster")}</span>}
                                {state && !state.making && state.cover && (
                                    <span>{state.auto
                                        ? sprintf(__("Made automatically from page %d", "pdf-poster"), state.page || 1)
                                        : __("Chosen by you", "pdf-poster")}</span>
                                )}
                                {state && !state.making && !state.cover && state.removed && <span>{__("Removed. No cover is made for this PDF.", "pdf-poster")}</span>}
                                {state && !state.making && !state.cover && !state.removed && state.error && <span className="pdfp-cover-panel__error">{ERRORS[state.error] || ERRORS.failed}</span>}
                                {state && !state.making && !state.cover && !state.removed && !state.error && !config.auto && <span>{__("No cover yet.", "pdf-poster")}</span>}
                            </div>
                        </div>

                        <div className="pdfp-cover-panel__actions">
                            <Button variant="secondary" size="small" disabled={!state || state.making} onClick={() => store.generate(fileId, { force: true })}>
                                {state?.cover ? __("Regenerate", "pdf-poster") : __("Make cover", "pdf-poster")}
                            </Button>
                            <MediaUploadCheck>
                                <MediaUpload
                                    allowedTypes={["image"]}
                                    onSelect={(media) => media?.id && store.replace(fileId, media.id)}
                                    render={({ open }) => (
                                        <Button variant="secondary" size="small" disabled={!state || state.making} onClick={open}>{__("Replace", "pdf-poster")}</Button>
                                    )}
                                />
                            </MediaUploadCheck>
                            {state?.cover && (
                                <Button variant="link" isDestructive size="small" onClick={() => store.remove(fileId)}>{__("Remove", "pdf-poster")}</Button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Cover design is Pro -- named here rather than shown as controls, the same
                way the Watermark panel names its Pro half. */}
            <Notice status='premium' isIcon={true}>
                {__('Unlock cover design: style every cover at once or one block at a time — background, box height, image fit, width, corners and shadow, plus the Open button\'s position, colors, hover colors, font size, radius and padding. Choose which page becomes the cover, the image size, and WebP covers—available exclusively in Premium.', 'pdf-poster')}
            </Notice>
        </PanelBody>
    );
};

export default Cover;
