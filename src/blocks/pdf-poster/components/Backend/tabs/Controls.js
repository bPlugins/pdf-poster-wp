import { PanelBody, SelectControl, ToggleControl } from "@wordpress/components";
import { Notice } from "../../../../../../../bpl-tools/Components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";
import { PanelNewBadge } from "../../../../../Components/NewBadge";

const Controls = ({ attributes, setAttributes }) => {
    const { showName, annotationMode, openLinksInNewTab, keyboardNav, rtlMode = "off", themeMode = "light", adobeEmbedder, flipbookSound } = attributes;
    const normalizedViewer = adobeEmbedder === true ? "adobe" : (adobeEmbedder === false ? "default" : (adobeEmbedder || "default"));

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Controls", "pdfp")} <PanelNewBadge /></div>} initialOpen={false}>

            <ToggleControl className="mt10" label={__("Keyboard Navigation", "pdfp")} id="keyboardNav" checked={!!keyboardNav} onChange={() => setAttributes({ keyboardNav: !keyboardNav })} help={__("Let visitors use the Left/Right arrow keys to change pages.", "pdfp")} />

            <SelectControl className="mt10" label={__("RTL Layout", "pdfp")} value={rtlMode} options={[
                { label: __("Off", "pdfp"), value: "off" },
                { label: __("On", "pdfp"), value: "on" },
                { label: __("Auto (follow site language)", "pdfp"), value: "auto" },
            ]} onChange={(rtlMode) => setAttributes({ rtlMode })} help={__("Flip the viewer layout for right-to-left languages (Arabic, Hebrew, etc.).", "pdfp")} />

            <SelectControl className="mt10" label={__("Viewer Theme", "pdfp")} value={themeMode} options={[
                { label: __("Light", "pdfp"), value: "light" },
                { label: __("Dark", "pdfp"), value: "dark" },
                { label: __("Auto (follow system)", "pdfp"), value: "auto" },
            ]} onChange={(themeMode) => setAttributes({ themeMode })} help={__("Controls the viewer toolbar/background theme. This never changes the PDF page content itself.", "pdfp")} />

            <ToggleControl
                className="mt10"
                label={__("Display Filename", "pdfp")}
                help={__("Show the filename at the top of the viewer.", "pdfp")}
                id="showName"
                checked={showName}
                onChange={() => setAttributes({ showName: !showName })}
            />

            {["flipbook", "slider"].includes(normalizedViewer) && (
                <ToggleControl className="mt10" label={__("Page Flip Sound", "pdfp")} id="flipbookSound" checked={flipbookSound !== false} onChange={() => setAttributes({ flipbookSound: flipbookSound === false })} help={__("Play a page-turn sound effect in Flipbook and Slider modes.", "pdfp")} />
            )}

            {normalizedViewer === "default" && (
                <>
                    <ToggleControl className="mt10" label={__("Annotation Mode", "pdfp")} id="annotationMode" checked={annotationMode !== false} onChange={() => setAttributes({ annotationMode: annotationMode === false })} help={__("Show notes, highlights, comments, and clickable links that are saved inside the PDF.", "pdfp")} />

                    {annotationMode !== false && (
                        <ToggleControl className="mt10" label={__("Open PDF links in new tab", "pdfp")} id="openLinksInNewTab" checked={openLinksInNewTab} onChange={() => setAttributes({ openLinksInNewTab: !openLinksInNewTab })} help={__("Open links clicked inside the PDF in a new browser tab, keeping your current page open.", "pdfp")} />
                    )}
                </>
            )}

            <Notice status='premium' isIcon={true}>
                {__('Unlock Reader Mode, thumbnail navigation with an auto-open sidebar, horizontal scrolling, a custom initial page and zoom level, a hidden right-side toolbar, and Adobe embed modes—available exclusively in Premium.', 'pdfp')}
            </Notice>
        </PanelBody >
    )
}

export default Controls
