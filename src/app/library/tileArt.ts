/**
 * The artwork on the identity card and the library rows, in REGEN's own
 * language: the brand tiles (the soft dimensional squares of the banner and
 * the closing card, `.sq`) in the compound's status ramp, painted with the
 * app's exact vertical ramps (`--cat-*-v`).
 *
 * Units: x and size are % of the panel width, y is % of its height, so a y
 * distance counts `aspect` (height / width) of an x distance.
 */
export type Tile = { x: number; y: number; s: number; r: number; glass?: boolean; d: number };

/* Rounded to 0.01: Math.sin and Math.cos differ in the last digit between
   the server's V8 and the browser's, and an unrounded style string is a
   hydration mismatch on every card. */
const r2 = (v: number) => Math.round(v * 100) / 100;

/** FNV-1a: the layout pick needs a real hash. `slugSeed` multiplies by 31,
    and 31 is 1 mod 6, so its value mod 6 was just the sum of the character
    codes: three Skin compounds in a row drew the same arrangement. */
function fnv(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return h;
}

/**
 * Hand-set compositions, not a scatter. Each is a small arrangement drawn
 * like a layout (positions, sizes, which way each tile leans), and a slug
 * picks one; only the lean varies within it, by a few degrees, so a list
 * reads as one family in several arrangements. History: up to seven tiles
 * from six random layouts ("too funky"), then one tile at a random spot
 * ("random blocks in the middle of nowhere"), then a fixed pair ("I don't
 * like the two square thing; as many squares as you want, change it
 * around"). Tiles never overlap and none is cropped.
 *
 * Each tile: [x, y, size, lean sign]. x and size in % of the panel width,
 * y in % of its height. The first tile is the largest (it carries the
 * stronger shadow); `g` marks the identity card's one clear glass tile.
 */
type Spec = [number, number, number, number, ("g" | undefined)?];

/* The row: a 2:1 panel. A tile of size s is 2s% of the panel tall. */
const ROW: Spec[][] = [
  // Constellation: a large tile, three smaller ones off its right side.
  [[34, 50, 24, 1], [62, 28, 11, -1], [66, 74, 8, 1], [81, 48, 5.5, -1]],
  // Steps: three tiles climbing to the right, one stray at the foot.
  [[72, 40, 20, -1], [46, 56, 15, 1], [24, 68, 10, -1], [88, 80, 5, 1]],
  // Keys: four tiles packed in a square, one small companion.
  [[38, 31, 14, -1], [56, 31, 14, 1], [38, 69, 14, 1], [56, 69, 12, -1], [78, 30, 6.5, 1]],
  // Orbit: a large tile with four small ones round it.
  [[48, 50, 22, -1], [24, 28, 8, 1], [22, 72, 6, -1], [74, 27, 10, 1], [75, 74, 7, -1]],
  // Row: three tiles growing left to right, one tiny above.
  [[66, 50, 21, 1], [40, 52, 15, -1], [19, 56, 10, 1], [87, 22, 5, -1]],
];

/* The identity card: a 5:4 panel. A tile of size s is 1.25s% tall. */
const CARD: Spec[][] = [
  [[42, 50, 38, 1], [76, 24, 15, -1], [79, 72, 10, 1], [15, 25, 7, -1], [16, 72, 13, -1, "g"]],
  [[72, 30, 26, -1], [44, 52, 22, 1, "g"], [20, 72, 15, -1], [82, 76, 8, 1], [16, 24, 6, -1]],
  [[35, 33, 19, -1], [64, 33, 19, 1, "g"], [35, 68, 19, 1], [64, 68, 16, -1], [88, 24, 7, 1], [11, 76, 5.5, -1]],
  [[50, 50, 32, -1], [20, 26, 11, 1], [18, 74, 8, -1], [80, 27, 14, 1, "g"], [82, 75, 9, -1]],
  [[70, 47, 28, 1], [40, 52, 20, -1, "g"], [17, 57, 13, 1], [88, 17, 6, -1], [14, 22, 5, 1]],
];

function build(slug: string, set: Spec[][], salt: string, glass: boolean): Tile[] {
  const h = fnv(`${slug}:${salt}`);
  const spec = set[(h >>> 11) % set.length];
  const base = 5 + ((h >>> 3) % 6);
  return spec.map(([x, y, s, sign, g], i) => {
    const lean = sign * (base + ((h >>> (17 + i)) % 5));
    return { x: r2(x), y: r2(y), s: r2(s), r: r2(lean), glass: glass && g === "g", d: i };
  });
}

/** The identity card: a 5:4 panel, five or six tiles, one clear glass. */
export function tileArt(slug: string): Tile[] {
  return build(slug, CARD, "card", true);
}

/** A library row: a 2:1 panel, four or five tiles, no glass (159 rows of
    backdrop blur is the expensive kind), no drift. */
export function tileRowArt(slug: string): Tile[] {
  return build(slug, ROW, "row", false);
}
