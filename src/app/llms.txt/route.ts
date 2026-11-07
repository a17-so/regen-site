import { BLOG_POSTS } from "../lib/blogData";
import { CATEGORIES, allGuides, categoryHref, guideHref, statusLabel } from "../lib/guides";
import { BEST_FOR, COMPARISONS } from "../lib/libraryLearn";
import { SHOP_COAS, SHOP_COMPOUNDS, SHOP_VENDORS, shopHref, trustLine, vendorHref, vendorsWithOffers } from "../lib/shop";
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
    `- [Peptide Library](${SITE_URL}/library): ${allGuides().length} peptides, from approved drugs to compounds still in trials, sorted by body system. Each page: what it is, how it works, FDA status, what the research shows, cited to primary sources`,
    `- [Science](${SITE_URL}/blog): educational articles on biomarkers, peptides, and protocols`,
    `- [FAQs](${SITE_URL}/faq): how REGEN schedules doses, tracks vials and biomarkers`,
    "",
    "## Library: peptide reference",
    "Every compound carries a regulatory status (FDA-approved, In clinical trials, Not FDA-approved, Cosmetic and topical) and an evidence rating of the HUMAN research (FDA approved, Deep, Moderate, Limited, Low). The rating describes how well a compound has been measured in people, not how well it works, so a popular compound with only animal data rates Low. Pages report what studies used; they never recommend or dose.",
    "",
    ...CATEGORIES.map((c) => `- [${c.label}](${SITE_URL}${categoryHref(c.slug)}): ${c.blurb}`),
    "",
    ...allGuides().map(
      (g) => `- [${g.name}](${SITE_URL}${guideHref(g.slug)}) (${statusLabel(g.status)}; ${g.evidence}): ${g.summary}`
    ),
    "",
    "## Library: guides and comparisons",
    ...[...BEST_FOR, ...COMPARISONS].map(
      (a) => `- [${a.title}](${SITE_URL}/library/learn/${a.slug}): ${a.description}`
    ),
    "",
    "## Shop: vendor comparison",
    `REGEN is an affiliate aggregator, not a seller. ${SITE_URL}/shop lists ${SHOP_COMPOUNDS.length} compounds; each compound page shows every researched vendor that stocks it (${vendorsWithOffers().length} of ${SHOP_VENDORS.length} vendors have readable catalogs), with live pack prices, price per mg, the latest published COA, average purity, and a discount code where one exists. Vendors are ranked on third-party testing, public COA archives, operator disclosure, and reviews; the site shows rank order, never a grade.`,
    `- [Vendors, ranked](${SITE_URL}/shop/vendors)`,
    `- [COA archive](${SITE_URL}/shop/coas): ${SHOP_COAS.length} published certificates with batch, lab, purity, and PDF`,
    `- [Verify a batch](${SITE_URL}/shop/verify)`,
    `- [Testing labs](${SITE_URL}/shop/labs)`,
    ...SHOP_COMPOUNDS.filter((c) => c.kind === "compound")
      .slice(0, 60)
      .map((c) => `- [${c.name} vendors](${SITE_URL}${shopHref(c.slug)}): ${c.vendorCount} vendor${c.vendorCount === 1 ? "" : "s"}${c.minUsdPerMg !== null ? `, from $${c.minUsdPerMg.toFixed(2)} per mg` : ""}`),
    ...SHOP_VENDORS.slice(0, 42).map((v) => `- [${v.name}](${SITE_URL}${vendorHref(v.slug)}): ${trustLine(v) || "testing and COA disclosure not on record"}`),
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
