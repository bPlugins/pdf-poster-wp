import { useEffect } from "react";
import { applyWatermark, watermarkInScope } from "./watermarkSVG";

/**
 * Watermark overlay for the engines the plugin renders in-page.
 *
 * Two strategies, picked automatically rather than asked for. Which one an engine gets
 * was settled by measuring the real DOM, not by assumption:
 *
 *  - "dflip"     -- one overlay per page. dFlip's reader (scroll) and slider modes build
 *                   real, measurable `.df-page` elements, so each page can carry its own
 *                   mark. Pages are created and recycled as you move through the
 *                   document, so a MutationObserver plus a light sweep keeps up.
 *
 *  - "container" -- one layer over the page area. Required for:
 *                     * dFlip's 3D FlipBook, which draws every page into a SINGLE
 *                       <canvas> -- its `.df-page` divs are 0x0 transform-positioned
 *                       shells, so there is no per-page box to attach anything to.
 *                     * Adobe DC and the Google Docs fallback, which are cross-origin
 *                       iframes we cannot script into.
 *                   It does not follow individual pages, which the panel states.
 *
 * The PDF.js engine is handled inside its own iframe by assets/pdfjs-new/web/custom.js,
 * because wrapper JS cannot reach the pages it renders.
 */
const Watermark = ({ watermark, mode = "container", targetRef, theme = "light", pageCount = 0 }) => {
  const enabled = !!(watermark && watermark.enabled && (watermark.apply || ["screen"]).includes("screen"));

  useEffect(() => {
    const host = targetRef?.current;
    if (!host) return;

    if (!enabled) {
      host.querySelectorAll(".pdfp-wm").forEach((el) => el.remove());
      return;
    }

    const opts = { theme };

    /* ---------------- container strategy ---------------- */
    if (mode === "container") {
      // Prefer the element that holds the pages, so the mark doesn't sit over the
      // toolbar or the share buttons:
      //   .df-viewer-container -- dFlip's page area, a sibling of its own .df-ui bar
      //   .iframe_wrapper      -- the frame for Adobe / Google viewers
      const pick = () =>
        host.querySelector(".df-viewer-container") || host.querySelector(".iframe_wrapper") || host;

      /**
       * The book rect inside dFlip's 3D canvas.
       *
       * In 3D mode every page is drawn into ONE <canvas>, so there is no per-page box in
       * the DOM -- a plain container overlay therefore tiles the empty area around the
       * book as well, which looks wrong. dFlip does know where it drew the book, so read
       * it: viewer.leftSheetWidth is the full spread width, leftSheetHeight its height,
       * and leftSheetTop its offset from the top of the canvas. Horizontally the book is
       * centred (verified: seamPosition === (containerWidth - spreadWidth) / 2).
       *
       * Returns null when the geometry isn't published yet or isn't sane, and the caller
       * falls back to covering the whole viewer.
       */
      const bookRect = () => {
        const c = host.querySelector(".dflip-container");
        const inst = c && c.__pdfpFlipbook;
        const v = inst && inst.viewer;
        if (!v) return null;

        // leftSheetWidth is ONE sheet, not the spread. dFlip shows the cover on its own
        // and every later turn as two sheets side by side, so the book is one sheet wide
        // on page 1 and two from page 2 on -- and `seamPosition` moves with it: it is the
        // book's left edge for a lone cover, and the spine (the stage centre) for a
        // spread. Measured on a 1000px stage with 485px sheets: seam 257.5 on the cover,
        // 500 on every spread.
        const lw = Number(v.leftSheetWidth || 0);
        const rw = Number(v.rightSheetWidth || 0);
        const sheet = lw || rw;
        const h = Number(v.leftSheetHeight || v.rightSheetHeight || 0);
        if (!(sheet > 8 && h > 8)) return null;

        const stage = pick();
        const sw = stage.clientWidth || 0;
        const sh = stage.clientHeight || 0;

        const seam = Number(v.seamPosition);
        // A spread is centred on the stage; a lone sheet is not. They coincide only if
        // the sheet had no width, so this separates them cleanly.
        const spread = isFinite(seam) && Math.abs(seam - sw / 2) < 1 && lw > 8 && rw > 8;
        const w = spread ? lw + rw : sheet;

        // Bail out if the numbers don't fit the stage -- better a full-viewer mark than
        // a mark parked in the wrong place.
        if (!sw || !sh || w > sw + 2 || h > sh + 2) return null;

        // Vertical placement. `leftSheetTop` is the book's position in dFlip's flat
        // layout space, which sits 20px above where the 3D camera actually draws it --
        // verified by pixel-measuring the canvas. What matches the drawn page exactly, at
        // several container heights and with the toolbar hidden, is the book centred in
        // the stage minus the control bar:
        //     top = (stageHeight - controlsHeight - bookHeight) / 2
        // `leftSheetTop` is kept as the fallback if controlsHeight isn't published.
        const controls = Number((inst.dimensions && inst.dimensions.controlsHeight) || 0);
        const centred = (sh - controls - h) / 2;
        const top = isFinite(centred) && centred >= 0
          ? centred
          : Number(v.leftSheetTop != null ? v.leftSheetTop : v.rightSheetTop);
        if (!isFinite(top)) return null;

        // Which pages are on screen, so Pages can be honoured per half. dFlip pairs the
        // sheets after a lone cover -- (2,3), (4,5), ... -- so a spread's left page is
        // always the even one.
        const current = Number(inst.currentPageNumber) || 1;
        const leftPage = spread ? (current % 2 === 0 ? current : current - 1) : current;

        return {
          left: Math.max(0, (sw - w) / 2),
          top: Math.max(0, top),
          width: w,
          height: h,
          spread,
          leftPage,
          rightPage: spread ? leftPage + 1 : null,
          pageCount: Number(inst.pageCount) || 0,
        };
      };

      let box = pick();
      // Our own positioned elements covering the book: one per visible page, so each can
      // be included or skipped on its own.
      let frames = [];

      const paint = () => {
        const next = pick();
        if (next !== box) {
          box.querySelectorAll(":scope > .pdfp-wm, :scope > .pdfp-wm-frame").forEach((el) => el.remove());
          frames = [];
          box = next;
        }
        if (getComputedStyle(box).position === "static") box.style.position = "relative";

        const rect = bookRect();

        if (!rect) {
          // No geometry (Adobe, Google, or dFlip not ready): cover the viewer. Pages
          // cannot be honoured here -- the document is in a cross-origin frame, so there
          // is no way to know which page is on screen. Both panels say so.
          while (frames.length) frames.pop().remove();
          applyWatermark(box, watermark, opts);
          return;
        }

        // Geometry available: drop the viewer-wide layer and mark only the pages.
        //
        // A spread is two pages, so it gets two frames rather than one. That is what lets
        // Pages work here at all: "All except the cover" has to leave page 1 clean while
        // marking page 2 beside it, and a single frame across the whole book cannot.
        box.querySelectorAll(":scope > .pdfp-wm").forEach((el) => el.remove());

        const halves = rect.spread
          ? [
              { page: rect.leftPage, left: rect.left, width: rect.width / 2 },
              { page: rect.rightPage, left: rect.left + rect.width / 2, width: rect.width / 2 },
            ]
          : [{ page: rect.leftPage, left: rect.left, width: rect.width }];

        const wanted = halves.filter((half) =>
          watermarkInScope(watermark.pages, half.page, rect.pageCount)
        );

        // Reuse the frames we already have and drop any surplus, so a turn from a spread
        // to a lone cover doesn't leave a stale half painted.
        while (frames.length > wanted.length) frames.pop().remove();
        wanted.forEach((half, i) => {
          let f = frames[i];
          if (!f || !f.isConnected) {
            f = box.ownerDocument.createElement("div");
            f.className = "pdfp-wm-frame";
            f.setAttribute("aria-hidden", "true");
            box.appendChild(f);
            frames[i] = f;
          }
          f.style.left = half.left + "px";
          f.style.top = rect.top + "px";
          f.style.width = half.width + "px";
          f.style.height = rect.height + "px";
          applyWatermark(f, watermark, opts);
        });
      };

      paint();
      // dFlip mounts asynchronously and re-lays the book out on resize, zoom and every
      // page turn, so the rect has to be re-read rather than measured once.
      const mo = new MutationObserver(paint);
      mo.observe(host, { childList: true, subtree: true });
      window.addEventListener("resize", paint);
      const tick = setInterval(paint, 700);

      return () => {
        mo.disconnect();
        clearInterval(tick);
        window.removeEventListener("resize", paint);
        host.querySelectorAll(".pdfp-wm, .pdfp-wm-frame").forEach((el) => el.remove());
      };
    }

    /* ---------------- per-page strategy (dFlip reader / slider) ---------------- */

    /**
     * dFlip's own answer to "which page is this element?", when it has one.
     *
     * `viewer.pages` is dFlip's page buffer: each entry holds the `.df-page` element it
     * is currently showing and the `pageNumber` behind it. It is the only source that
     * survives Slider mode, where the DOM lies twice over:
     *
     *   - the sheets are NOT in page order. Measured at load: the first `.df-sheet` in
     *     the document sits at x=3935 showing page 5, while the seventh sits at x=15
     *     showing page 1. Any index arithmetic over the sheet list is therefore wrong,
     *     and it was: "first" marked page 5 and "except the cover" left page 5 clean.
     *   - each sheet carries one real page on its front and a blank `.df-page-back`
     *     placeholder, so the two-faces-per-sheet arithmetic double-counts as well.
     *
     * Returns the page number, -1 for a face dFlip says has no page behind it (those
     * placeholders must never be marked), or 0 for "no answer" so the caller falls back
     * to the DOM heuristics.
     */
    const modelPageNumber = (pageEl) => {
      const container = host.querySelector(".dflip-container");
      const inst = container && container.__pdfpFlipbook;
      const pages = inst && inst.viewer && inst.viewer.pages;
      if (!pages || !pages.length) return 0;

      for (let i = 0; i < pages.length; i++) {
        const held = pages[i] && pages[i].element;
        // dFlip stores a jQuery wrapper here, not the node.
        const node = held && (held.nodeType ? held : held[0]);
        if (node !== pageEl) continue;
        const n = pages[i].pageNumber;
        if (typeof n !== "number" || !isFinite(n)) return 0; // not resolved yet
        return n > 0 ? n : -1;
      }
      return 0;
    };

    /**
     * Which page is this element?
     *
     * Measured against real dFlip, most authoritative first:
     *  0. `viewer.pages`     -- dFlip's own model; see modelPageNumber above. Required
     *                           for Slider, and correct everywhere it answers at all.
     *  1. `number`           -- dFlip's own attribute. It does NOT use data-page-number,
     *                           and it only sets this on some pages, lazily.
     *  2. `data-page-number` -- pdf.js convention, kept in case dFlip adopts it.
     *  3. sheet model        -- a `.df-sheet` per leaf holding a `.df-page-front` and a
     *                           `.df-page-back`, so the number is sheetIndex*2 +
     *                           (back ? 2 : 1). Only sound while the sheets are in page
     *                           order and every sheet has two real faces -- true of the
     *                           3D flipbook, not of Slider -- hence the model first.
     *  4. flat DOM order     -- reader/scroll lays pages out sequentially with no sheets.
     */
    const pageNumberOf = (pageEl) => {
      const fromModel = modelPageNumber(pageEl);
      if (fromModel) return fromModel;

      const attr =
        pageEl.getAttribute("number") ||
        pageEl.getAttribute("data-page-number") ||
        pageEl.dataset?.pageNumber;
      const fromAttr = parseInt(attr || "", 10);
      if (fromAttr) return fromAttr;

      const sheet = pageEl.closest?.(".df-sheet");
      if (sheet) {
        const sheets = Array.prototype.slice.call(host.querySelectorAll(".df-sheet"));
        const si = sheets.indexOf(sheet);
        if (si !== -1) return si * 2 + (pageEl.classList.contains("df-page-back") ? 2 : 1);
      }

      return Array.prototype.indexOf.call(host.querySelectorAll(".df-page"), pageEl) + 1;
    };

    const markPage = (pageEl) => {
      if (!pageEl) return;

      const num = pageNumberOf(pageEl);

      // A face with no page behind it -- Slider's blank sheet backs. Marking one puts a
      // watermark on a surface the reader can flip into that shows no document at all.
      if (num < 0) {
        pageEl.querySelectorAll(":scope > .pdfp-wm").forEach((el) => el.remove());
        return;
      }

      if (!watermarkInScope(watermark.pages, num, pageCount)) {
        pageEl.querySelectorAll(":scope > .pdfp-wm").forEach((el) => el.remove());
        return;
      }

      if (getComputedStyle(pageEl).position === "static") pageEl.style.position = "relative";
      // applyWatermark skips anything with no box yet and the next sweep picks it up.
      applyWatermark(pageEl, watermark, { ...opts, page: num, pages: pageCount });
    };

    const sweep = () => host.querySelectorAll(".df-page").forEach(markPage);

    sweep();

    const observer = new MutationObserver((records) => {
      records.forEach((rec) => {
        rec.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.classList?.contains("df-page")) markPage(node);
          else node.querySelectorAll?.(".df-page").forEach(markPage);
        });

        // Tamper restore: if our own layer was pulled out, put it back.
        if (watermark.lock) {
          rec.removedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList?.contains("pdfp-wm")) sweep();
          });
        }
      });
    });

    observer.observe(host, { childList: true, subtree: true });

    // dFlip lays pages out lazily and reuses nodes without touching childList, so a
    // periodic sweep is what actually catches a page becoming measurable. Cheap: it
    // only rebuilds a layer whose box changed.
    const tick = setInterval(sweep, 900);
    const onResize = () => sweep();
    window.addEventListener("resize", onResize);
    host.addEventListener("scroll", onResize, true);

    // Belt and braces for the tamper switch: re-assert against CSS overrides
    // (display:none, opacity:0) that a childList observer cannot see.
    let guard = null;
    if (watermark.lock) {
      guard = setInterval(() => {
        host.querySelectorAll(".df-page > .pdfp-wm").forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) el.remove();
        });
        sweep();
      }, 2000);
    }

    return () => {
      observer.disconnect();
      clearInterval(tick);
      if (guard) clearInterval(guard);
      window.removeEventListener("resize", onResize);
      host.removeEventListener("scroll", onResize, true);
      host.querySelectorAll(".pdfp-wm").forEach((el) => el.remove());
    };
  }, [enabled, mode, targetRef, theme, pageCount, JSON.stringify(watermark || {})]);

  return null;
};

export default Watermark;
