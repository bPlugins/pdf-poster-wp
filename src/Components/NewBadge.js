import { __ } from "@wordpress/i18n";

export const PanelNewBadge = ({ label }) => (
	<span className="pdfp-panel-new-badge">{label || __("New", "pdf-poster")}</span>
);

export const NewLabel = ({ children, label }) => (
	<span className="pdfp-label-new">
		{children ?? label}
		<span className="pdfp-new-badge">{__("New", "pdf-poster")}</span>
	</span>
);

export default NewLabel;
