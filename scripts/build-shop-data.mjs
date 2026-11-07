#!/usr/bin/env node
/**
 * build-shop-data.mjs: the Shop's data, generated from the app repo.
 *
 * Reads, from regen-app/data/catalogs/library:
 *   vendors.json                       42 researched vendors (trust facts)
 *   vendor-research/products/*.json    live product catalogs per vendor
 *   vendor-research/products/_summary.json
 * plus this repo's guide seed and catalog for compound names, and writes:
 *   src/app/lib/data/shop-vendors.json   one row per vendor, public fields only
 *   src/app/lib/data/shop-offers.json    one row per (compound, vendor product)
 *   src/app/lib/data/shop-compounds.json one row per compound with >= 1 offer
 *
 * Never hand-edit the outputs. Re-run after a product pull or a vendor
 * research update. Vendor tiers and scores are read for ORDERING only; the
 * site shows rank order and trust facts, never a grade.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const APP = process.env.REGEN_APP ?? path.resolve(ROOT, "../regen-app");
const LIB = path.join(APP, "data/catalogs/library");
const PRODUCTS = path.join(LIB, "vendor-research/products");
const OUT = path.join(ROOT, "src/app/lib/data");

const vendors = JSON.parse(fs.readFileSync(path.join(LIB, "vendors.json"), "utf8"));
const seed = JSON.parse(fs.readFileSync(path.join(OUT, "guide-seed.json"), "utf8"));
const catalogRaw = JSON.parse(fs.readFileSync(path.join(OUT, "library-peptides.json"), "utf8"));
const catalog = Array.isArray(catalogRaw) ? catalogRaw : catalogRaw.peptides ?? [];

/* ---- Vendors ------------------------------------------------------------- */

const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k] ?? null]));

const shopVendors = vendors
  .map((v) => ({
    ...pick(v, [
      "slug",
      "name",
      "domain",
      "url",
      "code",
      "country",
      "location",
      "logoUrl",
      "tagline",
      "summary",
      "differentiator",
      "standoutPro",
      "standoutCon",
      "verdict",
      "labs",
      "testingScope",
      "coaArchive",
      "coaCount",
      "coaAvgPurity",
      "independentlyTested",
      "contaminantTrifecta",
      "legalEntity",
      "founderNamed",
      "strengthTags",
      "watchoutTags",
      "trustpilotCount",
      "trustpilotAverage",
      "skuCount",
      "domainAgeMonths",
      "researchStatus",
      "verification",
      "xHandle",
    ]),
    // Ordering only. Rank is the research pipeline's cross-vendor position.
    rank: v.rank ?? 999,
    score: v.scoreOverall ?? null,
    coaExamples: (v.coaExamples ?? []).map((c) =>
      pick(c, ["productName", "batchNumber", "labName", "testMethod", "purityPercent", "netContentMg", "vialsTested", "testDate", "coaPdf"])
    ),
    incidents: (v.incidents ?? []).map((i) => (typeof i === "string" ? { text: i } : pick(i, ["date", "text", "summary", "source"]))),
  }))
  .sort((a, b) => a.rank - b.rank);

/* ---- Compound names -------------------------------------------------------- */

