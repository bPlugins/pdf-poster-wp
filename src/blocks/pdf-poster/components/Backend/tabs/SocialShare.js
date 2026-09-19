import { PanelBody, SelectControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";

const SocialShare = ({ attributes, setAttributes }) => {
    const { socialShare } = attributes;
    const { enabled, position, facebook, twitter, linkedin, pinterest, mailto } = socialShare || {};

    return (
        <PanelBody className="bPlPanelBody" title={<div className="pdfp-panel-icon">{PDFIcon} {__("Social Share", "pdf-poster")}</div>} initialOpen={false}>
            <ToggleControl
                label={__("Enable Sharing", "pdf-poster")}
                checked={enabled}
                onChange={() => setAttributes({ socialShare: { ...socialShare, enabled: !enabled } })}
                help={__("Enable social sharing buttons for the PDF.", "pdf-poster")}
            />

            {enabled && (
                <>
                    <SelectControl options={[
                        { label: __("Top", "pdf-poster"), value: "top" },
                        { label: __("Bottom", "pdf-poster"), value: "bottom" },
                    ]}
                        label={__("Share Position", "pdf-poster")}
                        value={position}
                        onChange={(position) => setAttributes({ socialShare: { ...socialShare, position } })}
                        className="mt20 pt10"
                        help={__("Select where the sharing buttons should appear.", "pdf-poster")}
                    />

                    <div className="pdfp-panel-divider mb10 mt10"> {__("Social Media Platforms", "pdf-poster")}</div>

                    <ToggleControl
                        className="mt10"
                        label={__("Enable Facebook", "pdf-poster")}
                        checked={facebook}
                        onChange={() => setAttributes({ socialShare: { ...socialShare, facebook: !facebook } })}
                        help={__("Allow sharing on Facebook.", "pdf-poster")}
                    />

                    <ToggleControl
                        className="mt10"
                        label={__("Enable Twitter", "pdf-poster")}
                        checked={twitter}
                        onChange={() => setAttributes({ socialShare: { ...socialShare, twitter: !twitter } })}
                        help={__("Allow sharing on Twitter.", "pdf-poster")}
                    />
                    <ToggleControl
                        className="mt10"
                        label={__("Enable LinkedIn", "pdf-poster")}
                        checked={linkedin}
                        onChange={() => setAttributes({ socialShare: { ...socialShare, linkedin: !linkedin } })}
                        help={__("Allow sharing on LinkedIn.", "pdf-poster")}
                    />
                    <ToggleControl
                        className="mt10"
                        label={__("Enable Pinterest", "pdf-poster")}
                        checked={pinterest}
                        onChange={() => setAttributes({ socialShare: { ...socialShare, pinterest: !pinterest } })}
                        help={__("Allow sharing on Pinterest.", "pdf-poster")}
                    />
                    <ToggleControl
                        className="mt10"
                        label={__("Enable Email", "pdf-poster")}
                        checked={mailto}
                        onChange={() => setAttributes({ socialShare: { ...socialShare, mailto: !mailto } })}
                        help={__("Allow sharing via Email.", "pdf-poster")}
                    />
                </>
            )}

        </PanelBody>
    );
};

export default SocialShare;
