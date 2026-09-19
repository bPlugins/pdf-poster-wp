import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../../../../../icons/PDF";
import { PremiumBadge, PremiumPanel } from "../../../../../../../bpl-tools/ProControls";
import { PRICING_URL } from "../../../utils";

const ProtectContent = () => {
    return (
        <PanelBody className="bPlPanelBody" title={<>
            <div className="pdfp-panel-icon">{PDFIcon} {__("Protect Content", "pdf-poster")}</div>
            <span className="pdfp-panel-pro-badge">Pro</span>
        </>} initialOpen={false}>
            <PremiumPanel 
                title={__('Content Protection', "pdf-poster")} 
                description={__('Keep your work safe by disabling right-clicks, text selection, and copying. This feature is available in the Premium version.', "pdf-poster")} 
                pricingUrl={PRICING_URL} 
            />
        </PanelBody>
    )
}

export default ProtectContent;
