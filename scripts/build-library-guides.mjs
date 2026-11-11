#!/usr/bin/env node
/**
 * build-library-guides.mjs: write the Peptide Library.
 *
 * For each compound in `src/app/lib/data/guide-seed.json` without a guide
 * (or every compound with --force), ask Claude to research it with web search
 * and return one guide in the fixed anatomy the pages render (see
 * `lib/guides.ts`). Each guide is validated, its citations are checked
 * against the live web (Crossref for DOIs, PubMed for PMIDs, an HTTP fetch
 * for everything else), and the result is written to
 * `src/app/lib/data/guides/<slug>.json`. Run `scripts/bundle-guides.mjs`
 * afterwards; this script does it for you on exit.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... node scripts/build-library-guides.mjs
 *     [--only bpc-157,semaglutide] [--force] [--limit 10]
 *     [--concurrency 3] [--dry-run] [--model claude-opus-5-5]
 *
 * --dry-run builds every prompt and validates the pipeline without calling
 * the API. Costs are printed per compound from `usage`.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const DATA = path.join(ROOT, "src/app/lib/data");
const SEED = path.join(DATA, "guide-seed.json");
const CATALOG = path.join(DATA, "library-peptides.json");
const OUT = path.join(DATA, "guides");
const LOG = path.join(ROOT, "scripts/.guide-build.log");

/* ---- CLI -------------------------------------------------------------- */

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return dflt;
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : true;
};
const ONLY = flag("only", "") ? String(flag("only", "")).split(",").filter(Boolean) : null;
const FORCE = Boolean(flag("force", false));
const LIMIT = Number(flag("limit", 0)) || 0;
const CONCURRENCY = Number(flag("concurrency", 3)) || 3;
const DRY = Boolean(flag("dry-run", false));
const MODEL = String(flag("model", "claude-opus-5-5"));

/* ---- Vocabulary (mirrors lib/guides.ts) --------------------------------- */

const CATEGORIES = {
  brain: "Brain & sleep",
  skin: "Skin & aging",
  digestive: "Digestive & weight",
  immune: "Immune & defense",
  hormones: "Hormones & metabolism",
  bones: "Bones & muscles",
  heart: "Heart & blood",
  sexual: "Sexual & reproductive",
};
const STATUSES = {
  "fda-approved": "FDA-approved",
  "in-trials": "In clinical trials",
  "not-approved": "Not FDA-approved",
  cosmetic: "Cosmetic and topical",
};
const EVIDENCE = ["FDA approved", "Deep research", "Moderate research", "Limited research", "Low research"];

/* ---- Inputs ----------------------------------------------------------- */

const seed = JSON.parse(fs.readFileSync(SEED, "utf8"));
const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
const catalogItems = Array.isArray(catalog) ? catalog : catalog.peptides ?? [];
const catalogBySlug = new Map(catalogItems.map((p) => [p.slug, p]));
const seedSlugs = seed.map((s) => s.slug);

fs.mkdirSync(OUT, { recursive: true });

let todo = seed.filter((s) => (ONLY ? ONLY.includes(s.slug) : true));
if (!FORCE) todo = todo.filter((s) => !fs.existsSync(path.join(OUT, `${s.slug}.json`)));
if (LIMIT) todo = todo.slice(0, LIMIT);

console.log(`${todo.length} compounds to write (${DRY ? "dry run" : MODEL}, concurrency ${CONCURRENCY})`);

/* ---- Prompt ----------------------------------------------------------- */

