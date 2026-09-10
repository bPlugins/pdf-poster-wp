import { Button, Placeholder } from "@wordpress/components";
import { Fragment, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";

const Uploader = ({ setAttributes }) => {
  const [source, setSource] = useState("");
  const [isValid, setIsValid] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [isOpen, setOpen] = useState(true);

  const handleApply = (event) => {
    event.preventDefault();
    if (!validURL(source)) {
      setIsValid(false);
      return false;
    }
    // createVideo();
    setIsValid(true);
    setSource("");
    // A hand-typed URL has no attachment behind it, so clear any id inherited from a
    // previously picked file rather than leaving it to override the new URL.
    setAttributes({ file: source, fileId: 0 });
  };

  const validURL = (str) => {
    var pattern = new RegExp("https?", "i"); // fragment locator
    return !!pattern.test(str);
  };

  // const handleLicenseActive = async () => {
  //   // licenseWrapper, {
  //   //   products: ["pdfposter", "uoGmX"],
  //   //   prefix: "pdfp",
  //   // }
  //   // setLoading(true)
  //   new LicenseHandler(modalRef.current, {
  //       products: ["pdfposter", "uoGmX"],
  //       prefix: "pdfp",
  //   });

  // }

  return (
    <Fragment>
      {/* {!pdfp?.pipe && isOpen && (
        <Modal title={__("Active the license key", "pdfp")} onRequestClose={() => setOpen(false)} className="license_activation_form" ref={modalRef}>
          <p>
            {__(
              "PDF Poster PRO license key is not activated yet. Please active the license key to available all the pro features. ", "pdfp"
            )}
            {" "}
            
          </p>
          <a href="https://pdfposter.com/docs/license-activation/" target="_blank" className="button button-primary">
            {__("Learn More", "pdfp")}
          </a>
       
        </Modal>
      )} */}
      <Placeholder
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="html5-block-icon">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        }
        instructions={__("Upload a PDF or paste/write PDF URL.", "pdfp")}
        label={__("Upload a PDF ", "pdfp")}
      >
        <MediaUploadCheck>
          <MediaUpload
            allowedTypes={["application/pdf"]}
            onSelect={(file) => setAttributes({ file: file.url, fileId: file.id || 0 })}
            render={({ open }) => (
              <Button isPrimary onClick={open}>
                {__("Upload", "pdfp")}
              </Button>
            )}
          />
        </MediaUploadCheck>
        <div className="h5vpUrlInput">
          <h3 style={{ fontSize: "15px" }}> Or </h3>
          <input
            type="url"
            aria-label={__("URL", "pdfp")}
            placeholder={__("Paste or type a PDF URL", "pdfp")}
            onChange={(src) => setSource(src.target.value)}
            value={source}
          />
          <Button label={__("Apply", "pdfp")} type="submit" onClick={handleApply} variant="primary">
            {__("Apply", "pdfp")}
          </Button>
        </div>
        {!isValid && <p style={{ color: "#bd1818", width: "100%", margin: 0 }}>{__("URL is not valid", "pdfp")}</p>}
      </Placeholder>
    </Fragment>
  );
};

export default Uploader;
