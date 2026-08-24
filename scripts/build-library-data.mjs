/**
 * Generates the site's library dataset from the app catalog.
 *
 * Source of truth is regen-app/data/catalogs/library/peptides.json (the same
 * file that feeds the iOS Library tab). The site needs a public, citation-safe
 * slice of it, so this strips three things the app carries but the web must not:
 *
 *   1. `buyCard`  - affiliate offers. The library is positioned as an
 *      independent reference; a "code REGEN for 40% off" block on the same
 *      page contradicts that and is an E-E-A-T liability.
 *   2. `aiCard`   - in-app prompt affordances, meaningless on the web.
 *   3. Third-party images + competitor article sources. Every chapter image in
 *      the catalog is HOTLINKED from peptidepedia.org/peptpedia.org, and ~69
 *      sources point at competitor content sites. Research citations
 *      (PubMed, PMC, FDA, NEJM, ScienceDirect) are kept, they are the ones
 *      that carry authority.
 *
 * Re-run after any catalog change:  node scripts/build-library-data.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOG =
  process.env.CATALOG_PATH ??
  resolve(HERE, "../../regen-app/data/catalogs/library/peptides.json");
const OUT = resolve(HERE, "../src/app/lib/data/library-peptides.json");

/** Citation hosts we are willing to point at. Everything else is dropped. */
const ALLOWED_SOURCE_HOSTS = [
  "pubmed.ncbi.nlm.nih.gov",
  "pmc.ncbi.nlm.nih.gov",
  "www.ncbi.nlm.nih.gov",
  "ncbi.nlm.nih.gov",
  "pubchem.ncbi.nlm.nih.gov",
  "clinicaltrials.gov",
  "www.clinicaltrials.gov",
  "www.fda.gov",
  "fda.gov",
  "www.accessdata.fda.gov",
  "accessdata.fda.gov",
  "www.nejm.org",
  "www.sciencedirect.com",
  "www.nature.com",
  "jamanetwork.com",
  "www.thelancet.com",
  "doi.org",
  "www.who.int",
  "www.ema.europa.eu",
];

/**
 * App section labels -> the six public browse categories. The app uses eleven
 * finer-grained labels; the web collapses them, because a category page needs
 * enough compounds on it to be worth crawling.
 */
const CATEGORY_BY_SECTION = {
  "fat loss & metabolism": "weight-loss",
  "recovery & healing": "recovery",
  "recovery & wellness": "recovery",
  "growth & GH": "performance",
  "growth & hormones": "performance",
  "growth & performance": "performance",
  "sexual health": "performance",
  "longevity & healthspan": "longevity",
  "longevity & brain": "longevity",
  "skin & aesthetics": "aesthetics",
  "focus & cognition": "cognitive",
};

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

/** ~200 words per minute over every rendered body string in a chapter set. */
function readMinutes(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const raw = JSON.parse(readFileSync(CATALOG, "utf8"));

const peptides = raw.map((p) => {
  const category = CATEGORY_BY_SECTION[p.sectionLabel];
  if (!category) throw new Error(`Unmapped sectionLabel "${p.sectionLabel}" on ${p.slug}`);

  const chapters = (p.chapters ?? []).map((ch) => ({
    key: ch.key,
    title: ch.title,
    sections: (ch.sections ?? []).map((s) => ({
      subheader: s.subheader,
      body: s.body,
      // Caption survives, the hotlinked URL does not.
      caption: s.image?.caption ?? null,
    })),
  }));

  const sources = (p.sources ?? []).filter((s) =>
    ALLOWED_SOURCE_HOSTS.includes(hostOf(s.url ?? ""))
  );

  const allText = chapters
    .flatMap((c) => c.sections.map((s) => `${s.subheader} ${s.body}`))
    .join(" ");

  return {
    slug: p.slug,
    name: p.name,
    category,
    sectionLabel: p.sectionLabel,
    // The app's SF Symbol name for this section. The web maps it to an inline
    // SVG in `library/CategoryIcon.tsx` so a compound wears the same mark in
    // both places.
    sectionIcon: p.sectionIcon ?? null,
    topics: p.topics ?? [],
    subtitle: p.subtitle ?? "",
    description: p.description ?? "",
    researchTier: p.researchTier ?? null,
    isFeatured: Boolean(p.isFeatured),
    standardDose: p.standardDose ?? null,
    doseCard: p.doseCard ?? null,
    reconstitution: p.reconstitution ?? null,
    halfLife: p.halfLife ?? null,
    route: p.route ?? [],
    commonStacks: p.commonStacks ?? [],
    contraindications: p.contraindications ?? [],
    quickFacts: p.quickFacts?.items ?? [],
    evidenceSummary: p.evidenceSummary ?? [],
    evidenceClaims: p.evidenceClaims ?? [],
    researchHeadlines: p.researchHeadlines ?? [],
    trials: p.trials ?? [],
    sources,
    chapters,
    readMinutes: readMinutes(allText),
    publishedAt: p.publishedAt ?? null,
    updatedAt: p.updatedAt ?? null,
  };
});

writeFileSync(OUT, JSON.stringify(peptides, null, 1));

const dropped = raw.reduce((n, p) => n + (p.sources?.length ?? 0), 0) -
  peptides.reduce((n, p) => n + p.sources.length, 0);
console.log(
  `wrote ${peptides.length} peptides -> ${OUT}\n` +
    `  chapters: ${peptides.reduce((n, p) => n + p.chapters.length, 0)}\n` +
    `  sources kept: ${peptides.reduce((n, p) => n + p.sources.length, 0)} (dropped ${dropped})`
);