const names = new Map();
for (const p of catalog) names.set(p.slug, p.name);
for (const s of seed) names.set(s.slug, s.name);
const titleCase = (s) =>
  s
    .replace(/^blend:/, "")
    .split("-")
    .map((w) => (w.length <= 3 && /^[a-z0-9]+$/.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

/* ---- Offers ---------------------------------------------------------------- */

// The HTML parsers name a product after the first compound they recognise, so
// a "BPC-157 + TB-500 + KPV" blend arrived as a BPC-157 vial. A product is not
// listed under a single compound when its name or URL handle names a second
// compound, says "blend", or is not a vial at all (capsules, topical, nasal).
const COMPOUND_TOKENS = [...names.keys()]
  .filter((s) => !s.startsWith("blend") && !s.startsWith("essentials") && s.length >= 3)
  .map((s) => s.replace(/-blend$/, ""));
const NON_VIAL = /\b(capsule|capsules|tablet|tablets|topical|cream|serum|nasal|spray|lotion|gel|patch|oral)\b/i;
function looksLikeBlendOrForm(slug, p) {
  const hay = `${p.name ?? ""} ${(p.url ?? "").split("/").filter(Boolean).pop() ?? ""}`.toLowerCase().replace(/[^a-z0-9+ ]+/g, " ");
  if (NON_VIAL.test(hay)) return "form";
  if (/\bblend\b|\bstack\b|\bcombo\b|\+/.test(hay)) return "blend";
  const self = slug.toLowerCase();
  let others = 0;
  for (const t of COMPOUND_TOKENS) {
    if (t === self || self.startsWith(t) || t.startsWith(self)) continue;
    const token = t.replace(/-/g, " ");
    if (token.length >= 4 && hay.includes(token)) others++;
  }
  return others >= 1 ? "blend" : null;
}

const offers = [];
const platforms = {};
let dropped = { blend: 0, form: 0 };
for (const f of fs.readdirSync(PRODUCTS)) {
  if (!f.endsWith(".json") || f.startsWith("_")) continue;
  const d = JSON.parse(fs.readFileSync(path.join(PRODUCTS, f), "utf8"));
  platforms[d.vendorSlug] = d.platform;
  for (const p of d.products ?? []) {
    if (!p.compoundSlug) continue;
    if (!p.compoundSlug.startsWith("blend:") && !p.compoundSlug.startsWith("essentials")) {
      const why = looksLikeBlendOrForm(p.compoundSlug, p);
      if (why) {
        dropped[why]++;
        continue;
      }
    }
    const variants = (p.variants ?? [])
      .filter((v) => typeof v.priceUsd === "number" && v.priceUsd > 0)
      .map((v) => ({
        label: v.label ?? null,
        sizeMg: typeof v.sizeMg === "number" ? v.sizeMg : null,
        quantity: v.quantity ?? 1,
        priceUsd: v.priceUsd,
        available: v.available ?? null,
      }));
    if (!variants.length) continue;
    // Several variants of the same size all claiming one vial at different
    // prices are pack sizes the store API did not label (1, 2, 5, 10 kits).
    // The cheapest is the single vial; the rest are packs of unknown count,
    // and a pack with no count gets no price per mg rather than a wrong one.
    const groups = new Map();
    for (const v of variants) {
      if (v.quantity !== 1) continue;
      const k = String(v.sizeMg);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(v);
    }
    for (const g of groups.values()) {
      if (g.length < 2) continue;
      g.sort((a, b) => a.priceUsd - b.priceUsd);
      for (const v of g.slice(1)) v.quantity = null;
    }
    offers.push({
      compoundSlug: p.compoundSlug,
      vendorSlug: d.vendorSlug,
      productName: p.name,
      productUrl: p.url,
      currency: /aud/i.test(d.notes ?? "") ? "AUD" : "USD",
      fetchedAt: d.fetchedAt ?? null,
      variants,
    });
  }
}

/* ---- Compounds ----------------------------------------------------------------- */

const byCompound = new Map();
for (const o of offers) {
  if (!byCompound.has(o.compoundSlug)) byCompound.set(o.compoundSlug, []);
  byCompound.get(o.compoundSlug).push(o);
}
const guideSlugs = new Set(seed.map((s) => s.slug));
const catalogToGuide = new Map(seed.filter((s) => s.catalogSlug).map((s) => [s.catalogSlug, s.slug]));

const compounds = [...byCompound.entries()]
  .map(([slug, list]) => {
    const vendorsFor = new Set(list.map((o) => o.vendorSlug));
    const sizes = new Set();
    let minPerMg = null;
    for (const o of list) {
      if (o.currency !== "USD") continue;
      for (const v of o.variants) {
        if (v.sizeMg) sizes.add(v.sizeMg);
        if (v.sizeMg && typeof v.quantity === "number" && v.quantity > 0) {
          const perMg = v.priceUsd / (v.sizeMg * v.quantity);
          if (minPerMg === null || perMg < minPerMg) minPerMg = perMg;
        }
      }
    }
    const isBlend = slug.startsWith("blend:") || /-blend$/.test(slug) || ["glow", "klow"].includes(slug);
    const isEssential = slug.startsWith("essentials-");
    return {
      slug: slug.replace(/^blend:/, "blend-"),
      sourceSlug: slug,
      name: names.get(slug) ?? titleCase(slug),
      kind: isEssential ? "essential" : isBlend ? "blend" : "compound",
      vendorCount: vendorsFor.size,
      variantCount: sizes.size,
      sizesMg: [...sizes].sort((a, b) => a - b),
      minUsdPerMg: minPerMg === null ? null : Math.round(minPerMg * 100) / 100,
      guideSlug: guideSlugs.has(slug) ? slug : catalogToGuide.get(slug) ?? null,
    };
  })
  .sort((a, b) => b.vendorCount - a.vendorCount || a.name.localeCompare(b.name));

for (const o of offers) o.compoundSlug = o.compoundSlug.replace(/^blend:/, "blend-");

/* ---- COA archive ------------------------------------------------------------------ */

// Every published certificate the research pipeline recorded, as one table.
// The compound is matched by the longest compound name that appears in the
// certificate's product name, so "GLOW 70mg (GHK-Cu 50 / BPC-157 10 / TB-500
// 10)" lands on GLOW rather than on GHK-Cu.
const normName = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const nameIndex = [...names.entries()]
  .map(([slug, name]) => ({ slug: slug.replace(/^blend:/, "blend-"), key: normName(name) }))
  .filter((x) => x.key.length >= 3)
  .sort((a, b) => b.key.length - a.key.length);
function compoundForProduct(productName) {
  const hay = ` ${normName(productName)} `;
  for (const { slug, key } of nameIndex) if (hay.includes(` ${key} `) || hay.startsWith(`${key} `)) return slug;
  return null;
}
const coas = [];
for (const v of shopVendors) {
  for (const c of v.coaExamples) {
    if (!c.productName && !c.batchNumber) continue;
    coas.push({
      vendorSlug: v.slug,
      vendorName: v.name,
      productName: c.productName,
      compoundSlug: c.productName ? compoundForProduct(c.productName) : null,
      batch: c.batchNumber,
      lab: c.labName,
      method: c.testMethod,
      purity: c.purityPercent,
      netContentMg: c.netContentMg,
      vialsTested: c.vialsTested,
      date: c.testDate,
      pdf: c.coaPdf,
    });
  }
}
coas.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));

