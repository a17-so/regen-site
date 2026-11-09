/**
 * guide-lib.mjs: vocabulary, validator, citation check, and originality
 * check shared by every way a library guide gets written (the API generator,
 * writer agents, a human). One bar for all of them.
 */
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
export const DATA = path.join(ROOT, "src/app/lib/data");
export const GUIDES_DIR = path.join(DATA, "guides");
export const SEED_PATH = path.join(DATA, "guide-seed.json");

export const CATEGORIES = {
  brain: "Brain & sleep",
  skin: "Skin & aging",
  digestive: "Digestive & weight",
  immune: "Immune & defense",
  hormones: "Hormones & metabolism",
  bones: "Bones & muscles",
  heart: "Heart & blood",
  sexual: "Sexual & reproductive",
};
export const STATUSES = {
  "fda-approved": "FDA-approved",
  "in-trials": "In clinical trials",
  "not-approved": "Not FDA-approved",
  cosmetic: "Cosmetic and topical",
};
export const EVIDENCE = ["FDA approved", "Deep research", "Moderate research", "Limited research", "Low research"];

export function readSeed() {
  return JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
}

export class GuideError extends Error {}
const fail = (msg) => {
  throw new GuideError(msg);
};

const BANNED = [
  [/[–—]/, "an em or en dash (use a comma, a period, parentheses, or 'to' for ranges)"],
  [/\b(we recommend|you should|you must|take \d|your dose|recommended dose|dosing protocol)\b/i, "prescriptive wording"],
  [/\b(breakthrough|revolutionary|game.?changing|miracle|powerful)\b/i, "a hype word"],
  [/&(amp|lt|gt);/, "an HTML entity (write the character)"],
];

function checkText(where, t) {
  for (const [re, what] of BANNED) {
    const m = t.match(re);
    if (m) fail(`${where} contains ${what}: "${m[0]}"`);
  }
}

