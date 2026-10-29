/**
 * Gatekeepers for the stored document URL before it becomes an iframe src or a link href.
 *
 * The `file` attribute is author input -- anyone who can edit a post can write it -- so
 * it is parsed, never substring-matched. A `.includes(".google.com")` test passes
 * `javascript:...//google.com`, and an iframe will run that on the site's own origin.
 */

const parse = (url) => {
  try {
    return new URL(url, window.location.href);
  } catch (e) {
    return null;
  }
};

// blob: is created by this page at runtime and cannot be authored into markup.
const ALLOWED_PROTOCOLS = ["http:", "https:", "blob:"];

// Google hosts whose own URLs may be framed as-is.
const GOOGLE_VIEWER_HOSTS = ["docs.google.com", "drive.google.com"];

/**
 * The URL unchanged when it resolves to http(s) or blob:, otherwise "". Relative URLs
 * resolve against the page, so they pass as http(s).
 */
export default function safeFileUrl(url) {
  if (typeof url !== "string" || !url.trim()) return "";

  const target = parse(url.trim());
  return target && ALLOWED_PROTOCOLS.includes(target.protocol) ? url : "";
}

/**
 * True only for an http(s) URL whose host is exactly docs.google.com or drive.google.com.
 */
export function isGoogleViewerUrl(url) {
  if (typeof url !== "string" || !url) return false;

  const target = parse(url);
  return !!target && ["http:", "https:"].includes(target.protocol) && GOOGLE_VIEWER_HOSTS.includes(target.hostname);
}

/**
 * Sandbox for a cross-origin Google viewer frame. allow-same-origin is safe here only
 * because the frame is never same-origin with the site.
 */
export const GOOGLE_VIEWER_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms";
