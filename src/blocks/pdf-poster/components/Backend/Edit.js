import { useState, useEffect } from "react";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n"; 

import Viewer from "../Common/Viewer";
import Settings from "./Settings";
import Uploader from "./Uploader";

function Edit(props) {
  const { attributes, setAttributes, clientId, isSelected } = props;
  const { alignment, file = pdfp?.placeholder, additional } = attributes;
  const blockProps = useBlockProps();

  const [modalOpen, setModalOpen] = useState(false);
  const [preset, setPreset] = useState({ preset: attributes });

  //generate new unique ID
  useEffect(() => {
    // setAttributes({ adobeOptions: { ...adobeOptions, updated: true } });
  }, []);

  const id = `block-${clientId}`;

  if (!file) {
    return <Uploader attributes={attributes} setAttributes={setAttributes} />;
  }

  return (
    <div {...blockProps} style={{ textAlign: alignment }}>

      <style>{additional?.CSS}</style>
      <Settings setModalOpen={setModalOpen} {...props} setPreset={setPreset} />
      <Viewer attributes={attributes} RichText={RichText} __={__} setAttributes={setAttributes} isBackend={true} isSelected={isSelected} id={id} />
      {/* Saved block presets are Pro, so the modal is never mounted here. Kept in
          place so the Pro build's PresetModal has a slot to land in. */}
    </div>
  );
}

export default Edit;
