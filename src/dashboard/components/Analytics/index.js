import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';

import Chart from './Chart';
import LockedHistory from './LockedHistory';
import './style.scss';

/**
 * PDF Poster › Analytics.
 *
 * A route inside the dashboard that already exists rather than a second admin page with
 * its own React root: it inherits the header, the nav, Roboto/Lato and the palette, and
 * costs two lines in App.js and Layout.js instead of a new mount and a second stylesheet.
 *
 * Every panel here describes one window, so the whole screen is fed by a single request
 * (model=Analytics, method=summary). Splitting it would let the tiles and the chart
 * disagree whenever responses landed out of order.
 */

const RANGES = [
    { days: 1, label: 'Today' },
    { days: 7, label: '7 days' },
    { days: 30, label: '30 days' },
    { days: 90, label: '90 days' },
];

const fmt = (v) => Number(v || 0).toLocaleString();

const prettyDate = (day) => {
    const d = new Date(`${day}T00:00:00`);
    return isNaN(d) ? day : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Percentage change, or null when there is no baseline to compare against. */
const delta = (now, before) => {
    if (!before) return null;
    return Math.round(((now - before) / before) * 100);
};

/**
 * Props for a link that leaves the report.
 *
 * Opening in a new tab keeps the range and document filter you were looking at, and
 * `rel=noopener` stops the new tab reaching back through window.opener. The aria-label
 * carries the warning a sighted user gets from the tab appearing.
 */
const newTab = (label) => ({
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `${label} (opens in a new tab)`,
});

/**
 * The document filter.
 *
 * Grouped rather than one flat list: a saved poster and a url-keyed embed are different
 * kinds of thing, and an embed is named by the page it sits on because its own identity
 * is a hash nobody can recognise.
 *
 * Present on both tiers. Free filters today's figures; Pro filters the whole report.
 */
const DocPicker = ({ list, value, onChange }) => (
    <label className='pdfpDocPicker'>
        <span className='screen-reader-text'>Document</span>
        <select className='pdfpSelect' value={value} onChange={(e) => onChange(e.target.value)}>
            <option value=''>All documents</option>
            {list.posters?.length > 0 && (
                <optgroup label='PDF Posters'>
                    {list.posters.map((d) => (
                        <option key={d.doc} value={d.doc}>
                            {d.title}
                        </option>
                    ))}
                </optgroup>
            )}
            {list.embeds?.length > 0 && (
                <optgroup label='Embedded files'>
                    {list.embeds.map((d) => (
                        <option key={d.doc} value={d.doc}>
                            {d.title}
                        </option>
                    ))}
                </optgroup>
            )}
        </select>
    </label>
);

/**
 * The ranked documents table.
 *
 * ONE component for both tiers: free ranks today, Pro ranks the chosen range. They are
 * the same table answering the same question over a different window, so rendering it
 * twice would be two designs of one thing -- and the free one would quietly fall behind
 * every time the Pro one gained a column.
 *
 * The bars are scaled to the largest value IN THIS TABLE, not to a global maximum, so a
 * one-day view is as readable as a ninety-day one.
 */
const DocTable = ({ rows, loading, emptyText }) => {
    const maxViews = rows.reduce((m, d) => Math.max(m, d.views), 0);
    const maxDownloads = rows.reduce((m, d) => Math.max(m, d.downloads), 0);

    return rows.length ? (
            <div className='pdfpTableScroll'>
                <table className='pdfpTable'>
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Views</th>
                            <th>Downloads</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((doc) => (
                            <tr key={doc.doc}>
                                <td>
                                    {doc.editUrl ? (
                                        <a href={doc.editUrl} {...newTab(doc.title)}>
                                            {doc.title}
                                        </a>
                                    ) : (
                                        /* No saved poster behind it. The page
                                           the block sits on IS the useful name
                                           here, so it takes the primary blue
                                           link -- exactly like a poster row --
                                           and the file identity drops to the
                                           micro-label the rest of this page
                                           uses for metadata. */
                                        <div className='pdfpDocCell'>
                                            {doc.origin?.id ? (
                                                <>
                                                    <a
                                                        href={doc.origin.editUrl || doc.origin.viewUrl}
                                                        {...newTab(doc.origin.title)}
                                                    >
                                                        {doc.origin.title}
                                                    </a>
                                                    <span className='pdfpDocMeta'>
                                                        <span className='pdfpMetaLabel'>Embed</span>
                                                        {` · ${doc.doc.slice(2, 8)}`}
                                                        {doc.origin.type ? ` · ${doc.origin.type}` : ''}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className='pdfpDocPlain'>{doc.title}</span>
                                                    <span className='pdfpDocMeta'>
                                                        <span className='pdfpMetaLabel'>Embed</span>
                                                        {' · not on any current page'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <span className='pdfpMetric'>
                                        {fmt(doc.views)}
                                        <span className='pdfpBar'>
                                            <i
                                                style={{
                                                    width: `${maxViews ? (doc.views / maxViews) * 100 : 0}%`,
                                                    background: '#146ef5',
                                                }}
                                            />
                                        </span>
                                    </span>
                                </td>
                                <td>
                                    <span className='pdfpMetric'>
                                        {fmt(doc.downloads)}
                                        <span className='pdfpBar'>
                                            <i
                                                style={{
                                                    width: `${maxDownloads ? (doc.downloads / maxDownloads) * 100 : 0}%`,
                                                    background: '#cc6200',
                                                }}
                                            />
                                        </span>
                                    </span>
                                </td>
                                <td className='pdfpNum'>
                                    {doc.views > 0 ? `${((doc.downloads / doc.views) * 100).toFixed(1)}%` : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    ) : (
        <p className='pdfpEmpty'>{loading ? 'Loading…' : emptyText}</p>
    );
};

/**
 * The empty-state sentence for a documents table.
 *
 * "Your own visits are not counted" is only true while Settings > Analytics is excluding
 * editors -- it is a switch, not a fact. Telling someone their visits are ignored when
 * they are being counted sends them hunting for a bug that is not there.
 */
const emptyFor = (window_, excludeEditors) =>
    `Nothing recorded ${window_} yet. Visit a page where a document is embedded${
        excludeEditors ? ' — your own visits are not counted while you are logged in as an editor' : ''
    }.`;

/**
 * The padlock on a range the free build cannot read.
 *
 * The locked chips are DRAWN rather than hidden: the free user learns the shape of the
 * paid screen before paying, and one screenshot of this page serves both the plugin
 * gallery and the pricing page.
 */
const RangeLock = () => (
    <svg className='pdfpChipLock' viewBox='0 0 9 11' aria-hidden='true' focusable='false'>
        <path d='M2 4.5V3.2a2.5 2.5 0 0 1 5 0v1.3' fill='none' stroke='currentColor' strokeWidth='1.2' />
        <rect x='1' y='4.5' width='7' height='5.5' fill='currentColor' />
    </svg>
);

/**
 * How counting works.
 *
 * The same three facts the footnote carried as one paragraph, in the labelled cells the
 * rest of this screen is built from. People arrive with three separate questions --
 * "does this count me twice?", "does it survive my page cache?", "where does the data
 * go?" -- and three sentences run together answer none of them at a glance.
 *
 * ONE component for both tiers. The paragraph used to be written out twice in this
 * file, which is one careless edit away from the free and paid screens making different
 * promises about privacy.
 */
const FACTS = [
    {
        key: 'view',
        label: 'What counts as a view',
        body: 'The viewer has rendered the document and been on screen for a second — then not again for that visitor for 30 minutes.',
        icon: (
            <svg viewBox='0 0 14 14' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true' focusable='false'>
                <path d='M1 7s2.4-4 6-4 6 4 6 4-2.4 4-6 4-6-4-6-4Z' strokeLinejoin='round' />
                <circle cx='7' cy='7' r='1.9' />
            </svg>
        ),
    },
    {
        key: 'cache',
        label: 'Works behind a cache',
        body: "Counting happens in the visitor's browser, not while the page is being built, so the numbers keep working behind a page cache.",
        icon: (
            <svg viewBox='0 0 14 14' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true' focusable='false'>
                <path d='M7.8 1 3 7.6h3.1L6.2 13 11 6.4H7.7L7.8 1Z' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        key: 'private',
        label: 'Stays on your site',
        body: 'No IP address is stored and nothing is sent to a third party — the rows live in your own database.',
        icon: (
            <svg viewBox='0 0 14 14' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true' focusable='false'>
                <path d='M7 1.2l4.6 1.7v3.6c0 2.8-1.9 4.9-4.6 5.6-2.7-.7-4.6-2.8-4.6-5.6V2.9L7 1.2Z' strokeLinejoin='round' />
                <path d='M4.9 7.1 6.4 8.6l2.8-2.9' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

const CountingFootnote = () => (
    <div className='pdfpLedger'>
        <p className='pdfpLedgerRule'>How counting works</p>

        <div className='pdfpLedgerGrid'>
            {FACTS.map((f) => (
                <div className='pdfpLedgerCell' key={f.key}>
                    <span className='pdfpLedgerLabel'>
                        {f.icon}
                        {f.label}
                    </span>
                    <span className='pdfpLedgerBody'>{f.body}</span>
                </div>
            ))}
        </div>
    </div>
);

const Delta = ({ value }) => {
    if (value === null) return <span className='pdfpPill flat'>no baseline</span>;
    if (value === 0) return <span className='pdfpPill flat'>no change</span>;
    return <span className={`pdfpPill ${value > 0 ? 'up' : 'down'}`}>{value > 0 ? `+${value}%` : `${value}%`}</span>;
};

/**
 * The document filter comes from the page URL, not from state.
 *
 * "Show Analytics" on a poster is a real page load carrying ?doc=p:123, so the filter has
 * to survive that navigation -- and it means the filtered view is a bookmarkable,
 * shareable link rather than a mode you can only reach by clicking.
 */
const docFromUrl = () => {
    try {
        const value = new URLSearchParams(window.location.search).get('doc') || '';
        return /^(p:[1-9][0-9]{0,18}|u:[0-9a-f]{40})$/.test(value) ? value : '';
    } catch (e) {
        return '';
    }
};

const Analytics = ({ isPremium, adminUrl }) => {
    const [days, setDays] = useState(30);
    const [doc, setDoc] = useState(docFromUrl);
    const [docList, setDocList] = useState({ posters: [], embeds: [] });
    const [state, setState] = useState({ loading: true, data: null, error: null });
    const [exporting, setExporting] = useState(false);

    // Free build only. A locked chip answers a question the reader just asked about
    // their own data, so it brings the card that answers it into view and flags it --
    // opening a payment dialog at that moment is where the goodwill goes.
    const stageRef = useRef(null);
    const [pulsing, setPulsing] = useState(false);

    const askedForRange = useCallback(() => {
        stageRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setPulsing(true);
    }, []);

    useEffect(() => {
        if (!pulsing) return undefined;

        const t = window.setTimeout(() => setPulsing(false), 1000);
        return () => window.clearTimeout(t);
    }, [pulsing]);

    /**
     * Change the filter and keep the URL honest.
     *
     * replaceState rather than a reload: the request is already re-fired by the effects
     * below, and a full navigation would throw away the selected range. Writing ?doc=
     * back into the address bar keeps the filtered view bookmarkable and shareable,
     * which is the property docFromUrl() exists to support.
     */
    const selectDoc = useCallback((next) => {
        setDoc(next);

        try {
            const url = new URL(window.location.href);
            if (next) {
                url.searchParams.set('doc', next);
            } else {
                url.searchParams.delete('doc');
            }
            window.history.replaceState({}, '', url);
        } catch (e) {
            // A browser that refuses history writes still filters correctly; only the
            // bookmarkability is lost, so this is not worth surfacing.
        }
    }, []);

    // The picker is on both tiers, so its list is fetched on both.
    useEffect(() => {
        let alive = true;

        apiFetch({
            path: '/pdfp/v1/ajax',
            method: 'POST',
            data: { model: 'Analytics', method: 'documents' },
        })
            .then((d) => {
                if (alive) setDocList({ posters: d?.posters || [], embeds: d?.embeds || [] });
            })
            .catch(() => {});

        return () => {
            alive = false;
        };
    }, []);

    const load = useCallback(
        (range) => {
            setState((s) => ({ ...s, loading: true, error: null }));

            apiFetch({
                path: '/pdfp/v1/ajax',
                method: 'POST',
                data: { model: 'Analytics', method: 'summary', days: range, doc },
            })
                .then((data) => setState({ loading: false, data, error: null }))
                .catch((err) => setState({ loading: false, data: null, error: err?.error || err?.code || 'failed' }));
        },
        [doc]
    );

    useEffect(() => {
        if (isPremium) load(days);
    }, [days, isPremium, load]);

    // Free build only. summary() is Pro and 403s, so the free screen is fed by today(),
    // which answers for every tier. A licensed build never draws that branch and never
    // makes this request.
    const [today, setToday] = useState({ loading: true, data: null });

    useEffect(() => {
        if (isPremium) return undefined;

        let alive = true;

        apiFetch({
            path: '/pdfp/v1/ajax',
            method: 'POST',
            data: { model: 'Analytics', method: 'today', doc },
        })
            .then((data) => {
                if (alive) setToday({ loading: false, data });
            })
            .catch(() => {
                if (alive) setToday({ loading: false, data: null });
            });

        return () => {
            alive = false;
        };
    }, [isPremium, doc]);

    // Component scope, not inside a branch: both tiers show "of N documents", and N is
    // the picker's own list so the tile and the selectable documents are one set.
    const docTotal = (docList.posters?.length || 0) + (docList.embeds?.length || 0);

    const { loading, data, error } = state;

    const totals = data?.totals || { views: 0, downloads: 0 };
    const previous = data?.previous || { views: 0, downloads: 0 };
    const docs = data?.docs || [];

    // What the deltas are measured against. A one-day range compares with yesterday,
    // and "vs previous 1 days" is the kind of string that makes a product look unfinished.
    const vsLabel = days === 1 ? 'vs yesterday' : `vs previous ${days} days`;
    const rangeLabel = days === 1 ? 'today' : `${days} days`;

    const rate = totals.views > 0 ? (totals.downloads / totals.views) * 100 : 0;
    const prevRate = previous.views > 0 ? (previous.downloads / previous.views) * 100 : 0;

    const busiest = useMemo(() => {
        if (!data?.series?.length) return null;
        return data.series.reduce((best, p) => (p.views > (best?.views ?? -1) ? p : best), null);
    }, [data]);

    const exportCsv = () => {
        setExporting(true);
        apiFetch({
            path: '/pdfp/v1/ajax',
            method: 'POST',
            data: { model: 'Analytics', method: 'export', days, doc },
        })
            .then(({ csv, filename }) => {
                // Built and released in the browser: nothing is written on the server, so
                // there is no temporary file to clean up or to leak.
                const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
                const a = document.createElement('a');
                a.href = url;
                a.download = filename || 'pdf-poster-insights.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch(() => {})
            .finally(() => setExporting(false));
    };

    // ---------------------------------------------------------------- free build
    // Today is real on every tier -- pdfp_should_count() no longer checks entitlement, so
    // these figures are this site's own. What Pro unlocks is every reading of the past,
    // which is why this branch fetches `today` (free-safe) rather than `summary` (403).
    //
    // The copy must never imply history is missing: it is being recorded right now, and
    // saying otherwise here would be the one place in the product that lies about it.
    if (!isPremium) {
        const t = today.data?.totals || { views: 0, downloads: 0 };
        const topDocs = today.data?.docs || [];

        return (
            <div className='bPlDashboardContainer'>
                <div className='pdfpAnalytics'>
                    <div className='pdfpAnalyticsHead'>
                        <div>
                            <h2 className='pdfpAnalyticsTitle'>
                                {doc && today.data?.docTitle ? today.data.docTitle : 'Analytics'}
                            </h2>
                            <p className='pdfpAnalyticsSub'>
                                {doc
                                    ? "Today's views and downloads for this document."
                                    : 'Find out which of your PDFs people actually read.'}
                            </p>
                        </div>

                        <div className='pdfpAnalyticsControls'>
                            <DocPicker list={docList} value={doc} onChange={selectDoc} />

                            {/* The Pro control set, in the Pro position, locked. Today
                                is genuinely selected -- it is the window this screen
                                shows -- so the group is honest as well as instructive. */}
                            <div className='pdfpChips' role='group' aria-label='Date range'>
                                <button type='button' className='pdfpChip on' aria-pressed='true'>
                                    Today
                                </button>
                                {RANGES.filter((r) => r.days > 1).map((r) => (
                                    <button
                                        key={r.days}
                                        type='button'
                                        className='pdfpChip locked'
                                        aria-label={`${r.label} — included in Pro`}
                                        onClick={askedForRange}
                                    >
                                        <RangeLock />
                                        {r.label}
                                    </button>
                                ))}
                            </div>

                            <button
                                type='button'
                                className='pdfpGhostBtn locked'
                                aria-label='Export CSV — included in Pro'
                                onClick={askedForRange}
                            >
                                <RangeLock />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {today.data?.tracking === false && (
                        <div className='pdfpNotice warn'>
                            Counting is switched off for this site, so nothing is being recorded. Turn it back on in
                            Settings › Analytics.
                        </div>
                    )}

                    <div className='pdfpTiles'>
                        <div className='pdfpTile views'>
                            <span className='pdfpTileLabel'>Views today</span>
                            <span className='pdfpTileValue'>{today.loading && !today.data ? '—' : fmt(t.views)}</span>
                            <span className='pdfpTileFoot'>
                                <span className='pdfpTileNote'>resets at midnight, site time</span>
                            </span>
                        </div>

                        <div className='pdfpTile downloads'>
                            <span className='pdfpTileLabel'>Downloads today</span>
                            <span className='pdfpTileValue'>{today.loading && !today.data ? '—' : fmt(t.downloads)}</span>
                            <span className='pdfpTileFoot'>
                                <span className='pdfpTileNote'>resets at midnight, site time</span>
                            </span>
                        </div>

                        {/* Counting documents is only a question when looking at all of
                            them; filtered to one it can only ever say 1 or 0. The
                            provenance line moves onto the downloads tile in that case so
                            it is never lost. */}
                        {!doc && (
                            <div className='pdfpTile'>
                                <span className='pdfpTileLabel'>Documents counted today</span>
                                <span className='pdfpTileValue'>
                                    {today.loading && !today.data ? '—' : fmt(today.data?.docCount)}
                                </span>
                                <span className='pdfpTileFoot'>
                                    {/* The denominator is the picker's own list, so this
                                        number and the documents you can select are always
                                        the same set. "Counted", not "read": a row exists
                                        for a download too. */}
                                    <span className='pdfpTileNote'>
                                        {docTotal ? `of ${fmt(docTotal)} documents` : 'with a view or download'}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* The same ranked table Pro draws, over today. Identical anatomy --
                        bars, download rate, the embed's host page -- because it is the
                        same component; only the window differs. */}
                    {today.data?.countingSince && (
                        <p className='pdfpTileNote pdfpSinceLine'>{today.data.countingSince}</p>
                    )}

                    {/* Where Pro draws its chart, so the licensed screen is this screen
                        with the glass lifted rather than a different layout. The panel is
                        also the only call to action here -- the previous text-only upgrade
                        card is folded into it, because two pitches on one screen is the
                        nag pattern this product should not adopt.

                        Absolute pricing url, not '#pricing': this page can be mounted
                        standalone with no router, where a bare hash rewrites the fragment
                        and navigates nowhere. The dashboard route is '#/pricing'. */}
                    <LockedHistory
                        ref={stageRef}
                        history={today.data?.history}
                        tracking={today.data?.tracking}
                        pulsing={pulsing}
                        pricingUrl={`${adminUrl}/edit.php?post_type=pdfposter&page=pdf-poster#/pricing`}
                    />

                    {!doc && (
                        <div className='bPlDashboardCard pdfpPanel'>
                            <div className='pdfpPanelHead'>
                                <span className='pdfpPanelTitle'>Top documents today</span>
                                <span className='pdfpPanelMeta'>by views · today</span>
                            </div>

                            <DocTable
                                rows={topDocs}
                                loading={today.loading}
                                emptyText={emptyFor('today', today.data?.excludeEditors)}
                            />
                        </div>
                    )}

                    <CountingFootnote />
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------- pro build
    return (
        <div className='bPlDashboardContainer'>
            <div className='pdfpAnalytics'>
                <div className='pdfpAnalyticsHead'>
                    <div>
                        <h2 className='pdfpAnalyticsTitle'>
                            {data?.docTitle ? data.docTitle : 'Analytics'}
                        </h2>
                        <p className='pdfpAnalyticsSub'>
                            {data?.range
                                ? `${prettyDate(data.range.from)} – ${prettyDate(data.range.to)}${
                                      data.doc
                                          ? ''
                                          : ` · ${fmt(data.docCount)} ${data.docCount === 1 ? 'document' : 'documents'}`
                                  }${data.excludeEditors ? ' · logged-in editors excluded' : ''}`
                                : 'Loading…'}
                        </p>
                        {data?.doc && (
                            <p className='pdfpAnalyticsCrumbs'>
                                {/* A button, not the allUrl link: resetting in place keeps
                                    the selected range, where a navigation would throw it
                                    away and land the reader back on 30 days. */}
                                <button type='button' className='pdfpCrumbBtn' onClick={() => selectDoc('')}>
                                    &larr; All documents
                                </button>
                                {data.docEditUrl && (
                                    <>
                                        <span className='pdfpCrumbSep'>·</span>
                                        <a href={data.docEditUrl} {...newTab('Edit this document')}>
                                            Edit this document
                                        </a>
                                    </>
                                )}
                                {data.docOrigin?.id && (
                                    <>
                                        <span className='pdfpCrumbSep'>·</span>
                                        <span>
                                            Embedded on{' '}
                                            <a
                                                href={data.docOrigin.editUrl || data.docOrigin.viewUrl}
                                                {...newTab(data.docOrigin.title)}
                                            >
                                                {data.docOrigin.title}
                                            </a>
                                        </span>
                                    </>
                                )}
                            </p>
                        )}
                    </div>

                    <div className='pdfpAnalyticsControls'>
                        <DocPicker list={docList} value={doc} onChange={selectDoc} />
                        <div className='pdfpChips' role='group' aria-label='Date range'>
                            {RANGES.map((r) => (
                                <button
                                    key={r.days}
                                    type='button'
                                    className={`pdfpChip${days === r.days ? ' on' : ''}`}
                                    aria-pressed={days === r.days}
                                    onClick={() => setDays(r.days)}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                        <button type='button' className='pdfpGhostBtn' onClick={exportCsv} disabled={exporting || !docs.length}>
                            {exporting ? 'Preparing…' : 'Export CSV'}
                        </button>
                    </div>
                </div>

                {data?.tracking === false && (
                    <div className='pdfpNotice warn'>
                        Counting is switched off for this site, so nothing new is being recorded.{' '}
                        <a href={`${adminUrl}/edit.php?post_type=pdfposter&page=fpdf-settings`}>Turn it on in Settings › Analytics</a>
                    </div>
                )}

                {error && (
                    <div className='pdfpNotice warn'>
                        Could not load the numbers just now. Reload the page to try again.
                    </div>
                )}

                <div className='pdfpTiles'>
                    <div className='pdfpTile views'>
                        <span className='pdfpTileLabel'>Views</span>
                        <span className='pdfpTileValue'>{loading && !data ? '—' : fmt(totals.views)}</span>
                        <span className='pdfpTileFoot'>
                            <Delta value={delta(totals.views, previous.views)} />
                            <span className='pdfpTileNote'>{vsLabel}</span>
                        </span>
                    </div>

                    <div className='pdfpTile downloads'>
                        <span className='pdfpTileLabel'>Downloads</span>
                        <span className='pdfpTileValue'>{loading && !data ? '—' : fmt(totals.downloads)}</span>
                        <span className='pdfpTileFoot'>
                            <Delta value={delta(totals.downloads, previous.downloads)} />
                            <span className='pdfpTileNote'>{vsLabel}</span>
                        </span>
                    </div>

                    <div className='pdfpTile'>
                        <span className='pdfpTileLabel'>Download rate</span>
                        <span className='pdfpTileValue'>{loading && !data ? '—' : `${rate.toFixed(1)}%`}</span>
                        <span className='pdfpTileFoot'>
                            <Delta value={prevRate ? Math.round(((rate - prevRate) / prevRate) * 100) : null} />
                            <span className='pdfpTileNote'>downloads ÷ views</span>
                        </span>
                    </div>

                    {/* "Busiest day" answers nothing when the range IS one day, so the
                        slot carries the count of documents read instead -- the question
                        someone actually has when looking at today. */}
                    {days === 1 ? (
                        <div className='pdfpTile'>
                            <span className='pdfpTileLabel'>Documents counted today</span>
                            <span className='pdfpTileValue'>{loading && !data ? '—' : fmt(data?.docCount)}</span>
                            <span className='pdfpTileFoot'>
                                {/* Same label and denominator as the free tile: one tier
                                    must never name the same number differently. */}
                                <span className='pdfpTileNote'>
                                    {docTotal ? `of ${fmt(docTotal)} documents` : 'with a view or download'}
                                </span>
                            </span>
                        </div>
                    ) : (
                        <div className='pdfpTile'>
                            <span className='pdfpTileLabel'>Busiest day</span>
                            <span className='pdfpTileValue small'>
                                {loading && !data ? '—' : busiest && busiest.views > 0 ? prettyDate(busiest.day) : 'No views yet'}
                            </span>
                            <span className='pdfpTileFoot'>
                                <span className='pdfpTileNote'>
                                    {busiest && busiest.views > 0 ? `${fmt(busiest.views)} views that day` : 'in this range'}
                                </span>
                            </span>
                        </div>
                    )}
                </div>

                <div className='bPlDashboardCard pdfpPanel'>
                    <div className='pdfpPanelHead'>
                        <span className='pdfpPanelTitle'>Views and downloads</span>
                        <span className='pdfpLegend'>
                            <span>
                                <i style={{ background: '#146ef5' }} />
                                Views
                            </span>
                            <span>
                                <i style={{ background: '#cc6200' }} />
                                Downloads
                            </span>
                        </span>
                    </div>

                    {loading && !data ? (
                        <p className='pdfpEmpty'>Loading…</p>
                    ) : data?.series?.length ? (
                        <Chart series={data.series} />
                    ) : (
                        <p className='pdfpEmpty'>No data in this range yet.</p>
                    )}

                    {/* The range can reach back further than the data goes -- most visibly
                        right after an upgrade, when 30 days is selected by default and the
                        site has been counting for one week. Those leading days are zero
                        because nothing was measured, not because nobody read anything, and
                        without this line a good first week reads as a collapse. */}
                    {data?.firstDay && data?.range?.from && data.firstDay > data.range.from && (
                        <p className='pdfpChartNote'>
                            <svg viewBox='0 0 14 14' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true' focusable='false'>
                                <circle cx='7' cy='7' r='5.6' />
                                <path d='M7 6.2v4' strokeLinecap='round' />
                                <path d='M7 4.1v.1' strokeLinecap='round' strokeWidth='1.8' />
                            </svg>
                            <span>
                                <b>Counting started {prettyDate(data.firstDay)}.</b> Days before that are empty because
                                they were never measured — not because nobody read anything.
                            </span>
                        </p>
                    )}
                </div>

                {/* A one-row ranking of one document tells the reader nothing they cannot
                    already see in the tiles above. */}
                {!data?.doc && (
                <div className='bPlDashboardCard pdfpPanel'>
                    <div className='pdfpPanelHead'>
                        <span className='pdfpPanelTitle'>Top documents</span>
                        <span className='pdfpPanelMeta'>by views · {rangeLabel}</span>
                    </div>

                    <DocTable
                        rows={docs}
                        loading={loading}
                        emptyText={emptyFor('in this range', data?.excludeEditors)}
                    />
                </div>
                )}

                <CountingFootnote />
            </div>
        </div>
    );
};

export default Analytics;
