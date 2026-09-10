/**
 * Watermark rendering core.
 *
 * ONE builder, four call sites: the PDF.js iframe (via assets/pdfjs-new/web/custom.js),
 * dFlip pages, the container fallback for cross-origin viewers, and the editor preview.
 *
 * The panel stores TOKENS ("subtle", "dense", "diagonal"), never numbers -- this file is
 * the single place they become values. Keep the tables in step with the PHP copy in
 * PDFP_Functions::pdfp_watermark_themes(); if you edit one, edit the other.
 *
 * Why an SVG data URI as a repeating background rather than DOM tiles or canvas painting:
 * one node per page, scales with the page box for free, survives PDF.js re-rendering on
 * zoom (which wipes anything painted onto the page canvas), and it prints.
 */

import toSiteRelativeUrl from "../../../../hooks/utils/toSiteRelativeUrl";

export const STRENGTH = { faint: 8, subtle: 15, medium: 25, strong: 40, solid: 70 };

/**
 * Size = how much of the page WIDTH the mark spans, as a fraction. Deliberately not a
 * font size: "CONFIDENTIAL" and "X" should occupy the same share of the page, which is
 * what Small/Medium/Large mean to a reader. The font size is derived from this and the
 * character count. `fit` spans the page diagonal instead.
 */
export const SIZE = { small: 0.25, medium: 0.42, large: 0.62, fit: 0.95 };

/**
 * Density = tile size as a multiple of the mark's own rotated bounding box, so a tile
 * is always big enough to hold its mark. Absolute pixel gaps cannot work here: the mark
 * scales with the page, so a fixed gap clips the text at every zoom level except one.
 * 1.08 puts marks almost shoulder-to-shoulder; 1.9 leaves a page of air between them.
 */
export const DENSITY = { sparse: 1.9, normal: 1.4, dense: 1.08 };

export const ANGLE = { diagonal: -45, steep: -65, flat: 0, upright: -90 };

/**
 * Mean advance per character for Helvetica Bold, in em. Empirical, measured on
 * uppercase -- the widest case -- so a lowercase mark is sized a shade conservatively
 * rather than running past the page edge.
 */
const AVG_ADVANCE = 0.62;

/** Height of the image mark relative to its width, when we can't measure the asset. */
const IMAGE_RATIO = 0.32;

/**
 * Work out the mark's un-rotated box, its rotated bounding box, and the tile that has
 * to contain it. Shared by the builder and exposed for tests.
 */
