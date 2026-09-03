import { BLOG_POSTS } from "../lib/blogData";
import { ALL_PEPTIDES_SORTED, CATEGORIES, hrefFor } from "../lib/library";
import { BEST_FOR, COMPARISONS } from "../lib/libraryLearn";
import { CALCULATOR_PRESETS } from "../lib/calculators";

const SITE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(
  /\/$/,
  ""
);

// Serves /llms.txt, a lowest-priority, unratified convention (ship it, don't
// over-invest). Summarizes the site + lists blog articles for AI agents.
export function GET() {
  const lines = [
    "# REGEN",
    "",
    "> REGEN is a consumer health app and reference layer for people running peptide/biomarker protocols. It tracks vials, doses, and biomarkers, and gives an AI second opinion grounded in cited research.",
    "",
    "## Key pages",
    `- [Home](${SITE_URL}/): what REGEN is`,
    `- [Library](${SITE_URL}/library): evidence-graded reference on ${ALL_PEPTIDES_SORTED.length} peptides, each with dosing, side effects, pharmacokinetics, and primary-source citations`,
    `- [Blog](${SITE_URL}/blog): educational articles on biomarkers, peptides, and protocols`,
    `- [FAQs](${SITE_URL}/faq): how REGEN schedules doses, tracks vials and biomarkers, grades compounds`,
    "",
    "## Library: peptide reference",
    "Each compound carries a REGEN research grade from S (regulatory approval) to F (no clinical evidence), plus sub-pages for how it works, dosage, side effects, research, stacking, and pharmacokinetics.",
    `The grading method is documented at ${SITE_URL}/library/how-we-grade: the grade describes how well a compound has been measured in humans, not how well it works, so a popular compound with only animal data grades low.`,
    "",
    ...CATEGORIES.map(
      (c) => `- [${c.label}](${SITE_URL}/library/${c.slug}): ${c.blurb}`
    ),
    "",
    ...ALL_PEPTIDES_SORTED.map(
      (p) =>
        `- [${p.name}](${SITE_URL}${hrefFor(p)}) (grade ${p.researchTier ?? "unrated"}): ${p.subtitle}`
    ),
    "",
    "## Library: guides and comparisons",
    ...[...BEST_FOR, ...COMPARISONS].map(
      (a) => `- [${a.title}](${SITE_URL}/library/learn/${a.slug}): ${a.description}`
    ),
    "",
    "## Tools: reconstitution calculators",
    `- [Reconstitution calculator](${SITE_URL}/tools): converts vial strength, bacteriostatic water, and target dose into insulin-syringe units. Free, no account.`,
    `- [Bacteriostatic water](${SITE_URL}/tools/bacteriostatic-water): what bacteriostatic water is (sterile water with 0.9% benzyl alcohol), how it differs from preservative-free sterile water, the 28-day multi-dose window after first puncture, and label storage conditions. Sourced to the FDA label and CDC injection-safety guidance.`,
    "Per-compound versions open pre-filled with that compound's catalog vial size, water volume, and reported dose. Compounds given orally or topically, and those dosed in international units rather than by mass, have no calculator page.",
    ...CALCULATOR_PRESETS.map(
      (c) =>
        `- [${c.peptide.name} reconstitution calculator](${SITE_URL}/tools/${c.slug}): units per syringe for a ${c.vialMg} mg ${c.peptide.name} vial.`
    ),
    "",
    "## Blog articles",
    ...BLOG_POSTS.map((p) => `- [${p.title}](${SITE_URL}${p.href}): ${p.excerpt}`),
    "",
    "## Content policy",
    "Educational only, not medical advice. Quantitative claims are cited to primary sources. REGEN does not prescribe, diagnose, or recommend dosing.",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
