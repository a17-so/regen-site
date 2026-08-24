/**
 * Learn: the goal-based rankings and head-to-head comparisons.
 *
 * These carry no prose of their own. Each entry names the compounds it covers
 * and the page composes the body from the catalog at build time: evidence tier,
 * dose card, mechanism, trials, citations. That keeps every claim traceable to
 * `library-peptides.json` and means a catalog correction propagates to the
 * guides without anyone rewriting them.
 *
 * Member slugs are validated against the catalog on module load, so a catalog
 * rename fails the build instead of silently emptying a page.
 */
import { PEPTIDES, peptideBySlug, type Peptide } from "./library";

export type LearnKind = "best-for" | "comparison";

export interface LearnArticle {
  slug: string;
  kind: LearnKind;
  /** H1. */
  title: string;
  /** Card label on the index, short form. */
  cardTitle: string;
  description: string;
  /** Compounds covered, in the order they should be ranked or compared. */
  members: string[];
  /** Shown on the card, mirrors the reference "Popular" chip. */
  popular?: boolean;
  /** The question this page is meant to answer, used as the lead paragraph. */
  intent: string;
}

export const BEST_FOR: LearnArticle[] = [
  {
    slug: "best-peptides-for-weight-loss",
    kind: "best-for",
    title: "Best Peptides for Weight Loss",
    cardTitle: "Weight Loss",
    description:
      "Compare the most effective peptides for weight loss and fat loss. Evidence-based rankings of semaglutide, tirzepatide, retatrutide, and more.",
    members: ["tirzepatide", "semaglutide", "retatrutide", "liraglutide", "orforglipron", "5-amino-1mq"],
    popular: true,
    intent:
      "Which peptides actually move body weight in controlled trials, and by how much.",
  },
  {
    slug: "best-peptides-for-recovery",
    kind: "best-for",
    title: "Best Peptides for Recovery",
    cardTitle: "Recovery",
    description:
      "Compare the best peptides for injury recovery, tissue repair, and healing. Evidence-based rankings of BPC-157, TB-500, and more.",
    members: ["bpc-157", "tb-500", "ghk-cu", "kpv", "bpc-157-tb-500-blend"],
    popular: true,
    intent: "What the recovery peptides are actually evidenced for, and where the data stops.",
  },
  {
    slug: "best-peptides-for-muscle-growth",
    kind: "best-for",
    title: "Best Peptides for Muscle Growth",
    cardTitle: "Muscle Growth",
    description:
      "Compare the best peptides for muscle growth, recovery, and body composition. Evidence-based rankings of CJC-1295, ipamorelin, and more.",
    members: ["tesamorelin", "cjc-1295", "ipamorelin", "mk-677", "follistatin-344", "igf-1-lr3"],
    popular: true,
    intent: "Which growth hormone pathways have human body-composition data behind them.",
  },
  {
    slug: "best-peptides-for-anti-aging",
    kind: "best-for",
    title: "Best Peptides for Anti-Aging",
    cardTitle: "Anti-Aging",
    description:
      "Compare the best anti-aging peptides for longevity, skin health, cognitive function, and cellular repair. Evidence-based rankings.",
    members: ["ghk-cu", "nad-plus", "glutathione", "thymosin-alpha-1", "epithalon", "ss-31"],
    popular: true,
    intent: "Longevity claims separated by whether the underlying study was human or rodent.",
  },
  {
    slug: "best-peptides-for-skin",
    kind: "best-for",
    title: "Best Peptides for Skin Health",
    cardTitle: "Skin Health",
    description:
      "Compare the best peptides for skin health, anti-aging, collagen production, and wound healing. Evidence-based rankings.",
    members: ["ghk-cu", "ahk-cu", "glow", "snap-8", "melanotan-i"],
    popular: true,
    intent: "Which topical and injectable peptides have dermatology data, and which have marketing.",
  },
  {
    slug: "best-peptides-for-sleep",
    kind: "best-for",
    title: "Best Peptides for Sleep",
    cardTitle: "Sleep",
    description:
      "Compare the best peptides for sleep quality: DSIP, ipamorelin, CJC-1295, Selank, epithalon. Evidence-based rankings with dosing.",
    members: ["dsip", "ipamorelin", "cjc-1295-no-dac", "epithalon", "selank"],
    intent: "Sleep-architecture claims, and how thin the controlled evidence is for most of them.",
  },
  {
    slug: "best-peptides-for-gut-health",
    kind: "best-for",
    title: "Best Peptides for Gut Health",
    cardTitle: "Gut Health",
    description:
      "Compare the best peptides for gut health, intestinal permeability, and inflammatory bowel conditions. Evidence-based rankings.",
    members: ["bpc-157", "kpv", "larazotide", "ll-37", "klow"],
    intent: "Gut-barrier and colitis evidence, including the one compound that reached phase 3.",
  },
  {
    slug: "best-peptides-for-joint-health",
    kind: "best-for",
    title: "Best Peptides for Joint Health",
    cardTitle: "Joint Health",
    description:
      "Compare the best peptides for joint health, tendon repair, and connective tissue recovery. Evidence-based rankings.",
    members: ["bpc-157", "tb-500", "ghk-cu", "kpv"],
    intent: "Tendon and ligament repair claims, and why almost all of it is still rodent work.",
  },
  {
    slug: "best-peptides-for-cognitive-enhancement",
    kind: "best-for",
    title: "Best Peptides for Cognitive Enhancement",
    cardTitle: "Cognitive Enhancement",
    description:
      "Compare the best nootropic peptides for focus, memory, and neuroprotection. Evidence-based rankings of Semax, Selank, and more.",
    members: ["semax", "selank", "dihexa", "adamax", "humanin", "pinealon"],
    intent: "Nootropic peptides and the size of the human evidence base behind each.",
  },
  {
    slug: "best-peptides-for-hair-growth",
    kind: "best-for",
    title: "Best Peptides for Hair Growth",
    cardTitle: "Hair Growth",
    description:
      "Compare the best peptides for hair growth and follicle health. Evidence-based rankings of GHK-Cu, AHK-Cu, and more.",
    members: ["ghk-cu", "ahk-cu", "glow"],
    intent: "Follicle and copper-peptide claims, and what the trichology literature supports.",
  },
  {
    slug: "best-peptides-for-beginners",
    kind: "best-for",
    title: "Best Peptides for Beginners",
    cardTitle: "Beginners",
    description:
      "The peptides most often started first, ranked by evidence quality and safety profile rather than popularity.",
    members: ["semaglutide", "ghk-cu", "bpc-157", "ipamorelin", "tb-500"],
    intent: "Where people usually start, reordered by how much evidence actually backs each one.",
  },
  {
    slug: "best-peptides-for-sexual-health",
    kind: "best-for",
    title: "Best Peptides for Sexual Health",
    cardTitle: "Sexual Health",
    description:
      "Compare peptides for libido, arousal, and hormonal support. Evidence-based rankings of PT-141, kisspeptin-10, and more.",
    members: ["pt-141", "kisspeptin-10", "oxytocin", "gonadorelin", "hcg"],
    intent: "The one FDA-approved compound in this space, and everything positioned next to it.",
  },
  {
    slug: "best-peptides-for-immune-support",
    kind: "best-for",
    title: "Best Peptides for Immune Support",
    cardTitle: "Immune Support",
    description:
      "Compare peptides for immune modulation and antimicrobial defence. Evidence-based rankings of thymosin alpha-1, LL-37, and more.",
    members: ["thymosin-alpha-1", "ll-37", "kpv", "vip", "glutathione"],
    intent: "Immune modulation claims, including the compound approved in dozens of countries.",
  },
];

