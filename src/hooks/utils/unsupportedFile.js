/**
 * PDF Poster shows PDFs only. An office document handed to it would otherwise reach
 * PDF.js and fail as "Invalid PDF structure", or sit as an empty box -- so the viewer
 * recognises it up front and says what it supports instead.
 *
 * Mirrors the Pro helper of the same name, minus its Google Drive handling: Drive links
 * are a Pro feature, and Google URLs keep their existing path through the viewer here.
 */

const DOCUMENT_EXTENSIONS = [
  "doc", "docx", "docm", "dot", "dotx",
  "xls", "xlsx", "xlsm", "xlt", "xltx", "csv",
  "ppt", "pptx", "pptm", "pps", "ppsx", "pot", "potx",
  "odt", "ods", "odp", "rtf", "txt", "pages", "numbers", "key", "epub",
];

/**
 * Is `url` a document PDF Poster cannot show? Only the case we can be sure of: a known
 * non-PDF extension. Anything else -- a URL with no extension, a download script -- is
 * left for the viewer to try.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isUnsupportedFile(url) {
  if (typeof url !== "string" || !url) return false;

  let path;
  try {
    path = new URL(url, window.location.href).pathname;
  } catch (e) {
    return false;
  }

  const extension = (path.split("/").pop().match(/\.([a-z0-9]+)$/i) || [])[1];
  return !!extension && DOCUMENT_EXTENSIONS.includes(extension.toLowerCase());
}

/**
 * The message for a file that is not a PDF. Everyone is told what PDF Poster supports;
 * someone who can edit the poster is also told how to fix it.
 *
 * @param {Function} __          Translation function.
 * @param {boolean}  canDiagnose Whether the reader can edit posts.
 * @returns {string}
 */
export function describeUnsupportedFile(__, canDiagnose) {
  const message = __("PDF Poster supports PDF files only.", "pdf-poster");

  if (!canDiagnose) {
    return message;
  }

  return `${message} ${__("Please add a PDF file.", "pdf-poster")}`;
}
