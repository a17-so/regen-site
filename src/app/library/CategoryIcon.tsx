import type { CSSProperties } from "react";
import type { IconKey } from "../lib/library";

/**
 * The library's category marks.
 *
 * One glyph per SF Symbol the app's catalog names in `sectionIcon`, so a
 * compound wears the same mark on the web as it does in the iOS Library tab
 * (`bandage.fill`, `flame.fill`, `figure.strengthtraining.traditional`,
 * `infinity`, `sparkles`, `brain.head.profile`, `heart.fill`, `leaf.fill`).
 *
 * Drawn on a 24-box, stroked with `currentColor` so a chip can tint the whole
 * mark by setting one colour. Never the only signal: every place these render,
 * the category label renders beside them.
 */
const PATHS: Record<IconKey, React.ReactNode> = {
  /* The app's marks are the FILLED cuts (`flame.fill`, `heart.fill`,
     `leaf.fill`, `bandage.fill`, `sparkles`), so the closed silhouettes here
     paint solid with the gradient via `--icon-paint`; only the marks whose SF
     Symbol is genuinely line art (the strength figure, `infinity`,
     `brain.head.profile`) stay stroked. */
  flame: (
    <g style={{ fill: "var(--icon-paint, currentColor)" }} stroke="none">
      {/* The flame is the narrowest silhouette in the set (10 of 24 units
          wide), and filled it read undersized beside the label — the stroke
          used to pad its ink. Scaled about the box centre to the other
          marks' optical weight, then lifted 1.9 units: the glyph's mass is
          its round BASE, so box-centring hung it below the baseline. The
          lift seats the base on the dumbbell's band and lets the thin tip
          ride into ascender space, the way SF's flame.fill sits. */}
      <g transform="translate(12 10.1) scale(1.22) translate(-12 -12)">
        <path d="M12 3c.6 2.5-.5 4-1.8 5.2C8.6 9.6 7 11 7 13.6A5 5 0 0 0 12 19a5 5 0 0 0 5-5.4c0-2-1-3.6-2.2-5-.4 1-1 1.6-1.8 2 .4-2.7-.3-5.5-1-7.6Z" />
      </g>
    </g>
  ),
  bandage: (
    /* Filled capsule, dividers and pad dots knocked out — `bandage.fill`. */
    <g transform="rotate(-40 12 12)">
      <g style={{ fill: "var(--icon-paint, currentColor)" }} stroke="none">
        <rect x="2.6" y="8.4" width="18.8" height="7.2" rx="3.6" />
      </g>
      <path d="M8.9 8.4v7.2M15.1 8.4v7.2" stroke="#fff" strokeWidth="1.1" />
      <g fill="#fff" stroke="none">
        <circle cx="10.7" cy="10.6" r="0.72" />
        <circle cx="13.3" cy="10.6" r="0.72" />
        <circle cx="10.7" cy="13.4" r="0.72" />
        <circle cx="13.3" cy="13.4" r="0.72" />
      </g>
    </g>
  ),
  leaf: (
    <>
      <g style={{ fill: "var(--icon-paint, currentColor)" }} stroke="none">
        <path d="M20 4c0 8-4.6 12-9 12a5 5 0 0 1-5-5C6 6.6 12 4 20 4Z" />
      </g>
      <path d="M4 20c2.8-3.4 6-6 10.5-8.2" />
    </>
  ),
  dumbbell: (
    <>
      {/* Plates as filled blocks, not hairlines: at 17px a four-stroke
          dumbbell collapses into an unreadable row of ticks. */}
      <g style={{ fill: "var(--icon-paint, currentColor)" }} stroke="none">
        <rect x="2" y="9.2" width="3" height="5.6" rx="1.1" />
        <rect x="5.6" y="6.8" width="3.4" height="10.4" rx="1.4" />
        <rect x="15" y="6.8" width="3.4" height="10.4" rx="1.4" />
        <rect x="19" y="9.2" width="3" height="5.6" rx="1.1" />
      </g>
      <path d="M9.2 12h5.6" strokeWidth="2" />
    </>
  ),
  infinity: (
    <path d="M9.2 12c0 1.9-1.4 3.4-3.1 3.4S3 13.9 3 12s1.4-3.4 3.1-3.4c2.6 0 4.1 3.4 5.9 3.4s3.3-3.4 5.9-3.4c1.7 0 3.1 1.5 3.1 3.4s-1.4 3.4-3.1 3.4-3.2-1.5-3.2-3.4" />
  ),
  sparkles: (
    <g style={{ fill: "var(--icon-paint, currentColor)" }} stroke="none">
      <path d="M12 3.5 13.4 8 18 9.4 13.4 10.8 12 15.4 10.6 10.8 6 9.4 10.6 8Z" />
      <path d="M18.2 15.2l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7Z" />
    </g>
  ),
  brain: (
    <>
      {/* One outline plus the interior fold, the way SF's brain.head.profile
          reads: two lobes side by side turn to a blob at chip size. */}
      <path d="M15.5 20.5v-3.1c2.9-.6 5-3 5-5.9 0-3.4-2.9-6.1-6.5-6.1-1 0-1.9.2-2.7.6A4.4 4.4 0 0 0 8 4.5C5.5 4.5 3.5 6.4 3.5 8.7c0 1 .4 2 1.1 2.7-.4.7-.6 1.4-.6 2.2 0 2.1 1.6 3.8 3.7 4.1v2.8" />
      <path d="M11.3 6a4.4 4.4 0 0 1 .8 2.6c0 1.5-.8 2.8-2 3.6" />
      <path d="M7.7 17.7c1.5 0 2.8-.7 3.6-1.8" />
    </>
  ),
  heart: (
    <g style={{ fill: "var(--icon-paint, currentColor)" }} stroke="none">
      <path d="M12 19.5S4 14.8 4 9.7A4.2 4.2 0 0 1 8.2 5.5c1.6 0 3 .9 3.8 2.2.8-1.3 2.2-2.2 3.8-2.2A4.2 4.2 0 0 1 20 9.7c0 5.1-8 9.8-8 9.8Z" />
    </g>
  ),
  /* Skin & aesthetics — `drop.fill`, a serum drop. Mass at the round base,
     so it takes the flame's seat: slight enlarge, slight lift. */
  drop: (
    <g style={{ fill: "var(--icon-paint, currentColor)" }} stroke="none">
      <g transform="translate(12 11.1) scale(1.08) translate(-12 -12)">
        <path d="M12 3.4c3.1 3.9 5.8 7 5.8 10.2a5.8 5.8 0 0 1-11.6 0C6.2 10.4 8.9 7.3 12 3.4Z" />
      </g>
    </g>
  ),
  /* The blog's Science mark — a filled Erlenmeyer flask. */
  flask: (
    <g style={{ fill: "var(--icon-paint, currentColor)" }} stroke="none">
      <path d="M10.3 3.4h3.4v4.8l4.9 8.5a2.5 2.5 0 0 1-2.2 3.7H7.9a2.5 2.5 0 0 1-2.2-3.7l4.6-8.5Z" />
    </g>
  ),
};

