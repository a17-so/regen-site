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