export const measureMark = (r, text, pageW, pageH) => {
  const frac = SIZE[r.size] || SIZE.medium;
  const diag = Math.sqrt(pageW * pageW + pageH * pageH);

  // A diagonal-spanning mark only fits because it is rotated; at a flat angle it would
  // run off the page, so clamp it back to the width there.
  const nearFlat = Math.abs(r.deg) < 20 || Math.abs(Math.abs(r.deg) - 180) < 20;
  let targetW = r.size === "fit" ? (nearFlat ? pageW * 0.95 : diag * 0.95) : pageW * frac;

  const tracking = r.tracking != null ? r.tracking : 2;
  const chars = Math.max(1, String(text || "").length);

  let fontSize = 0;
  let markW = 0;
  let markH = 0;

  if (r.markType !== "image") {
    // targetW = chars * (fontSize * AVG) + (chars - 1) * tracking
    fontSize = Math.max(6, (targetW - (chars - 1) * tracking) / (chars * AVG_ADVANCE));
    markW = targetW;
    markH = fontSize * 1.2;
  }

  if (r.markType !== "text") {
    const imgW = r.markType === "both" ? targetW * 0.55 : targetW;
    const imgH = imgW * IMAGE_RATIO;
    if (r.markType === "both") {
      markW = Math.max(markW, imgW);
      markH = imgH + fontSize * 0.55 + markH;
    } else {
      markW = imgW;
      markH = imgH;
    }
  }

  const rad = (Math.abs(r.deg) * Math.PI) / 180;
  let bw = Math.abs(markW * Math.cos(rad)) + Math.abs(markH * Math.sin(rad));
  let bh = Math.abs(markW * Math.sin(rad)) + Math.abs(markH * Math.cos(rad));

  // Nothing may be wider or taller than the page, or the ends of the mark are simply
  // cropped off at the edges.
  //
  // This is what broke "Fit page" on a portrait page. Fit asks for the page diagonal,
  // but a mark at 45 degrees only fits inside a box of markW/sqrt(2) a side -- so the
  // diagonal fits exactly on a square page and overflows on every taller one. A 12
  // character mark on an 800x1000 page came out 996px wide inside 800px, losing its
  // first and last letters.
  //
  // Applied to every size, not just Fit: long text at Large, or a steep angle on a wide
  // page, can overflow the same way. Scaling the whole mark keeps the glyphs in
  // proportion -- clipping the box instead would just crop the text somewhere else.
  const gutter = Math.min(pageW, pageH) * 0.02;
  const shrink = Math.min(1, (pageW - gutter * 2) / bw, (pageH - gutter * 2) / bh);
  if (shrink < 1 && isFinite(shrink) && shrink > 0) {
    fontSize *= shrink;
    markW *= shrink;
    markH *= shrink;
    bw *= shrink;
    bh *= shrink;
  }

  const tiled = r.coverage !== "off";
  let tileW = pageW;
  let tileH = pageH;

  if (tiled) {
    const d = DENSITY[r.coverage] || DENSITY.normal;
    // Round to a whole number of tiles so no half-mark is clipped at the page edge.
    const cols = Math.max(1, Math.round(pageW / (bw * d)));
    const rows = Math.max(1, Math.round(pageH / (bh * d)));
    tileW = pageW / cols;
    tileH = pageH / rows;
  } else {
    // A single mark has to be sized to ITSELF, not to the page. The mark ships as a
    // background image on a layer that is inset:0, so `background-position` can only
    // move an image smaller than that layer -- at page size every position resolved to
    // the same full-bleed image and the Position control did nothing at all.
    //
    // The pad is two things at once: a gutter, so a corner mark doesn't sit flush
    // against the page edge, and slack for this function's estimate -- character
    // advance is averaged, so real ink can run a little wider than `bw`.
    //
    // Clamped to the page because a mark can legitimately be bigger than it ("fit"
    // spans the diagonal); there is nowhere to move such a mark, and the clamp keeps
    // it centred exactly as before.
    const pad = Math.max(Math.min(pageW, pageH) * 0.03, markH * 0.25);
    tileW = Math.min(pageW, bw + pad * 2);
    tileH = Math.min(pageH, bh + pad * 2);
  }

  return { fontSize, markW, markH, boundW: bw, boundH: bh, tileW, tileH, tiled };
};

export const THEMES = {
  confidential: {
    types: ["text"], markType: "text", coverage: "normal", angle: "diagonal",
    strength: "subtle", size: "medium", color: "#808080",
    weight: 700, tracking: 2, position: "center",
  },
  draft: {
    types: ["text"], markType: "text", coverage: "off", angle: "diagonal",
    strength: "strong", size: "large", color: "#AF4A3D",
    weight: 700, tracking: 3, position: "center", outline: true,
  },
  wash: {
    types: ["text"], markType: "text", coverage: "dense", angle: "diagonal",
    strength: "faint", size: "small", color: "#808080",
    weight: 700, tracking: 1, position: "center",
  },
  "brand-corner": {
    types: ["image"], markType: "image", coverage: "off", angle: "flat",
    strength: "solid", size: "small", imageStyle: "original", position: "bottom right",
  },
  "logo-wash": {
    types: ["image"], markType: "image", coverage: "normal", angle: "diagonal",
    strength: "faint", size: "medium", imageStyle: "grayscale", position: "center",
  },
  "logo-caption": {
    types: ["both"], markType: "both", coverage: "off", angle: "diagonal",
    strength: "subtle", size: "large", imageStyle: "original", color: "#808080",
    weight: 600, tracking: 2, position: "center",
  },
  custom: {
    types: ["text", "image", "both"], coverage: "normal", angle: "diagonal",
    strength: "subtle", size: "medium", color: "#808080", imageStyle: "grayscale",
    weight: 700, tracking: 2, position: "center",
  },
};