/** Head-to-head pages. `members` is exactly two, in title order. */
export const COMPARISONS: LearnArticle[] = (
  [
    ["semaglutide", "tirzepatide", true],
    ["bpc-157", "tb-500", true],
    ["cjc-1295", "ipamorelin", true],
    ["liraglutide", "semaglutide", false],
    ["semaglutide", "retatrutide", true],
    ["sermorelin", "cjc-1295", false],
    ["ipamorelin", "ghrp-6", false],
    ["selank", "semax", true],
    ["ghk-cu", "bpc-157", false],
    ["bpc-157", "kpv", false],
    ["pt-141", "melanotan-ii", true],
    ["tirzepatide", "retatrutide", true],
    ["ghrp-2", "ghrp-6", false],
    ["epithalon", "ss-31", false],
    ["tesamorelin", "ipamorelin", false],
    ["thymosin-alpha-1", "tb-500", false],
    // The reference site runs AOD-9604 vs semaglutide here. AOD-9604 is not in
    // the REGEN catalog, so this slot covers the oral-vs-injectable GLP-1
    // question instead, which is both answerable from our data and higher
    // intent.
    ["semaglutide", "orforglipron", false],
  ] as [string, string, boolean][]
).map(([a, b, popular]) => {
  const pa = peptideBySlug(a);
  const pb = peptideBySlug(b);
  if (!pa || !pb) throw new Error(`Comparison references unknown compound: ${a} vs ${b}`);
  return {
    slug: `${a}-vs-${b}`,
    kind: "comparison" as const,
    title: `${pa.name} vs ${pb.name}`,
    cardTitle: `${pa.name} vs ${pb.name}`,
    description: `${pa.name} vs ${pb.name}: mechanism, dosing, evidence grade, and side effects compared side by side, with citations.`,
    members: [a, b],
    popular,
    intent: `How ${pa.name} and ${pb.name} differ on mechanism, dosing, and the strength of the evidence behind each.`,
  };
});

export const LEARN_ARTICLES: LearnArticle[] = [...BEST_FOR, ...COMPARISONS];

const BY_SLUG = new Map(LEARN_ARTICLES.map((a) => [a.slug, a]));

export function learnBySlug(slug: string): LearnArticle | undefined {
  return BY_SLUG.get(slug);
}

/** Resolve an article's members, dropping any the catalog no longer carries. */
export function membersOf(a: LearnArticle): Peptide[] {
  return a.members
    .map((s) => peptideBySlug(s))
    .filter((p): p is Peptide => Boolean(p));
}

/** ~200wpm over the composed body, so cards can show a read time like the rest of the site. */
export function learnReadMinutes(a: LearnArticle): number {
  const words = membersOf(a).reduce((n, p) => {
    const text = [
      p.description,
      p.subtitle,
      ...p.evidenceSummary,
      ...p.evidenceClaims.map((c) => `${c.claim} ${c.note ?? ""}`),
      ...p.trials.map((t) => `${t.name} ${t.headlineStat ?? ""}`),
    ].join(" ");
    return n + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(3, Math.round(words / 200));
}

// Fail the build on a stale member slug rather than rendering an empty ranking.
for (const a of BEST_FOR) {
  for (const slug of a.members) {
    if (!PEPTIDES.some((p) => p.slug === slug)) {
      throw new Error(`Learn article "${a.slug}" references unknown compound "${slug}"`);
    }
  }
}
