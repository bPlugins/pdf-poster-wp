import { PanelBody, ToggleControl } from "@wordpress/components";
import { Notice } from "../../../../../../../bpl-tools/Components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";
import { PanelNewBadge } from "../../../../../Components/NewBadge";

/**
 * Mirrors the "Performance & Reliability" section of the CSF metabox
 * (PDFP_MetaBox::performance) so the block sidebar and the shortcode UI group
 * the same settings the same way.
 */
const Performance = ({ attributes, setAttributes }) => {
    const { protect, progressiveLoading, defaultBrowser } = attributes;

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Performance & Reliability", "pdfp")} <PanelNewBadge /></div>} initialOpen={false}>

            <ToggleControl className="mt10" label={__("Fast Loading (Progressive Rendering)", "pdfp")} id="progressiveLoading" checked={progressiveLoading !== false} onChange={() => setAttributes({ progressiveLoading: progressiveLoading === false })} help={__("Stream large PDFs so the first page appears sooner. Turn off only if your host mishandles range requests.", "pdfp")} />

            {/* Guard carried over from the Viewers panel: hidden while content protection is on. */}
            {!protect && (
                <ToggleControl className="mt10" label={__("Google Doc Viewer", "pdfp")} id="defaultBrowser" checked={defaultBrowser} onChange={() => setAttributes({ defaultBrowser: !defaultBrowser })} help={__("Enable Google Doc Viewer as a fallback (Recommended for Edge).", "pdfp")} />
            )}

            <Notice status='premium' isIcon={true}>
                {__('Automatically load the latest version of a re-uploaded PDF, so visitors never see a cached copy—available exclusively in Premium.', 'pdfp')}
            </Notice>
        </PanelBody>
    )
}

export default Performance
