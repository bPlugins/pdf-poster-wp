import { PanelBody, PanelRow, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import BColor from "../../../../../Components/BColor";
import BSpacer from "../../../../../Components/BSpacer";
import { PDFIcon } from "../../../../../icons/PDF";
import { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";

const Styles = ({ attributes, setAttributes }) => {
    const { titleFontSize, showName, fullscreenButton, downloadButton, popupOptions } = attributes;
    const [btnStyles, setBtnStyles] = useState(attributes.btnStyles || {});

    const { background, color, padding } = btnStyles;

    useEffect(() => {
        setAttributes({ btnStyles });
    }, [btnStyles]);

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__('Style', "pdf-poster")}</div>} initialOpen={false}>

            {(downloadButton || fullscreenButton || popupOptions?.enabled) && <>

                <div className="pdfp-panel-divider"> {__("Button", "pdf-poster")}</div>

                <div className="components-base-control">
                    <PanelRow style={{ marginBottom: '4px' }}>
                        <label className="components-base-control__label">{__("Button Background", "pdf-poster")}</label>
                        <BColor value={background} onChange={(background) => setBtnStyles({ ...btnStyles, background })} />
                    </PanelRow>
                    <p className="components-base-control__help" style={{ marginTop: '0', marginBottom: '12px' }}>
                        {__("Choose a background color for the buttons.", "pdf-poster")}
                    </p>
                </div>

                <div className="components-base-control">
                    <PanelRow style={{ marginBottom: '4px' }}>
                        <label className="components-base-control__label">{__("Button Color", "pdf-poster")}</label>
                        <BColor value={color} onChange={(color) => setBtnStyles({ ...btnStyles, color })} />
                    </PanelRow>
                    <p className="components-base-control__help" style={{ marginTop: '0', marginBottom: '12px' }}>
                        {__("Choose a text color for the buttons.", "pdf-poster")}
                    </p>
                </div>

                <div className="components-base-control">
                    <BSpacer title={__("Padding", "pdf-poster")} value={padding || {}} onChange={(padding) => setBtnStyles({ ...btnStyles, padding })} />
                    <p className="components-base-control__help" style={{ marginTop: '0', marginBottom: '12px' }}>
                        {__("Set the internal spacing for the buttons.", "pdf-poster")}
                    </p>
                </div>
            </>}


            {showName && <>
                <div className="pdfp-panel-divider mb10 mt10"> {__("Title", "pdf-poster")}</div>
                <UnitControl
                    label={__("Title Font Size", "pdf-poster")}
                    onChange={(titleFontSize) => setAttributes({ titleFontSize })}
                    value={titleFontSize}
                    units={[
                        { value: "px", label: "px", default: 16 },
                        { value: "em", label: "em", default: 1 },
                        { value: "rem", label: "rem", default: 1 },
                    ]}
                    isResetValueOnUnitChange={true}
                />
            </>}
        </PanelBody>
    );
};

export default Styles;
