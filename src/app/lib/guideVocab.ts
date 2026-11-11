/**
 * The library's vocabulary, with no data imports, so client components can
 * use it without pulling every guide into the browser bundle.
 */

/* Top to bottom of the body, the order the hub's list, its tabs and the
   figure's hotspots follow, so scrolling the list walks the highlight DOWN
   the body (head, face, throat, shoulder, chest, abdomen, pelvis, thigh)
   instead of jumping between the head, the whole figure and the gut ("make
   sure the scrolling down build down of body parts is seamless"). */
export const CATEGORIES = [
  { slug: "brain", label: "Brain & sleep", short: "Brain", blurb: "Cognition, mood, sleep, and the nervous system." },
  { slug: "skin", label: "Skin & aging", short: "Skin", blurb: "Skin, hair, wound repair, and cosmetic peptides." },
  { slug: "hormones", label: "Hormones & metabolism", short: "Hormones", blurb: "Growth hormone, reproductive and metabolic hormones." },
  { slug: "immune", label: "Immune & defense", short: "Immune", blurb: "Immune signalling, infection, and inflammation." },
  { slug: "heart", label: "Heart & blood", short: "Heart", blurb: "Cardiovascular, blood pressure, and clotting." },
  { slug: "digestive", label: "Digestive & weight", short: "Digestive", blurb: "Appetite, metabolism, the gut, and weight." },
  { slug: "sexual", label: "Sexual & reproductive", short: "Sexual", blurb: "Libido, fertility, and reproductive hormones." },
  { slug: "bones", label: "Bones & muscles", short: "Bones", blurb: "Muscle, tendon, bone, and recovery." },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type CategoryMeta = (typeof CATEGORIES)[number];

export const STATUSES = [
  { key: "fda-approved", label: "FDA-approved" },
  { key: "in-trials", label: "In clinical trials" },
  { key: "not-approved", label: "Not FDA-approved" },
  { key: "cosmetic", label: "Cosmetic and topical" },
] as const;

export type StatusKey = (typeof STATUSES)[number]["key"];

export const EVIDENCE = ["FDA approved", "Deep research", "Moderate research", "Limited research", "Low research"] as const;
export type Evidence = (typeof EVIDENCE)[number];

/** Status is a dot AND a label, painted with the app's own ramps. */
export const STATUS_TONE: Record<StatusKey, "green" | "gold" | "warm" | "cool"> = {
  "fda-approved": "green",
  "in-trials": "gold",
  "not-approved": "warm",
  cosmetic: "cool",
};

/** The colour of a body system: the app's FIVE category ramps
    (Colors.swift; LibraryModels.swift `asCategoryGradient`), mapped by what
    people already associate with each system (see CATEGORY_SHADE); no two
    neighbours in the head-to-toe order alike. The app has no body-system
    colours of its own, so it has no more than these five; an eight-colour
    set with blue, pink and orange was cut as "far too many colors, check
    app for proper ref". Colour codes the body system, never FDA status. */
export type Tone = "green" | "gold" | "warm" | "cool" | "brown";
export const CATEGORY_TONE: Record<CategorySlug, Tone> = {
  brain: "cool",
  skin: "brown",
  hormones: "gold",
  immune: "cool",
  heart: "warm",
  digestive: "green",
  sexual: "warm",
  bones: "brown",
};
/** Two systems share each of three ramps, so each pair splits into a dark
    and a light rendition of it, and every system takes the colour people
    already link to it (2026-11-10, "make sexual more peach ... use
    psychology"): Heart dark warm (blood red) / Sexual light warm (peach,
    blush); Brain & sleep dark cool (calm, night, focus) / Immune light cool
    (clean, clinical, protective); Bones & muscles dark brown (sturdy,
    earthy) / Skin light brown (skin tone, tan); Hormones & metabolism gold
    (energy, vitality); Digestive & weight green (food, fresh, gut). No two
    neighbours in the head-to-toe order share a ramp. Same five app ramps,
    nothing invented. */
export type Shade = "light" | "base" | "dark";
export const CATEGORY_SHADE: Record<CategorySlug, Shade> = {
  brain: "dark",
  skin: "light",
  hormones: "base",
  immune: "light",
  heart: "dark",
  digestive: "base",
  sexual: "light",
  bones: "dark",
};
/** Each body system's mark, picked for the same associations as its colour:
    a shield for defense, a leaf for food and the gut, a flame for desire,
    a flask for hormone chemistry (2026-11-10). */
export const CATEGORY_ICON: Record<CategorySlug, "brain" | "sparkles" | "flask" | "shield" | "heart" | "leaf" | "flame" | "dumbbell"> = {
  brain: "brain",
  skin: "sparkles",
  hormones: "flask",
  immune: "shield",
  heart: "heart",
  digestive: "leaf",
  sexual: "flame",
  bones: "dumbbell",
};
/** The ramp stops a canvas or shader needs (top, middle, tip). */
export const TONE_STOPS: Record<Tone, [string, string, string]> = {
  green: ["#4d854d", "#77b17c", "#b2d5b4"],
  gold: ["#e0a400", "#eec752", "#f4e3a6"],
  warm: ["#b03f4e", "#c86c3f", "#d1946f"],
  cool: ["#366a76", "#83aaaf", "#a8cdc8"],
  brown: ["#85694d", "#b19c77", "#d2d5b2"],
};

export function statusLabel(key: StatusKey): string {
  return STATUSES.find((s) => s.key === key)?.label ?? key;
}

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

/** Display order inside a category: approved first, then trials, then the rest. */
export const STATUS_ORDER: StatusKey[] = ["fda-approved", "in-trials", "not-approved", "cosmetic"];

/** A stable small number per slug, so each card's artwork differs. */
export function slugSeed(slug: string, mod = 8): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h % mod;
}
