// eslint-disable-next-line no-unused-vars
import { version } from 'react-dom'
import { createRoot } from "react-dom";

import Viewer from "./components/Common/Viewer";
import "./style.scss";
import "./public.scss";

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
    // Parsed once and handed to React, so the raw config (file URL included) has no
    // reason to stay in the DOM. Dropped only once mounting succeeded: a failure keeps
    // it so the next scan can retry.
    block.removeAttribute("data-attributes");
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
