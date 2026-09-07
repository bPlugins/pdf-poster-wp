import { Button, Modal, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";

import { InspectorControls, AlignmentToolbar, BlockControls } from "@wordpress/block-editor";

import { produce } from "immer";

import { ajaxCall, presetDelete, PRICING_URL } from "../../utils";
import HeightWidth from "./tabs/HeightWidth";
import Actions from "./tabs/Actions";
import Viewers from "./tabs/Viewers";
import Controls from "./tabs/Controls";
import Performance from "./tabs/Performance";
import Styles from "./tabs/Styles";
import SocialShare from "./tabs/SocialShare";
import CopyShortcode from "./CopyShortcode";
import Additional from "./tabs/Additional";
import Popup from "./tabs/Popup";
import Ads from "./tabs/Ads";
import Analytics from "./tabs/Analytics";
import ProtectContent from "./tabs/ProtectContent";
import Watermark from "./tabs/Watermark";
import { AdvertiseCard } from "../../../../../../bpl-tools/ProControls";

const Settings = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [confirm, setConfirm] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); 


  const [loading, setLoading] = useState(false);
  const { attributes, setAttributes } = props;
  const { showName, downloadButton, fullscreenButton, alignment, popupOptions } = attributes;

  const { statePresets = [] } = attributes;

  useEffect(() => {
    // Dropbox logic removed

    const fetch = async () => {
      const response = await ajaxCall("GET", {
        model: "Presets",
        method: "all",
      });
      setAttributes({ statePresets: response?.data || [] });
    };
    fetch();

    /// update new attributes
    if (!attributes.btnStyles) {
      setAttributes({ btnStyles: popupOptions.btnStyle });
    }
  }, []);

  const handleDeletePreset = async (id) => {
    setLoading(true);
    const { data } = await presetDelete(id);
    if (data) {
      setAttributes({
        statePresets: statePresets.filter((preset) => preset.id !== id),
      });
    }
    setConfirmModalOpen(false);
    setLoading(false);
  };

  const updatePopupOptions = (key, value) => {
    const newPopupOptions = produce(popupOptions, (draft) => {
      draft[key] = value;
    });
    setAttributes({ popupOptions: newPopupOptions });
  };

  // No panel renders a locked control any more: each one offers what this build can do
  // and names the rest in a Premium notice, so there is no upgrade click to route.
  const panelProps = { attributes, setAttributes, updatePopupOptions };



  return (
    <>
      <InspectorControls style={{ marginBottom: "40px" }}>

        <CopyShortcode />
        <Viewers {...panelProps} />
        <HeightWidth {...panelProps} />
        <Actions {...panelProps} />
        <Controls {...panelProps} />
        <ProtectContent {...panelProps} />
        <Watermark {...panelProps} />
        <Popup {...panelProps} />

        {(downloadButton || fullscreenButton || showName || popupOptions.enabled) &&
          <Styles {...panelProps} />
        }

        <SocialShare {...panelProps} />
        <Performance {...panelProps} />
        <Analytics {...panelProps} />
        <Ads {...panelProps} />
        <Additional {...panelProps} />
        <AdvertiseCard planLink={PRICING_URL} />


      </InspectorControls>
      {confirmModalOpen && (
        <Modal title={__("Do you want to delete?", "pdfp")} onRequestClose={() => setConfirmModalOpen(false)}>
          <div className="confirmPresetDelete">
            {loading && <span className="pdfp_loader"></span>}
            {/* <Button variant="primary" onClick={() => setConfirmModalOpen(false)}>{__('No', 'pdfp')}</Button> */}
            <Button
              disabled={loading}
              variant="primary"
              onClick={() => {
                setConfirm(true);
                handleDeletePreset(confirmModalOpen);
              }}
            >
              {__("Yes", "pdfp")}
            </Button>
          </div>
        </Modal>
      )}
      <BlockControls>
        <AlignmentToolbar
          value={alignment}
          onChange={(val) => setAttributes({ alignment: val })}
          describedBy={__("Alert Alignment")}
          alignmentControls={[
            { title: __("Alert in left", "pdfp"), align: "left", icon: "align-left" },
            { title: __("Alert in center", "pdfp"), align: "center", icon: "align-center" },
            { title: __("Alert in right", "pdfp"), align: "right", icon: "align-right" },
          ]}
        />
        <ToolbarGroup>
          <ToolbarButton icon={'edit'} label="Reset" onClick={() => setAttributes({ file: '' })} />
        </ToolbarGroup>
      </BlockControls>
    </>
  );
};

export default Settings;
