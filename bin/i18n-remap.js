#!/usr/bin/env node
/**
 * Rewrites the JavaScript `#:` references in the POT from src/ paths to the
 * webpack bundle each file is compiled into.
 *
 * WordPress resolves a script's translations by hashing the script's path
 * relative to the plugin root (`load_script_textdomain()` -> md5 of e.g.
 * "build/blocks/pdf-poster/index.js"). Both `wp i18n make-json` and the
 * translate.wordpress.org build derive their JSON filenames from the POT's
 * references, so a POT that points at src/ produces JSON files whose names no
 * enqueued script will ever look for, and the editor silently stays English.
 *
 * make-pot has to read src/ rather than build/: the production bundles are
 * single minified lines over a megabyte wide and the JS parser dies on them.
 * So we extract from source and remap the references afterwards.
 */
const fs = require("fs");
const path = require("path");

const POT = path.join(__dirname, "..", "languages", "pdf-poster.pot");

// Mirrors the entry points in webpack.config.js. Returns every bundle a source
// file can end up in -- shared code is compiled into more than one, and a
// string missing from a bundle's JSON silently falls back to English there.
const BLOCK_BUNDLES = [
  "build/blocks/pdf-poster/index.js",
  "build/blocks/selector/index.js",
];

function bundlesFor(file) {
  // Shared code: webpack inlines a copy into every entry that imports it.
  if (/^src\/(Components|hooks|icons)\//.test(file)) return BLOCK_BUNDLES;
  if (file === "src/utils.js") return BLOCK_BUNDLES;
  if (/^src\/blocks\/[^/]+\/components\/Common\//.test(file)) return BLOCK_BUNDLES;

  const block = file.match(/^src\/blocks\/([^/]+)\//);
  if (block) {
    // view.js is its own entry; the rest of the block folds into index.js.
    if (/^src\/blocks\/[^/]+\/view\.js$/.test(file)) {
      return [`build/blocks/${block[1]}/view.js`];
    }
    return [`build/blocks/${block[1]}/index.js`];
  }

  if (file.startsWith("src/dashboard/")) return ["build/dashboard.js"];
  if (file === "src/admin.js") return ["build/admin.js"];
  if (file === "src/public.js") return ["build/public.js"];
  return null;
}

if (!fs.existsSync(POT)) {
  console.error(`i18n-remap: ${POT} not found -- run make-pot first.`);
  process.exit(1);
}

const lines = fs.readFileSync(POT, "utf8").split("\n");
const out = [];
let pending = [];
const unmapped = new Set();
let remapped = 0;

const flush = () => {
  if (!pending.length) return;
  // Bundling collapses many source files onto one path, so drop the duplicates.
  for (const ref of [...new Set(pending)]) out.push(`#: ${ref}`);
  pending = [];
};

for (const line of lines) {
  if (line.startsWith("#: ")) {
    for (const ref of line.slice(3).trim().split(/\s+/).filter(Boolean)) {
      const file = ref.replace(/:\d+$/, "");
      if (!file.startsWith("src/")) {
        pending.push(ref);
        continue;
      }
      const bundles = bundlesFor(file);
      if (bundles) {
        pending.push(...bundles);
        remapped++;
      } else {
        unmapped.add(file);
        pending.push(ref);
      }
    }
    continue;
  }
  flush();
  out.push(line);
}
flush();

fs.writeFileSync(POT, out.join("\n"), "utf8");

for (const f of unmapped) console.warn(`i18n-remap: no bundle known for ${f}`);
console.log(`i18n-remap: rewrote ${remapped} JS reference(s) to build/ paths.`);
