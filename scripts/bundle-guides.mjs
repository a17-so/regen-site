#!/usr/bin/env node
/**
 * bundle-guides.mjs: fold `src/app/lib/data/guides/*.json` into the two
 * files the site imports statically:
 *
 *   data/guides.json       every guide, as written by the generator
 *   data/guide-index.json  one row per compound in the seed, with `hasGuide`
 *
 * Run after the generator, and after any manual regeneration. Never edit the
 * outputs by hand; they are overwritten.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const DATA = path.join(ROOT, "src/app/lib/data");
const DIR = path.join(DATA, "guides");
const SEED = path.join(DATA, "guide-seed.json");

const seed = fs.existsSync(SEED) ? JSON.parse(fs.readFileSync(SEED, "utf8")) : [];
const guides = [];
if (fs.existsSync(DIR)) {
  for (const f of fs.readdirSync(DIR).sort()) {
    if (!f.endsWith(".json")) continue;
    const g = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
    if (g.slug !== f.replace(/\.json$/, "")) {
      console.warn(`skip ${f}: slug "${g.slug}" does not match the filename`);
      continue;
    }
    guides.push(g);
  }
}

const bySlug = new Map(guides.map((g) => [g.slug, g]));
const known = new Set([...seed.map((s) => s.slug), ...bySlug.keys()]);

// A guide may name relatives that have no page yet; keep only live links.
for (const g of guides) {
  if (Array.isArray(g.alsoInLibrary)) {
    g.alsoInLibrary = g.alsoInLibrary.filter((s) => s !== g.slug && bySlug.has(s));
  }
}

const index = [];
for (const s of seed) {
  const g = bySlug.get(s.slug);
  const category = g?.category ?? s.category;
  const status = g?.status ?? s.status;
  if (!category || !status) continue; // nothing to show until the generator decides
  // A guide may correct the reference (a PCSK9 drug filed under Heart, a
  // trial that ended). Allowed, but never silent.
  if (g && s.category && g.category !== s.category) console.warn(`override ${s.slug}: category ${s.category} -> ${g.category}`);
  if (g && s.status && g.status !== s.status) console.warn(`override ${s.slug}: status ${s.status} -> ${g.status}`);
  index.push({
    slug: s.slug,
    name: g?.name ?? s.name,
    category,
    status,
    catalogSlug: s.catalogSlug ?? g?.catalogSlug ?? undefined,
    hasGuide: Boolean(g),
  });
}
for (const g of guides) {
  if (!seed.some((s) => s.slug === g.slug)) {
    index.push({ slug: g.slug, name: g.name, category: g.category, status: g.status, catalogSlug: g.catalogSlug, hasGuide: true });
  }
}
index.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(path.join(DATA, "guides.json"), JSON.stringify(guides) + "\n");
fs.writeFileSync(path.join(DATA, "guide-index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(`bundled ${guides.length} guides; index has ${index.length} rows (${index.filter((r) => r.hasGuide).length} with a guide)`);
