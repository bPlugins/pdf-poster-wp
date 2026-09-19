import { Fragment, useState } from "react";
import { PanelRow, __experimentalNumberControl } from "@wordpress/components";
const NumberControl = __experimentalNumberControl;
import { __ } from "@wordpress/i18n";
// import BDevice from "./BDevice";

/**
 *
 * @props {Object} label: {top: "Top", right: "Right", bottom: "Bottom", left: "Left"}
 * @props label: (String)
 * @props {Object} value: { top: 0, right: 0, bottom: 0, left: 0 },
 * @props {Object} enable: { top = true, right = true, bottom = true, left = true },
 * @props {Boolean} isDragEnabled: false
 * @props {Boolean} isShiftStepEnabled: true
 * @props {Number} shiftStep: 10
 * @props {String} width: '250px'
 * @props {String} ClassName: ''
 * @props {Function} onChange
 * @returns {Object}
 */
const BSpacer = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [linking, setLinking] = useState(false);
  const {
    enable: { top = true, right = true, bottom = true, left = true },
    onChange,
    value,
    title,
    label,
    isShiftStepEnabled = true,
    isDragEnabled = false,
    shiftStep = 10,
    className = " ",
    width = "250px",
  } = props;

  const onChangeHandler = (to, v) => {
    if (linking) {
      const newValue = { ...value };
      newValue.top = v;
      newValue.left = v;
      newValue.right = v;
      newValue.bottom = v;
      onChange(newValue);
    } else {
      onChange({ ...value, [to]: v });
    }
  };

  return (
    <Fragment>
      <PanelRow>
        <label>{title}</label>
        {/* <BDevice style={{ marginRight: "auto" }} device={device} onChange={(device) => onChangeDevice(device)} /> */}
        {/* <button
          class="iconButton"
          bisactive={linking ? "true" : "false"}
          onClick={() => {
            setLinking(!linking);
            if (linking) {
              const newValue = { ...value };
              const topValue = newValue.top;
              newValue.top = topValue;
              newValue.left = topValue;
              newValue.right = topValue;
              newValue.bottom = topValue;
              onChange(newValue);
            }
          }}
        >
          <Link size="12" />
        </button> */}
      </PanelRow>
      <PanelRow>
        <div className={className} style={{ width, maxWidth: "100%", display: "flex" }}>
          {top && (
            <NumberControl
              label={label.top || __("Top", "pdf-poster")}
              isShiftStepEnabled={isShiftStepEnabled}
              isDragEnabled={isDragEnabled}
              onChange={(v) => {
                onChangeHandler("top", parseInt(v));
              }}
              shiftStep={shiftStep}
              value={value.top}
            />
          )}
          {right && <NumberControl label={label.right || __("Right", "pdf-poster")} isShiftStepEnabled={isShiftStepEnabled} isDragEnabled={isDragEnabled} onChange={(v) => onChangeHandler("right", parseInt(v))} shiftStep={shiftStep} value={value.right} />}
          {bottom && <NumberControl label={label.bottom || __("Bottom", "pdf-poster")} isShiftStepEnabled={isShiftStepEnabled} isDragEnabled={isDragEnabled} onChange={(v) => onChangeHandler("bottom", parseInt(v))} shiftStep={shiftStep} value={value.bottom} />}
          {left && <NumberControl label={label.left || __("Left", "pdf-poster")} isShiftStepEnabled={isShiftStepEnabled} isDragEnabled={isDragEnabled} onChange={(v) => onChangeHandler("left", parseInt(v))} shiftStep={shiftStep} value={value.left} />}
        </div>
      </PanelRow>
    </Fragment>
  );
};

BSpacer.defaultProps = {
  enable: {},
  value: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  label: {},
};
export default BSpacer;
