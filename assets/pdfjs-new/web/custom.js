function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i,
    n,
    v,
    nv;

  if (query === url || query === "") return {};

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=", 2);
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    // eslint-disable-next-line no-prototype-builtins
    if (!parms.hasOwnProperty(n)) parms[n] = [];
    parms[n] = nv.length === 2 ? v : null;
  }
  return parms;
}

// Intercept window.PDFViewerApplicationOptions definition to set options early
let optionsInstance;
Object.defineProperty(window, "PDFViewerApplicationOptions", {
  get() {
    return optionsInstance;
  },
  set(value) {
    optionsInstance = value;
    if (optionsInstance && typeof optionsInstance.setAll === "function") {
      const parseURL = parseURLParams(location.href);
      var annotationModeVal = parseURL.annotationMode !== undefined ? parseInt(parseURL.annotationMode) : 1;
      var externalLinkTargetVal = parseURL.openLinksInNewTab === "1" ? 2 : 4;
      // Progressive (range-request) loading is on by default. Only when explicitly
      // disabled (progressive=0) do we force pdf.js to download the whole file up front.
      var progressiveDisabled = parseURL.progressive === "0";
      optionsInstance.setAll({
        cMapUrl: "cmaps/",
        cMapPacked: true,
        standardFontDataUrl: "standard_fonts/",
        annotationMode: annotationModeVal,
        externalLinkTarget: externalLinkTargetVal,
        disableRange: progressiveDisabled,
        disableStream: progressiveDisabled,
        disableAutoFetch: progressiveDisabled,
      });
    }
  },
  configurable: true,
});

