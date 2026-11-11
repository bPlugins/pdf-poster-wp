import { useEffect, useState } from "react";

/**
 * The cover state of one Media Library PDF, from the admin cover store
 * (assets/admin/js/auto-thumbnail.js -> window.pdfpCover).
 *
 * Asking the store is also what heals a PDF uploaded before Auto Thumbnail existed:
 * a missing or outdated cover is queued for generation the first time anyone looks.
 * Returns null on the front end (no store) or when there is no attachment id.
 */
export default function useCoverState(pdfId) {
  const store = typeof window !== "undefined" ? window.pdfpCover : null;
  const id = Number(pdfId) || 0;
  const [state, setState] = useState(() => (store && id ? store.peek(id) : null));

  useEffect(() => {
    if (!store || !id) {
      setState(null);
      return undefined;
    }

    let alive = true;
    const onChange = (event) => {
      if (alive && event.detail?.id === id) setState(event.detail.state);
    };
    window.addEventListener("pdfp:cover", onChange);
    store.get(id).then((s) => alive && setState(s)).catch(() => {});

    return () => {
      alive = false;
      window.removeEventListener("pdfp:cover", onChange);
    };
  }, [store, id]);

  return state;
}
