// eslint-disable-next-line no-unused-vars
import { version } from 'react-dom'
import { createRoot } from "react-dom";

import Viewer from "./components/Common/Viewer";
import "./style.scss";
import "./public.scss";

/*
  Front-end bootstrapper.

  Two things decide whether a poster ever becomes a viewer: WHICH elements we claim,
  and WHEN we look for them.

  WHICH -- only our own container. This used to also sweep up every `[data-attributes]`
  element on the page, which is not a PDF Poster marker at all: sibling bPlugins blocks
  (Document Embedder, Embed Office Viewer) publish their own attributes under the same
  name, and we were mounting our viewer over their markup and parsing their attributes
  as ours. render.php always stamps `wp-block-pdfp-pdf-poster`, so the class is both
  sufficient and unambiguous.

  WHEN -- whenever one appears, not just at DOMContentLoaded. Page builders render an
  element through admin-ajax and splice the HTML in long after the document is ready:
  WPBakery's frontend editor does it on every add and every edit, and Divi, Beaver,
  Oxygen, AJAX themes and infinite scroll all behave the same way. A one-shot scan at
  load leaves those blocks sitting on the "Loading Viewer..." placeholder forever.
  A MutationObserver covers all of them with no per-builder code, which is why the old
  Elementor-only polling loop is gone.
*/

const SELECTOR = ".wp-block-pdfp-pdf-poster";
const MOUNTED = "data-pdfp-initialized";

const mount = (block) => {
  if (block.hasAttribute(MOUNTED)) return;

  const attributesData = block.dataset.attributes;
  if (!attributesData) return;

  // Stamped before rendering: createRoot() mutates the subtree, which re-enters the
  // observer, and an unstamped container would be claimed a second time.
  block.setAttribute(MOUNTED, "true");

  try {
    const attributes = JSON.parse(attributesData);
    createRoot(block).render(<View attributes={attributes} id={block.id} />);
  } catch (e) {
    block.removeAttribute(MOUNTED);
    console.error("PDF Poster: could not initialise viewer", e);
  }
};

const scan = (root = document) => {
  if (!root || typeof root.querySelectorAll !== "function") return;

  // A builder can hand us the element itself rather than a wrapper around it.
  if (root.nodeType === 1 && typeof root.matches === "function" && root.matches(SELECTOR)) {
    mount(root);
  }

  root.querySelectorAll(`${SELECTOR}:not([${MOUNTED}])`).forEach(mount);
};

let scanQueued = false;
const queueScan = () => {
  if (scanQueued) return;
  scanQueued = true;
  // Coalesce a burst of insertions into one pass, and let the builder finish writing
  // the subtree before we read it.
  requestAnimationFrame(() => {
    scanQueued = false;
    scan(document);
  });
};

const holdsPoster = (node) =>
  node.nodeType === 1 &&
  ((typeof node.matches === "function" && node.matches(SELECTOR)) ||
    (typeof node.querySelector === "function" && node.querySelector(SELECTOR)));

const watch = () => {
  if (!document.body || typeof MutationObserver === "undefined") return;

  new MutationObserver((records) => {
    // Our own render churns the DOM constantly, so pay for a scan only when the added
    // markup could actually contain a poster.
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (holdsPoster(node)) {
          queueScan();
          return;
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
};

const start = () => {
  scan(document);
  watch();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

// Elementor renders widgets into its preview iframe outside the observed document, so
// it still needs its own hook. Registered opportunistically -- no retry loop, because
// the event below fires whenever Elementor loads late.
const runElementor = () => {
  if (!window.elementorFrontend?.hooks) return false;
  elementorFrontend.hooks.addAction("frontend/element_ready/global", ($scope) => scan($scope[0]));
  return true;
};

runElementor();

if (typeof jQuery !== "undefined") {
  jQuery(window).on("elementor/frontend/init", runElementor);
}

export function View({ attributes, id }) {
  const setAttributes = () => { };

  return (
    <>
      <Viewer RichText={RichText} attributes={attributes} setAttributes={setAttributes} __={__} id={id} />
    </>
  );
}

export function RichText({ tag: Tag = "p", value = "", ...props }) {
  if (value) {
    return <Tag {...props}>{value}</Tag>;
  }
  return null;
}

// eslint-disable-next-line no-unused-vars
export function __(text, textdomain) {
  return text;
}
