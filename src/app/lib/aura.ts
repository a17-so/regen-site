/**
 * The blog cover's aura, as data: a light ground and five radial blobs in
 * the category's family of hues, seeded by the post slug. ONE function,
 * two painters: the card and the featured pane paint it as CSS (no image
 * request, no render, nothing to wait for), and the cover route
 * (lib/coverArt.tsx) paints the same layers through next/og for the post's
 * JSON-LD image. Same slug, same picture, on both.
 */

/** Every hue is a stop from the app's own gradients (Colors.swift in
    regen-app), nothing invented: no violet, no cyan, no coral. Science is
    the accent (#1135EF to #7288FF) with the cool ramp's pale slate; Protocols
    the green ramp with the cool slate; Biomarkers the yellow ramp with the
    warm ramp's amber on the app's cream (#FFF8E6). #DDDDDC is the gray
    ramp's light stop, a pale highlight that keeps a cover from going flat. */
const PALETTES: Record<string, { ground: string; hues: string[] }> = {
  Science: { ground: "#ffffff", hues: ["#1135EF", "#7288FF", "#A8CDC8", "#1135EF", "#DDDDDC"] },
  Protocols: { ground: "#ffffff", hues: ["#4D854D", "#77B17C", "#B2D5B4", "#4D854D", "#A8CDC8"] },
  Biomarkers: { ground: "#FFF8E6", hues: ["#E0A400", "#F4E3A6", "#D1946F", "#EEC752", "#C86C3F"] },
};

/** FNV-1a, then a mulberry32 stream: deterministic per slug. */
function prng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = (h >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function aura(category: string, seed: string): { backgroundColor: string; backgroundImage: string } {
  const p = PALETTES[category] ?? PALETTES.Science;
  const r = prng(seed);
  const j = (lo: number, hi: number) => lo + (hi - lo) * r();
  // Rotate the family so the leading hue differs post to post.
  const start = Math.floor(r() * p.hues.length);
  const hues = p.hues.map((_, i) => p.hues[(start + i) % p.hues.length]);
  // Two large anchors in opposite quarters, three smaller blobs anywhere;
  // strength falls off so the anchors carry the colour.
  const blobs = [
    { x: j(0, 35), y: j(0, 40), s: j(70, 95), a: "f2" },
    { x: j(65, 100), y: j(60, 100), s: j(70, 95), a: "e6" },
    { x: j(30, 75), y: j(20, 80), s: j(45, 65), a: "cc" },
    { x: j(55, 100), y: j(0, 35), s: j(40, 60), a: "b3" },
    { x: j(0, 40), y: j(65, 100), s: j(40, 60), a: "99" },
  ];
  const f = (n: number) => n.toFixed(1);
  return {
    backgroundColor: p.ground,
    backgroundImage: blobs
      .map((b, i) => `radial-gradient(${f(b.s)}% ${f(b.s * 1.2)}% at ${f(b.x)}% ${f(b.y)}%, ${hues[i]}${b.a} 0%, ${hues[i]}00 70%)`)
      .join(", "),
  };
}
