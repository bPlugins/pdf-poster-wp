import { PanelBody, TextareaControl, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";
import { PanelNewBadge } from "../../../../../Components/NewBadge";

/**
 * Class + CSS for a single block.
 *
 * The class lands on the viewer wrapper (Viewer.js) and the CSS is printed as a
 * <style> sibling of the block container by render.php -- not inside it, because
 * view.js mounts React over the container and would wipe anything nested there.
 */
const Additional = ({ attributes, setAttributes }) => {
    const { additional } = attributes;

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Additional", "pdf-poster")} <PanelNewBadge /></div>} initialOpen={false}>
            <TextControl
                label={__("Class", "pdf-poster")}
                help={__("Extra class name added to the viewer wrapper.", "pdf-poster")}
                value={additional?.Class}
                onChange={(Class) => setAttributes({ additional: { ...additional, Class } })}
            />
            <TextareaControl
                label={__("CSS", "pdf-poster")}
                help={__("Custom CSS for this block only. Loads on the front end as well as here in the editor.", "pdf-poster")}
                value={additional?.CSS}
                onChange={(CSS) => setAttributes({ additional: { ...additional, CSS } })}
            />
        </PanelBody>
    )
}

export default Additional;