/** SVG filter primitives per image style. `null` means leave the asset alone. */
const IMAGE_FILTERS = {
  original: null,
  grayscale: '<filter id="f"><feColorMatrix type="saturate" values="0"/></filter>',
  // Flatten to a single colour while keeping the alpha channel, so a dark logo can sit
  // on a dark page. feFlood + feComposite keeps the original silhouette.
  white: '<filter id="f"><feFlood flood-color="#ffffff" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter>',
  black: '<filter id="f"><feFlood flood-color="#16181F" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter>',
};

const escapeXML = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * Only let http(s), protocol-relative, site-relative or data:image URLs into the
 * SVG's href. Escaping already stops an attribute break-out, and a CSS-loaded SVG
 * can't run script -- this is the belt to that braces, and it also means a pasted
 * `javascript:` URL fails visibly (no mark) instead of quietly doing nothing.
 */
const safeImageUrl = (url) => {
  // A logo from this site's own media library is relativised here, at the single gate
  // every consumer passes through: the logo is fetched and inlined, so an absolute
  // internal host would be a cross-origin request on any proxied page and the mark
  // would come back image-less.
  const u = toSiteRelativeUrl(String(url == null ? "" : url).trim());
  if (!u) return "";
  if (/^(https?:)?\/\//i.test(u)) return u;
  if (/^\//.test(u)) return u;
  if (/^data:image\//i.test(u)) return u;
  return "";
};

/**
 * Logo inlining.
 *
 * The mark is delivered as `background-image: url("data:image/svg+xml,...")`. An SVG
 * loaded that way is a *restricted* document: it cannot fetch external resources, so an
 * `<image href="https://site/logo.png">` inside it silently paints nothing. The logo must
 * therefore be embedded as a data URI first.
 *
 * Resolution is async but the builder is sync, so callers paint what they can now and
 * repaint once the logo arrives. Results are cached per URL for the page's lifetime and
 * in sessionStorage across navigations.
 */
const MAX_INLINE_BYTES = 300 * 1024;
const imageCache = new Map();
const imagePending = new Map();
const SS_KEY = "pdfp_wm_logo_";

const ssGet = (url) => {
  try { return window.sessionStorage.getItem(SS_KEY + url) || null; } catch (e) { return null; }
};
const ssSet = (url, val) => {
  try { window.sessionStorage.setItem(SS_KEY + url, val); } catch (e) { /* quota or blocked */ }
};

/** The inlined data URI for this logo, or null if it isn't ready (or can't be used). */
export const getInlinedImage = (url) => {
  const clean = safeImageUrl(url);
  if (!clean) return null;
  if (clean.startsWith("data:")) return clean;
  if (imageCache.has(clean)) return imageCache.get(clean);
  const cached = ssGet(clean);
  if (cached) { imageCache.set(clean, cached); return cached; }
  return null;
};

/**
 * Fetch + encode the logo, then run `onReady`. Safe to call repeatedly: one request per
 * URL, and every waiting caller is notified. `onReady` is NOT called if the logo can't
 * be used -- the cache stores `false` so we never retry a hopeless URL.
 */
export const ensureInlinedImage = (url, onReady) => {
  const clean = safeImageUrl(url);
  if (!clean || clean.startsWith("data:")) return;
  if (imageCache.has(clean)) return;

  if (imagePending.has(clean)) {
    if (onReady) imagePending.get(clean).push(onReady);
    return;
  }
  imagePending.set(clean, onReady ? [onReady] : []);

  const finish = (value) => {
    imageCache.set(clean, value);
    if (value) ssSet(clean, value);
    const waiting = imagePending.get(clean) || [];
    imagePending.delete(clean);
    if (value) waiting.forEach((fn) => { try { fn(value); } catch (e) { /* noop */ } });
  };

  fetch(clean, { credentials: "same-origin" })
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.blob();
    })
    .then((blob) => {
      // A huge logo would be re-encoded into every page's background-image string.
      if (blob.size > MAX_INLINE_BYTES) {
        // eslint-disable-next-line no-console
        console.warn(
          "PDF Poster: watermark logo is " + Math.round(blob.size / 1024) + " KB. " +
          "Logos above " + Math.round(MAX_INLINE_BYTES / 1024) + " KB are not embedded; " +
          "use a smaller PNG or SVG."
        );
        throw new Error("too large");
      }
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => reject(new Error("read failed"));
        fr.readAsDataURL(blob);
      });
    })
    .then((dataUri) => finish(dataUri))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.warn("PDF Poster: could not embed the watermark logo (" + err.message + "). " +
        "Cross-origin logos need CORS headers; prefer a logo from this site's media library.");
      finish(false);
    });
};

