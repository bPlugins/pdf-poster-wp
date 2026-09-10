/**
 * Serve a URL over the same scheme as the page.
 *
 * Anchored on purpose. An unanchored /https?:/ replaces the FIRST match anywhere in the
 * string, so a URL that carries another URL in its query -- a proxy, a signed CDN link,
 * a viewer wrapper -- would have that inner scheme rewritten instead of its own, and
 * the request would go somewhere else entirely.
 */
export default function matchProtocol(source) {
  if (typeof source !== 'string') return source;
  return source.replace(/^https?:/i, window.location.protocol);
}
