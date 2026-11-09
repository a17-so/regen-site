"use client";

import type { CategorySlug } from "../lib/guideVocab";

/**
 * The library's body figure. A mannequin silhouette, built from one set of
 * shapes used as a mask: a soft vertical shade and a fine dot texture are
 * painted through it, so the figure reads as one lit form with no internal
 * seams. Each body system has a hotspot; the active one pulses and carries
 * its label, the way the reference's figure does.
 *
 * Left-side limbs are drawn once and mirrored for the right.
 */
const HEAD = { cx: 120, cy: 50, rx: 23, ry: 29 };
const NECK = "M109 72 C109 84 108 92 106 100 L134 100 C132 92 131 84 131 72 Z";
const TORSO =
  "M80 104 C90 98 105 96 120 96 C135 96 150 98 160 104 C170 111 173 126 172 146 C170 170 165 192 164 214 C163 236 166 258 168 278 C169 294 163 304 152 306 L88 306 C77 304 71 294 72 278 C74 258 77 236 76 214 C75 192 70 170 68 146 C67 126 70 111 80 104 Z";
const ARM =
  "M80 106 C67 109 61 121 59 138 C56 164 54 190 52 214 C50 238 48 258 46 276 C45 288 43 298 44 305 C45 312 52 314 54 306 C57 295 59 283 62 268 C66 248 69 226 72 204 C74 186 76 168 78 150 Z";
const LEG =
  "M86 296 C84 326 85 358 89 390 C92 416 93 442 93 468 C93 490 91 510 91 528 C91 539 98 543 106 542 C112 541 114 535 113 527 C112 509 112 489 114 469 C116 443 118 419 119 391 C120 359 120 327 120 300 Z";

export const SPOTS: Record<CategorySlug, { x: number; y: number; side: "left" | "right" }> = {
  brain: { x: 120, y: 42, side: "right" },
  hormones: { x: 120, y: 88, side: "right" },
  heart: { x: 134, y: 140, side: "right" },
  immune: { x: 100, y: 162, side: "left" },
  digestive: { x: 120, y: 212, side: "right" },
  skin: { x: 52, y: 236, side: "left" },
  sexual: { x: 120, y: 290, side: "right" },
  bones: { x: 102, y: 420, side: "left" },
};

export default function BodyFigure({
  active,
  labels,
  onPick,
}: {
  active?: CategorySlug;
  labels: Record<CategorySlug, string>;
  onPick?: (slug: CategorySlug) => void;
}) {
  const shapes = (
    <>
      <ellipse {...HEAD} />
      <path d={NECK} />
      <path d={TORSO} />
      <path d={ARM} />
      <path d={LEG} />
      <g transform="translate(240 0) scale(-1 1)">
        <path d={ARM} />
        <path d={LEG} />
      </g>
    </>
  );
  const activeSpot = active ? SPOTS[active] : null;
  const label = active ? labels[active] : "";
  const labelW = label.length * 6.6 + 26;

  return (
    <svg className="bf" viewBox="0 0 240 570" role="img" aria-label="Body systems">
      <defs>
        <mask id="bf-mask">
          <g fill="#fff">{shapes}</g>
        </mask>
        <linearGradient id="bf-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e6e6ea" />
          <stop offset="0.38" stopColor="#f8f8f9" />
          <stop offset="0.62" stopColor="#f6f6f7" />
          <stop offset="1" stopColor="#e2e2e7" />
        </linearGradient>
        <linearGradient id="bf-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.72" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.9" />
        </linearGradient>
        <pattern id="bf-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" />
          <circle cx="6.5" cy="6.5" r="0.6" />
        </pattern>
        <radialGradient id="bf-floor">
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="548" rx="64" ry="8" fill="url(#bf-floor)" />
      <g mask="url(#bf-mask)">
        <rect width="240" height="570" fill="url(#bf-shade)" />
        <rect width="240" height="570" className="bf-dots" fill="url(#bf-dots)" />
        <rect width="240" height="570" fill="url(#bf-fade)" />
      </g>

      {(Object.keys(SPOTS) as CategorySlug[]).map((slug) => {
        const s = SPOTS[slug];
        const on = slug === active;
        return (
          <g
            key={slug}
            className={`bf-spot${on ? " is-on" : ""}`}
            transform={`translate(${s.x} ${s.y})`}
            onClick={() => onPick?.(slug)}
            role="button"
            tabIndex={0}
            aria-label={labels[slug]}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick?.(slug)}
          >
            <circle className="bf-ring" r="9" />
            <circle className="bf-halo" r="6" />
            <circle className="bf-dot" r="3.2" />
          </g>
        );
      })}

      {activeSpot && (
        <g
          className="bf-label"
          transform={`translate(${activeSpot.side === "right" ? activeSpot.x + 14 : activeSpot.x - 14 - labelW} ${activeSpot.y - 11})`}
        >
          <rect width={labelW} height="22" rx="11" />
          <text x={labelW / 2} y="15" textAnchor="middle">
            {label}
          </text>
        </g>
      )}
    </svg>
  );
}
