#!/usr/bin/env node
/**
 * validate-guides.mjs: check guide files against the anatomy, the voice
 * rules, the live web (every source must resolve), and the originality bar
 * (no 8-word run lifted from the reference page). Writes the file back with
 * `verified` set on each source.
 *
 *   node scripts/validate-guides.mjs bpc-157 semaglutide [--no-bundle]
 *   node scripts/validate-guides.mjs --all [--no-fetch]
 *
 * Reference pages are looked up in $REGEN_REF_DIR/<slug>.html when set.
 * Exit 1 if any guide fails; the message says what to fix.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { GUIDES_DIR, ROOT, GuideError, checkOriginality, readSeed, validate, verifySource } from "./guide-lib.mjs";

const args = process.argv.slice(2);
const ALL = args.includes("--all");
const NO_FETCH = args.includes("--no-fetch");
const NO_BUNDLE = args.includes("--no-bundle");
const REF = process.env.REGEN_REF_DIR;
const slugs = ALL
  ? fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))
  : args.filter((a) => !a.startsWith("--"));
if (!slugs.length) {
  console.error("usage: validate-guides.mjs <slug...> | --all [--no-fetch] [--no-bundle]");
  process.exit(1);
}

const seed = readSeed();
const seedSlugs = seed.map((s) => s.slug);
const seedBySlug = new Map(seed.map((s) => [s.slug, s]));
let failed = 0;

for (const slug of slugs) {
  const file = path.join(GUIDES_DIR, `${slug}.json`);
  try {
    if (!fs.existsSync(file)) throw new GuideError(`no file at ${path.relative(ROOT, file)}`);
    let g;
    try {
      g = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      throw new GuideError(`invalid JSON: ${e.message}`);
    }
    g = validate(g, slug, seedSlugs);
    const copied = checkOriginality(g, REF ? path.join(REF, `${slug}.html`) : null);
    let sources = g.sources;
    if (!NO_FETCH) {
      sources = [];
      for (const s of g.sources) sources.push(await verifySource(s));
      const dead = sources.filter((s) => !s.verified);
      if (dead.length) {
        throw new GuideError(
          `${dead.length} source(s) did not resolve: ${dead.map((s) => `[${s.id}] ${s.doi ?? s.url ?? s.pmid}`).join("; ")}. Fix the DOI/URL or replace the source with one that exists.`
        );
      }
    }
    const today = new Date().toISOString().slice(0, 10);
    const out = {
      ...g,
      catalogSlug: seedBySlug.get(slug)?.catalogSlug ?? g.catalogSlug ?? undefined,
      sources,
      published: g.published ?? today,
      updated: today,
    };
    fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
    const words = g.sections.flatMap((s) => s.blocks).filter((b) => b.type === "p").reduce((n, b) => n + b.text.split(/\s+/).length, 0);
    console.log(`${slug}: ok (${g.sections.length} sections, ${words} words, ${sources.length} sources${NO_FETCH ? "" : " live"}, ${copied} shared 8-grams, ${g.status}, ${g.evidence})`);
  } catch (e) {
    failed++;
    console.error(`${slug}: FAIL ${e.message}`);
  }
}

if (!NO_BUNDLE) execFileSync(process.execPath, [path.join(ROOT, "scripts/bundle-guides.mjs")], { stdio: "inherit" });
process.exit(failed ? 1 : 0);
