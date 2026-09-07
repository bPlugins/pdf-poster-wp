/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../bpl-tools/Admin/Activation/index.js"
/*!**********************************************!*\
  !*** ../bpl-tools/Admin/Activation/index.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Activation/style.scss");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/icons */ "../bpl-tools/Admin/utils/icons.js");
/* harmony import */ var _useLicense__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./useLicense */ "../bpl-tools/Admin/Activation/useLicense.js");







/**
 * License activation / deactivation page.
 * Communicates with the bPlugins LicenseActivation.php AJAX bridge.
 *
 * @param {object} props
 * @param {string} props.name				- Plugin name
 * @param {string} props.slug				- WordPress.org slug (Freemius recover-license + EULA links)
 * @param {string} [props.version]			- Plugin version shown in the card header
 * @param {object} [props.media]			- {logo?}
 * @param {object} props.freemius			- {product_id, public_key}
 * @param {string} props.licenseActiveNonce	- wp_create_nonce('bPlLicenseActivation')
 */
const Activation = props => {
  const {
    name,
    slug,
    version,
    media,
    freemius,
    licenseActiveNonce
  } = props;
  const {
    product_id,
    public_key
  } = freemius || {};
  const {
    logo
  } = media || {};
  const {
    isActivated,
    isLoading,
    error,
    activatedLicense,
    activateLicense,
    deactivateLicense
  } = (0,_useLicense__WEBPACK_IMPORTED_MODULE_4__["default"])({
    product_id,
    public_key,
    licenseActiveNonce
  });
  const [licenseKey, setLicenseKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [showLicense, setShowLicense] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showActivationForm, setShowActivationForm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showConfirm, setShowConfirm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [copied, setCopied] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const handleActivation = async () => {
    const ok = await activateLicense(licenseKey);
    if (ok) {
      setLicenseKey('');
      setShowActivationForm(false);
      window.location.reload();
    }
  };
  const handleDeactivate = async () => {
    setShowConfirm(false);
    const ok = await deactivateLicense();
    if (ok) {
      setShowActivationForm(true);
      setLicenseKey('');
      window.location.reload();
    }
  };
  const copyLicense = async () => {
    if (!activatedLicense) return;
    try {
      await navigator.clipboard.writeText(activatedLicense);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  };
  const getMaskedLicense = license => {
    if (!license) return '';
    if (showLicense) return license;
    const start = license.substring(0, 4);
    const end = license.substring(license.length - 4);
    const middle = '•'.repeat(Math.max(0, license.length - 8));
    return `${start}${middle}${end}`;
  };
  const isChangeLicense = showActivationForm && isActivated;
  const showSuccessView = isActivated && !showActivationForm;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardActivation"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "actHero"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "actEyebrow"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('License')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, showSuccessView ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your license is active') : isChangeLicense ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Change your license key') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Activate your license')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, showSuccessView ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("You're receiving security updates, new features and priority support for"), ' ', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, name), '.') : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter the license key you received with your purchase to unlock premium features and updates for'), ' ', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, name), '.'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: `actCard ${showSuccessView ? 'isActive' : 'isInactive'}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "actCardHead"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actPluginInfo"
  }, logo && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: logo,
    alt: name || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Plugin')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, name || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Plugin')), version && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "actVer"
  }, "v", version))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: `actStatus ${isActivated ? 'isOk' : 'isOff'}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "actStatusDot"
  }), isActivated ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Activated') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Not activated'))), isLoading && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actLoading"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actSpinner"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Talking to the license server…'))), !isLoading && showSuccessView && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actBody"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actSuccessTop"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actSuccessIcon"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.circleCheckIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('License verified')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your purchase code is bound to this site and is in good standing.')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actLicenseRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "actFieldLabel"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('License key')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actLicenseDisplay"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    value: getMaskedLicense(activatedLicense),
    readOnly: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "actIconBtn",
    onClick: () => setShowLicense(v => !v),
    "aria-label": showLicense ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hide license') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show license')
  }, showLicense ? _utils_icons__WEBPACK_IMPORTED_MODULE_3__.showLicenseIcon : _utils_icons__WEBPACK_IMPORTED_MODULE_3__.hideLicenseIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: `actIconBtn ${copied ? 'isCopied' : ''}`,
    onClick: copyLicense,
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Copy license to clipboard')
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.copyIcon, copied && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "actCopiedTip"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Copied'))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("footer", {
    className: "actFoot"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "actLinkBtn",
    onClick: () => setShowActivationForm(true)
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.refreshIcon, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Change license')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "actLinkBtn isDanger",
    onClick: () => setShowConfirm(true)
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Deactivate license')))), !isLoading && !showSuccessView && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actBody"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "actField"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "actFieldLabel"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.keyIcon, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('License key')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    value: licenseKey,
    placeholder: "xxxx-xxxx-xxxx-xxxx-xxxx-xxxx",
    onChange: e => setLicenseKey(e.target.value),
    onKeyDown: e => e.key === 'Enter' && licenseKey.trim() && handleActivation(),
    disabled: isLoading,
    autoFocus: true,
    spellCheck: false,
    autoCapitalize: "none",
    autoCorrect: "off"
  })), error && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actError"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.infoIcon, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, error)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "actPrimaryBtn",
    onClick: handleActivation,
    disabled: isLoading || !licenseKey.trim()
  }, isLoading ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Activating…') : isChangeLicense ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Update License') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Activate License')), !isChangeLicense && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "actHelp"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Can't find your key?"), ' ', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: `https://dashboard.freemius.com/license-recovery/${product_id}/${slug}/`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Recover license'), _utils_icons__WEBPACK_IMPORTED_MODULE_3__.externalIcon), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('or'), ' ', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "https://freemius.com/help/documentation/wordpress-sdk/license-activation-issues/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('activation help'), _utils_icons__WEBPACK_IMPORTED_MODULE_3__.externalIcon)), !isChangeLicense && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actPermsBlock"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", null, name, ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('needs the following to deliver updates & security patches')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "actPerms"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "actPermIcon"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.shieldIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('License essentials')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Homepage URL · Plugin version · SDK version')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "actPermIcon"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.refreshIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Plugin state')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether the plugin is active, deactivated or uninstalled')))))), !isChangeLicense && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("footer", {
    className: "actLegalRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: `https://freemius.com/product/license-activation/${product_id}/${slug}/`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Powered by Freemius')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "\xB7"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "https://freemius.com/privacy/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Privacy Policy')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "\xB7"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: `https://freemius.com/product/${product_id}/${slug}/legal/eula/`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('License Agreement'))), isChangeLicense && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "actLinkBtn isCenter",
    onClick: () => setShowActivationForm(false)
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cancel and keep current license')))), showConfirm && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actModal",
    role: "dialog",
    "aria-modal": "true"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actModalBackdrop",
    onClick: () => setShowConfirm(false)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actModalContent"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actModalIcon"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.infoIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Deactivate this license?')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You can re-activate it later on this site or move it to a different one.')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actModalNote"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Premium features and automatic updates will stop on this site until you re-activate.')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("footer", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "actModalCancel",
    onClick: () => setShowConfirm(false)
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Keep license active')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "actModalAction",
    onClick: handleDeactivate
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Yes, deactivate'))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Activation);

/***/ },

/***/ "../bpl-tools/Admin/Activation/useActivateLicense.js"
/*!***********************************************************!*\
  !*** ../bpl-tools/Admin/Activation/useActivateLicense.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Hook to manage license activation.
 * 
 * @param {object} params - Configuration parameters
 * @param {string} params.product_id - Freemius product ID
 * @param {string} params.public_key - Freemius public key
 * @returns {object} Activation methods and state
 */
const useActivateLicense = ({
  product_id,
  public_key,
  licenseActiveNonce
} = {}) => {
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const activateLicense = licenseKey => {
    if (!licenseKey.trim()) {
      return Promise.reject(new Error('Please enter a license key'));
    }
    setIsLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      wp.ajax.post(`bpl_${product_id}_activate_license`, {
        license_key: licenseKey,
        product_id: product_id || '',
        public_key: public_key || '',
        nonce: licenseActiveNonce
      }).done(res => {
        setIsLoading(false);
        resolve(res);
      }).fail(err => {
        setIsLoading(false);
        const message = err?.message || 'Activation failed';
        setError(message);
        reject(err);
      });
    });
  };
  return {
    activateLicense,
    isLoading,
    error
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useActivateLicense);

/***/ },

/***/ "../bpl-tools/Admin/Activation/useDeactivateLicense.js"
/*!*************************************************************!*\
  !*** ../bpl-tools/Admin/Activation/useDeactivateLicense.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Hook to manage license deactivation.
 * 
 * @returns {object} Deactivation methods and state
 */
const useDeactivateLicense = ({
  product_id,
  licenseActiveNonce
}) => {
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const deactivateLicense = () => {
    setIsLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      wp.ajax.post(`bpl_${product_id}_deactivate_license`, {
        nonce: licenseActiveNonce
      }).done(res => {
        setIsLoading(false);
        resolve(res);
      }).fail(err => {
        setIsLoading(false);
        const message = err?.message || 'Deactivation failed';
        setError(message);
        reject(err);
      });
    });
  };
  return {
    deactivateLicense,
    isLoading,
    error
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useDeactivateLicense);

/***/ },

/***/ "../bpl-tools/Admin/Activation/useLicense.js"
/*!***************************************************!*\
  !*** ../bpl-tools/Admin/Activation/useLicense.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _useLicenseStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useLicenseStatus */ "../bpl-tools/Admin/Activation/useLicenseStatus.js");
/* harmony import */ var _useActivateLicense__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useActivateLicense */ "../bpl-tools/Admin/Activation/useActivateLicense.js");
/* harmony import */ var _useDeactivateLicense__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useDeactivateLicense */ "../bpl-tools/Admin/Activation/useDeactivateLicense.js");





/**
 * Hook to manage license status, activation, and deactivation.
 * Consolidates specialized hooks into a single interface.
 * 
 * @param {object} params - Configuration parameters
 * @returns {object} License state and methods
 */
const useLicense = (params = {}) => {
  const {
    isActivated,
    activatedLicense,
    isLoading: isStatusLoading,
    error: statusError,
    refetch: refetchStatus,
    setIsActivated,
    setActivatedLicense
  } = (0,_useLicenseStatus__WEBPACK_IMPORTED_MODULE_1__["default"])(params);
  const {
    activateLicense: performActivation,
    isLoading: isActivating,
    error: activationError
  } = (0,_useActivateLicense__WEBPACK_IMPORTED_MODULE_2__["default"])(params);
  const {
    deactivateLicense: performDeactivation,
    isLoading: isDeactivating,
    error: deactivationError
  } = (0,_useDeactivateLicense__WEBPACK_IMPORTED_MODULE_3__["default"])(params);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');

  // Sync local isLoading
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setIsLoading(isStatusLoading || isActivating || isDeactivating);
  }, [isStatusLoading, isActivating, isDeactivating]);

  // Sync local error
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const rawError = statusError || activationError || deactivationError;
    if (rawError) {
      const normalizedError = rawError?.message || (typeof rawError === 'string' ? rawError : 'An error occurred');
      setError(normalizedError);
    } else {
      setError('');
    }
  }, [statusError, activationError, deactivationError]);
  const activateLicense = async licenseKey => {
    try {
      await performActivation(licenseKey);
      setIsActivated(true);
      setActivatedLicense(licenseKey);
      return true;
    } catch (err) {
      return false;
    }
  };
  const deactivateLicense = async () => {
    try {
      await performDeactivation();
      setIsActivated(false);
      setActivatedLicense('');
      return true;
    } catch (err) {
      return false;
    }
  };
  return {
    isActivated,
    isLoading,
    error,
    activatedLicense,
    activateLicense,
    deactivateLicense,
    setError,
    refetch: refetchStatus
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useLicense);

/***/ },

/***/ "../bpl-tools/Admin/Activation/useLicenseStatus.js"
/*!*********************************************************!*\
  !*** ../bpl-tools/Admin/Activation/useLicenseStatus.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks_useWPAjax__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useWPAjax */ "../bpl-tools/hooks/useWPAjax.js");



/**
 * Hook to manage license status.
 * 
 * @returns {object} Status state and refetch method
 */
const useLicenseStatus = ({
  product_id,
  licenseActiveNonce
}) => {
  const [isActivated, setIsActivated] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [activatedLicense, setActivatedLicense] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    data,
    isLoading,
    refetch,
    error
  } = (0,_hooks_useWPAjax__WEBPACK_IMPORTED_MODULE_1__["default"])(`bpl_${product_id}_get_license_status`, {
    nonce: licenseActiveNonce
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (data) {
      setIsActivated(data.is_activated || false);
      if (data.license_key) {
        setActivatedLicense(data.license_key);
      }
    }
  }, [data]);
  return {
    isActivated,
    activatedLicense,
    isLoading,
    error,
    refetch,
    setIsActivated,
    setActivatedLicense
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useLicenseStatus);

/***/ },

/***/ "../bpl-tools/Admin/Demos/index.js"
/*!*****************************************!*\
  !*** ../bpl-tools/Admin/Demos/index.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/icons */ "../bpl-tools/Admin/utils/icons.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Demos/style.scss");

/**
	* Demos Component
	*
	* @props name (required): plugin name shown in the page heading (String)
	* @props isPremium (required): whether the plugin is premium (Boolean)
	* @props demoInfo (required): {demos, allInOneLabel?, allInOneLink?} demo data (Object)
	*/





const CATEGORY_COLORS = ['#3b82f6',
// blue
'#10b981',
// emerald
'#8b5cf6',
// violet
'#f59e0b',
// amber
'#ec4899',
// pink
'#06b6d4',
// cyan
'#f43f5e',
// rose
'#14b8a6' // teal
];
const Demos = ({
  name,
  isPremium,
  demoInfo
}) => {
  const {
    demos
  } = demoInfo;
  const [activeCategory, setActiveCategory] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('All');
  const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [openIndex, setOpenIndex] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [iframeLoading, setIframeLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const categories = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ['All', ...demos.filter(d => d.children?.length > 0 || d.url && d.url !== '#').map(d => d.title)], [demos]);
  const categoryAccents = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const map = {};
    const activeCats = categories.filter(cat => cat !== 'All');
    activeCats.forEach((cat, index) => {
      map[cat] = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
    });
    return map;
  }, [categories]);
  const allCards = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const cards = [];
    demos.forEach(demo => {
      const accent = categoryAccents[demo.title];
      const processCard = cardData => ({
        ...cardData,
        category: demo.title,
        categoryIcon: demo.icon,
        accent,
        _searchTarget: `${cardData.title.toLowerCase()} ${demo.title.toLowerCase()}`
      });
      if (demo.children?.length) {
        demo.children.forEach(child => cards.push(processCard(child)));
      } else if (demo.url && demo.url !== '#') {
        cards.push(processCard(demo));
      }
    });
    return cards;
  }, [demos, categoryAccents]);
  const filtered = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const q = search.trim().toLowerCase();
    return allCards.filter(card => {
      if (activeCategory !== 'All' && card.category !== activeCategory) return false;
      if (q && !card._searchTarget.includes(q)) return false;
      return true;
    });
  }, [allCards, activeCategory, search]);
  const active = openIndex !== null ? filtered[openIndex] : null;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (active) setIframeLoading(true);
  }, [active?.url]);
  const isModalOpen = openIndex !== null;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isModalOpen) return;
    const handler = e => {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') setOpenIndex(i => Math.min(i + 1, filtered.length - 1));
      if (e.key === 'ArrowLeft') setOpenIndex(i => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, filtered.length]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardDemos"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "hero"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "eyebrow"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Live Demos')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('See the %s in action'), name)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Browse ready-made demos - click any card to open a live, interactive preview.'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "toolbar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "search"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.searchIcon, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    value: search,
    placeholder: "Search demos\u2026",
    onChange: e => setSearch(e.target.value)
  }), search && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "searchClear",
    onClick: () => setSearch(''),
    "aria-label": "Clear search"
  }, "\xD7")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "chips",
    role: "tablist"
  }, categories.map(cat => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: cat,
    type: "button",
    role: "tab",
    "aria-selected": activeCategory === cat,
    className: `chip ${activeCategory === cat ? 'isActive' : ''}`,
    style: cat !== 'All' ? {
      '--accent': categoryAccents[cat]
    } : undefined,
    onClick: () => setActiveCategory(cat)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "chipDot"
  }), cat)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "count"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, filtered.length), " ", filtered.length === 1 ? 'demo' : 'demos', activeCategory !== 'All' && ` in ${activeCategory}`, search.trim() && ` matching "${search}"`), filtered.length === 0 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "empty"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.searchIcon, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "No demos found"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Try a different search or category.")) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid"
  }, filtered.map((card, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: `${card.title}-${i}`,
    type: "button",
    className: "card",
    style: card.accent ? {
      '--accent': card.accent
    } : undefined,
    onClick: () => setOpenIndex(i)
  }, card.categoryIcon && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cardIcon"
  }, 'string' === typeof card.categoryIcon ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    dangerouslySetInnerHTML: {
      __html: card.categoryIcon
    }
  }) : card.categoryIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "cardCat"
  }, card.category), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "cardTitle"
  }, card.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "cardAction"
  }, "Preview", _utils_icons__WEBPACK_IMPORTED_MODULE_2__.arrowRightIcon)))), active && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modal",
    role: "dialog",
    "aria-modal": "true"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalBackdrop",
    onClick: () => setOpenIndex(null)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalContent"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "modalHead"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalTitleWrap"
  }, active.accent && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "modalCat",
    style: {
      background: active.accent
    }
  }, active.category), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, active.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "modalProgress"
  }, openIndex + 1, " of ", filtered.length)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalActions"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "modalOpen",
    href: active.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Open in new tab", _utils_icons__WEBPACK_IMPORTED_MODULE_2__.externalIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "modalClose",
    onClick: () => setOpenIndex(null),
    "aria-label": "Close demo"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.closeIcon))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalStage"
  }, openIndex > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "modalNav modalNavPrev",
    onClick: () => setOpenIndex(openIndex - 1),
    "aria-label": "Previous demo"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.chevronLeftIcon), iframeLoading && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "iframeLoader"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "spinner"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "Loading demo\u2026")), active.type === 'iframe' ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("iframe", {
    src: active.url,
    title: `${active.title} demo`,
    sandbox: "allow-scripts allow-same-origin allow-popups allow-forms",
    onLoad: () => setIframeLoading(false)
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "imgScroll"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: active.url,
    alt: active.title,
    onLoad: () => setIframeLoading(false)
  })), openIndex < filtered.length - 1 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "modalNav modalNavNext",
    onClick: () => setOpenIndex(openIndex + 1),
    "aria-label": "Next demo"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.chevronRightIcon)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Demos);

/***/ },

/***/ "../bpl-tools/Admin/FeatureCompare/index.js"
/*!**************************************************!*\
  !*** ../bpl-tools/Admin/FeatureCompare/index.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Components_Button_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Components/Button/Button */ "../bpl-tools/Components/Button/Button.js");
/* harmony import */ var _lib_fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/fs */ "../bpl-tools/Admin/lib/fs.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/FeatureCompare/style.scss");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/icons */ "../bpl-tools/Admin/utils/icons.js");








/**
 * Free vs Pro feature comparison table — fetches live plan data, renders plan price
 * cards, a searchable feature breakdown table, and a Pro CTA banner.
 *
 * @param {string[]} props.plans				- Plan names to compare, e.g. ['free', 'pro']
 * @param {object}	props.freemius				- {product_id, public_key} — spread from dashboardInfo via props
 * @param {object}	[props.hero]				- Override hero: {eyebrow?, title?, description?}
 * @param {object}	[props.ctaBanner]			- Override CTA banner: {title?, description?, ctaLabel?}
 * @param {object}	[props.planDescriptions]	- Override plan taglines: {free?, pro?}
 */
const FeatureCompare = ({
  plans: planNames = ['free', 'pro'],
  freemius,
  hero: heroProp,
  ctaBanner: ctaBannerProp,
  planDescriptions
}) => {
  var _heroProp$eyebrow, _heroProp$title, _ctaBannerProp$title, _ctaBannerProp$descri, _ctaBannerProp$ctaLab;
  const {
    product_id,
    public_key
  } = freemius || {};
  const [product, setProduct] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [cycles, setCycles] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [cycle, setCycle] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [query, setQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!product_id) return;
    let mounted = true;
    setIsLoading(true);
    fetch(`https://api.bplugins.com/wp-json/bpl/v1/products/${product_id}`).then(r => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)).then(data => {
      if (mounted) setProduct(data);
    }).catch(() => {
      if (mounted) setProduct({});
    }).finally(() => {
      if (mounted) setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [product_id]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!product?.id) return;
    const visiblePlans = product?.plans?.filter(p => planNames.includes(p.name)) || [];
    const proPlan = visiblePlans.find(p => p.name !== 'free') || visiblePlans[0] || {};
    const singlePrices = proPlan?.pricing?.[0];
    if (singlePrices && typeof singlePrices === 'object') {
      const c = [];
      if (singlePrices.monthly !== undefined) c.push({
        name: 'monthly',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Monthly'),
        short: '/mo'
      });
      if (singlePrices.annual !== undefined) c.push({
        name: 'annual',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Yearly'),
        short: '/yr',
        isDefault: true
      });
      if (singlePrices.lifetime !== undefined) c.push({
        name: 'lifetime',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Lifetime'),
        short: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('one-time')
      });
      setCycles(c);
      setCycle(c.find(cc => cc.isDefault)?.name || c[0]?.name || '');
    } else {
      setCycles([]);
      setCycle('');
    }
  }, [product]);
  if (isLoading) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "bPlDashboardFeatureCompare bPlDashboardFeatureCompareLoading"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "fcSpinner"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading feature comparison…')));
  }
  if (!product?.id) return null;
  const visiblePlans = product?.plans?.filter(p => planNames.includes(p.name)) || [];
  const proPlan = visiblePlans.find(p => p.name !== 'free');
  const baseFeatures = visiblePlans[visiblePlans.length - 1]?.features || [];
  const features = baseFeatures.map(bf => {
    const presentIn = visiblePlans.filter(p => p.features.some(f => f.title === bf.title)).map(p => p.id);
    return {
      ...bf,
      plans: presentIn
    };
  });
  visiblePlans.forEach(p => {
    p.features.forEach(f => {
      if (!features.some(x => x.title === f.title)) {
        features.push({
          ...f,
          plans: [p.id]
        });
      }
    });
  });
  const freePlan = visiblePlans.find(p => p.name === 'free');
  features.sort((a, b) => {
    const aInFree = freePlan ? a.plans?.includes(freePlan.id) : false;
    const bInFree = freePlan ? b.plans?.includes(freePlan.id) : false;
    if (aInFree === bInFree) return 0;
    return aInFree ? -1 : 1;
  });
  let annualSavingsPct = 0;
  const samplePricing = proPlan?.pricing?.find(p => parseInt(p.licenses) === 1);
  if (samplePricing?.monthly && samplePricing?.annual) {
    const full = parseFloat(samplePricing.monthly) * 12;
    const annual = parseFloat(samplePricing.annual);
    if (full > 0) annualSavingsPct = Math.round((full - annual) / full * 100);
  }
  const proOnlyCount = features.filter(f => f.plans.length === 1 && proPlan && f.plans[0] === proPlan.id).length;
  const q = query.trim().toLowerCase();
  const filteredFeatures = q ? features.filter(f => f.title.replace(/<[^>]+>/g, '').toLowerCase().includes(q)) : features;
  const hero = {
    eyebrow: (_heroProp$eyebrow = heroProp?.eyebrow) !== null && _heroProp$eyebrow !== void 0 ? _heroProp$eyebrow : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Compare'),
    title: (_heroProp$title = heroProp?.title) !== null && _heroProp$title !== void 0 ? _heroProp$title : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Free vs Pro at a glance')
  };
  const ctaBanner = {
    title: (_ctaBannerProp$title = ctaBannerProp?.title) !== null && _ctaBannerProp$title !== void 0 ? _ctaBannerProp$title : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ready to unlock everything?'),
    description: (_ctaBannerProp$descri = ctaBannerProp?.description) !== null && _ctaBannerProp$descri !== void 0 ? _ctaBannerProp$descri : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upgrade to Pro and get every feature, future updates, and priority support — backed by a 14 days money-back guarantee.'),
    ctaLabel: (_ctaBannerProp$ctaLab = ctaBannerProp?.ctaLabel) !== null && _ctaBannerProp$ctaLab !== void 0 ? _ctaBannerProp$ctaLab : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Pro now →')
  };
  const currentCycle = cycles.find(c => c.name === cycle);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardFeatureCompare"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "fcHero"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "fcEyebrow"
  }, hero.eyebrow), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, hero.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, heroProp?.description ? heroProp.description : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('See exactly what unlocks when you upgrade.'), ' ', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, proOnlyCount), ' ', proOnlyCount === 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('feature is') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('features are'), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('exclusive to Pro.')))), cycles.length > 1 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fcCycleWrap"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fcCycle",
    role: "tablist"
  }, cycles.map(c => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: c.name,
    type: "button",
    role: "tab",
    "aria-selected": c.name === cycle,
    className: c.name === cycle ? 'isActive' : '',
    onClick: () => setCycle(c.name)
  }, c.label, c.name === 'annual' && annualSavingsPct > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "fcSave"
  }, `Save ${annualSavingsPct}%`))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fcPlans"
  }, visiblePlans.map(plan => {
    var _planDescriptions$fre, _planDescriptions$pro;
    const isFree = plan.name === 'free';
    const price = Array.isArray(plan.pricing) ? plan.pricing.find(p => parseInt(p.licenses) === 1)?.[cycle] : '0';
    const suffix = currentCycle?.short || '';
    const cycleText = currentCycle?.label || '';
    const freeDesc = (_planDescriptions$fre = planDescriptions?.free) !== null && _planDescriptions$fre !== void 0 ? _planDescriptions$fre : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Free forever — all the essentials to get started.');
    const proDesc = (_planDescriptions$pro = planDescriptions?.pro) !== null && _planDescriptions$pro !== void 0 ? _planDescriptions$pro : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Everything in Free, plus advanced features and priority support.');
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: plan.id,
      className: `fcPlan is${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "fcPlanHead"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "fcPlanTag"
    }, plan.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, plan.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, isFree ? freeDesc : proDesc)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "fcPlanPrice"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "fcCurr"
    }, "$"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "fcAmt"
    }, isFree ? '0' : price || '—'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "fcCyc"
    }, isFree ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('forever') : suffix === (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('one-time') ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('one-time') : `${suffix} · ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('billed')} ${cycleText.toLowerCase()}`)), isFree ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "fcPlanCtaHave",
      "aria-disabled": "true"
    }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.checkCircleIcon, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You Already Have It')) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_2__["default"], {
      className: "fcPlanCta",
      onClick: e => {
        e.preventDefault();
        // eslint-disable-next-line no-undef
        new FS.Checkout({
          plugin_id: product_id,
          plan_id: plan.id,
          public_key
        }).open({
          licenses: 1,
          billing_cycle: cycle
        });
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Pro →')));
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fcTableWrap"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fcTableHead"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Feature breakdown')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fcSearchBox"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.searchIcon, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter features…'),
    value: query,
    onChange: e => setQuery(e.target.value)
  }), query && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => setQuery(''),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Clear filter')
  }, "\xD7"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fcTableScroll"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "fcTable"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Feature')), visiblePlans.map(p => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    key: p.id,
    className: p.name === 'free' ? 'isFreeCol' : 'isProCol'
  }, p.name === 'free' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Free') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pro'))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, filteredFeatures.length === 0 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: visiblePlans.length + 1,
    className: "fcEmpty"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No features match your search.'))) : filteredFeatures.map((feature, i) => {
    const isProOnly = proPlan && feature.plans.length === 1 && feature.plans[0] === proPlan.id;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
      key: i,
      className: isProOnly ? 'isProOnly' : ''
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      dangerouslySetInnerHTML: {
        __html: feature.title
      }
    }), isProOnly && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "fcRowTag"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pro only'))), visiblePlans.map(plan => {
      const has = feature.plans?.includes(plan.id);
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
        key: plan.id,
        className: plan.name === 'free' ? 'isFreeCol' : 'isProCol'
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: `fcCell ${has ? 'isCheck' : 'isCross'}`,
        "aria-label": has ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Included') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Not included')
      }, has ? _utils_icons__WEBPACK_IMPORTED_MODULE_5__.checkCircleIcon : _utils_icons__WEBPACK_IMPORTED_MODULE_5__.closeIcon));
    }));
  }))))), proPlan && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "fcCtaBanner"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, ctaBanner.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, ctaBanner.description)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "fcPlanCta",
    onClick: e => {
      e.preventDefault();
      // eslint-disable-next-line no-undef
      new FS.Checkout({
        plugin_id: product_id,
        plan_id: proPlan.id,
        public_key
      }).open({
        licenses: 1,
        billing_cycle: cycle
      });
    }
  }, ctaBanner.ctaLabel)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FeatureCompare);

/***/ },

/***/ "../bpl-tools/Admin/Header/index.js"
/*!******************************************!*\
  !*** ../bpl-tools/Admin/Header/index.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Components/Button/Button */ "../bpl-tools/Components/Button/Button.js");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/icons */ "../bpl-tools/Admin/utils/icons.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Header/style.scss");






/**
 * Dashboard page header — logo, plugin name, version badge, nav slot, and action buttons.
 *
 * @param {object}	props
 * @param {string}	props.name				- Plugin name displayed as <h1>
 * @param {string}	props.version				- Version string, rendered as v{version}
 * @param {boolean}	props.isPremium			- Hides "Upgrade Pro" button; switches Our Plugins to Button
 * @param {object}	[props.media]				- {logo?} — plugin logo image URL
 * @param {boolean}	[props.displayOurPlugins]	- Shows the "Our Plugins" button when true
 * @param {React.ReactNode} [props.children]		- Nav links rendered between the plugin info and action buttons
 */
const Header = props => {
  const {
    name,
    media,
    version,
    isPremium,
    displayOurPlugins,
    children
  } = props;
  const {
    logo
  } = media || {};
  const [isNavOpen, setIsNavOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Inject 'open' class onto the nav child and close menu on link click
  const enhancedChildren = react__WEBPACK_IMPORTED_MODULE_0__.Children.map(children, child => {
    if (!(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(child)) return child;
    const cls = child.props.className || '';
    if (!cls.includes('bPlDashboardNav')) return child;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(child, {
      className: `${cls}${isNavOpen ? ' open' : ''}`,
      onClick: e => {
        child.props.onClick?.(e);
        setIsNavOpen(false);
      }
    });
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardHeader"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pluginInfo",
    wrap: true
  }, logo && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: logo,
    alt: name || 'Plugin from bPlugins'
  }), name && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, name), version && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pluginVersion"
  }, "v", version)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: `bplHamburger${isNavOpen ? ' open' : ''}`,
    onClick: () => setIsNavOpen(v => !v),
    "aria-label": "Toggle navigation",
    "aria-expanded": isNavOpen
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null)), enhancedChildren, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "navButtons"
  }, displayOurPlugins && (isPremium ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__["default"], {
    href: "#our-plugins"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.ourPluginsIcon, "Our Plugins") : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "linkButton",
    href: "#our-plugins"
  }, "Our Plugins")), !isPremium && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: "upgrade",
    href: "#pricing"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.upgradeProIcon, "Upgrade Pro")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);

/***/ },

/***/ "../bpl-tools/Admin/OurPlugins/index.js"
/*!**********************************************!*\
  !*** ../bpl-tools/Admin/OurPlugins/index.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Components_Button_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Components/Button/Button */ "../bpl-tools/Components/Button/Button.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/OurPlugins/style.scss");

/**
	* OurPlugins Component
	*
	* @props slug (required): current plugin slug, excluded from the list (String)
	* @props slugs (optional): DEFAULT_SLUGS - override the default slug list (Array)
	* @props installedPlugins (required): injected by withSelect; locally installed plugins (Array)
	*/







const DEFAULT_SLUGS = ['3d-viewer', 'html5-video-player', 'html5-audio-player', 'pdf-poster', 'document-emberdder', 'advanced-post-block', 'advance-custom-html', 'b-carousel-block', 'b-blocks', 'embed-lottie-player', 'b-slider'];
const formatCount = num => {
  if (num === undefined || num === null) return '0';
  const abs = Math.abs(num);
  if (abs >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (abs >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
};
const getDisplayName = name => {
  if (!name) return '';
  const decoded = name.replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&#45;/g, '-');
  return decoded.split(/\s*[–\-—]\s*/)[0].trim();
};
const stripTags = s => (s || '').replace(/<[^>]+>/g, '');
const StarRow = ({
  rating = 0
}) => {
  const stars = Math.round(rating / 20);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ourPlugStars",
    "aria-label": `${(rating / 20).toFixed(1)} out of 5`
  }, [1, 2, 3, 4, 5].map(i => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    key: i,
    viewBox: "0 0 24 24",
    width: 13,
    height: 13,
    fill: i <= stars ? '#fbbf24' : '#e5e7eb'
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M12 2l2.39 6.95L22 9.27l-5.45 4.73L18.18 22 12 17.77 5.82 22l1.63-7.99L2 9.27l7.61-.32L12 2z"
  }))));
};

/**
 * Single plugin card with self-contained install/activate state.
 *
 * @param {object} props
 * @param {object} props.plugin		- Plugin data from WordPress.org API
 * @param {string} [props.path]		- Installed plugin path (e.g. 'slug/slug.php')
 * @param {string} props.initStatus	- 'notfound' | 'installed' | 'activated'
 */
const PluginCard = ({
  plugin,
  path,
  initStatus
}) => {
  const {
    name,
    slug,
    icons,
    short_description,
    version
  } = plugin;
  const [status, setStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(initStatus);
  const handleInstall = async () => {
    setStatus(status === 'installed' ? 'activating' : 'installing');
    try {
      if (status === 'installed' && path) {
        await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
          path: `/wp/v2/plugins/${path}`,
          method: 'POST',
          data: {
            status: 'active'
          }
        });
        setStatus('success');
        setTimeout(() => setStatus('activated'), 1000);
        return;
      }
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/wp/v2/plugins',
        method: 'POST',
        data: {
          slug,
          status: 'active'
        }
      });
      setStatus('success');
      setTimeout(() => setStatus('activated'), 1000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(status === 'installed' ? 'installed' : 'notfound'), 1400);
    }
  };
  const label = (() => {
    switch (status) {
      case 'activated':
      case 'success':
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Activated');
      case 'installed':
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Activate');
      case 'activating':
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Activating…');
      case 'installing':
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Installing…');
      case 'error':
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Failed');
      default:
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Install & Activate');
    }
  })();
  const isDone = status === 'activated' || status === 'success';
  const isBusy = status === 'installing' || status === 'activating';
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("article", {
    className: "ourPlugCard"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugCardTop"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "ourPlugIcon",
    src: icons?.['1x'] || icons?.['2x'] || '',
    alt: name
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugCardId"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    dangerouslySetInnerHTML: {
      __html: getDisplayName(name)
    }
  }), version && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ourPlugVer"
  }, "v", version)), isDone && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ourPlugActive"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 24 24",
    width: 12,
    height: 12,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
    points: "20 6 9 17 4 12"
  })), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Active'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "ourPlugDesc",
    dangerouslySetInnerHTML: {
      __html: stripTags(short_description)
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugStats"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ourPlugStat"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 24 24",
    width: 14,
    height: 14,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
    points: "7 10 12 15 17 10"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
    x1: "12",
    y1: "15",
    x2: "12",
    y2: "3"
  })), formatCount(plugin.downloaded)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ourPlugStat"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StarRow, {
    rating: plugin.rating
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, ((plugin.rating || 0) / 20).toFixed(1)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_4__["default"], {
    className: `ourPlugCta status-${status}`,
    disabled: isDone || isBusy,
    onClick: handleInstall
  }, isBusy && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ourPlugCtaSpinner"
  }), label));
};

/**
 * Fetches and displays other bPlugins products with search, sort, and one-click install/activate.
 *
 * @param {string}		props.slug				- Current plugin slug — excluded from the list
 * @param {string[]}	[props.slugs]			- Override the default slug list
 * @param {Array}		props.installedPlugins	- Injected by withSelect; locally installed plugins
 */
const OurPlugins = ({
  slug,
  slugs: allSlugs = DEFAULT_SLUGS,
  installedPlugins
}) => {
  const [plugins, setPlugins] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [sort, setSort] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('popular');
  const slugs = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (allSlugs || []).filter(s => s !== slug), [allSlugs, slug]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!slugs.length) return;
    let cancelled = false;
    setIsLoading(true);
    fetch('https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[author]=bplugins&request[per_page]=100&request[fields]=title,name,slug,icons,short_description,version,active_installs,rating,ratings,downloaded', {
      credentials: 'omit',
      mode: 'cors'
    }).then(r => r.json()).then(data => {
      if (cancelled) return;
      setPlugins((data?.plugins || []).filter(p => slugs.includes(p.slug)));
    }).catch(() => {
      if (!cancelled) setPlugins([]);
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(slugs)]);
  const filteredSorted = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const q = search.trim().toLowerCase();
    let list = plugins.filter(p => !q || p.name.toLowerCase().includes(q) || (p.short_description || '').toLowerCase().includes(q));
    if (sort === 'popular') list.sort((a, b) => (b.active_installs || 0) - (a.active_installs || 0));
    if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === 'name') list.sort((a, b) => getDisplayName(a.name).localeCompare(getDisplayName(b.name)));
    return list;
  }, [plugins, search, sort]);
  if (isLoading) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "bPlDashboardOurPlugins bPlDashboardOurPluginsLoading"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "ourPlugSpinner"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Fetching plugins from the WordPress directory…')));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardOurPlugins"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "ourPlugHero"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ourPlugEyebrow"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Made by bPlugins')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Discover more plugins from our team')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Hand-crafted WordPress plugins built with the same care and quality. Install any of them with a single click.'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugToolbar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugSearch"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Search plugins…'),
    value: search,
    onChange: e => setSearch(e.target.value)
  }), search && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => setSearch(''),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Clear search')
  }, "\xD7")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugSortLabel"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Sort by')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugSort",
    role: "tablist"
  }, [{
    key: 'popular',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Popular')
  }, {
    key: 'rating',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Top Rated')
  }, {
    key: 'name',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('A–Z')
  }].map(opt => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: opt.key,
    type: "button",
    role: "tab",
    "aria-selected": sort === opt.key,
    className: sort === opt.key ? 'isActive' : '',
    onClick: () => setSort(opt.key)
  }, opt.label)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "ourPlugCount"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, filteredSorted.length), ' ', filteredSorted.length === 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('plugin') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('plugins'), search && ` ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('matching')} "${search}"`), filteredSorted.length === 0 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugEmpty"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 24 24",
    width: 36,
    height: 36,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No plugins match')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Try a different keyword.'))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ourPlugGrid"
  }, filteredSorted.map(plugin => {
    var _installedPlugins$fin;
    const installed = (_installedPlugins$fin = installedPlugins?.find(i => i?.plugin?.includes(plugin.slug))) !== null && _installedPlugins$fin !== void 0 ? _installedPlugins$fin : null;
    const activated = installed ? installed.status === 'active' : false;
    const initStatus = activated ? 'activated' : installed ? 'installed' : 'notfound';
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PluginCard, {
      key: plugin.slug,
      plugin: plugin,
      path: installed?.plugin,
      initStatus: initStatus
    });
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.withSelect)(select => {
  const {
    getPlugins
  } = select('core');
  return {
    installedPlugins: getPlugins?.({
      per_page: -1
    })
  };
})(OurPlugins));

/***/ },

/***/ "../bpl-tools/Admin/Overview/VideoPlayer.js"
/*!**************************************************!*\
  !*** ../bpl-tools/Admin/Overview/VideoPlayer.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/icons */ "../bpl-tools/Admin/utils/icons.js");
/* harmony import */ var _utils_video__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/video */ "../bpl-tools/Admin/utils/video.js");

/**
	* VideoPlayer Component
	*
	* @props src (required): video URL (String)
	* @props width (optional): '100%' (String)
	* @props height (optional): 'auto' (String)
	* @props autoPlay (optional): false (Boolean)
	* @props muted (optional): false (Boolean)
	* @props loop (optional): false (Boolean)
	* @props poster (optional): null - poster image URL (String)
	* @props isYoutube (optional): false (Boolean)
	* @props title (optional): 'Video' - iframe title, used for YouTube sources (String)
	*/




const VideoPlayer = ({
  src,
  width = '100%',
  height = 'auto',
  autoPlay = false,
  muted = false,
  loop = false,
  poster = null,
  isYoutube = false,
  title = 'Video'
}) => {
  const videoRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const previewVideoRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const progressBarRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const volumeBarRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const containerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  // const previewCanvasRef = useRef(null)

  const [isPlaying, setIsPlaying] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [currentTime, setCurrentTime] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [duration, setDuration] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [volume, setVolume] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [isMuted, setIsMuted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(muted);
  const [isDragging, setIsDragging] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showControls, setShowControls] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  // const [previewTime, setPreviewTime] = useState(0)
  // const [showPreview, setShowPreview] = useState(false)
  // const [previewPosition, setPreviewPosition] = useState(0)

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Setup preview video
      if (previewVideoRef.current) {
        previewVideoRef.current.src = src;
        previewVideoRef.current.muted = true;
      }
    };
    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(video.currentTime);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
    };

    // keep the overlay in sync when playback is driven by autoPlay or native controls
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isDragging, src]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handleKeyDown = e => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  const handleProgressClick = e => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const progress = (e.clientX - rect.left) / rect.width;
    const time = progress * duration;
    videoRef.current.currentTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(time);
  };
  const handleProgressMouseDown = e => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  // const handleProgressMouseMove = (e) => {
  //	if (!progressBarRef.current || !duration) return

  //	const rect = progressBarRef.current.getBoundingClientRect()
  //	const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  //	const time = progress * duration
  //	const position = (e.clientX - rect.left)

  //	setPreviewTime(time)
  //	setPreviewPosition(position)
  //	setShowPreview(true)

  //	// Update preview video time
  //	if (previewVideoRef.current && previewVideoRef.current.readyState >= 2) {
  //	previewVideoRef.current.currentTime = time
  //	}
  // }

  // const handleProgressMouseEnter = () => {
  //	setShowPreview(true)
  // }

  // const handleProgressMouseLeave = () => {
  //	setShowPreview(false)
  // }

  const handleVolumeClick = e => {
    const rect = volumeBarRef.current.getBoundingClientRect();
    const newVolume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    if (newVolume > 0) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };
  const handleVolumeMouseDown = e => {
    setIsDragging(true);
    handleVolumeClick(e);
  };
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const progressPercentage = duration ? currentTime / duration * 100 : 0;
  const volumePercentage = volume * 100;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handleMouseMove = e => {
      if (isDragging) {
        if (e.target.closest('.progress-bar')) {
          handleProgressClick(e);
        } else if (e.target.closest('.volume-bar')) {
          handleVolumeClick(e);
        }
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: containerRef,
    className: "bPlVideoPlayer",
    style: {
      width,
      height
    },
    onMouseEnter: () => setShowControls(true),
    onMouseLeave: () => setShowControls(!isPlaying)
  }, isYoutube ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlVideoPlayerYoutube"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("iframe", {
    src: (0,_utils_video__WEBPACK_IMPORTED_MODULE_2__.getYoutubeEmbedSrc)(src, {
      autoplay: autoPlay
    }),
    frameBorder: "0",
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    allowFullScreen: true,
    style: {
      width,
      height
    },
    title: title
  })) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
    ref: videoRef,
    className: "video-element",
    src: src,
    poster: poster,
    autoPlay: autoPlay,
    muted: muted,
    loop: loop,
    onClick: togglePlay,
    preload: "metadata"
  }, "Your browser does not support the video tag."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
    ref: previewVideoRef,
    className: "preview-video",
    muted: true,
    preload: "metadata",
    style: {
      display: 'none'
    }
  }), !isPlaying && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "center-play-btn",
    onClick: togglePlay
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "play-icon"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_1__.playFillIcon)), isPlaying && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "center-play-btn pause",
    onClick: togglePlay
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "play-icon"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_1__.pauseFillIcon)), isLoading && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "loading-spinner"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "spinner"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `video-controls ${showControls ? 'visible' : ''}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "control-btn play-pause-btn",
    onClick: togglePlay
  }, isPlaying ? _utils_icons__WEBPACK_IMPORTED_MODULE_1__.playPauseIcon : _utils_icons__WEBPACK_IMPORTED_MODULE_1__.playIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "time-display"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "current-time"
  }, formatTime(currentTime)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "separator"
  }, "/"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "duration"
  }, formatTime(duration))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: progressBarRef,
    className: "progress-bar",
    onClick: handleProgressClick,
    onMouseDown: handleProgressMouseDown
    // onMouseMove={handleProgressMouseMove}
    // onMouseEnter={handleProgressMouseEnter}
    // onMouseLeave={handleProgressMouseLeave}
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-filled",
    style: {
      width: `${progressPercentage}%`
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "progress-handle",
    style: {
      left: `${progressPercentage}%`
    }
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "volume-container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "control-btn volume-btn",
    onClick: toggleMute
  }, isMuted || volume === 0 ? _utils_icons__WEBPACK_IMPORTED_MODULE_1__.volumeMutedIcon : _utils_icons__WEBPACK_IMPORTED_MODULE_1__.volumeOnIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "volume-slider"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: volumeBarRef,
    className: "volume-bar",
    onClick: handleVolumeClick,
    onMouseDown: handleVolumeMouseDown
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "volume-filled",
    style: {
      width: `${volumePercentage}%`
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "volume-handle",
    style: {
      left: `${volumePercentage}%`
    }
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "control-btn fullscreen-btn",
    onClick: toggleFullscreen
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_1__.fullscreenIcon))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VideoPlayer);

/***/ },

/***/ "../bpl-tools/Admin/Pricing/index.js"
/*!*******************************************!*\
  !*** ../bpl-tools/Admin/Pricing/index.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getFeatures: () => (/* binding */ getFeatures)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Components_Button_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Components/Button/Button */ "../bpl-tools/Components/Button/Button.js");
/* harmony import */ var _lib_fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/fs */ "../bpl-tools/Admin/lib/fs.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Pricing/style.scss");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/icons */ "../bpl-tools/Admin/utils/icons.js");

/**
	* Pricing Component
	*
	* @props pricingInfo (required): {pluginId, planId, licenses, cycles?, button, featured, logo?, hero?, included?, trustBadges?, faqs?} plan config (Object). cycles: which billing cycle tabs to show, e.g. ['monthly', 'annual', 'lifetime'] (default all)
	* @props options (required): extra options forwarded to FS.Checkout.open() (Object)
	*/







const getFeatures = (plans, planId) => {
  const freeFeatures = plans.find(p => p.name === 'free')?.features?.map(f => f.title);
  const proFeatures = plans.find(p => p.name === 'pro')?.features?.filter(f => !freeFeatures.includes(f.title)).map(f => f.title);
  const features = {
    'free': freeFeatures,
    'pro': proFeatures
  };
  const planName = plans.find(p => parseInt(p.id) === parseInt(planId))?.name;
  const planFeatures = features[planName] || plans.find(p => parseInt(p.id) === parseInt(planId))?.features?.map(f => f.title);
  return planFeatures || [];
};
const cycleMeta = {
  monthly: {
    suffix: '/mo'
  },
  annual: {
    suffix: '/yr'
  },
  lifetime: {
    suffix: ''
  }
};
const formatPrice = amount => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '—';
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
};
const Pricing = ({
  pricingInfo,
  options
}) => {
  var _heroProp$eyebrow, _heroProp$title, _heroProp$description, _includedProp$tag, _includedProp$title, _includedProp$descrip;
  const {
    pluginId,
    planId,
    licenses,
    cycles: enabledCycles = ['monthly', 'annual', 'lifetime'],
    button,
    featured,
    logo,
    hero: heroProp,
    included: includedProp,
    trustBadges: customTrustBadges,
    faqs: customFaqs
  } = pricingInfo;
  const [product, setProduct] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [isProductLoading, setIsProductLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [cycles, setCycles] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [cycle, setCycle] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [openFaq, setOpenFaq] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!pluginId) return;
    let mounted = true;
    setIsProductLoading(true);
    fetch(`https://api.bplugins.com/wp-json/bpl/v1/products/${pluginId}`).then(r => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)).then(data => {
      if (mounted) setProduct(data);
    }).catch(() => {
      if (mounted) setProduct({});
    }).finally(() => {
      if (mounted) setIsProductLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [pluginId]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!product?.id || !planId) return;
    const {
      plans
    } = product;
    const plan = plans?.find(p => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};
    const singlePrices = plan?.pricing?.[0];
    if (singlePrices && typeof singlePrices === 'object') {
      const all = [];
      if (singlePrices.monthly !== undefined) all.push({
        name: 'monthly',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Monthly')
      });
      if (singlePrices.annual !== undefined) all.push({
        name: 'annual',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Yearly'),
        isDefault: true
      });
      if (singlePrices.lifetime !== undefined) all.push({
        name: 'lifetime',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Lifetime')
      });
      const filtered = all.filter(cc => enabledCycles.includes(cc.name));
      const c = filtered.length ? filtered : all; // fall back to all if config filters everything out
      setCycles(c);
      setCycle(c.find(cc => cc.isDefault)?.name || c[0]?.name || '');
    } else {
      setCycles([]);
      setCycle('');
    }
  }, [product, planId]);
  if (isProductLoading) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "bPlDashboardPricing bPlDashboardPricingLoading"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pricingLoadingSpinner"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading the latest pricing…')));
  }
  if (!product?.id) return null;
  const {
    plans
  } = product;
  const plan = plans?.find(p => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};
  const pricing = plan?.pricing || [];
  const visiblePricing = licenses?.length > 0 ? pricing.filter(p => {
    var _p$licenses;
    return licenses.includes((_p$licenses = p?.licenses) !== null && _p$licenses !== void 0 ? _p$licenses : null);
  }) : pricing;
  const samplePrice = visiblePricing[0];
  let annualSavingsPct = 0;
  if (samplePrice?.monthly && samplePrice?.annual) {
    const fullYear = parseFloat(samplePrice.monthly) * 12;
    const annual = parseFloat(samplePrice.annual);
    if (fullYear > 0) annualSavingsPct = Math.round((fullYear - annual) / fullYear * 100);
  }
  const sharedFeatures = getFeatures(plans, planId);
  const annualSavingsLabel = annualSavingsPct > 0 ? `Save ${annualSavingsPct}%` : '';
  const isLifetimeOnly = cycles.length === 1 && cycles[0]?.name === 'lifetime';
  const hero = {
    eyebrow: (_heroProp$eyebrow = heroProp?.eyebrow) !== null && _heroProp$eyebrow !== void 0 ? _heroProp$eyebrow : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pricing'),
    title: (_heroProp$title = heroProp?.title) !== null && _heroProp$title !== void 0 ? _heroProp$title : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pick the plan that fits your project'),
    description: (_heroProp$description = heroProp?.description) !== null && _heroProp$description !== void 0 ? _heroProp$description : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Same powerful features on every plan — just choose how many sites you need. Upgrade or downgrade any time.')
  };
  const included = {
    tag: (_includedProp$tag = includedProp?.tag) !== null && _includedProp$tag !== void 0 ? _includedProp$tag : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Same on every plan'),
    title: (_includedProp$title = includedProp?.title) !== null && _includedProp$title !== void 0 ? _includedProp$title : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Everything you get, on every license'),
    description: (_includedProp$descrip = includedProp?.description) !== null && _includedProp$descrip !== void 0 ? _includedProp$descrip : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Every feature is available on every license tier. The only difference is how many sites you can activate the plugin on.')
  };
  const trustBadges = customTrustBadges || [{
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('14 days money back'),
    body: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Risk-free purchase'),
    icon: _utils_icons__WEBPACK_IMPORTED_MODULE_5__.moneyBackIcon
  }, {
    title: isLifetimeOnly ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Lifetime updates') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Plugins updates'),
    body: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('On every plan'),
    icon: _utils_icons__WEBPACK_IMPORTED_MODULE_5__.refreshIcon
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Priority support'),
    body: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get help when you need it'),
    icon: _utils_icons__WEBPACK_IMPORTED_MODULE_5__.chatIcon
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Secure checkout'),
    body: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Powered by Freemius'),
    icon: _utils_icons__WEBPACK_IMPORTED_MODULE_5__.lockIcon
  }];
  const faqs = customFaqs || [{
    q: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Can I upgrade my plan later?'),
    a: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Yes — you can upgrade any time from your account. We prorate the difference automatically.')
  }, isLifetimeOnly ? {
    q: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Will I receive updates if I purchase a lifetime license?'),
    a: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Yes, a lifetime license holds lifetime updates and never expires, ensuring you always have access to the latest features and bug fixes without recurring fees.')
  } : {
    q: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('What happens after my license expires?'),
    a: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The plugin keeps working forever. You only lose access to premium features, updates and premium support unless you renew.')
  }, {
    q: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Do you offer refunds?'),
    a: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Absolutely. Every plan is backed by a 14 days no-questions-asked money-back guarantee.')
  }];
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardPricing"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "pricingHero"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pricingEyebrow"
  }, hero.eyebrow), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, hero.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, hero.description)), cycles.length > 1 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pricingCycleWrap"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pricingCycle",
    role: "tablist"
  }, cycles.map(c => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: c.name,
    type: "button",
    role: "tab",
    "aria-selected": c.name === cycle,
    className: c.name === cycle ? 'isActive' : '',
    onClick: () => setCycle(c.name)
  }, c.label, c.name === 'annual' && annualSavingsLabel && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pricingSave"
  }, annualSavingsLabel))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pricingPlans"
  }, visiblePricing.length ? visiblePricing.map((price, index) => {
    const licensesCount = price?.licenses;
    const isFeatured = featured?.selected === (licensesCount || 'null');
    const amount = price?.[cycle];
    const cycleInfo = cycleMeta[cycle] || {
      suffix: ''
    };
    const numericAmount = parseFloat(amount);
    const monthlyEquivalent = cycle === 'annual' && price?.annual ? parseFloat(price.annual) / 12 : null;
    const perSite = licensesCount && !isNaN(numericAmount) ? numericAmount / licensesCount : null;
    const planLabel = !licensesCount ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unlimited Sites') : licensesCount === 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Single Site') : `${licensesCount} ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sites')}`;
    const planTagline = !licensesCount ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('For agencies & enterprise') : licensesCount === 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('For solo creators') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('For freelancers');
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: index,
      className: `pricingPlan ${isFeatured ? 'isFeatured' : ''}`
    }, isFeatured && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pricingBadge"
    }, featured?.text || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Most Popular')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pricingPlanHead"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, planLabel), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, planTagline)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pricingPriceWrap"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pricingPrice"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pricingCurrency"
    }, "$"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pricingAmount"
    }, formatPrice(amount)), cycleInfo.suffix && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pricingSuffix"
    }, cycleInfo.suffix)), perSite !== null && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "pricingEquiv"
    }, "\u2248 $", formatPrice(perSite), " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('per site')), !licensesCount && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "pricingEquiv"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Use on every site you build.')), monthlyEquivalent !== null && cycle === 'annual' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "pricingEquiv"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Billed yearly'), " \xB7 $", formatPrice(monthlyEquivalent), "/mo"), cycle === 'lifetime' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "pricingEquiv"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('One-time payment, pay once forever.')), cycle === 'monthly' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "pricingEquiv"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Billed monthly, cancel anytime.'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_2__["default"], {
      className: "pricingCta",
      onClick: e => {
        e.preventDefault();
        new _lib_fs__WEBPACK_IMPORTED_MODULE_3__["default"].Checkout({
          plugin_id: product.id,
          plan_id: planId,
          public_key: product.public_key
        }).open({
          image: logo || product.icon,
          title: product.title,
          licenses: licensesCount,
          billing_cycle: cycle,
          ...options
        });
      }
    }, button.label));
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pricingEmpty"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No plans available right now.'))), sharedFeatures.length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "pricingIncluded"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "pricingIncludedHead"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pricingIncludedTag"
  }, included.tag), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, included.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, included.description)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "pricingIncludedGrid"
  }, sharedFeatures.map((f, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: i
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pricingIncludedCheck"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.checkCircleIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    dangerouslySetInnerHTML: {
      __html: f
    }
  }))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "pricingTrust"
  }, trustBadges.map((b, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: i,
    className: "pricingTrustItem"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pricingTrustIcon"
  }, b.icon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, b.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, b.body))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "pricingFaq"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Frequently asked questions')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pricingFaqList"
  }, faqs.map((f, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: i,
    className: `pricingFaqItem ${openFaq === i ? 'isOpen' : ''}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "pricingFaqQ",
    "aria-expanded": openFaq === i,
    onClick: () => setOpenFaq(openFaq === i ? null : i)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, f.q), _utils_icons__WEBPACK_IMPORTED_MODULE_5__.chevronDownIcon), openFaq === i && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pricingFaqA"
  }, f.a))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pricing);

/***/ },

/***/ "../bpl-tools/Admin/Welcome/Changelog/index.js"
/*!*****************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/Changelog/index.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Components/Button/Button */ "../bpl-tools/Components/Button/Button.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Welcome/Changelog/style.scss");

/**
	* Changelog Component
	*
	* @props slug (required): WordPress.org slug - builds the read-more link (String)
	* @props changelogs (required): [{type, version, list}] changelog entries (Array)
	* @props limit (optional): 5 - max entries shown (Number)
	* @props loadMoreLabel (optional): read-more button text; omit to hide (String)
	*/



const BADGE_MAP = {
  new: 'new',
  add: 'new',
  update: 'update',
  improve: 'improvement',
  improvement: 'improvement',
  fix: 'fix',
  fixing: 'fix',
  fixed: 'fix',
  remove: 'fix'
};
const processItem = html => html.replace(/^<strong>([^<]+)<\/strong>/i, (_, label) => {
  const clean = label.replace(':', '').trim();
  const cls = BADGE_MAP[clean.toLowerCase()] || 'default';
  return `<strong class="changelogBadge ${cls}">${clean}</strong>`;
});
const Changelog = props => {
  const {
    slug,
    changelogs,
    limit = 5,
    loadMoreLabel
  } = props;
  return changelogs?.length && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardChangelog bPlDashboardCard"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Release Notes(Changelog)..."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "allChangelogs"
  }, changelogs?.slice(0, limit)?.map((changelog, index) => {
    const {
      type,
      version,
      list
    } = changelog;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: index,
      className: `changelog ${type}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
      className: "list"
    }, list?.map((item, token) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      key: token,
      dangerouslySetInnerHTML: {
        __html: processItem(item)
      }
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "time"
    }, version));
  })), loadMoreLabel && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: "mt20",
    target: "_blank",
    rel: "noopener noreferrer",
    href: `https://wordpress.org/plugins/${slug}/#developers`
  }, loadMoreLabel)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Changelog);

/***/ },

/***/ "../bpl-tools/Admin/Welcome/GettingStarted/index.js"
/*!**********************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/GettingStarted/index.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Overview_VideoPlayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Overview/VideoPlayer */ "../bpl-tools/Admin/Overview/VideoPlayer.js");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/icons */ "../bpl-tools/Admin/utils/icons.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Welcome/GettingStarted/style.scss");







/**
 * Tabbed getting-started guide. Renders tab buttons and a sliding step list.
 *
 * @param {object}		props
 * @param {object[]}	props.tabs		- Tab definitions: [{key, label, icon?, video?, isYoutube?, docs?, steps: [{num, title, body, link?: {url, label}}]}]
 * `body` is rendered as HTML via dangerouslySetInnerHTML.
 * A tab with `video` gets a "Watch Video" button that slides in next to the docs link and opens the video in a modal.
 * A tab with `docs` overrides the bottom documentation link with its own tab-specific URL and heading.
 * @param {object}		[props.pages]	- {docs?} — URL for the "Open Documentation" link at the bottom
 */
const GettingStarted = ({
  tabs = [],
  pages
}) => {
  const [active, setActive] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [direction, setDirection] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1); // 1 = moved right, -1 = moved left
  const [showVideo, setShowVideo] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  if (!tabs?.length) return null;
  const activeTab = tabs[active] || {};
  const {
    video,
    docs: tabDocs,
    label
  } = activeTab;
  const docsUrl = tabDocs || pages?.docs || 'https://bplugins.com/docs/';
  const changeTab = index => {
    if (index === active) return;
    setShowVideo(false);
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardGettingStarted bPlDashboardCard"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Getting Started')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pick how you\'d like to start with the plugin - the steps below adapt to your workflow.'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "tabsNav",
    role: "tablist"
  }, tabs.map((tab, index) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: tab.key,
    type: "button",
    role: "tab",
    "aria-selected": active === index,
    className: `tab ${active === index ? 'isActive' : ''}`,
    onClick: () => changeTab(index)
  }, tab.icon && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "tabIcon"
  }, tab.icon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, tab.label)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "tabsViewport"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "tabsTrack",
    style: {
      transform: `translateX(-${active * 100}%)`
    }
  }, tabs.map(tab => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: tab.key,
    className: "tabPanel",
    role: "tabpanel",
    "aria-hidden": tabs[active].key !== tab.key
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "steps"
  }, tab.steps.map(step => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: step.num,
    className: "step"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "stepNum"
  }, step.num), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "stepBody"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, step.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    dangerouslySetInnerHTML: {
      __html: step.body
    }
  }), step.link && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "stepLink",
    href: step.link.url
  }, step.link.label, " \u2192"))))))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "docs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, tabDocs ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Read the %s Documentation'), label) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Read the Full Documentation')), !tabDocs && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Browse guides, settings reference, and examples for every feature.'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "docsActions"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "docsBtn",
    href: docsUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Read Documentation →')), video && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: activeTab.key,
    type: "button",
    className: `videoBtn ${direction > 0 ? 'fromRight' : 'fromLeft'}`,
    onClick: () => setShowVideo(true),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Watch Tutorial')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 668 534"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: "#ff0333",
    d: "m544.3 7.3c-63-4.6-134-7-210.3-7-76.3 0-147.3 2.4-210.3 7-16.6 1.3-32.8 5.7-47.8 13-15 7.2-28.5 17.2-39.8 29.4-11.3 12.3-20.2 26.5-26.3 42-6 15.5-9.1 32-9.1 48.6v253.4c-0.1 16.6 3 33.2 9 48.7 6.1 15.6 15 29.8 26.3 42.1 11.3 12.2 24.8 22.3 39.8 29.5 15 7.3 31.2 11.7 47.9 13 63 4.7 133.3 7 210.3 7 77 0 147.3-2.3 210.3-7 16.7-1.3 32.9-5.7 47.9-13 15-7.2 28.5-17.3 39.8-29.5 11.3-12.3 20.2-26.5 26.3-42.1 6-15.5 9.1-32.1 9-48.7v-253.4c0-16.6-3.1-33.1-9.1-48.6-6.1-15.5-15-29.7-26.3-42-11.3-12.2-24.8-22.2-39.8-29.4-15-7.3-31.2-11.7-47.8-13z"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: "#fff",
    d: "m267.3 196.3v141.4c0 2.9 0.8 5.9 2.3 8.4 1.5 2.6 3.6 4.7 6.2 6.2 2.6 1.4 5.5 2.2 8.5 2.1 2.9 0 5.8-0.9 8.4-2.4l117.6-70.7c2.4-1.5 4.4-3.6 5.8-6.1 1.4-2.5 2.1-5.3 2.1-8.2 0-2.9-0.7-5.7-2.1-8.2-1.4-2.5-3.4-4.6-5.8-6.1l-117.6-70.7c-2.6-1.5-5.5-2.4-8.4-2.4-3-0.1-5.9 0.7-8.5 2.1-2.6 1.5-4.7 3.6-6.2 6.2-1.5 2.5-2.3 5.5-2.3 8.4z"
  })), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Watch Tutorial')))), showVideo && video && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlVideoModal"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlVideoModalContent"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "closeModal",
    onClick: () => setShowVideo(false)
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.closeIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Overview_VideoPlayer__WEBPACK_IMPORTED_MODULE_2__["default"], {
    src: video,
    isYoutube: true,
    autoPlay: true
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlVideoModalOverlay",
    onClick: () => setShowVideo(false)
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GettingStarted);

/***/ },

/***/ "../bpl-tools/Admin/Welcome/Info/index.js"
/*!************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/Info/index.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Components/Button/Button */ "../bpl-tools/Components/Button/Button.js");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/icons */ "../bpl-tools/Admin/utils/icons.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Welcome/Info/style.scss");

/**
	* Info Component
	*
	* @props slug (required): plugin slug - builds the review link (String)
	* @props pages (required): pages config (Object)
	* @props helpItems (optional): override default help cards; each {image?, titleIcon?, title, description, link, linkText} (Array)
	*/




const defaultHelpItems = (slug, pages) => [{
  title: 'Need any Assistance?',
  description: 'Our Expert Support Team is always ready to help you out promptly.',
  link: 'https://bplugins.com/support',
  linkText: 'Contact Support'
}, {
  titleIcon: _utils_icons__WEBPACK_IMPORTED_MODULE_2__.facebookIcon,
  title: 'Join Our Community',
  description: 'Get tutorials, plugin updates, feature announcements, and support from other WordPress users.',
  link: 'https://facebook.com/groups/1828495198556137',
  linkText: 'Join Now →'
}, {
  title: 'Request a Feature',
  description: 'Have an idea that would make this plugin even better? Let us know — we love hearing from you.',
  link: 'https://bplugins.com/support/',
  linkText: 'Submit Request →'
}, {
  title: 'Loving This Plugin? ⭐',
  description: "We're a small team pouring our heart into this plugin — your honest review keeps us going and helps others discover it. It only takes 30 seconds.",
  link: slug ? `https://wordpress.org/support/plugin/${slug}/reviews/#new-post` : '',
  linkText: 'Leave a Review'
}];
const Info = ({
  slug,
  pages,
  helpItems
}) => {
  const items = helpItems || defaultHelpItems(slug, pages);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardWelcomeInfo"
  }, items.filter(item => item.link).map((item, index) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: index,
    className: "infoCard bPlDashboardCard"
  }, item.image && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("figure", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: item.image,
    alt: item.title
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", null, item.title, item.titleIcon && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "titleIcon"
  }, item.titleIcon)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, item.description), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__["default"], {
    href: item.link,
    target: "_blank",
    rel: "noopener noreferrer"
  }, item.linkText))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Info);

/***/ },

/***/ "../bpl-tools/Admin/Welcome/Overview/index.js"
/*!****************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/Overview/index.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Components_Button_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Components/Button/Button */ "../bpl-tools/Components/Button/Button.js");
/* harmony import */ var _Overview_VideoPlayer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Overview/VideoPlayer */ "../bpl-tools/Admin/Overview/VideoPlayer.js");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/icons */ "../bpl-tools/Admin/utils/icons.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Welcome/Overview/style.scss");

/**
	* Overview Component
	*
	* @props name (required): plugin name (String)
	* @props version (required): plugin version (String)
	* @props description (required): tagline text (String)
	* @props isPremium (required): whether the plugin is premium (Boolean)
	* @props media (required): {thumbnail?, video?, isYoutube?} (Object)
	* @props pages (required): {landing?} - enables "View Demos" button (Object)
	* @props startButton (required): {label, url} - primary CTA button (Object)
	* @props keywords (required): chip labels shown below the tagline (Array)
	* @props keywordsLabel (required): label before keyword chips (String)
	* @props currentUser (required): injected by withSelect from the WP core store (Object)
	*/








const Overview = props => {
  const {
    name,
    version,
    description,
    isPremium,
    media,
    pages,
    startButton,
    currentUser,
    keywords,
    keywordsLabel
  } = props;
  const {
    thumbnail,
    video,
    isYoutube
  } = media || {};
  const [showVideo, setShowVideo] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const firstName = currentUser?.name ? currentUser.name.split(/\s+/)[0] : '';
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardWelcomeOverview bPlDashboardCard"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "statusRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "activeStatus"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "statusDot",
    "aria-hidden": "true"
  }), "Plugin active"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: `planBadge ${isPremium ? 'isPro' : 'isFree'}`
  }, isPremium && _utils_icons__WEBPACK_IMPORTED_MODULE_5__.crownIcon, isPremium ? 'Pro Plan' : 'Free Plan'), version && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "versionBadge"
  }, "v", version)), name && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, "Welcome to ", name), description && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "tagline"
  }, firstName ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, "Hi ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, firstName), ", ", description) : description), thumbnail && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "banner"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: thumbnail,
    alt: name
  }), video && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "playBtn",
    onClick: () => setShowVideo(true),
    "aria-label": "Play product walkthrough"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.playIcon), video && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "bannerCaption"
  }, "Watch quick start \xB7 2 min")), keywords?.length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "keywords"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "keywordsLabel"
  }, keywordsLabel), keywords.map(f => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    key: f,
    className: "formatChip"
  }, f))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "actionButtons"
  }, startButton?.url && startButton?.label && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "primaryBtn",
    href: startButton.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.plusIcon, startButton.label), pages?.docs && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "secondaryBtn",
    href: pages.docs,
    target: "_blank",
    rel: "noopener noreferrer"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.questionIcon, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Read Documentation')), pages?.landing && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "secondaryBtn",
    href: pages.landing,
    target: "_blank",
    rel: "noopener noreferrer"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.gridIcon, "View Demos"), !isPremium && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "ghostBtn",
    href: "#pricing"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.crownIcon, "Upgrade to Pro", _utils_icons__WEBPACK_IMPORTED_MODULE_5__.arrowRightIcon)), showVideo && video && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlVideoModal"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlVideoModalContent"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "closeModal",
    onClick: () => setShowVideo(false),
    "aria-label": "Close video"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_5__.closeIcon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Overview_VideoPlayer__WEBPACK_IMPORTED_MODULE_4__["default"], {
    key: video,
    src: video,
    isYoutube: isYoutube,
    autoPlay: true,
    title: `${name} walkthrough`
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlVideoModalOverlay",
    onClick: () => setShowVideo(false)
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.withSelect)(select => ({
  currentUser: select('core').getCurrentUser?.()
}))(Overview));

/***/ },

/***/ "../bpl-tools/Admin/Welcome/ProAds/index.js"
/*!**************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/ProAds/index.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Components/Button/Button */ "../bpl-tools/Components/Button/Button.js");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/icons */ "../bpl-tools/Admin/utils/icons.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Welcome/ProAds/style.scss");





/**
 * ProAds — upgrade prompt shown to free users on the Welcome page.
 *
 * @param {object}		props
 * @param {string}		props.name
 * @param {object}		props.media			- {proThumbnail}
 * @param {string[]}	props.proFeatures
 */
const ProAds = props => {
  const {
    name,
    media,
    proFeatures
  } = props;
  const {
    proThumbnail
  } = media || {};
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardWelcomeProAds bPlDashboardCard"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Go ", name, " Pro & Unlock More!"), proFeatures?.length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, proFeatures.map((f, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: i
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.checkIcon), f))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Button_Button__WEBPACK_IMPORTED_MODULE_1__["default"], {
    href: "#pricing"
  }, "View Pricing Plan")), proThumbnail && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("figure", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: proThumbnail,
    alt: `${name} Pro features`
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProAds);

/***/ },

/***/ "../bpl-tools/Admin/Welcome/index.js"
/*!*******************************************!*\
  !*** ../bpl-tools/Admin/Welcome/index.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Changelog: () => (/* reexport safe */ _Changelog__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   GettingStarted: () => (/* reexport safe */ _GettingStarted__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   Info: () => (/* reexport safe */ _Info__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   Overview: () => (/* reexport safe */ _Overview__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   ProAds: () => (/* reexport safe */ _ProAds__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Admin/Welcome/style.scss");
/* harmony import */ var _Overview__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Overview */ "../bpl-tools/Admin/Welcome/Overview/index.js");
/* harmony import */ var _GettingStarted__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GettingStarted */ "../bpl-tools/Admin/Welcome/GettingStarted/index.js");
/* harmony import */ var _ProAds__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ProAds */ "../bpl-tools/Admin/Welcome/ProAds/index.js");
/* harmony import */ var _Changelog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Changelog */ "../bpl-tools/Admin/Welcome/Changelog/index.js");
/* harmony import */ var _Info__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Info */ "../bpl-tools/Admin/Welcome/Info/index.js");








/**
 * Full Welcome page — composes Overview, GettingStarted, Changelog, ProAds, and Info.
 *
 * Spread both `dashboardInfo` and `welcomeInfo(adminUrl)` as props:
 *	<Welcome {...props} {...welcomeInfo(adminUrl)} />
 *
 * @param {object}		props
 * @param {string}		props.name
 * @param {string}		props.version
 * @param {string}		props.description
 * @param {boolean}		props.isPremium
 * @param {string}		props.slug						- WordPress.org slug (for review link)
 * @param {object}		props.media						- {logo, thumbnail, proThumbnail?, video?, isYoutube?}
 * @param {object}		props.pages						- {org?, docs?, pricing?, landing?}
 * @param {object}		[props.startButton]				- {label, url}
 * @param {string[]}	[props.keywords]				- Chip labels in the hero card (e.g. ['Grid', 'Masonry'])
 * @param {string}		[props.keywordsLabel]			- Label before keyword chips (e.g. 'Layouts')
 * @param {object}		[props.gettingStarted]			- {tabs: [{key, label, icon?, video?, isYoutube?, videoLabel?, steps}]} — omit to hide
 * @param {object[]}	[props.changelogs]				- [{version, type, list}] — omit to hide Changelog panel
 * @param {number}		[props.changelogsLimit]			- Max entries shown initially (default 5)
 * @param {string}		[props.changelogsReadMoreLabel]	- "Read more" button text; omit to hide
 * @param {string[]}	[props.proFeatures]				- Pro feature bullets shown in ProAds (free users only)
 * @param {object[]}	[props.helpItems]				- Override Info panel cards
 */
const Welcome = props => {
  const {
    isPremium,
    gettingStarted,
    pages,
    changelogsLimit,
    changelogsReadMoreLabel
  } = props;
  const hasTabs = gettingStarted?.tabs?.length > 0;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardWelcome"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `heroRow ${hasTabs ? '' : 'singleCol'}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Overview__WEBPACK_IMPORTED_MODULE_2__["default"], {
    ...props
  }), hasTabs && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_GettingStarted__WEBPACK_IMPORTED_MODULE_3__["default"], {
    ...gettingStarted,
    pages: pages
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "contentRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Changelog__WEBPACK_IMPORTED_MODULE_5__["default"], {
    ...props,
    limit: changelogsLimit,
    loadMoreLabel: changelogsReadMoreLabel
  }), !isPremium ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ProAds__WEBPACK_IMPORTED_MODULE_4__["default"], {
    ...props
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Info__WEBPACK_IMPORTED_MODULE_6__["default"], {
    ...props
  })), !isPremium && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Info__WEBPACK_IMPORTED_MODULE_6__["default"], {
    ...props
  }));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Welcome);

/***/ },

/***/ "../bpl-tools/Admin/lib/fs.js"
/*!************************************!*\
  !*** ../bpl-tools/Admin/lib/fs.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-disable no-undef */

var __FSCheckoutGlobalInternal__ = function (h) {
  "use strict";

  var G = Object.defineProperty,
    Q = Object.defineProperties;
  var z = Object.getOwnPropertyDescriptors;
  var S = Object.getOwnPropertySymbols;
  var P = Object.prototype.hasOwnProperty,
    O = Object.prototype.propertyIsEnumerable;
  var v = (h, a, d) => a in h ? G(h, a, {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: d
    }) : h[a] = d,
    I = (h, a) => {
      for (var d in a || (a = {})) P.call(a, d) && v(h, d, a[d]);
      if (S) for (var d of S(a)) O.call(a, d) && v(h, d, a[d]);
      return h;
    },
    A = (h, a) => Q(h, z(a));
  var D = (h, a) => {
    var d = {};
    for (var u in h) P.call(h, u) && a.indexOf(u) < 0 && (d[u] = h[u]);
    if (h != null && S) for (var u of S(h)) a.indexOf(u) < 0 && O.call(h, u) && (d[u] = h[u]);
    return d;
  };
  var l = (h, a, d) => v(h, typeof a != "symbol" ? a + "" : a, d);
  const a = {
    Log(...i) {
      console && console.log && console.log(...i);
    },
    Error(...i) {
      console && console.error && console.error(...i);
    },
    Warn(...i) {
      console && console.warn && console.warn(...i);
    },
    Debug(...i) {
      console && console.debug && console.debug(...i);
    }
  };
  function d(i, t) {
    const e = i.contentWindow,
      s = i.src,
      o = {};
    if (!e || !s) return null;
    const n = function (r) {
      if (!(r && r.origin && r.origin.indexOf("js.stripe.com") > 0 || r.origin.indexOf("www.paypal.com") > 0) && r.origin === t && r && r.data && typeof r.data == "string" && r.data.charAt(0) === "{") try {
        const c = JSON.parse(r.data);
        typeof c == "object" && c.type && o[c.type] && o[c.type].forEach(m => {
          m(c.data);
        });
      } catch (c) {
        a.Error(c);
      }
    };
    return window.addEventListener("message", n), {
      on(r, c) {
        o[r] || (o[r] = []), o[r].push(c);
      },
      one(r, c, m = !1) {
        m && delete o[r], !o[r] && this.on(r, c);
      },
      destroy() {
        window.removeEventListener("message", n);
      },
      post(r, c) {
        e.postMessage(JSON.stringify({
          type: r,
          data: c
        }), s.replace(/([^:]+:\/\/[^/]+).*/, "$1"));
      }
    };
  }
  const u = 2147483647;
  function $() {
    const i = function () {
      return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
    };
    return i() + i() + "-" + i() + "-" + i() + "-" + i() + "-" + i() + i() + i();
  }
  function N() {
    let i = !1;
    try {
      const t = navigator.userAgent.toLowerCase();
      /edge\/|trident\/|msie /.test(t) ? i = !0 : t.indexOf("safari") !== -1 && (t.indexOf("chrome") > -1 || (i = !0));
    } catch (t) {}
    return i;
  }
  function x(i) {
    return typeof i == "undefined" || typeof i == "function" || typeof i == "object" && i !== null;
  }
  function M(i) {
    return x(i) ? null : i === null ? "null" : i === !0 ? "1" : i === !1 ? "0" : encodeURIComponent(i).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
  }
  function U(i) {
    const t = [];
    return Object.keys(i).forEach(e => {
      const s = i[e],
        o = M(s);
      o !== null && t.push(`${e}=${o}`);
    }), t.join("&");
  }
  function B(i) {
    return i.pageY <= 20;
  }
  function y() {
    return typeof window == "undefined";
  }
  function w(i, t) {
    if (i == null) throw new Error(t);
  }
  class T {
    constructor(t) {
      l(this, "styleElement");
      l(this, "bodyScrollDisableClassName");
      l(this, "isFlashingBrowser");
      l(this, "overflow", {
        x: 0,
        y: 0
      });
      l(this, "metaColorSchemeValue", null);
      l(this, "metaColorSchemeElement", null);
      this.guid = t, this.bodyScrollDisableClassName = `is-fs-checkout-open-${this.guid}`, this.styleElement = document.createElement("style"), this.styleElement.textContent += this.getBasicStyle(), this.isFlashingBrowser = N() || !y() && !!document.querySelector("#___gatsby"), this.metaColorSchemeElement = document.head.querySelector('meta[name="color-scheme"]');
    }
    addStyle(t) {
      this.styleElement.textContent += t;
    }
    attach() {
      return document.head.appendChild(this.styleElement), this;
    }
    remove() {
      return document.head.removeChild(this.styleElement), this;
    }
    disableBodyScroll() {
      this.backupScrollPosition(), document.body.classList.add(this.bodyScrollDisableClassName);
    }
    enableBodyScroll() {
      document.body.classList.remove(this.bodyScrollDisableClassName), this.restoreScrollPosition();
    }
    disableMetaColorScheme() {
      this.metaColorSchemeElement && (this.metaColorSchemeValue = this.metaColorSchemeElement.getAttribute("content"), this.metaColorSchemeElement.setAttribute("content", "light"));
    }
    enableMetaColorScheme() {
      this.metaColorSchemeElement && this.metaColorSchemeValue && (this.metaColorSchemeElement.setAttribute("content", this.metaColorSchemeValue), this.metaColorSchemeValue = null);
    }
    getBasicStyle() {
      return `body.${this.bodyScrollDisableClassName} { overflow: hidden !important; }`;
    }
    backupScrollPosition() {
      this.overflow = {
        x: document.documentElement.scrollTop,
        y: document.documentElement.scrollLeft
      };
    }
    restoreScrollPosition() {
      document.documentElement.scrollTop = this.overflow.x, document.documentElement.scrollLeft = this.overflow.y;
    }
  }
  class q {
    constructor(t, e, s = "Loading Freemius Checkout") {
      l(this, "loaderElement");
      l(this, "isOpen", !1);
      l(this, "loaderElementId");
      this.style = t, this.loaderElementId = `fs-loader-${this.style.guid}`, this.loaderElement = document.createElement("div"), this.loaderElement.id = this.loaderElementId, this.loaderElement.innerHTML = `<img src="${e}" alt="${s}" />`, this.style.addStyle(this.getStyle());
    }
    show() {
      return this.isOpen ? this : (this.loaderElement.classList.add("show"), document.body.appendChild(this.loaderElement), this.isOpen = !0, this);
    }
    hide() {
      return this.isOpen ? (this.loaderElement.classList.remove("show"), document.body.removeChild(this.loaderElement), this.isOpen = !1, this) : this;
    }
    getStyle() {
      return `#${this.loaderElementId} { display: none; position: fixed; z-index: ${u - 1}; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; text-align: left; background: rgba(0, 0, 0, 0.6); transition: opacity 200ms ease-out; will-change: opacity; opacity: 0; } #${this.loaderElementId}.show { opacity: 1; display: block; } #${this.loaderElementId} img { position: absolute; top: 40%; left: 50%; width: auto; height: auto; margin-left: -25px; background: #fff; padding: 10px; border-radius: 50%; box-shadow: 2px 2px 2px rgba(0,0,0,0.1); }`;
    }
  }
  class R {
    constructor(t, e, s, o, n) {
      l(this, "postman", null);
      l(this, "iFrame");
      l(this, "loadedEventListeners", new Set());
      l(this, "closedEventListeners", new Set());
      this.baseUrl = t, this.visibleClass = o, this.checkoutEvents = n, this.iFrame = this.attachIFrame(t, e, s), this.addEventListeners();
    }
    close() {
      var t;
      (t = this.postman) == null || t.post("close", null);
    }
    onClosed(t) {
      this.closedEventListeners.add(t);
    }
    onLoaded(t) {
      this.loadedEventListeners.add(t);
    }
    addToExitIntent(t) {
      t.addListener(() => {
        var e, s, o;
        (e = this.postman) == null || e.post("exit_intent", null), (o = (s = this.checkoutEvents).onExitIntent) == null || o.call(s);
      });
    }
    attachIFrame(t, e, s) {
      const o = `${t}/?${U(e)}#${encodeURIComponent(document.location.href)}`,
        n = document.createElement("iframe");
      return n.id = s, n.src = o, n.setAttribute("allowTransparency", "true"), n.setAttribute("width", "100%"), n.setAttribute("height", "100%"), n.setAttribute("style", "background: rgba(0,0,0,0.003); border: 0 none transparent;"), n.setAttribute("frameborder", "0"), n.setAttribute("data-testid", n.id), document.body.appendChild(n), n;
    }
    addEventListeners() {
      var c, m, E, k, F;
      const {
        success: t,
        purchaseCompleted: e,
        cancel: s,
        track: o,
        afterOpen: n,
        afterClose: r
      } = this.checkoutEvents;
      this.postman = d(this.iFrame, this.baseUrl), (c = this.postman) == null || c.one("upgraded", p => {
        try {
          t == null || t(p);
        } catch (g) {
          a.Error(g);
        }
        this.dispatchOnClosed(), this.removeIFrameAndPostman(), r == null || r();
      }, !0), (m = this.postman) == null || m.one("purchaseCompleted", p => {
        try {
          e == null || e(p);
        } catch (g) {
          a.Error(g);
        }
      }, !0), (E = this.postman) == null || E.one("canceled", () => {
        try {
          s == null || s();
        } catch (p) {
          a.Error(p);
        }
        this.dispatchOnClosed(), this.removeIFrameAndPostman(), r == null || r();
      }, !0), (k = this.postman) == null || k.on("track", p => {
        try {
          o == null || o(p.event, p);
        } catch (g) {
          a.Error(g);
        }
      }), (F = this.postman) == null || F.one("loaded", () => {
        var p;
        this.dispatchOnLoaded(), (p = this.iFrame) == null || p.classList.add(this.visibleClass);
        try {
          n == null || n();
        } catch (g) {
          a.Error(g);
        }
      }, !0);
    }
    removeIFrameAndPostman() {
      var t;
      (t = this.postman) == null || t.destroy(), this.postman = null, this.iFrame.remove(), this.closedEventListeners.clear(), this.loadedEventListeners.clear();
    }
    dispatchOnLoaded() {
      this.loadedEventListeners.forEach(t => t());
    }
    dispatchOnClosed() {
      this.closedEventListeners.forEach(t => t());
    }
  }
  const b = class b {
    constructor(t, e, s) {
      l(this, "iFrameID");
      this.style = t, this.options = e, this.baseUrl = s, this.iFrameID = `fs-checkout-page-${this.style.guid}`;
    }
    create(t) {
      const e = I(I({}, this.options), t);
      return new R(this.baseUrl, this.getQueryParams(e), this.iFrameID, b.VISIBLE_CLASS, e);
    }
    addStyle() {
      this.style.addStyle(this.getStyle());
    }
    getQueryParams(t) {
      const e = {
        mode: "dialog",
        guid: this.style.guid,
        _fs_checkout: !0
      };
      Object.entries(t).forEach(([o, n]) => {
        x(n) || (e[o] = n);
      });
      const {
        sandbox: s
      } = t;
      return s && s.ctx && s.token && (e.s_ctx_ts = s.ctx, e.sandbox = s.token), e;
    }
    getStyle() {
      return `#${this.iFrameID} { z-index: ${u - 1}; background: rgba(0,0,0,0.003); border: 0 none transparent; visibility: ${this.style.isFlashingBrowser ? "hidden" : "visible"}; margin: 0; padding: 0; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; -webkit-tap-highlight-color: transparent; overflow: hidden; } #${this.iFrameID}.${b.VISIBLE_CLASS} { visibility: visible; }`;
    }
  };
  l(b, "VISIBLE_CLASS", "show");
  let _ = b;
  class V {
    constructor(t, e, s, o, n) {
      l(this, "checkoutIFrameBuilder");
      l(this, "checkoutIFrame", null);
      this.style = t, this.exitIntent = e, this.loader = s, this.checkoutIFrameBuilder = new _(this.style, n, o), this.checkoutIFrameBuilder.addStyle();
    }
    isOpen() {
      return this.checkoutIFrame !== null;
    }
    open(t) {
      return this.isOpen() ? this : (this.style.disableBodyScroll(), this.style.disableMetaColorScheme(), this.loader.show(), this.exitIntent.attach(), this.checkoutIFrame = this.checkoutIFrameBuilder.create(t), this.checkoutIFrame.onLoaded(this.onLoaded.bind(this)), this.checkoutIFrame.onClosed(this.onClosed.bind(this)), this.checkoutIFrame.addToExitIntent(this.exitIntent), this);
    }
    close() {
      var t;
      return (t = this.checkoutIFrame) == null || t.close(), this;
    }
    onLoaded() {
      this.loader.hide();
    }
    onClosed() {
      this.checkoutIFrame = null, this.loader.hide(), this.style.enableBodyScroll(), this.style.enableMetaColorScheme(), this.exitIntent.detach();
    }
  }
  class j {
    constructor(t) {
      l(this, "exitIntentId");
      l(this, "exitIntentDiv", null);
      l(this, "clearExitIntentListener", null);
      l(this, "listeners", []);
      this.style = t, this.exitIntentId = `fs-exit-intent-${this.style.guid}`, this.style.addStyle(this.getStyle());
    }
    isAttached() {
      return this.exitIntentDiv !== null;
    }
    addListener(...t) {
      this.listeners.push(...t);
    }
    attach(...t) {
      if (t && this.addListener(...t), this.isAttached()) return this;
      this.exitIntentDiv = document.createElement("div"), this.exitIntentDiv.id = this.exitIntentId, document.body.appendChild(this.exitIntentDiv);
      const e = document.documentElement;
      let s = null;
      const o = 300,
        n = c => {
          B(c) && (s = window.setTimeout(() => {
            try {
              this.fireListeners();
            } catch (m) {
              a.Error(m);
            }
          }, o));
        },
        r = () => {
          s && (clearTimeout(s), s = null);
        };
      return e.addEventListener("mouseleave", n), e.addEventListener("mouseenter", r), this.clearExitIntentListener = () => {
        s && (clearTimeout(s), s = null), e.removeEventListener("mouseleave", n), e.removeEventListener("mouseenter", r);
      }, this;
    }
    detach() {
      var t, e;
      return this.isAttached() ? ((t = this.exitIntentDiv) == null || t.remove(), this.exitIntentDiv = null, (e = this.clearExitIntentListener) == null || e.call(this), this) : this;
    }
    fireListeners() {
      this.listeners.forEach(t => {
        t();
      });
    }
    getStyle() {
      return `#${this.exitIntentId} { z-index: ${u}; border: 0; background: transparent; position: fixed; padding: 0; margin: 0; height: 10px; left: 0; right: 0; width: 100%; top: 0; }`;
    }
  }
  const f = class f {
    constructor(t) {
      l(this, "queryParams", null);
      this.url = t, this.queryParams = this.parseQueryStringForCart();
    }
    hasCart() {
      return this.queryParams !== null;
    }
    getPluginID() {
      return w(this.queryParams, f.NO_CART_FOUND_MESSAGE), this.queryParams.__fs_plugin_id;
    }
    getPluginPublicKey() {
      return w(this.queryParams, f.NO_CART_FOUND_MESSAGE), this.queryParams.__fs_plugin_public_key;
    }
    matchesPluginID(t) {
      const e = Number.parseInt(this.getPluginID(), 10),
        s = Number.parseInt(t.toString(), 10);
      return Number.isFinite(e) && Number.isFinite(s) && e === s;
    }
    getCheckoutOptions() {
      w(this.queryParams, f.NO_CART_FOUND_MESSAGE);
      const t = {
        plugin_id: "",
        public_key: ""
      };
      return Object.entries(this.queryParams).forEach(([e, s]) => {
        e === "__fs_plugin_id" ? t.plugin_id = s : e === "__fs_plugin_public_key" ? t.public_key = s : t[e] = s;
      }), t;
    }
    parseQueryStringForCart() {
      const t = "__fs_authorization",
        e = new URLSearchParams(this.url.search);
      if (!e.has(t)) return null;
      const s = {};
      return e.forEach((o, n) => {
        n.startsWith("__fs_") && (s[n] = o);
      }), s;
    }
  };
  l(f, "NO_CART_FOUND_MESSAGE", "No cart was found");
  let C = f;
  class L {
    constructor(t, e = !0, s = "https://checkout.freemius.com") {
      l(this, "options", {
        plugin_id: 0,
        public_key: ""
      });
      l(this, "guid");
      l(this, "style");
      l(this, "loader");
      l(this, "checkoutPopup");
      l(this, "exitIntent");
      l(this, "cart");
      var E;
      this.baseUrl = s;
      const m = t,
        {
          plugin_id: o,
          product_id: n,
          public_key: r
        } = m,
        c = D(m, ["plugin_id", "product_id", "public_key"]);
      if (!o && !n) throw new Error("Must provide a product_id to options.");
      if (!r) throw new Error("Must provide the public_key to options.");
      this.options = A(I({}, c), {
        public_key: r,
        plugin_id: n != null ? n : o
      }), this.guid = $(), !y() && (this.style = new T(this.guid), this.loader = new q(this.style, (E = t.loadingImageUrl) != null ? E : `${this.baseUrl}/assets/img/spinner.svg`, t.loadingImageAlt), this.exitIntent = new j(this.style), this.checkoutPopup = new V(this.style, this.exitIntent, this.loader, this.baseUrl, this.options), this.style.attach(), this.cart = new C(new URL(window.location.href)), e && this.recoverCart());
    }
    open(t) {
      var e, s;
      if (!y()) {
        if ((e = this.checkoutPopup) != null && e.isOpen()) {
          a.Warn("Checkout popup already open. Please close it first before opening it again.");
          return;
        }
        (s = this.checkoutPopup) == null || s.open(t);
      }
    }
    close() {
      var t;
      y() || (t = this.checkoutPopup) == null || t.close();
    }
    destroy() {
      var t;
      y() || (this.close(), (t = this.style) == null || t.remove());
    }
    getGuid() {
      return this.guid;
    }
    recoverCart() {
      var t, e;
      if ((t = this.cart) != null && t.hasCart() && (e = this.cart) != null && e.matchesPluginID(this.options.plugin_id)) {
        const s = this.cart.getCheckoutOptions();
        this.open(s);
      }
    }
  }
  return window.FS = window.FS || {}, window.FS.Checkout = L, window.FS.postman = d, window.FS.Logger = a, h.Checkout = L, Object.defineProperty(h, Symbol.toStringTag, {
    value: "Module"
  }), h;
}({});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (window.FS);

/***/ },

/***/ "../bpl-tools/Admin/utils/icons.js"
/*!*****************************************!*\
  !*** ../bpl-tools/Admin/utils/icons.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alertIcon: () => (/* binding */ alertIcon),
/* harmony export */   angelDownIcon: () => (/* binding */ angelDownIcon),
/* harmony export */   arrowRightIcon: () => (/* binding */ arrowRightIcon),
/* harmony export */   chatIcon: () => (/* binding */ chatIcon),
/* harmony export */   checkCircleIcon: () => (/* binding */ checkCircleIcon),
/* harmony export */   checkIcon: () => (/* binding */ checkIcon),
/* harmony export */   chevronDownIcon: () => (/* binding */ chevronDownIcon),
/* harmony export */   chevronLeftIcon: () => (/* binding */ chevronLeftIcon),
/* harmony export */   chevronRightIcon: () => (/* binding */ chevronRightIcon),
/* harmony export */   circleCheckIcon: () => (/* binding */ circleCheckIcon),
/* harmony export */   closeIcon: () => (/* binding */ closeIcon),
/* harmony export */   copyIcon: () => (/* binding */ copyIcon),
/* harmony export */   crownIcon: () => (/* binding */ crownIcon),
/* harmony export */   defaultIcon: () => (/* binding */ defaultIcon),
/* harmony export */   externalIcon: () => (/* binding */ externalIcon),
/* harmony export */   facebookIcon: () => (/* binding */ facebookIcon),
/* harmony export */   fullscreenIcon: () => (/* binding */ fullscreenIcon),
/* harmony export */   gridIcon: () => (/* binding */ gridIcon),
/* harmony export */   hideLicenseIcon: () => (/* binding */ hideLicenseIcon),
/* harmony export */   infoIcon: () => (/* binding */ infoIcon),
/* harmony export */   keyIcon: () => (/* binding */ keyIcon),
/* harmony export */   linkIcon: () => (/* binding */ linkIcon),
/* harmony export */   lockIcon: () => (/* binding */ lockIcon),
/* harmony export */   moneyBackIcon: () => (/* binding */ moneyBackIcon),
/* harmony export */   ourPluginsIcon: () => (/* binding */ ourPluginsIcon),
/* harmony export */   pauseFillIcon: () => (/* binding */ pauseFillIcon),
/* harmony export */   playFillIcon: () => (/* binding */ playFillIcon),
/* harmony export */   playIcon: () => (/* binding */ playIcon),
/* harmony export */   playPauseIcon: () => (/* binding */ playPauseIcon),
/* harmony export */   pluginIcon: () => (/* binding */ pluginIcon),
/* harmony export */   plusIcon: () => (/* binding */ plusIcon),
/* harmony export */   questionIcon: () => (/* binding */ questionIcon),
/* harmony export */   ratingIcon: () => (/* binding */ ratingIcon),
/* harmony export */   refreshIcon: () => (/* binding */ refreshIcon),
/* harmony export */   searchAltIcon: () => (/* binding */ searchAltIcon),
/* harmony export */   searchIcon: () => (/* binding */ searchIcon),
/* harmony export */   shieldIcon: () => (/* binding */ shieldIcon),
/* harmony export */   showLicenseIcon: () => (/* binding */ showLicenseIcon),
/* harmony export */   trashIcon: () => (/* binding */ trashIcon),
/* harmony export */   upgradeProIcon: () => (/* binding */ upgradeProIcon),
/* harmony export */   volumeMutedIcon: () => (/* binding */ volumeMutedIcon),
/* harmony export */   volumeOnIcon: () => (/* binding */ volumeOnIcon),
/* harmony export */   warningIcon: () => (/* binding */ warningIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const trashIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "3 6 5 6 21 6"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "10",
  y1: "11",
  x2: "10",
  y2: "17"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "14",
  y1: "11",
  x2: "14",
  y2: "17"
}));
const alertIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "12",
  y1: "9",
  x2: "12",
  y2: "13"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "12",
  y1: "17",
  x2: "12.01",
  y2: "17"
}));
const shieldIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "9 12 11 14 15 10"
}));
const checkCircleIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "20 6 9 17 4 12"
}));
const closeIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}));
const searchIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "11",
  cy: "11",
  r: "7"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "21",
  y1: "21",
  x2: "16.65",
  y2: "16.65"
}));
const searchAltIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 640 640"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"
}));
const externalIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "15 3 21 3 21 9"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "10",
  y1: "14",
  x2: "21",
  y2: "3"
}));
const arrowRightIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "12 5 19 12 12 19"
}));
const chevronLeftIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "15 18 9 12 15 6"
}));
const chevronRightIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "9 18 15 12 9 6"
}));
const defaultIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "3",
  y: "3",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "14",
  y: "3",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "3",
  y: "14",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "14",
  y: "14",
  width: "7",
  height: "7",
  rx: "1"
}));
const gridIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "3",
  y: "3",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "14",
  y: "3",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "3",
  y: "14",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "14",
  y: "14",
  width: "7",
  height: "7",
  rx: "1"
}));
const crownIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M3 17l3-9 4 5 2-7 2 7 4-5 3 9"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "3",
  y1: "21",
  x2: "21",
  y2: "21"
}));
const plusIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "12",
  y1: "5",
  x2: "12",
  y2: "19"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}));
const ourPluginsIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 640 640"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M224 32C241.7 32 256 46.3 256 64L256 160L384 160L384 64C384 46.3 398.3 32 416 32C433.7 32 448 46.3 448 64L448 160L512 160C529.7 160 544 174.3 544 192C544 209.7 529.7 224 512 224L512 288C512 383.1 442.8 462.1 352 477.3L352 544C352 561.7 337.7 576 320 576C302.3 576 288 561.7 288 544L288 477.3C197.2 462.1 128 383.1 128 288L128 224C110.3 224 96 209.7 96 192C96 174.3 110.3 160 128 160L192 160L192 64C192 46.3 206.3 32 224 32z"
}));
const upgradeProIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 11 13",
  stroke: "currentColor",
  strokeLinecap: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M2.5 5.16931V3.16931C2.49936 2.5198 2.73579 1.89239 3.16492 1.40483C3.59404 0.917267 4.18636 0.603088 4.8307 0.521257C5.47503 0.439426 6.12708 0.595571 6.66446 0.960383C7.20184 1.3252 7.5876 1.87359 7.74933 2.50264M5.16667 8.50264C5.34348 8.50264 5.51305 8.43241 5.63807 8.30738C5.76309 8.18236 5.83333 8.01279 5.83333 7.83598C5.83333 7.65917 5.76309 7.4896 5.63807 7.36457C5.51305 7.23955 5.34348 7.16931 5.16667 7.16931C4.98986 7.16931 4.82029 7.23955 4.69526 7.36457C4.57024 7.4896 4.5 7.65917 4.5 7.83598C4.5 8.01279 4.57024 8.18236 4.69526 8.30738C4.82029 8.43241 4.98986 8.50264 5.16667 8.50264ZM5.16667 8.50264V10.5026M1.56667 5.16931H8.76667C9.35333 5.16931 9.83333 5.64931 9.83333 6.23598V10.9026C9.83333 11.7826 9.11333 12.5026 8.23333 12.5026H2.1C1.22 12.5026 0.5 11.7826 0.5 10.9026V6.23598C0.5 5.64931 0.98 5.16931 1.56667 5.16931Z"
}));
const ratingIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 640 640"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"
}));
const facebookIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 292 512",
  fill: "#1877F2"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "m66 299.3v212.7h116v-212.7h86.5l18-97.8h-104.5v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 0.4 37 1.2v-88.7c-14.3-3.9-49.3-7.9-69.5-7.9-106.9 0-156.2 50.5-156.2 159.4v42.1h-66v97.8z"
}));
const angelDownIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  className: "angelDown",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 640 640"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z"
}));
const warningIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 640 640"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 384C302.3 384 288 398.3 288 416C288 433.7 302.3 448 320 448C337.7 448 352 433.7 352 416C352 398.3 337.7 384 320 384zM320 192C301.8 192 287.3 207.5 288.6 225.7L296 329.7C296.9 342.3 307.4 352 319.9 352C332.5 352 342.9 342.3 343.8 329.7L351.2 225.7C352.5 207.5 338.1 192 319.8 192z"
}));
const playFillIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M8 5v14l11-7z"
}));
const pauseFillIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  className: "video-player-pause-icon",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 320 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"
}));
const playPauseIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z"
}));
const volumeMutedIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
}));
const volumeOnIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
}));
const fullscreenIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
}));
const playIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 640 640"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
}));
const showLicenseIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M3 3L21 21",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M10.5 10.677a2 2 0 002.823 2.823",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6c4.008 0 6.701 3.158 9 6a15.66 15.66 0 01-1.078 1.5",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}));
const hideLicenseIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M12 5C7.52 5 3.73 7.61 1 12c2.73 4.39 6.52 7 11 7s8.27-2.61 11-7c-2.73-4.39-6.52-7-11-7z",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "12",
  cy: "12",
  r: "3",
  stroke: "currentColor",
  strokeWidth: "2"
}));
const pluginIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M8 12a4 4 0 100-8 4 4 0 000 8zm8 8a4 4 0 100-8 4 4 0 000 8zm-8 0a4 4 0 100-8 4 4 0 000 8z"
}));
const linkIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
}));
const questionIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "12",
  y1: "17",
  x2: "12.01",
  y2: "17"
}));
const circleCheckIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M22 11.08V12a10 10 0 11-5.93-9.14"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "22 4 12 14.01 9 11.01"
}));
const checkIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  className: "check",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 -960 960 960"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z"
}));
const chevronDownIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "6 9 12 15 18 9"
}));
const moneyBackIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M12 2L4 6v6c0 5 3.5 9.6 8 10 4.5-.4 8-5 8-10V6l-8-4z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "9 12 11 14 15 10"
}));
const refreshIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "23 4 23 10 17 10"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "1 20 1 14 7 14"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
}));
const chatIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
}));
const lockIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "3",
  y: "11",
  width: "18",
  height: "11",
  rx: "2"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M7 11V7a5 5 0 0110 0v4"
}));
const keyIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
}));
const copyIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "9",
  y: "9",
  width: "13",
  height: "13",
  rx: "2"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
}));
const infoIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "12",
  y1: "16",
  x2: "12",
  y2: "12"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "12",
  y1: "8",
  x2: "12.01",
  y2: "8"
}));

/***/ },

/***/ "../bpl-tools/Admin/utils/video.js"
/*!*****************************************!*\
  !*** ../bpl-tools/Admin/utils/video.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getYoutubeEmbedSrc: () => (/* binding */ getYoutubeEmbedSrc)
/* harmony export */ });
/**
 * Build a YouTube embed URL from any YouTube share/watch/short URL.
 * Returns the original url untouched when no 11-char video id can be found.
 *
 * @param {string}	url
 * @param {object}	[options]
 * @param {boolean}	[options.autoplay=true]
 * @return {string}
 */
const getYoutubeEmbedSrc = (url, {
  autoplay = true
} = {}) => {
  const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  const short = url.match(/youtu\.be\/([^#&?]+)/);
  const id = match && match[2]?.length === 11 ? match[2] : short && short[1]?.length === 11 ? short[1] : '';
  return id ? `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1` : url;
};

/***/ },

/***/ "../bpl-tools/Components/Button/Button.js"
/*!************************************************!*\
  !*** ../bpl-tools/Components/Button/Button.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "../bpl-tools/Components/Button/style.scss");

/**
	* Button Component
	* Renders a button or anchor element based on the presence of an onClick/href.
	*
	* @props type (optional): 'button' (String)
	* @props href (optional): Anchor href; renders an <a> when set (String)
	* @props target (optional): Anchor target (String)
	* @props onClick (optional): Button click handler (Function)
	* @props className (optional): Additional CSS classes (String)
	* @props variant (optional): 'primary' Button style variant (String)
	* @props size (optional): '' Button size (String)
	* @props children (optional): Button content (Node)
	* @props disabled (optional): false (Boolean)
	*/


const Button = ({
  type = 'button',
  href = '',
  target = '',
  onClick = null,
  className,
  variant = 'primary',
  size = '',
  children,
  disabled = false,
  ...props
}) => {
  const cls = `bPlButton ${variant ? `variant-${variant}` : ''} ${size ? `size-${size}` : ''} ${className ? className : ''} ${disabled ? 'bPlButton-disabled' : ''}`;
  return 'function' === typeof onClick || !href ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: type,
    className: cls,
    ...props,
    onClick: onClick
  }, children) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: href,
    target: target,
    className: cls,
    ...props
  }, children);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Button);

/***/ },

/***/ "../bpl-tools/hooks/useWPAjax.js"
/*!***************************************!*\
  !*** ../bpl-tools/hooks/useWPAjax.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const useWPAjax = (action, params = {}, set = true) => {
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isError, setIsError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  if (!wp.ajax) {
    // eslint-disable-next-line no-console
    console.error('Please use wp-util as a dependency');
    return;
  }
  const sendRequest = (payload = {}) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    wp.ajax.post(action, {
      ...params,
      ...payload
    }).done(res => {
      setIsLoading(false);
      setData(res);
    }).fail(error => {
      setIsLoading(false);
      setIsError(true);
      setError(error);
    });
  };
  const request = (payload = {}) => {
    sendRequest(payload);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (set) {
      sendRequest(params);
    }
  }, []);
  return {
    data,
    saveData: request,
    refetch: request,
    isLoading,
    isError,
    error
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useWPAjax);

/***/ },

/***/ "./src/dashboard/admin.js"
/*!********************************!*\
  !*** ./src/dashboard/admin.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _admin_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin.scss */ "./src/dashboard/admin.scss");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/data */ "./src/dashboard/utils/data.js");
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/App */ "./src/dashboard/components/App.js");
/* harmony import */ var _components_AnalyticsPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/AnalyticsPage */ "./src/dashboard/components/AnalyticsPage.js");



// import { createRoot } from 'react-dom/client';



document.addEventListener('DOMContentLoaded', () => {
  // Two mounts, one bundle. The dashboard is the router; Analytics has its own submenu
  // and renders the same screen standalone. Guarded individually so a page carrying only
  // one of them cannot throw on the other's missing element.
  const dashboardEl = document.getElementById('pdfpAdminDashboard');
  if (dashboardEl) {
    ReactDOM.createRoot(dashboardEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_App__WEBPACK_IMPORTED_MODULE_3__["default"], {
      ...(0,_utils_data__WEBPACK_IMPORTED_MODULE_2__.dashboardInfo)(JSON.parse(dashboardEl.dataset.info))
    }));
  }
  const analyticsEl = document.getElementById('pdfpAnalyticsPage');
  if (analyticsEl) {
    ReactDOM.createRoot(analyticsEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_AnalyticsPage__WEBPACK_IMPORTED_MODULE_4__["default"], {
      ...(0,_utils_data__WEBPACK_IMPORTED_MODULE_2__.dashboardInfo)(JSON.parse(analyticsEl.dataset.info))
    }));
  }
});

/***/ },

/***/ "./src/dashboard/components/Analytics/Chart.js"
/*!*****************************************************!*\
  !*** ./src/dashboard/components/Analytics/Chart.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);



/**
 * Daily views and downloads.
 *
 * Hand-authored SVG rather than a charting library: two series over at most 366 points
 * needs no runtime, and adding one would be the largest dependency in the plugin.
 *
 * Colours are the brand pair, with one derivation. #ff7a00 measures 2.61:1 on white --
 * under the 3:1 a 2px line needs to be legible -- so downloads use the same hue one step
 * darker, #cc6200, at 3.95:1. Blue against orange is also the most colour-blind-safe
 * pairing available (ΔE 31.8 protanopia), and both series carry a legend entry AND a
 * direct label on the last point, so identity never rests on colour alone.
 */
const VIEWS = '#146ef5';
const DOWNLOADS = '#cc6200';
const PAD = {
  top: 18,
  right: 58,
  bottom: 30,
  left: 48
};
const W = 900;
const H = 260;
const niceCeiling = max => {
  if (max <= 5) return 5;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const step = max / mag > 5 ? mag * 2 : max / mag > 2 ? mag : mag / 2;
  return Math.ceil(max / step) * step;
};
const Chart = ({
  series
}) => {
  const [hover, setHover] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const svgRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const model = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const points = series || [];
    const n = points.length;
    const peak = points.reduce((m, p) => Math.max(m, p.views, p.downloads), 0);
    const top = niceCeiling(peak || 5);
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;

    // A single day would otherwise divide by zero; draw it centred instead.
    const x = i => n <= 1 ? PAD.left + iw / 2 : PAD.left + iw * i / (n - 1);
    const y = v => PAD.top + ih - ih * v / top;
    const line = key => points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
    const area = key => n ? `${line(key)} L${x(n - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z` : '';
    const ticks = [0, top / 4, top / 2, top * 3 / 4, top];

    // Roughly six labels, whatever the range length, landing on real indices.
    const every = Math.max(1, Math.round(n / 6));
    const xLabels = points.map((p, i) => ({
      i,
      p
    })).filter(({
      i
    }) => i % every === 0 || i === n - 1);
    return {
      points,
      n,
      top,
      iw,
      ih,
      x,
      y,
      line,
      area,
      ticks,
      xLabels
    };
  }, [series]);
  const {
    points,
    n,
    x,
    y,
    line,
    area,
    ticks,
    xLabels
  } = model;
  const fmt = v => Number(v || 0).toLocaleString();
  const shortDay = day => {
    const d = new Date(`${day}T00:00:00`);
    return isNaN(d) ? day : d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short'
    });
  };
  const longDay = day => {
    const d = new Date(`${day}T00:00:00`);
    return isNaN(d) ? day : d.toLocaleDateString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  const pick = event => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box || !n) return;
    const px = (event.clientX - box.left) / box.width * W;
    const i = n <= 1 ? 0 : Math.round((px - PAD.left) / model.iw * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  // Switching the range replaces the series with a shorter one, and a hover index held
  // over from the longer one indexes past its end. Drop it whenever the length changes.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setHover(null);
  }, [n]);
  if (!n) return null;

  // Belt as well as braces: the effect above runs after this render, so the very first
  // render following a range change still sees the stale index.
  const active = hover != null && hover >= 0 && hover < n ? points[hover] : null;

  // Flip the tooltip to the other side of the crosshair near the right edge.
  const tipLeft = active ? x(hover) / W * 100 : 0;
  const flip = tipLeft > 62;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpChartWrap"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    ref: svgRef,
    className: "pdfpChart",
    viewBox: `0 0 ${W} ${H}`,
    role: "img",
    "aria-label": `Daily views and downloads from ${points[0].day} to ${points[n - 1].day}.`,
    onPointerMove: pick,
    onPointerDown: pick,
    onPointerLeave: () => setHover(null)
  }, ticks.map(t => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    key: t
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
    x1: PAD.left,
    x2: W - PAD.right,
    y1: y(t),
    y2: y(t),
    stroke: t === 0 ? '#cbd5e1' : '#e2e8f0',
    strokeWidth: "1"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("text", {
    x: PAD.left - 10,
    y: y(t) + 4,
    textAnchor: "end",
    className: "pdfpChartAxis"
  }, fmt(Math.round(t))))), xLabels.map(({
    i,
    p
  }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("text", {
    key: p.day,
    x: x(i),
    y: H - 10,
    textAnchor: "middle",
    className: "pdfpChartAxis"
  }, shortDay(p.day))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: area('views'),
    fill: "rgba(20,110,245,.13)"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: area('downloads'),
    fill: "rgba(204,98,0,.13)"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: line('views'),
    fill: "none",
    stroke: VIEWS,
    strokeWidth: "2",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: line('downloads'),
    fill: "none",
    stroke: DOWNLOADS,
    strokeWidth: "2",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), [['views', VIEWS], ['downloads', DOWNLOADS]].map(([key, colour]) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    key: key
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: x(n - 1),
    cy: y(points[n - 1][key]),
    r: "4.5",
    fill: colour,
    stroke: "#fff",
    strokeWidth: "2"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("text", {
    x: x(n - 1) + 10,
    y: y(points[n - 1][key]) + 4,
    className: "pdfpChartEnd"
  }, fmt(points[n - 1][key])))), active && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
    x1: x(hover),
    x2: x(hover),
    y1: PAD.top,
    y2: PAD.top + model.ih,
    stroke: "#070127",
    strokeWidth: "1",
    opacity: ".22"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: x(hover),
    cy: y(active.views),
    r: "5",
    fill: VIEWS,
    stroke: "#fff",
    strokeWidth: "2"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: x(hover),
    cy: y(active.downloads),
    r: "5",
    fill: DOWNLOADS,
    stroke: "#fff",
    strokeWidth: "2"
  }))), active && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `pdfpChartTip${flip ? ' flip' : ''}`,
    style: {
      left: `${tipLeft}%`
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "d"
  }, longDay(active.day)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "r"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("em", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    style: {
      background: VIEWS
    }
  }), "Views"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("b", null, fmt(active.views))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "r"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("em", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    style: {
      background: DOWNLOADS
    }
  }), "Downloads"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("b", null, fmt(active.downloads)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Chart);

/***/ },

/***/ "./src/dashboard/components/Analytics/LockedHistory.js"
/*!*************************************************************!*\
  !*** ./src/dashboard/components/Analytics/LockedHistory.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);



/**
 * The locked history panel on the free Analytics screen.
 *
 * The free tier already shows TODAY for real, so what is withheld here is not a feature
 * -- it is the site's own past, which pdfp_should_count() has been writing all along.
 * That is the whole pitch, and it is why this panel states a counted number the site
 * owns ("your last 47 days are already recorded") instead of listing what Pro can do.
 *
 * Three rules the markup keeps, in order of how easily they could be lost:
 *
 * 1. NO FIGURE FOR A PAST DAY IS EVER DRAWN. Where a value would sit there is a
 *    skeleton block, never a blurred numeral -- so a browser that drops `filter`, or a
 *    reader who disables it, degrades the screen to "withheld", never to "here is a
 *    made-up number". The blur is the finish; the skeleton is the mechanism.
 * 2. Everything the free build genuinely knows stays SHARP: the panel title, the legend,
 *    the date axis (the browser's own calendar), and the counted days. Only the plotted
 *    shape is frosted, and it is labelled an example.
 * 3. One call to action. The old text-only upgrade card is gone rather than sitting
 *    below this one -- two pitches on one screen is the upsell fatigue that is the most
 *    cited complaint against the biggest plugin in this category.
 *
 * Geometry is Chart.js's, to the pixel, because this panel IS that panel with the glass
 * down: same viewBox, same padding, same gridlines. When the licence activates the
 * reader is looking at a layout they have already learned.
 */

/* Chart.js's own frame. Kept in sync by being the same numbers, not by importing --
   Chart takes a series this panel does not have. */
const W = 900;
const H = 260;
const PAD = {
  top: 18,
  right: 58,
  bottom: 30,
  left: 48
};
const RANGE = 30;
const fmt = v => Number(v || 0).toLocaleString();
const prettyDate = day => {
  const d = new Date(`${day}T00:00:00`);
  return isNaN(d) ? day : d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
const Padlock = ({
  className = 'pdfpLockGlyph'
}) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  className: className,
  viewBox: "0 0 9 11",
  "aria-hidden": "true",
  focusable: "false"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M2 4.5V3.2a2.5 2.5 0 0 1 5 0v1.3",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.2"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "1",
  y: "4.5",
  width: "7",
  height: "5.5",
  fill: "currentColor"
}));

/**
 * What Pro adds, as chips rather than a bulleted wall.
 *
 * Short labels on purpose: the card's argument is the counted number above them, and a
 * six-line list underneath competes with it for the same glance.
 */
const FEATURES = ['7, 30 and 90-day chart', 'Totals vs the previous period', 'Top documents, ranked', 'Download rate & busiest day', 'Sortable columns on your posters list', 'CSV export'];

/**
 * The frosted plot.
 *
 * The x axis is real -- the last thirty days off the reader's own clock -- and the
 * gridlines are the real chart's. The band between them is an example shape, blurred and
 * labelled, because a free site is sent no daily figures to draw. Marked
 * `role="presentation"` so it is not announced as a chart carrying data.
 */
const Silhouette = () => {
  const model = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;
    const x = i => PAD.left + iw * i / (RANGE - 1);
    const y = t => PAD.top + ih - ih * t;

    // A weekday rhythm under a broad mid-period lift: enough movement to read as a
    // chart, smooth enough that nobody could mistake it for a measurement.
    const at = i => {
      const wave = 0.5 + 0.28 * Math.sin(i / (RANGE - 1) * Math.PI * 1.4);
      const week = 0.08 * Math.sin(i / 7 * Math.PI * 2);
      return Math.max(0.08, Math.min(0.92, wave + week));
    };
    const upper = [];
    const lower = [];
    for (let i = 0; i < RANGE; i++) {
      upper.push(`${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(at(i)).toFixed(1)}`);
      lower.push(`${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(at(i) * 0.27).toFixed(1)}`);
    }

    // Only the upper band is filled. Two translucent areas over one another read
    // as mud rather than as two series, which is why Chart.js's downloads fill is
    // the paler of the pair and why this one has none at all.
    const base = `L${x(RANGE - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

    // Six ticks over the range, ending on today, from the browser's own calendar.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ticks = [];
    const step = Math.round((RANGE - 1) / 5);
    for (let i = 0; i < RANGE; i += step) {
      const d = new Date(today.getTime() - (RANGE - 1 - i) * 86400000);
      ticks.push({
        i,
        label: d.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short'
        })
      });
    }
    return {
      x,
      y,
      upperLine: upper.join(' '),
      upperArea: `${upper.join(' ')} ${base}`,
      lowerLine: lower.join(' '),
      ticks,
      rows: [0, 0.25, 0.5, 0.75, 1]
    };
  }, []);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    className: "pdfpChart pdfpSilhouette",
    viewBox: `0 0 ${W} ${H}`,
    role: "presentation"
  }, model.rows.map(t => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
    key: t,
    className: "pdfpChartGrid",
    x1: PAD.left,
    x2: W - PAD.right,
    y1: model.y(t),
    y2: model.y(t)
  })), model.rows.map(t => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    key: `s${t}`,
    className: "pdfpSkelMark",
    x: PAD.left - 34,
    y: model.y(t) - 5,
    width: "24",
    height: "9"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    className: "pdfpSilhouetteInk"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: model.upperArea,
    fill: "#146ef5",
    fillOpacity: "0.16"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: model.upperLine,
    fill: "none",
    stroke: "#146ef5",
    strokeWidth: "2",
    strokeLinejoin: "round"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: model.lowerLine,
    fill: "none",
    stroke: "#cc6200",
    strokeWidth: "2",
    strokeLinejoin: "round"
  })), model.ticks.map(t => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("text", {
    key: t.i,
    className: "pdfpChartAxis",
    x: model.x(t.i),
    y: H - 10,
    textAnchor: "middle"
  }, t.label)));
};
const LockedHistory = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({
  history,
  tracking,
  pricingUrl,
  pulsing
}, ref) => {
  const days = Math.max(0, Number(history?.days || 0));
  const rows = Math.max(0, Number(history?.rows || 0));
  const firstDay = history?.firstDay || '';

  // Singular, plural, and the site whose first day is today all read differently, and
  // "your last 1 days" is the kind of string that makes a product look unfinished.
  const headline = days > 1 ? `Your last ${fmt(days)} days are already recorded.` : days === 1 ? 'Yesterday is already recorded.' : 'Your history starts building today.';
  const body = days > 0 ? `PDF Poster started counting on ${prettyDate(firstDay)}${rows > 0 ? ` and has kept ${fmt(rows)} daily records since` : ''}. Today's figures are above; Pro reads back everything before midnight — and there is nothing to import, because it is already in your own database.` : "Nothing before today has been recorded yet — the history builds from the day counting starts. Today's figures are above; Pro reads back every day after this one, straight from your own database.";

  // Counting being switched off is already stated at the top of the screen, so this
  // is a clause on the sentence above rather than a second notice saying it again --
  // it is only here because "started counting on X" would otherwise imply it never
  // stopped. What is already recorded stays readable with a licence either way.
  const stopped = tracking === false && days > 0 ? ' Counting is switched off at the moment, so no new days are being added.' : '';
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `pdfpStage${pulsing ? ' isPulsing' : ''}`,
    ref: ref
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpStageVeil",
    "aria-hidden": "true"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardCard pdfpPanel"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpPanelHead"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpPanelTitle"
  }, "Views and downloads"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpLegend"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpExampleTag"
  }, "Example shape"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    style: {
      background: '#146ef5'
    }
  }), "Views"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    style: {
      background: '#cc6200'
    }
  }), "Downloads"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpChartWrap"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Silhouette, null)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpGlass"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpLockCard"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpLockEyebrow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Padlock, null), days > 0 ? 'Already recorded · not yet readable' : 'Recording now'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, headline), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpLockBody"
  }, body, stopped), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "pdfpLockFeats"
  }, FEATURES.map(f => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: f
  }, f))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpLockCta"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "bPlButton",
    href: pricingUrl
  }, days > 0 ? `Unlock my ${fmt(days)} days — see Pro pricing` : 'See Pro pricing')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpLockMicro"
  }, "Layout example. No view or download figure for a past day is sent to a free site, so nothing behind this panel is a made-up number."))));
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LockedHistory);

/***/ },

/***/ "./src/dashboard/components/Analytics/index.js"
/*!*****************************************************!*\
  !*** ./src/dashboard/components/Analytics/index.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Chart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Chart */ "./src/dashboard/components/Analytics/Chart.js");
/* harmony import */ var _LockedHistory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LockedHistory */ "./src/dashboard/components/Analytics/LockedHistory.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/dashboard/components/Analytics/style.scss");







/**
 * PDF Poster › Analytics.
 *
 * A route inside the dashboard that already exists rather than a second admin page with
 * its own React root: it inherits the header, the nav, Roboto/Lato and the palette, and
 * costs two lines in App.js and Layout.js instead of a new mount and a second stylesheet.
 *
 * Every panel here describes one window, so the whole screen is fed by a single request
 * (model=Analytics, method=summary). Splitting it would let the tiles and the chart
 * disagree whenever responses landed out of order.
 */

const RANGES = [{
  days: 1,
  label: 'Today'
}, {
  days: 7,
  label: '7 days'
}, {
  days: 30,
  label: '30 days'
}, {
  days: 90,
  label: '90 days'
}];
const fmt = v => Number(v || 0).toLocaleString();
const prettyDate = day => {
  const d = new Date(`${day}T00:00:00`);
  return isNaN(d) ? day : d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/** Percentage change, or null when there is no baseline to compare against. */
const delta = (now, before) => {
  if (!before) return null;
  return Math.round((now - before) / before * 100);
};

/**
 * Props for a link that leaves the report.
 *
 * Opening in a new tab keeps the range and document filter you were looking at, and
 * `rel=noopener` stops the new tab reaching back through window.opener. The aria-label
 * carries the warning a sighted user gets from the tab appearing.
 */
const newTab = label => ({
  target: '_blank',
  rel: 'noopener noreferrer',
  'aria-label': `${label} (opens in a new tab)`
});

/**
 * The document filter.
 *
 * Grouped rather than one flat list: a saved poster and a url-keyed embed are different
 * kinds of thing, and an embed is named by the page it sits on because its own identity
 * is a hash nobody can recognise.
 *
 * Present on both tiers. Free filters today's figures; Pro filters the whole report.
 */
const DocPicker = ({
  list,
  value,
  onChange
}) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
  className: "pdfpDocPicker"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "screen-reader-text"
}, "Document"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
  className: "pdfpSelect",
  value: value,
  onChange: e => onChange(e.target.value)
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
  value: ""
}, "All documents"), list.posters?.length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("optgroup", {
  label: "PDF Posters"
}, list.posters.map(d => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
  key: d.doc,
  value: d.doc
}, d.title))), list.embeds?.length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("optgroup", {
  label: "Embedded files"
}, list.embeds.map(d => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
  key: d.doc,
  value: d.doc
}, d.title)))));

/**
 * The ranked documents table.
 *
 * ONE component for both tiers: free ranks today, Pro ranks the chosen range. They are
 * the same table answering the same question over a different window, so rendering it
 * twice would be two designs of one thing -- and the free one would quietly fall behind
 * every time the Pro one gained a column.
 *
 * The bars are scaled to the largest value IN THIS TABLE, not to a global maximum, so a
 * one-day view is as readable as a ninety-day one.
 */
const DocTable = ({
  rows,
  loading,
  emptyText
}) => {
  const maxViews = rows.reduce((m, d) => Math.max(m, d.views), 0);
  const maxDownloads = rows.reduce((m, d) => Math.max(m, d.downloads), 0);
  return rows.length ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpTableScroll"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "pdfpTable"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Document"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Views"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Downloads"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, "Rate"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, rows.map(doc => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    key: doc.doc
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, doc.editUrl ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: doc.editUrl,
    ...newTab(doc.title)
  }, doc.title) :
  /* No saved poster behind it. The page
     the block sits on IS the useful name
     here, so it takes the primary blue
     link -- exactly like a poster row --
     and the file identity drops to the
     micro-label the rest of this page
     uses for metadata. */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpDocCell"
  }, doc.origin?.id ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: doc.origin.editUrl || doc.origin.viewUrl,
    ...newTab(doc.origin.title)
  }, doc.origin.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpDocMeta"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpMetaLabel"
  }, "Embed"), ` · ${doc.doc.slice(2, 8)}`, doc.origin.type ? ` · ${doc.origin.type}` : '')) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpDocPlain"
  }, doc.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpDocMeta"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpMetaLabel"
  }, "Embed"), ' · not on any current page')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpMetric"
  }, fmt(doc.views), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpBar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    style: {
      width: `${maxViews ? doc.views / maxViews * 100 : 0}%`,
      background: '#146ef5'
    }
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpMetric"
  }, fmt(doc.downloads), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpBar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    style: {
      width: `${maxDownloads ? doc.downloads / maxDownloads * 100 : 0}%`,
      background: '#cc6200'
    }
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    className: "pdfpNum"
  }, doc.views > 0 ? `${(doc.downloads / doc.views * 100).toFixed(1)}%` : '—')))))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpEmpty"
  }, loading ? 'Loading…' : emptyText);
};

/**
 * The empty-state sentence for a documents table.
 *
 * "Your own visits are not counted" is only true while Settings > Analytics is excluding
 * editors -- it is a switch, not a fact. Telling someone their visits are ignored when
 * they are being counted sends them hunting for a bug that is not there.
 */
const emptyFor = (window_, excludeEditors) => `Nothing recorded ${window_} yet. Visit a page where a document is embedded${excludeEditors ? ' — your own visits are not counted while you are logged in as an editor' : ''}.`;

/**
 * The padlock on a range the free build cannot read.
 *
 * The locked chips are DRAWN rather than hidden: the free user learns the shape of the
 * paid screen before paying, and one screenshot of this page serves both the plugin
 * gallery and the pricing page.
 */
const RangeLock = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  className: "pdfpChipLock",
  viewBox: "0 0 9 11",
  "aria-hidden": "true",
  focusable: "false"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M2 4.5V3.2a2.5 2.5 0 0 1 5 0v1.3",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.2"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "1",
  y: "4.5",
  width: "7",
  height: "5.5",
  fill: "currentColor"
}));

/**
 * How counting works.
 *
 * The same three facts the footnote carried as one paragraph, in the labelled cells the
 * rest of this screen is built from. People arrive with three separate questions --
 * "does this count me twice?", "does it survive my page cache?", "where does the data
 * go?" -- and three sentences run together answer none of them at a glance.
 *
 * ONE component for both tiers. The paragraph used to be written out twice in this
 * file, which is one careless edit away from the free and paid screens making different
 * promises about privacy.
 */
const FACTS = [{
  key: 'view',
  label: 'What counts as a view',
  body: 'The viewer has rendered the document and been on screen for a second — then not again for that visitor for 30 minutes.',
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M1 7s2.4-4 6-4 6 4 6 4-2.4 4-6 4-6-4-6-4Z",
    strokeLinejoin: "round"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "7",
    cy: "7",
    r: "1.9"
  }))
}, {
  key: 'cache',
  label: 'Works behind a cache',
  body: "Counting happens in the visitor's browser, not while the page is being built, so the numbers keep working behind a page cache.",
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M7.8 1 3 7.6h3.1L6.2 13 11 6.4H7.7L7.8 1Z",
    strokeLinejoin: "round"
  }))
}, {
  key: 'private',
  label: 'Stays on your site',
  body: 'No IP address is stored and nothing is sent to a third party — the rows live in your own database.',
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M7 1.2l4.6 1.7v3.6c0 2.8-1.9 4.9-4.6 5.6-2.7-.7-4.6-2.8-4.6-5.6V2.9L7 1.2Z",
    strokeLinejoin: "round"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M4.9 7.1 6.4 8.6l2.8-2.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))
}];
const CountingFootnote = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
  className: "pdfpLedger"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
  className: "pdfpLedgerRule"
}, "How counting works"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
  className: "pdfpLedgerGrid"
}, FACTS.map(f => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
  className: "pdfpLedgerCell",
  key: f.key
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "pdfpLedgerLabel"
}, f.icon, f.label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "pdfpLedgerBody"
}, f.body)))));
const Delta = ({
  value
}) => {
  if (value === null) return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpPill flat"
  }, "no baseline");
  if (value === 0) return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpPill flat"
  }, "no change");
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: `pdfpPill ${value > 0 ? 'up' : 'down'}`
  }, value > 0 ? `+${value}%` : `${value}%`);
};

/**
 * The document filter comes from the page URL, not from state.
 *
 * "Show Analytics" on a poster is a real page load carrying ?doc=p:123, so the filter has
 * to survive that navigation -- and it means the filtered view is a bookmarkable,
 * shareable link rather than a mode you can only reach by clicking.
 */
const docFromUrl = () => {
  try {
    const value = new URLSearchParams(window.location.search).get('doc') || '';
    return /^(p:[1-9][0-9]{0,18}|u:[0-9a-f]{40})$/.test(value) ? value : '';
  } catch (e) {
    return '';
  }
};
const Analytics = ({
  isPremium,
  adminUrl
}) => {
  const [days, setDays] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(30);
  const [doc, setDoc] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(docFromUrl);
  const [docList, setDocList] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    posters: [],
    embeds: []
  });
  const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    loading: true,
    data: null,
    error: null
  });
  const [exporting, setExporting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Free build only. A locked chip answers a question the reader just asked about
  // their own data, so it brings the card that answers it into view and flags it --
  // opening a payment dialog at that moment is where the goodwill goes.
  const stageRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [pulsing, setPulsing] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const askedForRange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    stageRef.current?.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    });
    setPulsing(true);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!pulsing) return undefined;
    const t = window.setTimeout(() => setPulsing(false), 1000);
    return () => window.clearTimeout(t);
  }, [pulsing]);

  /**
   * Change the filter and keep the URL honest.
   *
   * replaceState rather than a reload: the request is already re-fired by the effects
   * below, and a full navigation would throw away the selected range. Writing ?doc=
   * back into the address bar keeps the filtered view bookmarkable and shareable,
   * which is the property docFromUrl() exists to support.
   */
  const selectDoc = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(next => {
    setDoc(next);
    try {
      const url = new URL(window.location.href);
      if (next) {
        url.searchParams.set('doc', next);
      } else {
        url.searchParams.delete('doc');
      }
      window.history.replaceState({}, '', url);
    } catch (e) {
      // A browser that refuses history writes still filters correctly; only the
      // bookmarkability is lost, so this is not worth surfacing.
    }
  }, []);

  // The picker is on both tiers, so its list is fetched on both.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let alive = true;
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      path: '/pdfp/v1/ajax',
      method: 'POST',
      data: {
        model: 'Analytics',
        method: 'documents'
      }
    }).then(d => {
      if (alive) setDocList({
        posters: d?.posters || [],
        embeds: d?.embeds || []
      });
    }).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  const load = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(range => {
    setState(s => ({
      ...s,
      loading: true,
      error: null
    }));
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      path: '/pdfp/v1/ajax',
      method: 'POST',
      data: {
        model: 'Analytics',
        method: 'summary',
        days: range,
        doc
      }
    }).then(data => setState({
      loading: false,
      data,
      error: null
    })).catch(err => setState({
      loading: false,
      data: null,
      error: err?.error || err?.code || 'failed'
    }));
  }, [doc]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isPremium) load(days);
  }, [days, isPremium, load]);

  // Free build only. summary() is Pro and 403s, so the free screen is fed by today(),
  // which answers for every tier. A licensed build never draws that branch and never
  // makes this request.
  const [today, setToday] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    loading: true,
    data: null
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isPremium) return undefined;
    let alive = true;
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      path: '/pdfp/v1/ajax',
      method: 'POST',
      data: {
        model: 'Analytics',
        method: 'today',
        doc
      }
    }).then(data => {
      if (alive) setToday({
        loading: false,
        data
      });
    }).catch(() => {
      if (alive) setToday({
        loading: false,
        data: null
      });
    });
    return () => {
      alive = false;
    };
  }, [isPremium, doc]);

  // Component scope, not inside a branch: both tiers show "of N documents", and N is
  // the picker's own list so the tile and the selectable documents are one set.
  const docTotal = (docList.posters?.length || 0) + (docList.embeds?.length || 0);
  const {
    loading,
    data,
    error
  } = state;
  const totals = data?.totals || {
    views: 0,
    downloads: 0
  };
  const previous = data?.previous || {
    views: 0,
    downloads: 0
  };
  const docs = data?.docs || [];

  // What the deltas are measured against. A one-day range compares with yesterday,
  // and "vs previous 1 days" is the kind of string that makes a product look unfinished.
  const vsLabel = days === 1 ? 'vs yesterday' : `vs previous ${days} days`;
  const rangeLabel = days === 1 ? 'today' : `${days} days`;
  const rate = totals.views > 0 ? totals.downloads / totals.views * 100 : 0;
  const prevRate = previous.views > 0 ? previous.downloads / previous.views * 100 : 0;
  const busiest = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!data?.series?.length) return null;
    return data.series.reduce((best, p) => {
      var _best$views;
      return p.views > ((_best$views = best?.views) !== null && _best$views !== void 0 ? _best$views : -1) ? p : best;
    }, null);
  }, [data]);
  const exportCsv = () => {
    setExporting(true);
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      path: '/pdfp/v1/ajax',
      method: 'POST',
      data: {
        model: 'Analytics',
        method: 'export',
        days,
        doc
      }
    }).then(({
      csv,
      filename
    }) => {
      // Built and released in the browser: nothing is written on the server, so
      // there is no temporary file to clean up or to leak.
      const url = URL.createObjectURL(new Blob([csv], {
        type: 'text/csv;charset=utf-8'
      }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'pdf-poster-insights.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }).catch(() => {}).finally(() => setExporting(false));
  };

  // ---------------------------------------------------------------- free build
  // Today is real on every tier -- pdfp_should_count() no longer checks entitlement, so
  // these figures are this site's own. What Pro unlocks is every reading of the past,
  // which is why this branch fetches `today` (free-safe) rather than `summary` (403).
  //
  // The copy must never imply history is missing: it is being recorded right now, and
  // saying otherwise here would be the one place in the product that lies about it.
  if (!isPremium) {
    const t = today.data?.totals || {
      views: 0,
      downloads: 0
    };
    const topDocs = today.data?.docs || [];
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "bPlDashboardContainer"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpAnalytics"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpAnalyticsHead"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "pdfpAnalyticsTitle"
    }, doc && today.data?.docTitle ? today.data.docTitle : 'Analytics'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "pdfpAnalyticsSub"
    }, doc ? "Today's views and downloads for this document." : 'Find out which of your PDFs people actually read.')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpAnalyticsControls"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(DocPicker, {
      list: docList,
      value: doc,
      onChange: selectDoc
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpChips",
      role: "group",
      "aria-label": "Date range"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      type: "button",
      className: "pdfpChip on",
      "aria-pressed": "true"
    }, "Today"), RANGES.filter(r => r.days > 1).map(r => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      key: r.days,
      type: "button",
      className: "pdfpChip locked",
      "aria-label": `${r.label} — included in Pro`,
      onClick: askedForRange
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(RangeLock, null), r.label))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      type: "button",
      className: "pdfpGhostBtn locked",
      "aria-label": "Export CSV \u2014 included in Pro",
      onClick: askedForRange
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(RangeLock, null), "Export CSV"))), today.data?.tracking === false && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpNotice warn"
    }, "Counting is switched off for this site, so nothing is being recorded. Turn it back on in Settings \u203A Analytics."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpTiles"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpTile views"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileLabel"
    }, "Views today"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileValue"
    }, today.loading && !today.data ? '—' : fmt(t.views)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileFoot"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileNote"
    }, "resets at midnight, site time"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpTile downloads"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileLabel"
    }, "Downloads today"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileValue"
    }, today.loading && !today.data ? '—' : fmt(t.downloads)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileFoot"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileNote"
    }, "resets at midnight, site time"))), !doc && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpTile"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileLabel"
    }, "Documents counted today"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileValue"
    }, today.loading && !today.data ? '—' : fmt(today.data?.docCount)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileFoot"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpTileNote"
    }, docTotal ? `of ${fmt(docTotal)} documents` : 'with a view or download')))), today.data?.countingSince && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "pdfpTileNote pdfpSinceLine"
    }, today.data.countingSince), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_LockedHistory__WEBPACK_IMPORTED_MODULE_3__["default"], {
      ref: stageRef,
      history: today.data?.history,
      tracking: today.data?.tracking,
      pulsing: pulsing,
      pricingUrl: `${adminUrl}/edit.php?post_type=pdfposter&page=pdf-poster#/pricing`
    }), !doc && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "bPlDashboardCard pdfpPanel"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "pdfpPanelHead"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpPanelTitle"
    }, "Top documents today"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pdfpPanelMeta"
    }, "by views \xB7 today")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(DocTable, {
      rows: topDocs,
      loading: today.loading,
      emptyText: emptyFor('today', today.data?.excludeEditors)
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CountingFootnote, null)));
  }

  // ---------------------------------------------------------------- pro build
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardContainer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpAnalytics"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpAnalyticsHead"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "pdfpAnalyticsTitle"
  }, data?.docTitle ? data.docTitle : 'Analytics'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpAnalyticsSub"
  }, data?.range ? `${prettyDate(data.range.from)} – ${prettyDate(data.range.to)}${data.doc ? '' : ` · ${fmt(data.docCount)} ${data.docCount === 1 ? 'document' : 'documents'}`}${data.excludeEditors ? ' · logged-in editors excluded' : ''}` : 'Loading…'), data?.doc && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpAnalyticsCrumbs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "pdfpCrumbBtn",
    onClick: () => selectDoc('')
  }, "\u2190 All documents"), data.docEditUrl && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpCrumbSep"
  }, "\xB7"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: data.docEditUrl,
    ...newTab('Edit this document')
  }, "Edit this document")), data.docOrigin?.id && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpCrumbSep"
  }, "\xB7"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "Embedded on", ' ', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: data.docOrigin.editUrl || data.docOrigin.viewUrl,
    ...newTab(data.docOrigin.title)
  }, data.docOrigin.title))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpAnalyticsControls"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(DocPicker, {
    list: docList,
    value: doc,
    onChange: selectDoc
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpChips",
    role: "group",
    "aria-label": "Date range"
  }, RANGES.map(r => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: r.days,
    type: "button",
    className: `pdfpChip${days === r.days ? ' on' : ''}`,
    "aria-pressed": days === r.days,
    onClick: () => setDays(r.days)
  }, r.label))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: "pdfpGhostBtn",
    onClick: exportCsv,
    disabled: exporting || !docs.length
  }, exporting ? 'Preparing…' : 'Export CSV'))), data?.tracking === false && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpNotice warn"
  }, "Counting is switched off for this site, so nothing new is being recorded.", ' ', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: `${adminUrl}/edit.php?post_type=pdfposter&page=fpdf-settings`
  }, "Turn it on in Settings \u203A Analytics")), error && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpNotice warn"
  }, "Could not load the numbers just now. Reload the page to try again."), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpTiles"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpTile views"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileLabel"
  }, "Views"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileValue"
  }, loading && !data ? '—' : fmt(totals.views)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileFoot"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Delta, {
    value: delta(totals.views, previous.views)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileNote"
  }, vsLabel))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpTile downloads"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileLabel"
  }, "Downloads"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileValue"
  }, loading && !data ? '—' : fmt(totals.downloads)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileFoot"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Delta, {
    value: delta(totals.downloads, previous.downloads)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileNote"
  }, vsLabel))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpTile"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileLabel"
  }, "Download rate"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileValue"
  }, loading && !data ? '—' : `${rate.toFixed(1)}%`), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileFoot"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Delta, {
    value: prevRate ? Math.round((rate - prevRate) / prevRate * 100) : null
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileNote"
  }, "downloads \xF7 views"))), days === 1 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpTile"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileLabel"
  }, "Documents counted today"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileValue"
  }, loading && !data ? '—' : fmt(data?.docCount)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileFoot"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileNote"
  }, docTotal ? `of ${fmt(docTotal)} documents` : 'with a view or download'))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpTile"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileLabel"
  }, "Busiest day"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileValue small"
  }, loading && !data ? '—' : busiest && busiest.views > 0 ? prettyDate(busiest.day) : 'No views yet'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileFoot"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpTileNote"
  }, busiest && busiest.views > 0 ? `${fmt(busiest.views)} views that day` : 'in this range')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardCard pdfpPanel"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpPanelHead"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpPanelTitle"
  }, "Views and downloads"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpLegend"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    style: {
      background: '#146ef5'
    }
  }), "Views"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    style: {
      background: '#cc6200'
    }
  }), "Downloads"))), loading && !data ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpEmpty"
  }, "Loading\u2026") : data?.series?.length ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Chart__WEBPACK_IMPORTED_MODULE_2__["default"], {
    series: data.series
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpEmpty"
  }, "No data in this range yet."), data?.firstDay && data?.range?.from && data.firstDay > data.range.from && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "pdfpChartNote"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "7",
    cy: "7",
    r: "5.6"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M7 6.2v4",
    strokeLinecap: "round"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M7 4.1v.1",
    strokeLinecap: "round",
    strokeWidth: "1.8"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("b", null, "Counting started ", prettyDate(data.firstDay), "."), " Days before that are empty because they were never measured \u2014 not because nobody read anything."))), !data?.doc && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboardCard pdfpPanel"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "pdfpPanelHead"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpPanelTitle"
  }, "Top documents"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "pdfpPanelMeta"
  }, "by views \xB7 ", rangeLabel)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(DocTable, {
    rows: docs,
    loading: loading,
    emptyText: emptyFor('in this range', data?.excludeEditors)
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CountingFootnote, null)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Analytics);

/***/ },

/***/ "./src/dashboard/components/AnalyticsPage.js"
/*!***************************************************!*\
  !*** ./src/dashboard/components/AnalyticsPage.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bpl_tools_Admin_Header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../bpl-tools/Admin/Header */ "../bpl-tools/Admin/Header/index.js");
/* harmony import */ var _Analytics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Analytics */ "./src/dashboard/components/Analytics/index.js");
/* harmony import */ var _PluginNav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PluginNav */ "./src/dashboard/components/PluginNav.js");





/**
 * Standalone wrapper for the Analytics screen.
 *
 * The screen has its own submenu under PDF Poster, so it renders outside the dashboard's
 * router. It keeps the same chrome -- .bPlDashboard ground, the bpl-tools Header, the
 * .bPlDashboardMain padding -- so the page is indistinguishable from the dashboard route
 * it also still answers on.
 *
 * The header's nav slot carries the plugin's real admin menu rather than the dashboard's
 * hash routes -- those belong to the Demo and Help page and would be dead ends here.
 */
const AnalyticsPage = props => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
  className: "bPlDashboard"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_Header__WEBPACK_IMPORTED_MODULE_1__["default"], {
  ...props
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_PluginNav__WEBPACK_IMPORTED_MODULE_3__["default"], {
  adminUrl: props.adminUrl,
  current: "analytics"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("main", {
  className: "bPlDashboardMain"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Analytics__WEBPACK_IMPORTED_MODULE_2__["default"], {
  ...props
})));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AnalyticsPage);

/***/ },

/***/ "./src/dashboard/components/App.js"
/*!*****************************************!*\
  !*** ./src/dashboard/components/App.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/development/chunk-JMJ3UQ3L.mjs");
/* harmony import */ var _bpl_tools_Admin_Welcome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../bpl-tools/Admin/Welcome */ "../bpl-tools/Admin/Welcome/index.js");
/* harmony import */ var _bpl_tools_Admin_Demos__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../bpl-tools/Admin/Demos */ "../bpl-tools/Admin/Demos/index.js");
/* harmony import */ var _bpl_tools_Admin_Pricing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../bpl-tools/Admin/Pricing */ "../bpl-tools/Admin/Pricing/index.js");
/* harmony import */ var _bpl_tools_Admin_FeatureCompare__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../bpl-tools/Admin/FeatureCompare */ "../bpl-tools/Admin/FeatureCompare/index.js");
/* harmony import */ var _bpl_tools_Admin_Activation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../bpl-tools/Admin/Activation */ "../bpl-tools/Admin/Activation/index.js");
/* harmony import */ var _bpl_tools_Admin_OurPlugins__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../bpl-tools/Admin/OurPlugins */ "../bpl-tools/Admin/OurPlugins/index.js");
/* harmony import */ var _Analytics__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Analytics */ "./src/dashboard/components/Analytics/index.js");
/* harmony import */ var _Layout__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Layout */ "./src/dashboard/components/Layout.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/data */ "./src/dashboard/utils/data.js");











const App = props => {
  const {
    isPremium,
    hasPro,
    adminUrl
  } = props;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.HashRouter, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Routes, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Layout__WEBPACK_IMPORTED_MODULE_9__["default"], {
      ...props
    })
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    index: true,
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_Welcome__WEBPACK_IMPORTED_MODULE_2__["default"], {
      ...props,
      ...(0,_utils_data__WEBPACK_IMPORTED_MODULE_10__.welcomeInfo)(adminUrl)
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "welcome",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_Welcome__WEBPACK_IMPORTED_MODULE_2__["default"], {
      ...props,
      ...(0,_utils_data__WEBPACK_IMPORTED_MODULE_10__.welcomeInfo)(adminUrl)
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "demos",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_Demos__WEBPACK_IMPORTED_MODULE_3__["default"], {
      demoInfo: _utils_data__WEBPACK_IMPORTED_MODULE_10__.demoInfo,
      ...props
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "analytics",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Analytics__WEBPACK_IMPORTED_MODULE_8__["default"], {
      ...props
    })
  }), !isPremium && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "pricing",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_Pricing__WEBPACK_IMPORTED_MODULE_4__["default"], {
      pricingInfo: _utils_data__WEBPACK_IMPORTED_MODULE_10__.pricingInfo,
      options: {},
      ...props
    })
  }), !isPremium && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "feature-comparison",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_FeatureCompare__WEBPACK_IMPORTED_MODULE_5__["default"], {
      plans: ['free', 'pro'],
      ...props
    })
  }), hasPro && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "activation",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_Activation__WEBPACK_IMPORTED_MODULE_6__["default"], {
      ...props
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "our-plugins",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_OurPlugins__WEBPACK_IMPORTED_MODULE_7__["default"], {
      ...props
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "*",
    element: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Navigate, {
      to: "/welcome",
      replace: true
    })
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ },

/***/ "./src/dashboard/components/Layout.js"
/*!********************************************!*\
  !*** ./src/dashboard/components/Layout.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/development/chunk-JMJ3UQ3L.mjs");
/* harmony import */ var _bpl_tools_Admin_Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../bpl-tools/Admin/Header */ "../bpl-tools/Admin/Header/index.js");



const navigation = [{
  name: 'Welcome',
  href: '/welcome'
},
// { name: 'Blocks', href: '/blocks' },
{
  name: 'Demos',
  href: '/demos'
}, {
  name: 'Pricing',
  href: '/pricing'
}, {
  name: 'Feature Comparison',
  href: '/feature-comparison'
}, {
  name: 'Activation',
  href: '/activation'
}];
const Layout = props => {
  const {
    isPremium,
    hasPro
  } = props;
  const location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bPlDashboard"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_bpl_tools_Admin_Header__WEBPACK_IMPORTED_MODULE_2__["default"], {
    ...props
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("nav", {
    className: "bPlDashboardNav"
  }, navigation?.filter(item => item.href !== '/activation' || hasPro) // Hide activation link for non-pro users
  ?.filter(item => !isPremium || !['/purchase', '/pricing', '/feature-comparison'].includes(item.href)) // Hide link for premium users
  ?.map((item, index) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    key: index,
    to: item.href,
    className: `navLink ${location.pathname === item.href || item.href === '/welcome' && location.pathname === '/' ? 'active' : ''}`
  }, item.name)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("main", {
    className: "bPlDashboardMain"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Outlet, null)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Layout);

/***/ },

/***/ "./src/dashboard/components/PluginNav.js"
/*!***********************************************!*\
  !*** ./src/dashboard/components/PluginNav.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/**
 * The plugin's own admin navigation, for the header's nav slot.
 *
 * These are real page loads, not hash routes: every item is a separate WordPress admin
 * screen (two of them, All PDF Posters and Add New, are not even plugin pages). So they
 * are plain anchors rather than react-router <Link>s, which would only rewrite the hash
 * and leave the visitor on whichever page they were already on.
 *
 * Class names are bpl-tools' own -- .bPlDashboardNav / .navLink / .active -- so the slot
 * inherits the header's styling, including the 2px primary underline on the current item
 * and the sub-1350px collapse into the hamburger that Header wires up.
 */
const PluginNav = ({
  adminUrl = '',
  current = 'analytics'
}) => {
  const base = `${adminUrl}/edit.php?post_type=pdfposter`;
  const items = [{
    key: 'list',
    name: 'All PDF Posters',
    href: base
  }, {
    key: 'new',
    name: 'Add New',
    href: `${adminUrl}/post-new.php?post_type=pdfposter`
  }, {
    key: 'settings',
    name: 'Settings',
    href: `${base}&page=fpdf-settings`
  }, {
    key: 'analytics',
    name: 'Analytics',
    href: `${base}&page=pdf-poster-analytics`
  }, {
    key: 'help',
    name: 'Demo and Help',
    href: `${base}&page=pdf-poster`
  }];
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("nav", {
    className: "bPlDashboardNav",
    "aria-label": "PDF Poster"
  }, items.map(item => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    key: item.key,
    href: item.href,
    className: `navLink${current === item.key ? ' active' : ''}`,
    "aria-current": current === item.key ? 'page' : undefined
  }, item.name)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PluginNav);

/***/ },

/***/ "./src/dashboard/utils/data.js"
/*!*************************************!*\
  !*** ./src/dashboard/utils/data.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dashboardInfo: () => (/* binding */ dashboardInfo),
/* harmony export */   demoInfo: () => (/* binding */ demoInfo),
/* harmony export */   gutenbergTabIcon: () => (/* binding */ gutenbergTabIcon),
/* harmony export */   pricingInfo: () => (/* binding */ pricingInfo),
/* harmony export */   quickEmbedTabIcon: () => (/* binding */ quickEmbedTabIcon),
/* harmony export */   shortcodeTabIcon: () => (/* binding */ shortcodeTabIcon),
/* harmony export */   welcomeInfo: () => (/* binding */ welcomeInfo)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const slug = 'pdf-poster';

/**
 * Plugin URL, localised as `pdfpDashboard.dir` in PDFP_Admin::adminEnqueueScripts().
 * Falls back to an empty string so the module stays importable outside the dashboard
 * bundle (tests, storybook, the block editor).
 */
const pluginUrl = typeof window !== 'undefined' && window.pdfpDashboard?.dir || '';

/** Overview artwork shipped with the plugin, so the Welcome page never waits on a remote host. */
const overviewImage = `${pluginUrl}assets/images/pdf-poster-overview.png`;
const gutenbergTabIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "3",
  y: "3",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "14",
  y: "3",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "3",
  y: "14",
  width: "7",
  height: "7",
  rx: "1"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "14",
  y: "14",
  width: "7",
  height: "7",
  rx: "1"
}));
const shortcodeTabIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "16 18 22 12 16 6"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "8 6 2 12 8 18"
}));
const quickEmbedTabIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
}));
const dashboardInfo = info => {
  const {
    version,
    isPremium,
    hasPro,
    adminUrl = '',
    licenseActiveNonce
  } = info;
  const proSuffix = isPremium ? ' Pro' : '';
  return {
    name: `PDF Poster${proSuffix}`,
    displayName: `PDF Poster${proSuffix} - Display PDF Files with Custom Viewer`,
    description: `PDF Poster${proSuffix} lets you embed PDF files in WordPress using a responsive viewer and block support, including full-screen, download, and print options.`,
    slug,
    version,
    isPremium,
    hasPro,
    adminUrl,
    displayOurPlugins: true,
    media: {
      logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
      banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
      thumbnail: overviewImage
    },
    pages: {
      org: `https://wordpress.org/plugins/${slug}/`,
      landing: `https://bplugins.com/products/${slug}/`,
      docs: `https://bplugins.com/docs/${slug}/`,
      pricing: `https://bplugins.com/products/${slug}/pricing`
    },
    freemius: {
      product_id: 14261,
      plan_id: 23852,
      public_key: 'pk_6e833032174d131283193892a44a2'
    },
    licenseActiveNonce,
    startButton: {
      label: 'Start Now',
      url: `${adminUrl}/post-new.php?post_type=pdfposter`
    }
  };
};
const welcomeInfo = adminUrl => ({
  keywords: ['PDF Embedder', 'FlipBook', 'Gutenberg Block', 'Shortcode', 'Adobe Viewer'],
  keywordsLabel: 'Features',
  gettingStarted: {
    tabs: [{
      key: 'gutenberg',
      label: 'Gutenberg',
      icon: gutenbergTabIcon,
      steps: [{
        num: 1,
        title: 'Insert the Block',
        body: 'Click <strong>+</strong> in the Gutenberg editor and search for <strong>PDF Poster</strong>.',
        link: {
          url: `${adminUrl}/post-new.php`,
          label: 'Open Editor'
        }
      }, {
        num: 2,
        title: 'Select PDF',
        body: 'Choose an existing PDF from your Media Library or upload a new one inside the block.'
      }, {
        num: 3,
        title: 'Publish & Preview',
        body: 'Customize height, width, and options in the block sidebar, then hit <strong>Publish</strong>.'
      }]
    }, {
      key: 'shortcode',
      label: 'Shortcode',
      icon: shortcodeTabIcon,
      steps: [{
        num: 1,
        title: 'Create Poster',
        body: 'Go to <strong>PDF Poster › Add New</strong> to create a new PDF Poster post.',
        link: {
          url: `${adminUrl}/post-new.php?post_type=pdfposter`,
          label: 'Add New'
        }
      }, {
        num: 2,
        title: 'Upload & Save',
        body: 'Upload your PDF, name it, configure layout/viewer settings, and click <strong>Publish</strong>.'
      }, {
        num: 3,
        title: 'Copy Shortcode',
        body: 'Copy the shortcode like <code>[pdf id="POST_ID"]</code> from the list or the metabox.'
      }, {
        num: 4,
        title: 'Paste Anywhere',
        body: 'Paste the copied shortcode into any page, post, widget, or template.'
      }]
    }, {
      key: 'quick',
      label: 'Quick Embedder',
      icon: quickEmbedTabIcon,
      steps: [{
        num: 1,
        title: 'Set Default Options',
        body: 'Go to <strong>PDF Poster › Settings</strong> to set your global default width and height.',
        link: {
          url: `${adminUrl}/edit.php?post_type=pdfposter&page=fpdf-settings`,
          label: 'Go to Settings'
        }
      }, {
        num: 2,
        title: 'Use Embed Shortcode',
        body: 'Embed any PDF directly using: <code>[pdf_embed url="YOUR_PDF_URL"]</code>.'
      }, {
        num: 3,
        title: 'Customize Attributes',
        body: 'Override defaults by adding attributes like <code>width</code>, <code>height</code>, <code>print</code>, or <code>download_btn</code>.'
      }]
    }]
  },
  changelogs: [{
    version: '2.6.0 - 06 Sep 2026',
    type: 'new',
    list: ['<strong>New:</strong> Document Insights — see how many times every PDF was viewed and downloaded today, free, without adding a third-party analytics service. The figures stay in your own site.', '<strong>New:</strong> Analytics screen — a new Analytics item under PDF Poster showing today\'s figures, and with Pro a 7, 30 or 90 day view: views and downloads over time, change against the previous period, download rate, busiest day, your best-performing documents ranked, and CSV export.', '<strong>New:</strong> Per-document reports — open any single document\'s own trend and totals from the editor, as a link you can bookmark or share with your team.', '<strong>New:</strong> Analytics panel on every document — today\'s views and downloads in the block editor sidebar and beside the Save button in the classic editor, with all-time totals and a 14-day trend in Pro.', '<strong>New:</strong> Views and Downloads columns on the PDF Posters list — today\'s figures for everyone, all-time and sortable in Pro.', '<strong>New:</strong> Settings > Analytics — turn counting on or off site-wide, keep your own visits out of the numbers, and optionally respect the browser\'s Do Not Track setting.', '<strong>New:</strong> Counting keeps working behind a page cache, so sites on WP Rocket, LiteSpeed or Cloudflare get real figures instead of one view per cached copy.', '<strong>New:</strong> Every embed is counted, not only saved PDF Posters. A block placed directly on a page and `[pdf_embed url="..."]` each get their own figures, and the report links through to the page they sit on.', '<strong>New:</strong> A view is recorded once the viewer has genuinely been on screen — not on every page load — and once per visitor per 30 minutes. Downloads and prints are counted however the reader triggers them.', '<strong>New:</strong> Private by default. No IP address is stored, no cookie is set, and this release keeps daily totals only — in your own database, never sent anywhere.', '<strong>New:</strong> Nothing to import if you upgrade later — every day is recorded from the start, so Pro reads back the history your site has already built.', '<strong>New:</strong> Popup (lightbox) viewer, a text watermark with three ready-made themes, per-block Class and CSS, a site-wide Custom CSS box and the Preset defaults screen are all free in this release.', '<strong>Update:</strong> The shortcode columns on the PDF Posters list now show the shortcode itself in a click-to-copy chip, instead of a button whose label hid the value it copied.', '<strong>Update:</strong> Links out of a report open in a new tab, so your date range and filters stay where you left them.', '<strong>Fix:</strong> Content protection no longer shows a developer-tools warning while a page is open in Elementor, Divi, Bricks, Beaver Builder, Oxygen or Breakdance. Editing behaves normally again, including Ctrl+S to save and right-click.', '<strong>Fix:</strong> The plugin dashboard requested a stylesheet that is never generated, producing a 404 on every load.']
  }, {
    version: '2.5.6 - 31 Aug 2026',
    type: 'new',
    list: ['New: Watermark & Branding — stamp a text or logo mark over any viewer, with six ready-made themes that set the angle, repeat, weight and blend for you.', 'New: Watermark mark types — Text, Image (your logo) or both stacked together.', 'New: Watermark Coverage — a single positioned mark, or tiled Sparse/Normal/Dense so it cannot be cropped out of a screenshot.', 'New: Watermark Image Style — Original, Grayscale, White (for dark pages) or Black.', 'New: Watermark Strength and Size as named steps rather than numbers, so the mark stays readable at every zoom level and on mobile.', 'New: Watermark page scope (all pages, first page only, or all except the cover) and audience rules (everyone, everyone except admins, or logged-out visitors only).', 'New: Watermark "Restore If Removed" option, which puts the mark back if a visitor deletes it with browser dev tools.', 'New: Added a Watermark & Branding section to the Gutenberg block sidebar and the classic editor metabox, so the free build shows what the Pro watermarking tools cover.', 'Update: Rewrote the Free and Pro feature lists so each one matches what that version actually ships — FlipBook, Slider, the [pdf_embed] shortcode, the classic editor metabox, the second Gutenberg block and Google Doc Viewer were all listed as Pro despite being free.', 'Update: Documented every setting added since 2.5.2 (Viewer Theme, RTL Layout, Keyboard Navigation, Annotation Mode, Page Flip Sound, Fast Loading, Image Gallery flipbooks, social sharing) in the free feature list.', 'Fixed: Blocks saved with PDF Poster Pro no longer lose their watermark configuration when the post is edited on a free install.', 'Note: Watermarking is a deterrent, not DRM — an on-screen mark can be removed with browser dev tools, and no browser can prevent a screenshot. Marks in printouts and downloaded copies arrive in a following release.']
  }, {
    version: '2.5.5 - 03 Aug 2026',
    type: 'new',
    list: ['New: Added Image Gallery source for the Flipbook viewer — build a page-flip book from an ordered set of images without a PDF.', 'New: Added Viewer Theme option (Light/Dark/Auto) that themes the viewer toolbar and background without altering the PDF page content.', 'New: Added RTL Layout option (Off/On/Auto) for right-to-left languages, applied across all viewers and the PDF toolbar.', 'New: Added Keyboard Navigation option (Left/Right arrow keys to change pages) for all viewers.', 'New: Added a Page Flip Sound toggle for Flipbook and Slider viewers (on by default; can now be turned off).', 'New: Added Fast Loading (Progressive Rendering) option for all viewers (Default, Adobe, Flipbook, Scroll, Slider) to stream large PDFs so the first page appears sooner.', 'Fixed: Full screen option smooth behaviour.']
  }, {
    version: '2.5.4 - 15 June 2026',
    type: 'new',
    list: ['New: Added interactive PDF Chatbot assistant.', 'New: Added Slider and Scroll Viewer options.', 'New: Added Annotation Mode configuration for default viewer.', 'New: Added Open PDF links in new tab configuration for default viewer.']
  }, {
    version: '2.5.3 - 10 Jun 2026',
    type: 'update',
    list: ['Update: Admin Dashboard aligned with the latest standard and bpl-tools layout.', 'Security: Enhanced request validation and sanitized AJAX inputs.', 'Security: Secured public REST API endpoints with authentication checks.', 'Compliance: Added full uninstall cleanup routine for custom options and database tables.', 'Compliance: Standardized translation text domains to match the plugin slug.', 'Fixed: Corrected general typos, updated GPL license headers, and added distribution ignore rules.']
  }, {
    version: '2.5.2 - 19 May 2026',
    type: 'new',
    list: ['New: Added FlipBook Viewer support for a more interactive and realistic PDF reading experience.', 'New: Introduced fully responsive Height & Width controls for Desktop, Tablet, and Mobile devices.', 'New: Added a Device Preview Switcher in the plugin metabox for easier responsive configuration.', 'Improved: Enhanced PDF viewer dimension handling across different screen sizes for better responsiveness.', 'Improved: Refactored the entire plugin codebase for better maintainability and cleaner architecture.', 'Improved: Removed unused and redundant code to reduce plugin bloat and improve performance.', 'Improved: Optimized core functionality for faster loading and smoother user experience.', 'Fixed: Resolved existing bugs and minor compatibility issues.', 'Security: Strengthened overall plugin security and improved code quality following best practices.', 'Update: Unlocked all previously gated Premium settings, making them fully functional in the Free version.', 'Security: Enhanced request validation for API and AJAX endpoints.', 'Security: Improved database query sanitization and hardening.', 'Improved: Replaced PHP 8.0 specific functions to restore PHP 7.1+ support.', 'Improved: Conducted a comprehensive i18n sweep for proper translation support.', 'Compliance: Added explicit Terms of Service and Privacy Policy links to the readme.']
  }, {
    version: '2.5.1 - 26 April 2026',
    type: 'fixed',
    list: ['Fixed: PDFs hosted on external domains or CDNs were not loading at all', 'Fixed: Google Docs Viewer was sending the same request twice and canceling both', 'Fixed: When Google Docs Viewer failed there was nothing to fall back on', 'Fixed: PDF.js errors were invisible — users just saw a white empty box', 'Fixed: No message was shown when a PDF file was missing or completely empty', 'Fixed: PDF viewer was not opening on iPhone and iPad running iOS 16 and 17', 'Fixed: Tapping the fullscreen button on iPhone did absolutely nothing', 'Fixed: PDFs were not loading on Android Chrome and Samsung Internet browser', 'Fixed: Chinese, Japanese and Korean characters were showing as random broken symbols', 'Fixed: PDFs made with LaTeX or older Adobe tools were showing wrong or unreadable text', 'Fixed: Changes made to an existing PDF entry were lost after hitting update', 'Fixed: Shortcode was pasting fine but showing nothing at all on the live page', 'Fixed: PDFs with spaces or special characters in the filename were crashing the viewer', 'Fixed: An unexpected heading was appearing above the viewer on some themes', 'Fixed: Embedding a PDF by URL was showing raw code instead of the actual document', 'Fixed: PDF viewer was not displaying properly inside Elementor\'s preview panel', 'Update: Removed unexpected or unnecessary conten & code from the whole plugin.']
  }, {
    version: '2.5.0 - 4 March 2026',
    type: 'update',
    list: ['Update: Help & Demo Page', 'Update: Added Info text with all the controls.', 'Update: Remove affiliate and contact Submenu.', 'Update: Move shortcode area to the right side (Classic Shortcode Generator).']
  }],
  changelogsLimit: 2,
  changelogsReadMoreLabel: 'View More Changelogs',
  proFeatures: ["Analytics history — all-time totals and 7, 30 or 90 day trends", "Top documents ranked, download rate and busiest day", "CSV export, plus sortable Views and Downloads columns", "Adobe PDF viewer — embed modes including lightbox", "Continuous Scroll viewer — built for long reports", "Watermark your logo — any colour, size, angle and coverage", "Watermark rules — who sees it, and restore it if removed", "Protect Content — block right-click, copying and text selection", "Reader Mode — no toolbar, no distractions", "Thumbnail sidebar for quick page jumps", "Start at any page and zoom level", "Rename the Download and Fullscreen buttons", "Open fullscreen in a new tab, buttons above or below the viewer", "Import PDFs straight from Dropbox and Google Drive", "Save block presets and reuse them everywhere", "Always load the latest uploaded file", "Priority one-on-one support"]
});
const demoInfo = {
  demos: [{
    "title": "Default PDF Viewer",
    "url": "https://pdfposter.com/demo/default/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Custom Width Viewer",
    "url": "https://pdfposter.com/demo/custom-width/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Custom Height Viewer",
    "url": "https://pdfposter.com/demo/custom-height/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 320 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3V402.7L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7V109.3l41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Allow Print Option",
    "url": "https://pdfposter.com/demo/allow-print/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Title on Top",
    "url": "https://pdfposter.com/demo/show-file-name-on-top/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M0 64C0 46.3 14.3 32 32 32H80h48c17.7 0 32 14.3 32 32s-14.3 32-32 32H112V208H336V96H320c-17.7 0-32-14.3-32-32s14.3-32 32-32h48 48c17.7 0 32 14.3 32 32s-14.3 32-32 32H400V240 416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H368 320c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V272H112V416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H80 32c-17.7 0-32-14.3-32-32s14.3-32 32-32H48V240 96H32C14.3 96 0 81.7 0 64z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Download Button on Top",
    "url": "https://pdfposter.com/demo/show-download-button-on-top/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Full-Screen Button on Top",
    "url": "https://pdfposter.com/demo/show-view-full-screen-button-on-top/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Protected Content View",
    "url": "https://pdfposter.com/demo/protect-content/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Thumbnail Toggle Menu",
    "url": "https://pdfposter.com/demo/thumbnails-toggle-menu/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      id: "layout-sidebar-inset"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Jump-to-Page Navigation",
    "url": "https://pdfposter.com/demo/jump-to-page/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 576 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M137.4 502.6c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7V288H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H448V109.3l41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L384 109.3V224H192 128 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96V402.7L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96zM128 192h64V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V192zM448 320H384V448c0 17.7 14.3 32 32 32s32-14.3 32-32V320z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Quick Embed",
    "url": "https://pdfposter.com/demo/quick-embed/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 640 512"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"
    })),
    "category": "",
    type: 'iframe'
  }, {
    "title": "Adobe Embedder Integration",
    "url": "https://pdfposter.com/demo/embed-pdf-with-adobe-embedder/",
    "icon": (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "20px",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      id: "file-earmark-pdf-fill"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      "fill-rule": "evenodd",
      d: "M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"
    })),
    "category": "",
    type: 'iframe'
  }]
};
const pricingInfo = {
  logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
  pluginId: 14261,
  planId: 23852,
  licenses: [1, 3, null],
  button: {
    label: 'Buy Now ➜'
  },
  featured: {
    selected: 3
  }
};

/***/ },

/***/ "../bpl-tools/Admin/Activation/style.scss"
/*!************************************************!*\
  !*** ../bpl-tools/Admin/Activation/style.scss ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Demos/style.scss"
/*!*******************************************!*\
  !*** ../bpl-tools/Admin/Demos/style.scss ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/FeatureCompare/style.scss"
/*!****************************************************!*\
  !*** ../bpl-tools/Admin/FeatureCompare/style.scss ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Header/style.scss"
/*!********************************************!*\
  !*** ../bpl-tools/Admin/Header/style.scss ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/OurPlugins/style.scss"
/*!************************************************!*\
  !*** ../bpl-tools/Admin/OurPlugins/style.scss ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Pricing/style.scss"
/*!*********************************************!*\
  !*** ../bpl-tools/Admin/Pricing/style.scss ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Welcome/Changelog/style.scss"
/*!*******************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/Changelog/style.scss ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Welcome/GettingStarted/style.scss"
/*!************************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/GettingStarted/style.scss ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Welcome/Info/style.scss"
/*!**************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/Info/style.scss ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Welcome/Overview/style.scss"
/*!******************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/Overview/style.scss ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Welcome/ProAds/style.scss"
/*!****************************************************!*\
  !*** ../bpl-tools/Admin/Welcome/ProAds/style.scss ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Admin/Welcome/style.scss"
/*!*********************************************!*\
  !*** ../bpl-tools/Admin/Welcome/style.scss ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "../bpl-tools/Components/Button/style.scss"
/*!*************************************************!*\
  !*** ../bpl-tools/Components/Button/style.scss ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/dashboard/admin.scss"
/*!**********************************!*\
  !*** ./src/dashboard/admin.scss ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/dashboard/components/Analytics/style.scss"
/*!*******************************************************!*\
  !*** ./src/dashboard/components/Analytics/style.scss ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ },

/***/ "@wordpress/api-fetch"
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["apiFetch"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./node_modules/react-router/dist/development/chunk-JMJ3UQ3L.mjs"
/*!***********************************************************************!*\
  !*** ./node_modules/react-router/dist/development/chunk-JMJ3UQ3L.mjs ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Action: () => (/* binding */ Action),
/* harmony export */   Await: () => (/* binding */ Await),
/* harmony export */   AwaitContextProvider: () => (/* binding */ AwaitContextProvider),
/* harmony export */   BrowserRouter: () => (/* binding */ BrowserRouter),
/* harmony export */   CRITICAL_CSS_DATA_ATTRIBUTE: () => (/* binding */ CRITICAL_CSS_DATA_ATTRIBUTE),
/* harmony export */   DataRouterContext: () => (/* binding */ DataRouterContext),
/* harmony export */   DataRouterStateContext: () => (/* binding */ DataRouterStateContext),
/* harmony export */   ENABLE_DEV_WARNINGS: () => (/* binding */ ENABLE_DEV_WARNINGS),
/* harmony export */   ErrorResponseImpl: () => (/* binding */ ErrorResponseImpl),
/* harmony export */   FetchersContext: () => (/* binding */ FetchersContext),
/* harmony export */   Form: () => (/* binding */ Form),
/* harmony export */   FrameworkContext: () => (/* binding */ FrameworkContext),
/* harmony export */   HashRouter: () => (/* binding */ HashRouter),
/* harmony export */   HistoryRouter: () => (/* binding */ HistoryRouter),
/* harmony export */   IDLE_BLOCKER: () => (/* binding */ IDLE_BLOCKER),
/* harmony export */   IDLE_FETCHER: () => (/* binding */ IDLE_FETCHER),
/* harmony export */   IDLE_NAVIGATION: () => (/* binding */ IDLE_NAVIGATION),
/* harmony export */   Link: () => (/* binding */ Link),
/* harmony export */   Links: () => (/* binding */ Links),
/* harmony export */   LocationContext: () => (/* binding */ LocationContext),
/* harmony export */   MemoryRouter: () => (/* binding */ MemoryRouter),
/* harmony export */   Meta: () => (/* binding */ Meta),
/* harmony export */   NO_BODY_STATUS_CODES: () => (/* binding */ NO_BODY_STATUS_CODES),
/* harmony export */   NavLink: () => (/* binding */ NavLink),
/* harmony export */   Navigate: () => (/* binding */ Navigate),
/* harmony export */   NavigationContext: () => (/* binding */ NavigationContext),
/* harmony export */   Outlet: () => (/* binding */ Outlet),
/* harmony export */   PrefetchPageLinks: () => (/* binding */ PrefetchPageLinks),
/* harmony export */   RSCRouterContext: () => (/* binding */ RSCRouterContext),
/* harmony export */   RemixErrorBoundary: () => (/* binding */ RemixErrorBoundary),
/* harmony export */   Route: () => (/* binding */ Route),
/* harmony export */   RouteContext: () => (/* binding */ RouteContext),
/* harmony export */   Router: () => (/* binding */ Router),
/* harmony export */   RouterContextProvider: () => (/* binding */ RouterContextProvider),
/* harmony export */   RouterProvider: () => (/* binding */ RouterProvider),
/* harmony export */   Routes: () => (/* binding */ Routes),
/* harmony export */   SINGLE_FETCH_REDIRECT_STATUS: () => (/* binding */ SINGLE_FETCH_REDIRECT_STATUS),
/* harmony export */   Scripts: () => (/* binding */ Scripts),
/* harmony export */   ScrollRestoration: () => (/* binding */ ScrollRestoration),
/* harmony export */   SingleFetchRedirectSymbol: () => (/* binding */ SingleFetchRedirectSymbol),
/* harmony export */   StaticRouter: () => (/* binding */ StaticRouter),
/* harmony export */   StaticRouterProvider: () => (/* binding */ StaticRouterProvider),
/* harmony export */   StreamTransfer: () => (/* binding */ StreamTransfer),
/* harmony export */   ViewTransitionContext: () => (/* binding */ ViewTransitionContext),
/* harmony export */   WithComponentProps: () => (/* binding */ WithComponentProps),
/* harmony export */   WithErrorBoundaryProps: () => (/* binding */ WithErrorBoundaryProps),
/* harmony export */   WithHydrateFallbackProps: () => (/* binding */ WithHydrateFallbackProps),
/* harmony export */   convertRoutesToDataRoutes: () => (/* binding */ convertRoutesToDataRoutes),
/* harmony export */   createBrowserHistory: () => (/* binding */ createBrowserHistory),
/* harmony export */   createBrowserRouter: () => (/* binding */ createBrowserRouter),
/* harmony export */   createClientRoutes: () => (/* binding */ createClientRoutes),
/* harmony export */   createClientRoutesWithHMRRevalidationOptOut: () => (/* binding */ createClientRoutesWithHMRRevalidationOptOut),
/* harmony export */   createContext: () => (/* binding */ createContext),
/* harmony export */   createHashRouter: () => (/* binding */ createHashRouter),
/* harmony export */   createMemoryRouter: () => (/* binding */ createMemoryRouter),
/* harmony export */   createPath: () => (/* binding */ createPath),
/* harmony export */   createRequestInit: () => (/* binding */ createRequestInit),
/* harmony export */   createRouter: () => (/* binding */ createRouter),
/* harmony export */   createRoutesFromChildren: () => (/* binding */ createRoutesFromChildren),
/* harmony export */   createRoutesFromElements: () => (/* binding */ createRoutesFromElements),
/* harmony export */   createSearchParams: () => (/* binding */ createSearchParams),
/* harmony export */   createServerRoutes: () => (/* binding */ createServerRoutes),
/* harmony export */   createStaticHandler: () => (/* binding */ createStaticHandler),
/* harmony export */   createStaticHandler2: () => (/* binding */ createStaticHandler2),
/* harmony export */   createStaticRouter: () => (/* binding */ createStaticRouter),
/* harmony export */   data: () => (/* binding */ data),
/* harmony export */   decodeRedirectErrorDigest: () => (/* binding */ decodeRedirectErrorDigest),
/* harmony export */   decodeRouteErrorResponseDigest: () => (/* binding */ decodeRouteErrorResponseDigest),
/* harmony export */   decodeViaTurboStream: () => (/* binding */ decodeViaTurboStream),
/* harmony export */   encode: () => (/* binding */ encode),
/* harmony export */   escapeHtml: () => (/* binding */ escapeHtml),
/* harmony export */   generatePath: () => (/* binding */ generatePath),
/* harmony export */   getManifestPath: () => (/* binding */ getManifestPath),
/* harmony export */   getPatchRoutesOnNavigationFunction: () => (/* binding */ getPatchRoutesOnNavigationFunction),
/* harmony export */   getSingleFetchDataStrategyImpl: () => (/* binding */ getSingleFetchDataStrategyImpl),
/* harmony export */   getStaticContextFromError: () => (/* binding */ getStaticContextFromError),
/* harmony export */   getTurboStreamSingleFetchDataStrategy: () => (/* binding */ getTurboStreamSingleFetchDataStrategy),
/* harmony export */   hydrationRouteProperties: () => (/* binding */ hydrationRouteProperties),
/* harmony export */   instrumentHandler: () => (/* binding */ instrumentHandler),
/* harmony export */   invariant: () => (/* binding */ invariant),
/* harmony export */   isDataWithResponseInit: () => (/* binding */ isDataWithResponseInit),
/* harmony export */   isMutationMethod: () => (/* binding */ isMutationMethod),
/* harmony export */   isRedirectResponse: () => (/* binding */ isRedirectResponse),
/* harmony export */   isRedirectStatusCode: () => (/* binding */ isRedirectStatusCode),
/* harmony export */   isResponse: () => (/* binding */ isResponse),
/* harmony export */   isRouteErrorResponse: () => (/* binding */ isRouteErrorResponse),
/* harmony export */   mapRouteProperties: () => (/* binding */ mapRouteProperties),
/* harmony export */   matchPath: () => (/* binding */ matchPath),
/* harmony export */   matchRoutes: () => (/* binding */ matchRoutes),
/* harmony export */   noActionDefinedError: () => (/* binding */ noActionDefinedError),
/* harmony export */   parsePath: () => (/* binding */ parsePath),
/* harmony export */   redirect: () => (/* binding */ redirect),
/* harmony export */   redirectDocument: () => (/* binding */ redirectDocument),
/* harmony export */   renderMatches: () => (/* binding */ renderMatches),
/* harmony export */   replace: () => (/* binding */ replace),
/* harmony export */   resolvePath: () => (/* binding */ resolvePath),
/* harmony export */   setIsHydrated: () => (/* binding */ setIsHydrated),
/* harmony export */   shouldHydrateRouteLoader: () => (/* binding */ shouldHydrateRouteLoader),
/* harmony export */   singleFetchUrl: () => (/* binding */ singleFetchUrl),
/* harmony export */   stripBasename: () => (/* binding */ stripBasename),
/* harmony export */   stripIndexParam: () => (/* binding */ stripIndexParam),
/* harmony export */   useActionData: () => (/* binding */ useActionData),
/* harmony export */   useAsyncError: () => (/* binding */ useAsyncError),
/* harmony export */   useAsyncValue: () => (/* binding */ useAsyncValue),
/* harmony export */   useBeforeUnload: () => (/* binding */ useBeforeUnload),
/* harmony export */   useBlocker: () => (/* binding */ useBlocker),
/* harmony export */   useFetcher: () => (/* binding */ useFetcher),
/* harmony export */   useFetchers: () => (/* binding */ useFetchers),
/* harmony export */   useFogOFWarDiscovery: () => (/* binding */ useFogOFWarDiscovery),
/* harmony export */   useFormAction: () => (/* binding */ useFormAction),
/* harmony export */   useHref: () => (/* binding */ useHref),
/* harmony export */   useInRouterContext: () => (/* binding */ useInRouterContext),
/* harmony export */   useLinkClickHandler: () => (/* binding */ useLinkClickHandler),
/* harmony export */   useLoaderData: () => (/* binding */ useLoaderData),
/* harmony export */   useLocation: () => (/* binding */ useLocation),
/* harmony export */   useMatch: () => (/* binding */ useMatch),
/* harmony export */   useMatches: () => (/* binding */ useMatches),
/* harmony export */   useNavigate: () => (/* binding */ useNavigate),
/* harmony export */   useNavigation: () => (/* binding */ useNavigation),
/* harmony export */   useNavigationType: () => (/* binding */ useNavigationType),
/* harmony export */   useOutlet: () => (/* binding */ useOutlet),
/* harmony export */   useOutletContext: () => (/* binding */ useOutletContext),
/* harmony export */   useParams: () => (/* binding */ useParams),
/* harmony export */   usePrompt: () => (/* binding */ usePrompt),
/* harmony export */   useResolvedPath: () => (/* binding */ useResolvedPath),
/* harmony export */   useRevalidator: () => (/* binding */ useRevalidator),
/* harmony export */   useRoute: () => (/* binding */ useRoute),
/* harmony export */   useRouteError: () => (/* binding */ useRouteError),
/* harmony export */   useRouteLoaderData: () => (/* binding */ useRouteLoaderData),
/* harmony export */   useRoutes: () => (/* binding */ useRoutes),
/* harmony export */   useScrollRestoration: () => (/* binding */ useScrollRestoration),
/* harmony export */   useSearchParams: () => (/* binding */ useSearchParams),
/* harmony export */   useSubmit: () => (/* binding */ useSubmit),
/* harmony export */   useViewTransitionState: () => (/* binding */ useViewTransitionState),
/* harmony export */   warnOnce: () => (/* binding */ warnOnce),
/* harmony export */   withComponentProps: () => (/* binding */ withComponentProps),
/* harmony export */   withErrorBoundaryProps: () => (/* binding */ withErrorBoundaryProps),
/* harmony export */   withHydrateFallbackProps: () => (/* binding */ withHydrateFallbackProps)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/**
 * react-router v7.11.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);

// lib/router/history.ts
var Action = /* @__PURE__ */ ((Action2) => {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
  return Action2;
})(Action || {});
var PopStateEventType = "popstate";
function createMemoryHistory(options = {}) {
  let { initialEntries = ["/"], initialIndex, v5Compat = false } = options;
  let entries;
  entries = initialEntries.map(
    (entry, index2) => createMemoryLocation(
      entry,
      typeof entry === "string" ? null : entry.state,
      index2 === 0 ? "default" : void 0
    )
  );
  let index = clampIndex(
    initialIndex == null ? entries.length - 1 : initialIndex
  );
  let action = "POP" /* Pop */;
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state = null, key) {
    let location = createLocation(
      entries ? getCurrentLocation().pathname : "/",
      to,
      state,
      key
    );
    warning(
      location.pathname.charAt(0) === "/",
      `relative pathnames are not supported in memory history: ${JSON.stringify(
        to
      )}`
    );
    return location;
  }
  function createHref2(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref: createHref2,
    createURL(to) {
      return new URL(createHref2(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = "PUSH" /* Push */;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({ action, location: nextLocation, delta: 1 });
      }
    },
    replace(to, state) {
      action = "REPLACE" /* Replace */;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({ action, location: nextLocation, delta: 0 });
      }
    },
    go(delta) {
      action = "POP" /* Pop */;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({ action, location: nextLocation, delta });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
function createBrowserHistory(options = {}) {
  function createBrowserLocation(window2, globalHistory) {
    let { pathname, search, hash } = window2.location;
    return createLocation(
      "",
      { pathname, search, hash },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(
    createBrowserLocation,
    createBrowserHref,
    null,
    options
  );
}
function createHashHistory(options = {}) {
  function createHashLocation(window2, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window2.location.hash.substring(1));
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation(
      "",
      { pathname, search, hash },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createHashHref(window2, to) {
    let base = window2.document.querySelector("base");
    let href = "";
    if (base && base.getAttribute("href")) {
      let url = window2.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location, to) {
    warning(
      location.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        to
      )})`
    );
  }
  return getUrlBasedHistory(
    createHashLocation,
    createHashHref,
    validateHashLocation,
    options
  );
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substring(2, 10);
}
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
function createLocation(current, to, state = null, key) {
  let location = {
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: "",
    ...typeof to === "string" ? parsePath(to) : to,
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  };
  return location;
}
function createPath({
  pathname = "/",
  search = "",
  hash = ""
}) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref2, validateLocation, options = {}) {
  let { window: window2 = document.defaultView, v5Compat = false } = options;
  let globalHistory = window2.history;
  let action = "POP" /* Pop */;
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }
  function getIndex() {
    let state = globalHistory.state || { idx: null };
    return state.idx;
  }
  function handlePop() {
    action = "POP" /* Pop */;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({ action, location: history.location, delta });
    }
  }
  function push(to, state) {
    action = "PUSH" /* Push */;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 1 });
    }
  }
  function replace2(to, state) {
    action = "REPLACE" /* Replace */;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 0 });
    }
  }
  function createURL(to) {
    return createBrowserURLImpl(to);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref2(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace: replace2,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
function createBrowserURLImpl(to, isAbsolute = false) {
  let base = "http://localhost";
  if (typeof window !== "undefined") {
    base = window.location.origin !== "null" ? window.location.origin : window.location.href;
  }
  invariant(base, "No window.location.(origin|href) available to create URL");
  let href = typeof to === "string" ? to : createPath(to);
  href = href.replace(/ $/, "%20");
  if (!isAbsolute && href.startsWith("//")) {
    href = base + href;
  }
  return new URL(href, base);
}

// lib/router/utils.ts
function createContext(defaultValue) {
  return { defaultValue };
}
var _map;
var RouterContextProvider = class {
  /**
   * Create a new `RouterContextProvider` instance
   * @param init An optional initial context map to populate the provider with
   */
  constructor(init) {
    __privateAdd(this, _map, /* @__PURE__ */ new Map());
    if (init) {
      for (let [context, value] of init) {
        this.set(context, value);
      }
    }
  }
  /**
   * Access a value from the context. If no value has been set for the context,
   * it will return the context's `defaultValue` if provided, or throw an error
   * if no `defaultValue` was set.
   * @param context The context to get the value for
   * @returns The value for the context, or the context's `defaultValue` if no
   * value was set
   */
  get(context) {
    if (__privateGet(this, _map).has(context)) {
      return __privateGet(this, _map).get(context);
    }
    if (context.defaultValue !== void 0) {
      return context.defaultValue;
    }
    throw new Error("No value found for context");
  }
  /**
   * Set a value for the context. If the context already has a value set, this
   * will overwrite it.
   *
   * @param context The context to set the value for
   * @param value The value to set for the context
   * @returns {void}
   */
  set(context, value) {
    __privateGet(this, _map).set(context, value);
  }
};
_map = new WeakMap();
var unsupportedLazyRouteObjectKeys = /* @__PURE__ */ new Set([
  "lazy",
  "caseSensitive",
  "path",
  "id",
  "index",
  "children"
]);
function isUnsupportedLazyRouteObjectKey(key) {
  return unsupportedLazyRouteObjectKeys.has(
    key
  );
}
var unsupportedLazyRouteFunctionKeys = /* @__PURE__ */ new Set([
  "lazy",
  "caseSensitive",
  "path",
  "id",
  "index",
  "middleware",
  "children"
]);
function isUnsupportedLazyRouteFunctionKey(key) {
  return unsupportedLazyRouteFunctionKeys.has(
    key
  );
}
function isIndexRoute(route) {
  return route.index === true;
}
function convertRoutesToDataRoutes(routes, mapRouteProperties2, parentPath = [], manifest = {}, allowInPlaceMutations = false) {
  return routes.map((route, index) => {
    let treePath = [...parentPath, String(index)];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(
      route.index !== true || !route.children,
      `Cannot specify children on an index route`
    );
    invariant(
      allowInPlaceMutations || !manifest[id],
      `Found a route id collision on id "${id}".  Route id's must be globally unique within Data Router usages`
    );
    if (isIndexRoute(route)) {
      let indexRoute = {
        ...route,
        id
      };
      manifest[id] = mergeRouteUpdates(
        indexRoute,
        mapRouteProperties2(indexRoute)
      );
      return indexRoute;
    } else {
      let pathOrLayoutRoute = {
        ...route,
        id,
        children: void 0
      };
      manifest[id] = mergeRouteUpdates(
        pathOrLayoutRoute,
        mapRouteProperties2(pathOrLayoutRoute)
      );
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(
          route.children,
          mapRouteProperties2,
          treePath,
          manifest,
          allowInPlaceMutations
        );
      }
      return pathOrLayoutRoute;
    }
  });
}
function mergeRouteUpdates(route, updates) {
  return Object.assign(route, {
    ...updates,
    ...typeof updates.lazy === "object" && updates.lazy != null ? {
      lazy: {
        ...route.lazy,
        ...updates.lazy
      }
    } : {}
  });
}
function matchRoutes(routes, locationArg, basename = "/") {
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(
      branches[i],
      decoded,
      allowPartial
    );
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let { route, pathname, params } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    loaderData: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "", _hasParentOptionalSegments = false) {
  let flattenRoute = (route, index, hasParentOptionalSegments = _hasParentOptionalSegments, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      if (!meta.relativePath.startsWith(parentPath) && hasParentOptionalSegments) {
        return;
      }
      invariant(
        meta.relativePath.startsWith(parentPath),
        `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        `Index routes must not have child routes. Please remove all child routes from route path "${path}".`
      );
      flattenRoutes(
        route.children,
        branches,
        routesMeta,
        path,
        hasParentOptionalSegments
      );
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    if (route.path === "" || !route.path?.includes("?")) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, true, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(
    ...restExploded.map(
      (subpath) => subpath === "" ? required : [required, subpath].join("/")
    )
  );
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map(
    (exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded
  );
}
function rankRouteBranches(branches) {
  branches.sort(
    (a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(
      a.routesMeta.map((meta) => meta.childrenIndex),
      b.routesMeta.map((meta) => meta.childrenIndex)
    )
  );
}
var paramRe = /^:[\w-]+$/;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce(
    (score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
    initialScore
  );
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath(
        {
          path: meta.relativePath,
          caseSensitive: meta.caseSensitive,
          end: false
        },
        remainingPathname
      );
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function generatePath(originalPath, params = {}) {
  let path = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    warning(
      false,
      `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
    );
    path = path.replace(/\*$/, "/*");
  }
  const prefix = path.startsWith("/") ? "/" : "";
  const stringify2 = (p) => p == null ? "" : typeof p === "string" ? p : String(p);
  const segments = path.split(/\/+/).map((segment, index, array) => {
    const isLastSegment = index === array.length - 1;
    if (isLastSegment && segment === "*") {
      const star = "*";
      return stringify2(params[star]);
    }
    const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
    if (keyMatch) {
      const [, key, optional] = keyMatch;
      let param = params[key];
      invariant(optional === "?" || param != null, `Missing ":${key}" param`);
      return encodeURIComponent(stringify2(param));
    }
    return segment.replace(/\?$/g, "");
  }).filter((segment) => !!segment);
  return prefix + segments.join("/");
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  let [matcher, compiledParams] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce(
    (memo2, { paramName, isOptional }, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo2[paramName] = void 0;
      } else {
        memo2[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo2;
    },
    {}
  );
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive = false, end = true) {
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
  );
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (_, paramName, isOptional) => {
      params.push({ paramName, isOptional: isOptional != null });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  if (path.endsWith("*")) {
    params.push({ paramName: "*" });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else {
  }
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(
      false,
      `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`
    );
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function prependBasename({
  basename,
  pathname
}) {
  return pathname === "/" ? basename : joinPaths([basename, pathname]);
}
var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX.test(url);
function resolvePath(to, fromPathname = "/") {
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    if (isAbsoluteUrl(toPathname)) {
      pathname = toPathname;
    } else {
      if (toPathname.includes("//")) {
        let oldPathname = toPathname;
        toPathname = toPathname.replace(/\/\/+/g, "/");
        warning(
          false,
          `Pathnames cannot have embedded double slashes - normalizing ${oldPathname} -> ${toPathname}`
        );
      }
      if (toPathname.startsWith("/")) {
        pathname = resolvePathname(toPathname.substring(1), "/");
      } else {
        pathname = resolvePathname(toPathname, fromPathname);
      }
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(
    path
  )}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
  return matches.filter(
    (match, index) => index === 0 || match.route.path && match.route.path.length > 0
  );
}
function getResolveToMatches(matches) {
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches.map(
    (match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase
  );
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = { ...toArg };
    invariant(
      !to.pathname || !to.pathname.includes("?"),
      getInvalidPathError("?", "pathname", "search", to)
    );
    invariant(
      !to.pathname || !to.pathname.includes("#"),
      getInvalidPathError("#", "pathname", "hash", to)
    );
    invariant(
      !to.search || !to.search.includes("#"),
      getInvalidPathError("#", "search", "hash", to)
    );
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
var joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
var DataWithResponseInit = class {
  constructor(data2, init) {
    this.type = "DataWithResponseInit";
    this.data = data2;
    this.init = init || null;
  }
};
function data(data2, init) {
  return new DataWithResponseInit(
    data2,
    typeof init === "number" ? { status: init } : init
  );
}
var redirect = (url, init = 302) => {
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  let headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, { ...responseInit, headers });
};
var redirectDocument = (url, init) => {
  let response = redirect(url, init);
  response.headers.set("X-Remix-Reload-Document", "true");
  return response;
};
var replace = (url, init) => {
  let response = redirect(url, init);
  response.headers.set("X-Remix-Replace", "true");
  return response;
};
var ErrorResponseImpl = class {
  constructor(status, statusText, data2, internal = false) {
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data2 instanceof Error) {
      this.data = data2.toString();
      this.error = data2;
    } else {
      this.data = data2;
    }
  }
};
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function getRoutePattern(matches) {
  return matches.map((m) => m.route.path).filter(Boolean).join("/").replace(/\/\/*/g, "/") || "/";
}
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
function parseToInfo(_to, basename) {
  let to = _to;
  if (typeof to !== "string" || !ABSOLUTE_URL_REGEX.test(to)) {
    return {
      absoluteURL: void 0,
      isExternal: false,
      to
    };
  }
  let absoluteURL = to;
  let isExternal = false;
  if (isBrowser) {
    try {
      let currentUrl = new URL(window.location.href);
      let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
      let path = stripBasename(targetUrl.pathname, basename);
      if (targetUrl.origin === currentUrl.origin && path != null) {
        to = path + targetUrl.search + targetUrl.hash;
      } else {
        isExternal = true;
      }
    } catch (e) {
      warning(
        false,
        `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  }
  return {
    absoluteURL,
    isExternal,
    to
  };
}

// lib/router/instrumentation.ts
var UninstrumentedSymbol = Symbol("Uninstrumented");
function getRouteInstrumentationUpdates(fns, route) {
  let aggregated = {
    lazy: [],
    "lazy.loader": [],
    "lazy.action": [],
    "lazy.middleware": [],
    middleware: [],
    loader: [],
    action: []
  };
  fns.forEach(
    (fn) => fn({
      id: route.id,
      index: route.index,
      path: route.path,
      instrument(i) {
        let keys = Object.keys(aggregated);
        for (let key of keys) {
          if (i[key]) {
            aggregated[key].push(i[key]);
          }
        }
      }
    })
  );
  let updates = {};
  if (typeof route.lazy === "function" && aggregated.lazy.length > 0) {
    let instrumented = wrapImpl(aggregated.lazy, route.lazy, () => void 0);
    if (instrumented) {
      updates.lazy = instrumented;
    }
  }
  if (typeof route.lazy === "object") {
    let lazyObject = route.lazy;
    ["middleware", "loader", "action"].forEach((key) => {
      let lazyFn = lazyObject[key];
      let instrumentations = aggregated[`lazy.${key}`];
      if (typeof lazyFn === "function" && instrumentations.length > 0) {
        let instrumented = wrapImpl(instrumentations, lazyFn, () => void 0);
        if (instrumented) {
          updates.lazy = Object.assign(updates.lazy || {}, {
            [key]: instrumented
          });
        }
      }
    });
  }
  ["loader", "action"].forEach((key) => {
    let handler = route[key];
    if (typeof handler === "function" && aggregated[key].length > 0) {
      let original = handler[UninstrumentedSymbol] ?? handler;
      let instrumented = wrapImpl(
        aggregated[key],
        original,
        (...args) => getHandlerInfo(args[0])
      );
      if (instrumented) {
        instrumented[UninstrumentedSymbol] = original;
        updates[key] = instrumented;
      }
    }
  });
  if (route.middleware && route.middleware.length > 0 && aggregated.middleware.length > 0) {
    updates.middleware = route.middleware.map((middleware) => {
      let original = middleware[UninstrumentedSymbol] ?? middleware;
      let instrumented = wrapImpl(
        aggregated.middleware,
        original,
        (...args) => getHandlerInfo(args[0])
      );
      if (instrumented) {
        instrumented[UninstrumentedSymbol] = original;
        return instrumented;
      }
      return middleware;
    });
  }
  return updates;
}
function instrumentClientSideRouter(router, fns) {
  let aggregated = {
    navigate: [],
    fetch: []
  };
  fns.forEach(
    (fn) => fn({
      instrument(i) {
        let keys = Object.keys(i);
        for (let key of keys) {
          if (i[key]) {
            aggregated[key].push(i[key]);
          }
        }
      }
    })
  );
  if (aggregated.navigate.length > 0) {
    let navigate = router.navigate[UninstrumentedSymbol] ?? router.navigate;
    let instrumentedNavigate = wrapImpl(
      aggregated.navigate,
      navigate,
      (...args) => {
        let [to, opts] = args;
        return {
          to: typeof to === "number" || typeof to === "string" ? to : to ? createPath(to) : ".",
          ...getRouterInfo(router, opts ?? {})
        };
      }
    );
    if (instrumentedNavigate) {
      instrumentedNavigate[UninstrumentedSymbol] = navigate;
      router.navigate = instrumentedNavigate;
    }
  }
  if (aggregated.fetch.length > 0) {
    let fetch2 = router.fetch[UninstrumentedSymbol] ?? router.fetch;
    let instrumentedFetch = wrapImpl(aggregated.fetch, fetch2, (...args) => {
      let [key, , href, opts] = args;
      return {
        href: href ?? ".",
        fetcherKey: key,
        ...getRouterInfo(router, opts ?? {})
      };
    });
    if (instrumentedFetch) {
      instrumentedFetch[UninstrumentedSymbol] = fetch2;
      router.fetch = instrumentedFetch;
    }
  }
  return router;
}
function instrumentHandler(handler, fns) {
  let aggregated = {
    request: []
  };
  fns.forEach(
    (fn) => fn({
      instrument(i) {
        let keys = Object.keys(i);
        for (let key of keys) {
          if (i[key]) {
            aggregated[key].push(i[key]);
          }
        }
      }
    })
  );
  let instrumentedHandler = handler;
  if (aggregated.request.length > 0) {
    instrumentedHandler = wrapImpl(aggregated.request, handler, (...args) => {
      let [request, context] = args;
      return {
        request: getReadonlyRequest(request),
        context: context != null ? getReadonlyContext(context) : context
      };
    });
  }
  return instrumentedHandler;
}
function wrapImpl(impls, handler, getInfo) {
  if (impls.length === 0) {
    return null;
  }
  return async (...args) => {
    let result = await recurseRight(
      impls,
      getInfo(...args),
      () => handler(...args),
      impls.length - 1
    );
    if (result.type === "error") {
      throw result.value;
    }
    return result.value;
  };
}
async function recurseRight(impls, info, handler, index) {
  let impl = impls[index];
  let result;
  if (!impl) {
    try {
      let value = await handler();
      result = { type: "success", value };
    } catch (e) {
      result = { type: "error", value: e };
    }
  } else {
    let handlerPromise = void 0;
    let callHandler = async () => {
      if (handlerPromise) {
        console.error("You cannot call instrumented handlers more than once");
      } else {
        handlerPromise = recurseRight(impls, info, handler, index - 1);
      }
      result = await handlerPromise;
      invariant(result, "Expected a result");
      if (result.type === "error" && result.value instanceof Error) {
        return { status: "error", error: result.value };
      }
      return { status: "success", error: void 0 };
    };
    try {
      await impl(callHandler, info);
    } catch (e) {
      console.error("An instrumentation function threw an error:", e);
    }
    if (!handlerPromise) {
      await callHandler();
    }
    await handlerPromise;
  }
  if (result) {
    return result;
  }
  return {
    type: "error",
    value: new Error("No result assigned in instrumentation chain.")
  };
}
function getHandlerInfo(args) {
  let { request, context, params, unstable_pattern } = args;
  return {
    request: getReadonlyRequest(request),
    params: { ...params },
    unstable_pattern,
    context: getReadonlyContext(context)
  };
}
function getRouterInfo(router, opts) {
  return {
    currentUrl: createPath(router.state.location),
    ..."formMethod" in opts ? { formMethod: opts.formMethod } : {},
    ..."formEncType" in opts ? { formEncType: opts.formEncType } : {},
    ..."formData" in opts ? { formData: opts.formData } : {},
    ..."body" in opts ? { body: opts.body } : {}
  };
}
function getReadonlyRequest(request) {
  return {
    method: request.method,
    url: request.url,
    headers: {
      get: (...args) => request.headers.get(...args)
    }
  };
}
function getReadonlyContext(context) {
  if (isPlainObject(context)) {
    let frozen = { ...context };
    Object.freeze(frozen);
    return frozen;
  } else {
    return {
      get: (ctx) => context.get(ctx)
    };
  }
}
var objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function isPlainObject(thing) {
  if (thing === null || typeof thing !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames;
}

// lib/router/router.ts
var validMutationMethodsArr = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
var validMutationMethods = new Set(
  validMutationMethodsArr
);
var validRequestMethodsArr = [
  "GET",
  ...validMutationMethodsArr
];
var validRequestMethods = new Set(validRequestMethodsArr);
var redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var redirectPreserveMethodStatusCodes = /* @__PURE__ */ new Set([307, 308]);
var IDLE_NAVIGATION = {
  state: "idle",
  location: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
};
var IDLE_FETCHER = {
  state: "idle",
  data: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
};
var IDLE_BLOCKER = {
  state: "unblocked",
  proceed: void 0,
  reset: void 0,
  location: void 0
};
var defaultMapRouteProperties = (route) => ({
  hasErrorBoundary: Boolean(route.hasErrorBoundary)
});
var TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
var ResetLoaderDataSymbol = Symbol("ResetLoaderData");
function createRouter(init) {
  const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : void 0;
  const isBrowser3 = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
  invariant(
    init.routes.length > 0,
    "You must provide a non-empty routes array to createRouter"
  );
  let hydrationRouteProperties2 = init.hydrationRouteProperties || [];
  let _mapRouteProperties = init.mapRouteProperties || defaultMapRouteProperties;
  let mapRouteProperties2 = _mapRouteProperties;
  if (init.unstable_instrumentations) {
    let instrumentations = init.unstable_instrumentations;
    mapRouteProperties2 = (route) => {
      return {
        ..._mapRouteProperties(route),
        ...getRouteInstrumentationUpdates(
          instrumentations.map((i) => i.route).filter(Boolean),
          route
        )
      };
    };
  }
  let manifest = {};
  let dataRoutes = convertRoutesToDataRoutes(
    init.routes,
    mapRouteProperties2,
    void 0,
    manifest
  );
  let inFlightDataRoutes;
  let basename = init.basename || "/";
  if (!basename.startsWith("/")) {
    basename = `/${basename}`;
  }
  let dataStrategyImpl = init.dataStrategy || defaultDataStrategyWithMiddleware;
  let future = {
    ...init.future
  };
  let unlistenHistory = null;
  let subscribers = /* @__PURE__ */ new Set();
  let savedScrollPositions2 = null;
  let getScrollRestorationKey2 = null;
  let getScrollPosition = null;
  let initialScrollRestored = init.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init.history.location, basename);
  let initialMatchesIsFOW = false;
  let initialErrors = null;
  let initialized;
  if (initialMatches == null && !init.patchRoutesOnNavigation) {
    let error = getInternalRouterError(404, {
      pathname: init.history.location.pathname
    });
    let { matches, route } = getShortCircuitMatches(dataRoutes);
    initialized = true;
    initialMatches = matches;
    initialErrors = { [route.id]: error };
  } else {
    if (initialMatches && !init.hydrationData) {
      let fogOfWar = checkFogOfWar(
        initialMatches,
        dataRoutes,
        init.history.location.pathname
      );
      if (fogOfWar.active) {
        initialMatches = null;
      }
    }
    if (!initialMatches) {
      initialized = false;
      initialMatches = [];
      let fogOfWar = checkFogOfWar(
        null,
        dataRoutes,
        init.history.location.pathname
      );
      if (fogOfWar.active && fogOfWar.matches) {
        initialMatchesIsFOW = true;
        initialMatches = fogOfWar.matches;
      }
    } else if (initialMatches.some((m) => m.route.lazy)) {
      initialized = false;
    } else if (!initialMatches.some((m) => routeHasLoaderOrMiddleware(m.route))) {
      initialized = true;
    } else {
      let loaderData = init.hydrationData ? init.hydrationData.loaderData : null;
      let errors = init.hydrationData ? init.hydrationData.errors : null;
      if (errors) {
        let idx = initialMatches.findIndex(
          (m) => errors[m.route.id] !== void 0
        );
        initialized = initialMatches.slice(0, idx + 1).every(
          (m) => !shouldLoadRouteOnHydration(m.route, loaderData, errors)
        );
      } else {
        initialized = initialMatches.every(
          (m) => !shouldLoadRouteOnHydration(m.route, loaderData, errors)
        );
      }
    }
  }
  let router;
  let state = {
    historyAction: init.history.action,
    location: init.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init.hydrationData && init.hydrationData.loaderData || {},
    actionData: init.hydrationData && init.hydrationData.actionData || null,
    errors: init.hydrationData && init.hydrationData.errors || initialErrors,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  };
  let pendingAction = "POP" /* Pop */;
  let pendingPopstateNavigationDfd = null;
  let pendingPreventScrollReset = false;
  let pendingNavigationController;
  let pendingViewTransitionEnabled = false;
  let appliedViewTransitions = /* @__PURE__ */ new Map();
  let removePageHideEventListener = null;
  let isUninterruptedRevalidation = false;
  let isRevalidationRequired = false;
  let cancelledFetcherLoads = /* @__PURE__ */ new Set();
  let fetchControllers = /* @__PURE__ */ new Map();
  let incrementingLoadId = 0;
  let pendingNavigationLoadId = -1;
  let fetchReloadIds = /* @__PURE__ */ new Map();
  let fetchRedirectIds = /* @__PURE__ */ new Set();
  let fetchLoadMatches = /* @__PURE__ */ new Map();
  let activeFetchers = /* @__PURE__ */ new Map();
  let fetchersQueuedForDeletion = /* @__PURE__ */ new Set();
  let blockerFunctions = /* @__PURE__ */ new Map();
  let unblockBlockerHistoryUpdate = void 0;
  let pendingRevalidationDfd = null;
  function initialize() {
    unlistenHistory = init.history.listen(
      ({ action: historyAction, location, delta }) => {
        if (unblockBlockerHistoryUpdate) {
          unblockBlockerHistoryUpdate();
          unblockBlockerHistoryUpdate = void 0;
          return;
        }
        warning(
          blockerFunctions.size === 0 || delta != null,
          "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL."
        );
        let blockerKey = shouldBlockNavigation({
          currentLocation: state.location,
          nextLocation: location,
          historyAction
        });
        if (blockerKey && delta != null) {
          let nextHistoryUpdatePromise = new Promise((resolve) => {
            unblockBlockerHistoryUpdate = resolve;
          });
          init.history.go(delta * -1);
          updateBlocker(blockerKey, {
            state: "blocked",
            location,
            proceed() {
              updateBlocker(blockerKey, {
                state: "proceeding",
                proceed: void 0,
                reset: void 0,
                location
              });
              nextHistoryUpdatePromise.then(() => init.history.go(delta));
            },
            reset() {
              let blockers = new Map(state.blockers);
              blockers.set(blockerKey, IDLE_BLOCKER);
              updateState({ blockers });
            }
          });
          pendingPopstateNavigationDfd?.resolve();
          pendingPopstateNavigationDfd = null;
          return;
        }
        return startNavigation(historyAction, location);
      }
    );
    if (isBrowser3) {
      restoreAppliedTransitions(routerWindow, appliedViewTransitions);
      let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
      routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
      removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
    }
    if (!state.initialized) {
      startNavigation("POP" /* Pop */, state.location, {
        initialHydration: true
      });
    }
    return router;
  }
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    if (removePageHideEventListener) {
      removePageHideEventListener();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state.fetchers.forEach((_, key) => deleteFetcher(key));
    state.blockers.forEach((_, key) => deleteBlocker(key));
  }
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }
  function updateState(newState, opts = {}) {
    if (newState.matches) {
      newState.matches = newState.matches.map((m) => {
        let route = manifest[m.route.id];
        let matchRoute = m.route;
        if (matchRoute.element !== route.element || matchRoute.errorElement !== route.errorElement || matchRoute.hydrateFallbackElement !== route.hydrateFallbackElement) {
          return {
            ...m,
            route
          };
        }
        return m;
      });
    }
    state = {
      ...state,
      ...newState
    };
    let unmountedFetchers = [];
    let mountedFetchers = [];
    state.fetchers.forEach((fetcher, key) => {
      if (fetcher.state === "idle") {
        if (fetchersQueuedForDeletion.has(key)) {
          unmountedFetchers.push(key);
        } else {
          mountedFetchers.push(key);
        }
      }
    });
    fetchersQueuedForDeletion.forEach((key) => {
      if (!state.fetchers.has(key) && !fetchControllers.has(key)) {
        unmountedFetchers.push(key);
      }
    });
    [...subscribers].forEach(
      (subscriber) => subscriber(state, {
        deletedFetchers: unmountedFetchers,
        newErrors: newState.errors ?? null,
        viewTransitionOpts: opts.viewTransitionOpts,
        flushSync: opts.flushSync === true
      })
    );
    unmountedFetchers.forEach((key) => deleteFetcher(key));
    mountedFetchers.forEach((key) => state.fetchers.delete(key));
  }
  function completeNavigation(location, newState, { flushSync } = {}) {
    let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && location.state?._isRedirect !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        actionData = null;
      }
    } else if (isActionReload) {
      actionData = state.actionData;
    } else {
      actionData = null;
    }
    let loaderData = newState.loaderData ? mergeLoaderData(
      state.loaderData,
      newState.loaderData,
      newState.matches || [],
      newState.errors
    ) : state.loaderData;
    let blockers = state.blockers;
    if (blockers.size > 0) {
      blockers = new Map(blockers);
      blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
    }
    let restoreScrollPosition = isUninterruptedRevalidation ? false : getSavedScrollPosition(location, newState.matches || state.matches);
    let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && location.state?._isRedirect !== true;
    if (inFlightDataRoutes) {
      dataRoutes = inFlightDataRoutes;
      inFlightDataRoutes = void 0;
    }
    if (isUninterruptedRevalidation) {
    } else if (pendingAction === "POP" /* Pop */) {
    } else if (pendingAction === "PUSH" /* Push */) {
      init.history.push(location, location.state);
    } else if (pendingAction === "REPLACE" /* Replace */) {
      init.history.replace(location, location.state);
    }
    let viewTransitionOpts;
    if (pendingAction === "POP" /* Pop */) {
      let priorPaths = appliedViewTransitions.get(state.location.pathname);
      if (priorPaths && priorPaths.has(location.pathname)) {
        viewTransitionOpts = {
          currentLocation: state.location,
          nextLocation: location
        };
      } else if (appliedViewTransitions.has(location.pathname)) {
        viewTransitionOpts = {
          currentLocation: location,
          nextLocation: state.location
        };
      }
    } else if (pendingViewTransitionEnabled) {
      let toPaths = appliedViewTransitions.get(state.location.pathname);
      if (toPaths) {
        toPaths.add(location.pathname);
      } else {
        toPaths = /* @__PURE__ */ new Set([location.pathname]);
        appliedViewTransitions.set(state.location.pathname, toPaths);
      }
      viewTransitionOpts = {
        currentLocation: state.location,
        nextLocation: location
      };
    }
    updateState(
      {
        ...newState,
        // matches, errors, fetchers go through as-is
        actionData,
        loaderData,
        historyAction: pendingAction,
        location,
        initialized: true,
        navigation: IDLE_NAVIGATION,
        revalidation: "idle",
        restoreScrollPosition,
        preventScrollReset,
        blockers
      },
      {
        viewTransitionOpts,
        flushSync: flushSync === true
      }
    );
    pendingAction = "POP" /* Pop */;
    pendingPreventScrollReset = false;
    pendingViewTransitionEnabled = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    pendingPopstateNavigationDfd?.resolve();
    pendingPopstateNavigationDfd = null;
    pendingRevalidationDfd?.resolve();
    pendingRevalidationDfd = null;
  }
  async function navigate(to, opts) {
    pendingPopstateNavigationDfd?.resolve();
    pendingPopstateNavigationDfd = null;
    if (typeof to === "number") {
      if (!pendingPopstateNavigationDfd) {
        pendingPopstateNavigationDfd = createDeferred();
      }
      let promise = pendingPopstateNavigationDfd.promise;
      init.history.go(to);
      return promise;
    }
    let normalizedPath = normalizeTo(
      state.location,
      state.matches,
      basename,
      to,
      opts?.fromRouteId,
      opts?.relative
    );
    let { path, submission, error } = normalizeNavigateOptions(
      false,
      normalizedPath,
      opts
    );
    let currentLocation = state.location;
    let nextLocation = createLocation(state.location, path, opts && opts.state);
    nextLocation = {
      ...nextLocation,
      ...init.history.encodeLocation(nextLocation)
    };
    let userReplace = opts && opts.replace != null ? opts.replace : void 0;
    let historyAction = "PUSH" /* Push */;
    if (userReplace === true) {
      historyAction = "REPLACE" /* Replace */;
    } else if (userReplace === false) {
    } else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
      historyAction = "REPLACE" /* Replace */;
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : void 0;
    let flushSync = (opts && opts.flushSync) === true;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: nextLocation
          });
          navigate(to, opts);
        },
        reset() {
          let blockers = new Map(state.blockers);
          blockers.set(blockerKey, IDLE_BLOCKER);
          updateState({ blockers });
        }
      });
      return;
    }
    await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace,
      enableViewTransition: opts && opts.viewTransition,
      flushSync,
      callSiteDefaultShouldRevalidate: opts && opts.unstable_defaultShouldRevalidate
    });
  }
  function revalidate() {
    if (!pendingRevalidationDfd) {
      pendingRevalidationDfd = createDeferred();
    }
    interruptActiveLoads();
    updateState({ revalidation: "loading" });
    let promise = pendingRevalidationDfd.promise;
    if (state.navigation.state === "submitting") {
      return promise;
    }
    if (state.navigation.state === "idle") {
      startNavigation(state.historyAction, state.location, {
        startUninterruptedRevalidation: true
      });
      return promise;
    }
    startNavigation(
      pendingAction || state.historyAction,
      state.navigation.location,
      {
        overrideNavigation: state.navigation,
        // Proxy through any rending view transition
        enableViewTransition: pendingViewTransitionEnabled === true
      }
    );
    return promise;
  }
  async function startNavigation(historyAction, location, opts) {
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    saveScrollPosition(state.location, state.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = opts?.initialHydration && state.matches && state.matches.length > 0 && !initialMatchesIsFOW ? (
      // `matchRoutes()` has already been called if we're in here via `router.initialize()`
      state.matches
    ) : matchRoutes(routesToUse, location, basename);
    let flushSync = (opts && opts.flushSync) === true;
    if (matches && state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location, { matches }, { flushSync });
      return;
    }
    let fogOfWar = checkFogOfWar(matches, routesToUse, location.pathname);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    if (!matches) {
      let { error, notFoundMatches, route } = handleNavigational404(
        location.pathname
      );
      completeNavigation(
        location,
        {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        },
        { flushSync }
      );
      return;
    }
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(
      init.history,
      location,
      pendingNavigationController.signal,
      opts && opts.submission
    );
    let scopedContext = init.getContext ? await init.getContext() : new RouterContextProvider();
    let pendingActionResult;
    if (opts && opts.pendingError) {
      pendingActionResult = [
        findNearestBoundary(matches).route.id,
        { type: "error" /* error */, error: opts.pendingError }
      ];
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      let actionResult = await handleAction(
        request,
        location,
        opts.submission,
        matches,
        scopedContext,
        fogOfWar.active,
        opts && opts.initialHydration === true,
        { replace: opts.replace, flushSync }
      );
      if (actionResult.shortCircuited) {
        return;
      }
      if (actionResult.pendingActionResult) {
        let [routeId, result] = actionResult.pendingActionResult;
        if (isErrorResult(result) && isRouteErrorResponse(result.error) && result.error.status === 404) {
          pendingNavigationController = null;
          completeNavigation(location, {
            matches: actionResult.matches,
            loaderData: {},
            errors: {
              [routeId]: result.error
            }
          });
          return;
        }
      }
      matches = actionResult.matches || matches;
      pendingActionResult = actionResult.pendingActionResult;
      loadingNavigation = getLoadingNavigation(location, opts.submission);
      flushSync = false;
      fogOfWar.active = false;
      request = createClientSideRequest(
        init.history,
        request.url,
        request.signal
      );
    }
    let {
      shortCircuited,
      matches: updatedMatches,
      loaderData,
      errors
    } = await handleLoaders(
      request,
      location,
      matches,
      scopedContext,
      fogOfWar.active,
      loadingNavigation,
      opts && opts.submission,
      opts && opts.fetcherSubmission,
      opts && opts.replace,
      opts && opts.initialHydration === true,
      flushSync,
      pendingActionResult,
      opts && opts.callSiteDefaultShouldRevalidate
    );
    if (shortCircuited) {
      return;
    }
    pendingNavigationController = null;
    completeNavigation(location, {
      matches: updatedMatches || matches,
      ...getActionDataForCommit(pendingActionResult),
      loaderData,
      errors
    });
  }
  async function handleAction(request, location, submission, matches, scopedContext, isFogOfWar, initialHydration, opts = {}) {
    interruptActiveLoads();
    let navigation = getSubmittingNavigation(location, submission);
    updateState({ navigation }, { flushSync: opts.flushSync === true });
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(
        matches,
        location.pathname,
        request.signal
      );
      if (discoverResult.type === "aborted") {
        return { shortCircuited: true };
      } else if (discoverResult.type === "error") {
        if (discoverResult.partialMatches.length === 0) {
          let { matches: matches2, route } = getShortCircuitMatches(dataRoutes);
          return {
            matches: matches2,
            pendingActionResult: [
              route.id,
              {
                type: "error" /* error */,
                error: discoverResult.error
              }
            ]
          };
        }
        let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
        return {
          matches: discoverResult.partialMatches,
          pendingActionResult: [
            boundaryId,
            {
              type: "error" /* error */,
              error: discoverResult.error
            }
          ]
        };
      } else if (!discoverResult.matches) {
        let { notFoundMatches, error, route } = handleNavigational404(
          location.pathname
        );
        return {
          matches: notFoundMatches,
          pendingActionResult: [
            route.id,
            {
              type: "error" /* error */,
              error
            }
          ]
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    let result;
    let actionMatch = getTargetMatch(matches, location);
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      result = {
        type: "error" /* error */,
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      let dsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties2,
        manifest,
        request,
        matches,
        actionMatch,
        initialHydration ? [] : hydrationRouteProperties2,
        scopedContext
      );
      let results = await callDataStrategy(
        request,
        dsMatches,
        scopedContext,
        null
      );
      result = results[actionMatch.route.id];
      if (!result) {
        for (let match of matches) {
          if (results[match.route.id]) {
            result = results[match.route.id];
            break;
          }
        }
      }
      if (request.signal.aborted) {
        return { shortCircuited: true };
      }
    }
    if (isRedirectResult(result)) {
      let replace2;
      if (opts && opts.replace != null) {
        replace2 = opts.replace;
      } else {
        let location2 = normalizeRedirectLocation(
          result.response.headers.get("Location"),
          new URL(request.url),
          basename
        );
        replace2 = location2 === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(request, result, true, {
        submission,
        replace: replace2
      });
      return { shortCircuited: true };
    }
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      if ((opts && opts.replace) !== true) {
        pendingAction = "PUSH" /* Push */;
      }
      return {
        matches,
        pendingActionResult: [
          boundaryMatch.route.id,
          result,
          actionMatch.route.id
        ]
      };
    }
    return {
      matches,
      pendingActionResult: [actionMatch.route.id, result]
    };
  }
  async function handleLoaders(request, location, matches, scopedContext, isFogOfWar, overrideNavigation, submission, fetcherSubmission, replace2, initialHydration, flushSync, pendingActionResult, callSiteDefaultShouldRevalidate) {
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location, submission);
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    let shouldUpdateNavigationState = !isUninterruptedRevalidation && !initialHydration;
    if (isFogOfWar) {
      if (shouldUpdateNavigationState) {
        let actionData = getUpdatedActionData(pendingActionResult);
        updateState(
          {
            navigation: loadingNavigation,
            ...actionData !== void 0 ? { actionData } : {}
          },
          {
            flushSync
          }
        );
      }
      let discoverResult = await discoverRoutes(
        matches,
        location.pathname,
        request.signal
      );
      if (discoverResult.type === "aborted") {
        return { shortCircuited: true };
      } else if (discoverResult.type === "error") {
        if (discoverResult.partialMatches.length === 0) {
          let { matches: matches2, route } = getShortCircuitMatches(dataRoutes);
          return {
            matches: matches2,
            loaderData: {},
            errors: {
              [route.id]: discoverResult.error
            }
          };
        }
        let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
        return {
          matches: discoverResult.partialMatches,
          loaderData: {},
          errors: {
            [boundaryId]: discoverResult.error
          }
        };
      } else if (!discoverResult.matches) {
        let { error, notFoundMatches, route } = handleNavigational404(
          location.pathname
        );
        return {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let { dsMatches, revalidatingFetchers } = getMatchesToLoad(
      request,
      scopedContext,
      mapRouteProperties2,
      manifest,
      init.history,
      state,
      matches,
      activeSubmission,
      location,
      initialHydration ? [] : hydrationRouteProperties2,
      initialHydration === true,
      isRevalidationRequired,
      cancelledFetcherLoads,
      fetchersQueuedForDeletion,
      fetchLoadMatches,
      fetchRedirectIds,
      routesToUse,
      basename,
      init.patchRoutesOnNavigation != null,
      pendingActionResult,
      callSiteDefaultShouldRevalidate
    );
    pendingNavigationLoadId = ++incrementingLoadId;
    if (!init.dataStrategy && !dsMatches.some((m) => m.shouldLoad) && !dsMatches.some(
      (m) => m.route.middleware && m.route.middleware.length > 0
    ) && revalidatingFetchers.length === 0) {
      let updatedFetchers2 = markFetchRedirectsDone();
      completeNavigation(
        location,
        {
          matches,
          loaderData: {},
          // Commit pending error if we're short circuiting
          errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? { [pendingActionResult[0]]: pendingActionResult[1].error } : null,
          ...getActionDataForCommit(pendingActionResult),
          ...updatedFetchers2 ? { fetchers: new Map(state.fetchers) } : {}
        },
        { flushSync }
      );
      return { shortCircuited: true };
    }
    if (shouldUpdateNavigationState) {
      let updates = {};
      if (!isFogOfWar) {
        updates.navigation = loadingNavigation;
        let actionData = getUpdatedActionData(pendingActionResult);
        if (actionData !== void 0) {
          updates.actionData = actionData;
        }
      }
      if (revalidatingFetchers.length > 0) {
        updates.fetchers = getUpdatedRevalidatingFetchers(revalidatingFetchers);
      }
      updateState(updates, { flushSync });
    }
    revalidatingFetchers.forEach((rf) => {
      abortFetcher(rf.key);
      if (rf.controller) {
        fetchControllers.set(rf.key, rf.controller);
      }
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((f) => abortFetcher(f.key));
    if (pendingNavigationController) {
      pendingNavigationController.signal.addEventListener(
        "abort",
        abortPendingFetchRevalidations
      );
    }
    let { loaderResults, fetcherResults } = await callLoadersAndMaybeResolveData(
      dsMatches,
      revalidatingFetchers,
      request,
      scopedContext
    );
    if (request.signal.aborted) {
      return { shortCircuited: true };
    }
    if (pendingNavigationController) {
      pendingNavigationController.signal.removeEventListener(
        "abort",
        abortPendingFetchRevalidations
      );
    }
    revalidatingFetchers.forEach((rf) => fetchControllers.delete(rf.key));
    let redirect2 = findRedirect(loaderResults);
    if (redirect2) {
      await startRedirectNavigation(request, redirect2.result, true, {
        replace: replace2
      });
      return { shortCircuited: true };
    }
    redirect2 = findRedirect(fetcherResults);
    if (redirect2) {
      fetchRedirectIds.add(redirect2.key);
      await startRedirectNavigation(request, redirect2.result, true, {
        replace: replace2
      });
      return { shortCircuited: true };
    }
    let { loaderData, errors } = processLoaderData(
      state,
      matches,
      loaderResults,
      pendingActionResult,
      revalidatingFetchers,
      fetcherResults
    );
    if (initialHydration && state.errors) {
      errors = { ...state.errors, ...errors };
    }
    let updatedFetchers = markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
    return {
      matches,
      loaderData,
      errors,
      ...shouldUpdateFetchers ? { fetchers: new Map(state.fetchers) } : {}
    };
  }
  function getUpdatedActionData(pendingActionResult) {
    if (pendingActionResult && !isErrorResult(pendingActionResult[1])) {
      return {
        [pendingActionResult[0]]: pendingActionResult[1].data
      };
    } else if (state.actionData) {
      if (Object.keys(state.actionData).length === 0) {
        return null;
      } else {
        return state.actionData;
      }
    }
  }
  function getUpdatedRevalidatingFetchers(revalidatingFetchers) {
    revalidatingFetchers.forEach((rf) => {
      let fetcher = state.fetchers.get(rf.key);
      let revalidatingFetcher = getLoadingFetcher(
        void 0,
        fetcher ? fetcher.data : void 0
      );
      state.fetchers.set(rf.key, revalidatingFetcher);
    });
    return new Map(state.fetchers);
  }
  async function fetch2(key, routeId, href, opts) {
    abortFetcher(key);
    let flushSync = (opts && opts.flushSync) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let normalizedPath = normalizeTo(
      state.location,
      state.matches,
      basename,
      href,
      routeId,
      opts?.relative
    );
    let matches = matchRoutes(routesToUse, normalizedPath, basename);
    let fogOfWar = checkFogOfWar(matches, routesToUse, normalizedPath);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    if (!matches) {
      setFetcherError(
        key,
        routeId,
        getInternalRouterError(404, { pathname: normalizedPath }),
        { flushSync }
      );
      return;
    }
    let { path, submission, error } = normalizeNavigateOptions(
      true,
      normalizedPath,
      opts
    );
    if (error) {
      setFetcherError(key, routeId, error, { flushSync });
      return;
    }
    let scopedContext = init.getContext ? await init.getContext() : new RouterContextProvider();
    let preventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      await handleFetcherAction(
        key,
        routeId,
        path,
        matches,
        scopedContext,
        fogOfWar.active,
        flushSync,
        preventScrollReset,
        submission,
        opts && opts.unstable_defaultShouldRevalidate
      );
      return;
    }
    fetchLoadMatches.set(key, { routeId, path });
    await handleFetcherLoader(
      key,
      routeId,
      path,
      matches,
      scopedContext,
      fogOfWar.active,
      flushSync,
      preventScrollReset,
      submission
    );
  }
  async function handleFetcherAction(key, routeId, path, requestMatches, scopedContext, isFogOfWar, flushSync, preventScrollReset, submission, callSiteDefaultShouldRevalidate) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(
      init.history,
      path,
      abortController.signal,
      submission
    );
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(
        requestMatches,
        new URL(fetchRequest.url).pathname,
        fetchRequest.signal,
        key
      );
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        setFetcherError(key, routeId, discoverResult.error, { flushSync });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(
          key,
          routeId,
          getInternalRouterError(404, { pathname: path }),
          { flushSync }
        );
        return;
      } else {
        requestMatches = discoverResult.matches;
      }
    }
    let match = getTargetMatch(requestMatches, path);
    if (!match.route.action && !match.route.lazy) {
      let error = getInternalRouterError(405, {
        method: submission.formMethod,
        pathname: path,
        routeId
      });
      setFetcherError(key, routeId, error, { flushSync });
      return;
    }
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let fetchMatches = getTargetedDataStrategyMatches(
      mapRouteProperties2,
      manifest,
      fetchRequest,
      requestMatches,
      match,
      hydrationRouteProperties2,
      scopedContext
    );
    let actionResults = await callDataStrategy(
      fetchRequest,
      fetchMatches,
      scopedContext,
      key
    );
    let actionResult = actionResults[match.route.id];
    if (!actionResult) {
      for (let match2 of fetchMatches) {
        if (actionResults[match2.route.id]) {
          actionResult = actionResults[match2.route.id];
          break;
        }
      }
    }
    if (fetchRequest.signal.aborted) {
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    if (fetchersQueuedForDeletion.has(key)) {
      if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      }
    } else {
      if (isRedirectResult(actionResult)) {
        fetchControllers.delete(key);
        if (pendingNavigationLoadId > originatingLoadId) {
          updateFetcherState(key, getDoneFetcher(void 0));
          return;
        } else {
          fetchRedirectIds.add(key);
          updateFetcherState(key, getLoadingFetcher(submission));
          return startRedirectNavigation(fetchRequest, actionResult, false, {
            fetcherSubmission: submission,
            preventScrollReset
          });
        }
      }
      if (isErrorResult(actionResult)) {
        setFetcherError(key, routeId, actionResult.error);
        return;
      }
    }
    let nextLocation = state.navigation.location || state.location;
    let revalidationRequest = createClientSideRequest(
      init.history,
      nextLocation,
      abortController.signal
    );
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
    invariant(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = getLoadingFetcher(submission, actionResult.data);
    state.fetchers.set(key, loadFetcher);
    let { dsMatches, revalidatingFetchers } = getMatchesToLoad(
      revalidationRequest,
      scopedContext,
      mapRouteProperties2,
      manifest,
      init.history,
      state,
      matches,
      submission,
      nextLocation,
      hydrationRouteProperties2,
      false,
      isRevalidationRequired,
      cancelledFetcherLoads,
      fetchersQueuedForDeletion,
      fetchLoadMatches,
      fetchRedirectIds,
      routesToUse,
      basename,
      init.patchRoutesOnNavigation != null,
      [match.route.id, actionResult],
      callSiteDefaultShouldRevalidate
    );
    revalidatingFetchers.filter((rf) => rf.key !== key).forEach((rf) => {
      let staleKey = rf.key;
      let existingFetcher2 = state.fetchers.get(staleKey);
      let revalidatingFetcher = getLoadingFetcher(
        void 0,
        existingFetcher2 ? existingFetcher2.data : void 0
      );
      state.fetchers.set(staleKey, revalidatingFetcher);
      abortFetcher(staleKey);
      if (rf.controller) {
        fetchControllers.set(staleKey, rf.controller);
      }
    });
    updateState({ fetchers: new Map(state.fetchers) });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((rf) => abortFetcher(rf.key));
    abortController.signal.addEventListener(
      "abort",
      abortPendingFetchRevalidations
    );
    let { loaderResults, fetcherResults } = await callLoadersAndMaybeResolveData(
      dsMatches,
      revalidatingFetchers,
      revalidationRequest,
      scopedContext
    );
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener(
      "abort",
      abortPendingFetchRevalidations
    );
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach((r) => fetchControllers.delete(r.key));
    if (state.fetchers.has(key)) {
      let doneFetcher = getDoneFetcher(actionResult.data);
      state.fetchers.set(key, doneFetcher);
    }
    let redirect2 = findRedirect(loaderResults);
    if (redirect2) {
      return startRedirectNavigation(
        revalidationRequest,
        redirect2.result,
        false,
        { preventScrollReset }
      );
    }
    redirect2 = findRedirect(fetcherResults);
    if (redirect2) {
      fetchRedirectIds.add(redirect2.key);
      return startRedirectNavigation(
        revalidationRequest,
        redirect2.result,
        false,
        { preventScrollReset }
      );
    }
    let { loaderData, errors } = processLoaderData(
      state,
      matches,
      loaderResults,
      void 0,
      revalidatingFetchers,
      fetcherResults
    );
    abortStaleFetchLoads(loadId);
    if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state.navigation.location, {
        matches,
        loaderData,
        errors,
        fetchers: new Map(state.fetchers)
      });
    } else {
      updateState({
        errors,
        loaderData: mergeLoaderData(
          state.loaderData,
          loaderData,
          matches,
          errors
        ),
        fetchers: new Map(state.fetchers)
      });
      isRevalidationRequired = false;
    }
  }
  async function handleFetcherLoader(key, routeId, path, matches, scopedContext, isFogOfWar, flushSync, preventScrollReset, submission) {
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(
      key,
      getLoadingFetcher(
        submission,
        existingFetcher ? existingFetcher.data : void 0
      ),
      { flushSync }
    );
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(
      init.history,
      path,
      abortController.signal
    );
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(
        matches,
        new URL(fetchRequest.url).pathname,
        fetchRequest.signal,
        key
      );
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        setFetcherError(key, routeId, discoverResult.error, { flushSync });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(
          key,
          routeId,
          getInternalRouterError(404, { pathname: path }),
          { flushSync }
        );
        return;
      } else {
        matches = discoverResult.matches;
      }
    }
    let match = getTargetMatch(matches, path);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let dsMatches = getTargetedDataStrategyMatches(
      mapRouteProperties2,
      manifest,
      fetchRequest,
      matches,
      match,
      hydrationRouteProperties2,
      scopedContext
    );
    let results = await callDataStrategy(
      fetchRequest,
      dsMatches,
      scopedContext,
      key
    );
    let result = results[match.route.id];
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    if (fetchersQueuedForDeletion.has(key)) {
      updateFetcherState(key, getDoneFetcher(void 0));
      return;
    }
    if (isRedirectResult(result)) {
      if (pendingNavigationLoadId > originatingLoadId) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      } else {
        fetchRedirectIds.add(key);
        await startRedirectNavigation(fetchRequest, result, false, {
          preventScrollReset
        });
        return;
      }
    }
    if (isErrorResult(result)) {
      setFetcherError(key, routeId, result.error);
      return;
    }
    updateFetcherState(key, getDoneFetcher(result.data));
  }
  async function startRedirectNavigation(request, redirect2, isNavigation, {
    submission,
    fetcherSubmission,
    preventScrollReset,
    replace: replace2
  } = {}) {
    if (!isNavigation) {
      pendingPopstateNavigationDfd?.resolve();
      pendingPopstateNavigationDfd = null;
    }
    if (redirect2.response.headers.has("X-Remix-Revalidate")) {
      isRevalidationRequired = true;
    }
    let location = redirect2.response.headers.get("Location");
    invariant(location, "Expected a Location header on the redirect Response");
    location = normalizeRedirectLocation(
      location,
      new URL(request.url),
      basename
    );
    let redirectLocation = createLocation(state.location, location, {
      _isRedirect: true
    });
    if (isBrowser3) {
      let isDocumentReload = false;
      if (redirect2.response.headers.has("X-Remix-Reload-Document")) {
        isDocumentReload = true;
      } else if (isAbsoluteUrl(location)) {
        const url = createBrowserURLImpl(location, true);
        isDocumentReload = // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin || // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace2) {
          routerWindow.location.replace(location);
        } else {
          routerWindow.location.assign(location);
        }
        return;
      }
    }
    pendingNavigationController = null;
    let redirectNavigationType = replace2 === true || redirect2.response.headers.has("X-Remix-Replace") ? "REPLACE" /* Replace */ : "PUSH" /* Push */;
    let { formMethod, formAction, formEncType } = state.navigation;
    if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) {
      submission = getSubmissionFromNavigation(state.navigation);
    }
    let activeSubmission = submission || fetcherSubmission;
    if (redirectPreserveMethodStatusCodes.has(redirect2.response.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectNavigationType, redirectLocation, {
        submission: {
          ...activeSubmission,
          formAction: location
        },
        // Preserve these flags across redirects
        preventScrollReset: preventScrollReset || pendingPreventScrollReset,
        enableViewTransition: isNavigation ? pendingViewTransitionEnabled : void 0
      });
    } else {
      let overrideNavigation = getLoadingNavigation(
        redirectLocation,
        submission
      );
      await startNavigation(redirectNavigationType, redirectLocation, {
        overrideNavigation,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission,
        // Preserve these flags across redirects
        preventScrollReset: preventScrollReset || pendingPreventScrollReset,
        enableViewTransition: isNavigation ? pendingViewTransitionEnabled : void 0
      });
    }
  }
  async function callDataStrategy(request, matches, scopedContext, fetcherKey) {
    let results;
    let dataResults = {};
    try {
      results = await callDataStrategyImpl(
        dataStrategyImpl,
        request,
        matches,
        fetcherKey,
        scopedContext,
        false
      );
    } catch (e) {
      matches.filter((m) => m.shouldLoad).forEach((m) => {
        dataResults[m.route.id] = {
          type: "error" /* error */,
          error: e
        };
      });
      return dataResults;
    }
    if (request.signal.aborted) {
      return dataResults;
    }
    if (!isMutationMethod(request.method)) {
      for (let match of matches) {
        if (results[match.route.id]?.type === "error" /* error */) {
          break;
        }
        if (!results.hasOwnProperty(match.route.id) && !state.loaderData.hasOwnProperty(match.route.id) && (!state.errors || !state.errors.hasOwnProperty(match.route.id)) && match.shouldCallHandler()) {
          results[match.route.id] = {
            type: "error" /* error */,
            result: new Error(
              `No result returned from dataStrategy for route ${match.route.id}`
            )
          };
        }
      }
    }
    for (let [routeId, result] of Object.entries(results)) {
      if (isRedirectDataStrategyResult(result)) {
        let response = result.result;
        dataResults[routeId] = {
          type: "redirect" /* redirect */,
          response: normalizeRelativeRoutingRedirectResponse(
            response,
            request,
            routeId,
            matches,
            basename
          )
        };
      } else {
        dataResults[routeId] = await convertDataStrategyResultToDataResult(result);
      }
    }
    return dataResults;
  }
  async function callLoadersAndMaybeResolveData(matches, fetchersToLoad, request, scopedContext) {
    let loaderResultsPromise = callDataStrategy(
      request,
      matches,
      scopedContext,
      null
    );
    let fetcherResultsPromise = Promise.all(
      fetchersToLoad.map(async (f) => {
        if (f.matches && f.match && f.request && f.controller) {
          let results = await callDataStrategy(
            f.request,
            f.matches,
            scopedContext,
            f.key
          );
          let result = results[f.match.route.id];
          return { [f.key]: result };
        } else {
          return Promise.resolve({
            [f.key]: {
              type: "error" /* error */,
              error: getInternalRouterError(404, {
                pathname: f.path
              })
            }
          });
        }
      })
    );
    let loaderResults = await loaderResultsPromise;
    let fetcherResults = (await fetcherResultsPromise).reduce(
      (acc, r) => Object.assign(acc, r),
      {}
    );
    return {
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    isRevalidationRequired = true;
    fetchLoadMatches.forEach((_, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.add(key);
      }
      abortFetcher(key);
    });
  }
  function updateFetcherState(key, fetcher, opts = {}) {
    state.fetchers.set(key, fetcher);
    updateState(
      { fetchers: new Map(state.fetchers) },
      { flushSync: (opts && opts.flushSync) === true }
    );
  }
  function setFetcherError(key, routeId, error, opts = {}) {
    let boundaryMatch = findNearestBoundary(state.matches, routeId);
    deleteFetcher(key);
    updateState(
      {
        errors: {
          [boundaryMatch.route.id]: error
        },
        fetchers: new Map(state.fetchers)
      },
      { flushSync: (opts && opts.flushSync) === true }
    );
  }
  function getFetcher(key) {
    activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
    if (fetchersQueuedForDeletion.has(key)) {
      fetchersQueuedForDeletion.delete(key);
    }
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function resetFetcher(key, opts) {
    abortFetcher(key, opts?.reason);
    updateFetcherState(key, getDoneFetcher(null));
  }
  function deleteFetcher(key) {
    let fetcher = state.fetchers.get(key);
    if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
      abortFetcher(key);
    }
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    fetchersQueuedForDeletion.delete(key);
    cancelledFetcherLoads.delete(key);
    state.fetchers.delete(key);
  }
  function queueFetcherForDeletion(key) {
    let count = (activeFetchers.get(key) || 0) - 1;
    if (count <= 0) {
      activeFetchers.delete(key);
      fetchersQueuedForDeletion.add(key);
    } else {
      activeFetchers.set(key, count);
    }
    updateState({ fetchers: new Map(state.fetchers) });
  }
  function abortFetcher(key, reason) {
    let controller = fetchControllers.get(key);
    if (controller) {
      controller.abort(reason);
      fetchControllers.delete(key);
    }
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = getDoneFetcher(fetcher.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    let updatedFetchers = false;
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant(fetcher, `Expected fetcher: ${key}`);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
        updatedFetchers = true;
      }
    }
    markFetchersDone(doneKeys);
    return updatedFetchers;
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, `Expected fetcher: ${key}`);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn) {
      blockerFunctions.set(key, fn);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  function updateBlocker(key, newBlocker) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    invariant(
      blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked",
      `Invalid blocker state transition: ${blocker.state} -> ${newBlocker.state}`
    );
    let blockers = new Map(state.blockers);
    blockers.set(key, newBlocker);
    updateState({ blockers });
  }
  function shouldBlockNavigation({
    currentLocation,
    nextLocation,
    historyAction
  }) {
    if (blockerFunctions.size === 0) {
      return;
    }
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      return;
    }
    if (blockerFunction({ currentLocation, nextLocation, historyAction })) {
      return blockerKey;
    }
  }
  function handleNavigational404(pathname) {
    let error = getInternalRouterError(404, { pathname });
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let { matches, route } = getShortCircuitMatches(routesToUse);
    return { notFoundMatches: matches, route, error };
  }
  function enableScrollRestoration(positions, getPosition, getKey) {
    savedScrollPositions2 = positions;
    getScrollPosition = getPosition;
    getScrollRestorationKey2 = getKey || null;
    if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y = getSavedScrollPosition(state.location, state.matches);
      if (y != null) {
        updateState({ restoreScrollPosition: y });
      }
    }
    return () => {
      savedScrollPositions2 = null;
      getScrollPosition = null;
      getScrollRestorationKey2 = null;
    };
  }
  function getScrollKey(location, matches) {
    if (getScrollRestorationKey2) {
      let key = getScrollRestorationKey2(
        location,
        matches.map((m) => convertRouteMatchToUiMatch(m, state.loaderData))
      );
      return key || location.key;
    }
    return location.key;
  }
  function saveScrollPosition(location, matches) {
    if (savedScrollPositions2 && getScrollPosition) {
      let key = getScrollKey(location, matches);
      savedScrollPositions2[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location, matches) {
    if (savedScrollPositions2) {
      let key = getScrollKey(location, matches);
      let y = savedScrollPositions2[key];
      if (typeof y === "number") {
        return y;
      }
    }
    return null;
  }
  function checkFogOfWar(matches, routesToUse, pathname) {
    if (init.patchRoutesOnNavigation) {
      if (!matches) {
        let fogMatches = matchRoutesImpl(
          routesToUse,
          pathname,
          basename,
          true
        );
        return { active: true, matches: fogMatches || [] };
      } else {
        if (Object.keys(matches[0].params).length > 0) {
          let partialMatches = matchRoutesImpl(
            routesToUse,
            pathname,
            basename,
            true
          );
          return { active: true, matches: partialMatches };
        }
      }
    }
    return { active: false, matches: null };
  }
  async function discoverRoutes(matches, pathname, signal, fetcherKey) {
    if (!init.patchRoutesOnNavigation) {
      return { type: "success", matches };
    }
    let partialMatches = matches;
    while (true) {
      let isNonHMR = inFlightDataRoutes == null;
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let localManifest = manifest;
      try {
        await init.patchRoutesOnNavigation({
          signal,
          path: pathname,
          matches: partialMatches,
          fetcherKey,
          patch: (routeId, children) => {
            if (signal.aborted) return;
            patchRoutesImpl(
              routeId,
              children,
              routesToUse,
              localManifest,
              mapRouteProperties2,
              false
            );
          }
        });
      } catch (e) {
        return { type: "error", error: e, partialMatches };
      } finally {
        if (isNonHMR && !signal.aborted) {
          dataRoutes = [...dataRoutes];
        }
      }
      if (signal.aborted) {
        return { type: "aborted" };
      }
      let newMatches = matchRoutes(routesToUse, pathname, basename);
      let newPartialMatches = null;
      if (newMatches) {
        if (Object.keys(newMatches[0].params).length === 0) {
          return { type: "success", matches: newMatches };
        } else {
          newPartialMatches = matchRoutesImpl(
            routesToUse,
            pathname,
            basename,
            true
          );
          let matchedDeeper = newPartialMatches && partialMatches.length < newPartialMatches.length && compareMatches(
            partialMatches,
            newPartialMatches.slice(0, partialMatches.length)
          );
          if (!matchedDeeper) {
            return { type: "success", matches: newMatches };
          }
        }
      }
      if (!newPartialMatches) {
        newPartialMatches = matchRoutesImpl(
          routesToUse,
          pathname,
          basename,
          true
        );
      }
      if (!newPartialMatches || compareMatches(partialMatches, newPartialMatches)) {
        return { type: "success", matches: null };
      }
      partialMatches = newPartialMatches;
    }
  }
  function compareMatches(a, b) {
    return a.length === b.length && a.every((m, i) => m.route.id === b[i].route.id);
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(
      newRoutes,
      mapRouteProperties2,
      void 0,
      manifest
    );
  }
  function patchRoutes(routeId, children, unstable_allowElementMutations = false) {
    let isNonHMR = inFlightDataRoutes == null;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    patchRoutesImpl(
      routeId,
      children,
      routesToUse,
      manifest,
      mapRouteProperties2,
      unstable_allowElementMutations
    );
    if (isNonHMR) {
      dataRoutes = [...dataRoutes];
      updateState({});
    }
  }
  router = {
    get basename() {
      return basename;
    },
    get future() {
      return future;
    },
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return routerWindow;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch: fetch2,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (to) => init.history.createHref(to),
    encodeLocation: (to) => init.history.encodeLocation(to),
    getFetcher,
    resetFetcher,
    deleteFetcher: queueFetcherForDeletion,
    dispose,
    getBlocker,
    deleteBlocker,
    patchRoutes,
    _internalFetchControllers: fetchControllers,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes,
    _internalSetStateDoNotUseOrYouWillBreakYourApp(newState) {
      updateState(newState);
    }
  };
  if (init.unstable_instrumentations) {
    router = instrumentClientSideRouter(
      router,
      init.unstable_instrumentations.map((i) => i.router).filter(Boolean)
    );
  }
  return router;
}
function createStaticHandler(routes, opts) {
  invariant(
    routes.length > 0,
    "You must provide a non-empty routes array to createStaticHandler"
  );
  let manifest = {};
  let basename = (opts ? opts.basename : null) || "/";
  let _mapRouteProperties = opts?.mapRouteProperties || defaultMapRouteProperties;
  let mapRouteProperties2 = _mapRouteProperties;
  if (opts?.unstable_instrumentations) {
    let instrumentations = opts.unstable_instrumentations;
    mapRouteProperties2 = (route) => {
      return {
        ..._mapRouteProperties(route),
        ...getRouteInstrumentationUpdates(
          instrumentations.map((i) => i.route).filter(Boolean),
          route
        )
      };
    };
  }
  let dataRoutes = convertRoutesToDataRoutes(
    routes,
    mapRouteProperties2,
    void 0,
    manifest
  );
  async function query(request, {
    requestContext,
    filterMatchesToLoad,
    skipLoaderErrorBubbling,
    skipRevalidation,
    dataStrategy,
    generateMiddlewareResponse
  } = {}) {
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename);
    requestContext = requestContext != null ? requestContext : new RouterContextProvider();
    if (!isValidMethod(method) && method !== "HEAD") {
      let error = getInternalRouterError(405, { method });
      let { matches: methodNotAllowedMatches, route } = getShortCircuitMatches(dataRoutes);
      let staticContext = {
        basename,
        location,
        matches: methodNotAllowedMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {}
      };
      return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
    } else if (!matches) {
      let error = getInternalRouterError(404, { pathname: location.pathname });
      let { matches: notFoundMatches, route } = getShortCircuitMatches(dataRoutes);
      let staticContext = {
        basename,
        location,
        matches: notFoundMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {}
      };
      return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
    }
    if (generateMiddlewareResponse) {
      invariant(
        requestContext instanceof RouterContextProvider,
        "When using middleware in `staticHandler.query()`, any provided `requestContext` must be an instance of `RouterContextProvider`"
      );
      try {
        await loadLazyMiddlewareForMatches(
          matches,
          manifest,
          mapRouteProperties2
        );
        let renderedStaticContext;
        let response = await runServerMiddlewarePipeline(
          {
            request,
            unstable_pattern: getRoutePattern(matches),
            matches,
            params: matches[0].params,
            // If we're calling middleware then it must be enabled so we can cast
            // this to the proper type knowing it's not an `AppLoadContext`
            context: requestContext
          },
          async () => {
            let res = await generateMiddlewareResponse(
              async (revalidationRequest, opts2 = {}) => {
                let result2 = await queryImpl(
                  revalidationRequest,
                  location,
                  matches,
                  requestContext,
                  dataStrategy || null,
                  skipLoaderErrorBubbling === true,
                  null,
                  "filterMatchesToLoad" in opts2 ? opts2.filterMatchesToLoad ?? null : filterMatchesToLoad ?? null,
                  skipRevalidation === true
                );
                if (isResponse(result2)) {
                  return result2;
                }
                renderedStaticContext = { location, basename, ...result2 };
                return renderedStaticContext;
              }
            );
            return res;
          },
          async (error, routeId) => {
            if (isRedirectResponse(error)) {
              return error;
            }
            if (isResponse(error)) {
              try {
                error = new ErrorResponseImpl(
                  error.status,
                  error.statusText,
                  await parseResponseBody(error)
                );
              } catch (e) {
                error = e;
              }
            }
            if (isDataWithResponseInit(error)) {
              error = dataWithResponseInitToErrorResponse(error);
            }
            if (renderedStaticContext) {
              if (routeId in renderedStaticContext.loaderData) {
                renderedStaticContext.loaderData[routeId] = void 0;
              }
              let staticContext = getStaticContextFromError(
                dataRoutes,
                renderedStaticContext,
                error,
                skipLoaderErrorBubbling ? routeId : findNearestBoundary(matches, routeId).route.id
              );
              return generateMiddlewareResponse(
                () => Promise.resolve(staticContext)
              );
            } else {
              let boundaryRouteId = skipLoaderErrorBubbling ? routeId : findNearestBoundary(
                matches,
                matches.find(
                  (m) => m.route.id === routeId || m.route.loader
                )?.route.id || routeId
              ).route.id;
              let staticContext = {
                matches,
                location,
                basename,
                loaderData: {},
                actionData: null,
                errors: {
                  [boundaryRouteId]: error
                },
                statusCode: isRouteErrorResponse(error) ? error.status : 500,
                actionHeaders: {},
                loaderHeaders: {}
              };
              return generateMiddlewareResponse(
                () => Promise.resolve(staticContext)
              );
            }
          }
        );
        invariant(isResponse(response), "Expected a response in query()");
        return response;
      } catch (e) {
        if (isResponse(e)) {
          return e;
        }
        throw e;
      }
    }
    let result = await queryImpl(
      request,
      location,
      matches,
      requestContext,
      dataStrategy || null,
      skipLoaderErrorBubbling === true,
      null,
      filterMatchesToLoad || null,
      skipRevalidation === true
    );
    if (isResponse(result)) {
      return result;
    }
    return { location, basename, ...result };
  }
  async function queryRoute(request, {
    routeId,
    requestContext,
    dataStrategy,
    generateMiddlewareResponse
  } = {}) {
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename);
    requestContext = requestContext != null ? requestContext : new RouterContextProvider();
    if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") {
      throw getInternalRouterError(405, { method });
    } else if (!matches) {
      throw getInternalRouterError(404, { pathname: location.pathname });
    }
    let match = routeId ? matches.find((m) => m.route.id === routeId) : getTargetMatch(matches, location);
    if (routeId && !match) {
      throw getInternalRouterError(403, {
        pathname: location.pathname,
        routeId
      });
    } else if (!match) {
      throw getInternalRouterError(404, { pathname: location.pathname });
    }
    if (generateMiddlewareResponse) {
      invariant(
        requestContext instanceof RouterContextProvider,
        "When using middleware in `staticHandler.queryRoute()`, any provided `requestContext` must be an instance of `RouterContextProvider`"
      );
      await loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties2);
      let response = await runServerMiddlewarePipeline(
        {
          request,
          unstable_pattern: getRoutePattern(matches),
          matches,
          params: matches[0].params,
          // If we're calling middleware then it must be enabled so we can cast
          // this to the proper type knowing it's not an `AppLoadContext`
          context: requestContext
        },
        async () => {
          let res = await generateMiddlewareResponse(
            async (innerRequest) => {
              let result2 = await queryImpl(
                innerRequest,
                location,
                matches,
                requestContext,
                dataStrategy || null,
                false,
                match,
                null,
                false
              );
              let processed = handleQueryResult(result2);
              return isResponse(processed) ? processed : typeof processed === "string" ? new Response(processed) : Response.json(processed);
            }
          );
          return res;
        },
        (error) => {
          if (isDataWithResponseInit(error)) {
            return Promise.resolve(dataWithResponseInitToResponse(error));
          }
          if (isResponse(error)) {
            return Promise.resolve(error);
          }
          throw error;
        }
      );
      return response;
    }
    let result = await queryImpl(
      request,
      location,
      matches,
      requestContext,
      dataStrategy || null,
      false,
      match,
      null,
      false
    );
    return handleQueryResult(result);
    function handleQueryResult(result2) {
      if (isResponse(result2)) {
        return result2;
      }
      let error = result2.errors ? Object.values(result2.errors)[0] : void 0;
      if (error !== void 0) {
        throw error;
      }
      if (result2.actionData) {
        return Object.values(result2.actionData)[0];
      }
      if (result2.loaderData) {
        return Object.values(result2.loaderData)[0];
      }
      return void 0;
    }
  }
  async function queryImpl(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, skipRevalidation) {
    invariant(
      request.signal,
      "query()/queryRoute() requests must contain an AbortController signal"
    );
    try {
      if (isMutationMethod(request.method)) {
        let result2 = await submit(
          request,
          matches,
          routeMatch || getTargetMatch(matches, location),
          requestContext,
          dataStrategy,
          skipLoaderErrorBubbling,
          routeMatch != null,
          filterMatchesToLoad,
          skipRevalidation
        );
        return result2;
      }
      let result = await loadRouteData(
        request,
        matches,
        requestContext,
        dataStrategy,
        skipLoaderErrorBubbling,
        routeMatch,
        filterMatchesToLoad
      );
      return isResponse(result) ? result : {
        ...result,
        actionData: null,
        actionHeaders: {}
      };
    } catch (e) {
      if (isDataStrategyResult(e) && isResponse(e.result)) {
        if (e.type === "error" /* error */) {
          throw e.result;
        }
        return e.result;
      }
      if (isRedirectResponse(e)) {
        return e;
      }
      throw e;
    }
  }
  async function submit(request, matches, actionMatch, requestContext, dataStrategy, skipLoaderErrorBubbling, isRouteRequest, filterMatchesToLoad, skipRevalidation) {
    let result;
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      let error = getInternalRouterError(405, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: actionMatch.route.id
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: "error" /* error */,
        error
      };
    } else {
      let dsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties2,
        manifest,
        request,
        matches,
        actionMatch,
        [],
        requestContext
      );
      let results = await callDataStrategy(
        request,
        dsMatches,
        isRouteRequest,
        requestContext,
        dataStrategy
      );
      result = results[actionMatch.route.id];
      if (request.signal.aborted) {
        throwStaticHandlerAbortedError(request, isRouteRequest);
      }
    }
    if (isRedirectResult(result)) {
      throw new Response(null, {
        status: result.response.status,
        headers: {
          Location: result.response.headers.get("Location")
        }
      });
    }
    if (isRouteRequest) {
      if (isErrorResult(result)) {
        throw result.error;
      }
      return {
        matches: [actionMatch],
        loaderData: {},
        actionData: { [actionMatch.route.id]: result.data },
        errors: null,
        // Note: statusCode + headers are unused here since queryRoute will
        // return the raw Response or value
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {}
      };
    }
    if (skipRevalidation) {
      if (isErrorResult(result)) {
        let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
        return {
          statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
          actionData: null,
          actionHeaders: {
            ...result.headers ? { [actionMatch.route.id]: result.headers } : {}
          },
          matches,
          loaderData: {},
          errors: {
            [boundaryMatch.route.id]: result.error
          },
          loaderHeaders: {}
        };
      } else {
        return {
          actionData: {
            [actionMatch.route.id]: result.data
          },
          actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {},
          matches,
          loaderData: {},
          errors: null,
          statusCode: result.statusCode || 200,
          loaderHeaders: {}
        };
      }
    }
    let loaderRequest = new Request(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: request.signal
    });
    if (isErrorResult(result)) {
      let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
      let handlerContext2 = await loadRouteData(
        loaderRequest,
        matches,
        requestContext,
        dataStrategy,
        skipLoaderErrorBubbling,
        null,
        filterMatchesToLoad,
        [boundaryMatch.route.id, result]
      );
      return {
        ...handlerContext2,
        statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
        actionData: null,
        actionHeaders: {
          ...result.headers ? { [actionMatch.route.id]: result.headers } : {}
        }
      };
    }
    let handlerContext = await loadRouteData(
      loaderRequest,
      matches,
      requestContext,
      dataStrategy,
      skipLoaderErrorBubbling,
      null,
      filterMatchesToLoad
    );
    return {
      ...handlerContext,
      actionData: {
        [actionMatch.route.id]: result.data
      },
      // action status codes take precedence over loader status codes
      ...result.statusCode ? { statusCode: result.statusCode } : {},
      actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {}
    };
  }
  async function loadRouteData(request, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, pendingActionResult) {
    let isRouteRequest = routeMatch != null;
    if (isRouteRequest && !routeMatch?.route.loader && !routeMatch?.route.lazy) {
      throw getInternalRouterError(400, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: routeMatch?.route.id
      });
    }
    let dsMatches;
    if (routeMatch) {
      dsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties2,
        manifest,
        request,
        matches,
        routeMatch,
        [],
        requestContext
      );
    } else {
      let maxIdx = pendingActionResult && isErrorResult(pendingActionResult[1]) ? (
        // Up to but not including the boundary
        matches.findIndex((m) => m.route.id === pendingActionResult[0]) - 1
      ) : void 0;
      let pattern = getRoutePattern(matches);
      dsMatches = matches.map((match, index) => {
        if (maxIdx != null && index > maxIdx) {
          return getDataStrategyMatch(
            mapRouteProperties2,
            manifest,
            request,
            pattern,
            match,
            [],
            requestContext,
            false
          );
        }
        return getDataStrategyMatch(
          mapRouteProperties2,
          manifest,
          request,
          pattern,
          match,
          [],
          requestContext,
          (match.route.loader || match.route.lazy) != null && (!filterMatchesToLoad || filterMatchesToLoad(match))
        );
      });
    }
    if (!dataStrategy && !dsMatches.some((m) => m.shouldLoad)) {
      return {
        matches,
        loaderData: {},
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null,
        statusCode: 200,
        loaderHeaders: {}
      };
    }
    let results = await callDataStrategy(
      request,
      dsMatches,
      isRouteRequest,
      requestContext,
      dataStrategy
    );
    if (request.signal.aborted) {
      throwStaticHandlerAbortedError(request, isRouteRequest);
    }
    let handlerContext = processRouteLoaderData(
      matches,
      results,
      pendingActionResult,
      true,
      skipLoaderErrorBubbling
    );
    return {
      ...handlerContext,
      matches
    };
  }
  async function callDataStrategy(request, matches, isRouteRequest, requestContext, dataStrategy) {
    let results = await callDataStrategyImpl(
      dataStrategy || defaultDataStrategy,
      request,
      matches,
      null,
      requestContext,
      true
    );
    let dataResults = {};
    await Promise.all(
      matches.map(async (match) => {
        if (!(match.route.id in results)) {
          return;
        }
        let result = results[match.route.id];
        if (isRedirectDataStrategyResult(result)) {
          let response = result.result;
          throw normalizeRelativeRoutingRedirectResponse(
            response,
            request,
            match.route.id,
            matches,
            basename
          );
        }
        if (isRouteRequest) {
          if (isResponse(result.result)) {
            throw result;
          } else if (isDataWithResponseInit(result.result)) {
            throw dataWithResponseInitToResponse(result.result);
          }
        }
        dataResults[match.route.id] = await convertDataStrategyResultToDataResult(result);
      })
    );
    return dataResults;
  }
  return {
    dataRoutes,
    query,
    queryRoute
  };
}
function getStaticContextFromError(routes, handlerContext, error, boundaryId) {
  let errorBoundaryId = boundaryId || handlerContext._deepestRenderedBoundaryId || routes[0].id;
  return {
    ...handlerContext,
    statusCode: isRouteErrorResponse(error) ? error.status : 500,
    errors: {
      [errorBoundaryId]: error
    }
  };
}
function throwStaticHandlerAbortedError(request, isRouteRequest) {
  if (request.signal.reason !== void 0) {
    throw request.signal.reason;
  }
  let method = isRouteRequest ? "queryRoute" : "query";
  throw new Error(
    `${method}() call aborted without an \`AbortSignal.reason\`: ${request.method} ${request.url}`
  );
}
function isSubmissionNavigation(opts) {
  return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== void 0);
}
function normalizeTo(location, matches, basename, to, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  if (fromRouteId) {
    contextualMatches = [];
    for (let match of matches) {
      contextualMatches.push(match);
      if (match.route.id === fromRouteId) {
        activeRouteMatch = match;
        break;
      }
    }
  } else {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  let path = resolveTo(
    to ? to : ".",
    getResolveToMatches(contextualMatches),
    stripBasename(location.pathname, basename) || location.pathname,
    relative === "path"
  );
  if (to == null) {
    path.search = location.search;
    path.hash = location.hash;
  }
  if ((to == null || to === "" || to === ".") && activeRouteMatch) {
    let nakedIndex = hasNakedIndexQuery(path.search);
    if (activeRouteMatch.route.index && !nakedIndex) {
      path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
    } else if (!activeRouteMatch.route.index && nakedIndex) {
      let params = new URLSearchParams(path.search);
      let indexValues = params.getAll("index");
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if (basename !== "/") {
    path.pathname = prependBasename({ basename, pathname: path.pathname });
  }
  return createPath(path);
}
function normalizeNavigateOptions(isFetcher, path, opts) {
  if (!opts || !isSubmissionNavigation(opts)) {
    return { path };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, { method: opts.formMethod })
    };
  }
  let getInvalidBodyError = () => ({
    path,
    error: getInternalRouterError(400, { type: "invalid-body" })
  });
  let rawFormMethod = opts.formMethod || "get";
  let formMethod = rawFormMethod.toUpperCase();
  let formAction = stripHashFromPath(path);
  if (opts.body !== void 0) {
    if (opts.formEncType === "text/plain") {
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(opts.body.entries()).reduce(
          (acc, [name, value]) => `${acc}${name}=${value}
`,
          ""
        )
      ) : String(opts.body);
      return {
        path,
        submission: {
          formMethod,
          formAction,
          formEncType: opts.formEncType,
          formData: void 0,
          json: void 0,
          text
        }
      };
    } else if (opts.formEncType === "application/json") {
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      try {
        let json = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: void 0,
            json,
            text: void 0
          }
        };
      } catch (e) {
        return getInvalidBodyError();
      }
    }
  }
  invariant(
    typeof FormData === "function",
    "FormData is not available in this environment"
  );
  let searchParams;
  let formData;
  if (opts.formData) {
    searchParams = convertFormDataToSearchParams(opts.formData);
    formData = opts.formData;
  } else if (opts.body instanceof FormData) {
    searchParams = convertFormDataToSearchParams(opts.body);
    formData = opts.body;
  } else if (opts.body instanceof URLSearchParams) {
    searchParams = opts.body;
    formData = convertSearchParamsToFormData(searchParams);
  } else if (opts.body == null) {
    searchParams = new URLSearchParams();
    formData = new FormData();
  } else {
    try {
      searchParams = new URLSearchParams(opts.body);
      formData = convertSearchParamsToFormData(searchParams);
    } catch (e) {
      return getInvalidBodyError();
    }
  }
  let submission = {
    formMethod,
    formAction,
    formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
    formData,
    json: void 0,
    text: void 0
  };
  if (isMutationMethod(submission.formMethod)) {
    return { path, submission };
  }
  let parsedPath = parsePath(path);
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = `?${searchParams}`;
  return { path: createPath(parsedPath), submission };
}
function getMatchesToLoad(request, scopedContext, mapRouteProperties2, manifest, history, state, matches, submission, location, lazyRoutePropertiesToSkip, initialHydration, isRevalidationRequired, cancelledFetcherLoads, fetchersQueuedForDeletion, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, hasPatchRoutesOnNavigation, pendingActionResult, callSiteDefaultShouldRevalidate) {
  let actionResult = pendingActionResult ? isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : pendingActionResult[1].data : void 0;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location);
  let maxIdx;
  if (initialHydration && state.errors) {
    let boundaryId = Object.keys(state.errors)[0];
    maxIdx = matches.findIndex((m) => m.route.id === boundaryId);
  } else if (pendingActionResult && isErrorResult(pendingActionResult[1])) {
    let boundaryId = pendingActionResult[0];
    maxIdx = matches.findIndex((m) => m.route.id === boundaryId) - 1;
  }
  let actionStatus = pendingActionResult ? pendingActionResult[1].statusCode : void 0;
  let shouldSkipRevalidation = actionStatus && actionStatus >= 400;
  let baseShouldRevalidateArgs = {
    currentUrl,
    currentParams: state.matches[0]?.params || {},
    nextUrl,
    nextParams: matches[0].params,
    ...submission,
    actionResult,
    actionStatus
  };
  let pattern = getRoutePattern(matches);
  let dsMatches = matches.map((match, index) => {
    let { route } = match;
    let forceShouldLoad = null;
    if (maxIdx != null && index > maxIdx) {
      forceShouldLoad = false;
    } else if (route.lazy) {
      forceShouldLoad = true;
    } else if (!routeHasLoaderOrMiddleware(route)) {
      forceShouldLoad = false;
    } else if (initialHydration) {
      forceShouldLoad = shouldLoadRouteOnHydration(
        route,
        state.loaderData,
        state.errors
      );
    } else if (isNewLoader(state.loaderData, state.matches[index], match)) {
      forceShouldLoad = true;
    }
    if (forceShouldLoad !== null) {
      return getDataStrategyMatch(
        mapRouteProperties2,
        manifest,
        request,
        pattern,
        match,
        lazyRoutePropertiesToSkip,
        scopedContext,
        forceShouldLoad
      );
    }
    let defaultShouldRevalidate = false;
    if (typeof callSiteDefaultShouldRevalidate === "boolean") {
      defaultShouldRevalidate = callSiteDefaultShouldRevalidate;
    } else if (shouldSkipRevalidation) {
      defaultShouldRevalidate = false;
    } else if (isRevalidationRequired) {
      defaultShouldRevalidate = true;
    } else if (currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search) {
      defaultShouldRevalidate = true;
    } else if (currentUrl.search !== nextUrl.search) {
      defaultShouldRevalidate = true;
    } else if (isNewRouteInstance(state.matches[index], match)) {
      defaultShouldRevalidate = true;
    }
    let shouldRevalidateArgs = {
      ...baseShouldRevalidateArgs,
      defaultShouldRevalidate
    };
    let shouldLoad = shouldRevalidateLoader(match, shouldRevalidateArgs);
    return getDataStrategyMatch(
      mapRouteProperties2,
      manifest,
      request,
      pattern,
      match,
      lazyRoutePropertiesToSkip,
      scopedContext,
      shouldLoad,
      shouldRevalidateArgs,
      callSiteDefaultShouldRevalidate
    );
  });
  let revalidatingFetchers = [];
  fetchLoadMatches.forEach((f, key) => {
    if (initialHydration || !matches.some((m) => m.route.id === f.routeId) || fetchersQueuedForDeletion.has(key)) {
      return;
    }
    let fetcher = state.fetchers.get(key);
    let isMidInitialLoad = fetcher && fetcher.state !== "idle" && fetcher.data === void 0;
    let fetcherMatches = matchRoutes(routesToUse, f.path, basename);
    if (!fetcherMatches) {
      if (hasPatchRoutesOnNavigation && isMidInitialLoad) {
        return;
      }
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: null,
        match: null,
        request: null,
        controller: null
      });
      return;
    }
    if (fetchRedirectIds.has(key)) {
      return;
    }
    let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
    let fetchController = new AbortController();
    let fetchRequest = createClientSideRequest(
      history,
      f.path,
      fetchController.signal
    );
    let fetcherDsMatches = null;
    if (cancelledFetcherLoads.has(key)) {
      cancelledFetcherLoads.delete(key);
      fetcherDsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties2,
        manifest,
        fetchRequest,
        fetcherMatches,
        fetcherMatch,
        lazyRoutePropertiesToSkip,
        scopedContext
      );
    } else if (isMidInitialLoad) {
      if (isRevalidationRequired) {
        fetcherDsMatches = getTargetedDataStrategyMatches(
          mapRouteProperties2,
          manifest,
          fetchRequest,
          fetcherMatches,
          fetcherMatch,
          lazyRoutePropertiesToSkip,
          scopedContext
        );
      }
    } else {
      let defaultShouldRevalidate;
      if (typeof callSiteDefaultShouldRevalidate === "boolean") {
        defaultShouldRevalidate = callSiteDefaultShouldRevalidate;
      } else if (shouldSkipRevalidation) {
        defaultShouldRevalidate = false;
      } else {
        defaultShouldRevalidate = isRevalidationRequired;
      }
      let shouldRevalidateArgs = {
        ...baseShouldRevalidateArgs,
        defaultShouldRevalidate
      };
      if (shouldRevalidateLoader(fetcherMatch, shouldRevalidateArgs)) {
        fetcherDsMatches = getTargetedDataStrategyMatches(
          mapRouteProperties2,
          manifest,
          fetchRequest,
          fetcherMatches,
          fetcherMatch,
          lazyRoutePropertiesToSkip,
          scopedContext,
          shouldRevalidateArgs
        );
      }
    }
    if (fetcherDsMatches) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: fetcherDsMatches,
        match: fetcherMatch,
        request: fetchRequest,
        controller: fetchController
      });
    }
  });
  return { dsMatches, revalidatingFetchers };
}
function routeHasLoaderOrMiddleware(route) {
  return route.loader != null || route.middleware != null && route.middleware.length > 0;
}
function shouldLoadRouteOnHydration(route, loaderData, errors) {
  if (route.lazy) {
    return true;
  }
  if (!routeHasLoaderOrMiddleware(route)) {
    return false;
  }
  let hasData = loaderData != null && route.id in loaderData;
  let hasError = errors != null && errors[route.id] !== void 0;
  if (!hasData && hasError) {
    return false;
  }
  if (typeof route.loader === "function" && route.loader.hydrate === true) {
    return true;
  }
  return !hasData && !hasError;
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew = (
    // [a] -> [a, b]
    !currentMatch || // [a, b] -> [a, c]
    match.route.id !== currentMatch.route.id
  );
  let isMissingData = !currentLoaderData.hasOwnProperty(match.route.id);
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
function patchRoutesImpl(routeId, children, routesToUse, manifest, mapRouteProperties2, allowElementMutations) {
  let childrenToPatch;
  if (routeId) {
    let route = manifest[routeId];
    invariant(
      route,
      `No route found to patch children into: routeId = ${routeId}`
    );
    if (!route.children) {
      route.children = [];
    }
    childrenToPatch = route.children;
  } else {
    childrenToPatch = routesToUse;
  }
  let uniqueChildren = [];
  let existingChildren = [];
  children.forEach((newRoute) => {
    let existingRoute = childrenToPatch.find(
      (existingRoute2) => isSameRoute(newRoute, existingRoute2)
    );
    if (existingRoute) {
      existingChildren.push({ existingRoute, newRoute });
    } else {
      uniqueChildren.push(newRoute);
    }
  });
  if (uniqueChildren.length > 0) {
    let newRoutes = convertRoutesToDataRoutes(
      uniqueChildren,
      mapRouteProperties2,
      [routeId || "_", "patch", String(childrenToPatch?.length || "0")],
      manifest
    );
    childrenToPatch.push(...newRoutes);
  }
  if (allowElementMutations && existingChildren.length > 0) {
    for (let i = 0; i < existingChildren.length; i++) {
      let { existingRoute, newRoute } = existingChildren[i];
      let existingRouteTyped = existingRoute;
      let [newRouteTyped] = convertRoutesToDataRoutes(
        [newRoute],
        mapRouteProperties2,
        [],
        // Doesn't matter for mutated routes since they already have an id
        {},
        // Don't touch the manifest here since we're updating in place
        true
      );
      Object.assign(existingRouteTyped, {
        element: newRouteTyped.element ? newRouteTyped.element : existingRouteTyped.element,
        errorElement: newRouteTyped.errorElement ? newRouteTyped.errorElement : existingRouteTyped.errorElement,
        hydrateFallbackElement: newRouteTyped.hydrateFallbackElement ? newRouteTyped.hydrateFallbackElement : existingRouteTyped.hydrateFallbackElement
      });
    }
  }
}
function isSameRoute(newRoute, existingRoute) {
  if ("id" in newRoute && "id" in existingRoute && newRoute.id === existingRoute.id) {
    return true;
  }
  if (!(newRoute.index === existingRoute.index && newRoute.path === existingRoute.path && newRoute.caseSensitive === existingRoute.caseSensitive)) {
    return false;
  }
  if ((!newRoute.children || newRoute.children.length === 0) && (!existingRoute.children || existingRoute.children.length === 0)) {
    return true;
  }
  return newRoute.children.every(
    (aChild, i) => existingRoute.children?.some((bChild) => isSameRoute(aChild, bChild))
  );
}
var lazyRoutePropertyCache = /* @__PURE__ */ new WeakMap();
var loadLazyRouteProperty = ({
  key,
  route,
  manifest,
  mapRouteProperties: mapRouteProperties2
}) => {
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  if (!routeToUpdate.lazy || typeof routeToUpdate.lazy !== "object") {
    return;
  }
  let lazyFn = routeToUpdate.lazy[key];
  if (!lazyFn) {
    return;
  }
  let cache = lazyRoutePropertyCache.get(routeToUpdate);
  if (!cache) {
    cache = {};
    lazyRoutePropertyCache.set(routeToUpdate, cache);
  }
  let cachedPromise = cache[key];
  if (cachedPromise) {
    return cachedPromise;
  }
  let propertyPromise = (async () => {
    let isUnsupported = isUnsupportedLazyRouteObjectKey(key);
    let staticRouteValue = routeToUpdate[key];
    let isStaticallyDefined = staticRouteValue !== void 0 && key !== "hasErrorBoundary";
    if (isUnsupported) {
      warning(
        !isUnsupported,
        "Route property " + key + " is not a supported lazy route property. This property will be ignored."
      );
      cache[key] = Promise.resolve();
    } else if (isStaticallyDefined) {
      warning(
        false,
        `Route "${routeToUpdate.id}" has a static property "${key}" defined. The lazy property will be ignored.`
      );
    } else {
      let value = await lazyFn();
      if (value != null) {
        Object.assign(routeToUpdate, { [key]: value });
        Object.assign(routeToUpdate, mapRouteProperties2(routeToUpdate));
      }
    }
    if (typeof routeToUpdate.lazy === "object") {
      routeToUpdate.lazy[key] = void 0;
      if (Object.values(routeToUpdate.lazy).every((value) => value === void 0)) {
        routeToUpdate.lazy = void 0;
      }
    }
  })();
  cache[key] = propertyPromise;
  return propertyPromise;
};
var lazyRouteFunctionCache = /* @__PURE__ */ new WeakMap();
function loadLazyRoute(route, type, manifest, mapRouteProperties2, lazyRoutePropertiesToSkip) {
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  if (!route.lazy) {
    return {
      lazyRoutePromise: void 0,
      lazyHandlerPromise: void 0
    };
  }
  if (typeof route.lazy === "function") {
    let cachedPromise = lazyRouteFunctionCache.get(routeToUpdate);
    if (cachedPromise) {
      return {
        lazyRoutePromise: cachedPromise,
        lazyHandlerPromise: cachedPromise
      };
    }
    let lazyRoutePromise2 = (async () => {
      invariant(
        typeof route.lazy === "function",
        "No lazy route function found"
      );
      let lazyRoute = await route.lazy();
      let routeUpdates = {};
      for (let lazyRouteProperty in lazyRoute) {
        let lazyValue = lazyRoute[lazyRouteProperty];
        if (lazyValue === void 0) {
          continue;
        }
        let isUnsupported = isUnsupportedLazyRouteFunctionKey(lazyRouteProperty);
        let staticRouteValue = routeToUpdate[lazyRouteProperty];
        let isStaticallyDefined = staticRouteValue !== void 0 && // This property isn't static since it should always be updated based
        // on the route updates
        lazyRouteProperty !== "hasErrorBoundary";
        if (isUnsupported) {
          warning(
            !isUnsupported,
            "Route property " + lazyRouteProperty + " is not a supported property to be returned from a lazy route function. This property will be ignored."
          );
        } else if (isStaticallyDefined) {
          warning(
            !isStaticallyDefined,
            `Route "${routeToUpdate.id}" has a static property "${lazyRouteProperty}" defined but its lazy function is also returning a value for this property. The lazy route property "${lazyRouteProperty}" will be ignored.`
          );
        } else {
          routeUpdates[lazyRouteProperty] = lazyValue;
        }
      }
      Object.assign(routeToUpdate, routeUpdates);
      Object.assign(routeToUpdate, {
        // To keep things framework agnostic, we use the provided `mapRouteProperties`
        // function to set the framework-aware properties (`element`/`hasErrorBoundary`)
        // since the logic will differ between frameworks.
        ...mapRouteProperties2(routeToUpdate),
        lazy: void 0
      });
    })();
    lazyRouteFunctionCache.set(routeToUpdate, lazyRoutePromise2);
    lazyRoutePromise2.catch(() => {
    });
    return {
      lazyRoutePromise: lazyRoutePromise2,
      lazyHandlerPromise: lazyRoutePromise2
    };
  }
  let lazyKeys = Object.keys(route.lazy);
  let lazyPropertyPromises = [];
  let lazyHandlerPromise = void 0;
  for (let key of lazyKeys) {
    if (lazyRoutePropertiesToSkip && lazyRoutePropertiesToSkip.includes(key)) {
      continue;
    }
    let promise = loadLazyRouteProperty({
      key,
      route,
      manifest,
      mapRouteProperties: mapRouteProperties2
    });
    if (promise) {
      lazyPropertyPromises.push(promise);
      if (key === type) {
        lazyHandlerPromise = promise;
      }
    }
  }
  let lazyRoutePromise = lazyPropertyPromises.length > 0 ? Promise.all(lazyPropertyPromises).then(() => {
  }) : void 0;
  lazyRoutePromise?.catch(() => {
  });
  lazyHandlerPromise?.catch(() => {
  });
  return {
    lazyRoutePromise,
    lazyHandlerPromise
  };
}
function isNonNullable(value) {
  return value !== void 0;
}
function loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties2) {
  let promises = matches.map(({ route }) => {
    if (typeof route.lazy !== "object" || !route.lazy.middleware) {
      return void 0;
    }
    return loadLazyRouteProperty({
      key: "middleware",
      route,
      manifest,
      mapRouteProperties: mapRouteProperties2
    });
  }).filter(isNonNullable);
  return promises.length > 0 ? Promise.all(promises) : void 0;
}
async function defaultDataStrategy(args) {
  let matchesToLoad = args.matches.filter((m) => m.shouldLoad);
  let keyedResults = {};
  let results = await Promise.all(matchesToLoad.map((m) => m.resolve()));
  results.forEach((result, i) => {
    keyedResults[matchesToLoad[i].route.id] = result;
  });
  return keyedResults;
}
async function defaultDataStrategyWithMiddleware(args) {
  if (!args.matches.some((m) => m.route.middleware)) {
    return defaultDataStrategy(args);
  }
  return runClientMiddlewarePipeline(args, () => defaultDataStrategy(args));
}
function runServerMiddlewarePipeline(args, handler, errorHandler) {
  return runMiddlewarePipeline(
    args,
    handler,
    processResult,
    isResponse,
    errorHandler
  );
  function processResult(result) {
    return isDataWithResponseInit(result) ? dataWithResponseInitToResponse(result) : result;
  }
}
function runClientMiddlewarePipeline(args, handler) {
  return runMiddlewarePipeline(
    args,
    handler,
    (r) => {
      if (isRedirectResponse(r)) {
        throw r;
      }
      return r;
    },
    isDataStrategyResults,
    errorHandler
  );
  function errorHandler(error, routeId, nextResult) {
    if (nextResult) {
      return Promise.resolve(
        Object.assign(nextResult.value, {
          [routeId]: { type: "error", result: error }
        })
      );
    } else {
      let { matches } = args;
      let maxBoundaryIdx = Math.min(
        // Throwing route
        Math.max(
          matches.findIndex((m) => m.route.id === routeId),
          0
        ),
        // or the shallowest route that needs to load data
        Math.max(
          matches.findIndex((m) => m.shouldCallHandler()),
          0
        )
      );
      let boundaryRouteId = findNearestBoundary(
        matches,
        matches[maxBoundaryIdx].route.id
      ).route.id;
      return Promise.resolve({
        [boundaryRouteId]: { type: "error", result: error }
      });
    }
  }
}
async function runMiddlewarePipeline(args, handler, processResult, isResult, errorHandler) {
  let { matches, request, params, context, unstable_pattern } = args;
  let tuples = matches.flatMap(
    (m) => m.route.middleware ? m.route.middleware.map((fn) => [m.route.id, fn]) : []
  );
  let result = await callRouteMiddleware(
    {
      request,
      params,
      context,
      unstable_pattern
    },
    tuples,
    handler,
    processResult,
    isResult,
    errorHandler
  );
  return result;
}
async function callRouteMiddleware(args, middlewares, handler, processResult, isResult, errorHandler, idx = 0) {
  let { request } = args;
  if (request.signal.aborted) {
    throw request.signal.reason ?? new Error(`Request aborted: ${request.method} ${request.url}`);
  }
  let tuple = middlewares[idx];
  if (!tuple) {
    let result = await handler();
    return result;
  }
  let [routeId, middleware] = tuple;
  let nextResult;
  let next = async () => {
    if (nextResult) {
      throw new Error("You may only call `next()` once per middleware");
    }
    try {
      let result = await callRouteMiddleware(
        args,
        middlewares,
        handler,
        processResult,
        isResult,
        errorHandler,
        idx + 1
      );
      nextResult = { value: result };
      return nextResult.value;
    } catch (error) {
      nextResult = { value: await errorHandler(error, routeId, nextResult) };
      return nextResult.value;
    }
  };
  try {
    let value = await middleware(args, next);
    let result = value != null ? processResult(value) : void 0;
    if (isResult(result)) {
      return result;
    } else if (nextResult) {
      return result ?? nextResult.value;
    } else {
      nextResult = { value: await next() };
      return nextResult.value;
    }
  } catch (error) {
    let response = await errorHandler(error, routeId, nextResult);
    return response;
  }
}
function getDataStrategyMatchLazyPromises(mapRouteProperties2, manifest, request, match, lazyRoutePropertiesToSkip) {
  let lazyMiddlewarePromise = loadLazyRouteProperty({
    key: "middleware",
    route: match.route,
    manifest,
    mapRouteProperties: mapRouteProperties2
  });
  let lazyRoutePromises = loadLazyRoute(
    match.route,
    isMutationMethod(request.method) ? "action" : "loader",
    manifest,
    mapRouteProperties2,
    lazyRoutePropertiesToSkip
  );
  return {
    middleware: lazyMiddlewarePromise,
    route: lazyRoutePromises.lazyRoutePromise,
    handler: lazyRoutePromises.lazyHandlerPromise
  };
}
function getDataStrategyMatch(mapRouteProperties2, manifest, request, unstable_pattern, match, lazyRoutePropertiesToSkip, scopedContext, shouldLoad, shouldRevalidateArgs = null, callSiteDefaultShouldRevalidate) {
  let isUsingNewApi = false;
  let _lazyPromises = getDataStrategyMatchLazyPromises(
    mapRouteProperties2,
    manifest,
    request,
    match,
    lazyRoutePropertiesToSkip
  );
  return {
    ...match,
    _lazyPromises,
    shouldLoad,
    shouldRevalidateArgs,
    shouldCallHandler(defaultShouldRevalidate) {
      isUsingNewApi = true;
      if (!shouldRevalidateArgs) {
        return shouldLoad;
      }
      if (typeof callSiteDefaultShouldRevalidate === "boolean") {
        return shouldRevalidateLoader(match, {
          ...shouldRevalidateArgs,
          defaultShouldRevalidate: callSiteDefaultShouldRevalidate
        });
      }
      if (typeof defaultShouldRevalidate === "boolean") {
        return shouldRevalidateLoader(match, {
          ...shouldRevalidateArgs,
          defaultShouldRevalidate
        });
      }
      return shouldRevalidateLoader(match, shouldRevalidateArgs);
    },
    resolve(handlerOverride) {
      let { lazy, loader, middleware } = match.route;
      let callHandler = isUsingNewApi || shouldLoad || handlerOverride && !isMutationMethod(request.method) && (lazy || loader);
      let isMiddlewareOnlyRoute = middleware && middleware.length > 0 && !loader && !lazy;
      if (callHandler && (isMutationMethod(request.method) || !isMiddlewareOnlyRoute)) {
        return callLoaderOrAction({
          request,
          unstable_pattern,
          match,
          lazyHandlerPromise: _lazyPromises?.handler,
          lazyRoutePromise: _lazyPromises?.route,
          handlerOverride,
          scopedContext
        });
      }
      return Promise.resolve({ type: "data" /* data */, result: void 0 });
    }
  };
}
function getTargetedDataStrategyMatches(mapRouteProperties2, manifest, request, matches, targetMatch, lazyRoutePropertiesToSkip, scopedContext, shouldRevalidateArgs = null) {
  return matches.map((match) => {
    if (match.route.id !== targetMatch.route.id) {
      return {
        ...match,
        shouldLoad: false,
        shouldRevalidateArgs,
        shouldCallHandler: () => false,
        _lazyPromises: getDataStrategyMatchLazyPromises(
          mapRouteProperties2,
          manifest,
          request,
          match,
          lazyRoutePropertiesToSkip
        ),
        resolve: () => Promise.resolve({ type: "data", result: void 0 })
      };
    }
    return getDataStrategyMatch(
      mapRouteProperties2,
      manifest,
      request,
      getRoutePattern(matches),
      match,
      lazyRoutePropertiesToSkip,
      scopedContext,
      true,
      shouldRevalidateArgs
    );
  });
}
async function callDataStrategyImpl(dataStrategyImpl, request, matches, fetcherKey, scopedContext, isStaticHandler) {
  if (matches.some((m) => m._lazyPromises?.middleware)) {
    await Promise.all(matches.map((m) => m._lazyPromises?.middleware));
  }
  let dataStrategyArgs = {
    request,
    unstable_pattern: getRoutePattern(matches),
    params: matches[0].params,
    context: scopedContext,
    matches
  };
  let runClientMiddleware = isStaticHandler ? () => {
    throw new Error(
      "You cannot call `runClientMiddleware()` from a static handler `dataStrategy`. Middleware is run outside of `dataStrategy` during SSR in order to bubble up the Response.  You can enable middleware via the `respond` API in `query`/`queryRoute`"
    );
  } : (cb) => {
    let typedDataStrategyArgs = dataStrategyArgs;
    return runClientMiddlewarePipeline(typedDataStrategyArgs, () => {
      return cb({
        ...typedDataStrategyArgs,
        fetcherKey,
        runClientMiddleware: () => {
          throw new Error(
            "Cannot call `runClientMiddleware()` from within an `runClientMiddleware` handler"
          );
        }
      });
    });
  };
  let results = await dataStrategyImpl({
    ...dataStrategyArgs,
    fetcherKey,
    runClientMiddleware
  });
  try {
    await Promise.all(
      matches.flatMap((m) => [
        m._lazyPromises?.handler,
        m._lazyPromises?.route
      ])
    );
  } catch (e) {
  }
  return results;
}
async function callLoaderOrAction({
  request,
  unstable_pattern,
  match,
  lazyHandlerPromise,
  lazyRoutePromise,
  handlerOverride,
  scopedContext
}) {
  let result;
  let onReject;
  let isAction = isMutationMethod(request.method);
  let type = isAction ? "action" : "loader";
  let runHandler = (handler) => {
    let reject;
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    let actualHandler = (ctx) => {
      if (typeof handler !== "function") {
        return Promise.reject(
          new Error(
            `You cannot call the handler for a route which defines a boolean "${type}" [routeId: ${match.route.id}]`
          )
        );
      }
      return handler(
        {
          request,
          unstable_pattern,
          params: match.params,
          context: scopedContext
        },
        ...ctx !== void 0 ? [ctx] : []
      );
    };
    let handlerPromise = (async () => {
      try {
        let val = await (handlerOverride ? handlerOverride((ctx) => actualHandler(ctx)) : actualHandler());
        return { type: "data", result: val };
      } catch (e) {
        return { type: "error", result: e };
      }
    })();
    return Promise.race([handlerPromise, abortPromise]);
  };
  try {
    let handler = isAction ? match.route.action : match.route.loader;
    if (lazyHandlerPromise || lazyRoutePromise) {
      if (handler) {
        let handlerError;
        let [value] = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          runHandler(handler).catch((e) => {
            handlerError = e;
          }),
          // Ensure all lazy route promises are resolved before continuing
          lazyHandlerPromise,
          lazyRoutePromise
        ]);
        if (handlerError !== void 0) {
          throw handlerError;
        }
        result = value;
      } else {
        await lazyHandlerPromise;
        let handler2 = isAction ? match.route.action : match.route.loader;
        if (handler2) {
          [result] = await Promise.all([runHandler(handler2), lazyRoutePromise]);
        } else if (type === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          return { type: "data" /* data */, result: void 0 };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
  } catch (e) {
    return { type: "error" /* error */, result: e };
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  return result;
}
async function parseResponseBody(response) {
  let contentType = response.headers.get("Content-Type");
  if (contentType && /\bapplication\/json\b/.test(contentType)) {
    return response.body == null ? null : response.json();
  }
  return response.text();
}
async function convertDataStrategyResultToDataResult(dataStrategyResult) {
  let { result, type } = dataStrategyResult;
  if (isResponse(result)) {
    let data2;
    try {
      data2 = await parseResponseBody(result);
    } catch (e) {
      return { type: "error" /* error */, error: e };
    }
    if (type === "error" /* error */) {
      return {
        type: "error" /* error */,
        error: new ErrorResponseImpl(result.status, result.statusText, data2),
        statusCode: result.status,
        headers: result.headers
      };
    }
    return {
      type: "data" /* data */,
      data: data2,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (type === "error" /* error */) {
    if (isDataWithResponseInit(result)) {
      if (result.data instanceof Error) {
        return {
          type: "error" /* error */,
          error: result.data,
          statusCode: result.init?.status,
          headers: result.init?.headers ? new Headers(result.init.headers) : void 0
        };
      }
      return {
        type: "error" /* error */,
        error: dataWithResponseInitToErrorResponse(result),
        statusCode: isRouteErrorResponse(result) ? result.status : void 0,
        headers: result.init?.headers ? new Headers(result.init.headers) : void 0
      };
    }
    return {
      type: "error" /* error */,
      error: result,
      statusCode: isRouteErrorResponse(result) ? result.status : void 0
    };
  }
  if (isDataWithResponseInit(result)) {
    return {
      type: "data" /* data */,
      data: result.data,
      statusCode: result.init?.status,
      headers: result.init?.headers ? new Headers(result.init.headers) : void 0
    };
  }
  return { type: "data" /* data */, data: result };
}
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename) {
  let location = response.headers.get("Location");
  invariant(
    location,
    "Redirects returned/thrown from loaders/actions must have a Location header"
  );
  if (!isAbsoluteUrl(location)) {
    let trimmedMatches = matches.slice(
      0,
      matches.findIndex((m) => m.route.id === routeId) + 1
    );
    location = normalizeTo(
      new URL(request.url),
      trimmedMatches,
      basename,
      location
    );
    response.headers.set("Location", location);
  }
  return response;
}
function normalizeRedirectLocation(location, currentUrl, basename) {
  if (isAbsoluteUrl(location)) {
    let normalizedLocation = location;
    let url = normalizedLocation.startsWith("//") ? new URL(currentUrl.protocol + normalizedLocation) : new URL(normalizedLocation);
    let isSameBasename = stripBasename(url.pathname, basename) != null;
    if (url.origin === currentUrl.origin && isSameBasename) {
      return url.pathname + url.search + url.hash;
    }
  }
  return location;
}
function createClientSideRequest(history, location, signal, submission) {
  let url = history.createURL(stripHashFromPath(location)).toString();
  let init = { signal };
  if (submission && isMutationMethod(submission.formMethod)) {
    let { formMethod, formEncType } = submission;
    init.method = formMethod.toUpperCase();
    if (formEncType === "application/json") {
      init.headers = new Headers({ "Content-Type": formEncType });
      init.body = JSON.stringify(submission.json);
    } else if (formEncType === "text/plain") {
      init.body = submission.text;
    } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
      init.body = convertFormDataToSearchParams(submission.formData);
    } else {
      init.body = submission.formData;
    }
  }
  return new Request(url, init);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    searchParams.append(key, typeof value === "string" ? value : value.name);
  }
  return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
  let formData = new FormData();
  for (let [key, value] of searchParams.entries()) {
    formData.append(key, value);
  }
  return formData;
}
function processRouteLoaderData(matches, results, pendingActionResult, isStaticHandler = false, skipLoaderErrorBubbling = false) {
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : void 0;
  matches.forEach((match) => {
    if (!(match.route.id in results)) {
      return;
    }
    let id = match.route.id;
    let result = results[id];
    invariant(
      !isRedirectResult(result),
      "Cannot handle redirect results in processLoaderData"
    );
    if (isErrorResult(result)) {
      let error = result.error;
      if (pendingError !== void 0) {
        error = pendingError;
        pendingError = void 0;
      }
      errors = errors || {};
      if (skipLoaderErrorBubbling) {
        errors[id] = error;
      } else {
        let boundaryMatch = findNearestBoundary(matches, id);
        if (errors[boundaryMatch.route.id] == null) {
          errors[boundaryMatch.route.id] = error;
        }
      }
      if (!isStaticHandler) {
        loaderData[id] = ResetLoaderDataSymbol;
      }
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      loaderData[id] = result.data;
      if (result.statusCode && result.statusCode !== 200 && !foundError) {
        statusCode = result.statusCode;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    }
  });
  if (pendingError !== void 0 && pendingActionResult) {
    errors = { [pendingActionResult[0]]: pendingError };
    if (pendingActionResult[2]) {
      loaderData[pendingActionResult[2]] = void 0;
    }
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, results, pendingActionResult, revalidatingFetchers, fetcherResults) {
  let { loaderData, errors } = processRouteLoaderData(
    matches,
    results,
    pendingActionResult
  );
  revalidatingFetchers.filter((f) => !f.matches || f.matches.some((m) => m.shouldLoad)).forEach((rf) => {
    let { key, match, controller } = rf;
    if (controller && controller.signal.aborted) {
      return;
    }
    let result = fetcherResults[key];
    invariant(result, "Did not find corresponding fetcher result");
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, match?.route.id);
      if (!(errors && errors[boundaryMatch.route.id])) {
        errors = {
          ...errors,
          [boundaryMatch.route.id]: result.error
        };
      }
      state.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      invariant(false, "Unhandled fetcher revalidation redirect");
    } else {
      let doneFetcher = getDoneFetcher(result.data);
      state.fetchers.set(key, doneFetcher);
    }
  });
  return { loaderData, errors };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
  let mergedLoaderData = Object.entries(newLoaderData).filter(([, v]) => v !== ResetLoaderDataSymbol).reduce((merged, [k, v]) => {
    merged[k] = v;
    return merged;
  }, {});
  for (let match of matches) {
    let id = match.route.id;
    if (!newLoaderData.hasOwnProperty(id) && loaderData.hasOwnProperty(id) && match.route.loader) {
      mergedLoaderData[id] = loaderData[id];
    }
    if (errors && errors.hasOwnProperty(id)) {
      break;
    }
  }
  return mergedLoaderData;
}
function getActionDataForCommit(pendingActionResult) {
  if (!pendingActionResult) {
    return {};
  }
  return isErrorResult(pendingActionResult[1]) ? {
    // Clear out prior actionData on errors
    actionData: {}
  } : {
    actionData: {
      [pendingActionResult[0]]: pendingActionResult[1].data
    }
  };
}
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find((m) => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes) {
  let route = routes.length === 1 ? routes[0] : routes.find((r) => r.index || !r.path || r.path === "/") || {
    id: `__shim-error-route__`
  };
  return {
    matches: [
      {
        params: {},
        pathname: "",
        pathnameBase: "",
        route
      }
    ],
    route
  };
}
function getInternalRouterError(status, {
  pathname,
  routeId,
  method,
  type,
  message
} = {}) {
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = `You made a ${method} request to "${pathname}" but did not provide a \`loader\` for route "${routeId}", so there is no way to handle the request.`;
    } else if (type === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = `Route "${routeId}" does not match URL "${pathname}"`;
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = `No route matches URL "${pathname}"`;
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = `You made a ${method.toUpperCase()} request to "${pathname}" but did not provide an \`action\` for route "${routeId}", so there is no way to handle the request.`;
    } else if (method) {
      errorMessage = `Invalid request method "${method.toUpperCase()}"`;
    }
  }
  return new ErrorResponseImpl(
    status || 500,
    statusText,
    new Error(errorMessage),
    true
  );
}
function findRedirect(results) {
  let entries = Object.entries(results);
  for (let i = entries.length - 1; i >= 0; i--) {
    let [key, result] = entries[i];
    if (isRedirectResult(result)) {
      return { key, result };
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath({ ...parsedPath, hash: "" });
}
function isHashChangeOnly(a, b) {
  if (a.pathname !== b.pathname || a.search !== b.search) {
    return false;
  }
  if (a.hash === "") {
    return b.hash !== "";
  } else if (a.hash === b.hash) {
    return true;
  } else if (b.hash !== "") {
    return true;
  }
  return false;
}
function dataWithResponseInitToResponse(data2) {
  return Response.json(data2.data, data2.init ?? void 0);
}
function dataWithResponseInitToErrorResponse(data2) {
  return new ErrorResponseImpl(
    data2.init?.status ?? 500,
    data2.init?.statusText ?? "Internal Server Error",
    data2.data
  );
}
function isDataStrategyResults(result) {
  return result != null && typeof result === "object" && Object.entries(result).every(
    ([key, value]) => typeof key === "string" && isDataStrategyResult(value)
  );
}
function isDataStrategyResult(result) {
  return result != null && typeof result === "object" && "type" in result && "result" in result && (result.type === "data" /* data */ || result.type === "error" /* error */);
}
function isRedirectDataStrategyResult(result) {
  return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
}
function isErrorResult(result) {
  return result.type === "error" /* error */;
}
function isRedirectResult(result) {
  return (result && result.type) === "redirect" /* redirect */;
}
function isDataWithResponseInit(value) {
  return typeof value === "object" && value != null && "type" in value && "data" in value && "init" in value && value.type === "DataWithResponseInit";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectStatusCode(statusCode) {
  return redirectStatusCodes.has(statusCode);
}
function isRedirectResponse(result) {
  return isResponse(result) && isRedirectStatusCode(result.status) && result.headers.has("Location");
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toUpperCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toUpperCase());
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some((v) => v === "");
}
function getTargetMatch(matches, location) {
  let search = typeof location === "string" ? parsePath(location).search : location.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    return matches[matches.length - 1];
  }
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
  let { formMethod, formAction, formEncType, text, formData, json } = navigation;
  if (!formMethod || !formAction || !formEncType) {
    return;
  }
  if (text != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: void 0,
      json: void 0,
      text
    };
  } else if (formData != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData,
      json: void 0,
      text: void 0
    };
  } else if (json !== void 0) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: void 0,
      json,
      text: void 0
    };
  }
}
function getLoadingNavigation(location, submission) {
  if (submission) {
    let navigation = {
      state: "loading",
      location,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  } else {
    let navigation = {
      state: "loading",
      location,
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0
    };
    return navigation;
  }
}
function getSubmittingNavigation(location, submission) {
  let navigation = {
    state: "submitting",
    location,
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text
  };
  return navigation;
}
function getLoadingFetcher(submission, data2) {
  if (submission) {
    let fetcher = {
      state: "loading",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data: data2
    };
    return fetcher;
  } else {
    let fetcher = {
      state: "loading",
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0,
      data: data2
    };
    return fetcher;
  }
}
function getSubmittingFetcher(submission, existingFetcher) {
  let fetcher = {
    state: "submitting",
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text,
    data: existingFetcher ? existingFetcher.data : void 0
  };
  return fetcher;
}
function getDoneFetcher(data2) {
  let fetcher = {
    state: "idle",
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data: data2
  };
  return fetcher;
}
function restoreAppliedTransitions(_window, transitions) {
  try {
    let sessionPositions = _window.sessionStorage.getItem(
      TRANSITIONS_STORAGE_KEY
    );
    if (sessionPositions) {
      let json = JSON.parse(sessionPositions);
      for (let [k, v] of Object.entries(json || {})) {
        if (v && Array.isArray(v)) {
          transitions.set(k, new Set(v || []));
        }
      }
    }
  } catch (e) {
  }
}
function persistAppliedTransitions(_window, transitions) {
  if (transitions.size > 0) {
    let json = {};
    for (let [k, v] of transitions) {
      json[k] = [...v];
    }
    try {
      _window.sessionStorage.setItem(
        TRANSITIONS_STORAGE_KEY,
        JSON.stringify(json)
      );
    } catch (error) {
      warning(
        false,
        `Failed to save applied view transitions in sessionStorage (${error}).`
      );
    }
  }
}
function createDeferred() {
  let resolve;
  let reject;
  let promise = new Promise((res, rej) => {
    resolve = async (val) => {
      res(val);
      try {
        await promise;
      } catch (e) {
      }
    };
    reject = async (error) => {
      rej(error);
      try {
        await promise;
      } catch (e) {
      }
    };
  });
  return {
    promise,
    //@ts-ignore
    resolve,
    //@ts-ignore
    reject
  };
}

// lib/context.ts

var DataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
DataRouterContext.displayName = "DataRouter";
var DataRouterStateContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
DataRouterStateContext.displayName = "DataRouterState";
var RSCRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(false);
function useIsRSCRouterContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(RSCRouterContext);
}
var ViewTransitionContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  isTransitioning: false
});
ViewTransitionContext.displayName = "ViewTransition";
var FetchersContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(
  /* @__PURE__ */ new Map()
);
FetchersContext.displayName = "Fetchers";
var AwaitContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
AwaitContext.displayName = "Await";
var AwaitContextProvider = (props) => react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, props);
var NavigationContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(
  null
);
NavigationContext.displayName = "Navigation";
var LocationContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(
  null
);
LocationContext.displayName = "Location";
var RouteContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
RouteContext.displayName = "Route";
var RouteErrorContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
RouteErrorContext.displayName = "RouteError";
var ENABLE_DEV_WARNINGS = true;

// lib/hooks.tsx


// lib/errors.ts
var ERROR_DIGEST_BASE = "REACT_ROUTER_ERROR";
var ERROR_DIGEST_REDIRECT = "REDIRECT";
var ERROR_DIGEST_ROUTE_ERROR_RESPONSE = "ROUTE_ERROR_RESPONSE";
function decodeRedirectErrorDigest(digest) {
  if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_REDIRECT}:{`)) {
    try {
      let parsed = JSON.parse(digest.slice(28));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string" && typeof parsed.location === "string" && typeof parsed.reloadDocument === "boolean" && typeof parsed.replace === "boolean") {
        return parsed;
      }
    } catch {
    }
  }
}
function decodeRouteErrorResponseDigest(digest) {
  if (digest.startsWith(
    `${ERROR_DIGEST_BASE}:${ERROR_DIGEST_ROUTE_ERROR_RESPONSE}:{`
  )) {
    try {
      let parsed = JSON.parse(digest.slice(40));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string") {
        return new ErrorResponseImpl(
          parsed.status,
          parsed.statusText,
          parsed.data
        );
      }
    } catch {
    }
  }
}

// lib/hooks.tsx
function useHref(to, { relative } = {}) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useHref() may be used only in the context of a <Router> component.`
  );
  let { basename, navigator } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to, { relative });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({ pathname: joinedPathname, search, hash });
}
function useInRouterContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext) != null;
}
function useLocation() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useLocation() may be used only in the context of a <Router> component.`
  );
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext).location;
}
function useNavigationType() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext).navigationType;
}
function useMatch(pattern) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useMatch() may be used only in the context of a <Router> component.`
  );
  let { pathname } = useLocation();
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => matchPath(pattern, decodePath(pathname)),
    [pathname, pattern]
  );
}
var navigateEffectWarning = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
function useIsomorphicLayoutEffect(cb) {
  let isStatic = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext).static;
  if (!isStatic) {
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let { isDataRoute } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  let { basename, navigator } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let { matches } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  let activeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        navigator.go(to);
        return;
      }
      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname,
        options.relative === "path"
      );
      if (dataRouterContext == null && basename !== "/") {
        path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
      }
      (!!options.replace ? navigator.replace : navigator.push)(
        path,
        options.state,
        options
      );
    },
    [
      basename,
      navigator,
      routePathnamesJson,
      locationPathname,
      dataRouterContext
    ]
  );
  return navigate;
}
var OutletContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
function useOutletContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(OutletContext);
}
function useOutlet(context) {
  let outlet = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext).outlet;
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => outlet && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(OutletContext.Provider, { value: context }, outlet),
    [outlet, context]
  );
}
function useParams() {
  let { matches } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useResolvedPath(to, { relative } = {}) {
  let { matches } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => resolveTo(
      to,
      JSON.parse(routePathnamesJson),
      locationPathname,
      relative === "path"
    ),
    [to, routePathnamesJson, locationPathname, relative]
  );
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, onError, future) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );
  let { navigator } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let { matches: parentMatches } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  if (ENABLE_DEV_WARNINGS) {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(
      parentPathname,
      !parentRoute || parentPath.endsWith("*") || parentPath.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${parentPathname}" (under <Route path="${parentPath}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`
    );
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    invariant(
      parentPathnameBase === "/" || parsedLocationArg.pathname?.startsWith(parentPathnameBase),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${parentPathnameBase}" but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
    );
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, { pathname: remainingPathname });
  if (ENABLE_DEV_WARNINGS) {
    warning(
      parentRoute || matches != null,
      `No routes matched location "${location.pathname}${location.search}${location.hash}" `
    );
    warning(
      matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    );
  }
  let renderedMatches = _renderMatches(
    matches && matches.map(
      (match) => Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          navigator.encodeLocation ? navigator.encodeLocation(
            match.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : match.pathname
        ]),
        pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          navigator.encodeLocation ? navigator.encodeLocation(
            match.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : match.pathnameBase
        ])
      })
    ),
    parentMatches,
    dataRouterState,
    onError,
    future
  );
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      LocationContext.Provider,
      {
        value: {
          location: {
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default",
            ...location
          },
          navigationType: "POP" /* Pop */
        }
      },
      renderedMatches
    );
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = { padding: "0.5rem", backgroundColor: lightgrey };
  let codeStyles = { padding: "2px 4px", backgroundColor: lightgrey };
  let devInfo = null;
  if (ENABLE_DEV_WARNINGS) {
    console.error(
      "Error handled by React Router default ErrorBoundary:",
      error
    );
    devInfo = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\u{1F4BF} Hey developer \u{1F44B}"), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("code", { style: codeStyles }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("code", { style: codeStyles }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre", { style: preStyles }, stack) : null, devInfo);
}
var defaultErrorElement = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultErrorComponent, null);
var RenderErrorBoundary = class extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error(
        "React Router caught the following error during render",
        error
      );
    }
  }
  render() {
    let error = this.state.error;
    if (this.context && typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
      const decoded = decodeRouteErrorResponseDigest(error.digest);
      if (decoded) error = decoded;
    }
    let result = error !== void 0 ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      RouteErrorContext.Provider,
      {
        value: error,
        children: this.props.component
      }
    )) : this.props.children;
    if (this.context) {
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(RSCErrorHandler, { error }, result);
    }
    return result;
  }
};
RenderErrorBoundary.contextType = RSCRouterContext;
var errorRedirectHandledMap = /* @__PURE__ */ new WeakMap();
function RSCErrorHandler({
  children,
  error
}) {
  let { basename } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
    let redirect2 = decodeRedirectErrorDigest(error.digest);
    if (redirect2) {
      let existingRedirect = errorRedirectHandledMap.get(error);
      if (existingRedirect) throw existingRedirect;
      let parsed = parseToInfo(redirect2.location, basename);
      if (isBrowser && !errorRedirectHandledMap.get(error)) {
        if (parsed.isExternal || redirect2.reloadDocument) {
          window.location.href = parsed.absoluteURL || parsed.to;
        } else {
          const redirectPromise = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(parsed.to, {
              replace: redirect2.replace
            })
          );
          errorRedirectHandledMap.set(error, redirectPromise);
          throw redirectPromise;
        }
      }
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
        "meta",
        {
          httpEquiv: "refresh",
          content: `0;url=${parsed.absoluteURL || parsed.to}`
        }
      );
    }
  }
  return children;
}
function RenderedRoute({ routeContext, match, children }) {
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterState = null, onErrorHandler = null, future = null) {
  if (matches == null) {
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = dataRouterState?.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(
      (m) => m.route.id && errors?.[m.route.id] !== void 0
    );
    invariant(
      errorIndex >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        errors
      ).join(",")}`
    );
    renderedMatches = renderedMatches.slice(
      0,
      Math.min(renderedMatches.length, errorIndex + 1)
    );
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let { loaderData, errors: errors2 } = dataRouterState;
        let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  let onError = dataRouterState && onErrorHandler ? (error, errorInfo) => {
    onErrorHandler(error, {
      location: dataRouterState.location,
      params: dataRouterState.matches?.[0]?.params ?? {},
      unstable_pattern: getRoutePattern(dataRouterState.matches),
      errorInfo
    });
  } : void 0;
  return renderedMatches.reduceRight(
    (outlet, match, index) => {
      let error;
      let shouldRenderHydrateFallback = false;
      let errorElement = null;
      let hydrateFallbackElement = null;
      if (dataRouterState) {
        error = errors && match.route.id ? errors[match.route.id] : void 0;
        errorElement = match.route.errorElement || defaultErrorElement;
        if (renderFallback) {
          if (fallbackIndex < 0 && index === 0) {
            warningOnce(
              "route-fallback",
              false,
              "No `HydrateFallback` element provided to render during initial hydration"
            );
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = null;
          } else if (fallbackIndex === index) {
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = match.route.hydrateFallbackElement || null;
          }
        }
      }
      let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
      let getChildren = () => {
        let children;
        if (error) {
          children = errorElement;
        } else if (shouldRenderHydrateFallback) {
          children = hydrateFallbackElement;
        } else if (match.route.Component) {
          children = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(match.route.Component, null);
        } else if (match.route.element) {
          children = match.route.element;
        } else {
          children = outlet;
        }
        return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
          RenderedRoute,
          {
            match,
            routeContext: {
              outlet,
              matches: matches2,
              isDataRoute: dataRouterState != null
            },
            children
          }
        );
      };
      return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
        RenderErrorBoundary,
        {
          location: dataRouterState.location,
          revalidation: dataRouterState.revalidation,
          component: errorElement,
          error,
          children: getChildren(),
          routeContext: { outlet: null, matches: matches2, isDataRoute: true },
          onError
        }
      ) : getChildren();
    },
    null
  );
}
function getDataRouterConsoleError(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
  let ctx = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError(hookName));
  return ctx;
}
function useDataRouterState(hookName) {
  let state = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterStateContext);
  invariant(state, getDataRouterConsoleError(hookName));
  return state;
}
function useRouteContext(hookName) {
  let route = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  invariant(route, getDataRouterConsoleError(hookName));
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  invariant(
    thisRoute.route.id,
    `${hookName} can only be used on routes that contain a unique "id"`
  );
  return thisRoute.route.id;
}
function useRouteId() {
  return useCurrentRouteId("useRouteId" /* UseRouteId */);
}
function useNavigation() {
  let state = useDataRouterState("useNavigation" /* UseNavigation */);
  return state.navigation;
}
function useRevalidator() {
  let dataRouterContext = useDataRouterContext("useRevalidator" /* UseRevalidator */);
  let state = useDataRouterState("useRevalidator" /* UseRevalidator */);
  let revalidate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(async () => {
    await dataRouterContext.router.revalidate();
  }, [dataRouterContext.router]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => ({ revalidate, state: state.revalidation }),
    [revalidate, state.revalidation]
  );
}
function useMatches() {
  let { matches, loaderData } = useDataRouterState(
    "useMatches" /* UseMatches */
  );
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => matches.map((m) => convertRouteMatchToUiMatch(m, loaderData)),
    [matches, loaderData]
  );
}
function useLoaderData() {
  let state = useDataRouterState("useLoaderData" /* UseLoaderData */);
  let routeId = useCurrentRouteId("useLoaderData" /* UseLoaderData */);
  return state.loaderData[routeId];
}
function useRouteLoaderData(routeId) {
  let state = useDataRouterState("useRouteLoaderData" /* UseRouteLoaderData */);
  return state.loaderData[routeId];
}
function useActionData() {
  let state = useDataRouterState("useActionData" /* UseActionData */);
  let routeId = useCurrentRouteId("useLoaderData" /* UseLoaderData */);
  return state.actionData ? state.actionData[routeId] : void 0;
}
function useRouteError() {
  let error = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteErrorContext);
  let state = useDataRouterState("useRouteError" /* UseRouteError */);
  let routeId = useCurrentRouteId("useRouteError" /* UseRouteError */);
  if (error !== void 0) {
    return error;
  }
  return state.errors?.[routeId];
}
function useAsyncValue() {
  let value = react__WEBPACK_IMPORTED_MODULE_0__.useContext(AwaitContext);
  return value?._data;
}
function useAsyncError() {
  let value = react__WEBPACK_IMPORTED_MODULE_0__.useContext(AwaitContext);
  return value?._error;
}
var blockerId = 0;
function useBlocker(shouldBlock) {
  let { router, basename } = useDataRouterContext("useBlocker" /* UseBlocker */);
  let state = useDataRouterState("useBlocker" /* UseBlocker */);
  let [blockerKey, setBlockerKey] = react__WEBPACK_IMPORTED_MODULE_0__.useState("");
  let blockerFunction = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (arg) => {
      if (typeof shouldBlock !== "function") {
        return !!shouldBlock;
      }
      if (basename === "/") {
        return shouldBlock(arg);
      }
      let { currentLocation, nextLocation, historyAction } = arg;
      return shouldBlock({
        currentLocation: {
          ...currentLocation,
          pathname: stripBasename(currentLocation.pathname, basename) || currentLocation.pathname
        },
        nextLocation: {
          ...nextLocation,
          pathname: stripBasename(nextLocation.pathname, basename) || nextLocation.pathname
        },
        historyAction
      });
    },
    [basename, shouldBlock]
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let key = String(++blockerId);
    setBlockerKey(key);
    return () => router.deleteBlocker(key);
  }, [router]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blockerKey !== "") {
      router.getBlocker(blockerKey, blockerFunction);
    }
  }, [router, blockerKey, blockerFunction]);
  return blockerKey && state.blockers.has(blockerKey) ? state.blockers.get(blockerKey) : IDLE_BLOCKER;
}
function useNavigateStable() {
  let { router } = useDataRouterContext("useNavigate" /* UseNavigateStable */);
  let id = useCurrentRouteId("useNavigate" /* UseNavigateStable */);
  let activeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    async (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        await router.navigate(to);
      } else {
        await router.navigate(to, { fromRouteId: id, ...options });
      }
    },
    [router, id]
  );
  return navigate;
}
var alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning(false, message);
  }
}
function useRoute(...args) {
  const currentRouteId = useCurrentRouteId(
    "useRoute" /* UseRoute */
  );
  const id = args[0] ?? currentRouteId;
  const state = useDataRouterState("useRoute" /* UseRoute */);
  const route = state.matches.find(({ route: route2 }) => route2.id === id);
  if (route === void 0) return void 0;
  return {
    handle: route.route.handle,
    loaderData: state.loaderData[id],
    actionData: state.actionData?.[id]
  };
}

// lib/components.tsx


// lib/server-runtime/warnings.ts
var alreadyWarned2 = {};
function warnOnce(condition, message) {
  if (!condition && !alreadyWarned2[message]) {
    alreadyWarned2[message] = true;
    console.warn(message);
  }
}

// lib/components.tsx
var USE_OPTIMISTIC = "useOptimistic";
var useOptimisticImpl = /*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2)))[USE_OPTIMISTIC];
var stableUseOptimisticSetter = () => void 0;
function useOptimisticSafe(val) {
  if (useOptimisticImpl) {
    return useOptimisticImpl(val);
  } else {
    return [val, stableUseOptimisticSetter];
  }
}
function mapRouteProperties(route) {
  let updates = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: route.hasErrorBoundary || route.ErrorBoundary != null || route.errorElement != null
  };
  if (route.Component) {
    if (ENABLE_DEV_WARNINGS) {
      if (route.element) {
        warning(
          false,
          "You should not include both `Component` and `element` on your route - `Component` will be used."
        );
      }
    }
    Object.assign(updates, {
      element: react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.Component),
      Component: void 0
    });
  }
  if (route.HydrateFallback) {
    if (ENABLE_DEV_WARNINGS) {
      if (route.hydrateFallbackElement) {
        warning(
          false,
          "You should not include both `HydrateFallback` and `hydrateFallbackElement` on your route - `HydrateFallback` will be used."
        );
      }
    }
    Object.assign(updates, {
      hydrateFallbackElement: react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.HydrateFallback),
      HydrateFallback: void 0
    });
  }
  if (route.ErrorBoundary) {
    if (ENABLE_DEV_WARNINGS) {
      if (route.errorElement) {
        warning(
          false,
          "You should not include both `ErrorBoundary` and `errorElement` on your route - `ErrorBoundary` will be used."
        );
      }
    }
    Object.assign(updates, {
      errorElement: react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.ErrorBoundary),
      ErrorBoundary: void 0
    });
  }
  return updates;
}
var hydrationRouteProperties = [
  "HydrateFallback",
  "hydrateFallbackElement"
];
function createMemoryRouter(routes, opts) {
  return createRouter({
    basename: opts?.basename,
    getContext: opts?.getContext,
    future: opts?.future,
    history: createMemoryHistory({
      initialEntries: opts?.initialEntries,
      initialIndex: opts?.initialIndex
    }),
    hydrationData: opts?.hydrationData,
    routes,
    hydrationRouteProperties,
    mapRouteProperties,
    dataStrategy: opts?.dataStrategy,
    patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
    unstable_instrumentations: opts?.unstable_instrumentations
  }).initialize();
}
var Deferred = class {
  constructor() {
    this.status = "pending";
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (value) => {
        if (this.status === "pending") {
          this.status = "resolved";
          resolve(value);
        }
      };
      this.reject = (reason) => {
        if (this.status === "pending") {
          this.status = "rejected";
          reject(reason);
        }
      };
    });
  }
};
function RouterProvider({
  router,
  flushSync: reactDomFlushSyncImpl,
  onError,
  unstable_useTransitions
}) {
  let unstable_rsc = useIsRSCRouterContext();
  unstable_useTransitions = unstable_rsc || unstable_useTransitions;
  let [_state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState(router.state);
  let [state, setOptimisticState] = useOptimisticSafe(_state);
  let [pendingState, setPendingState] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  let [vtContext, setVtContext] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    isTransitioning: false
  });
  let [renderDfd, setRenderDfd] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  let [transition, setTransition] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  let [interruption, setInterruption] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  let fetcherData = react__WEBPACK_IMPORTED_MODULE_0__.useRef(/* @__PURE__ */ new Map());
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (newState, { deletedFetchers, newErrors, flushSync, viewTransitionOpts }) => {
      if (newErrors && onError) {
        Object.values(newErrors).forEach(
          (error) => onError(error, {
            location: newState.location,
            params: newState.matches[0]?.params ?? {},
            unstable_pattern: getRoutePattern(newState.matches)
          })
        );
      }
      newState.fetchers.forEach((fetcher, key) => {
        if (fetcher.data !== void 0) {
          fetcherData.current.set(key, fetcher.data);
        }
      });
      deletedFetchers.forEach((key) => fetcherData.current.delete(key));
      warnOnce(
        flushSync === false || reactDomFlushSyncImpl != null,
        'You provided the `flushSync` option to a router update, but you are not using the `<RouterProvider>` from `react-router/dom` so `ReactDOM.flushSync()` is unavailable.  Please update your app to `import { RouterProvider } from "react-router/dom"` and ensure you have `react-dom` installed as a dependency to use the `flushSync` option.'
      );
      let isViewTransitionAvailable = router.window != null && router.window.document != null && typeof router.window.document.startViewTransition === "function";
      warnOnce(
        viewTransitionOpts == null || isViewTransitionAvailable,
        "You provided the `viewTransition` option to a router update, but you do not appear to be running in a DOM environment as `window.startViewTransition` is not available."
      );
      if (!viewTransitionOpts || !isViewTransitionAvailable) {
        if (reactDomFlushSyncImpl && flushSync) {
          reactDomFlushSyncImpl(() => setStateImpl(newState));
        } else if (unstable_useTransitions === false) {
          setStateImpl(newState);
        } else {
          react__WEBPACK_IMPORTED_MODULE_0__.startTransition(() => {
            if (unstable_useTransitions === true) {
              setOptimisticState((s) => getOptimisticRouterState(s, newState));
            }
            setStateImpl(newState);
          });
        }
        return;
      }
      if (reactDomFlushSyncImpl && flushSync) {
        reactDomFlushSyncImpl(() => {
          if (transition) {
            renderDfd?.resolve();
            transition.skipTransition();
          }
          setVtContext({
            isTransitioning: true,
            flushSync: true,
            currentLocation: viewTransitionOpts.currentLocation,
            nextLocation: viewTransitionOpts.nextLocation
          });
        });
        let t = router.window.document.startViewTransition(() => {
          reactDomFlushSyncImpl(() => setStateImpl(newState));
        });
        t.finished.finally(() => {
          reactDomFlushSyncImpl(() => {
            setRenderDfd(void 0);
            setTransition(void 0);
            setPendingState(void 0);
            setVtContext({ isTransitioning: false });
          });
        });
        reactDomFlushSyncImpl(() => setTransition(t));
        return;
      }
      if (transition) {
        renderDfd?.resolve();
        transition.skipTransition();
        setInterruption({
          state: newState,
          currentLocation: viewTransitionOpts.currentLocation,
          nextLocation: viewTransitionOpts.nextLocation
        });
      } else {
        setPendingState(newState);
        setVtContext({
          isTransitioning: true,
          flushSync: false,
          currentLocation: viewTransitionOpts.currentLocation,
          nextLocation: viewTransitionOpts.nextLocation
        });
      }
    },
    [
      router.window,
      reactDomFlushSyncImpl,
      transition,
      renderDfd,
      unstable_useTransitions,
      setOptimisticState,
      onError
    ]
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => router.subscribe(setState), [router, setState]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (vtContext.isTransitioning && !vtContext.flushSync) {
      setRenderDfd(new Deferred());
    }
  }, [vtContext]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (renderDfd && pendingState && router.window) {
      let newState = pendingState;
      let renderPromise = renderDfd.promise;
      let transition2 = router.window.document.startViewTransition(async () => {
        if (unstable_useTransitions === false) {
          setStateImpl(newState);
        } else {
          react__WEBPACK_IMPORTED_MODULE_0__.startTransition(() => {
            if (unstable_useTransitions === true) {
              setOptimisticState((s) => getOptimisticRouterState(s, newState));
            }
            setStateImpl(newState);
          });
        }
        await renderPromise;
      });
      transition2.finished.finally(() => {
        setRenderDfd(void 0);
        setTransition(void 0);
        setPendingState(void 0);
        setVtContext({ isTransitioning: false });
      });
      setTransition(transition2);
    }
  }, [
    pendingState,
    renderDfd,
    router.window,
    unstable_useTransitions,
    setOptimisticState
  ]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (renderDfd && pendingState && state.location.key === pendingState.location.key) {
      renderDfd.resolve();
    }
  }, [renderDfd, transition, state.location, pendingState]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!vtContext.isTransitioning && interruption) {
      setPendingState(interruption.state);
      setVtContext({
        isTransitioning: true,
        flushSync: false,
        currentLocation: interruption.currentLocation,
        nextLocation: interruption.nextLocation
      });
      setInterruption(void 0);
    }
  }, [vtContext.isTransitioning, interruption]);
  let navigator = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return {
      createHref: router.createHref,
      encodeLocation: router.encodeLocation,
      go: (n) => router.navigate(n),
      push: (to, state2, opts) => router.navigate(to, {
        state: state2,
        preventScrollReset: opts?.preventScrollReset
      }),
      replace: (to, state2, opts) => router.navigate(to, {
        replace: true,
        state: state2,
        preventScrollReset: opts?.preventScrollReset
      })
    };
  }, [router]);
  let basename = router.basename || "/";
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => ({
      router,
      navigator,
      static: false,
      basename,
      onError
    }),
    [router, navigator, basename, onError]
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRouterContext.Provider, { value: dataRouterContext }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRouterStateContext.Provider, { value: state }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(FetchersContext.Provider, { value: fetcherData.current }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ViewTransitionContext.Provider, { value: vtContext }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    Router,
    {
      basename,
      location: state.location,
      navigationType: state.historyAction,
      navigator,
      unstable_useTransitions
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      MemoizedDataRoutes,
      {
        routes: router.routes,
        future: router.future,
        state,
        onError
      }
    )
  ))))), null);
}
function getOptimisticRouterState(currentState, newState) {
  return {
    // Don't surface "current location specific" stuff mid-navigation
    // (historyAction, location, matches, loaderData, errors, initialized,
    // restoreScroll, preventScrollReset, blockers, etc.)
    ...currentState,
    // Only surface "pending/in-flight stuff"
    // (navigation, revalidation, actionData, fetchers, )
    navigation: newState.navigation.state !== "idle" ? newState.navigation : currentState.navigation,
    revalidation: newState.revalidation !== "idle" ? newState.revalidation : currentState.revalidation,
    actionData: newState.navigation.state !== "submitting" ? newState.actionData : currentState.actionData,
    fetchers: newState.fetchers
  };
}
var MemoizedDataRoutes = react__WEBPACK_IMPORTED_MODULE_0__.memo(DataRoutes);
function DataRoutes({
  routes,
  future,
  state,
  onError
}) {
  return useRoutesImpl(routes, void 0, state, onError, future);
}
function MemoryRouter({
  basename,
  children,
  initialEntries,
  initialIndex,
  unstable_useTransitions
}) {
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory({
      initialEntries,
      initialIndex,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        react__WEBPACK_IMPORTED_MODULE_0__.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
function Navigate({
  to,
  replace: replace2,
  state,
  relative
}) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    `<Navigate> may be used only in the context of a <Router> component.`
  );
  let { static: isStatic } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  warning(
    !isStatic,
    `<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.`
  );
  let { matches } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(
    to,
    getResolveToMatches(matches),
    locationPathname,
    relative === "path"
  );
  let jsonPath = JSON.stringify(path);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    navigate(JSON.parse(jsonPath), { replace: replace2, state, relative });
  }, [navigate, jsonPath, relative, replace2, state]);
  return null;
}
function Outlet(props) {
  return useOutlet(props.context);
}
function Route(props) {
  invariant(
    false,
    `A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.`
  );
}
function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = "POP" /* Pop */,
  navigator,
  static: staticProp = false,
  unstable_useTransitions
}) {
  invariant(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`
  );
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => ({
      basename,
      navigator,
      static: staticProp,
      unstable_useTransitions,
      future: {}
    }),
    [basename, navigator, staticProp, unstable_useTransitions]
  );
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  warning(
    locationContext != null,
    `<Router basename="${basename}"> is not able to match the URL "${pathname}${search}${hash}" because it does not start with the basename, so the <Router> won't render anything.`
  );
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(NavigationContext.Provider, { value: navigationContext }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(LocationContext.Provider, { children, value: locationContext }));
}
function Routes({
  children,
  location
}) {
  return useRoutes(createRoutesFromChildren(children), location);
}
function Await({
  children,
  errorElement,
  resolve
}) {
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  let dataRouterStateContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterStateContext);
  let onError = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (error, errorInfo) => {
      if (dataRouterContext && dataRouterContext.onError && dataRouterStateContext) {
        dataRouterContext.onError(error, {
          location: dataRouterStateContext.location,
          params: dataRouterStateContext.matches[0]?.params || {},
          unstable_pattern: getRoutePattern(dataRouterStateContext.matches),
          errorInfo
        });
      }
    },
    [dataRouterContext, dataRouterStateContext]
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    AwaitErrorBoundary,
    {
      resolve,
      errorElement,
      onError
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ResolveAwait, null, children)
  );
}
var AwaitErrorBoundary = class extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error(
        "<Await> caught the following error during render",
        error,
        errorInfo
      );
    }
  }
  render() {
    let { children, errorElement, resolve } = this.props;
    let promise = null;
    let status = 0 /* pending */;
    if (!(resolve instanceof Promise)) {
      status = 1 /* success */;
      promise = Promise.resolve();
      Object.defineProperty(promise, "_tracked", { get: () => true });
      Object.defineProperty(promise, "_data", { get: () => resolve });
    } else if (this.state.error) {
      status = 2 /* error */;
      let renderError = this.state.error;
      promise = Promise.reject().catch(() => {
      });
      Object.defineProperty(promise, "_tracked", { get: () => true });
      Object.defineProperty(promise, "_error", { get: () => renderError });
    } else if (resolve._tracked) {
      promise = resolve;
      status = "_error" in promise ? 2 /* error */ : "_data" in promise ? 1 /* success */ : 0 /* pending */;
    } else {
      status = 0 /* pending */;
      Object.defineProperty(resolve, "_tracked", { get: () => true });
      promise = resolve.then(
        (data2) => Object.defineProperty(resolve, "_data", { get: () => data2 }),
        (error) => {
          this.props.onError?.(error);
          Object.defineProperty(resolve, "_error", { get: () => error });
        }
      );
    }
    if (status === 2 /* error */ && !errorElement) {
      throw promise._error;
    }
    if (status === 2 /* error */) {
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, { value: promise, children: errorElement });
    }
    if (status === 1 /* success */) {
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, { value: promise, children });
    }
    throw promise;
  }
};
function ResolveAwait({
  children
}) {
  let data2 = useAsyncValue();
  let toRender = typeof children === "function" ? children(data2) : children;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, toRender);
}
function createRoutesFromChildren(children, parentPath = []) {
  let routes = [];
  react__WEBPACK_IMPORTED_MODULE_0__.Children.forEach(children, (element, index) => {
    if (!react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === react__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children, treePath)
      );
      return;
    }
    invariant(
      element.type === Route,
      `[${typeof element.type === "string" ? element.type : element.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    );
    invariant(
      !element.props.index || !element.props.children,
      "An index route cannot have child routes."
    );
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      middleware: element.props.middleware,
      loader: element.props.loader,
      action: element.props.action,
      hydrateFallbackElement: element.props.hydrateFallbackElement,
      HydrateFallback: element.props.HydrateFallback,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.hasErrorBoundary === true || element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(
        element.props.children,
        treePath
      );
    }
    routes.push(route);
  });
  return routes;
}
var createRoutesFromElements = createRoutesFromChildren;
function renderMatches(matches) {
  return _renderMatches(matches);
}
function useRouteComponentProps() {
  return {
    params: useParams(),
    loaderData: useLoaderData(),
    actionData: useActionData(),
    matches: useMatches()
  };
}
function WithComponentProps({
  children
}) {
  const props = useRouteComponentProps();
  return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, props);
}
function withComponentProps(Component4) {
  return function WithComponentProps2() {
    const props = useRouteComponentProps();
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component4, props);
  };
}
function useHydrateFallbackProps() {
  return {
    params: useParams(),
    loaderData: useLoaderData(),
    actionData: useActionData()
  };
}
function WithHydrateFallbackProps({
  children
}) {
  const props = useHydrateFallbackProps();
  return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, props);
}
function withHydrateFallbackProps(HydrateFallback) {
  return function WithHydrateFallbackProps2() {
    const props = useHydrateFallbackProps();
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(HydrateFallback, props);
  };
}
function useErrorBoundaryProps() {
  return {
    params: useParams(),
    loaderData: useLoaderData(),
    actionData: useActionData(),
    error: useRouteError()
  };
}
function WithErrorBoundaryProps({
  children
}) {
  const props = useErrorBoundaryProps();
  return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, props);
}
function withErrorBoundaryProps(ErrorBoundary) {
  return function WithErrorBoundaryProps2() {
    const props = useErrorBoundaryProps();
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ErrorBoundary, props);
  };
}

// lib/dom/dom.ts
var defaultMethod = "get";
var defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return typeof HTMLElement !== "undefined" && object instanceof HTMLElement;
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
function createSearchParams(init = "") {
  return new URLSearchParams(
    typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo2, key) => {
      let value = init[key];
      return memo2.concat(
        Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]
      );
    }, [])
  );
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
var _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
var supportedFormEncTypes = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    warning(
      false,
      `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`
    );
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error(
        `Cannot submit a <button> or <input type="submit"> without a <form>`
      );
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let { name, type, value } = target;
      if (type === "image") {
        let prefix = name ? `${name}.` : "";
        formData.append(`${prefix}x`, "0");
        formData.append(`${prefix}y`, "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error(
      `Cannot submit element that is not <form>, <button>, or <input type="submit|image">`
    );
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return { action, method: method.toLowerCase(), encType, formData, body };
}

// lib/dom/ssr/single-fetch.tsx


// vendor/turbo-stream-v2/utils.ts
var HOLE = -1;
var NAN = -2;
var NEGATIVE_INFINITY = -3;
var NEGATIVE_ZERO = -4;
var NULL = -5;
var POSITIVE_INFINITY = -6;
var UNDEFINED = -7;
var TYPE_BIGINT = "B";
var TYPE_DATE = "D";
var TYPE_ERROR = "E";
var TYPE_MAP = "M";
var TYPE_NULL_OBJECT = "N";
var TYPE_PROMISE = "P";
var TYPE_REGEXP = "R";
var TYPE_SET = "S";
var TYPE_SYMBOL = "Y";
var TYPE_URL = "U";
var TYPE_PREVIOUS_RESOLVED = "Z";
var Deferred2 = class {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
};
function createLineSplittingTransform() {
  const decoder = new TextDecoder();
  let leftover = "";
  return new TransformStream({
    transform(chunk, controller) {
      const str = decoder.decode(chunk, { stream: true });
      const parts = (leftover + str).split("\n");
      leftover = parts.pop() || "";
      for (const part of parts) {
        controller.enqueue(part);
      }
    },
    flush(controller) {
      if (leftover) {
        controller.enqueue(leftover);
      }
    }
  });
}

// vendor/turbo-stream-v2/flatten.ts
function flatten(input) {
  const { indices } = this;
  const existing = indices.get(input);
  if (existing) return [existing];
  if (input === void 0) return UNDEFINED;
  if (input === null) return NULL;
  if (Number.isNaN(input)) return NAN;
  if (input === Number.POSITIVE_INFINITY) return POSITIVE_INFINITY;
  if (input === Number.NEGATIVE_INFINITY) return NEGATIVE_INFINITY;
  if (input === 0 && 1 / input < 0) return NEGATIVE_ZERO;
  const index = this.index++;
  indices.set(input, index);
  stringify.call(this, input, index);
  return index;
}
function stringify(input, index) {
  const { deferred, plugins, postPlugins } = this;
  const str = this.stringified;
  const stack = [[input, index]];
  while (stack.length > 0) {
    const [input2, index2] = stack.pop();
    const partsForObj = (obj) => Object.keys(obj).map((k) => `"_${flatten.call(this, k)}":${flatten.call(this, obj[k])}`).join(",");
    let error = null;
    switch (typeof input2) {
      case "boolean":
      case "number":
      case "string":
        str[index2] = JSON.stringify(input2);
        break;
      case "bigint":
        str[index2] = `["${TYPE_BIGINT}","${input2}"]`;
        break;
      case "symbol": {
        const keyFor = Symbol.keyFor(input2);
        if (!keyFor) {
          error = new Error(
            "Cannot encode symbol unless created with Symbol.for()"
          );
        } else {
          str[index2] = `["${TYPE_SYMBOL}",${JSON.stringify(keyFor)}]`;
        }
        break;
      }
      case "object": {
        if (!input2) {
          str[index2] = `${NULL}`;
          break;
        }
        const isArray = Array.isArray(input2);
        let pluginHandled = false;
        if (!isArray && plugins) {
          for (const plugin of plugins) {
            const pluginResult = plugin(input2);
            if (Array.isArray(pluginResult)) {
              pluginHandled = true;
              const [pluginIdentifier, ...rest] = pluginResult;
              str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
              if (rest.length > 0) {
                str[index2] += `,${rest.map((v) => flatten.call(this, v)).join(",")}`;
              }
              str[index2] += "]";
              break;
            }
          }
        }
        if (!pluginHandled) {
          let result = isArray ? "[" : "{";
          if (isArray) {
            for (let i = 0; i < input2.length; i++)
              result += (i ? "," : "") + (i in input2 ? flatten.call(this, input2[i]) : HOLE);
            str[index2] = `${result}]`;
          } else if (input2 instanceof Date) {
            const dateTime = input2.getTime();
            str[index2] = `["${TYPE_DATE}",${Number.isNaN(dateTime) ? JSON.stringify("invalid") : dateTime}]`;
          } else if (input2 instanceof URL) {
            str[index2] = `["${TYPE_URL}",${JSON.stringify(input2.href)}]`;
          } else if (input2 instanceof RegExp) {
            str[index2] = `["${TYPE_REGEXP}",${JSON.stringify(
              input2.source
            )},${JSON.stringify(input2.flags)}]`;
          } else if (input2 instanceof Set) {
            if (input2.size > 0) {
              str[index2] = `["${TYPE_SET}",${[...input2].map((val) => flatten.call(this, val)).join(",")}]`;
            } else {
              str[index2] = `["${TYPE_SET}"]`;
            }
          } else if (input2 instanceof Map) {
            if (input2.size > 0) {
              str[index2] = `["${TYPE_MAP}",${[...input2].flatMap(([k, v]) => [
                flatten.call(this, k),
                flatten.call(this, v)
              ]).join(",")}]`;
            } else {
              str[index2] = `["${TYPE_MAP}"]`;
            }
          } else if (input2 instanceof Promise) {
            str[index2] = `["${TYPE_PROMISE}",${index2}]`;
            deferred[index2] = input2;
          } else if (input2 instanceof Error) {
            str[index2] = `["${TYPE_ERROR}",${JSON.stringify(input2.message)}`;
            if (input2.name !== "Error") {
              str[index2] += `,${JSON.stringify(input2.name)}`;
            }
            str[index2] += "]";
          } else if (Object.getPrototypeOf(input2) === null) {
            str[index2] = `["${TYPE_NULL_OBJECT}",{${partsForObj(input2)}}]`;
          } else if (isPlainObject2(input2)) {
            str[index2] = `{${partsForObj(input2)}}`;
          } else {
            error = new Error("Cannot encode object with prototype");
          }
        }
        break;
      }
      default: {
        const isArray = Array.isArray(input2);
        let pluginHandled = false;
        if (!isArray && plugins) {
          for (const plugin of plugins) {
            const pluginResult = plugin(input2);
            if (Array.isArray(pluginResult)) {
              pluginHandled = true;
              const [pluginIdentifier, ...rest] = pluginResult;
              str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
              if (rest.length > 0) {
                str[index2] += `,${rest.map((v) => flatten.call(this, v)).join(",")}`;
              }
              str[index2] += "]";
              break;
            }
          }
        }
        if (!pluginHandled) {
          error = new Error("Cannot encode function or unexpected type");
        }
      }
    }
    if (error) {
      let pluginHandled = false;
      if (postPlugins) {
        for (const plugin of postPlugins) {
          const pluginResult = plugin(input2);
          if (Array.isArray(pluginResult)) {
            pluginHandled = true;
            const [pluginIdentifier, ...rest] = pluginResult;
            str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
            if (rest.length > 0) {
              str[index2] += `,${rest.map((v) => flatten.call(this, v)).join(",")}`;
            }
            str[index2] += "]";
            break;
          }
        }
      }
      if (!pluginHandled) {
        throw error;
      }
    }
  }
}
var objectProtoNames2 = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function isPlainObject2(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames2;
}

// vendor/turbo-stream-v2/unflatten.ts
var globalObj = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : void 0;
function unflatten(parsed) {
  const { hydrated, values } = this;
  if (typeof parsed === "number") return hydrate.call(this, parsed);
  if (!Array.isArray(parsed) || !parsed.length) throw new SyntaxError();
  const startIndex = values.length;
  for (const value of parsed) {
    values.push(value);
  }
  hydrated.length = values.length;
  return hydrate.call(this, startIndex);
}
function hydrate(index) {
  const { hydrated, values, deferred, plugins } = this;
  let result;
  const stack = [
    [
      index,
      (v) => {
        result = v;
      }
    ]
  ];
  let postRun = [];
  while (stack.length > 0) {
    const [index2, set] = stack.pop();
    switch (index2) {
      case UNDEFINED:
        set(void 0);
        continue;
      case NULL:
        set(null);
        continue;
      case NAN:
        set(NaN);
        continue;
      case POSITIVE_INFINITY:
        set(Infinity);
        continue;
      case NEGATIVE_INFINITY:
        set(-Infinity);
        continue;
      case NEGATIVE_ZERO:
        set(-0);
        continue;
    }
    if (hydrated[index2]) {
      set(hydrated[index2]);
      continue;
    }
    const value = values[index2];
    if (!value || typeof value !== "object") {
      hydrated[index2] = value;
      set(value);
      continue;
    }
    if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const [type, b, c] = value;
        switch (type) {
          case TYPE_DATE:
            set(hydrated[index2] = new Date(b));
            continue;
          case TYPE_URL:
            set(hydrated[index2] = new URL(b));
            continue;
          case TYPE_BIGINT:
            set(hydrated[index2] = BigInt(b));
            continue;
          case TYPE_REGEXP:
            set(hydrated[index2] = new RegExp(b, c));
            continue;
          case TYPE_SYMBOL:
            set(hydrated[index2] = Symbol.for(b));
            continue;
          case TYPE_SET:
            const newSet = /* @__PURE__ */ new Set();
            hydrated[index2] = newSet;
            for (let i = value.length - 1; i > 0; i--)
              stack.push([
                value[i],
                (v) => {
                  newSet.add(v);
                }
              ]);
            set(newSet);
            continue;
          case TYPE_MAP:
            const map = /* @__PURE__ */ new Map();
            hydrated[index2] = map;
            for (let i = value.length - 2; i > 0; i -= 2) {
              const r = [];
              stack.push([
                value[i + 1],
                (v) => {
                  r[1] = v;
                }
              ]);
              stack.push([
                value[i],
                (k) => {
                  r[0] = k;
                }
              ]);
              postRun.push(() => {
                map.set(r[0], r[1]);
              });
            }
            set(map);
            continue;
          case TYPE_NULL_OBJECT:
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index2] = obj;
            for (const key of Object.keys(b).reverse()) {
              const r = [];
              stack.push([
                b[key],
                (v) => {
                  r[1] = v;
                }
              ]);
              stack.push([
                Number(key.slice(1)),
                (k) => {
                  r[0] = k;
                }
              ]);
              postRun.push(() => {
                obj[r[0]] = r[1];
              });
            }
            set(obj);
            continue;
          case TYPE_PROMISE:
            if (hydrated[b]) {
              set(hydrated[index2] = hydrated[b]);
            } else {
              const d = new Deferred2();
              deferred[b] = d;
              set(hydrated[index2] = d.promise);
            }
            continue;
          case TYPE_ERROR:
            const [, message, errorType] = value;
            let error = errorType && globalObj && globalObj[errorType] ? new globalObj[errorType](message) : new Error(message);
            hydrated[index2] = error;
            set(error);
            continue;
          case TYPE_PREVIOUS_RESOLVED:
            set(hydrated[index2] = hydrated[b]);
            continue;
          default:
            if (Array.isArray(plugins)) {
              const r = [];
              const vals = value.slice(1);
              for (let i = 0; i < vals.length; i++) {
                const v = vals[i];
                stack.push([
                  v,
                  (v2) => {
                    r[i] = v2;
                  }
                ]);
              }
              postRun.push(() => {
                for (const plugin of plugins) {
                  const result2 = plugin(value[0], ...r);
                  if (result2) {
                    set(hydrated[index2] = result2.value);
                    return;
                  }
                }
                throw new SyntaxError();
              });
              continue;
            }
            throw new SyntaxError();
        }
      } else {
        const array = [];
        hydrated[index2] = array;
        for (let i = 0; i < value.length; i++) {
          const n = value[i];
          if (n !== HOLE) {
            stack.push([
              n,
              (v) => {
                array[i] = v;
              }
            ]);
          }
        }
        set(array);
        continue;
      }
    } else {
      const object = {};
      hydrated[index2] = object;
      for (const key of Object.keys(value).reverse()) {
        const r = [];
        stack.push([
          value[key],
          (v) => {
            r[1] = v;
          }
        ]);
        stack.push([
          Number(key.slice(1)),
          (k) => {
            r[0] = k;
          }
        ]);
        postRun.push(() => {
          object[r[0]] = r[1];
        });
      }
      set(object);
      continue;
    }
  }
  while (postRun.length > 0) {
    postRun.pop()();
  }
  return result;
}

// vendor/turbo-stream-v2/turbo-stream.ts
async function decode(readable, options) {
  const { plugins } = options ?? {};
  const done = new Deferred2();
  const reader = readable.pipeThrough(createLineSplittingTransform()).getReader();
  const decoder = {
    values: [],
    hydrated: [],
    deferred: {},
    plugins
  };
  const decoded = await decodeInitial.call(decoder, reader);
  let donePromise = done.promise;
  if (decoded.done) {
    done.resolve();
  } else {
    donePromise = decodeDeferred.call(decoder, reader).then(done.resolve).catch((reason) => {
      for (const deferred of Object.values(decoder.deferred)) {
        deferred.reject(reason);
      }
      done.reject(reason);
    });
  }
  return {
    done: donePromise.then(() => reader.closed),
    value: decoded.value
  };
}
async function decodeInitial(reader) {
  const read = await reader.read();
  if (!read.value) {
    throw new SyntaxError();
  }
  let line;
  try {
    line = JSON.parse(read.value);
  } catch (reason) {
    throw new SyntaxError();
  }
  return {
    done: read.done,
    value: unflatten.call(this, line)
  };
}
async function decodeDeferred(reader) {
  let read = await reader.read();
  while (!read.done) {
    if (!read.value) continue;
    const line = read.value;
    switch (line[0]) {
      case TYPE_PROMISE: {
        const colonIndex = line.indexOf(":");
        const deferredId = Number(line.slice(1, colonIndex));
        const deferred = this.deferred[deferredId];
        if (!deferred) {
          throw new Error(`Deferred ID ${deferredId} not found in stream`);
        }
        const lineData = line.slice(colonIndex + 1);
        let jsonLine;
        try {
          jsonLine = JSON.parse(lineData);
        } catch (reason) {
          throw new SyntaxError();
        }
        const value = unflatten.call(this, jsonLine);
        deferred.resolve(value);
        break;
      }
      case TYPE_ERROR: {
        const colonIndex = line.indexOf(":");
        const deferredId = Number(line.slice(1, colonIndex));
        const deferred = this.deferred[deferredId];
        if (!deferred) {
          throw new Error(`Deferred ID ${deferredId} not found in stream`);
        }
        const lineData = line.slice(colonIndex + 1);
        let jsonLine;
        try {
          jsonLine = JSON.parse(lineData);
        } catch (reason) {
          throw new SyntaxError();
        }
        const value = unflatten.call(this, jsonLine);
        deferred.reject(value);
        break;
      }
      default:
        throw new SyntaxError();
    }
    read = await reader.read();
  }
}
function encode(input, options) {
  const { plugins, postPlugins, signal } = options ?? {};
  const encoder = {
    deferred: {},
    index: 0,
    indices: /* @__PURE__ */ new Map(),
    stringified: [],
    plugins,
    postPlugins,
    signal
  };
  const textEncoder = new TextEncoder();
  let lastSentIndex = 0;
  const readable = new ReadableStream({
    async start(controller) {
      const id = flatten.call(encoder, input);
      if (Array.isArray(id)) {
        throw new Error("This should never happen");
      }
      if (id < 0) {
        controller.enqueue(textEncoder.encode(`${id}
`));
      } else {
        controller.enqueue(
          textEncoder.encode(`[${encoder.stringified.join(",")}]
`)
        );
        lastSentIndex = encoder.stringified.length - 1;
      }
      const seenPromises = /* @__PURE__ */ new WeakSet();
      if (Object.keys(encoder.deferred).length) {
        let raceDone;
        const racePromise = new Promise((resolve, reject) => {
          raceDone = resolve;
          if (signal) {
            const rejectPromise = () => reject(signal.reason || new Error("Signal was aborted."));
            if (signal.aborted) {
              rejectPromise();
            } else {
              signal.addEventListener("abort", (event) => {
                rejectPromise();
              });
            }
          }
        });
        while (Object.keys(encoder.deferred).length > 0) {
          for (const [deferredId, deferred] of Object.entries(
            encoder.deferred
          )) {
            if (seenPromises.has(deferred)) continue;
            seenPromises.add(
              // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
              encoder.deferred[Number(deferredId)] = Promise.race([
                racePromise,
                deferred
              ]).then(
                (resolved) => {
                  const id2 = flatten.call(encoder, resolved);
                  if (Array.isArray(id2)) {
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_PROMISE}${deferredId}:[["${TYPE_PREVIOUS_RESOLVED}",${id2[0]}]]
`
                      )
                    );
                    encoder.index++;
                    lastSentIndex++;
                  } else if (id2 < 0) {
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_PROMISE}${deferredId}:${id2}
`
                      )
                    );
                  } else {
                    const values = encoder.stringified.slice(lastSentIndex + 1).join(",");
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_PROMISE}${deferredId}:[${values}]
`
                      )
                    );
                    lastSentIndex = encoder.stringified.length - 1;
                  }
                },
                (reason) => {
                  if (!reason || typeof reason !== "object" || !(reason instanceof Error)) {
                    reason = new Error("An unknown error occurred");
                  }
                  const id2 = flatten.call(encoder, reason);
                  if (Array.isArray(id2)) {
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_ERROR}${deferredId}:[["${TYPE_PREVIOUS_RESOLVED}",${id2[0]}]]
`
                      )
                    );
                    encoder.index++;
                    lastSentIndex++;
                  } else if (id2 < 0) {
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_ERROR}${deferredId}:${id2}
`
                      )
                    );
                  } else {
                    const values = encoder.stringified.slice(lastSentIndex + 1).join(",");
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_ERROR}${deferredId}:[${values}]
`
                      )
                    );
                    lastSentIndex = encoder.stringified.length - 1;
                  }
                }
              ).finally(() => {
                delete encoder.deferred[Number(deferredId)];
              })
            );
          }
          await Promise.race(Object.values(encoder.deferred));
        }
        raceDone();
      }
      await Promise.all(Object.values(encoder.deferred));
      controller.close();
    }
  });
  return readable;
}

// lib/dom/ssr/data.ts
async function createRequestInit(request) {
  let init = { signal: request.signal };
  if (request.method !== "GET") {
    init.method = request.method;
    let contentType = request.headers.get("Content-Type");
    if (contentType && /\bapplication\/json\b/.test(contentType)) {
      init.headers = { "Content-Type": contentType };
      init.body = JSON.stringify(await request.json());
    } else if (contentType && /\btext\/plain\b/.test(contentType)) {
      init.headers = { "Content-Type": contentType };
      init.body = await request.text();
    } else if (contentType && /\bapplication\/x-www-form-urlencoded\b/.test(contentType)) {
      init.body = new URLSearchParams(await request.text());
    } else {
      init.body = await request.formData();
    }
  }
  return init;
}

// lib/dom/ssr/markup.ts
var ESCAPE_LOOKUP = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var ESCAPE_REGEX = /[&><\u2028\u2029]/g;
function escapeHtml(html) {
  return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}

// lib/dom/ssr/invariant.ts
function invariant2(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}

// lib/dom/ssr/single-fetch.tsx
var SingleFetchRedirectSymbol = Symbol("SingleFetchRedirect");
var SingleFetchNoResultError = class extends Error {
};
var SINGLE_FETCH_REDIRECT_STATUS = 202;
var NO_BODY_STATUS_CODES = /* @__PURE__ */ new Set([100, 101, 204, 205]);
function StreamTransfer({
  context,
  identifier,
  reader,
  textDecoder,
  nonce
}) {
  if (!context.renderMeta || !context.renderMeta.didRenderScripts) {
    return null;
  }
  if (!context.renderMeta.streamCache) {
    context.renderMeta.streamCache = {};
  }
  let { streamCache } = context.renderMeta;
  let promise = streamCache[identifier];
  if (!promise) {
    promise = streamCache[identifier] = reader.read().then((result) => {
      streamCache[identifier].result = {
        done: result.done,
        value: textDecoder.decode(result.value, { stream: true })
      };
    }).catch((e) => {
      streamCache[identifier].error = e;
    });
  }
  if (promise.error) {
    throw promise.error;
  }
  if (promise.result === void 0) {
    throw promise;
  }
  let { done, value } = promise.result;
  let scriptTag = value ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "script",
    {
      nonce,
      dangerouslySetInnerHTML: {
        __html: `window.__reactRouterContext.streamController.enqueue(${escapeHtml(
          JSON.stringify(value)
        )});`
      }
    }
  ) : null;
  if (done) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, scriptTag, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      "script",
      {
        nonce,
        dangerouslySetInnerHTML: {
          __html: `window.__reactRouterContext.streamController.close();`
        }
      }
    ));
  } else {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, scriptTag, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      StreamTransfer,
      {
        context,
        identifier: identifier + 1,
        reader,
        textDecoder,
        nonce
      }
    )));
  }
}
function getTurboStreamSingleFetchDataStrategy(getRouter, manifest, routeModules, ssr, basename) {
  let dataStrategy = getSingleFetchDataStrategyImpl(
    getRouter,
    (match) => {
      let manifestRoute = manifest.routes[match.route.id];
      invariant2(manifestRoute, "Route not found in manifest");
      let routeModule = routeModules[match.route.id];
      return {
        hasLoader: manifestRoute.hasLoader,
        hasClientLoader: manifestRoute.hasClientLoader,
        hasShouldRevalidate: Boolean(routeModule?.shouldRevalidate)
      };
    },
    fetchAndDecodeViaTurboStream,
    ssr,
    basename
  );
  return async (args) => args.runClientMiddleware(dataStrategy);
}
function getSingleFetchDataStrategyImpl(getRouter, getRouteInfo, fetchAndDecode, ssr, basename, shouldAllowOptOut = () => true) {
  return async (args) => {
    let { request, matches, fetcherKey } = args;
    let router = getRouter();
    if (request.method !== "GET") {
      return singleFetchActionStrategy(args, fetchAndDecode, basename);
    }
    let foundRevalidatingServerLoader = matches.some((m) => {
      let { hasLoader, hasClientLoader } = getRouteInfo(m);
      return m.shouldCallHandler() && hasLoader && !hasClientLoader;
    });
    if (!ssr && !foundRevalidatingServerLoader) {
      return nonSsrStrategy(args, getRouteInfo, fetchAndDecode, basename);
    }
    if (fetcherKey) {
      return singleFetchLoaderFetcherStrategy(args, fetchAndDecode, basename);
    }
    return singleFetchLoaderNavigationStrategy(
      args,
      router,
      getRouteInfo,
      fetchAndDecode,
      ssr,
      basename,
      shouldAllowOptOut
    );
  };
}
async function singleFetchActionStrategy(args, fetchAndDecode, basename) {
  let actionMatch = args.matches.find((m) => m.shouldCallHandler());
  invariant2(actionMatch, "No action match found");
  let actionStatus = void 0;
  let result = await actionMatch.resolve(async (handler) => {
    let result2 = await handler(async () => {
      let { data: data2, status } = await fetchAndDecode(args, basename, [
        actionMatch.route.id
      ]);
      actionStatus = status;
      return unwrapSingleFetchResult(data2, actionMatch.route.id);
    });
    return result2;
  });
  if (isResponse(result.result) || isRouteErrorResponse(result.result) || isDataWithResponseInit(result.result)) {
    return { [actionMatch.route.id]: result };
  }
  return {
    [actionMatch.route.id]: {
      type: result.type,
      result: data(result.result, actionStatus)
    }
  };
}
async function nonSsrStrategy(args, getRouteInfo, fetchAndDecode, basename) {
  let matchesToLoad = args.matches.filter((m) => m.shouldCallHandler());
  let results = {};
  await Promise.all(
    matchesToLoad.map(
      (m) => m.resolve(async (handler) => {
        try {
          let { hasClientLoader } = getRouteInfo(m);
          let routeId = m.route.id;
          let result = hasClientLoader ? await handler(async () => {
            let { data: data2 } = await fetchAndDecode(args, basename, [routeId]);
            return unwrapSingleFetchResult(data2, routeId);
          }) : await handler();
          results[m.route.id] = { type: "data", result };
        } catch (e) {
          results[m.route.id] = { type: "error", result: e };
        }
      })
    )
  );
  return results;
}
async function singleFetchLoaderNavigationStrategy(args, router, getRouteInfo, fetchAndDecode, ssr, basename, shouldAllowOptOut = () => true) {
  let routesParams = /* @__PURE__ */ new Set();
  let foundOptOutRoute = false;
  let routeDfds = args.matches.map(() => createDeferred2());
  let singleFetchDfd = createDeferred2();
  let results = {};
  let resolvePromise = Promise.all(
    args.matches.map(
      async (m, i) => m.resolve(async (handler) => {
        routeDfds[i].resolve();
        let routeId = m.route.id;
        let { hasLoader, hasClientLoader, hasShouldRevalidate } = getRouteInfo(m);
        let defaultShouldRevalidate = !m.shouldRevalidateArgs || m.shouldRevalidateArgs.actionStatus == null || m.shouldRevalidateArgs.actionStatus < 400;
        let shouldCall = m.shouldCallHandler(defaultShouldRevalidate);
        if (!shouldCall) {
          foundOptOutRoute || (foundOptOutRoute = m.shouldRevalidateArgs != null && // This is a revalidation,
          hasLoader && // for a route with a server loader,
          hasShouldRevalidate === true);
          return;
        }
        if (shouldAllowOptOut(m) && hasClientLoader) {
          if (hasLoader) {
            foundOptOutRoute = true;
          }
          try {
            let result = await handler(async () => {
              let { data: data2 } = await fetchAndDecode(args, basename, [routeId]);
              return unwrapSingleFetchResult(data2, routeId);
            });
            results[routeId] = { type: "data", result };
          } catch (e) {
            results[routeId] = { type: "error", result: e };
          }
          return;
        }
        if (hasLoader) {
          routesParams.add(routeId);
        }
        try {
          let result = await handler(async () => {
            let data2 = await singleFetchDfd.promise;
            return unwrapSingleFetchResult(data2, routeId);
          });
          results[routeId] = { type: "data", result };
        } catch (e) {
          results[routeId] = { type: "error", result: e };
        }
      })
    )
  );
  await Promise.all(routeDfds.map((d) => d.promise));
  let isInitialLoad = !router.state.initialized && router.state.navigation.state === "idle";
  if ((isInitialLoad || routesParams.size === 0) && !window.__reactRouterHdrActive) {
    singleFetchDfd.resolve({ routes: {} });
  } else {
    let targetRoutes = ssr && foundOptOutRoute && routesParams.size > 0 ? [...routesParams.keys()] : void 0;
    try {
      let data2 = await fetchAndDecode(args, basename, targetRoutes);
      singleFetchDfd.resolve(data2.data);
    } catch (e) {
      singleFetchDfd.reject(e);
    }
  }
  await resolvePromise;
  await bubbleMiddlewareErrors(
    singleFetchDfd.promise,
    args.matches,
    routesParams,
    results
  );
  return results;
}
async function bubbleMiddlewareErrors(singleFetchPromise, matches, routesParams, results) {
  try {
    let middlewareError;
    let fetchedData = await singleFetchPromise;
    if ("routes" in fetchedData) {
      for (let match of matches) {
        if (match.route.id in fetchedData.routes) {
          let routeResult = fetchedData.routes[match.route.id];
          if ("error" in routeResult) {
            middlewareError = routeResult.error;
            if (results[match.route.id]?.result == null) {
              results[match.route.id] = {
                type: "error",
                result: middlewareError
              };
            }
            break;
          }
        }
      }
    }
    if (middlewareError !== void 0) {
      Array.from(routesParams.values()).forEach((routeId) => {
        if (results[routeId].result instanceof SingleFetchNoResultError) {
          results[routeId].result = middlewareError;
        }
      });
    }
  } catch (e) {
  }
}
async function singleFetchLoaderFetcherStrategy(args, fetchAndDecode, basename) {
  let fetcherMatch = args.matches.find((m) => m.shouldCallHandler());
  invariant2(fetcherMatch, "No fetcher match found");
  let routeId = fetcherMatch.route.id;
  let result = await fetcherMatch.resolve(
    async (handler) => handler(async () => {
      let { data: data2 } = await fetchAndDecode(args, basename, [routeId]);
      return unwrapSingleFetchResult(data2, routeId);
    })
  );
  return { [fetcherMatch.route.id]: result };
}
function stripIndexParam(url) {
  let indexValues = url.searchParams.getAll("index");
  url.searchParams.delete("index");
  let indexValuesToKeep = [];
  for (let indexValue of indexValues) {
    if (indexValue) {
      indexValuesToKeep.push(indexValue);
    }
  }
  for (let toKeep of indexValuesToKeep) {
    url.searchParams.append("index", toKeep);
  }
  return url;
}
function singleFetchUrl(reqUrl, basename, extension) {
  let url = typeof reqUrl === "string" ? new URL(
    reqUrl,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window === "undefined" ? "server://singlefetch/" : window.location.origin
  ) : reqUrl;
  if (url.pathname === "/") {
    url.pathname = `_root.${extension}`;
  } else if (basename && stripBasename(url.pathname, basename) === "/") {
    url.pathname = `${basename.replace(/\/$/, "")}/_root.${extension}`;
  } else {
    url.pathname = `${url.pathname.replace(/\/$/, "")}.${extension}`;
  }
  return url;
}
async function fetchAndDecodeViaTurboStream(args, basename, targetRoutes) {
  let { request } = args;
  let url = singleFetchUrl(request.url, basename, "data");
  if (request.method === "GET") {
    url = stripIndexParam(url);
    if (targetRoutes) {
      url.searchParams.set("_routes", targetRoutes.join(","));
    }
  }
  let res = await fetch(url, await createRequestInit(request));
  if (res.status >= 400 && !res.headers.has("X-Remix-Response")) {
    throw new ErrorResponseImpl(res.status, res.statusText, await res.text());
  }
  if (res.status === 204 && res.headers.has("X-Remix-Redirect")) {
    return {
      status: SINGLE_FETCH_REDIRECT_STATUS,
      data: {
        redirect: {
          redirect: res.headers.get("X-Remix-Redirect"),
          status: Number(res.headers.get("X-Remix-Status") || "302"),
          revalidate: res.headers.get("X-Remix-Revalidate") === "true",
          reload: res.headers.get("X-Remix-Reload-Document") === "true",
          replace: res.headers.get("X-Remix-Replace") === "true"
        }
      }
    };
  }
  if (NO_BODY_STATUS_CODES.has(res.status)) {
    let routes = {};
    if (targetRoutes && request.method !== "GET") {
      routes[targetRoutes[0]] = { data: void 0 };
    }
    return {
      status: res.status,
      data: { routes }
    };
  }
  invariant2(res.body, "No response body to decode");
  try {
    let decoded = await decodeViaTurboStream(res.body, window);
    let data2;
    if (request.method === "GET") {
      let typed = decoded.value;
      if (SingleFetchRedirectSymbol in typed) {
        data2 = { redirect: typed[SingleFetchRedirectSymbol] };
      } else {
        data2 = { routes: typed };
      }
    } else {
      let typed = decoded.value;
      let routeId = targetRoutes?.[0];
      invariant2(routeId, "No routeId found for single fetch call decoding");
      if ("redirect" in typed) {
        data2 = { redirect: typed };
      } else {
        data2 = { routes: { [routeId]: typed } };
      }
    }
    return { status: res.status, data: data2 };
  } catch (e) {
    throw new Error("Unable to decode turbo-stream response");
  }
}
function decodeViaTurboStream(body, global) {
  return decode(body, {
    plugins: [
      (type, ...rest) => {
        if (type === "SanitizedError") {
          let [name, message, stack] = rest;
          let Constructor = Error;
          if (name && name in global && typeof global[name] === "function") {
            Constructor = global[name];
          }
          let error = new Constructor(message);
          error.stack = stack;
          return { value: error };
        }
        if (type === "ErrorResponse") {
          let [data2, status, statusText] = rest;
          return {
            value: new ErrorResponseImpl(status, statusText, data2)
          };
        }
        if (type === "SingleFetchRedirect") {
          return { value: { [SingleFetchRedirectSymbol]: rest[0] } };
        }
        if (type === "SingleFetchClassInstance") {
          return { value: rest[0] };
        }
        if (type === "SingleFetchFallback") {
          return { value: void 0 };
        }
      }
    ]
  });
}
function unwrapSingleFetchResult(result, routeId) {
  if ("redirect" in result) {
    let {
      redirect: location,
      revalidate,
      reload,
      replace: replace2,
      status
    } = result.redirect;
    throw redirect(location, {
      status,
      headers: {
        // Three R's of redirecting (lol Veep)
        ...revalidate ? { "X-Remix-Revalidate": "yes" } : null,
        ...reload ? { "X-Remix-Reload-Document": "yes" } : null,
        ...replace2 ? { "X-Remix-Replace": "yes" } : null
      }
    });
  }
  let routeResult = result.routes[routeId];
  if (routeResult == null) {
    throw new SingleFetchNoResultError(
      `No result found for routeId "${routeId}"`
    );
  } else if ("error" in routeResult) {
    throw routeResult.error;
  } else if ("data" in routeResult) {
    return routeResult.data;
  } else {
    throw new Error(`Invalid response found for routeId "${routeId}"`);
  }
}
function createDeferred2() {
  let resolve;
  let reject;
  let promise = new Promise((res, rej) => {
    resolve = async (val) => {
      res(val);
      try {
        await promise;
      } catch (e) {
      }
    };
    reject = async (error) => {
      rej(error);
      try {
        await promise;
      } catch (e) {
      }
    };
  });
  return {
    promise,
    //@ts-ignore
    resolve,
    //@ts-ignore
    reject
  };
}

// lib/dom/ssr/errorBoundaries.tsx


// lib/dom/ssr/components.tsx


// lib/dom/ssr/routeModules.ts
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      route.module
    );
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    console.error(
      `Error loading route module \`${route.module}\`, reloading page...`
    );
    console.error(error);
    if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && // @ts-expect-error
    /* unsupported import.meta.hot */ undefined) // removed by dead control flow
{}
    window.location.reload();
    return new Promise(() => {
    });
  }
}

// lib/dom/ssr/links.ts
function getKeyedLinksForMatches(matches, routeModules, manifest) {
  let descriptors = matches.map((match) => {
    let module = routeModules[match.route.id];
    let route = manifest.routes[match.route.id];
    return [
      route && route.css ? route.css.map((href) => ({ rel: "stylesheet", href })) : [],
      module?.links?.() || []
    ];
  }).flat(2);
  let preloads = getModuleLinkHrefs(matches, manifest);
  return dedupeLinkDescriptors(descriptors, preloads);
}
function getRouteCssDescriptors(route) {
  if (!route.css) return [];
  return route.css.map((href) => ({ rel: "stylesheet", href }));
}
async function prefetchRouteCss(route) {
  if (!route.css) return;
  let descriptors = getRouteCssDescriptors(route);
  await Promise.all(descriptors.map(prefetchStyleLink));
}
async function prefetchStyleLinks(route, routeModule) {
  if (!route.css && !routeModule.links || !isPreloadSupported()) return;
  let descriptors = [];
  if (route.css) {
    descriptors.push(...getRouteCssDescriptors(route));
  }
  if (routeModule.links) {
    descriptors.push(...routeModule.links());
  }
  if (descriptors.length === 0) return;
  let styleLinks = [];
  for (let descriptor of descriptors) {
    if (!isPageLinkDescriptor(descriptor) && descriptor.rel === "stylesheet") {
      styleLinks.push({
        ...descriptor,
        rel: "preload",
        as: "style"
      });
    }
  }
  await Promise.all(styleLinks.map(prefetchStyleLink));
}
async function prefetchStyleLink(descriptor) {
  return new Promise((resolve) => {
    if (descriptor.media && !window.matchMedia(descriptor.media).matches || document.querySelector(
      `link[rel="stylesheet"][href="${descriptor.href}"]`
    )) {
      return resolve();
    }
    let link = document.createElement("link");
    Object.assign(link, descriptor);
    function removeLink() {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }
    link.onload = () => {
      removeLink();
      resolve();
    };
    link.onerror = () => {
      removeLink();
      resolve();
    };
    document.head.appendChild(link);
  });
}
function isPageLinkDescriptor(object) {
  return object != null && typeof object.page === "string";
}
function isHtmlLinkDescriptor(object) {
  if (object == null) {
    return false;
  }
  if (object.href == null) {
    return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
  let links = await Promise.all(
    matches.map(async (match) => {
      let route = manifest.routes[match.route.id];
      if (route) {
        let mod = await loadRouteModule(route, routeModules);
        return mod.links ? mod.links() : [];
      }
      return [];
    })
  );
  return dedupeLinkDescriptors(
    links.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map(
      (link) => link.rel === "stylesheet" ? { ...link, rel: "prefetch", as: "style" } : { ...link, rel: "prefetch" }
    )
  );
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location, mode) {
  let isNew = (match, index) => {
    if (!currentMatches[index]) return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    return (
      // param change, /users/123 -> /users/456
      currentMatches[index].pathname !== match.pathname || // splat param changed, which is not present in match.path
      // e.g. /files/images/avatar.jpg -> files/finances.xls
      currentMatches[index].route.path?.endsWith("*") && currentMatches[index].params["*"] !== match.params["*"]
    );
  };
  if (mode === "assets") {
    return nextMatches.filter(
      (match, index) => isNew(match, index) || matchPathChanged(match, index)
    );
  }
  if (mode === "data") {
    return nextMatches.filter((match, index) => {
      let manifestRoute = manifest.routes[match.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return false;
      }
      if (isNew(match, index) || matchPathChanged(match, index)) {
        return true;
      }
      if (match.route.shouldRevalidate) {
        let routeChoice = match.route.shouldRevalidate({
          currentUrl: new URL(
            location.pathname + location.search + location.hash,
            window.origin
          ),
          currentParams: currentMatches[0]?.params || {},
          nextUrl: new URL(page, window.origin),
          nextParams: match.params,
          defaultShouldRevalidate: true
        });
        if (typeof routeChoice === "boolean") {
          return routeChoice;
        }
      }
      return true;
    });
  }
  return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
  return dedupeHrefs(
    matches.map((match) => {
      let route = manifest.routes[match.route.id];
      if (!route) return [];
      let hrefs = [route.module];
      if (route.clientActionModule) {
        hrefs = hrefs.concat(route.clientActionModule);
      }
      if (route.clientLoaderModule) {
        hrefs = hrefs.concat(route.clientLoaderModule);
      }
      if (includeHydrateFallback && route.hydrateFallbackModule) {
        hrefs = hrefs.concat(route.hydrateFallbackModule);
      }
      if (route.imports) {
        hrefs = hrefs.concat(route.imports);
      }
      return hrefs;
    }).flat(1)
  );
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function sortKeys(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set();
  let preloadsSet = new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let alreadyModulePreload = preloads && !isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href);
    if (alreadyModulePreload) {
      return deduped;
    }
    let key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({ key, link: descriptor });
    }
    return deduped;
  }, []);
}
var _isPreloadSupported;
function isPreloadSupported() {
  if (_isPreloadSupported !== void 0) {
    return _isPreloadSupported;
  }
  let el = document.createElement("link");
  _isPreloadSupported = el.relList.supports("preload");
  el = null;
  return _isPreloadSupported;
}

// lib/dom/ssr/fog-of-war.ts


// lib/dom/ssr/routes.tsx


// lib/dom/ssr/fallback.tsx

function RemixRootDefaultHydrateFallback() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(BoundaryShell, { title: "Loading...", renderScripts: true }, ENABLE_DEV_WARNINGS ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "script",
    {
      dangerouslySetInnerHTML: {
        __html: `
              console.log(
                "\u{1F4BF} Hey developer \u{1F44B}. You can provide a way better UX than this " +
                "when your app is loading JS modules and/or running \`clientLoader\` " +
                "functions. Check out https://reactrouter.com/start/framework/route-module#hydratefallback " +
                "for more information."
              );
            `
      }
    }
  ) : null);
}

// lib/dom/ssr/routes.tsx
function groupRoutesByParentId(manifest) {
  let routes = {};
  Object.values(manifest).forEach((route) => {
    if (route) {
      let parentId = route.parentId || "";
      if (!routes[parentId]) {
        routes[parentId] = [];
      }
      routes[parentId].push(route);
    }
  });
  return routes;
}
function getRouteComponents(route, routeModule, isSpaMode) {
  let Component4 = getRouteModuleComponent(routeModule);
  let HydrateFallback = routeModule.HydrateFallback && (!isSpaMode || route.id === "root") ? routeModule.HydrateFallback : route.id === "root" ? RemixRootDefaultHydrateFallback : void 0;
  let ErrorBoundary = routeModule.ErrorBoundary ? routeModule.ErrorBoundary : route.id === "root" ? () => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(RemixRootDefaultErrorBoundary, { error: useRouteError() }) : void 0;
  if (route.id === "root" && routeModule.Layout) {
    return {
      ...Component4 ? {
        element: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(routeModule.Layout, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component4, null))
      } : { Component: Component4 },
      ...ErrorBoundary ? {
        errorElement: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(routeModule.Layout, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ErrorBoundary, null))
      } : { ErrorBoundary },
      ...HydrateFallback ? {
        hydrateFallbackElement: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(routeModule.Layout, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(HydrateFallback, null))
      } : { HydrateFallback }
    };
  }
  return { Component: Component4, ErrorBoundary, HydrateFallback };
}
function createServerRoutes(manifest, routeModules, future, isSpaMode, parentId = "", routesByParentId = groupRoutesByParentId(manifest), spaModeLazyPromise = Promise.resolve({ Component: () => null })) {
  return (routesByParentId[parentId] || []).map((route) => {
    let routeModule = routeModules[route.id];
    invariant2(
      routeModule,
      "No `routeModule` available to create server routes"
    );
    let dataRoute = {
      ...getRouteComponents(route, routeModule, isSpaMode),
      caseSensitive: route.caseSensitive,
      id: route.id,
      index: route.index,
      path: route.path,
      handle: routeModule.handle,
      // For SPA Mode, all routes are lazy except root.  However we tell the
      // router root is also lazy here too since we don't need a full
      // implementation - we just need a `lazy` prop to tell the RR rendering
      // where to stop which is always at the root route in SPA mode
      lazy: isSpaMode ? () => spaModeLazyPromise : void 0,
      // For partial hydration rendering, we need to indicate when the route
      // has a loader/clientLoader, but it won't ever be called during the static
      // render, so just give it a no-op function so we can render down to the
      // proper fallback
      loader: route.hasLoader || route.hasClientLoader ? () => null : void 0
      // We don't need middleware/action/shouldRevalidate on these routes since
      // they're for a static render
    };
    let children = createServerRoutes(
      manifest,
      routeModules,
      future,
      isSpaMode,
      route.id,
      routesByParentId,
      spaModeLazyPromise
    );
    if (children.length > 0) dataRoute.children = children;
    return dataRoute;
  });
}
function createClientRoutesWithHMRRevalidationOptOut(needsRevalidation, manifest, routeModulesCache, initialState, ssr, isSpaMode) {
  return createClientRoutes(
    manifest,
    routeModulesCache,
    initialState,
    ssr,
    isSpaMode,
    "",
    groupRoutesByParentId(manifest),
    needsRevalidation
  );
}
function preventInvalidServerHandlerCall(type, route) {
  if (type === "loader" && !route.hasLoader || type === "action" && !route.hasAction) {
    let fn = type === "action" ? "serverAction()" : "serverLoader()";
    let msg = `You are trying to call ${fn} on a route that does not have a server ${type} (routeId: "${route.id}")`;
    console.error(msg);
    throw new ErrorResponseImpl(400, "Bad Request", new Error(msg), true);
  }
}
function noActionDefinedError(type, routeId) {
  let article = type === "clientAction" ? "a" : "an";
  let msg = `Route "${routeId}" does not have ${article} ${type}, but you are trying to submit to it. To fix this, please add ${article} \`${type}\` function to the route`;
  console.error(msg);
  throw new ErrorResponseImpl(405, "Method Not Allowed", new Error(msg), true);
}
function createClientRoutes(manifest, routeModulesCache, initialState, ssr, isSpaMode, parentId = "", routesByParentId = groupRoutesByParentId(manifest), needsRevalidation) {
  return (routesByParentId[parentId] || []).map((route) => {
    let routeModule = routeModulesCache[route.id];
    function fetchServerHandler(singleFetch) {
      invariant2(
        typeof singleFetch === "function",
        "No single fetch function available for route handler"
      );
      return singleFetch();
    }
    function fetchServerLoader(singleFetch) {
      if (!route.hasLoader) return Promise.resolve(null);
      return fetchServerHandler(singleFetch);
    }
    function fetchServerAction(singleFetch) {
      if (!route.hasAction) {
        throw noActionDefinedError("action", route.id);
      }
      return fetchServerHandler(singleFetch);
    }
    function prefetchModule(modulePath) {
      import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        modulePath
      );
    }
    function prefetchRouteModuleChunks(route2) {
      if (route2.clientActionModule) {
        prefetchModule(route2.clientActionModule);
      }
      if (route2.clientLoaderModule) {
        prefetchModule(route2.clientLoaderModule);
      }
    }
    async function prefetchStylesAndCallHandler(handler) {
      let cachedModule = routeModulesCache[route.id];
      let linkPrefetchPromise = cachedModule ? prefetchStyleLinks(route, cachedModule) : Promise.resolve();
      try {
        return handler();
      } finally {
        await linkPrefetchPromise;
      }
    }
    let dataRoute = {
      id: route.id,
      index: route.index,
      path: route.path
    };
    if (routeModule) {
      Object.assign(dataRoute, {
        ...dataRoute,
        ...getRouteComponents(route, routeModule, isSpaMode),
        middleware: routeModule.clientMiddleware,
        handle: routeModule.handle,
        shouldRevalidate: getShouldRevalidateFunction(
          dataRoute.path,
          routeModule,
          route,
          ssr,
          needsRevalidation
        )
      });
      let hasInitialData = initialState && initialState.loaderData && route.id in initialState.loaderData;
      let initialData = hasInitialData ? initialState?.loaderData?.[route.id] : void 0;
      let hasInitialError = initialState && initialState.errors && route.id in initialState.errors;
      let initialError = hasInitialError ? initialState?.errors?.[route.id] : void 0;
      let isHydrationRequest = needsRevalidation == null && (routeModule.clientLoader?.hydrate === true || !route.hasLoader);
      dataRoute.loader = async ({ request, params, context, unstable_pattern }, singleFetch) => {
        try {
          let result = await prefetchStylesAndCallHandler(async () => {
            invariant2(
              routeModule,
              "No `routeModule` available for critical-route loader"
            );
            if (!routeModule.clientLoader) {
              return fetchServerLoader(singleFetch);
            }
            return routeModule.clientLoader({
              request,
              params,
              context,
              unstable_pattern,
              async serverLoader() {
                preventInvalidServerHandlerCall("loader", route);
                if (isHydrationRequest) {
                  if (hasInitialData) {
                    return initialData;
                  }
                  if (hasInitialError) {
                    throw initialError;
                  }
                }
                return fetchServerLoader(singleFetch);
              }
            });
          });
          return result;
        } finally {
          isHydrationRequest = false;
        }
      };
      dataRoute.loader.hydrate = shouldHydrateRouteLoader(
        route.id,
        routeModule.clientLoader,
        route.hasLoader,
        isSpaMode
      );
      dataRoute.action = ({ request, params, context, unstable_pattern }, singleFetch) => {
        return prefetchStylesAndCallHandler(async () => {
          invariant2(
            routeModule,
            "No `routeModule` available for critical-route action"
          );
          if (!routeModule.clientAction) {
            if (isSpaMode) {
              throw noActionDefinedError("clientAction", route.id);
            }
            return fetchServerAction(singleFetch);
          }
          return routeModule.clientAction({
            request,
            params,
            context,
            unstable_pattern,
            async serverAction() {
              preventInvalidServerHandlerCall("action", route);
              return fetchServerAction(singleFetch);
            }
          });
        });
      };
    } else {
      if (!route.hasClientLoader) {
        dataRoute.loader = (_, singleFetch) => prefetchStylesAndCallHandler(() => {
          return fetchServerLoader(singleFetch);
        });
      }
      if (!route.hasClientAction) {
        dataRoute.action = (_, singleFetch) => prefetchStylesAndCallHandler(() => {
          if (isSpaMode) {
            throw noActionDefinedError("clientAction", route.id);
          }
          return fetchServerAction(singleFetch);
        });
      }
      let lazyRoutePromise;
      async function getLazyRoute() {
        if (lazyRoutePromise) {
          return await lazyRoutePromise;
        }
        lazyRoutePromise = (async () => {
          if (route.clientLoaderModule || route.clientActionModule) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
          let routeModulePromise = loadRouteModuleWithBlockingLinks(
            route,
            routeModulesCache
          );
          prefetchRouteModuleChunks(route);
          return await routeModulePromise;
        })();
        return await lazyRoutePromise;
      }
      dataRoute.lazy = {
        loader: route.hasClientLoader ? async () => {
          let { clientLoader } = route.clientLoaderModule ? await import(
            /* @vite-ignore */
            /* webpackIgnore: true */
            route.clientLoaderModule
          ) : await getLazyRoute();
          invariant2(clientLoader, "No `clientLoader` export found");
          return (args, singleFetch) => clientLoader({
            ...args,
            async serverLoader() {
              preventInvalidServerHandlerCall("loader", route);
              return fetchServerLoader(singleFetch);
            }
          });
        } : void 0,
        action: route.hasClientAction ? async () => {
          let clientActionPromise = route.clientActionModule ? import(
            /* @vite-ignore */
            /* webpackIgnore: true */
            route.clientActionModule
          ) : getLazyRoute();
          prefetchRouteModuleChunks(route);
          let { clientAction } = await clientActionPromise;
          invariant2(clientAction, "No `clientAction` export found");
          return (args, singleFetch) => clientAction({
            ...args,
            async serverAction() {
              preventInvalidServerHandlerCall("action", route);
              return fetchServerAction(singleFetch);
            }
          });
        } : void 0,
        middleware: route.hasClientMiddleware ? async () => {
          let { clientMiddleware } = route.clientMiddlewareModule ? await import(
            /* @vite-ignore */
            /* webpackIgnore: true */
            route.clientMiddlewareModule
          ) : await getLazyRoute();
          invariant2(clientMiddleware, "No `clientMiddleware` export found");
          return clientMiddleware;
        } : void 0,
        shouldRevalidate: async () => {
          let lazyRoute = await getLazyRoute();
          return getShouldRevalidateFunction(
            dataRoute.path,
            lazyRoute,
            route,
            ssr,
            needsRevalidation
          );
        },
        handle: async () => (await getLazyRoute()).handle,
        // No need to wrap these in layout since the root route is never
        // loaded via route.lazy()
        Component: async () => (await getLazyRoute()).Component,
        ErrorBoundary: route.hasErrorBoundary ? async () => (await getLazyRoute()).ErrorBoundary : void 0
      };
    }
    let children = createClientRoutes(
      manifest,
      routeModulesCache,
      initialState,
      ssr,
      isSpaMode,
      route.id,
      routesByParentId,
      needsRevalidation
    );
    if (children.length > 0) dataRoute.children = children;
    return dataRoute;
  });
}
function getShouldRevalidateFunction(path, route, manifestRoute, ssr, needsRevalidation) {
  if (needsRevalidation) {
    return wrapShouldRevalidateForHdr(
      manifestRoute.id,
      route.shouldRevalidate,
      needsRevalidation
    );
  }
  if (!ssr && manifestRoute.hasLoader && !manifestRoute.hasClientLoader) {
    let myParams = path ? compilePath(path)[1].map((p) => p.paramName) : [];
    const didParamsChange = (opts) => myParams.some((p) => opts.currentParams[p] !== opts.nextParams[p]);
    if (route.shouldRevalidate) {
      let fn = route.shouldRevalidate;
      return (opts) => fn({
        ...opts,
        defaultShouldRevalidate: didParamsChange(opts)
      });
    } else {
      return (opts) => didParamsChange(opts);
    }
  }
  return route.shouldRevalidate;
}
function wrapShouldRevalidateForHdr(routeId, routeShouldRevalidate, needsRevalidation) {
  let handledRevalidation = false;
  return (arg) => {
    if (!handledRevalidation) {
      handledRevalidation = true;
      return needsRevalidation.has(routeId);
    }
    return routeShouldRevalidate ? routeShouldRevalidate(arg) : arg.defaultShouldRevalidate;
  };
}
async function loadRouteModuleWithBlockingLinks(route, routeModules) {
  let routeModulePromise = loadRouteModule(route, routeModules);
  let prefetchRouteCssPromise = prefetchRouteCss(route);
  let routeModule = await routeModulePromise;
  await Promise.all([
    prefetchRouteCssPromise,
    prefetchStyleLinks(route, routeModule)
  ]);
  return {
    Component: getRouteModuleComponent(routeModule),
    ErrorBoundary: routeModule.ErrorBoundary,
    clientMiddleware: routeModule.clientMiddleware,
    clientAction: routeModule.clientAction,
    clientLoader: routeModule.clientLoader,
    handle: routeModule.handle,
    links: routeModule.links,
    meta: routeModule.meta,
    shouldRevalidate: routeModule.shouldRevalidate
  };
}
function getRouteModuleComponent(routeModule) {
  if (routeModule.default == null) return void 0;
  let isEmptyObject = typeof routeModule.default === "object" && Object.keys(routeModule.default).length === 0;
  if (!isEmptyObject) {
    return routeModule.default;
  }
}
function shouldHydrateRouteLoader(routeId, clientLoader, hasLoader, isSpaMode) {
  return isSpaMode && routeId !== "root" || clientLoader != null && (clientLoader.hydrate === true || hasLoader !== true);
}

// lib/dom/ssr/fog-of-war.ts
var nextPaths = /* @__PURE__ */ new Set();
var discoveredPathsMaxSize = 1e3;
var discoveredPaths = /* @__PURE__ */ new Set();
var URL_LIMIT = 7680;
function isFogOfWarEnabled(routeDiscovery, ssr) {
  return routeDiscovery.mode === "lazy" && ssr === true;
}
function getPartialManifest({ sri, ...manifest }, router) {
  let routeIds = new Set(router.state.matches.map((m) => m.route.id));
  let segments = router.state.location.pathname.split("/").filter(Boolean);
  let paths = ["/"];
  segments.pop();
  while (segments.length > 0) {
    paths.push(`/${segments.join("/")}`);
    segments.pop();
  }
  paths.forEach((path) => {
    let matches = matchRoutes(router.routes, path, router.basename);
    if (matches) {
      matches.forEach((m) => routeIds.add(m.route.id));
    }
  });
  let initialRoutes = [...routeIds].reduce(
    (acc, id) => Object.assign(acc, { [id]: manifest.routes[id] }),
    {}
  );
  return {
    ...manifest,
    routes: initialRoutes,
    sri: sri ? true : void 0
  };
}
function getPatchRoutesOnNavigationFunction(manifest, routeModules, ssr, routeDiscovery, isSpaMode, basename) {
  if (!isFogOfWarEnabled(routeDiscovery, ssr)) {
    return void 0;
  }
  return async ({ path, patch, signal, fetcherKey }) => {
    if (discoveredPaths.has(path)) {
      return;
    }
    await fetchAndApplyManifestPatches(
      [path],
      fetcherKey ? window.location.href : path,
      manifest,
      routeModules,
      ssr,
      isSpaMode,
      basename,
      routeDiscovery.manifestPath,
      patch,
      signal
    );
  };
}
function useFogOFWarDiscovery(router, manifest, routeModules, ssr, routeDiscovery, isSpaMode) {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!isFogOfWarEnabled(routeDiscovery, ssr) || // @ts-expect-error - TS doesn't know about this yet
    window.navigator?.connection?.saveData === true) {
      return;
    }
    function registerElement(el) {
      let path = el.tagName === "FORM" ? el.getAttribute("action") : el.getAttribute("href");
      if (!path) {
        return;
      }
      let pathname = el.tagName === "A" ? el.pathname : new URL(path, window.location.origin).pathname;
      if (!discoveredPaths.has(pathname)) {
        nextPaths.add(pathname);
      }
    }
    async function fetchPatches() {
      document.querySelectorAll("a[data-discover], form[data-discover]").forEach(registerElement);
      let lazyPaths = Array.from(nextPaths.keys()).filter((path) => {
        if (discoveredPaths.has(path)) {
          nextPaths.delete(path);
          return false;
        }
        return true;
      });
      if (lazyPaths.length === 0) {
        return;
      }
      try {
        await fetchAndApplyManifestPatches(
          lazyPaths,
          null,
          manifest,
          routeModules,
          ssr,
          isSpaMode,
          router.basename,
          routeDiscovery.manifestPath,
          router.patchRoutes
        );
      } catch (e) {
        console.error("Failed to fetch manifest patches", e);
      }
    }
    let debouncedFetchPatches = debounce(fetchPatches, 100);
    fetchPatches();
    let observer = new MutationObserver(() => debouncedFetchPatches());
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-discover", "href", "action"]
    });
    return () => observer.disconnect();
  }, [ssr, isSpaMode, manifest, routeModules, router, routeDiscovery]);
}
function getManifestPath(_manifestPath, basename) {
  let manifestPath = _manifestPath || "/__manifest";
  if (basename == null) {
    return manifestPath;
  }
  return `${basename}${manifestPath}`.replace(/\/+/g, "/");
}
var MANIFEST_VERSION_STORAGE_KEY = "react-router-manifest-version";
async function fetchAndApplyManifestPatches(paths, errorReloadPath, manifest, routeModules, ssr, isSpaMode, basename, manifestPath, patchRoutes, signal) {
  const searchParams = new URLSearchParams();
  searchParams.set("paths", paths.sort().join(","));
  searchParams.set("version", manifest.version);
  let url = new URL(
    getManifestPath(manifestPath, basename),
    window.location.origin
  );
  url.search = searchParams.toString();
  if (url.toString().length > URL_LIMIT) {
    nextPaths.clear();
    return;
  }
  let serverPatches;
  try {
    let res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    } else if (res.status === 204 && res.headers.has("X-Remix-Reload-Document")) {
      if (!errorReloadPath) {
        console.warn(
          "Detected a manifest version mismatch during eager route discovery. The next navigation/fetch to an undiscovered route will result in a new document navigation to sync up with the latest manifest."
        );
        return;
      }
      try {
        if (sessionStorage.getItem(MANIFEST_VERSION_STORAGE_KEY) === manifest.version) {
          console.error(
            "Unable to discover routes due to manifest version mismatch."
          );
          return;
        }
        sessionStorage.setItem(MANIFEST_VERSION_STORAGE_KEY, manifest.version);
      } catch {
      }
      window.location.href = errorReloadPath;
      console.warn("Detected manifest version mismatch, reloading...");
      await new Promise(() => {
      });
    } else if (res.status >= 400) {
      throw new Error(await res.text());
    }
    try {
      sessionStorage.removeItem(MANIFEST_VERSION_STORAGE_KEY);
    } catch {
    }
    serverPatches = await res.json();
  } catch (e) {
    if (signal?.aborted) return;
    throw e;
  }
  let knownRoutes = new Set(Object.keys(manifest.routes));
  let patches = Object.values(serverPatches).reduce((acc, route) => {
    if (route && !knownRoutes.has(route.id)) {
      acc[route.id] = route;
    }
    return acc;
  }, {});
  Object.assign(manifest.routes, patches);
  paths.forEach((p) => addToFifoQueue(p, discoveredPaths));
  let parentIds = /* @__PURE__ */ new Set();
  Object.values(patches).forEach((patch) => {
    if (patch && (!patch.parentId || !patches[patch.parentId])) {
      parentIds.add(patch.parentId);
    }
  });
  parentIds.forEach(
    (parentId) => patchRoutes(
      parentId || null,
      createClientRoutes(patches, routeModules, null, ssr, isSpaMode, parentId)
    )
  );
}
function addToFifoQueue(path, queue) {
  if (queue.size >= discoveredPathsMaxSize) {
    let first = queue.values().next().value;
    queue.delete(first);
  }
  queue.add(path);
}
function debounce(callback, wait) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
}

// lib/dom/ssr/components.tsx
function useDataRouterContext2() {
  let context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterContext.Provider> element"
  );
  return context;
}
function useDataRouterStateContext() {
  let context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterStateContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  );
  return context;
}
var FrameworkContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(void 0);
FrameworkContext.displayName = "FrameworkContext";
function useFrameworkContext() {
  let context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(FrameworkContext);
  invariant2(
    context,
    "You must render this element inside a <HydratedRouter> element"
  );
  return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let frameworkContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(FrameworkContext);
  let [maybePrefetch, setMaybePrefetch] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
  let ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
    if (prefetch === "viewport") {
      let callback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };
      let observer = new IntersectionObserver(callback, { threshold: 0.5 });
      if (ref.current) observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [prefetch]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);
  let setIntent = () => {
    setMaybePrefetch(true);
  };
  let cancelIntent = () => {
    setMaybePrefetch(false);
    setShouldPrefetch(false);
  };
  if (!frameworkContext) {
    return [false, ref, {}];
  }
  if (prefetch !== "intent") {
    return [shouldPrefetch, ref, {}];
  }
  return [
    shouldPrefetch,
    ref,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent)
    }
  ];
}
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function getActiveMatches(matches, errors, isSpaMode) {
  if (isSpaMode && !isHydrated) {
    return [matches[0]];
  }
  if (errors) {
    let errorIdx = matches.findIndex((m) => errors[m.route.id] !== void 0);
    return matches.slice(0, errorIdx + 1);
  }
  return matches;
}
var CRITICAL_CSS_DATA_ATTRIBUTE = "data-react-router-critical-css";
function Links({ nonce }) {
  let { isSpaMode, manifest, routeModules, criticalCss } = useFrameworkContext();
  let { errors, matches: routerMatches } = useDataRouterStateContext();
  let matches = getActiveMatches(routerMatches, errors, isSpaMode);
  let keyedLinks = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => getKeyedLinksForMatches(matches, routeModules, manifest),
    [matches, routeModules, manifest]
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, typeof criticalCss === "string" ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "style",
    {
      ...{ [CRITICAL_CSS_DATA_ATTRIBUTE]: "" },
      dangerouslySetInnerHTML: { __html: criticalCss }
    }
  ) : null, typeof criticalCss === "object" ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "link",
    {
      ...{ [CRITICAL_CSS_DATA_ATTRIBUTE]: "" },
      rel: "stylesheet",
      href: criticalCss.href,
      nonce
    }
  ) : null, keyedLinks.map(
    ({ key, link }) => isPageLinkDescriptor(link) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(PrefetchPageLinks, { key, nonce, ...link }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("link", { key, nonce, ...link })
  ));
}
function PrefetchPageLinks({ page, ...linkProps }) {
  let { router } = useDataRouterContext2();
  let matches = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => matchRoutes(router.routes, page, router.basename),
    [router.routes, page, router.basename]
  );
  if (!matches) {
    return null;
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(PrefetchPageLinksImpl, { page, matches, ...linkProps });
}
function useKeyedPrefetchLinks(matches) {
  let { manifest, routeModules } = useFrameworkContext();
  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = react__WEBPACK_IMPORTED_MODULE_0__.useState([]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let interrupted = false;
    void getKeyedPrefetchLinks(matches, manifest, routeModules).then(
      (links) => {
        if (!interrupted) {
          setKeyedPrefetchLinks(links);
        }
      }
    );
    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);
  return keyedPrefetchLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location = useLocation();
  let { manifest, routeModules } = useFrameworkContext();
  let { basename } = useDataRouterContext2();
  let { loaderData, matches } = useDataRouterStateContext();
  let newMatchesForData = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location,
      "data"
    ),
    [page, nextMatches, matches, manifest, location]
  );
  let newMatchesForAssets = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location,
      "assets"
    ),
    [page, nextMatches, matches, manifest, location]
  );
  let dataHrefs = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    if (page === location.pathname + location.search + location.hash) {
      return [];
    }
    let routesParams = /* @__PURE__ */ new Set();
    let foundOptOutRoute = false;
    nextMatches.forEach((m) => {
      let manifestRoute = manifest.routes[m.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return;
      }
      if (!newMatchesForData.some((m2) => m2.route.id === m.route.id) && m.route.id in loaderData && routeModules[m.route.id]?.shouldRevalidate) {
        foundOptOutRoute = true;
      } else if (manifestRoute.hasClientLoader) {
        foundOptOutRoute = true;
      } else {
        routesParams.add(m.route.id);
      }
    });
    if (routesParams.size === 0) {
      return [];
    }
    let url = singleFetchUrl(page, basename, "data");
    if (foundOptOutRoute && routesParams.size > 0) {
      url.searchParams.set(
        "_routes",
        nextMatches.filter((m) => routesParams.has(m.route.id)).map((m) => m.route.id).join(",")
      );
    }
    return [url.pathname + url.search];
  }, [
    basename,
    loaderData,
    location,
    manifest,
    newMatchesForData,
    nextMatches,
    page,
    routeModules
  ]);
  let moduleHrefs = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => getModuleLinkHrefs(newMatchesForAssets, manifest),
    [newMatchesForAssets, manifest]
  );
  let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("link", { key: href, rel: "prefetch", as: "fetch", href, ...linkProps })), moduleHrefs.map((href) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("link", { key: href, rel: "modulepreload", href, ...linkProps })), keyedPrefetchLinks.map(({ key, link }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("link", { key, nonce: linkProps.nonce, ...link })
  )));
}
function Meta() {
  let { isSpaMode, routeModules } = useFrameworkContext();
  let {
    errors,
    matches: routerMatches,
    loaderData
  } = useDataRouterStateContext();
  let location = useLocation();
  let _matches = getActiveMatches(routerMatches, errors, isSpaMode);
  let error = null;
  if (errors) {
    error = errors[_matches[_matches.length - 1].route.id];
  }
  let meta = [];
  let leafMeta = null;
  let matches = [];
  for (let i = 0; i < _matches.length; i++) {
    let _match = _matches[i];
    let routeId = _match.route.id;
    let data2 = loaderData[routeId];
    let params = _match.params;
    let routeModule = routeModules[routeId];
    let routeMeta = [];
    let match = {
      id: routeId,
      data: data2,
      loaderData: data2,
      meta: [],
      params: _match.params,
      pathname: _match.pathname,
      handle: _match.route.handle,
      error
    };
    matches[i] = match;
    if (routeModule?.meta) {
      routeMeta = typeof routeModule.meta === "function" ? routeModule.meta({
        data: data2,
        loaderData: data2,
        params,
        location,
        matches,
        error
      }) : Array.isArray(routeModule.meta) ? [...routeModule.meta] : routeModule.meta;
    } else if (leafMeta) {
      routeMeta = [...leafMeta];
    }
    routeMeta = routeMeta || [];
    if (!Array.isArray(routeMeta)) {
      throw new Error(
        "The route at " + _match.route.path + " returns an invalid value. All route meta functions must return an array of meta objects.\n\nTo reference the meta function API, see https://remix.run/route/meta"
      );
    }
    match.meta = routeMeta;
    matches[i] = match;
    meta = [...routeMeta];
    leafMeta = meta;
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, meta.flat().map((metaProps) => {
    if (!metaProps) {
      return null;
    }
    if ("tagName" in metaProps) {
      let { tagName, ...rest } = metaProps;
      if (!isValidMetaTag(tagName)) {
        console.warn(
          `A meta object uses an invalid tagName: ${tagName}. Expected either 'link' or 'meta'`
        );
        return null;
      }
      let Comp = tagName;
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Comp, { key: JSON.stringify(rest), ...rest });
    }
    if ("title" in metaProps) {
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", { key: "title" }, String(metaProps.title));
    }
    if ("charset" in metaProps) {
      metaProps.charSet ?? (metaProps.charSet = metaProps.charset);
      delete metaProps.charset;
    }
    if ("charSet" in metaProps && metaProps.charSet != null) {
      return typeof metaProps.charSet === "string" ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("meta", { key: "charSet", charSet: metaProps.charSet }) : null;
    }
    if ("script:ld+json" in metaProps) {
      try {
        let json = JSON.stringify(metaProps["script:ld+json"]);
        return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
          "script",
          {
            key: `script:ld+json:${json}`,
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: escapeHtml(json) }
          }
        );
      } catch (err) {
        return null;
      }
    }
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("meta", { key: JSON.stringify(metaProps), ...metaProps });
  }));
}
function isValidMetaTag(tagName) {
  return typeof tagName === "string" && /^(meta|link)$/.test(tagName);
}
var isHydrated = false;
function setIsHydrated() {
  isHydrated = true;
}
function Scripts(scriptProps) {
  let {
    manifest,
    serverHandoffString,
    isSpaMode,
    renderMeta,
    routeDiscovery,
    ssr
  } = useFrameworkContext();
  let { router, static: isStatic, staticContext } = useDataRouterContext2();
  let { matches: routerMatches } = useDataRouterStateContext();
  let isRSCRouterContext = useIsRSCRouterContext();
  let enableFogOfWar = isFogOfWarEnabled(routeDiscovery, ssr);
  if (renderMeta) {
    renderMeta.didRenderScripts = true;
  }
  let matches = getActiveMatches(routerMatches, null, isSpaMode);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    setIsHydrated();
  }, []);
  let initialScripts = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    if (isRSCRouterContext) {
      return null;
    }
    let streamScript = "window.__reactRouterContext.stream = new ReadableStream({start(controller){window.__reactRouterContext.streamController = controller;}}).pipeThrough(new TextEncoderStream());";
    let contextScript = staticContext ? `window.__reactRouterContext = ${serverHandoffString};${streamScript}` : " ";
    let routeModulesScript = !isStatic ? " " : `${manifest.hmr?.runtime ? `import ${JSON.stringify(manifest.hmr.runtime)};` : ""}${!enableFogOfWar ? `import ${JSON.stringify(manifest.url)}` : ""};
${matches.map((match, routeIndex) => {
      let routeVarName = `route${routeIndex}`;
      let manifestEntry = manifest.routes[match.route.id];
      invariant2(manifestEntry, `Route ${match.route.id} not found in manifest`);
      let {
        clientActionModule,
        clientLoaderModule,
        clientMiddlewareModule,
        hydrateFallbackModule,
        module
      } = manifestEntry;
      let chunks = [
        ...clientActionModule ? [
          {
            module: clientActionModule,
            varName: `${routeVarName}_clientAction`
          }
        ] : [],
        ...clientLoaderModule ? [
          {
            module: clientLoaderModule,
            varName: `${routeVarName}_clientLoader`
          }
        ] : [],
        ...clientMiddlewareModule ? [
          {
            module: clientMiddlewareModule,
            varName: `${routeVarName}_clientMiddleware`
          }
        ] : [],
        ...hydrateFallbackModule ? [
          {
            module: hydrateFallbackModule,
            varName: `${routeVarName}_HydrateFallback`
          }
        ] : [],
        { module, varName: `${routeVarName}_main` }
      ];
      if (chunks.length === 1) {
        return `import * as ${routeVarName} from ${JSON.stringify(module)};`;
      }
      let chunkImportsSnippet = chunks.map((chunk) => `import * as ${chunk.varName} from "${chunk.module}";`).join("\n");
      let mergedChunksSnippet = `const ${routeVarName} = {${chunks.map((chunk) => `...${chunk.varName}`).join(",")}};`;
      return [chunkImportsSnippet, mergedChunksSnippet].join("\n");
    }).join("\n")}
  ${enableFogOfWar ? (
      // Inline a minimal manifest with the SSR matches
      `window.__reactRouterManifest = ${JSON.stringify(
        getPartialManifest(manifest, router),
        null,
        2
      )};`
    ) : ""}
  window.__reactRouterRouteModules = {${matches.map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`).join(",")}};

import(${JSON.stringify(manifest.entry.module)});`;
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      "script",
      {
        ...scriptProps,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: contextScript },
        type: void 0
      }
    ), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      "script",
      {
        ...scriptProps,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: routeModulesScript },
        type: "module",
        async: true
      }
    ));
  }, []);
  let preloads = isHydrated || isRSCRouterContext ? [] : dedupe(
    manifest.entry.imports.concat(
      getModuleLinkHrefs(matches, manifest, {
        includeHydrateFallback: true
      })
    )
  );
  let sri = typeof manifest.sri === "object" ? manifest.sri : {};
  warnOnce(
    !isRSCRouterContext,
    "The <Scripts /> element is a no-op when using RSC and can be safely removed."
  );
  return isHydrated || isRSCRouterContext ? null : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, typeof manifest.sri === "object" ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "script",
    {
      "rr-importmap": "",
      type: "importmap",
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          integrity: sri
        })
      }
    }
  ) : null, !enableFogOfWar ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "link",
    {
      rel: "modulepreload",
      href: manifest.url,
      crossOrigin: scriptProps.crossOrigin,
      integrity: sri[manifest.url],
      suppressHydrationWarning: true
    }
  ) : null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "link",
    {
      rel: "modulepreload",
      href: manifest.entry.module,
      crossOrigin: scriptProps.crossOrigin,
      integrity: sri[manifest.entry.module],
      suppressHydrationWarning: true
    }
  ), preloads.map((path) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "link",
    {
      key: path,
      rel: "modulepreload",
      href: path,
      crossOrigin: scriptProps.crossOrigin,
      integrity: sri[path],
      suppressHydrationWarning: true
    }
  )), initialScripts);
}
function dedupe(array) {
  return [...new Set(array)];
}
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

// lib/dom/ssr/errorBoundaries.tsx
var RemixErrorBoundary = class extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = { error: props.error || null, location: props.location };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location) {
      return { error: props.error || null, location: props.location };
    }
    return { error: props.error || state.error, location: state.location };
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
        RemixRootDefaultErrorBoundary,
        {
          error: this.state.error,
          isOutsideRemixApp: true
        }
      );
    } else {
      return this.props.children;
    }
  }
};
function RemixRootDefaultErrorBoundary({
  error,
  isOutsideRemixApp
}) {
  console.error(error);
  let heyDeveloper = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "script",
    {
      dangerouslySetInnerHTML: {
        __html: `
        console.log(
          "\u{1F4BF} Hey developer \u{1F44B}. You can provide a way better UX than this when your app throws errors. Check out https://reactrouter.com/how-to/error-boundary for more information."
        );
      `
      }
    }
  );
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(BoundaryShell, { title: "Unhandled Thrown Response!" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", { style: { fontSize: "24px" } }, error.status, " ", error.statusText), ENABLE_DEV_WARNINGS ? heyDeveloper : null);
  }
  let errorInstance;
  if (error instanceof Error) {
    errorInstance = error;
  } else {
    let errorString = error == null ? "Unknown Error" : typeof error === "object" && "toString" in error ? error.toString() : JSON.stringify(error);
    errorInstance = new Error(errorString);
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    BoundaryShell,
    {
      title: "Application Error!",
      isOutsideRemixApp
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", { style: { fontSize: "24px" } }, "Application Error"),
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      "pre",
      {
        style: {
          padding: "2rem",
          background: "hsla(10, 50%, 50%, 0.1)",
          color: "red",
          overflow: "auto"
        }
      },
      errorInstance.stack
    ),
    heyDeveloper
  );
}
function BoundaryShell({
  title,
  renderScripts,
  isOutsideRemixApp,
  children
}) {
  let { routeModules } = useFrameworkContext();
  if (routeModules.root?.Layout && !isOutsideRemixApp) {
    return children;
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("html", { lang: "en" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("head", null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("meta", { charSet: "utf-8" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "meta",
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover"
    }
  ), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", null, title)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("body", null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("main", { style: { fontFamily: "system-ui, sans-serif", padding: "2rem" } }, children, renderScripts ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Scripts, null) : null)));
}

// lib/dom/lib.tsx

var isBrowser2 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
try {
  if (isBrowser2) {
    window.__reactRouterVersion = // @ts-expect-error
    "7.11.0";
  }
} catch (e) {
}
function createBrowserRouter(routes, opts) {
  return createRouter({
    basename: opts?.basename,
    getContext: opts?.getContext,
    future: opts?.future,
    history: createBrowserHistory({ window: opts?.window }),
    hydrationData: opts?.hydrationData || parseHydrationData(),
    routes,
    mapRouteProperties,
    hydrationRouteProperties,
    dataStrategy: opts?.dataStrategy,
    patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
    window: opts?.window,
    unstable_instrumentations: opts?.unstable_instrumentations
  }).initialize();
}
function createHashRouter(routes, opts) {
  return createRouter({
    basename: opts?.basename,
    getContext: opts?.getContext,
    future: opts?.future,
    history: createHashHistory({ window: opts?.window }),
    hydrationData: opts?.hydrationData || parseHydrationData(),
    routes,
    mapRouteProperties,
    hydrationRouteProperties,
    dataStrategy: opts?.dataStrategy,
    patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
    window: opts?.window,
    unstable_instrumentations: opts?.unstable_instrumentations
  }).initialize();
}
function parseHydrationData() {
  let state = window?.__staticRouterHydrationData;
  if (state && state.errors) {
    state = {
      ...state,
      errors: deserializeErrors(state.errors)
    };
  }
  return state;
}
function deserializeErrors(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new ErrorResponseImpl(
        val.status,
        val.statusText,
        val.data,
        val.internal === true
      );
    } else if (val && val.__type === "Error") {
      if (val.__subType) {
        let ErrorConstructor = window[val.__subType];
        if (typeof ErrorConstructor === "function") {
          try {
            let error = new ErrorConstructor(val.message);
            error.stack = "";
            serialized[key] = error;
          } catch (e) {
          }
        }
      }
      if (serialized[key] == null) {
        let error = new Error(val.message);
        error.stack = "";
        serialized[key] = error;
      }
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
function BrowserRouter({
  basename,
  children,
  unstable_useTransitions,
  window: window2
}) {
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window: window2, v5Compat: true });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        react__WEBPACK_IMPORTED_MODULE_0__.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
function HashRouter({
  basename,
  children,
  unstable_useTransitions,
  window: window2
}) {
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = createHashHistory({ window: window2, v5Compat: true });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        react__WEBPACK_IMPORTED_MODULE_0__.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
function HistoryRouter({
  basename,
  children,
  history,
  unstable_useTransitions
}) {
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        react__WEBPACK_IMPORTED_MODULE_0__.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
HistoryRouter.displayName = "unstable_HistoryRouter";
var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var Link = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  function LinkWithRef({
    onClick,
    discover = "render",
    prefetch = "none",
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition,
    unstable_defaultShouldRevalidate,
    ...rest
  }, forwardedRef) {
    let { basename, unstable_useTransitions } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
    let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX2.test(to);
    let parsed = parseToInfo(to, basename);
    to = parsed.to;
    let href = useHref(to, { relative });
    let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(
      prefetch,
      rest
    );
    let internalOnClick = useLinkClickHandler(to, {
      replace: replace2,
      state,
      target,
      preventScrollReset,
      relative,
      viewTransition,
      unstable_defaultShouldRevalidate,
      unstable_useTransitions
    });
    function handleClick(event) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        internalOnClick(event);
      }
    }
    let link = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
        "a",
        {
          ...rest,
          ...prefetchHandlers,
          href: parsed.absoluteURL || href,
          onClick: parsed.isExternal || reloadDocument ? onClick : handleClick,
          ref: mergeRefs(forwardedRef, prefetchRef),
          target,
          "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
        }
      )
    );
    return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, link, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(PrefetchPageLinks, { page: href })) : link;
  }
);
Link.displayName = "Link";
var NavLink = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  function NavLinkWithRef({
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children,
    ...rest
  }, ref) {
    let path = useResolvedPath(to, { relative: rest.relative });
    let location = useLocation();
    let routerState = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterStateContext);
    let { navigator, basename } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
    let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useViewTransitionState(path) && viewTransition === true;
    let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
    let locationPathname = location.pathname;
    let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase();
      nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
      toPathname = toPathname.toLowerCase();
    }
    if (nextLocationPathname && basename) {
      nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
    }
    const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
    let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
    let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
    let renderProps = {
      isActive,
      isPending,
      isTransitioning
    };
    let ariaCurrent = isActive ? ariaCurrentProp : void 0;
    let className;
    if (typeof classNameProp === "function") {
      className = classNameProp(renderProps);
    } else {
      className = [
        classNameProp,
        isActive ? "active" : null,
        isPending ? "pending" : null,
        isTransitioning ? "transitioning" : null
      ].filter(Boolean).join(" ");
    }
    let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      Link,
      {
        ...rest,
        "aria-current": ariaCurrent,
        className,
        ref,
        style,
        to,
        viewTransition
      },
      typeof children === "function" ? children(renderProps) : children
    );
  }
);
NavLink.displayName = "NavLink";
var Form = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({
    discover = "render",
    fetcherKey,
    navigate,
    reloadDocument,
    replace: replace2,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    viewTransition,
    unstable_defaultShouldRevalidate,
    ...props
  }, forwardedRef) => {
    let { unstable_useTransitions } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
    let submit = useSubmit();
    let formAction = useFormAction(action, { relative });
    let formMethod = method.toLowerCase() === "get" ? "get" : "post";
    let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX2.test(action);
    let submitHandler = (event) => {
      onSubmit && onSubmit(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      let submitter = event.nativeEvent.submitter;
      let submitMethod = submitter?.getAttribute("formmethod") || method;
      let doSubmit = () => submit(submitter || event.currentTarget, {
        fetcherKey,
        method: submitMethod,
        navigate,
        replace: replace2,
        state,
        relative,
        preventScrollReset,
        viewTransition,
        unstable_defaultShouldRevalidate
      });
      if (unstable_useTransitions && navigate !== false) {
        react__WEBPACK_IMPORTED_MODULE_0__.startTransition(() => doSubmit());
      } else {
        doSubmit();
      }
    };
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      "form",
      {
        ref: forwardedRef,
        method: formMethod,
        action: formAction,
        onSubmit: reloadDocument ? onSubmit : submitHandler,
        ...props,
        "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
      }
    );
  }
);
Form.displayName = "Form";
function ScrollRestoration({
  getKey,
  storageKey,
  ...props
}) {
  let remixContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(FrameworkContext);
  let { basename } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  useScrollRestoration({ getKey, storageKey });
  let ssrKey = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => {
      if (!remixContext || !getKey) return null;
      let userKey = getScrollRestorationKey(
        location,
        matches,
        basename,
        getKey
      );
      return userKey !== location.key ? userKey : null;
    },
    // Nah, we only need this the first time for the SSR render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (!remixContext || remixContext.isSpaMode) {
    return null;
  }
  let restoreScroll = ((storageKey2, restoreKey) => {
    if (!window.history.state || !window.history.state.key) {
      let key = Math.random().toString(32).slice(2);
      window.history.replaceState({ key }, "");
    }
    try {
      let positions = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
      let storedY = positions[restoreKey || window.history.state.key];
      if (typeof storedY === "number") {
        window.scrollTo(0, storedY);
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem(storageKey2);
    }
  }).toString();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "script",
    {
      ...props,
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: `(${restoreScroll})(${JSON.stringify(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY
        )}, ${JSON.stringify(ssrKey)})`
      }
    }
  );
}
ScrollRestoration.displayName = "ScrollRestoration";
function getDataRouterConsoleError2(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext3(hookName) {
  let ctx = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError2(hookName));
  return ctx;
}
function useDataRouterState2(hookName) {
  let state = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterStateContext);
  invariant(state, getDataRouterConsoleError2(hookName));
  return state;
}
function useLinkClickHandler(to, {
  target,
  replace: replaceProp,
  state,
  preventScrollReset,
  relative,
  viewTransition,
  unstable_defaultShouldRevalidate,
  unstable_useTransitions
} = {}) {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, { relative });
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (event) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();
        let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
        let doNavigate = () => navigate(to, {
          replace: replace2,
          state,
          preventScrollReset,
          relative,
          viewTransition,
          unstable_defaultShouldRevalidate
        });
        if (unstable_useTransitions) {
          react__WEBPACK_IMPORTED_MODULE_0__.startTransition(() => doNavigate());
        } else {
          doNavigate();
        }
      }
    },
    [
      location,
      navigate,
      path,
      replaceProp,
      state,
      target,
      to,
      preventScrollReset,
      relative,
      viewTransition,
      unstable_defaultShouldRevalidate,
      unstable_useTransitions
    ]
  );
}
function useSearchParams(defaultInit) {
  warning(
    typeof URLSearchParams !== "undefined",
    `You cannot use the \`useSearchParams\` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.`
  );
  let defaultSearchParamsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  let location = useLocation();
  let searchParams = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      getSearchParamsForLocation(
        location.search,
        hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current
      )
    ),
    [location.search]
  );
  let navigate = useNavigate();
  let setSearchParams = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (nextInit, navigateOptions) => {
      const newSearchParams = createSearchParams(
        typeof nextInit === "function" ? nextInit(new URLSearchParams(searchParams)) : nextInit
      );
      hasSetSearchParamsRef.current = true;
      navigate("?" + newSearchParams, navigateOptions);
    },
    [navigate, searchParams]
  );
  return [searchParams, setSearchParams];
}
var fetcherId = 0;
var getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
function useSubmit() {
  let { router } = useDataRouterContext3("useSubmit" /* UseSubmit */);
  let { basename } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let currentRouteId = useRouteId();
  let routerFetch = router.fetch;
  let routerNavigate = router.navigate;
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    async (target, options = {}) => {
      let { action, method, encType, formData, body } = getFormSubmissionInfo(
        target,
        basename
      );
      if (options.navigate === false) {
        let key = options.fetcherKey || getUniqueFetcherId();
        await routerFetch(key, currentRouteId, options.action || action, {
          unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          flushSync: options.flushSync
        });
      } else {
        await routerNavigate(options.action || action, {
          unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          replace: options.replace,
          state: options.state,
          fromRouteId: currentRouteId,
          flushSync: options.flushSync,
          viewTransition: options.viewTransition
        });
      }
    },
    [routerFetch, routerNavigate, basename, currentRouteId]
  );
}
function useFormAction(action, { relative } = {}) {
  let { basename } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let routeContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  invariant(routeContext, "useFormAction must be used inside a RouteContext");
  let [match] = routeContext.matches.slice(-1);
  let path = { ...useResolvedPath(action ? action : ".", { relative }) };
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v) => v === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function useFetcher({
  key
} = {}) {
  let { router } = useDataRouterContext3("useFetcher" /* UseFetcher */);
  let state = useDataRouterState2("useFetcher" /* UseFetcher */);
  let fetcherData = react__WEBPACK_IMPORTED_MODULE_0__.useContext(FetchersContext);
  let route = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeId = route.matches[route.matches.length - 1]?.route.id;
  invariant(fetcherData, `useFetcher must be used inside a FetchersContext`);
  invariant(route, `useFetcher must be used inside a RouteContext`);
  invariant(
    routeId != null,
    `useFetcher can only be used on routes that contain a unique "id"`
  );
  let defaultKey = react__WEBPACK_IMPORTED_MODULE_0__.useId();
  let [fetcherKey, setFetcherKey] = react__WEBPACK_IMPORTED_MODULE_0__.useState(key || defaultKey);
  if (key && key !== fetcherKey) {
    setFetcherKey(key);
  }
  let { deleteFetcher, getFetcher, resetFetcher, fetch: routerFetch } = router;
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    getFetcher(fetcherKey);
    return () => deleteFetcher(fetcherKey);
  }, [deleteFetcher, getFetcher, fetcherKey]);
  let load = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    async (href, opts) => {
      invariant(routeId, "No routeId available for fetcher.load()");
      await routerFetch(fetcherKey, routeId, href, opts);
    },
    [fetcherKey, routeId, routerFetch]
  );
  let submitImpl = useSubmit();
  let submit = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    async (target, opts) => {
      await submitImpl(target, {
        ...opts,
        navigate: false,
        fetcherKey
      });
    },
    [fetcherKey, submitImpl]
  );
  let reset = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (opts) => resetFetcher(fetcherKey, opts),
    [resetFetcher, fetcherKey]
  );
  let FetcherForm = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    let FetcherForm2 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
      (props, ref) => {
        return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Form, { ...props, navigate: false, fetcherKey, ref });
      }
    );
    FetcherForm2.displayName = "fetcher.Form";
    return FetcherForm2;
  }, [fetcherKey]);
  let fetcher = state.fetchers.get(fetcherKey) || IDLE_FETCHER;
  let data2 = fetcherData.get(fetcherKey);
  let fetcherWithComponents = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => ({
      Form: FetcherForm,
      submit,
      load,
      reset,
      ...fetcher,
      data: data2
    }),
    [FetcherForm, submit, load, reset, fetcher, data2]
  );
  return fetcherWithComponents;
}
function useFetchers() {
  let state = useDataRouterState2("useFetchers" /* UseFetchers */);
  return Array.from(state.fetchers.entries()).map(([key, fetcher]) => ({
    ...fetcher,
    key
  }));
}
var SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
var savedScrollPositions = {};
function getScrollRestorationKey(location, matches, basename, getKey) {
  let key = null;
  if (getKey) {
    if (basename !== "/") {
      key = getKey(
        {
          ...location,
          pathname: stripBasename(location.pathname, basename) || location.pathname
        },
        matches
      );
    } else {
      key = getKey(location, matches);
    }
  }
  if (key == null) {
    key = location.key;
  }
  return key;
}
function useScrollRestoration({
  getKey,
  storageKey
} = {}) {
  let { router } = useDataRouterContext3("useScrollRestoration" /* UseScrollRestoration */);
  let { restoreScrollPosition, preventScrollReset } = useDataRouterState2(
    "useScrollRestoration" /* UseScrollRestoration */
  );
  let { basename } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  let navigation = useNavigation();
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);
  usePageHide(
    react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
      if (navigation.state === "idle") {
        let key = getScrollRestorationKey(location, matches, basename, getKey);
        savedScrollPositions[key] = window.scrollY;
      }
      try {
        sessionStorage.setItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY,
          JSON.stringify(savedScrollPositions)
        );
      } catch (error) {
        warning(
          false,
          `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${error}).`
        );
      }
      window.history.scrollRestoration = "auto";
    }, [navigation.state, getKey, basename, location, matches, storageKey])
  );
  if (typeof document !== "undefined") {
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      try {
        let sessionPositions = sessionStorage.getItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY
        );
        if (sessionPositions) {
          savedScrollPositions = JSON.parse(sessionPositions);
        }
      } catch (e) {
      }
    }, [storageKey]);
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      let disableScrollRestoration = router?.enableScrollRestoration(
        savedScrollPositions,
        () => window.scrollY,
        getKey ? (location2, matches2) => getScrollRestorationKey(location2, matches2, basename, getKey) : void 0
      );
      return () => disableScrollRestoration && disableScrollRestoration();
    }, [router, basename, getKey]);
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      if (restoreScrollPosition === false) {
        return;
      }
      if (typeof restoreScrollPosition === "number") {
        window.scrollTo(0, restoreScrollPosition);
        return;
      }
      try {
        if (location.hash) {
          let el = document.getElementById(
            decodeURIComponent(location.hash.slice(1))
          );
          if (el) {
            el.scrollIntoView();
            return;
          }
        }
      } catch {
        warning(
          false,
          `"${location.hash.slice(
            1
          )}" is not a decodable element ID. The view will not scroll to it.`
        );
      }
      if (preventScrollReset === true) {
        return;
      }
      window.scrollTo(0, 0);
    }, [location, restoreScrollPosition, preventScrollReset]);
  }
}
function useBeforeUnload(callback, options) {
  let { capture } = options || {};
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let opts = capture != null ? { capture } : void 0;
    window.addEventListener("beforeunload", callback, opts);
    return () => {
      window.removeEventListener("beforeunload", callback, opts);
    };
  }, [callback, capture]);
}
function usePageHide(callback, options) {
  let { capture } = options || {};
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let opts = capture != null ? { capture } : void 0;
    window.addEventListener("pagehide", callback, opts);
    return () => {
      window.removeEventListener("pagehide", callback, opts);
    };
  }, [callback, capture]);
}
function usePrompt({
  when,
  message
}) {
  let blocker = useBlocker(when);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blocker.state === "blocked") {
      let proceed = window.confirm(message);
      if (proceed) {
        setTimeout(blocker.proceed, 0);
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blocker.state === "blocked" && !when) {
      blocker.reset();
    }
  }, [blocker, when]);
}
function useViewTransitionState(to, { relative } = {}) {
  let vtContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ViewTransitionContext);
  invariant(
    vtContext != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename } = useDataRouterContext3(
    "useViewTransitionState" /* useViewTransitionState */
  );
  let path = useResolvedPath(to, { relative });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}

// lib/dom/server.tsx

function StaticRouter({
  basename,
  children,
  location: locationProp = "/"
}) {
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let action = "POP" /* Pop */;
  let location = {
    pathname: locationProp.pathname || "/",
    search: locationProp.search || "",
    hash: locationProp.hash || "",
    state: locationProp.state != null ? locationProp.state : null,
    key: locationProp.key || "default"
  };
  let staticNavigator = getStatelessNavigator();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    Router,
    {
      basename,
      children,
      location,
      navigationType: action,
      navigator: staticNavigator,
      static: true,
      unstable_useTransitions: false
    }
  );
}
function StaticRouterProvider({
  context,
  router,
  hydrate: hydrate2 = true,
  nonce
}) {
  invariant(
    router && context,
    "You must provide `router` and `context` to <StaticRouterProvider>"
  );
  let dataRouterContext = {
    router,
    navigator: getStatelessNavigator(),
    static: true,
    staticContext: context,
    basename: context.basename || "/"
  };
  let fetchersContext = /* @__PURE__ */ new Map();
  let hydrateScript = "";
  if (hydrate2 !== false) {
    let data2 = {
      loaderData: context.loaderData,
      actionData: context.actionData,
      errors: serializeErrors(context.errors)
    };
    let json = htmlEscape(JSON.stringify(JSON.stringify(data2)));
    hydrateScript = `window.__staticRouterHydrationData = JSON.parse(${json});`;
  }
  let { state } = dataRouterContext.router;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRouterContext.Provider, { value: dataRouterContext }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRouterStateContext.Provider, { value: state }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(FetchersContext.Provider, { value: fetchersContext }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ViewTransitionContext.Provider, { value: { isTransitioning: false } }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    Router,
    {
      basename: dataRouterContext.basename,
      location: state.location,
      navigationType: state.historyAction,
      navigator: dataRouterContext.navigator,
      static: dataRouterContext.static,
      unstable_useTransitions: false
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      DataRoutes2,
      {
        routes: router.routes,
        future: router.future,
        state
      }
    )
  ))))), hydrateScript ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "script",
    {
      suppressHydrationWarning: true,
      nonce,
      dangerouslySetInnerHTML: { __html: hydrateScript }
    }
  ) : null);
}
function DataRoutes2({
  routes,
  future,
  state
}) {
  return useRoutesImpl(routes, void 0, state, void 0, future);
}
function serializeErrors(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (isRouteErrorResponse(val)) {
      serialized[key] = { ...val, __type: "RouteErrorResponse" };
    } else if (val instanceof Error) {
      serialized[key] = {
        message: val.message,
        __type: "Error",
        // If this is a subclass (i.e., ReferenceError), send up the type so we
        // can re-create the same type during hydration.
        ...val.name !== "Error" ? {
          __subType: val.name
        } : {}
      };
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
function getStatelessNavigator() {
  return {
    createHref,
    encodeLocation,
    push(to) {
      throw new Error(
        `You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`
      );
    },
    replace(to) {
      throw new Error(
        `You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`
      );
    },
    go(delta) {
      throw new Error(
        `You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`
      );
    },
    back() {
      throw new Error(
        `You cannot use navigator.back() on the server because it is a stateless environment.`
      );
    },
    forward() {
      throw new Error(
        `You cannot use navigator.forward() on the server because it is a stateless environment.`
      );
    }
  };
}
function createStaticHandler2(routes, opts) {
  return createStaticHandler(routes, {
    ...opts,
    mapRouteProperties
  });
}
function createStaticRouter(routes, context, opts = {}) {
  let manifest = {};
  let dataRoutes = convertRoutesToDataRoutes(
    routes,
    mapRouteProperties,
    void 0,
    manifest
  );
  let matches = context.matches.map((match) => {
    let route = manifest[match.route.id] || match.route;
    return {
      ...match,
      route
    };
  });
  let msg = (method) => `You cannot use router.${method}() on the server because it is a stateless environment`;
  return {
    get basename() {
      return context.basename;
    },
    get future() {
      return {
        v8_middleware: false,
        ...opts?.future
      };
    },
    get state() {
      return {
        historyAction: "POP" /* Pop */,
        location: context.location,
        matches,
        loaderData: context.loaderData,
        actionData: context.actionData,
        errors: context.errors,
        initialized: true,
        navigation: IDLE_NAVIGATION,
        restoreScrollPosition: null,
        preventScrollReset: false,
        revalidation: "idle",
        fetchers: /* @__PURE__ */ new Map(),
        blockers: /* @__PURE__ */ new Map()
      };
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return void 0;
    },
    initialize() {
      throw msg("initialize");
    },
    subscribe() {
      throw msg("subscribe");
    },
    enableScrollRestoration() {
      throw msg("enableScrollRestoration");
    },
    navigate() {
      throw msg("navigate");
    },
    fetch() {
      throw msg("fetch");
    },
    revalidate() {
      throw msg("revalidate");
    },
    createHref,
    encodeLocation,
    getFetcher() {
      return IDLE_FETCHER;
    },
    deleteFetcher() {
      throw msg("deleteFetcher");
    },
    resetFetcher() {
      throw msg("resetFetcher");
    },
    dispose() {
      throw msg("dispose");
    },
    getBlocker() {
      return IDLE_BLOCKER;
    },
    deleteBlocker() {
      throw msg("deleteBlocker");
    },
    patchRoutes() {
      throw msg("patchRoutes");
    },
    _internalFetchControllers: /* @__PURE__ */ new Map(),
    _internalSetRoutes() {
      throw msg("_internalSetRoutes");
    },
    _internalSetStateDoNotUseOrYouWillBreakYourApp() {
      throw msg("_internalSetStateDoNotUseOrYouWillBreakYourApp");
    }
  };
}
function createHref(to) {
  return typeof to === "string" ? to : createPath(to);
}
function encodeLocation(to) {
  let href = typeof to === "string" ? to : createPath(to);
  href = href.replace(/ $/, "%20");
  let encoded = ABSOLUTE_URL_REGEX3.test(href) ? new URL(href) : new URL(href, "http://localhost");
  return {
    pathname: encoded.pathname,
    search: encoded.search,
    hash: encoded.hash
  };
}
var ABSOLUTE_URL_REGEX3 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var ESCAPE_LOOKUP2 = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var ESCAPE_REGEX2 = /[&><\u2028\u2029]/g;
function htmlEscape(str) {
  return str.replace(ESCAPE_REGEX2, (match) => ESCAPE_LOOKUP2[match]);
}




/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"dashboard": 0,
/******/ 			"blocks/pdf-poster/style-index": 0,
/******/ 			"./style-dashboard": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkpdf_poster"] = globalThis["webpackChunkpdf_poster"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["blocks/pdf-poster/style-index","./style-dashboard"], () => (__webpack_require__("./src/dashboard/admin.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=dashboard.js.map