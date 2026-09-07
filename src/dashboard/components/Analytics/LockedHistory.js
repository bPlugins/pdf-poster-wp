import { forwardRef, useMemo } from 'react';

/**
 * The locked history panel on the free Analytics screen.
 *
 * The free tier already shows TODAY for real, so what is withheld here is not a feature
 * -- it is the site's own past, which pdfp_should_count() has been writing all along.
 * That is the whole pitch, and it is why this panel states a counted number the site
 * owns ("your last 47 days are already recorded") instead of listing what Pro can do.
 *
 * Three rules the markup keeps, in order of how easily they could be lost:
 *
 * 1. NO FIGURE FOR A PAST DAY IS EVER DRAWN. Where a value would sit there is a
 *    skeleton block, never a blurred numeral -- so a browser that drops `filter`, or a
 *    reader who disables it, degrades the screen to "withheld", never to "here is a
 *    made-up number". The blur is the finish; the skeleton is the mechanism.
 * 2. Everything the free build genuinely knows stays SHARP: the panel title, the legend,
 *    the date axis (the browser's own calendar), and the counted days. Only the plotted
 *    shape is frosted, and it is labelled an example.
 * 3. One call to action. The old text-only upgrade card is gone rather than sitting
 *    below this one -- two pitches on one screen is the upsell fatigue that is the most
 *    cited complaint against the biggest plugin in this category.
 *
 * Geometry is Chart.js's, to the pixel, because this panel IS that panel with the glass
 * down: same viewBox, same padding, same gridlines. When the licence activates the
 * reader is looking at a layout they have already learned.
 */

/* Chart.js's own frame. Kept in sync by being the same numbers, not by importing --
   Chart takes a series this panel does not have. */
const W = 900;
const H = 260;
const PAD = { top: 18, right: 58, bottom: 30, left: 48 };
const RANGE = 30;

const fmt = (v) => Number(v || 0).toLocaleString();

