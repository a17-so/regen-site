#!/usr/bin/env node
/**
 * build-guide-seed.mjs: the list of compounds the Peptide Library covers.
 *
 * Merges two inputs into `src/app/lib/data/guide-seed.json`:
 *
 *   1. The reference index (Superpower's 152 compounds with their body-system
 *      category, status and "also called" line), crawled into
 *      `<scratch>/refs/superpower-index.json`. Only the FACTUAL layer is
 *      taken (which compounds, which category, regulatory status); every
 *      sentence on our pages is written fresh by the generator.
 *   2. Our own catalog (`src/app/lib/data/library-peptides.json`, the 54 the
 *      app tracks and the shop sells). Catalog compounds that match a
 *      reference slug are joined (`catalogSlug`); the rest are added with the
 *      category left for the generator to decide.
 *
 * Usage: node scripts/build-guide-seed.mjs <path-to-superpower-index.json>
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const OUT = path.join(ROOT, "src/app/lib/data/guide-seed.json");
const CATALOG = path.join(ROOT, "src/app/lib/data/library-peptides.json");

const refPath = process.argv[2];
if (!refPath) {
  console.error("usage: build-guide-seed.mjs <superpower-index.json>");
  process.exit(1);
}

const CAT = {
  "Brain & sleep": "brain",
  "Skin & aging": "skin",
  "Digestive & weight": "digestive",
  "Immune & defense": "immune",
  "Hormones & metabolism": "hormones",
  "Bones & muscles": "bones",
  "Heart & blood": "heart",
  "Sexual & reproductive": "sexual",
};
const STATUS = {
  "FDA-approved": "fda-approved",
  "In clinical trials": "in-trials",
  "Not FDA-approved": "not-approved",
  "Cosmetic and topical": "cosmetic",
};

// Catalog slug -> reference slug where the names differ.
const ALIASES = {
  hcg: "human-chorionic-gonadotropin",
  "mk-677": "mk-677-ibutamoren",
  "ss-31": "elamipretide",
  "melanotan-2": "melanotan-ii",
  "melanotan-ii": "melanotan-ii",
  "melanotan-1": "melanotan-i",
  epithalon: "epitalon",
  "igf-1-lr3": "igf-1-lr3",
  "igf1-lr3": "igf-1-lr3",
  "thymosin-beta-4": "thymosin-beta-4",
  "tb-500": "tb-500",
  "hgh-fragment-176-191": "fragment-176-191",
  "aod9604": "aod-9604",
  "cjc-1295-dac": "cjc-1295",
  "cjc-1295-no-dac": "cjc-1295",
  "cjc1295": "cjc-1295",
  "pt141": "pt-141",
  "bremelanotide": "pt-141",
  "5-amino-1mq": "5-amino-1mq",
  "nnz-2591": "nnz-2591",
  "mots-c": "mots-c",
  "ghk-cu": "ghk-cu",
  "kisspeptin": "kisspeptin-10",
  "thymosin-alpha-1": "thymosin-alpha-1",
  "ta1": "thymosin-alpha-1",
  "somatropin": "somatropin-rhgh",
  "hgh": "somatropin-rhgh",
  "rhgh": "somatropin-rhgh",
  "pramlintide": "pramlintide",
  "gonadorelin": "compounded-gonadorelin",
  vip: "aviptadil",
  larazotide: "larazotide-acetate",
  "melanotan-i": "melanotan-i",
  // Shop items with no library page of their own: blends render the pages of
  // their components, and the no-DAC variant shares the CJC-1295 page (the
  // reference keeps one entry for both forms).
  "cjc-1295-no-dac": null,
  "bpc-157-tb-500-blend": null,
  "cjc-1295-no-dac-ipamorelin-blend": null,
  "tesamorelin-ipamorelin-blend": null,
  glow: null,
  klow: null,
};

const norm = (s) =>
  String(s)
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const ref = JSON.parse(fs.readFileSync(refPath, "utf8"));
const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
const catalogItems = Array.isArray(catalog) ? catalog : catalog.peptides ?? [];

const seed = new Map();
const problems = [];

for (const [slug, r] of Object.entries(ref)) {
  if (r.error) {
    problems.push(`reference ${slug}: ${r.error}`);
    continue;
  }
  const category = CAT[r.category];
  const status = STATUS[r.status];
  if (!category || !status) {
    problems.push(`reference ${slug}: category=${r.category} status=${r.status}`);
  }
  seed.set(slug, {
    slug,
    name: r.name || slug,
    category: category ?? null,
    status: status ?? null,
    alsoCalled: r.alsoCalled || undefined,
    referenceClass: r.class || undefined,
    referenceEvidence: r.evidence || undefined,
    catalogSlug: undefined,
  });
}

// Join the catalog.
const refByNorm = new Map([...seed.values()].map((s) => [norm(s.name), s.slug]));
for (const p of catalogItems) {
  let target;
  if (p.slug in ALIASES) target = ALIASES[p.slug];
  else if (seed.has(p.slug)) target = p.slug;
  else if (refByNorm.has(norm(p.name))) target = refByNorm.get(norm(p.name));
  else if (refByNorm.has(norm(p.abbreviation ?? ""))) target = refByNorm.get(norm(p.abbreviation));

  if (target === null) continue; // deliberately excluded
  if (target && seed.has(target)) {
    seed.get(target).catalogSlug = p.slug;
    continue;
  }
  // Catalog-only compound: the generator decides the category and status.
  seed.set(p.slug, {
    slug: p.slug,
    name: p.name,
    category: null,
    status: null,
    alsoCalled: undefined,
    catalogSlug: p.slug,
    catalogOnly: true,
  });
}

const rows = [...seed.values()].sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(OUT, JSON.stringify(rows, null, 2) + "\n");

const joined = rows.filter((r) => r.catalogSlug && !r.catalogOnly).length;
const only = rows.filter((r) => r.catalogOnly);
console.log(`seed: ${rows.length} compounds (${Object.keys(ref).length} reference, ${joined} joined to the catalog, ${only.length} catalog-only)`);
if (only.length) console.log("catalog-only:", only.map((r) => r.slug).join(", "));
if (problems.length) console.log("problems:\n  " + problems.join("\n  "));
