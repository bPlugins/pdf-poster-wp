import { __ } from "@wordpress/i18n";
import External from "../../../../icons/External";
import { PRICING_URL } from "../../utils";

const ComingSoonCard = ({ title, description, pricingUrl = PRICING_URL }) => {
    return (
        <div className="pdfp-coming-soon-card">
            <div className="pdfp-coming-soon-header">
                <h3>{title}</h3>
            </div>
            <p>{description}</p>
            <a className="button button-primary button-small" href={pricingUrl} target="_blank" rel="noopener noreferrer">
                {__('Upgrade to Pro', "pdf-poster")}
            </a>
        </div>
    );
};

export default ComingSoonCard;
