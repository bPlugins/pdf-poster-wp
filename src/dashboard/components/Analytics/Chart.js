import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Daily views and downloads.
 *
 * Hand-authored SVG rather than a charting library: two series over at most 366 points
 * needs no runtime, and adding one would be the largest dependency in the plugin.
 *
 * Colours are the brand pair, with one derivation. #ff7a00 measures 2.61:1 on white --
 * under the 3:1 a 2px line needs to be legible -- so downloads use the same hue one step
 * darker, #cc6200, at 3.95:1. Blue against orange is also the most colour-blind-safe
 * pairing available (ΔE 31.8 protanopia), and both series carry a legend entry AND a
 * direct label on the last point, so identity never rests on colour alone.
 */
const VIEWS = '#146ef5';
const DOWNLOADS = '#cc6200';

const PAD = { top: 18, right: 58, bottom: 30, left: 48 };
const W = 900;
const H = 260;

const niceCeiling = (max) => {
    if (max <= 5) return 5;
    const mag = Math.pow(10, Math.floor(Math.log10(max)));
    const step = max / mag > 5 ? mag * 2 : max / mag > 2 ? mag : mag / 2;
    return Math.ceil(max / step) * step;
};

const Chart = ({ series }) => {
    const [hover, setHover] = useState(null);
    const svgRef = useRef();

    const model = useMemo(() => {
        const points = series || [];
        const n = points.length;
        const peak = points.reduce((m, p) => Math.max(m, p.views, p.downloads), 0);
        const top = niceCeiling(peak || 5);
        const iw = W - PAD.left - PAD.right;
        const ih = H - PAD.top - PAD.bottom;

        // A single day would otherwise divide by zero; draw it centred instead.
        const x = (i) => (n <= 1 ? PAD.left + iw / 2 : PAD.left + (iw * i) / (n - 1));
        const y = (v) => PAD.top + ih - (ih * v) / top;

        const line = (key) => points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
        const area = (key) => (n ? `${line(key)} L${x(n - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z` : '');

        const ticks = [0, top / 4, top / 2, (top * 3) / 4, top];

        // Roughly six labels, whatever the range length, landing on real indices.
        const every = Math.max(1, Math.round(n / 6));
        const xLabels = points.map((p, i) => ({ i, p })).filter(({ i }) => i % every === 0 || i === n - 1);

        return { points, n, top, iw, ih, x, y, line, area, ticks, xLabels };
    }, [series]);

    const { points, n, x, y, line, area, ticks, xLabels } = model;

    const fmt = (v) => Number(v || 0).toLocaleString();
    const shortDay = (day) => {
        const d = new Date(`${day}T00:00:00`);
        return isNaN(d) ? day : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    };
    const longDay = (day) => {
        const d = new Date(`${day}T00:00:00`);
        return isNaN(d) ? day : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const pick = (event) => {
        const box = svgRef.current?.getBoundingClientRect();
        if (!box || !n) return;
        const px = ((event.clientX - box.left) / box.width) * W;
        const i = n <= 1 ? 0 : Math.round(((px - PAD.left) / model.iw) * (n - 1));
        setHover(Math.max(0, Math.min(n - 1, i)));
    };

    // Switching the range replaces the series with a shorter one, and a hover index held
    // over from the longer one indexes past its end. Drop it whenever the length changes.
    useEffect(() => {
        setHover(null);
    }, [n]);

    if (!n) return null;

    // Belt as well as braces: the effect above runs after this render, so the very first
    // render following a range change still sees the stale index.
    const active = hover != null && hover >= 0 && hover < n ? points[hover] : null;

    // Flip the tooltip to the other side of the crosshair near the right edge.
    const tipLeft = active ? (x(hover) / W) * 100 : 0;
    const flip = tipLeft > 62;

    return (
        <div className='pdfpChartWrap'>
            <svg
                ref={svgRef}
                className='pdfpChart'
                viewBox={`0 0 ${W} ${H}`}
                role='img'
                aria-label={`Daily views and downloads from ${points[0].day} to ${points[n - 1].day}.`}
                onPointerMove={pick}
                onPointerDown={pick}
                onPointerLeave={() => setHover(null)}
            >
                {ticks.map((t) => (
                    <g key={t}>
                        <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? '#cbd5e1' : '#e2e8f0'} strokeWidth='1' />
                        <text x={PAD.left - 10} y={y(t) + 4} textAnchor='end' className='pdfpChartAxis'>
                            {fmt(Math.round(t))}
                        </text>
                    </g>
                ))}

                {xLabels.map(({ i, p }) => (
                    <text key={p.day} x={x(i)} y={H - 10} textAnchor='middle' className='pdfpChartAxis'>
                        {shortDay(p.day)}
                    </text>
                ))}

                <path d={area('views')} fill='rgba(20,110,245,.13)' />
                <path d={area('downloads')} fill='rgba(204,98,0,.13)' />
                <path d={line('views')} fill='none' stroke={VIEWS} strokeWidth='2' strokeLinejoin='round' strokeLinecap='round' />
                <path d={line('downloads')} fill='none' stroke={DOWNLOADS} strokeWidth='2' strokeLinejoin='round' strokeLinecap='round' />

                {/* Emphasised endpoint plus a direct label, so the two series stay
                    distinguishable without reading the legend. */}
                {[['views', VIEWS], ['downloads', DOWNLOADS]].map(([key, colour]) => (
                    <g key={key}>
                        <circle cx={x(n - 1)} cy={y(points[n - 1][key])} r='4.5' fill={colour} stroke='#fff' strokeWidth='2' />
                        <text x={x(n - 1) + 10} y={y(points[n - 1][key]) + 4} className='pdfpChartEnd'>
                            {fmt(points[n - 1][key])}
                        </text>
                    </g>
                ))}

                {active && (
                    <g>
                        <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + model.ih} stroke='#070127' strokeWidth='1' opacity='.22' />
                        <circle cx={x(hover)} cy={y(active.views)} r='5' fill={VIEWS} stroke='#fff' strokeWidth='2' />
                        <circle cx={x(hover)} cy={y(active.downloads)} r='5' fill={DOWNLOADS} stroke='#fff' strokeWidth='2' />
                    </g>
                )}
            </svg>

            {active && (
                <div className={`pdfpChartTip${flip ? ' flip' : ''}`} style={{ left: `${tipLeft}%` }}>
                    <span className='d'>{longDay(active.day)}</span>
                    <span className='r'>
                        <em>
                            <i style={{ background: VIEWS }} />
                            Views
                        </em>
                        <b>{fmt(active.views)}</b>
                    </span>
                    <span className='r'>
                        <em>
                            <i style={{ background: DOWNLOADS }} />
                            Downloads
                        </em>
                        <b>{fmt(active.downloads)}</b>
                    </span>
                </div>
            )}
        </div>
    );
};

export default Chart;