/* ---- Labs -------------------------------------------------------------------- */

const labMap = new Map();
for (const v of shopVendors) {
  for (const raw of v.labs ?? []) {
    const name = String(raw).replace(/\s*\(.*?\)\s*/g, "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (!labMap.has(key)) labMap.set(key, { name, detail: /\(/.test(raw) ? raw.match(/\((.*?)\)/)?.[1] ?? null : null, vendors: [] });
    const lab = labMap.get(key);
    if (!lab.vendors.includes(v.slug)) lab.vendors.push(v.slug);
  }
}
const labs = [...labMap.values()]
  .map((l) => ({ ...l, coaCount: coas.filter((c) => c.lab && c.lab.toLowerCase().includes(l.name.toLowerCase().split(" ")[0])).length }))
  .sort((a, b) => b.vendors.length - a.vendors.length || a.name.localeCompare(b.name));

fs.writeFileSync(path.join(OUT, "shop-coas.json"), JSON.stringify(coas, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "shop-labs.json"), JSON.stringify(labs, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "shop-vendors.json"), JSON.stringify(shopVendors, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "shop-offers.json"), JSON.stringify(offers) + "\n");
fs.writeFileSync(path.join(OUT, "shop-compounds.json"), JSON.stringify(compounds, null, 2) + "\n");

const live = Object.values(platforms).filter((p) => p && p !== "blocked" && p !== "unreachable").length;
console.log(`vendors: ${shopVendors.length} (${live} with a live catalog) · offers: ${offers.length} · compounds: ${compounds.length} · COAs: ${coas.length} · labs: ${labs.length} · dropped ${dropped.blend} blend-named and ${dropped.form} non-vial products from single-compound rows`);
console.log("top compounds:", compounds.slice(0, 8).map((c) => `${c.name} (${c.vendorCount})`).join(", "));
