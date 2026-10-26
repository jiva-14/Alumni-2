import { useId, useState } from 'react';

/**
 * Dependency-free interactive SVG charts. They size to their container (viewBox) and take plain data.
 * Colors come from the design palette; hover/focus highlights an element and shows a tooltip.
 */
export const PALETTE = ['#6366F1', '#14B8A6', '#FB7185', '#FBBF24', '#38BDF8', '#8B5CF6'];

function Tip({ tip }) {
  if (!tip) return null;
  return (
    <div className="ctip" style={{ left: `${tip.x}%`, top: `${tip.y}%` }} role="status">
      <strong>{tip.title}</strong><span>{tip.text}</span>
    </div>
  );
}

const niceMax = (v) => {
  if (v <= 5) return 5;
  const step = 10 ** Math.floor(Math.log10(v)) / 2;
  return Math.ceil(v / step) * step;
};

/** Gradient area/line chart. data: [{ label, value }] */
export function AreaChart({ data, color = '#6366F1', unit = '', ariaLabel }) {
  const gid = useId().replace(/:/g, '');
  const [hi, setHi] = useState(null);
  const W = 560, H = 240, P = { l: 38, r: 16, t: 16, b: 30 };
  if (!data.length) return null;
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const x = (i) => P.l + (data.length === 1 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (data.length - 1));
  const y = (v) => P.t + (1 - v / max) * (H - P.t - P.b);
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.value)}`).join(' ');
  const area = `${line} L${x(data.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`;
  const tip = hi == null ? null : { x: (x(hi) / W) * 100, y: (y(data[hi].value) / H) * 100 - 4, title: data[hi].label, text: `${data[hi].value.toLocaleString()}${unit}` };
  return (
    <div className="chartbox">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel || data.map((d) => `${d.label}: ${d.value}`).join(', ')}>
        <defs>
          <linearGradient id={`a${gid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".38" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient>
          <linearGradient id={`l${gid}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={color} /><stop offset="1" stopColor="#8B5CF6" /></linearGradient>
        </defs>
        {[0, .25, .5, .75, 1].map((t) => (
          <g key={t}><line x1={P.l} x2={W - P.r} y1={y(max * t)} y2={y(max * t)} className="chart__grid" /><text x={P.l - 8} y={y(max * t) + 4} textAnchor="end">{Math.round(max * t)}</text></g>
        ))}
        <path d={area} fill={`url(#a${gid})`} className="chart__area" />
        <path d={line} fill="none" stroke={`url(#l${gid})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="chart__line" />
        {hi != null && <line x1={x(hi)} x2={x(hi)} y1={P.t} y2={H - P.b} className="chart__cursor" />}
        {data.map((d, i) => (
          <g key={d.label}>
            <text x={x(i)} y={H - 9} textAnchor="middle">{d.label}</text>
            <circle cx={x(i)} cy={y(d.value)} r={hi === i ? 7 : 4.5} fill="#fff" stroke={color} strokeWidth="2.5" className="chart__dot" />
            <rect x={x(i) - (W - P.l - P.r) / data.length / 2} y={P.t} width={(W - P.l - P.r) / data.length} height={H - P.t - P.b}
              fill="transparent" tabIndex={0} aria-label={`${d.label}: ${d.value}${unit}`}
              onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} onFocus={() => setHi(i)} onBlur={() => setHi(null)} />
          </g>
        ))}
      </svg>
      <Tip tip={tip} />
    </div>
  );
}

/** Multicolor bar chart. data: [{ label, value, color? }] */
export function BarChart({ data, unit = '', ariaLabel }) {
  const [hi, setHi] = useState(null);
  const W = 560, H = 240, P = { l: 38, r: 12, t: 16, b: 46 };
  if (!data.length) return null;
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const slot = (W - P.l - P.r) / data.length;
  const bw = Math.min(46, slot * 0.62);
  const y = (v) => P.t + (1 - v / max) * (H - P.t - P.b);
  const short = (s) => (s.length > 11 ? `${s.slice(0, 10)}…` : s);
  const tip = hi == null ? null : { x: ((P.l + slot * hi + slot / 2) / W) * 100, y: (y(data[hi].value) / H) * 100 - 4, title: data[hi].label, text: `${data[hi].value.toLocaleString()}${unit}` };
  return (
    <div className="chartbox">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel || data.map((d) => `${d.label}: ${d.value}`).join(', ')}>
        {[0, .5, 1].map((t) => (
          <g key={t}><line x1={P.l} x2={W - P.r} y1={y(max * t)} y2={y(max * t)} className="chart__grid" /><text x={P.l - 8} y={y(max * t) + 4} textAnchor="end">{Math.round(max * t)}</text></g>
        ))}
        {data.map((d, i) => {
          const c = d.color || PALETTE[i % PALETTE.length];
          const cx = P.l + slot * i + slot / 2;
          return (
            <g key={d.label} className={`chart__bar${hi === i ? ' is-hi' : ''}${hi != null && hi !== i ? ' is-dim' : ''}`}>
              <rect x={cx - bw / 2} y={y(d.value)} width={bw} height={Math.max(H - P.b - y(d.value), 2)} rx="7" fill={c} style={{ animationDelay: `${i * 60}ms` }} />
              <text x={cx} y={H - P.b + 16} textAnchor="middle">{short(d.label)}</text>
              <rect x={cx - slot / 2} y={P.t} width={slot} height={H - P.t - P.b + 24} fill="transparent" tabIndex={0}
                aria-label={`${d.label}: ${d.value}${unit}`}
                onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} onFocus={() => setHi(i)} onBlur={() => setHi(null)} />
            </g>
          );
        })}
      </svg>
      <Tip tip={tip} />
    </div>
  );
}

/** Donut chart with legend. data: [{ label, value, color? }] */
export function DonutChart({ data, centerLabel = 'Total' }) {
  const [hi, setHi] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const R = 70, r = 46, C = 90;
  let a0 = -Math.PI / 2;
  const arcs = data.map((d, i) => {
    const a1 = a0 + (d.value / total) * Math.PI * 2 - (data.length > 1 ? 0.02 : 0);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (rad, a) => `${C + rad * Math.cos(a)},${C + rad * Math.sin(a)}`;
    const path = data.length === 1
      ? `M${C},${C - R} A${R},${R} 0 1 1 ${C - 0.01},${C - R} L${C - 0.01},${C - r} A${r},${r} 0 1 0 ${C},${C - r} Z`
      : `M${p(R, a0)} A${R},${R} 0 ${large} 1 ${p(R, a1)} L${p(r, a1)} A${r},${r} 0 ${large} 0 ${p(r, a0)} Z`;
    a0 += (d.value / total) * Math.PI * 2;
    return { ...d, path, color: d.color || PALETTE[i % PALETTE.length] };
  });
  const sel = hi == null ? null : arcs[hi];
  return (
    <div className="donut">
      <div className="donut__svg">
        <svg viewBox="0 0 180 180" role="img" aria-label={data.map((d) => `${d.label}: ${d.value}`).join(', ')}>
          {arcs.map((a, i) => (
            <path key={a.label} d={a.path} fill={a.color} tabIndex={0} aria-label={`${a.label}: ${a.value} (${Math.round((a.value / total) * 100)}%)`}
              className={`donut__arc${hi === i ? ' is-hi' : ''}${hi != null && hi !== i ? ' is-dim' : ''}`}
              onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} onFocus={() => setHi(i)} onBlur={() => setHi(null)} />
          ))}
          <text x={C} y={C - 2} textAnchor="middle" className="donut__big">{sel ? sel.value : total}</text>
          <text x={C} y={C + 15} textAnchor="middle" className="donut__small">{sel ? `${Math.round((sel.value / total) * 100)}%` : centerLabel}</text>
        </svg>
      </div>
      <ul className="donut__legend">
        {arcs.map((a, i) => (
          <li key={a.label} className={hi === i ? 'is-hi' : ''} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}>
            <i style={{ background: a.color }} /><span>{a.label}</span><strong>{a.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