/** Lift a colour's lightness so a grey mark stays visible on a dark page. */
export const lightenForDark = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex || ""));
  if (!m) return hex;
  const lift = (v) => Math.round(parseInt(v, 16) + (255 - parseInt(v, 16)) * 0.62);
  return `#${[m[1], m[2], m[3]].map((v) => lift(v).toString(16).padStart(2, "0")).join("")}`;
};

/**
 * The rows a theme owns. Picking a named theme is meant to be the whole decision --
 * "user will just select" -- so these come from the theme table and the panel hides
 * them. Only the Custom theme hands them back.
 *
 * Stored values are left alone in the database rather than cleared: switching to
 * Custom restores whatever was last set there, and nothing is destroyed by trying a
 * preset on for size.
 */
export const THEME_OWNED = [
  "coverage", "angle", "strength", "size", "color", "imageStyle", "position", "outline",
];

/**
 * Tokens in, values out. Anything the panel doesn't expose comes from the theme.
 */
export const resolveWatermark = (cfg = {}, opts = {}) => {
  const theme = THEMES[cfg.theme] || THEMES.confidential;
  const r = { ...theme };

  // Mark type is the user's under every theme -- it decides which themes are offered,
  // not the other way round -- so it overrides regardless. It is clamped to what the
  // theme can actually draw a few lines down.
  if (cfg.markType !== undefined && cfg.markType !== "" && cfg.markType !== null) {
    r.markType = cfg.markType;
  }

  if (cfg.theme === "custom") {
    THEME_OWNED.forEach((k) => {
      if (cfg[k] !== undefined && cfg[k] !== "" && cfg[k] !== null) r[k] = cfg[k];
    });
  }

  // A stored theme that can't render the chosen mark type would show nothing at all.
  if (!(theme.types || []).includes(r.markType)) {
    r.markType = theme.markType || "text";
  }

  r.opacity = (STRENGTH[r.strength] || STRENGTH.subtle) / 100;
  r.deg = ANGLE[r.angle] !== undefined ? ANGLE[r.angle] : ANGLE.diagonal;

  // A mark spanning the page diagonal cannot also repeat.
  if (r.size === "fit") r.coverage = "off";

  // No usable image to draw -- fall back to the text half rather than rendering nothing.
  // "Usable" means inlined: see ensureInlinedImage(). While the logo is still loading an
  // image-only mark resolves to "none" and the caller repaints when it arrives.
  if (r.markType !== "text" && !getInlinedImage(cfg.image)) r.markType = r.markType === "both" ? "text" : "none";

  if (opts.theme === "dark" && r.color) r.color = lightenForDark(r.color);

  // Multiply would render a white mark as invisible.
  r.blend = r.imageStyle === "white" ? "normal" : "multiply";

  return r;
};

/**
 * Substitute the tokens that depend on the page being drawn. Static tokens are already
 * resolved server-side; visitor tokens arrive from the REST route (see `dynamic`).
 */
