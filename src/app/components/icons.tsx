// Every icon takes an explicit width/height. An SVG with only a viewBox has no
// intrinsic size, so inside a flex container it stretches to fill the free
// space, which is how a 17px Apple glyph became a white blob across the
// full-width mobile CTA, and how the search icon swallowed the blog grid.

export const AppleIcon = ({ size = 21 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M17.05 12.04c-.03-2.39 1.95-3.54 2.04-3.59-1.11-1.62-2.84-1.85-3.45-1.87-1.47-.15-2.87.86-3.62.86-.76 0-1.91-.84-3.14-.82-1.62.02-3.11.94-3.94 2.39-1.68 2.92-.43 7.23 1.21 9.6.8 1.16 1.76 2.46 3.01 2.41 1.21-.05 1.67-.78 3.14-.78 1.46 0 1.88.78 3.16.75 1.31-.02 2.13-1.18 2.93-2.35.92-1.35 1.3-2.65 1.32-2.72-.03-.01-2.54-.97-2.57-3.88zM14.62 5.06c.66-.81 1.11-1.93.99-3.05-.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.85-1.01 2.95 1.08.08 2.18-.55 2.84-1.34z" />
  </svg>
);

export const GooglePlayIcon = ({ size = 17 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M3.6 2.18c-.36.39-.57.99-.57 1.78v16.07c0 .79.21 1.4.57 1.79l.06.05L13 12.5v-.99L3.66 2.13l-.06.05z" opacity=".85" />
    <path d="M16.31 15.81L13 12.5v-.99l3.31-3.31.07.04 3.91 2.22c1.12.63 1.12 1.66 0 2.3l-3.91 2.22-.07.03z" />
    <path d="M16.38 15.78L13 12 3.6 21.82c.37.39.98.44 1.66.05l11.12-6.09" opacity=".95" />
    <path d="M16.38 8.22L5.26 2.13c-.68-.39-1.29-.34-1.66.05L13 12l3.38-3.78z" opacity=".7" />
  </svg>
);

export const ArrowR = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12 h14" />
    <path d="M13 6 l6 6 -6 6" />
  </svg>
);

export const Check = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12 l5 5 L20 7" />
  </svg>
);

export const Star = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M12 2 l3.09 6.26 L22 9.27 l-5 4.87 1.18 6.88 L12 17.77 l-6.18 3.25 L7 14.14 2 9.27 l6.91 -1.01 L12 2z" />
  </svg>
);
