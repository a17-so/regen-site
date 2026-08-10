/**
 * The REGEN mark, six dots in a hex ring, the lower-left one carrying the
 * accent gradient. Traced from the app's `LogoBlack` asset
 * (Assets.xcassets/LogoBlack.imageset/Group 3864.png, 688×745) so the web mark
 * and the app icon are the same shape.
 *
 * Gradients are the app's own tokens:
 *   dark dot  → LinearGradient.logoDot  (#0A0A0A → #5B5B5B, top to bottom)
 *   accent dot→ LinearGradient.accent   (#1135EF → #7288FF, top to bottom)
 *
 * Inline SVG rather than the PNG: stays crisp at every size, costs no request,
 * and the accent dot inherits the same gradient stops as every CTA on the page.
 */

const R = 104;

// Measured centres from the source asset, in its native 688×745 space.
const DOTS: { cx: number; cy: number; accent?: boolean }[] = [
  { cx: 344, cy: 110 }, // top
  { cx: 105, cy: 246 }, // upper-left
  { cx: 583, cy: 246 }, // upper-right
  { cx: 105, cy: 500, accent: true }, // lower-left, the one blue dot
  { cx: 583, cy: 500 }, // lower-right
  { cx: 344, cy: 636 }, // bottom
];

/**
 * Fixed gradient ids, deliberately shared across every instance.
 *
 * A module-level counter (`rg${uid++}`) looks like the safe choice but breaks
 * twice over: the count restarts on the client, so the ids differ from the
 * server's and React reports a hydration mismatch, and the server's own count
 * survives across requests, so two logos on one page can collide anyway.
 * `useId()` would fix it but forces this into a client component to ship JS for
 * a static mark. Since every instance defines byte-identical gradients, one
 * stable pair of ids resolves unambiguously and stays deterministic.
 */
const DOT_ID = "regen-mark-dot";
const DOT_LIGHT_ID = "regen-mark-dot-light";
const ACCENT_ID = "regen-mark-accent";

export default function Logo({
  size = 26,
  className,
  light = false,
}: {
  size?: number;
  className?: string;
  /** Swap the near-black dots for white, the mark is invisible on a dark
   *  surface otherwise, since its gradient stops are fixed hexes. */
  light?: boolean;
}) {
  return (
    <svg
      width={size}
      height={(size * 745) / 688}
      viewBox="0 0 688 745"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={DOT_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A0A0A" />
          <stop offset="1" stopColor="#5B5B5B" />
        </linearGradient>
        <linearGradient id={DOT_LIGHT_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C9C9CF" />
        </linearGradient>
        <linearGradient id={ACCENT_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1135EF" />
          <stop offset="1" stopColor="#7288FF" />
        </linearGradient>
      </defs>
      {DOTS.map((d) => (
        <circle
          key={`${d.cx}-${d.cy}`}
          cx={d.cx}
          cy={d.cy}
          r={R}
          fill={`url(#${d.accent ? ACCENT_ID : light ? DOT_LIGHT_ID : DOT_ID})`}
        />
      ))}
    </svg>
  );
}
