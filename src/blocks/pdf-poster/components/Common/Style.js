import { useEffect, useState } from "react";
import getPadding from "../../../../hooks/utils/getPadding";

export default function Style({ attributes, id = 'pdfp' }) {
  const [CSS, setCSS] = useState(null);

  const { height, popupBtnStyle: sss, popupOptions: rawPopupOptions, width, alignment, btnStyles: rawBtnStyles } = attributes;
  const popupOptions = rawPopupOptions || {};
  const btnStyle = popupOptions.btnStyle || {};
  const buttonStyle = rawBtnStyles || btnStyle || {};


  useEffect(() => {
    // The .iframe_wrapper size rules skip .pdfp_fullscreen_opened: as ID selectors (and
    // !important on mobile) they would beat the CSS fullscreen and keep the inline size.
    let CSS = `
    .${id} .cta_wrapper a, 
    .${id} .cta_wrapper button, 
    .${id} .popup-btn{
      padding: ${getPadding(buttonStyle.padding)}
      color: ${buttonStyle.color}; 
      background: ${buttonStyle.background}; 
      border-radius: 3px;
      border:0;
      cursor: pointer;
      font-size: ${buttonStyle.fontSize};
      min-height: 0px;
      line-height: 1.35em;
      text-transform: initial;
    }
    #${id} {
        display: flex;
        justify-content: ${alignment};
    }
    #${id} .pdfp_wrapper {
      width: 100%;
    }
    
    #${id} .pdfp_wrapper:not(.pdfp_fullscreen_opened) .iframe_wrapper {
      height: ${height?.desktop || height};
      width: ${width?.desktop || width};
    }
     
        #${id} .pdfp_wrapper iframe {
          height: 100%;
          width: 100%;
        }
    .${id} .popup-trigger {
    display: flex;
      justify-content: ${popupOptions.triggerAlignment};
    }
    .${id} .popup-trigger img, .${id} .popup-trigger-text {
      height: ${popupOptions.imageHeight};
      width: ${popupOptions.imageWidth};
    }
    .${id}btn {
      background: ${sss?.background}; 
      color: ${sss?.color}; 
      padding: ${getPadding(sss?.padding)}
    } `.replace(/\s\s+/g, " ").trim();

    if (typeof height === 'object') {
      CSS += ` @media only screen and (max-width: 1024px) {
        #${id} .pdfp_wrapper:not(.pdfp_fullscreen_opened) .iframe_wrapper {
          height: ${height.tablet || height};
          width: ${width.tablet || width};
        }
      }
      @media only screen and (max-width: 640px) {
        #${id} .pdfp_wrapper:not(.pdfp_fullscreen_opened) .iframe_wrapper{
          height: ${height.mobile || height} !important;
          width: ${width.mobile || width} !important;
        }
      }`.replace(/\s\s+/g, " ").trim();
    }
    setCSS(CSS);
  }, [sss, id, height, buttonStyle, width, alignment, popupOptions]);

  return <style>{CSS}</style>;
}
