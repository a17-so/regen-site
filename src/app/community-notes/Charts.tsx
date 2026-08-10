"use client";

import { useState } from "react";

/**
 * Chart primitives for the community database.
 *
 * ── Palette ────────────────────────────────────────────────────────────────
 * Green for positives, the design system's warm gradient (--grad-warm) for
 * side effects, a directed choice, semantics over separation. The validator
 * scores warm↔green at ΔE 2.5 under deuteranopia, so colour is NEVER what
 * identifies a series here: each chart is single-series, the panel heading
 * names it, and every bar carries its text label plus an always-on value.
 * That relief is load-bearing, don't remove the labels or put warm and
 * green series inside one chart.
 */
export type Tone = "accent" | "green" | "warm" | "cool";

const TONE: Record<Tone, { solid: string; grad: string }> = {
  accent: { solid: "#1135EF", grad: "linear-gradient(90deg, #1135EF, #7288FF)" },
  green: { solid: "#4D854D", grad: "linear-gradient(90deg, #4D854D, #77B17C, #B2D5B4)" },
  warm: { solid: "#B03F4E", grad: "linear-gradient(90deg, #B03F4E, #C86C3F, #D1946F)" },
  cool: { solid: "#366A76", grad: "linear-gradient(90deg, #366A76, #83AAAF, #A8CDC8)" },
};

export interface BarDatum {
  label: string;
  count: number;
  /** Optional secondary line shown in the tooltip. */
  note?: string;
}

export function HBars({
  data,
  tone = "accent",
  max,
  unit = "reports",
}: {
  data: BarDatum[];
  tone?: Tone;
  max?: number;
  unit?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const peak = max ?? Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="chart">
      {data.map((d, i) => {
        const pct = (d.count / peak) * 100;
        return (
          <div
            className={`chart-row${hover === i ? " is-hover" : ""}`}
            key={d.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="chart-label" title={d.label}>
              {d.label}
            </span>
            <div className="chart-track">
              <div
                className="chart-bar"
                style={{ width: `${Math.max(pct, 1.5)}%`, background: TONE[tone].grad }}
              />
              {hover === i && (
                <div className="chart-tip" role="status">
                  <strong>{d.count}</strong> {unit}
                  {d.note && <span>{d.note}</span>}
                </div>
              )}
            </div>
            {/* Always-on value, the relief the contrast warning requires. */}
            <span className="chart-value">{d.count}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Cumulative reports over time. An area, because the quantity is a running
 * total, it can only go up, and the filled region is the point.
 */
export function AreaTrend({
  points,
}: {
  points: { month: string; total: number; added: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  // While hidden the cursor parks on the latest point, so the group is
  // always mounted and its position can transition instead of teleporting.
  const cur = hover ?? points.length - 1;

  const W = 720;
  const H = 190;
  // Axis labels sit on the RIGHT, so the padding is mirrored, the series
  // starts hard against the left edge instead of behind a gutter of numbers.
  const PAD = { l: 4, r: 44, t: 14, b: 26 };
  const peak = Math.max(1, ...points.map((p) => p.total));
  const step = (W - PAD.l - PAD.r) / Math.max(1, points.length - 1);

  const x = (i: number) => PAD.l + i * step;
  const y = (v: number) => PAD.t + (1 - v / peak) * (H - PAD.t - PAD.b);

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.total)}`).join(" ");
  const area = `${line} L ${x(points.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  const ticks = [0, 0.5, 1].map((f) => Math.round(peak * f));

  return (
    <div className="chart-area-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="chart-area"
        role="img"
        aria-label={`Cumulative reports, ${points[0]?.month} to ${points[points.length - 1]?.month}`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="cn-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1135EF" stopOpacity="0.26" />
            <stop offset="1" stopColor="#7288FF" stopOpacity="0.02" />
          </linearGradient>
          {/* The series line wears the accent gradient like every other
              data-bar — horizontal, the 90deg family. */}
          <linearGradient id="cn-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1135EF" />
            <stop offset="1" stopColor="#7288FF" />
          </linearGradient>
          {/* StatusOrb, core gradient + the halo's 4pt blur. */}
          <linearGradient id="cn-orb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1135EF" />
            <stop offset="1" stopColor="#7289FF" />
          </linearGradient>
          <filter id="cn-orb-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Recessive grid, present enough to read a value against, quiet
            enough that it never competes with the series. */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#EEEEEE" strokeWidth="1" />
            <text x={W - PAD.r + 9} y={y(t) + 4} className="chart-axis" textAnchor="start">
              {t}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#cn-area)" />
        <path d={line} fill="none" stroke="url(#cn-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={p.month}>
            <text x={x(i)} y={H - 6} className="chart-axis" textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}>
              {p.month}
            </text>
            {/* Hit target far wider than the mark. */}
            <rect
              x={x(i) - step / 2}
              y={0}
              width={step}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          </g>
        ))}

        {/* Cursor group, always mounted so the marker GLIDES between
            months instead of teleporting; opacity gates visibility. */}
        <g className="chart-cursor" style={{ opacity: hover === null ? 0 : 1 }}>
          <line
            className="chart-cursor-move"
            x1={x(cur)} x2={x(cur)} y1={PAD.t} y2={H - PAD.b}
            stroke="#1135EF" strokeWidth="1" strokeDasharray="3 3" opacity="0.35"
          />
          {/* halo, 12pt, 30% fill + stroke, 4pt blur */}
          <circle
            className="chart-cursor-move"
            cx={x(cur)} cy={y(points[cur].total)} r="6"
            fill="url(#cn-orb)" fillOpacity="0.3"
            stroke="#1135EF" strokeOpacity="0.3" strokeWidth="1"
            filter="url(#cn-orb-blur)"
          />
          {/* core, 6pt accent gradient */}
          <circle
            className="chart-cursor-move"
            cx={x(cur)} cy={y(points[cur].total)} r="3" fill="url(#cn-orb)"
          />
        </g>
      </svg>

      {/* Glass tooltip riding the hovered point, gliding with it. */}
      <div
        className={`chart-area-tip${hover === null ? "" : " on"}`}
        role="status"
        style={{
          left: `${(x(cur) / W) * 100}%`,
          top: `${(y(points[cur].total) / H) * 100}%`,
        }}
      >
        <strong>{points[cur].total}</strong> total ·{" "}
        <span>+{points[cur].added} in {points[cur].month}</span>
      </div>
    </div>
  );
}

/** Three-up stat tiles. No plot, so no hover layer. */
export function StatTiles({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <div className="stat-tiles">
      {items.map((s) => (
        <div className="stat-tile" key={s.label}>
          <div className="stat-tile-v">{s.value}</div>
          <div className="stat-tile-l">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