document.addEventListener("DOMContentLoaded", function () {
  const parseURL = parseURLParams(location.href);

  // Keyboard navigation: Left/Right arrows -> previous/next page.
  // Opt-in via the keyboardnav URL param. Kept fully separate from the
  // content-protection keydown handler further below.
  if (parseURL.keyboardnav === "1") {
    document.addEventListener("keydown", function (e) {
      // Don't hijack typing in inputs (page-number box, find bar, forms, etc.)
      const target = e.target;
      const tag = target && target.nodeName ? target.nodeName.toUpperCase() : "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (target && target.isContentEditable)) {
        return;
      }
      const app = window.PDFViewerApplication;
      if (!app || !app.pdfViewer) return;
      if (e.key === "ArrowLeft" || e.keyCode === 37) {
        app.pdfViewer.previousPage();
        e.preventDefault();
      } else if (e.key === "ArrowRight" || e.keyCode === 39) {
        app.pdfViewer.nextPage();
        e.preventDefault();
      }
    });
  }

  // RTL layout: flip the whole viewer document to right-to-left, which activates
  // pdf.js's own built-in [dir="rtl"] toolbar styling. Applied both now and again
  // after init so pdf.js's locale handling can't override it back to LTR.
  if (parseURL.rtl === "1") {
    document.documentElement.setAttribute("dir", "rtl");
  }

  // Theme: force the viewer chrome light/dark via pdf.js's own built-in
  // .is-light / .is-dark root classes. "auto" adds neither, letting pdf.js
  // follow prefers-color-scheme natively. This themes only the toolbar/chrome,
  // never the PDF page content.
  if (parseURL.theme === "dark") {
    document.documentElement.classList.add("is-dark");
  } else if (parseURL.theme === "light") {
    document.documentElement.classList.add("is-light");
  }

  // Set values on pdfLinkService once it initializes
  const linkServiceInterval = setInterval(() => {
    if (window.PDFViewerApplication && window.PDFViewerApplication.pdfLinkService) {
      clearInterval(linkServiceInterval);
      var externalLinkTargetVal = parseURL.openLinksInNewTab === "1" ? 2 : 4;
      window.PDFViewerApplication.pdfLinkService.externalLinkTarget = externalLinkTargetVal;
      if (parseURL.rtl === "1") {
        document.documentElement.setAttribute("dir", "rtl");
      }
    }
  }, 50);

  // const pdfjsHistory = JSON.parse(window.localStorage.getItem("pdfjs.history"))?.files.find((item) => item.fingerprint === window.PDFViewerApplication?.store?.file?.fingerprint);
  const openFile = document.getElementById("openFile");
  const sidebarToggle = document.getElementById("sidebarToggleButton");
  const print = document.getElementById("printButton");
  const download = document.getElementById("downloadButton");
  const secondaryOpenFile = document.getElementById("secondaryOpenFile");
  const secondaryPrint = document.getElementById("secondaryPrint");
  const secondaryDownload = document.getElementById("secondaryDownload");
  // const viewerContainer = document.getElementById("viewerContainer");
  // const outerContainer = document.getElementById("outerContainer");
  // const toolbar = document.querySelector(".toolbar");
  const presentationMode = document.querySelectorAll(".presentationMode");
  // const pdfViewer = document.querySelector(".pdfViewer");
  // const scrollHorizontalButton = document.getElementById("scrollHorizontal");
  // const scrollVerticalButton = document.getElementById("scrollVertical");
  const documentProperties = document.getElementById("documentPropertiesDialog");
  const editorModeButtons = document.getElementById("editorModeButtons");

  let css = "";
  if (parseURL?.raw) {
    css = `:root{--scrollbar-bg-color:transparent;} body {background:transparent} .toolbar {display: none} .bottombar {display: none} .pdfViewer .page {border-image: url()} #viewerContainer{top:0} `;
    // pdfjsHistory.files[0].sidebarView = 0;
  }
  if (parseURL?.hrscroll) {
    css += ".bottombar{display: none;}";
  }
  const style = document.createElement("style");
  style.innerHTML = css;
  document.querySelector("head").appendChild(style);

  setInterval(() => {
    const canvases = document.querySelectorAll(".canvasWrapper canvas");
    canvases.forEach((canvas) => {
      canvas.toDataURL = () => console.warn("no cheating!");
      canvas.getContext = () => console.warn("no cheating!");
    });
  }, 3000);

  if (sidebarToggle) {
    const shouldOpen = parseURL.open === "true";
    const interval = setInterval(() => {
      if (window.PDFViewerApplication.pdfSidebar.isInitialEventDispatched) {
        if (shouldOpen) {
          window.PDFViewerApplication.pdfSidebar.open();
        } else {
          window.PDFViewerApplication.pdfSidebar.close();
        }
        clearInterval(interval);
      }
    }, 300);
  }

  if (openFile && parseURL?.open) {
    openFile.style.display = "none";
  }

  // rmove print button
  if (parseURL?.stdono != "vera") {
    window.print = () => {
      console.warn("Print disabled!");
    };
    print?.parentNode.removeChild(print);
    secondaryPrint?.parentNode.removeChild(secondaryPrint);
  }

  // remove right sidebar toolbar
  if (parseURL?.isHideRightToolbar === "true" && editorModeButtons) {

    editorModeButtons.parentNode.removeChild(editorModeButtons);
  }


  if (download && parseURL?.nobaki != "vera") {
    window.addEventListener("selectstart", function (e) {
      e.preventDefault();
      console.warn("Content selection disabled!");
    });

    setTimeout(() => {
      documentProperties?.parentNode.removeChild(documentProperties);
    }, 1000);
    download?.parentNode.removeChild(download);
    secondaryDownload?.parentNode.removeChild(secondaryDownload);
  }

  if (secondaryOpenFile && parseURL?.open) {
    secondaryOpenFile.style.display = "none";
  }

  /* ------------------------------------------------------------------
   * Watermark
   * ------------------------------------------------------------------
   * The default engine is an IFRAME, so wrapper JS can't reach the pages
   * pdf.js renders -- the config arrives as one base64url `wm` param and the
   * mark is attached to each `div.page` on `pagerendered` (which fires again
   * on zoom and rotation, so the tile maths stays correct).
   *
   * This viewer document is not part of the webpack bundle, so the tables below
   * are a deliberate copy of
   * src/blocks/pdf-poster/components/Common/watermarkSVG.js -- the source of
   * truth. If you edit one, edit the other (and the PHP copy in
   * PDFP_Functions::pdfp_watermark_themes()).
   */
  (function pdfpWatermark() {
    var STRENGTH = { faint: 8, subtle: 15, medium: 25, strong: 40, solid: 70 };
    // Size = share of page WIDTH the mark spans (not a font size); density = tile size as
    // a multiple of the mark's rotated bounding box. Absolute pixel gaps cannot work:
    // the mark scales with the page, so a fixed gap clips the text at every zoom but one.
    var SIZE = { small: 0.25, medium: 0.42, large: 0.62, fit: 0.95 };
    var DENSITY = { sparse: 1.9, normal: 1.4, dense: 1.08 };
    var ANGLE = { diagonal: -45, steep: -65, flat: 0, upright: -90 };
    var AVG_ADVANCE = 0.62;
    var IMAGE_RATIO = 0.32;
    var THEMES = {
      confidential: { types: ["text"], markType: "text", coverage: "normal", angle: "diagonal", strength: "subtle", size: "medium", color: "#808080", weight: 700, tracking: 2, upper: true, position: "center" },
      draft: { types: ["text"], markType: "text", coverage: "off", angle: "diagonal", strength: "strong", size: "large", color: "#AF4A3D", weight: 700, tracking: 3, upper: true, position: "center", outline: true },
      wash: { types: ["text"], markType: "text", coverage: "dense", angle: "diagonal", strength: "faint", size: "small", color: "#808080", weight: 700, tracking: 1, upper: true, position: "center" },
      "brand-corner": { types: ["image"], markType: "image", coverage: "off", angle: "flat", strength: "solid", size: "small", imageStyle: "original", position: "bottom right" },
      "logo-wash": { types: ["image"], markType: "image", coverage: "normal", angle: "diagonal", strength: "faint", size: "medium", imageStyle: "grayscale", position: "center" },
      "logo-caption": { types: ["both"], markType: "both", coverage: "off", angle: "diagonal", strength: "subtle", size: "large", imageStyle: "original", color: "#808080", weight: 600, tracking: 2, upper: true, position: "center" },
      custom: { types: ["text", "image", "both"], coverage: "normal", angle: "diagonal", strength: "subtle", size: "medium", color: "#808080", imageStyle: "grayscale", weight: 700, tracking: 2, upper: true, position: "center" }
    };
    var FILTERS = {
      original: null,
      grayscale: '<filter id="f"><feColorMatrix type="saturate" values="0"/></filter>',
      white: '<filter id="f"><feFlood flood-color="#ffffff" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter>',
      black: '<filter id="f"><feFlood flood-color="#16181F" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter>'
    };

    function decodeParam(raw) {
      if (!raw) return null;
      try {
        var b64 = String(raw).replace(/-/g, "+").replace(/_/g, "/");
        while (b64.length % 4) b64 += "=";
        return JSON.parse(decodeURIComponent(escape(atob(b64))));
      } catch (e) {
        return null;
      }
    }

    var cfg = decodeParam(parseURL.wm);
    if (!cfg || !cfg.enabled) return;
    if (cfg.apply && cfg.apply.indexOf("screen") === -1) return;

    function esc(s) {
      return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    }

    // The overlay needs its own positioning rules inside the viewer document --
    // div.page is already position:relative, so inset:0 lands on the page box.
    var style = document.createElement("style");
    style.textContent =
      ".pdfp-wm{position:absolute;inset:0;pointer-events:none;z-index:3;}" +
      "@media print{.pdfp-wm{display:none;}}";
    document.head.appendChild(style);

    // Only http(s), protocol-relative, site-relative or data:image URLs reach the
    // SVG href. Mirrors safeImageUrl() in watermarkSVG.js.
    function safeImageUrl(url) {
      var u = String(url == null ? "" : url).trim();
      if (!u) return "";
      if (/^(https?:)?\/\//i.test(u)) return u;
      if (/^\//.test(u)) return u;
      if (/^data:image\//i.test(u)) return u;
      return "";
    }

    /**
     * Logo inlining. The mark is applied as a CSS background-image, and an SVG loaded
     * that way cannot fetch anything -- so an <image href="http://..."> paints nothing.
     * The logo has to be embedded as a data URI first. Mirrors ensureInlinedImage() in
     * watermarkSVG.js.
     */
    var MAX_INLINE_BYTES = 300 * 1024;
    var logoCache = {};
    var logoPending = {};

    function inlinedLogo(url) {
      var clean = safeImageUrl(url);
      if (!clean) return null;
      if (clean.indexOf("data:") === 0) return clean;
      var v = logoCache[clean];
      return v ? v : null;
    }

    function ensureLogo(url, onReady) {
      var clean = safeImageUrl(url);
      if (!clean || clean.indexOf("data:") === 0) return;
      if (Object.prototype.hasOwnProperty.call(logoCache, clean)) return;
      if (logoPending[clean]) { if (onReady) logoPending[clean].push(onReady); return; }
      logoPending[clean] = onReady ? [onReady] : [];

      var done = function (value) {
        logoCache[clean] = value;
        var waiting = logoPending[clean] || [];
        delete logoPending[clean];
        if (value) waiting.forEach(function (fn) { try { fn(value); } catch (e) {} });
      };

      fetch(clean, { credentials: "same-origin" })
        .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.blob(); })
        .then(function (blob) {
          if (blob.size > MAX_INLINE_BYTES) throw new Error("too large");
          return new Promise(function (resolve, reject) {
            var fr = new FileReader();
            fr.onload = function () { resolve(String(fr.result)); };
            fr.onerror = function () { reject(new Error("read failed")); };
            fr.readAsDataURL(blob);
          });
        })
        .then(done)
        .catch(function (err) {
          console.warn("PDF Poster: could not embed the watermark logo (" + err.message + ").");
          done(false);
        });
    }

    function resolve() {
      var theme = THEMES[cfg.theme] || THEMES.confidential;
      var r = {};
      for (var k in theme) r[k] = theme[k];
      // Mark type is the user's under every theme; the look belongs to the theme
      // unless the theme is Custom. Mirrors THEME_OWNED in watermarkSVG.js -- keep
      // the two lists in step.
      if (cfg.markType !== undefined && cfg.markType !== "" && cfg.markType !== null) r.markType = cfg.markType;
      if (cfg.theme === "custom") {
        ["coverage", "angle", "strength", "size", "color", "imageStyle", "position", "outline"].forEach(function (key) {
          if (cfg[key] !== undefined && cfg[key] !== "" && cfg[key] !== null) r[key] = cfg[key];
        });
      }
      if ((theme.types || []).indexOf(r.markType) === -1) r.markType = theme.markType || "text";
      r.opacity = (STRENGTH[r.strength] || 15) / 100;
      r.deg = ANGLE[r.angle] !== undefined ? ANGLE[r.angle] : -45;
      if (r.size === "fit") r.coverage = "off";
      if (r.markType !== "text" && !inlinedLogo(cfg.image)) r.markType = r.markType === "both" ? "text" : "none";
      // No dark-mode colour lift here, unlike the wrapper: the theme param only
      // themes the pdf.js chrome, while the mark sits on the PDF's own page --
      // which is usually white even when the toolbar is dark.
      r.blend = r.imageStyle === "white" ? "normal" : "multiply";
      return r;
    }

    function inScope(page, total) {
      if (!cfg.pages || cfg.pages === "all") return true;
      if (cfg.pages === "first") return page === 1;
      if (cfg.pages === "except-first") return page !== 1;
      return true;
    }

    // Mirrors measureMark() in watermarkSVG.js.
    function measure(r, text, pageW, pageH) {
      var frac = SIZE[r.size] || SIZE.medium;
      var diag = Math.sqrt(pageW * pageW + pageH * pageH);
      var nearFlat = Math.abs(r.deg) < 20 || Math.abs(Math.abs(r.deg) - 180) < 20;
      var targetW = r.size === "fit" ? (nearFlat ? pageW * 0.95 : diag * 0.95) : pageW * frac;
      var tracking = r.tracking != null ? r.tracking : 2;
      var chars = Math.max(1, String(text || "").length);
      var fontSize = 0, markW = 0, markH = 0;

      if (r.markType !== "image") {
        fontSize = Math.max(6, (targetW - (chars - 1) * tracking) / (chars * AVG_ADVANCE));
        markW = targetW;
        markH = fontSize * 1.2;
      }
      if (r.markType !== "text") {
        var imgW = r.markType === "both" ? targetW * 0.55 : targetW;
        var imgH = imgW * IMAGE_RATIO;
        if (r.markType === "both") { markW = Math.max(markW, imgW); markH = imgH + fontSize * 0.55 + markH; }
        else { markW = imgW; markH = imgH; }
      }

      var rad = (Math.abs(r.deg) * Math.PI) / 180;
      var bw = Math.abs(markW * Math.cos(rad)) + Math.abs(markH * Math.sin(rad));
      var bh = Math.abs(markW * Math.sin(rad)) + Math.abs(markH * Math.cos(rad));

      // Nothing may be wider or taller than the page, or the ends of the mark are
      // cropped at the edges -- which is how "Fit page" lost its first and last letters
      // on a portrait page. See the long note in measureMark() in
      // components/Common/watermarkSVG.js; keep the two in step.
      var gutter = Math.min(pageW, pageH) * 0.02;
      var shrink = Math.min(1, (pageW - gutter * 2) / bw, (pageH - gutter * 2) / bh);
      if (shrink < 1 && isFinite(shrink) && shrink > 0) {
        fontSize *= shrink; markW *= shrink; markH *= shrink; bw *= shrink; bh *= shrink;
      }

      var tiled = r.coverage !== "off";
      var tileW = pageW, tileH = pageH;

      if (tiled) {
        var d = DENSITY[r.coverage] || DENSITY.normal;
        tileW = pageW / Math.max(1, Math.round(pageW / (bw * d)));
        tileH = pageH / Math.max(1, Math.round(pageH / (bh * d)));
      } else {
        // A single mark is sized to itself, not the page: background-position can only
        // move an image smaller than its layer, and the layer is inset:0. Kept in step
        // with measureMark() in components/Common/watermarkSVG.js.
        var pad = Math.max(Math.min(pageW, pageH) * 0.03, markH * 0.25);
        tileW = Math.min(pageW, bw + pad * 2);
        tileH = Math.min(pageH, bh + pad * 2);
      }
      return { fontSize: fontSize, markW: markW, markH: markH, tileW: tileW, tileH: tileH, tiled: tiled };
    }

    function build(r, w, h, page, total) {
      var text = String(cfg.text == null ? "" : cfg.text)
        .split("{page}").join(page)
        .split("{pages}").join(total);

      var imageUrl = r.markType !== "text" ? inlinedLogo(cfg.image) : null;
      var hasText = r.markType !== "image" && String(text).trim() !== "";
      var hasImage = !!imageUrl;
      if (!hasText && !hasImage) return null;

      var m = measure(r, hasText ? text : "", w, h);
      var tw = m.tileW, th = m.tileH, fs = m.fontSize;
      var body = "", defs = "";
      var imgH = hasImage ? (r.markType === "both" ? m.markW * 0.55 : m.markW) * IMAGE_RATIO : 0;

      if (hasImage) {
        var iw = r.markType === "both" ? m.markW * 0.55 : m.markW;
        var icy = r.markType === "both" ? th / 2 - (m.markH / 2 - imgH / 2) : th / 2;
        var flt = FILTERS[r.imageStyle];
        if (flt) defs += flt;
        body += '<image x="' + (tw / 2 - iw / 2).toFixed(2) + '" y="' + (icy - imgH / 2).toFixed(2) +
          '" width="' + iw.toFixed(2) + '" height="' + imgH.toFixed(2) + '"' + (flt ? ' filter="url(#f)"' : "") +
          ' preserveAspectRatio="xMidYMid meet" href="' + esc(imageUrl) + '"/>';
      }

      if (hasText) {
        var ty = r.markType === "both" ? th / 2 + (m.markH / 2 - fs * 0.6) : th / 2;
        var val = r.upper === false ? text : String(text).toUpperCase();
        var stroke = r.outline || r.opacity > 0.35
          ? ' stroke="#ffffff" stroke-width="' + Math.max(1, fs * 0.03).toFixed(2) + '" paint-order="stroke"'
          : "";
        body += '<text x="' + (tw / 2).toFixed(2) + '" y="' + ty.toFixed(2) + '" fill="' + esc(r.color || "#808080") +
          '" font-family="Helvetica,Arial,sans-serif" font-size="' + fs.toFixed(2) + '" font-weight="' + (r.weight || 700) +
          '" letter-spacing="' + (r.tracking != null ? r.tracking : 2) + '" text-anchor="middle" dominant-baseline="middle"' +
          stroke + ">" + esc(val) + "</text>";
      }

      if (!body) return null;

      // overflow:visible so a mark wider than its tile bleeds instead of being clipped
      // into fragments of letters.
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' +
        tw.toFixed(2) + '" height="' + th.toFixed(2) + '" overflow="visible">' + (defs ? "<defs>" + defs + "</defs>" : "") +
        '<g transform="rotate(' + r.deg + " " + (tw / 2).toFixed(2) + " " + (th / 2).toFixed(2) + ')">' + body + "</g></svg>";

      return { url: 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")', tiled: m.tiled, tw: tw, th: th };
    }

    function mark(pageDiv, page, total) {
      if (!pageDiv) return;
      // Fetch the logo the first time a page needs it, then repaint every page.
      if (cfg.image && (cfg.markType || "text") !== "text" && !inlinedLogo(cfg.image)) {
        ensureLogo(cfg.image, function () { sweep(); });
      }
      // A page that hasn't been laid out yet has no box to measure, which would
      // build a zero-sized SVG. Skip it; the next sweep picks it up.
      if (!pageDiv.clientWidth || !pageDiv.clientHeight) return;
      var r = resolve();
      var layer = pageDiv.querySelector(":scope > .pdfp-wm");

      if (r.markType === "none" || !inScope(page, total)) {
        if (layer) layer.remove();
        return;
      }

      var out = build(r, pageDiv.clientWidth, pageDiv.clientHeight, page, total);
      if (!out) {
        if (layer) layer.remove();
        return;
      }

      if (!layer) {
        layer = document.createElement("div");
        layer.className = "pdfp-wm";
        layer.setAttribute("aria-hidden", "true");
        pageDiv.appendChild(layer);
      }

      layer.style.backgroundImage = out.url;
      layer.style.backgroundRepeat = out.tiled ? "repeat" : "no-repeat";
      layer.style.backgroundPosition = out.tiled ? "0 0" : r.position;
      layer.style.backgroundSize = out.tiled ? out.tw + "px " + out.th + "px" : "auto";
      layer.style.opacity = String(r.opacity);
      layer.style.mixBlendMode = r.blend;
    }

    function sweep() {
      var app = window.PDFViewerApplication;
      var total = app && app.pagesCount ? app.pagesCount : 0;
      document.querySelectorAll("#viewer .page").forEach(function (div) {
        var n = parseInt(div.getAttribute("data-page-number") || "0", 10);
        if (n) mark(div, n, total);
      });
    }

    var busInterval = setInterval(function () {
      var app = window.PDFViewerApplication;
      if (!app || !app.eventBus) return;
      clearInterval(busInterval);

      app.eventBus._on("pagerendered", function (e) {
        var div = e && e.source && e.source.div;
        mark(div, e.pageNumber, app.pagesCount || 0);
      });

      // The listener above only fires for FUTURE renders, and this code attaches on a
      // poll -- on a small document pdf.js has usually finished page 1 before we get
      // here, so without this catch-up sweep the first page (often the only page)
      // never gets marked. Belt and braces for the pages that arrive later, too.
      sweep();
      app.eventBus._on("pagesloaded", sweep);
      app.eventBus._on("scalechanging", function () { setTimeout(sweep, 60); });
      app.eventBus._on("rotationchanging", function () { setTimeout(sweep, 60); });

      // Live updates while someone clicks through themes in the block editor.
      window.addEventListener("message", function (ev) {
        if (!ev.data || ev.data.type !== "PDFP_WATERMARK") return;
        cfg = ev.data.config || cfg;
        sweep();
      });

      // Tamper restore: put the layer back if it's deleted, and re-assert it if the
      // computed style was overridden (which a childList observer can't see).
      if (cfg.lock) {
        new MutationObserver(function (records) {
          for (var i = 0; i < records.length; i++) {
            var removed = records[i].removedNodes;
            for (var j = 0; j < removed.length; j++) {
              if (removed[j].nodeType === 1 && removed[j].classList && removed[j].classList.contains("pdfp-wm")) {
                sweep();
                return;
              }
            }
          }
        }).observe(document.getElementById("viewer") || document.body, { childList: true, subtree: true });

        setInterval(function () {
          document.querySelectorAll("#viewer .page > .pdfp-wm").forEach(function (el) {
            var cs = getComputedStyle(el);
            if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) el.remove();
          });
          sweep();
        }, 2000);
      }
    }, 100);
  })();

  // ---------------------------------------------------------------------------
  // Document Insights: report toolbar actions to the parent page.
  //
  // This viewer runs in an iframe, so nothing outside it can see these buttons --
  // the same reason rtl / theme / keyboardnav all arrive as URL params and are
  // handled in here. Attached AFTER the removal branches above, so a build with
  // download or print disabled simply has no element to bind and reports nothing.
  //
  // Only ever posts; never reads. The parent verifies event.source against its own
  // iframe before believing any of it.
  // ---------------------------------------------------------------------------
  if (parseURL?.track === "1") {
    const report = (name) => {
      try {
        window.parent.postMessage({ type: "PDFP_TRACK", event: name }, "*");
      } catch (e) {
        // A counting failure must never interfere with reading the document.
      }
    };

    [download, secondaryDownload].forEach((el) => {
      el?.addEventListener("click", () => report("download"));
    });

    [print, secondaryPrint].forEach((el) => {
      el?.addEventListener("click", () => report("print"));
    });

    // Ctrl/Cmd+P and the browser's own print path bypass the toolbar button entirely.
    window.addEventListener("beforeprint", () => report("print"));
  }

  if (presentationMode && parseURL?.fullscreen != "1") {
    Object.values(presentationMode).map((item) => {
      item.style.display = "none";
    });
    // presentationMode.style.display = "none";
  }

  if (location.href.includes("blob:")) {
    download?.parentNode?.removeChild(download);
    secondaryDownload?.parentNode?.removeChild(secondaryDownload);
  }

  //sidebar toggle
  if (sidebarToggle && parseURL?.side != "true") {
    sidebarToggle.style.display = "none";
  }

  //raw css

  const interval = setInterval(() => {
    if (window.PDFViewerApplication.store?.fingerprint) {
      // PDF loaded - clear interval
      clearInterval(interval);

      // change scroll behavior
      setTimeout(() => {
        if (parseURL?.hrscroll === "vera") {
          window.PDFViewerApplication.appConfig.secondaryToolbar.scrollHorizontalButton.click();
        } else {
          window.PDFViewerApplication.appConfig.secondaryToolbar.scrollVerticalButton.click();
        }

        // update zoom level
        if (parseURL.z) {
          window.PDFViewerApplication.pdfViewer.currentScaleValue = parseURL.z ? parseURL.z : "auto";
        }
      }, 100);
    }
  }, 100);

  const disableKey = (e) => {
    if (((e.ctrlKey || e.metaKey) && e.key === "s") || e.key === "F12") {
      e.preventDefault();
      e.stopPropagation();
      alert("Saving is disabled on this page");
      return false;
    } else {
      return true;
    }
  };

  document.addEventListener("keydown", disableKey);
  window.addEventListener("keydown", disableKey);
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Listen for PDF.js errors
  const errorInterval = setInterval(() => {
    if (window.PDFViewerApplication && window.PDFViewerApplication.eventBus) {
      clearInterval(errorInterval);

      // Listen for document load errors
      window.PDFViewerApplication.eventBus._on("documenterror", (e) => {
        window.parent.postMessage({
          type: "PDFP_ERROR",
          message: e.message || "An error occurred while loading the PDF."
        }, "*");
      });

      // Listen for other silent failures if possible
      window.PDFViewerApplication.eventBus._on("pagerendererror", (e) => {
        console.error("PDF.js render error:", e);
      });
    }
  }, 500);

  // window.localStorage.setItem('pdfjs.history', JSON.stringify(pdfjsHistory));
});