export const resolveWatermarkText = (text, ctx = {}) => {
  let out = String(text == null ? "" : text);
  const map = {
    "{page}": ctx.page != null ? ctx.page : "",
    "{pages}": ctx.pages != null ? ctx.pages : "",
    "{user_name}": ctx.userName || "",
    "{user_email}": ctx.userEmail || "",
    "{user_ip}": ctx.userIp || "",
  };
  Object.keys(map).forEach((k) => {
    if (map[k] !== "") out = out.split(k).join(map[k]);
  });
  return out;
};

/**
 * Should page N carry a mark?
 *
 * `__total` is unused by the three shipped choices but kept in the signature: page
 * rules that need the document length (last page, every Nth) belong here, and the
 * pdfp_watermark_should_apply filter is already passed the same three arguments.
 */
export const watermarkInScope = (pages, pageNumber, __total) => {
  if (!pages || pages === "all") return true;
  if (pages === "first") return pageNumber === 1;
  if (pages === "except-first") return pageNumber !== 1;
  return true;
};

/**
 * Build the CSS background value for one page box.
 * Returns null when there is nothing to draw.
 */
export const buildWatermarkSVG = (cfg, pageW, pageH, opts = {}) => {
  if (!cfg || !cfg.enabled || !pageW || !pageH) return null;

  const r = resolveWatermark(cfg, opts);
  if (r.markType === "none") return null;

  const text = resolveWatermarkText(cfg.text, opts);
  const hasText = r.markType !== "image" && String(text).trim() !== "";
  // Only an already-inlined logo can paint; a bare URL would be silently ignored.
  const imageUrl = r.markType !== "text" ? getInlinedImage(cfg.image) : null;
  const hasImage = !!imageUrl;

  if (!hasText && !hasImage) return null;

  // Measure against the text we are actually drawing -- an image-only mark has no
  // characters to size from, and "SAMPLE" needs a different font size to
  // "NOT FOR DISTRIBUTION" to occupy the same share of the page.
  const m = measureMark(r, hasText ? text : "", pageW, pageH);
  const { tileW: tw, tileH: th, tiled, fontSize } = m;

  let body = "";
  let defs = "";

  // Stack the image above the caption when both are present; centre it otherwise.
  const imgH = hasImage ? (r.markType === "both" ? m.markW * 0.55 : m.markW) * IMAGE_RATIO : 0;

  if (hasImage) {
    const w = r.markType === "both" ? m.markW * 0.55 : m.markW;
    const cy = r.markType === "both" ? th / 2 - (m.markH / 2 - imgH / 2) : th / 2;
    const flt = IMAGE_FILTERS[r.imageStyle];
    if (flt) defs += flt;
    body +=
      `<image x="${(tw / 2 - w / 2).toFixed(2)}" y="${(cy - imgH / 2).toFixed(2)}"` +
      ` width="${w.toFixed(2)}" height="${imgH.toFixed(2)}"` +
      (flt ? ' filter="url(#f)"' : "") +
      ` preserveAspectRatio="xMidYMid meet" href="${escapeXML(imageUrl)}"/>`;
  }

  if (hasText) {
    const ty = r.markType === "both" ? th / 2 + (m.markH / 2 - fontSize * 0.6) : th / 2;
    // Drawn verbatim: the mark is the text the user typed, in the case they typed it.
    const value = String(text);
    // A contrast stroke is only worth its cost where the mark is dense enough to need it.
    const stroke =
      r.outline || r.opacity > 0.35
        ? ` stroke="#ffffff" stroke-width="${Math.max(1, fontSize * 0.03).toFixed(2)}" paint-order="stroke"`
        : "";
    body +=
      `<text x="${(tw / 2).toFixed(2)}" y="${ty.toFixed(2)}" fill="${escapeXML(r.color || "#808080")}"` +
      ` font-family="Helvetica,Arial,sans-serif" font-size="${fontSize.toFixed(2)}"` +
      ` font-weight="${r.weight || 700}" letter-spacing="${r.tracking != null ? r.tracking : 2}"` +
      ` text-anchor="middle" dominant-baseline="middle"${stroke}>${escapeXML(value)}</text>`;
  }

  if (!body) return null;

  // overflow:visible lets a mark wider than its own tile bleed into the neighbouring
  // tile instead of being clipped at the tile edge -- which is what produced fragments
  // of letters rather than words. The tile is sized to hold the mark anyway; this is
  // the safety net for a long string at a dense setting.
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"` +
    ` width="${tw.toFixed(2)}" height="${th.toFixed(2)}" overflow="visible">` +
    (defs ? `<defs>${defs}</defs>` : "") +
    `<g transform="rotate(${r.deg} ${(tw / 2).toFixed(2)} ${(th / 2).toFixed(2)})">${body}</g></svg>`;

  return {
    url: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    tiled,
    tileW: tw,
    tileH: th,
    fontSize,
    opacity: r.opacity,
    blend: r.blend,
    position: r.position || "center",
    resolved: r,
  };
};

