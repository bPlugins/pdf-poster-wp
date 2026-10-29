import { Fragment, useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";

import Settings from "./Settings";
import Viewer from "../pdf-poster/components/Common/Viewer";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import { SelectControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import apiFetch from "@wordpress/api-fetch";

function Edit(props) {
  const { attributes, setAttributes, clientId, isSelected, docs } = props;
  const { data, shadowAttributes } = attributes;
  const { tringle_text } = data;
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    if (!attributes.data?.tringle_text) {
      return;
    }
    setIsLoading(true);
    // apiFetch knows the REST root and sends the nonce; the route needs a logged-in user,
    // and a bare request (no nonce) is treated as a guest and refused.
    apiFetch({ path: "/pdfposter/v1/single/" + tringle_text })
      .then((res) => setAttributes({ shadowAttributes: res }))
      .catch(() => setAttributes({ shadowAttributes: {} }))
      .finally(() => setIsLoading(false));
  }, [attributes.data]);

  let options;
  if (docs) {
    options = docs.map((item) => {
      return { label: item?.title?.rendered || "No title", value: item?.id };
    });
    options = [{ label: "Select", value: null }, ...options];
  }

  return (
    <div {...useBlockProps()}>
      <Settings {...{ attributes, setAttributes, options }} />
      {!isSelected && <div className="pdfp_selector" style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 9999, background: 'transparent' }}></div>}
      {isLoading && <h2>Loading...</h2>}
      {!isLoading && shadowAttributes?.file && (
        <Viewer
          attributes={shadowAttributes}
          id={`block-${clientId}`}
          RichText={RichText}
          __={__}
          setAttributes={(newAttrs) => {
            setAttributes({ shadowAttributes: { ...shadowAttributes, ...newAttrs } });
          }}
          isBackend={true}
        />
      )}
      {!isLoading && !shadowAttributes?.file && <SelectControl label="PDF Poster" value={data?.tringle_text} options={options} onChange={(id) => setAttributes({ data: { tringle_text: id } })} />}
    </div>
  );
}

export default compose([
  withSelect((select) => {
    const docs = select("core").getEntityRecords("postType", "pdfposter", { per_page: 100 });
    return {
      docs,
    };
  }),
])(Edit);
