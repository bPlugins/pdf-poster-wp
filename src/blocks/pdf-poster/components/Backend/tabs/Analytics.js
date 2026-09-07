import { PanelBody, Spinner } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect, useState } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { PDFIcon } from "../../../../../icons/PDF";
import { PanelNewBadge } from "../../../../../Components/NewBadge";
import { PRICING_URL } from "../../../utils";

/**
 * Analytics panel.
 *
 * Read-only. Counting is controlled site-wide in Settings > Analytics; there is no
 * per-document switch, so one feature has exactly one control.
 *
 * Totals come from the same dispatcher the rest of the admin uses --
 * POST pdfp/v1/ajax with model=Analytics -- which already enforces `edit_posts`.
 *
 * Works for both kinds of embed. A saved PDF Poster is keyed `p:<id>`; a block dropped
 * straight onto a page or post is keyed by a sha1 of its file URL, which the browser
 * cannot compute -- so in that case the panel sends the URL and lets the server derive
 * the key with the same helper render.php uses.
 */
/**
 * 14-day view trend.
 *
 * Hand-authored SVG. It is drawn on every licensed panel, INCLUDING a window where
 * nothing was read: hiding the chart on a quiet document made the paid panel shorter
 * than the free one, which shows an example shape in the same place, and a feature that
 * disappears when a number is zero reads as broken rather than as empty.
 *
 * `muted` is that empty case. The flat line drops to the slate the rest of the admin
 * uses for absent values and loses its endpoint dot, so it cannot be misread as steady
 * traffic -- and the label beside it says "no views yet" in words.
 */
