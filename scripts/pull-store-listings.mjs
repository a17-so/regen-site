/**
 * Store listings for vendors whose catalog the product puller could not
 * read (sign-in walls, JS-only storefronts, bot challenges).
 *
 * Some of those stores publish their own product list in /llms.txt, in
 * the form "- Name (Also known as: ...) - From $X USD: https://.../product".
 * That is the store's own published listing, so it is carried as-is: a
 * name, a starting price, the product link. No sizes, no per mg (the
 * listing does not state them), and the shop's cleaning rules still apply:
 * sprays, mists, water and blends are dropped from a single compound.
 *
 * Run:  node scripts/pull-store-listings.mjs
 * Writes src/app/lib/data/shop-listings.json  { [vendorSlug]: { source, fetchedAt, items: [...] } }
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const DATA = path.join(ROOT, "src/app/lib/data");
const vendors = JSON.parse(fs.readFileSync(path.join(DATA, "shop-vendors.json"), "utf8"));
const offers = JSON.parse(fs.readFileSync(path.join(DATA, "shop-offers.json"), "utf8"));
const compounds = JSON.parse(fs.readFileSync(path.join(DATA, "shop-compounds.json"), "utf8"));
const seed = JSON.parse(fs.readFileSync(path.join(DATA, "guide-seed.json"), "utf8"));

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const withOffers = new Set(offers.map((o) => o.vendorSlug));
const norm = (s) => s.toLowerCase().replace(/\(.*?\)/g, " ").replace(/[^a-z0-9]+/g, "");
const NON_VIAL = /mist|spray|nasal|capsule|cream|serum|topical|h2o|water|syringe|kit\b/i;
const BLEND = /\/|\+|blend|stack|glow|klow|wolverine|triple/i;

// name -> shop compound slug, through the compound names and the seed's aliases.
const byKey = new Map();
for (const c of compounds) byKey.set(norm(c.name), c.slug);
const seedRows = Array.isArray(seed) ? seed : seed.rows ?? Object.values(seed);
for (const r of seedRows) {
  const slug = compounds.find((c) => c.guideSlug === r.slug)?.slug;
  if (!slug) continue;
  for (const n of [r.name, ...(r.aliases ?? []), ...(typeof r.alsoCalled === "string" ? r.alsoCalled.split(/,\s*/) : [])]) if (n) byKey.set(norm(n), slug);
}
// Store spellings and code names the alias set does not carry. "GLP-1 (SM)"
// and "GLP-2 (TR)" are the grey market's shorthand for semaglutide and
// tirzepatide (the same convention as "GLP-3 (RT)", which the store itself
// glosses as LY3437943, retatrutide). Confirmed 2026-11-10 from Amino Club's
// own COA page (/us/coa): the lots are SEM0002 (GLP-1) and TRZ0003/TRZ0004
// (GLP-2).
const STORE_NAMES = { "tesamorlin": "tesamorelin", "kisspeptin": "kisspeptin-10", "glp-1 (sm)": "semaglutide", "glp-2 (tr)": "tirzepatide" };
const shopSlugs = new Set(compounds.map((c) => c.slug));
const match = (name, aka) => {
  const fixed = STORE_NAMES[name.toLowerCase()];
  if (fixed && shopSlugs.has(fixed)) return fixed;
  for (const n of [name, ...aka]) {
    const hit = byKey.get(norm(n));
    if (hit) return hit;
  }
  return null;
};

const LINE = /^-\s+(.+?)\s+-\s+From\s+\$([\d,.]+)\s+USD:\s+(https?:\/\/\S+)/;

const out = {};
for (const v of vendors) {
  if (withOffers.has(v.slug)) continue;
  const base = (v.url ?? (v.domain ? `https://${v.domain}` : "")).replace(/^(https?:\/\/[^/]+).*$/, "$1");
  if (!base) continue;
  let text = "";
  try {
    const res = await fetch(`${base}/llms.txt`, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (res.ok && /text\/plain|markdown/.test(res.headers.get("content-type") ?? "")) text = await res.text();
  } catch {
    // unreachable: nothing to carry
  }
  const items = [];
  for (const raw of text.split("\n")) {
    const m = raw.trim().match(LINE);
    if (!m) continue;
    const full = m[1];
    const name = full.replace(/\s*\(Also known as:.*\)$/i, "").trim();
    const aka = (full.match(/\(Also known as:\s*(.*)\)$/i)?.[1] ?? "").split(/,\s*/).filter((a) => a && !/^CAS:/i.test(a));
    if (NON_VIAL.test(name) || BLEND.test(name)) continue;
    const priceUsd = Number(m[2].replace(/,/g, ""));
    if (!Number.isFinite(priceUsd) || priceUsd <= 0) continue;
    items.push({ name, fromUsd: priceUsd, url: m[3], compoundSlug: match(name, aka) });
  }
  if (items.length >= 5) {
    items.sort((a, b) => a.name.localeCompare(b.name));
    out[v.slug] = { source: `${base}/llms.txt`, fetchedAt: new Date().toISOString().slice(0, 10), items };
    console.log(`${v.slug}: ${items.length} listed, ${items.filter((i) => i.compoundSlug).length} matched to a compound`);
  }
}
fs.writeFileSync(path.join(DATA, "shop-listings.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`wrote shop-listings.json for ${Object.keys(out).length} vendor(s)`);