const SYSTEM = `You are REGEN Research, writing entries for the REGEN Peptide Library, a public reference that explains one peptide per page to a general reader. Today's date is ${new Date().toISOString().slice(0, 10)}.

VOICE
Short declarative sentences. Concrete nouns. Plain language a careful non-specialist can read; define any term you must use. No hype words (breakthrough, revolutionary, game-changing, powerful). NEVER use an em dash or an en dash anywhere; use a comma, a period, parentheses, or the word "to" for ranges (write "250 to 500 mcg", never "250–500 mcg"). Write in the third person; never address the reader as "you" except in the educational disclaimer sense.

REPORT, DON'T PRESCRIBE
This is education, not advice. Never recommend a compound, never tell anyone to take anything, never give a dose, a schedule, or a protocol. There is no dosing section and no side-effects section unless the compound is an FDA-approved drug, in which case "What are the side effects?" reports the labelled adverse effects. For research compounds, safety data (or its absence) belongs in "What does the research show?".

ACCURACY
Every quantitative claim, trial result, approval, regulatory action, and sport status carries an inline citation marker like [1] that points to an entry in "sources". Every source must be a real page you saw in your web searches during this task: FDA.gov (approvals, 503A bulks list category, enforcement discretion notices), ClinicalTrials.gov, PubMed or a DOI, EMA, WADA, company press releases, or a major journal. Never invent a citation, never cite from memory, never cite a vendor, a forum, Reddit, Wikipedia, or a blog that sells peptides. If you cannot source a claim, leave it out. Verify the regulatory status as of today with a search before you write it: FDA approval (and under which brand names), the current 503A/503B compounding status, and WADA status where relevant. When the human evidence is thin, say so plainly; the honest rating of weak evidence is the entire value of this library.

ANATOMY (follow exactly; output one JSON object and nothing else, no code fences)
{
  "slug": string (given),
  "name": string (display name, e.g. "BPC-157", "Semaglutide"),
  "alsoCalled": string | null (other names, e.g. "Body Protection Compound 157" or "LY3437943"; null if none),
  "class": string (3 to 8 words, e.g. "Synthetic pentadecapeptide (gastric-derived)", "GLP-1 receptor agonist"),
  "category": one of ${Object.keys(CATEGORIES).join(" | ")} (the body system it mainly acts on),
  "status": one of ${Object.keys(STATUSES).join(" | ")}
     fda-approved = approved by the US FDA for at least one indication (any form);
     in-trials = investigational with registered human trials and no approval;
     not-approved = never FDA-approved and not in a registered human program (research chemicals, gray-market peptides);
     cosmetic = used topically in cosmetics, not a drug,
  "evidence": one of ${EVIDENCE.map((e) => `"${e}"`).join(" | ")}
     "FDA approved" only when status is fda-approved. Otherwise rate the HUMAN evidence:
     Deep = large or multiple randomized human trials; Moderate = at least one randomized human trial or several controlled human studies; Limited = small or uncontrolled human studies only; Low = animal and laboratory work only, or human data limited to short biomarker studies,
  "evidenceNote": one sentence that justifies the rating (the Evidence strength box),
  "summary": one sentence, under 160 characters, for search snippets and cards,
  "keyTakeaway": 60 to 110 words: what it is, what the evidence actually shows, its FDA status as of today, and the sport status if prohibited,
  "atGlance": 4 to 5 rows of {"label","value"}; values are one to two lines. Choose labels that fit the compound (e.g. "What it is", "FDA status", "Research", "How it works", "Main uses", "How it's taken", "Sport", "FDA filing", "Topical form"). The LAST row must be {"label":"Evidence strength","value":<the evidence rating>}. "FDA status" is always one of the rows,
  "sections": ordered array of {"id","heading","blocks"} with these headings, in this order, where "X" is the compound name:
     1. "What is X?" (2 to 4 paragraphs: what it is chemically, where it comes from, what it is sold or prescribed as; end with its approval status in one sentence)
     2. "The history of X" (ONLY if there is a documented history worth 2 or more paragraphs: discovery, development, who developed it, what happened; omit the section otherwise)
     3. "How does X work?" (2 to 3 paragraphs on mechanism; say explicitly which findings are animal or laboratory only)
     4. "Is X FDA-approved?" (first paragraph answers yes or no and for what; then a "timeline" block of dated regulatory events if there are any; then a closing paragraph on compounding and sport status where relevant)
     5. For fda-approved: "What is X prescribed for?" (indications, and the trial results that support them, with a "table" block of key trials: columns like Trial, Population, Result) and then "What are the side effects?" (labelled adverse effects as a "ul" block plus a paragraph on warnings).
        For every other status: "What does the research show?" (3 to 5 paragraphs; strongest human data first, then animal; name study sizes and outcomes; include a "table" block only when a model-by-model or study-by-study summary genuinely helps: columns like Study, Reported result or Model, Finding)
     6. OPTIONAL: "What is the difference between X and Y?" when a single comparison compound is commonly confused with X (e.g. BPC-157 vs TB-500, sermorelin vs tesamorelin): one intro paragraph, a "table" block with columns Feature, X, Y and 3 to 4 rows, and one closing sentence
     Block types: {"type":"p","text"} | {"type":"ul","items":[...]} | {"type":"timeline","items":[{"date","text"}]} | {"type":"table","columns":[...],"rows":[[...]],"note"?: string}
     Section ids: lowercase kebab-case of the heading's key words (what-is, history, how-it-works, fda-approved, prescribed-for, side-effects, research, difference),
  "statusBox": 2 to 3 rows of {"label","value"} for the grey Status box: always {"label":"FDA status",...}; add {"label":"Sport",...} if WADA-prohibited, {"label":"FDA filing",...} or {"label":"Compounding",...} where relevant,
  "sources": array of {"id": integer starting at 1, "text": citation (Author et al., year, title, journal; or "FDA, <page title>"), "url": string (the page you saw), "doi": string | null, "pmid": string | null}. 4 to 14 sources. Every [n] marker in the text must match an id here, and every source must be cited at least once,
  "alsoInLibrary": array of slugs from this list that are variants or close relatives of X (empty array if none): ${seedSlugs.join(", ")}
}

Inline citation markers go at the end of the sentence they support, before the period, in the form [n] or [n][m]. Do not put markers in headings, the key takeaway, atGlance, statusBox, or evidenceNote.`;

