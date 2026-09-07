import { useEffect, useRef } from "react";

/**
 * Document Insights -- the browser half.
 *
 * Counting deliberately lives here rather than in render.php. That file only runs on a
 * page-cache miss, so a server-side counter records one view per cache generation
 * instead of one per visitor. Everything below runs after the HTML has been delivered,
 * from wherever it was delivered, so a fully cached page still counts.
 *
 * Three rules shape this file:
 *   1. A view is a document that was actually SEEN -- rendered, and meaningfully in the
 *      viewport for a continuous second (see isSeen below). Not a page load. Ten embeds
 *      on one page are not ten views, and a viewer three screens below the fold is not a
 *      read until it is scrolled to.
 *   2. One request per page, not one per event. Events queue and leave together on
 *      pagehide via sendBeacon. Downloads are the exception and flush at once, because a
 *      download frequently precedes a navigation.
 *   3. The document key is never computed here. render.php stamps `data-pdfp-doc` on the
 *      wrapper and this file reports against it verbatim, so the browser can never invent
 *      an identity the server did not issue.
 */

/** Events the endpoint accepts. Anything else is dropped before it reaches the queue. */
const ALLOWED = ["view", "download", "print", "fullscreen", "share"];

/** How long a viewer must be on screen before it counts as seen. */
const VISIBLE_MS = 1000;

/**
 * How much must be on screen before that clock starts.
 *
 * Two tiers, following the IAB viewability convention rather than a number picked by
 * feel: a normal element has to be half on screen, and a LARGE one only 30%. The
 * distinction matters here more than in most places, because a PDF viewer is routinely
 * as tall as the window -- the default is 840px desktop. A viewer 712px tall sitting
 * 678px down a 1000px window shows its whole first page and measures 0.452, so a flat
 * 50% rule would refuse to count a document the visitor is plainly reading.
 *
 * "Large" is relative to the window, not an absolute pixel area, because the same embed
 * is large on a phone and small on a desktop.
 */
const VISIBLE_RATIO = 0.5;
const LARGE_VISIBLE_RATIO = 0.3;

/** An element counts as large once it fills this much of the window's height. */
const LARGE_ELEMENT = 0.6;

/** Fine-grained thresholds so the observer keeps reporting as the page scrolls. */
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

const isSeen = (entry) => {
  const own = entry.boundingClientRect?.height || 0;
  const viewport = (typeof window !== "undefined" && window.innerHeight) || 0;

  if (!own || !viewport) return entry.intersectionRatio >= VISIBLE_RATIO;

  const visibleRatio = (entry.intersectionRect?.height || 0) / own;
  const isLarge = own / viewport >= LARGE_ELEMENT;

  return visibleRatio >= (isLarge ? LARGE_VISIBLE_RATIO : VISIBLE_RATIO);
};

/**
 * One queue for the whole page, shared by every viewer on it.
 *
 * This is what turns a page carrying six PDFs into a single HTTP request. Module scope
 * rather than component state, because the flush has to survive the components being
 * unmounted by a navigation.
 */
let queue = [];
let flushTimer = null;

/**
 * How long the queue waits before leaving on its own.
 *
 * Every viewer on a page reaches its one-second dwell within a moment of the others, so
 * a short window is enough to batch them into a single request -- while making sure the
 * data does not sit hostage to a navigation that may never come. A reader who opens a
 * document and leaves the tab open all afternoon still gets counted.
 */
const IDLE_FLUSH_MS = 5000;

const config = () => (typeof window !== "undefined" && window.pdfp) || {};

/** Would a request be pointless or unwanted? Checked before anything is queued. */
const canTrack = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  // Automation drives a real browser and would otherwise register as an audience. The
  // server checks the user agent too; this catches the honest half for free.
  if (navigator.webdriver) return false;
  const { trackUrl, track } = config();
  // wp_localize_script serialises booleans as "1" and "" -- never as true/false -- so a
  // plain `track !== false` check silently passed on a site that had counting switched
  // off and fired a request for the server to throw away.
  const off = track === false || track === "" || track === "0" || track === 0 || track === undefined;
  return !!trackUrl && !off;
};

const send = (events) => {
  const { trackUrl } = config();
  if (!trackUrl || !events.length) return;

  const body = JSON.stringify({ events });

  // sendBeacon survives the page going away, which is exactly when most flushes happen.
  // Its response is unreadable by design and the endpoint answers 204 with no body.
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(trackUrl, blob)) return;
    }
  } catch (e) {
    // fall through to fetch
  }

  try {
    fetch(trackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {});
  } catch (e) {
    // Counting is never allowed to break a page.
  }
};

