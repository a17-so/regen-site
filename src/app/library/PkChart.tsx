import type { PkChart as PkChartData, Ramp } from "../lib/library";

/**
 * Single-dose plasma-concentration curve.
 *
 * The same series the iOS breakdown plots (`LibraryChapterView.pkChartBlock`):
 * an area line in the compound's category ramp, an eyebrow above it, and the
 * half-life on a layered-glass plaque underneath. Points come from the catalog
 * (`pull.py`'s `pk_decay_chart`) and are already normalised to % of peak, so
 * nothing is computed or estimated here.
 *
 * Inline SVG with a viewBox rather than a chart library: one static series
 * needs no runtime, and a viewBox scales to the article column at any width.
 */
const W = 720;
const H = 260;
const PAD_L = 46;
const PAD_R = 20;
const PAD_T = 18;
const PAD_B = 34;

/** Ramp stops, matching --cat-* in globals.css. */
const RAMP: Record<Ramp, [string, string]> = {
  warm: ["#b03f4e", "#d1946f"],
  cool: ["#366a76", "#a8cdc8"],
  brown: ["#85694d", "#d2d5b2"],
  green: ["#4d854d", "#b2d5b4"],
  gold: ["#e0a400", "#f4e3a6"],
};

export function PkChart({ chart, ramp }: { chart: PkChartData; ramp: Ramp }) {
  const pts = chart.points;
  if (pts.length < 2) return null;

  const [dark, light] = RAMP[ramp];
  const id = `pk-${ramp}`;
  const max = Math.max(...pts.map((p) => p.value), 1);

  const x = (i: number) => PAD_L + (i / (pts.length - 1)) * (W - PAD_L - PAD_R);
  const y = (v: number) => PAD_T + (1 - v / max) * (H - PAD_T - PAD_B);

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(pts.length - 1).toFixed(1)} ${y(0).toFixed(1)} L${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;

  // Four gridlines is enough to read a decay curve against without the plot
  // turning into graph paper.
  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);

  return (
    <figure className="lib-pk">
      <figcaption className="lib-pk-eyebrow">Plasma concentration over time</figcaption>
      <div className="lib-pk-plot">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${chart.title}: concentration as a percentage of peak, falling from ${pts[0].label} to ${pts[pts.length - 1].label}.`}
       >
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dark} stopOpacity="0.26" />
              <stop offset="100%" stopColor={light} stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={dark} />
              <stop offset="100%" stopColor={light} />
            </linearGradient>
          </defs>

          {gridValues.map((v, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--stroke)"
                strokeWidth="1"
              />
              <text x={PAD_L - 10} y={y(v) + 4} textAnchor="end" className="lib-pk-tick">
                {Math.round(v)}
              </text>
            </g>
          ))}

          <path d={area} fill={`url(#${id}-fill)`} />
          <path
            d={line}
            fill="none"
            stroke={`url(#${id}-line)`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {pts.map((p, i) => (
            <circle key={i} cx={x(i)} cy={y(p.value)} r="3.5" fill={dark} />
          ))}
          {pts.map((p, i) => (
            <text key={i} x={x(i)} y={H - 10} textAnchor="middle" className="lib-pk-tick">
              {p.label}
            </text>
          ))}
        </svg>
      </div>
      <div className="lib-pk-foot">
        <span className="lib-pk-unit">{chart.unit}</span>
        {chart.halfLifeLabel && <span className="lib-pk-note">{chart.halfLifeLabel}</span>}
      </div>
    </figure>
  );
}