/** Ramp stops, matching `--cat-*` in globals.css. The icon paints its stroke
    with the gradient itself, the way the app fills its SF Symbol with
    `peptide.categoryGradient` — a flat `currentColor` glyph beside a
    gradient-stroked label was the mismatch. */
const RAMP_STOPS: Record<string, [string, string]> = {
  warm: ["#b03f4e", "#c8724a"],
  cool: ["#366a76", "#6d9aa1"],
  brown: ["#85694d", "#a08a68"],
  green: ["#4d854d", "#6ba571"],
  gold: ["#a97c00", "#cf9a3e"],
  /* The brand accent, for the blog's eyebrow — blog categories carry no
     library ramp, and inventing one would break the five-ramp rule. Stops
     mirror `--accent-grad`. */
  accent: ["#1135ef", "#7288ff"],
};

export function CategoryIcon({
  name,
  size = 18,
  ramp,
}: {
  name: IconKey;
  size?: number;
  /** Paints the glyph with the category ramp. Omitted, it takes currentColor. */
  ramp?: string;
}) {
  const stops = ramp ? RAMP_STOPS[ramp] : undefined;
  // One gradient per ramp, so the id is stable and repeated icons on a page
  // share a single definition rather than colliding on a generated one.
  const gid = stops ? `cat-icon-${ramp}` : undefined;
  // The filled parts of a mark (the dumbbell plates, the bandage pad) read
  // `--icon-paint`, so they take the same gradient as the strokes. It travels
  // as a custom property because an SVG presentation attribute cannot carry
  // one, and painting those groups `currentColor` left half of every icon a
  // flat ink sitting beside a gradient-stroked label.
  const paint = stops ? ({ "--icon-paint": `url(#${gid})` } as CSSProperties) : undefined;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={gid ? `url(#${gid})` : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={paint}
    >
      {stops && (
        <defs>
          {/* userSpaceOnUse, NOT the default objectBoundingBox. Every sub-path
              of a mark is its own painted object, so a bounding-box gradient
              restarts the ramp inside each one: each dumbbell plate rendered as
              a near-flat block, and the horizontal bar joining them has a
              ZERO-HEIGHT box, which makes a vertical bounding-box gradient
              degenerate and paints nothing at all. Anchored to the 24-box, one
              ramp runs across the whole glyph the way it does across the label
              beside it. */}
          <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="24">
            <stop offset="0%" stopColor={stops[0]} />
            <stop offset="100%" stopColor={stops[1]} />
          </linearGradient>
        </defs>
      )}
      <g>{PATHS[name]}</g>
    </svg>
  );
}
