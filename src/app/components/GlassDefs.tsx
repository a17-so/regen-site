/**
 * Refraction filter for the glass surfaces. Rendered once, in the layout.
 *
 * ── Why this and not a library ──────────────────────────────────────────────
 * Every liquid-glass package on npm is a wrapper around the same browser
 * feature: `backdrop-filter: url(#filter)` with an SVG displacement map. I
 * tested it directly before choosing, it works, and it's about 15 lines.
 * `liquid-glass-react` is the credible option (no deps, ~34k weekly, React 19
 * peer) but it ships 176KB, wants explicit pixel width/height on every
 * instance, and wraps content in its own container, which fights a token-
 * driven CSS system where glass is a property of forty different surfaces
 * rather than a component. The three.js one costs a WebGL runtime for a
 * background effect. So: the technique, not the dependency.
 *
 * ── The honest limitation ───────────────────────────────────────────────────
 * SVG filters inside backdrop-filter work in Chromium and Safari. Firefox
 * does not support them and never renders the refraction, a library wouldn't
 * change that. So it's applied through @supports and degrades to the plain
 * frost, which is why the frost has to look right on its own.
 */
export default function GlassDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        {/*
          Low baseFrequency = long, lazy waves rather than frosted noise —
          glass bending light, not sandblasting. The blur on the turbulence
          smooths the map so the displacement reads as a curve instead of
          grain. `scale` is deliberately small: the test render at 42 tore the
          background into streaks. 12 bends the edge without smearing text
          behind it.
        */}
        <filter id="regen-glass" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.006"
            numOctaves="2"
            seed="12"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="4" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Stronger variant for large hero surfaces, where the extra bend has
            room to read without touching small text. */}
        <filter id="regen-glass-lg" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.004"
            numOctaves="2"
            seed="12"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="6" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