function userPrompt(s) {
  const lines = [];
  lines.push(`Write the library entry for: ${s.name} (slug: ${s.slug}).`);
  if (s.category) lines.push(`Reference category: ${CATEGORIES[s.category]} (keep it unless clearly wrong).`);
  if (s.status) lines.push(`Reference status: ${STATUSES[s.status]} (verify it as of today before you write it).`);
  if (s.alsoCalled) lines.push(`Also called: ${s.alsoCalled}.`);
  if (s.referenceClass) lines.push(`Class (reference): ${s.referenceClass}.`);
  const cat = s.catalogSlug ? catalogBySlug.get(s.catalogSlug) : null;
  if (cat) {
    const bg = [];
    if (cat.subtitle) bg.push(cat.subtitle);
    if (cat.description) bg.push(cat.description);
    for (const ch of cat.chapters ?? []) {
      for (const sec of ch.sections ?? []) {
        if (sec.body) bg.push(`${ch.title ?? ch.key}: ${sec.body}`);
      }
    }
    const text = bg.join("\n\n").slice(0, 7000);
    if (text) {
      lines.push(
        "",
        "Background notes from our in-app catalog. These are NOT sources and may be out of date or wrong; use them only as leads for what to verify with web search:",
        "<<<",
        text,
        ">>>"
      );
    }
  }
  lines.push(
    "",
    "Research with web search first (regulatory status, the strongest human trials, mechanism reviews, sport status), then return the single JSON object."
  );
  return lines.join("\n");
}

/* ---- Validation -------------------------------------------------------- */

const DASH = /[–—]/g;

function fail(msg) {
  throw new Error(msg);
}