/**
 * Paint (or repaint) one overlay node. Creates it inside `pageEl` if absent.
 * `pageEl` must be a positioned element -- PDF.js `div.page` already is.
 */
export const applyWatermark = (pageEl, cfg, opts = {}) => {
  if (!pageEl) return null;

  let layer = pageEl.querySelector(":scope > .pdfp-wm");

  // An element with no box yet (dFlip prepares pages off-screen before laying them out)
  // would build a zero-sized SVG. Leave it for the next sweep.
  if (!pageEl.clientWidth || !pageEl.clientHeight) {
    if (layer) layer.remove();
    return null;
  }

  // Start the logo fetch if this mark needs one; repaint this element when it resolves.
  if (cfg && cfg.enabled && cfg.image && (cfg.markType || "text") !== "text" && !getInlinedImage(cfg.image)) {
    ensureInlinedImage(cfg.image, () => applyWatermark(pageEl, cfg, opts));
  }

  const out = buildWatermarkSVG(cfg, pageEl.clientWidth, pageEl.clientHeight, opts);

  if (!out) {
    if (layer) layer.remove();
    return null;
  }

  if (!layer) {
    layer = pageEl.ownerDocument.createElement("div");
    layer.className = "pdfp-wm";
    layer.setAttribute("aria-hidden", "true");
    pageEl.appendChild(layer);
  }

  layer.style.backgroundImage = out.url;
  layer.style.backgroundRepeat = out.tiled ? "repeat" : "no-repeat";
  layer.style.backgroundPosition = out.tiled ? "0 0" : out.position;
  layer.style.backgroundSize = out.tiled ? `${out.tileW}px ${out.tileH}px` : "auto";
  layer.style.opacity = String(out.opacity);
  layer.style.mixBlendMode = out.blend;

  return layer;
};

/**
 * Encode the config for the PDF.js iframe URL. The iframe is same-origin, so a
 * postMessage channel handles live editor updates -- but the URL param is the source
 * of truth on load, which avoids a race with the viewer's own boot sequence.
 */
export const encodeWatermarkParam = (cfg) => {
  if (!cfg || !cfg.enabled) return "";
  try {
    const slim = {
      enabled: true,
      markType: cfg.markType,
      theme: cfg.theme,
      text: cfg.text,
      // custom.js runs inside the viewer iframe and has its own copy of safeImageUrl,
      // so the logo is relativised here instead -- it resolves against the iframe's
      // own URL, which is the host the visitor is on.
      image: toSiteRelativeUrl(cfg.image),
      imageStyle: cfg.imageStyle,
      color: cfg.color,
      coverage: cfg.coverage,
      position: cfg.position,
      strength: cfg.strength,
      size: cfg.size,
      angle: cfg.angle,
      pages: cfg.pages,
      apply: cfg.apply,
      stamp: cfg.stamp,
      lock: cfg.lock,
      dynamic: cfg.dynamic,
    };
    // base64url so it survives being a query-string value.
    const json = JSON.stringify(slim);
    const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(json))) : "";
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (e) {
    return "";
  }
};

export const decodeWatermarkParam = (raw) => {
  if (!raw) return null;
  try {
    let b64 = String(raw).replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch (e) {
    return null;
  }
};

export default buildWatermarkSVG;
