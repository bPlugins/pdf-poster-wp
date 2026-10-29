/**
 * Who is reading, for the {user_name}, {user_email} and {user_ip} watermark tokens.
 *
 * Asked once per page and shared by every viewer on it: the server leaves these tokens
 * out of the HTML so a page cache never stores one reader's name for the next (see
 * PDFP_Visitor). Resolves to {} when the request fails, so a mark still draws with the
 * tokens left blank rather than not at all -- and to null where there is no endpoint
 * (the block editor), which keeps the placeholders visible for the author.
 */
let pending = null;

const fetchVisitor = () => {
  if (pending) return pending;
  const url = typeof window !== "undefined" && window.pdfp && window.pdfp.visitorUrl;
  if (!url || typeof fetch !== "function") return (pending = Promise.resolve(null));
  pending = fetch(url, { credentials: "same-origin", cache: "no-store" })
    .then((res) => (res.ok ? res.json() : {}))
    .then((data) => ({
      userName: (data && data.userName) || "",
      userEmail: (data && data.userEmail) || "",
      userIp: (data && data.userIp) || "",
    }))
    .catch(() => ({}));
  return pending;
};

export default fetchVisitor;
