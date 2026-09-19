import { __ } from "@wordpress/i18n";

const BControlPro = ({ label, className, onChange, isPremium = false, Component, setOpen = () => { }, ...restProps }) => {
  const labelMiddleWare = (label) => {
    return isPremium ? (
      label
    ) : (
      <>
        <span className="bplOpacity75">{label}</span> <span className="labelPro">{__("Pro", "pdf-poster")}</span>
      </>
    );
  };

  return (
    <Component
      className={`${className} ${isPremium ? "" : "bplProIdentifier pdfpProIdentifier"}`}
      label={labelMiddleWare(label)}
      onChange={(val) => {
        if (isPremium) {
          onChange(val);
        } else {
          setOpen(true);
        }
      }}
      isPremium={isPremium}
      {...restProps}
    />
  );
};

export default BControlPro;
