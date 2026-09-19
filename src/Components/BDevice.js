import { useState } from "react";
import { __ } from "@wordpress/i18n";
import { Desktop, Tablet, Mobile } from "./Icon";
// import styles from "./styles.module.scss";

/**
 *
 * @props device: 'desktop' (String)
 * @props iconSize: 10 (Number)
 * @props onChange: (Function)
 * @props style: {} (Object)
 * @return Selected device
 */
const BDevice = ({ onChange, device = "desktop", iconSize = 14, style, className = "iconButton" }) => {
  const [show, setShow] = useState(false);
  window.addEventListener("click", function () {
    setShow(false);
  });
  return (
    <div className={"bDevice"} style={style}>
      {!show && (
        <button
          className={className}
          onClick={(event) => {
            setShow(true);
            event.stopPropagation();
          }}
          title={device[0].toUpperCase() + device.slice(1)}
        >
          {device == "desktop" ? <Desktop size={iconSize} /> : device == "tablet" ? <Tablet size={iconSize} /> : <Mobile size={iconSize} />}
        </button>
      )}
      {show && (
        <div className={"bDevicePopup"}>
          {/* {device != 'desktop' && ( */}
          <button
            className={className}
            title={__("Desktop", "pdf-poster")}
            onClick={() => {
              onChange("desktop");
              setShow(false);
            }}
          >
            <Desktop size={iconSize} />
          </button>
          {/* // )} */}
          {/* {device != 'tablet' && ( */}
          <button
            className={className}
            title={__("Tablet", "pdf-poster")}
            onClick={() => {
              onChange("tablet");
              setShow(false);
            }}
          >
            <Tablet size={iconSize} />
          </button>
          {/* )} */}
          {/* {device != 'mobile' && ( */}
          <button
            className={className}
            title={__("Mobile", "pdf-poster")}
            onClick={() => {
              onChange("mobile");
              setShow(false);
            }}
          >
            <Mobile size={iconSize} />
          </button>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default BDevice;
