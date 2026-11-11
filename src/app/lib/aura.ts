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

/** The library's thumbnails: the same aura in a body system's ramp (the
    app's five-stop ramps from Colors.swift, plus a white highlight that
    reads as light on liquid), seeded by the compound's slug. Replaced the
    brand-tile compositions on 2026-11-09 ("the thumbnail on the peptide
    cards need to be a lot better, not just the stupid squares"). Gold sits
    on the app's cream. */
const LIBRARY: Record<string, { ground: string; mid: string; tip: string; top: string }> = {
  green: { ground: "#f3f8f3", mid: "#77B27C", tip: "#B2D5B5", top: "#4E854E" },
  warm: { ground: "#fbf3f0", mid: "#C86C3F", tip: "#D1946F", top: "#B03F4E" },
  cool: { ground: "#f1f6f6", mid: "#83AAAF", tip: "#A8CEC8", top: "#366A76" },
  gold: { ground: "#FFF8E6", mid: "#EEC752", tip: "#F4E3A6", top: "#E0A400" },
  brown: { ground: "#f7f5ef", mid: "#B29D77", tip: "#D2D5B2", top: "#85694E" },
};

/** Luminous, not muddy: the ramp's middle and light stops carry the colour,
    its darkest stop is only a faint depth in one corner, a white highlight
    sits on top, and one soft diagonal sheen reads as light on liquid. */
/** The dark and light renditions shift the SAME ramp's stops (nothing
    invented): dark leads with the deepest stop over the middle on a deeper
    ground and dims the highlight; light leads with the palest stop over a
    whisper of the middle on a paler ground and widens the highlight. */
const SHADE: Record<string, { lead: "mid" | "top" | "tip"; second: "mid" | "top" | "tip"; depth: "mid" | "top" | "tip"; leadA: string; secondA: string; depthA: string; whiteA: string; ground: (p: { ground: string; mid: string; tip: string; top: string }) => string }> = {
  base: { lead: "mid", second: "tip", depth: "top", leadA: "f2", secondA: "e6", depthA: "70", whiteA: "e6", ground: (p) => p.ground },
  dark: { lead: "top", second: "mid", depth: "top", leadA: "e6", secondA: "f2", depthA: "cc", whiteA: "73", ground: (p) => `${p.tip}` },
  light: { lead: "tip", second: "mid", depth: "mid", leadA: "f2", secondA: "99", depthA: "8c", whiteA: "f2", ground: (p) => p.ground },
};

export function libraryAura(tone: string, seed: string, shade: string = "base"): { backgroundColor: string; backgroundImage: string } {
  const p = LIBRARY[tone] ?? LIBRARY.green;
  const sh = SHADE[shade] ?? SHADE.base;
  const r = prng(`lib:${seed}`);
  const j = (lo: number, hi: number) => lo + (hi - lo) * r();
  const f = (n: number) => n.toFixed(1);
  const blob = (x: number, y: number, size: number, hex: string, alpha: string) =>
    `radial-gradient(${f(size)}% ${f(size * 1.25)}% at ${f(x)}% ${f(y)}%, ${hex}${alpha} 0%, ${hex}00 70%)`;
  const flip = r() < 0.5;
  // Variation WITHIN the ramp, never another colour: each compound draws
  // its own arrangement, its own balance of the ramp's stops and its own
  // depth, so a list is a family in one colour.
  const lift = j(0.0, 0.35);
  const coin = r() < 0.5;
  const alt = shade === "dark" ? (coin ? p.mid : p.top) : shade === "light" ? (coin ? p.tip : p.mid) : coin ? p.tip : p.mid;
  const altA = shade === "light" && !coin ? "a6" : "cc";
  const sx = (x: number) => (flip ? 100 - x : x);
  const angle = Math.round(j(100, 140));
  const sheen = shade === "dark" ? 0.28 : shade === "light" ? 0.55 : 0.45;
  const white = shade === "light" ? j(40, 52) : j(30, 42);
  return {
    backgroundColor: sh.ground(p),
    backgroundImage: [
      `linear-gradient(${angle}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,${sheen}) 48%, rgba(255,255,255,0) 64%)`,
      blob(sx(j(55, 80)), j(20, 45), white, "#FFFFFF", sh.whiteA),
      blob(sx(j(10, 35)), j(55, 90), j(55, 75), p[sh.lead], sh.leadA),
      blob(sx(j(60, 95)), j(60, 100), j(55, 75), p[sh.second], sh.secondA),
      blob(sx(j(0, 25)), j(0, 30), j(40, 55), p[sh.depth], sh.depthA),
      blob(sx(j(70, 100)), j(0, 30), j(40, 55), alt, altA),
      blob(sx(j(35, 65)), j(70, 100), j(30, 45), lift > 0.2 ? p[sh.depth] : p.tip, lift > 0.2 ? "55" : "99"),
    ].join(", "),
  };
}