/** Validates a guide object and returns it with alsoInLibrary filtered. */
export function validate(g, slug, seedSlugs) {
  if (!g || typeof g !== "object") fail("not an object");
  if (g.slug !== slug) fail(`slug is "${g.slug}", expected "${slug}"`);
  if (!g.name) fail("missing name");
  if (!CATEGORIES[g.category]) fail(`bad category "${g.category}" (one of ${Object.keys(CATEGORIES).join(", ")})`);
  if (!STATUSES[g.status]) fail(`bad status "${g.status}" (one of ${Object.keys(STATUSES).join(", ")})`);
  if (!EVIDENCE.includes(g.evidence)) fail(`bad evidence "${g.evidence}" (one of ${EVIDENCE.join(" | ")})`);
  if (g.status === "fda-approved" && g.evidence !== "FDA approved") fail('an fda-approved compound has evidence "FDA approved"');
  if (g.status !== "fda-approved" && g.evidence === "FDA approved") fail('"FDA approved" evidence on a compound that is not fda-approved');
  for (const k of ["class", "evidenceNote", "summary", "keyTakeaway"]) {
    if (typeof g[k] !== "string" || !g[k].trim()) fail(`missing ${k}`);
  }
  if (g.class.split(/\s+/).length > 9) fail("class is longer than 9 words");
  if (g.summary.length > 170) fail(`summary is ${g.summary.length} characters; keep it under 160`);
  const kt = g.keyTakeaway.split(/\s+/).length;
  if (kt < 50 || kt > 130) fail(`keyTakeaway is ${kt} words; write 60 to 110`);
  if (!Array.isArray(g.atGlance) || g.atGlance.length < 4 || g.atGlance.length > 6) fail("atGlance needs 4 to 6 rows");
  for (const r of g.atGlance) if (!r.label || !r.value) fail("atGlance rows need label and value");
  const last = g.atGlance[g.atGlance.length - 1];
  if (last.label !== "Evidence strength" || last.value !== g.evidence) fail('the last atGlance row must be {"label":"Evidence strength","value":<evidence>}');
  if (!/fda status/i.test(g.atGlance[0].label)) fail('the first atGlance row must be "FDA status"');
  if (!Array.isArray(g.sections) || g.sections.length < 4) fail("fewer than 4 sections");
  const headings = g.sections.map((x) => x.heading);
  if (!/^What is /i.test(headings[0])) fail(`the first section must be "What is X?", got "${headings[0]}"`);
  if (!headings.some((h) => /^How does /i.test(h))) fail('missing "How does X work?"');
  if (!headings.some((h) => /FDA-approved\?$/i.test(h))) fail('missing "Is X FDA-approved?"');
  const ids = new Set();
  let words = 0;
  for (const sec of g.sections) {
    if (!sec.id || !sec.heading || !Array.isArray(sec.blocks) || !sec.blocks.length) fail(`section "${sec.heading ?? sec.id}" needs id, heading, blocks`);
    if (!/^[a-z0-9-]+$/.test(sec.id)) fail(`section id "${sec.id}" must be kebab-case`);
    if (ids.has(sec.id)) fail(`duplicate section id ${sec.id}`);
    ids.add(sec.id);
    for (const b of sec.blocks) {
      if (!["p", "ul", "timeline", "table"].includes(b.type)) fail(`bad block type "${b.type}" in ${sec.id}`);
      if (b.type === "p") {
        if (typeof b.text !== "string" || !b.text.trim()) fail(`empty p block in ${sec.id}`);
        words += b.text.split(/\s+/).length;
      }
      if (b.type === "ul" && (!Array.isArray(b.items) || !b.items.length)) fail(`ul block without items in ${sec.id}`);
      if (b.type === "timeline") {
        if (!Array.isArray(b.items) || !b.items.length) fail(`timeline without items in ${sec.id}`);
        for (const it of b.items) if (!it.date || !it.text) fail(`timeline items need date and text in ${sec.id}`);
      }
      if (b.type === "table") {
        if (!Array.isArray(b.columns) || !Array.isArray(b.rows) || !b.rows.length) fail(`table needs columns and rows in ${sec.id}`);
        for (const r of b.rows) if (r.length !== b.columns.length) fail(`table row length mismatch in ${sec.id}`);
      }
    }
  }
  if (words < 450) fail(`body is ${words} words of paragraphs; write at least 600`);
  if (!Array.isArray(g.statusBox) || !g.statusBox.length || !/fda status/i.test(g.statusBox[0].label)) fail('statusBox must start with an "FDA status" row');
  if (!Array.isArray(g.sources) || g.sources.length < 3) fail("fewer than 3 sources");
  const srcIds = new Set();
  for (const src of g.sources) {
    if (!Number.isInteger(src.id) || srcIds.has(src.id)) fail(`bad or duplicate source id ${src.id}`);
    srcIds.add(src.id);
    if (!src.title || !src.publisher) fail(`source ${src.id} needs title and publisher`);
    if (!src.url && !src.doi && !src.pmid) fail(`source ${src.id} needs url, doi, or pmid`);
  }
  const body = JSON.stringify(g.sections);
  const cited = new Set();
  for (const m of body.matchAll(/\[(\d+)\]/g)) {
    const n = Number(m[1]);
    if (!srcIds.has(n)) fail(`citation marker [${n}] has no source`);
    cited.add(n);
  }
  const uncited = [...srcIds].filter((n) => !cited.has(n));
  if (uncited.length) fail(`sources never cited in the body: ${uncited.join(", ")}`);
  for (const k of ["keyTakeaway", "evidenceNote", "summary", "class"]) if (/\[\d+\]/.test(g[k])) fail(`no citation markers in ${k}`);
  if (/\[\d+\]/.test(JSON.stringify(g.atGlance) + JSON.stringify(g.statusBox))) fail("no citation markers in atGlance or statusBox");
  // Voice rules across every string.
  const walk = (v, where) => {
    if (typeof v === "string") checkText(where, v);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${i}]`));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!["url", "doi", "pmid"].includes(k)) walk(x, `${where}.${k}`);
  };
  walk({ ...g, sources: g.sources.map(({ title, publisher }) => ({ title, publisher })) }, "guide");
  if (!Array.isArray(g.alsoInLibrary)) g.alsoInLibrary = [];
  g.alsoInLibrary = g.alsoInLibrary.filter((x) => seedSlugs.includes(x) && x !== g.slug);
  return g;
}

/* ---- Originality ------------------------------------------------------- */

const norm = (t) =>
  t
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

function grams(words, n) {
  const out = new Set();
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(" "));
  return out;
}

/**
 * Fails when the guide reuses runs of 8 or more words from the reference
 * page. Facts are free; sentences are not. Names of trials, drugs and
 * agencies rarely reach 8 words, so the threshold allows them.
 */
export function checkOriginality(g, referenceHtmlPath) {
  if (!referenceHtmlPath || !fs.existsSync(referenceHtmlPath)) return 0;
  const ref = grams(norm(fs.readFileSync(referenceHtmlPath, "utf8")), 8);
  const mine = [g.keyTakeaway, g.evidenceNote, g.summary, ...g.atGlance.map((r) => r.value)];
  for (const s of g.sections) for (const b of s.blocks) {
    if (b.type === "p") mine.push(b.text);
    else if (b.type === "ul") mine.push(...b.items);
    else if (b.type === "timeline") mine.push(...b.items.map((i) => i.text));
    else mine.push(...b.rows.map((r) => r.join(" ")));
  }
  const shared = [];
  for (const t of mine) for (const gr of grams(norm(t.replace(/\[\d+\]/g, "")), 8)) if (ref.has(gr)) shared.push(gr);
  if (shared.length > 2) {
    fail(`${shared.length} eight-word runs copied from the reference page; rewrite these in your own words: ${shared.slice(0, 4).map((s) => `"${s}"`).join("; ")}`);
  }
  return shared.length;
}

/* ---- Citation check --------------------------------------------------- */

const UA = "REGEN-Library-Builder/1.0 (+https://www.regenhealth.app; citation verification)";

async function fetchOk(url, { json = false } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: json ? "application/json" : "*/*" }, redirect: "follow", signal: ctrl.signal });
    // 403/429 from publishers that block bots still prove the page exists.
    if (!json && (res.status === 403 || res.status === 429)) return true;
    if (!res.ok) return null;
    return json ? await res.json() : true;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function verifySource(src) {
  if (src.doi) {
    const doi = String(src.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim();
    const r = await fetchOk(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { json: true });
    if (r?.message) return { ...src, doi, url: src.url || `https://doi.org/${doi}`, verified: true };
  }
  if (src.pmid) {
    const pmid = String(src.pmid).replace(/\D/g, "");
    const r = await fetchOk(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`, { json: true });
    if (r?.result?.[pmid] && !r.result[pmid].error) return { ...src, pmid, url: src.url || `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`, verified: true };
  }
  if (src.url && (await fetchOk(src.url))) return { ...src, verified: true };
  return { ...src, verified: false };
}
