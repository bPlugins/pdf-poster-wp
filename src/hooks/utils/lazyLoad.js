/**
 * Settings > Performance > Lazy Loading, as localized into `pdfp.lazyLoad`.
 *
 * wp_localize_script() stringifies scalars, so the flag arrives as "1" or "" rather
 * than true or false. Only an explicit off value counts as off: a missing flag means
 * on, the default, which is also what a page gets when `pdfp` was never printed (a
 * builder preview, a cached page from before the setting).
 *
 * @returns {boolean}
 */
export default function isLazyLoadEnabled() {
  if (typeof pdfp === "undefined") return true;
  return ![false, "", "0", 0].includes(pdfp?.lazyLoad);
}
