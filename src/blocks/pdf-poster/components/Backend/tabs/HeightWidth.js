import { PanelBody, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import Device from "../../../../../../../bpl-tools/Components/Device/Device";
import Label from "../../../../../../../bpl-tools/Components/Label/Label";
import { PDFIcon } from "../../../../../icons/PDF";


const HeightWidth = ({ attributes, setAttributes, device }) => {
    const { height, width } = attributes;

    useEffect(() => {
        if (typeof height === "string") {
            setAttributes({ height: { desktop: height, tablet: height, mobile: height } });
        }
        if (typeof width === "string") {
            setAttributes({ width: { desktop: width, tablet: width, mobile: width } });
        }
    }, []);

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Height & Width", "pdf-poster")}</div>} initialOpen={false}>

            <UnitControl
                label={<Label className="gap5">{__("Height", "pdf-poster")}  <Device /></Label>}
                labelPosition="top"
                className="mb10 mt10"
                onChange={(value) => setAttributes({ height: { ...height, [device]: value } })}
                value={height[device] || height}
                units={[
                    { value: "px", label: "px", default: 500 },
                    { value: "%", label: "%", default: 100 },
                    { value: "vh", label: "vh", default: 100 },
                ]}
                isResetValueOnUnitChange={true}
                help={device === 'tablet' ? __("Set the height of the viewer for tablet.", "pdf-poster") : device === 'mobile' ? __("Set the height of the viewer for mobile.", "pdf-poster") : __("Set the height of the viewer for desktop.", "pdf-poster")}
            />

            <UnitControl
                className="mt10"
                label={<Label className="gap5">{__("Width", "pdf-poster")}  <Device /></Label>}
                labelPosition="top"
                onChange={(value) => setAttributes({ width: { ...width, [device]: value } })}
                value={width[device] || width}
                units={[
                    { value: "px", label: "px", default: 500 },
                    { value: "%", label: "%", default: 100 },
                    { value: "vw", label: "vw", default: 100 },
                ]}
                isResetValueOnUnitChange={true}
                help={device === 'tablet' ? __("Set the width of the viewer for tablet.", "pdf-poster") : device === 'mobile' ? __("Set the width of the viewer for mobile.", "pdf-poster") : __("Set the width of the viewer for desktop.", "pdf-poster")}
            />
        </PanelBody>
    );
};


export default compose(
    withSelect((select) => {
        const { getDeviceType } = select('core/editor');

        return {
            device: getDeviceType()?.toLowerCase(),
        };
    }),
)(HeightWidth);