const flush = () => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (!queue.length) return;
  const batch = queue;
  queue = [];
  send(batch);
};

/**
 * Add an event to the queue.
 *
 * `immediate` is for events that race a navigation -- a download click can unload the
 * page before pagehide fires reliably.
 */
const enqueue = (doc, type, immediate = false, origin = 0) => {
  if (!canTrack() || !doc || ALLOWED.indexOf(type) === -1) return;

  // `origin` is the page the embed sits on. Sent so the report can name and link to
  // where a url-keyed document actually lives, instead of only showing its hash.
  queue.push(origin > 0 ? { doc, type, origin } : { doc, type });

  if (immediate) {
    flush();
    return;
  }

  if (!flushTimer) {
    flushTimer = setTimeout(flush, IDLE_FLUSH_MS);
  }
};

// Page-level flush handlers, installed once.
if (typeof window !== "undefined" && !window.__pdfpTrackBound) {
  window.__pdfpTrackBound = true;

  // visibilitychange -> hidden is the only reliable "page is going away" signal on
  // mobile Safari; pagehide covers the desktop back/forward cache. Both are harmless
  // to double up on, because flush() empties the queue.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
}

/**
 * Attach counting to one viewer.
 *
 * @param {object}  options
 * @param {boolean} options.enabled   false in the editor, or when the site has counting off
 * @param {object}  options.targetRef ref to the .pdfp_wrapper element
 * @param {boolean} options.ready     true once the document actually has something to show
 * @returns {function} track(type) -- call it from a button handler
 */
const useTracking = ({ enabled = true, targetRef, ready = true }) => {
  const docRef = useRef("");
  const originRef = useRef(0);
  const viewSent = useRef(false);

  // Resolve the key from the markup render.php produced. Kept in a ref so the button
  // handler below never closes over a stale value.
  useEffect(() => {
    if (!enabled || !targetRef?.current) return;
    const holder = targetRef.current.closest("[data-pdfp-doc]");
    docRef.current = holder?.getAttribute("data-pdfp-doc") || "";
    originRef.current = parseInt(holder?.getAttribute("data-pdfp-origin") || "0", 10) || 0;
  }, [enabled, ready, targetRef]);

  // --- the view itself -------------------------------------------------------------
  useEffect(() => {
    if (!enabled || !ready || !canTrack()) return;

    const el = targetRef?.current;
    if (!el) return;

    // No IntersectionObserver (very old browsers): fall back to counting the render,
    // which is what every competitor does for every visitor.
    if (typeof IntersectionObserver === "undefined") {
      if (!viewSent.current && docRef.current) {
        viewSent.current = true;
        enqueue(docRef.current, "view", false, originRef.current);
      }
      return;
    }

    let timer = null;

    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (viewSent.current) return;

          if (entry.isIntersecting && isSeen(entry)) {
            // Start the clock. Scrolling straight past a viewer never reaches the end
            // of it, which is the whole point.
            if (!timer) {
              timer = setTimeout(() => {
                timer = null;
                if (viewSent.current || !docRef.current) return;
                viewSent.current = true;
                enqueue(docRef.current, "view", false, originRef.current);
                observer.disconnect();
              }, VISIBLE_MS);
            }
          } else {
            clear();
          }
        });
      },
      { threshold: THRESHOLDS }
    );

    observer.observe(el);

    return () => {
      clear();
      observer.disconnect();
    };
  }, [enabled, ready, targetRef]);

  // --- events from inside the PDF.js iframe ----------------------------------------
  // The default engine renders in an iframe, so its toolbar Download and Print buttons
  // are out of reach of any handler out here. custom.js posts them up; the source check
  // is what attributes a message to the right viewer when a page carries several.
  useEffect(() => {
    if (!enabled || !canTrack()) return;

    const onMessage = (event) => {
      const data = event?.data;
      if (!data || data.type !== "PDFP_TRACK") return;
      if (ALLOWED.indexOf(data.event) === -1) return;

      const iframe = targetRef?.current?.querySelector("iframe");
      if (!iframe || event.source !== iframe.contentWindow) return;

      enqueue(docRef.current, data.event, data.event === "download", originRef.current);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [enabled, targetRef]);

  /** Handed down to Header so its buttons can report. */
  return (type) => {
    if (!enabled) return;
    enqueue(docRef.current, type, type === "download", originRef.current);
  };
};

export default useTracking;
