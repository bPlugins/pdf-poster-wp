import { Button, Modal, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PresetOptions from "./PresetOptions";
import Preview from "./Preview";
import { ajaxCall } from "../../utils";
import { useState } from "react";

const PresetModal = (props) => {
  const { attributes, setAttributes, preset, setPreset, setModalOpen } = props;
  const { statePresets = [] } = attributes;
  const [isSaving, setIsSaving] = useState(false);

  const handlePresetChange = (update) => {
    setPreset({ ...preset, preset: { ...preset.preset, ...update } });
  };

  const handleCreatePreset = async () => {
    setIsSaving(true);
    // eslint-disable-next-line no-unused-vars
    const { addional, file, title, CSS, ...other } = preset.preset;
    const { data } = await ajaxCall("POST", {
      model: "Presets",
      method: "create",
      name: preset.name,
      preset: other,
      id: preset.id,
    });
    setIsSaving(false);
    if (data) {
      if (preset.id) {
        setAttributes({
          statePresets: statePresets.map((item) => (item.id === preset.id ? preset : item)),
        });
      } else {
        const newPresets = [...statePresets, { ...preset, id: data.id }];
        setAttributes({ statePresets: newPresets });
      }
      setPreset({ ...preset, id: data.id });
    }
    setModalOpen(false);
  };

  return (
    <div>
      <Modal
        shouldCloseOnClickOutside={false}
        title={__("Preset", "pdf-poster")}
        onRequestClose={() => {
          setModalOpen(false);
          setPreset(null);
        }}
        className="pdfpPresetModal"
      >
        <TextControl value={preset.name} onChange={(name) => setPreset({ ...preset, name })} />
        <div className="pdfpPreset">
          <div className="options">
            <PresetOptions attributes={preset.preset || {}} setAttributes={handlePresetChange} />
          </div>
          <div className="preview">
            <Preview isPreset={true} {...props} attributes={preset.preset} setAttributes={handlePresetChange} />
          </div>
        </div>

        <div className="actionsWrapper">
          <div className="actions">
            <div></div>
            <div>
              {isSaving && <div className="pdfp_loader"></div>}
              <Button disabled={isSaving} variant="primary" onClick={handleCreatePreset}>
                {preset?.id ? __("Update", "pdf-poster") : __("Create", "pdf-poster")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PresetModal;
