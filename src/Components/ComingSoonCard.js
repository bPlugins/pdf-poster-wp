import { __ } from "@wordpress/i18n";
import { PDFIcon } from "../icons/PDF";

const ComingSoonCard = ({ title, description }) => {
    return (
        <div className="pdfp-coming-soon-card">
            <div className="pdfp-cs-icon-wrapper">
                <div className="pdfp-cs-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" fill="currentColor"/>
                    </svg>
                </div>
            </div>
            <h4 className="pdfp-cs-title">{title}</h4>
            <p className="pdfp-cs-description">{description}</p>
            <div className="pdfp-cs-footer">
                <div className="pdfp-cs-badge">{__("Coming Soon", "pdf-poster")}</div>
            </div>
            <style>{`
                .pdfp-coming-soon-card {
                    background: #fff; 
                    padding: 10px 10px;
                    text-align: center;
                    margin: 10px 0;
                }
                .pdfp-cs-icon-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .pdfp-cs-icon {
                    width: 50px;
                    height: 50px;
                    background: #fff;
                    border: 2px solid #ff7a00;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ff7a00;
                }
                .pdfp-cs-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 12px 0;
                    line-height: 1.4;
                }
                .pdfp-cs-description {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.6;
                    margin: 0 0 24px 0;
                }
                .pdfp-cs-badge {
                    display: inline-block;
                    background: #f1f5f9;
                    color: #475569;
                    font-size: 12px;
                    font-weight: 600;
                    padding: 6px 16px;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            `}</style>
        </div>
    );
};

export default ComingSoonCard;
