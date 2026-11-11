/**
 * Cover look -- mirror of PDFP_Cover::STYLE_DEFAULTS / style_attrs()
 * (includes/rest/class-pdfp-cover.php). Keep defaults, classes and custom properties
 * in step with the PHP side: render.php prints the cover first and React redraws it.
 *
 * On the front end render.php has already sanitised coverStyle; in the editor the
 * values come straight from the controls, so numbers are clamped here too.
 */
export const COVER_STYLE_DEFAULTS = {
  bgOn: true,
  bg: "#525659",
  radius: 4,
  height: "viewer", // viewer | auto
  fit: "contain", // contain | cover
  imgWidth: 100, // % of the box
  shadow: true,
  btnPos: "below", // below | bottom | center | none
  btnBg: "#2271b1",
  btnColor: "#ffffff",
  btnHoverBg: "#135e96",
  btnHoverColor: "#ffffff",
  btnSize: 15,
  btnRadius: 4,
  btnPadding: { top: 11, right: 20, bottom: 11, left: 20 },
};

const clamp = (value, fallback, min, max) => {
  const n = Number(value);
  return Number.isFinite(n) && value !== "" && value !== null ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};
const oneOf = (value, list, fallback) => (list.includes(value) ? value : fallback);

/**
 * A complete design: `input`'s own values on top of `base` (the site design in the
 * editor; on the front end render.php already sent a complete object).
 */
export const normalizeCoverStyle = (input, base = COVER_STYLE_DEFAULTS) => {
  const s = input && typeof input === "object" ? input : {};
  const d = base && typeof base === "object" ? { ...COVER_STYLE_DEFAULTS, ...base } : COVER_STYLE_DEFAULTS;
  const p = s.btnPadding && typeof s.btnPadding === "object" ? s.btnPadding : {};
  return {
    bgOn: s.bgOn === undefined ? d.bgOn : !!s.bgOn,
    bg: s.bg || d.bg,
    radius: clamp(s.radius, d.radius, 0, 80),
    height: oneOf(s.height, ["viewer", "auto"], d.height),
    fit: oneOf(s.fit, ["contain", "cover"], d.fit),
    imgWidth: clamp(s.imgWidth, d.imgWidth, 10, 100),
    shadow: s.shadow === undefined ? d.shadow : !!s.shadow,
    btnPos: oneOf(s.btnPos, ["below", "bottom", "center", "none"], d.btnPos),
    btnBg: s.btnBg || d.btnBg,
    btnColor: s.btnColor || d.btnColor,
    btnHoverBg: s.btnHoverBg || d.btnHoverBg,
    btnHoverColor: s.btnHoverColor || d.btnHoverColor,
    btnSize: clamp(s.btnSize, d.btnSize, 10, 40),
    btnRadius: clamp(s.btnRadius, d.btnRadius, 0, 60),
    btnPadding: {
      top: clamp(p.top, d.btnPadding.top, 0, 80),
      right: clamp(p.right, d.btnPadding.right, 0, 120),
      bottom: clamp(p.bottom, d.btnPadding.bottom, 0, 80),
      left: clamp(p.left, d.btnPadding.left, 0, 120),
    },
  };
};

const pick = (value, key) => (value && typeof value === "object" ? value[key] : value);

/** { className, style, showButton } for the .pdfp_cover box. */
export const coverBoxProps = (attributes, base = COVER_STYLE_DEFAULTS) => {
  const s = normalizeCoverStyle(attributes.coverStyle, base);
  const { height, width } = attributes;
  const desktopH = pick(height, "desktop") || "600px";
  const p = s.btnPadding;

  const className = [
    "pdfp_cover",
    `pdfp_cover--btn-${s.btnPos}`,
    `pdfp_cover--fit-${s.fit}`,
    s.height === "auto" && "pdfp_cover--h-auto",
    !s.shadow && "pdfp_cover--flat",
    !s.bgOn && "pdfp_cover--nobg",
  ].filter(Boolean).join(" ");

  const style = {
    "--pdfp-cover-w": pick(width, "desktop") || "100%",
    "--pdfp-cover-h": desktopH,
    "--pdfp-cover-h-t": pick(height, "tablet") || desktopH,
    "--pdfp-cover-h-m": pick(height, "mobile") || desktopH,
    "--pdfp-cover-bg": s.bgOn ? s.bg : "transparent",
    "--pdfp-cover-radius": `${s.radius}px`,
    "--pdfp-cover-img-w": `${s.imgWidth}%`,
    "--pdfp-cover-btn-bg": s.btnBg,
    "--pdfp-cover-btn-color": s.btnColor,
    "--pdfp-cover-btn-hover-bg": s.btnHoverBg,
    "--pdfp-cover-btn-hover-color": s.btnHoverColor,
    "--pdfp-cover-btn-size": `${s.btnSize}px`,
    "--pdfp-cover-btn-radius": `${s.btnRadius}px`,
    "--pdfp-cover-btn-pad": `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`,
  };

  return { className, style, showButton: s.btnPos !== "none" };
};
