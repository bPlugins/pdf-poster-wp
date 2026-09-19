import { PanelBody, SelectControl, ToggleControl } from "@wordpress/components";
import { Notice } from "../../../../../../../bpl-tools/Components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";
import { PanelNewBadge } from "../../../../../Components/NewBadge";

const Controls = ({ attributes, setAttributes }) => {
    const { showName, annotationMode, openLinksInNewTab, keyboardNav, rtlMode = "off", themeMode = "light", adobeEmbedder, flipbookSound } = attributes;
    const normalizedViewer = adobeEmbedder === true ? "adobe" : (adobeEmbedder === false ? "default" : (adobeEmbedder || "default"));

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Controls", "pdf-poster")} <PanelNewBadge /></div>} initialOpen={false}>

            <ToggleControl className="mt10" label={__("Keyboard Navigation", "pdf-poster")} id="keyboardNav" checked={!!keyboardNav} onChange={() => setAttributes({ keyboardNav: !keyboardNav })} help={__("Let visitors use the Left/Right arrow keys to change pages.", "pdf-poster")} />

            <SelectControl className="mt10" label={__("RTL Layout", "pdf-poster")} value={rtlMode} options={[
                { label: __("Off", "pdf-poster"), value: "off" },
                { label: __("On", "pdf-poster"), value: "on" },
                { label: __("Auto (follow site language)", "pdf-poster"), value: "auto" },
            ]} onChange={(rtlMode) => setAttributes({ rtlMode })} help={__("Flip the viewer layout for right-to-left languages (Arabic, Hebrew, etc.).", "pdf-poster")} />

            <SelectControl className="mt10" label={__("Viewer Theme", "pdf-poster")} value={themeMode} options={[
                { label: __("Light", "pdf-poster"), value: "light" },
                { label: __("Dark", "pdf-poster"), value: "dark" },
                { label: __("Auto (follow system)", "pdf-poster"), value: "auto" },
            ]} onChange={(themeMode) => setAttributes({ themeMode })} help={__("Controls the viewer toolbar/background theme. This never changes the PDF page content itself.", "pdf-poster")} />

            <ToggleControl
                className="mt10"
                label={__("Display Filename", "pdf-poster")}
                help={__("Show the filename at the top of the viewer.", "pdf-poster")}
                id="showName"
                checked={showName}
                onChange={() => setAttributes({ showName: !showName })}
            />

            {["flipbook", "slider"].includes(normalizedViewer) && (
                <ToggleControl className="mt10" label={__("Page Flip Sound", "pdf-poster")} id="flipbookSound" checked={flipbookSound !== false} onChange={() => setAttributes({ flipbookSound: flipbookSound === false })} help={__("Play a page-turn sound effect in Flipbook and Slider modes.", "pdf-poster")} />
            )}

            {normalizedViewer === "default" && (
                <>
                    <ToggleControl className="mt10" label={__("Annotation Mode", "pdf-poster")} id="annotationMode" checked={annotationMode !== false} onChange={() => setAttributes({ annotationMode: annotationMode === false })} help={__("Show notes, highlights, comments, and clickable links that are saved inside the PDF.", "pdf-poster")} />

                    {annotationMode !== false && (
                        <ToggleControl className="mt10" label={__("Open PDF links in new tab", "pdf-poster")} id="openLinksInNewTab" checked={openLinksInNewTab} onChange={() => setAttributes({ openLinksInNewTab: !openLinksInNewTab })} help={__("Open links clicked inside the PDF in a new browser tab, keeping your current page open.", "pdf-poster")} />
                    )}
                </>
            )}

            <Notice status='premium' isIcon={true}>
                {__('Unlock Reader Mode, thumbnail navigation with an auto-open sidebar, horizontal scrolling, a custom initial page and zoom level, a hidden right-side toolbar, and Adobe embed modes—available exclusively in Premium.', "pdf-poster")}
            </Notice>
        </PanelBody >
    )
}

export default Controls