function validate(g, s) {
  if (!g || typeof g !== "object") fail("not an object");
  if (g.slug !== s.slug) g.slug = s.slug;
  if (!g.name) fail("missing name");
  if (!CATEGORIES[g.category]) fail(`bad category ${g.category}`);
  if (!STATUSES[g.status]) fail(`bad status ${g.status}`);
  if (!EVIDENCE.includes(g.evidence)) fail(`bad evidence ${g.evidence}`);
  if (g.status === "fda-approved" && g.evidence !== "FDA approved") g.evidence = "FDA approved";
  if (g.status !== "fda-approved" && g.evidence === "FDA approved") fail("FDA approved rating on a non-approved compound");
  for (const k of ["class", "evidenceNote", "summary", "keyTakeaway"]) {
    if (typeof g[k] !== "string" || !g[k].trim()) fail(`missing ${k}`);
  }
  const kt = g.keyTakeaway.split(/\s+/).length;
  if (kt < 40 || kt > 140) fail(`keyTakeaway is ${kt} words`);
  if (!Array.isArray(g.atGlance) || g.atGlance.length < 3 || g.atGlance.length > 6) fail("atGlance rows");
  if (g.atGlance[g.atGlance.length - 1].label !== "Evidence strength") fail("atGlance must end with Evidence strength");
  if (!g.atGlance.some((r) => /fda status/i.test(r.label))) fail("atGlance needs FDA status");
  if (!Array.isArray(g.sections) || g.sections.length < 3) fail("too few sections");
  const headings = g.sections.map((x) => x.heading);
  if (!/^What is /i.test(headings[0])) fail(`first section is "${headings[0]}"`);
  if (!headings.some((h) => /FDA-approved\?$/i.test(h))) fail("missing FDA section");
  for (const sec of g.sections) {
    if (!sec.id || !sec.heading || !Array.isArray(sec.blocks) || !sec.blocks.length) fail(`bad section ${sec.heading}`);
    for (const b of sec.blocks) {
      if (b.type === "p" && typeof b.text !== "string") fail("bad p block");
      if (b.type === "ul" && !Array.isArray(b.items)) fail("bad ul block");
      if (b.type === "timeline" && !Array.isArray(b.items)) fail("bad timeline block");
      if (b.type === "table" && (!Array.isArray(b.columns) || !Array.isArray(b.rows))) fail("bad table block");
      if (!["p", "ul", "timeline", "table"].includes(b.type)) fail(`bad block type ${b.type}`);
    }
  }
  if (!Array.isArray(g.statusBox) || !g.statusBox.length) fail("statusBox");
  if (!Array.isArray(g.sources) || g.sources.length < 3) fail("too few sources");
  const ids = new Set();
  for (const src of g.sources) {
    if (!Number.isInteger(src.id) || ids.has(src.id)) fail(`bad source id ${src.id}`);
    ids.add(src.id);
    if (!src.text || (!src.url && !src.doi && !src.pmid)) fail(`source ${src.id} has no locator`);
  }
  // Every marker must resolve.
  const text = JSON.stringify(g.sections);
  for (const m of text.matchAll(/\[(\d+)\]/g)) {
    if (!ids.has(Number(m[1]))) fail(`marker [${m[1]}] has no source`);
  }
  if (!Array.isArray(g.alsoInLibrary)) g.alsoInLibrary = [];
  g.alsoInLibrary = g.alsoInLibrary.filter((x) => seedSlugs.includes(x) && x !== g.slug);
  // Dashes: convert rather than fail. A spaced dash is a parenthetical, an
  // unspaced one is a range; the same rule library.ts applies.
  const fix = (t) => t.replace(/\s[–—]\s/g, ", ").replace(/(\d)\s?[–—]\s?(\d)/g, "$1 to $2").replace(DASH, ", ");
  const walk = (v) => (typeof v === "string" ? fix(v) : Array.isArray(v) ? v.map(walk) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v);
  return walk(g);
}

/* ---- Citation check --------------------------------------------------- */

const UA = "REGEN-Library-Builder/1.0 (+https://www.checkregen.app; citation verification)";

async function fetchOk(url, { json = false } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: json ? "application/json" : "*/*" }, redirect: "follow", signal: ctrl.signal });
    if (!res.ok) return null;
    return json ? await res.json() : true;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function verifySource(src) {
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
  if (src.url) {
    const ok = await fetchOk(src.url);
    if (ok) return { ...src, verified: true };
  }
  return { ...src, verified: false };
}

