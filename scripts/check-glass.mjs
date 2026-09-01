/**
 * Glass consistency guard.
 *
 * The design system has exactly TWO glass recipes, and the footer defines both:
 *
 *   page  — a pane ON THE PAGE (`.ft-card`): grey fill, blur, full drop.
 *   layer — a pane ON THAT PANE (`.ft-get`): brighter fill, rim + bevel,
 *           tight drop.
 *
 * They have drifted apart four separate times, always on the shadow, and the
 * symptom is subtle enough to survive a screenshot review: three tags that are
 * meant to be the same object end up looking like three different materials.
 * This asserts every surface resolves to one of exactly two computed values.
 *
 * Only statically-present surfaces belong here — the selected contents row is
 * scroll-dependent and is covered by the alignment checks instead.
 *
 * Needs the dev server running:  bun run dev
 * Then:                          node scripts/check-glass.mjs
 */
import { chromium } from "playwright-core";

const EXEC =
  process.env.CHROMIUM_PATH ??
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1124/chrome-mac/Chromium.app/Contents/MacOS/Chromium`;
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

/** [label, url, selector] grouped by which side of the rule they sit on. */
const LAYER = [
  ["⌘K tag", "/library", ".lib-search-kbd"],
  ["card topic tag", "/library", ".lib-card .lib-tag"],
  ["read-time pill", "/library", ".lib-card .lib-pill"],
  ["section tag", "/library/recovery/bpc-157", ".lib-sec-tag"],
  ["footer download panel", "/", ".ft-get"],
];

const PAGE = [
  ["takeaways", "/library/recovery/bpc-157", ".lib-takeaways"],
  ["contents rail", "/library/recovery/bpc-157", ".legal-toc--card"],
  ["learn contents rail", "/library/learn/best-peptides-for-weight-loss", ".legal-toc--card"],
  ["methodology contents rail", "/library/how-we-grade", ".legal-toc--card"],
  ["blog contents rail", "/blog/reconstitution-without-anxiety", ".legal-toc--card"],
  ["blog FAQ pane", "/blog/thymosin-alpha-1-benefits-vs-tb-500-immune-response", ".lib-faq details"],
  ["quick facts", "/library/recovery/bpc-157", ".lib-facts-pane"],
  ["dosing card", "/library/recovery/bpc-157", ".lib-dose-card"],
  ["FAQ pane", "/library/recovery/bpc-157", ".lib-faq details"],
  ["molecular card", "/library/recovery/bpc-157", ".lib-molecule"],
  ["chapter brick", "/library/recovery/bpc-157", ".lib-chapter-block"],
  ["compound card", "/library", ".lib-card"],
  ["search field", "/library", ".lib-search-field"],
  ["footer card", "/", ".ft-card"],
  ["popup footer dock", "/", ".getbar-card"],
  ["reconstitution chart", "/tools/bpc-157-calculator", ".tool-table-wrap"],
];

function read(sel) {
  const el = document.querySelector(sel);
  if (!el) return null;
  const cs = getComputedStyle(el);
  return { bg: cs.backgroundColor, shadow: cs.boxShadow.replace(/\s+/g, " ") };
}

const browser = await chromium.launch({ executablePath: EXEC });

/** One page per URL, reused across every selector on it. */
async function measure(rows) {
  const byUrl = new Map();
  for (const [, url] of rows) byUrl.set(url, null);
  for (const url of byUrl.keys()) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    byUrl.set(url, page);
  }
  const out = [];
  for (const [label, url, sel] of rows) {
    out.push([label, await byUrl.get(url).evaluate(read, sel)]);
  }
  for (const page of byUrl.values()) await page.close();
  return out;
}

let failed = false;

for (const [name, rows] of [
  ["LAYER (pane on pane)", LAYER],
  ["PAGE (pane on the page)", PAGE],
]) {
  const measured = await measure(rows);
  console.log(`\n=== ${name} ===`);
  const missing = measured.filter(([, v]) => !v).map(([l]) => l);
  const seen = new Map();
  for (const [label, v] of measured) {
    if (!v) continue;
    const key = `${v.bg} | ${v.shadow}`;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(label);
  }
  if (missing.length) {
    failed = true;
    console.log(`  not found (selector stale?): ${missing.join(", ")}`);
  }
  if (seen.size === 1) {
    console.log(`  ok — ${measured.length - missing.length} surfaces, one recipe`);
    console.log(`  ${[...seen.keys()][0]}`);
  } else {
    failed = true;
    console.log(`  FAIL — ${seen.size} distinct recipes:`);
    for (const [recipe, labels] of seen) console.log(`    ${labels.join(", ")}\n      ${recipe}`);
  }
}

await browser.close();
console.log(failed ? "\nglass check FAILED" : "\nglass check passed");
process.exit(failed ? 1 : 0);
