/**
 * Blog cover image (v4, 2026-11-08): the aura from lib/aura.ts, rendered
 * through next/og for the post's JSON-LD image. The cards and the featured
 * pane paint the same layers as CSS and never request this.
 *
 * Three drawings were rejected at card size before this one: the
 * infographic (category pill, figure, three-line caption, mark, domain:
 * still the OG card in lib/cover.tsx) read as clutter; flat rotated gradient
 * tiles read as cheap; lit 3D spheres read as stock clipart, and sixty
 * saturated blue fields made the grid a wall of one colour. This is the
 * aura the health brands use: a soft mesh of four or five related hues per
 * category on a light ground, a fine grain over it, no objects and no
 * words. The card's title sits right under it. Every blob's position, size
 * and hue is seeded by the slug, so each post has its own cover and the
 * same post always draws the same one.
 *
 * 3:2 (1200x800), the shape the card and the featured pane crop to.
 */

import { aura } from "./aura";

export type CoverArtInput = {
  category: string;
  /** The post slug: seeds the composition. */
  seed: string;
};

/** A fine monochrome grain, as an SVG the renderer rasterises. It is what
    keeps a smooth gradient from banding and reading as a default fill. */
const GRAIN =
  "data:image/svg+xml;base64," +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">` +
      `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>` +
      `<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0"/></filter>` +
      `<rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  ).toString("base64");

export function CoverArt({ input }: { input: CoverArtInput }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", ...aura(input.category, input.seed) }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori tree, not the DOM */}
      <img alt="" src={GRAIN} width={1200} height={800} style={{ position: "absolute", left: 0, top: 0 }} />
    </div>
  );
}