const prettyDate = (day) => {
    const d = new Date(`${day}T00:00:00`);
    return isNaN(d) ? day : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const Padlock = ({ className = 'pdfpLockGlyph' }) => (
    <svg className={className} viewBox='0 0 9 11' aria-hidden='true' focusable='false'>
        <path d='M2 4.5V3.2a2.5 2.5 0 0 1 5 0v1.3' fill='none' stroke='currentColor' strokeWidth='1.2' />
        <rect x='1' y='4.5' width='7' height='5.5' fill='currentColor' />
    </svg>
);

/**
 * What Pro adds, as chips rather than a bulleted wall.
 *
 * Short labels on purpose: the card's argument is the counted number above them, and a
 * six-line list underneath competes with it for the same glance.
 */
const FEATURES = [
    '7, 30 and 90-day chart',
    'Totals vs the previous period',
    'Top documents, ranked',
    'Download rate & busiest day',
    'Sortable columns on your posters list',
    'CSV export',
];

/**
 * The frosted plot.
 *
 * The x axis is real -- the last thirty days off the reader's own clock -- and the
 * gridlines are the real chart's. The band between them is an example shape, blurred and
 * labelled, because a free site is sent no daily figures to draw. Marked
 * `role="presentation"` so it is not announced as a chart carrying data.
 */
const Silhouette = () => {
    const model = useMemo(() => {
        const iw = W - PAD.left - PAD.right;
        const ih = H - PAD.top - PAD.bottom;
        const x = (i) => PAD.left + (iw * i) / (RANGE - 1);
        const y = (t) => PAD.top + ih - ih * t;

        // A weekday rhythm under a broad mid-period lift: enough movement to read as a
        // chart, smooth enough that nobody could mistake it for a measurement.
        const at = (i) => {
            const wave = 0.5 + 0.28 * Math.sin((i / (RANGE - 1)) * Math.PI * 1.4);
            const week = 0.08 * Math.sin((i / 7) * Math.PI * 2);
            return Math.max(0.08, Math.min(0.92, wave + week));
        };

        const upper = [];
        const lower = [];

        for (let i = 0; i < RANGE; i++) {
            upper.push(`${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(at(i)).toFixed(1)}`);
            lower.push(`${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(at(i) * 0.27).toFixed(1)}`);
        }

        // Only the upper band is filled. Two translucent areas over one another read
        // as mud rather than as two series, which is why Chart.js's downloads fill is
        // the paler of the pair and why this one has none at all.
        const base = `L${x(RANGE - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

        // Six ticks over the range, ending on today, from the browser's own calendar.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ticks = [];
        const step = Math.round((RANGE - 1) / 5);

        for (let i = 0; i < RANGE; i += step) {
            const d = new Date(today.getTime() - (RANGE - 1 - i) * 86400000);
            ticks.push({ i, label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) });
        }

        return {
            x,
            y,
            upperLine: upper.join(' '),
            upperArea: `${upper.join(' ')} ${base}`,
            lowerLine: lower.join(' '),
            ticks,
            rows: [0, 0.25, 0.5, 0.75, 1],
        };
    }, []);

    return (
        <svg className='pdfpChart pdfpSilhouette' viewBox={`0 0 ${W} ${H}`} role='presentation'>
            {model.rows.map((t) => (
                <line
                    key={t}
                    className='pdfpChartGrid'
                    x1={PAD.left}
                    x2={W - PAD.right}
                    y1={model.y(t)}
                    y2={model.y(t)}
                />
            ))}

            {/* Where the y axis labels belong. Blocks, not numbers -- see rule 1. */}
            {model.rows.map((t) => (
                <rect key={`s${t}`} className='pdfpSkelMark' x={PAD.left - 34} y={model.y(t) - 5} width='24' height='9' />
            ))}

            <g className='pdfpSilhouetteInk'>
                <path d={model.upperArea} fill='#146ef5' fillOpacity='0.16' />
                <path d={model.upperLine} fill='none' stroke='#146ef5' strokeWidth='2' strokeLinejoin='round' />
                <path d={model.lowerLine} fill='none' stroke='#cc6200' strokeWidth='2' strokeLinejoin='round' />
            </g>

            {model.ticks.map((t) => (
                <text key={t.i} className='pdfpChartAxis' x={model.x(t.i)} y={H - 10} textAnchor='middle'>
                    {t.label}
                </text>
            ))}
        </svg>
    );
};

const LockedHistory = forwardRef(({ history, tracking, pricingUrl, pulsing }, ref) => {
    const days = Math.max(0, Number(history?.days || 0));
    const rows = Math.max(0, Number(history?.rows || 0));
    const firstDay = history?.firstDay || '';

    // Singular, plural, and the site whose first day is today all read differently, and
    // "your last 1 days" is the kind of string that makes a product look unfinished.
    const headline =
        days > 1
            ? `Your last ${fmt(days)} days are already recorded.`
            : days === 1
            ? 'Yesterday is already recorded.'
            : 'Your history starts building today.';

    const body =
        days > 0
            ? `PDF Poster started counting on ${prettyDate(firstDay)}${
                  rows > 0 ? ` and has kept ${fmt(rows)} daily records since` : ''
              }. Today's figures are above; Pro reads back everything before midnight — and there is nothing to import, because it is already in your own database.`
            : "Nothing before today has been recorded yet — the history builds from the day counting starts. Today's figures are above; Pro reads back every day after this one, straight from your own database.";

    // Counting being switched off is already stated at the top of the screen, so this
    // is a clause on the sentence above rather than a second notice saying it again --
    // it is only here because "started counting on X" would otherwise imply it never
    // stopped. What is already recorded stays readable with a licence either way.
    const stopped = tracking === false && days > 0
        ? ' Counting is switched off at the moment, so no new days are being added.'
        : '';

    return (
        <div className={`pdfpStage${pulsing ? ' isPulsing' : ''}`} ref={ref}>
            {/* aria-hidden, not just visually frosted: there is nothing here for a
                screen reader to read, and the lock card below carries the whole
                message in text. */}
            <div className='pdfpStageVeil' aria-hidden='true'>
                <div className='bPlDashboardCard pdfpPanel'>
                    <div className='pdfpPanelHead'>
                        <span className='pdfpPanelTitle'>Views and downloads</span>
                        <span className='pdfpLegend'>
                            <span className='pdfpExampleTag'>Example shape</span>
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

                    <div className='pdfpChartWrap'>
                        <Silhouette />
                    </div>
                </div>
            </div>

            <div className='pdfpGlass'>
                <div className='pdfpLockCard'>
                    <p className='pdfpLockEyebrow'>
                        <Padlock />
                        {days > 0 ? 'Already recorded · not yet readable' : 'Recording now'}
                    </p>

                    <h3>{headline}</h3>
                    <p className='pdfpLockBody'>
                        {body}
                        {stopped}
                    </p>

                    <ul className='pdfpLockFeats'>
                        {FEATURES.map((f) => (
                            <li key={f}>{f}</li>
                        ))}
                    </ul>

                    <p className='pdfpLockCta'>
                        <a className='bPlButton' href={pricingUrl}>
                            {days > 0 ? `Unlock my ${fmt(days)} days — see Pro pricing` : 'See Pro pricing'}
                        </a>
                    </p>

                    <p className='pdfpLockMicro'>
                        Layout example. No view or download figure for a past day is sent to a free site, so nothing
                        behind this panel is a made-up number.
                    </p>
                </div>
            </div>
        </div>
    );
});

export default LockedHistory;