const Spark = ({ points, muted }) => {
  if (!points?.length) return null;

  const w = 260;
  const h = 44;
  const peak = Math.max(...points, 1);
  const step = points.length > 1 ? (w - 8) / (points.length - 1) : 0;
  const y = (v) => 4 + (h - 12) * (1 - v / peak);
  const coords = points.map((v, i) => `${(4 + i * step).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  const stroke = muted ? "#cbd5e1" : "#146ef5";

  return (
    <svg
      className="pdfp-analytics-spark"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={
        muted
          ? `No views in the last ${points.length} days`
          : `View trend over the last ${points.length} days`
      }
    >
      <polyline fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={coords} />
      {!muted && (
        <circle cx={(4 + (points.length - 1) * step).toFixed(1)} cy={y(last).toFixed(1)} r="3.2" fill={stroke} stroke="#fff" strokeWidth="2" />
      )}
    </svg>
  );
};

/**
 * The locked history block, at sidebar width.
 *
 * Same three moves as the Analytics screen: the real number stays sharp above, the
 * shape is frosted and labelled an example, and the withholding is COUNTED -- "47 days
 * recorded" is a fact about this site, where "upgrade for analytics" is a fact about
 * the price list. No daily figure for a past day reaches a free build, so there is no
 * numeral behind the blur to expose.
 */
const LockedHistory = ({ days }) => (
  <>
    <span className="pdfp-analytics-lockline">
      <svg className="pdfp-analytics-lockglyph" viewBox="0 0 9 11" aria-hidden="true" focusable="false">
        <path d="M2 4.5V3.2a2.5 2.5 0 0 1 5 0v1.3" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="4.5" width="7" height="5.5" fill="currentColor" />
      </svg>
      {days > 0
        ? sprintf(
            /* translators: %s: number of days of history already recorded */
            _n("%s day recorded", "%s days recorded", days, "pdf-poster"),
            Number(days).toLocaleString()
          )
        : __("Recording now", "pdf-poster")}
      <em>{__("example", "pdf-poster")}</em>
    </span>

    <svg className="pdfp-analytics-veil" viewBox="0 0 260 44" role="presentation">
      <polyline
        fill="none"
        stroke="#146ef5"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points="4,33 25,26 46,30 67,19 88,24 109,13 130,21 151,11 172,17 193,9 214,15 235,7 256,13"
      />
    </svg>
  </>
);

const Analytics = ({ attributes }) => {
  const { file = '' } = attributes || {};

  // Which TIER's readout to draw is decided by `data.pro` off the response -- the server
  // is the only thing that actually knows, and it is the same check that chose the
  // payload shape, so the panel can never draw a shape it was not sent.

  const { postId, postType } = useSelect((select) => {
    const editor = select("core/editor");
    return {
      postId: editor?.getCurrentPostId?.() || 0,
      postType: editor?.getCurrentPostType?.() || "",
    };
  }, []);

  const isPoster = postType === "pdfposter" && !!postId;

  // Every build asks: free gets today, Pro gets today plus the history.
  const canQuery = isPoster || !!file;

  const [state, setState] = useState({ loading: false, loaded: false, data: null, error: false });

  useEffect(() => {
    if (!canQuery) return;

    let alive = true;
    setState((s) => ({ ...s, loading: true }));

    apiFetch({
      path: "/pdfp/v1/ajax",
      method: "POST",
      // A poster reports against its id; anything else against its file, matching
      // exactly what render.php stamps into the markup for each case.
      data: isPoster
        ? { model: "Analytics", method: "totals", post: postId }
        : { model: "Analytics", method: "totals", file },
    })
      .then((data) => {
        if (alive) setState({ loading: false, loaded: true, data, error: false });
      })
      .catch(() => {
        if (alive) setState({ loading: false, loaded: true, data: null, error: true });
      });

    return () => {
      alive = false;
    };
  }, [canQuery, isPoster, postId, file]);

  const { loading, loaded, data, error } = state;
  const fmt = (n) => Number(n || 0).toLocaleString();
  const isPro = !!data?.pro;
  const hasData = !!data && (data.views > 0 || data.downloads > 0);

  // Free builds only -- totals() omits `history` on a licensed site, which never draws
  // the locked block anyway. Days before today, so a site whose first day is today
  // reports 0 and gets the copy written for that case.
  const historyDays = Math.max(0, Number(data?.history?.days || 0));

  // Pro, and nothing read in the window. The chart is still drawn -- see <Spark> -- so
  // this only decides which finish and which label it gets.
  const sparkEmpty = !data?.spark?.some((v) => v > 0);

  return (
    <PanelBody
      className="bPlPanelBody"
      title={
        <div className="pdfp-panel-icon">
          {PDFIcon} {__("Analytics", "pdf-poster")}{' '}
          <PanelNewBadge />
        </div>
      }
      initialOpen={false}
    >
      {!canQuery && (
        <p className="pdfp-analytics-note">
          {__("Choose a PDF first \u2014 views and downloads appear here once the document has been embedded and read.", "pdf-poster")}
        </p>
      )}

      {canQuery && loading && !loaded && (
        <p className="pdfp-analytics-note">
          <Spinner /> {__("Loading\u2026", "pdf-poster")}
        </p>
      )}

      {canQuery && loaded && error && (
        <p className="pdfp-analytics-note">{__("Could not load the numbers just now. Reload the editor to try again.", "pdf-poster")}</p>
      )}

      {canQuery && loaded && !error && (
        <>
          {/* Same two tiles on both tiers, in the same place. Only the period changes,
              and the label says which -- "Views" over a figure that resets at midnight
              would be the one genuinely misleading thing this panel could do. */}
          <div className="pdfp-analytics-grid">
            <div className="pdfp-analytics-stat">
              <span className="pdfp-analytics-label">
                {isPro ? __("Views", "pdf-poster") : __("Views today", "pdf-poster")}
              </span>
              <span className="pdfp-analytics-value">{fmt(isPro ? data?.views : data?.today?.views)}</span>
            </div>
            <div className="pdfp-analytics-stat">
              <span className="pdfp-analytics-label">
                {isPro ? __("Downloads", "pdf-poster") : __("Downloads today", "pdf-poster")}
              </span>
              <span className="pdfp-analytics-value">{fmt(isPro ? data?.downloads : data?.today?.downloads)}</span>
            </div>
          </div>

          {/* Two points minimum -- one day cannot draw a line -- but no test on the
              values: a licensed panel shows this chart whether or not the window has
              anything in it, so it never has fewer parts than the free panel. */}
          {isPro && data?.spark?.length > 1 && (
            <>
              <Spark points={data.spark} muted={sparkEmpty} />
              <div className="pdfp-analytics-trend">
                <span>{__("Last 14 days", "pdf-poster")}</span>
                {sparkEmpty ? (
                  <span className="pdfp-analytics-flat">{__("no views yet", "pdf-poster")}</span>
                ) : data.trend === null ? (
                  <span className="pdfp-analytics-flat">{__("no baseline", "pdf-poster")}</span>
                ) : (
                  <span className={data.trend >= 0 ? "pdfp-analytics-up" : "pdfp-analytics-down"}>
                    {data.trend > 0 ? `+${data.trend}%` : `${data.trend}%`}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Free build. The number above is real; what is withheld is every reading of
              the past. The upsell carries the retention disclosure, because a user is
              entitled to know their site is recording days it will not show them. */}
          {!isPro && (
            <>
              {data?.countingSince && <p className="pdfp-analytics-note">{data.countingSince}</p>}
              <a className="pdfp-analytics-locked" href={PRICING_URL} target="_blank" rel="noopener noreferrer">
                <LockedHistory days={historyDays} />
                <p className="pdfp-analytics-note">
                  {historyDays > 0
                    ? sprintf(
                        /* translators: %s: number of days of history already recorded */
                        _n(
                          "Your last %s day is recorded in your own database. Pro reads it back as totals, a 14-day trend, your best-performing documents and a report you can export.",
                          "Your last %s days are recorded in your own database. Pro reads them back as totals, a 14-day trend, your best-performing documents and a report you can export.",
                          historyDays,
                          "pdf-poster"
                        ),
                        Number(historyDays).toLocaleString()
                      )
                    : __(
                        "Yesterday and earlier are being recorded in your own database. Pro reads them back as totals, a 14-day trend, your best-performing documents and a report you can export.",
                        "pdf-poster"
                      )}
                </p>
              </a>
            </>
          )}

          {isPro && data?.reportUrl && (
            <div className="pdfp-analytics-actions">
              {/* New tab on purpose: this panel lives in an editor, and following a link
                  out of it would abandon whatever is unsaved. */}
              <a
                className="components-button is-primary"
                href={data.reportDocUrl || data.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {__("Show Analytics", "pdf-poster")}
              </a>
              <a
                className="components-button is-secondary"
                href={data.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {__("All Analytics", "pdf-poster")}
              </a>
            </div>
          )}

          {data?.tracking === false && (
            <p className="pdfp-analytics-note pdfp-analytics-off">
              {__("Counting is switched off for this site, so these numbers are not updating.", "pdf-poster")}
            </p>
          )}

          {isPro && data?.tracking !== false && !hasData && (
            <p className="pdfp-analytics-note">
              {__(
                "Nothing recorded yet. Visit a page where this document is embedded and the numbers appear within a few seconds.",
                "pdf-poster"
              )}{' '}
              {/* Whose visits count is a setting, and `excludeEditors` off the response
                  is what it currently says. Promising the reader their own reads are
                  ignored when they are being counted sends them hunting a bug that is
                  not there -- the same reason emptyFor() on the Analytics screen asks
                  before it makes the claim. Whole sentences either way, so translators
                  never get a fragment. */}
              {data?.excludeEditors
                ? __("Your own visits are not counted while you are logged in as an editor.", "pdf-poster")
                : __("Your own visits are counted too, because Settings \u203a Analytics is not excluding editors.", "pdf-poster")}
            </p>
          )}
        </>
      )}
    </PanelBody>
  );
};

export default Analytics;
