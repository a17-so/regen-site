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
  flame: (
    <path d="M12 3c.6 2.5-.5 4-1.8 5.2C8.6 9.6 7 11 7 13.6A5 5 0 0 0 12 19a5 5 0 0 0 5-5.4c0-2-1-3.6-2.2-5-.4 1-1 1.6-1.8 2 .4-2.7-.3-5.5-1-7.6Z" />
  ),
  bandage: (
    <>
      <rect x="2.6" y="8.2" width="18.8" height="7.6" rx="3.8" transform="rotate(-30 12 12)" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c0 8-4.6 12-9 12a5 5 0 0 1-5-5C6 6.6 12 4 20 4Z" />
      <path d="M4 20c2.8-3.4 6-6 10.5-8.2" />
    </>
  ),
  dumbbell: (
    <>
      {/* Plates as filled blocks, not hairlines: at 17px a four-stroke
          dumbbell collapses into an unreadable row of ticks. */}
      <g fill="currentColor" stroke="none">
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
    <>
      <path d="M12 3.5 13.4 8 18 9.4 13.4 10.8 12 15.4 10.6 10.8 6 9.4 10.6 8Z" />
      <path d="M18.2 15.2l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7Z" />
    </>
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
    <path d="M12 19.5S4 14.8 4 9.7A4.2 4.2 0 0 1 8.2 5.5c1.6 0 3 .9 3.8 2.2.8-1.3 2.2-2.2 3.8-2.2A4.2 4.2 0 0 1 20 9.7c0 5.1-8 9.8-8 9.8Z" />
  ),
};

export function CategoryIcon({ name, size = 18 }: { name: IconKey; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

/**
 * The mark on its glass plaque, glyph in ink.
 *
 * The plate is deliberately colourless. Category colour lives on the ramp rule
 * down the card edge and on the gradient section eyebrow; tinting the plate as
 * well put three colour signals on one card and turned an index of 24
 * compounds into a paintbox.
 */
export function CategoryChip({ name, size = "sm" }: { name: IconKey; size?: "sm" | "lg" }) {
  return (
    <span className={`lib-icon lib-icon--${size}`} aria-hidden="true">
      <CategoryIcon name={name} size={size === "lg" ? 24 : 17} />
    </span>
  );
}