/* ---- Generation ------------------------------------------------------- */

const client = DRY ? null : new Anthropic({ maxRetries: 5 });
const TOOLS = [{ type: "web_search_20260209", name: "web_search", max_uses: 12 }];
const PRICE = { in: 4 / 1e6, out: 20 / 1e6, cacheRead: 0.2 / 1e6, cacheWrite: 5 / 1e6 };
let spent = 0;

function extractJson(text) {
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  if (a === -1 || b === -1) fail("no JSON object in the reply");
  return JSON.parse(text.slice(a, b + 1));
}

async function generate(s) {
  const messages = [{ role: "user", content: userPrompt(s) }];
  let usage = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
  let final = null;
  for (let turn = 0; turn < 8; turn++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 40000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "high" },
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      tools: TOOLS,
      messages,
    });
    const msg = await stream.finalMessage();
    for (const k of Object.keys(usage)) usage[k] += msg.usage?.[k] ?? 0;
    if (msg.stop_reason === "pause_turn") {
      // The server-side search loop hit its iteration cap; resend as-is and
      // it resumes. No extra user turn.
      messages.push({ role: "assistant", content: msg.content });
      continue;
    }
    if (msg.stop_reason === "refusal") fail(`refused (${msg.stop_details?.category ?? "no category"})`);
    if (msg.stop_reason === "max_tokens") fail("hit max_tokens");
    final = msg;
    break;
  }
  if (!final) fail("never finished (pause_turn loop)");
  const text = final.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const cost = usage.input_tokens * PRICE.in + usage.output_tokens * PRICE.out + usage.cache_read_input_tokens * PRICE.cacheRead + usage.cache_creation_input_tokens * PRICE.cacheWrite;
  spent += cost;
  return { text, cost, usage };
}

async function one(s) {
  const t0 = Date.now();
  try {
    const prompt = userPrompt(s);
    if (DRY) {
      console.log(`[dry] ${s.slug}: ${prompt.length} chars of prompt, catalog=${s.catalogSlug ?? "none"}`);
      return;
    }
    const { text, cost, usage } = await generate(s);
    let guide = validate(extractJson(text), s);
    const checked = [];
    for (const src of guide.sources) checked.push(await verifySource(src));
    guide = { ...guide, sources: checked };
    const live = checked.filter((x) => x.verified).length;
    if (live < 2) fail(`only ${live} of ${checked.length} sources verified`);
    const today = new Date().toISOString().slice(0, 10);
    const existing = fs.existsSync(path.join(OUT, `${s.slug}.json`)) ? JSON.parse(fs.readFileSync(path.join(OUT, `${s.slug}.json`), "utf8")) : null;
    const out = {
      ...guide,
      alsoCalled: guide.alsoCalled || undefined,
      catalogSlug: s.catalogSlug ?? undefined,
      published: existing?.published ?? today,
      updated: today,
      model: MODEL,
    };
    fs.writeFileSync(path.join(OUT, `${s.slug}.json`), JSON.stringify(out, null, 2) + "\n");
    const line = `${s.slug}: ok in ${((Date.now() - t0) / 1000).toFixed(0)}s, $${cost.toFixed(2)}, ${usage.output_tokens} out tokens, ${live}/${checked.length} sources verified, evidence=${guide.evidence}, status=${guide.status}`;
    console.log(line);
    fs.appendFileSync(LOG, `${new Date().toISOString()} ${line}\n`);
  } catch (e) {
    const line = `${s.slug}: FAILED ${e.message}`;
    console.error(line);
    fs.appendFileSync(LOG, `${new Date().toISOString()} ${line}\n`);
  }
}

async function pool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: n }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

await pool(todo, DRY ? 1 : CONCURRENCY, one);
if (!DRY) {
  console.log(`spent about $${spent.toFixed(2)}`);
  execFileSync(process.execPath, [path.join(ROOT, "scripts/bundle-guides.mjs")], { stdio: "inherit" });
}
