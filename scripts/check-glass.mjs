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
  ["footer download panel", "/", ".ft-get"],
  // The picked pack wears the accent (a state, not a recipe); sample a rest one.
  ["shop badge", "/shop/bpc-157", ".sh-badge"],
  ["shop segmented control, selected", "/shop/bpc-157", ".sh-seg button[aria-pressed=\"true\"]"],
  ["lab vendor pill", "/shop/labs", ".sh-badge--link"],
];

const PAGE = [
  // Library (the guide page's own panes, `.gd-identity` and `.lib-takeaways`
  // on /library/bpc-157, join this list once the first guide is generated).
  ["library row card", "/library", ".gd-slab"],
  ["search field", "/library", ".lib-search-field"],
  ["learn contents rail", "/library/learn/best-peptides-for-weight-loss", ".legal-toc--card"],
  ["blog contents rail", "/blog/reconstitution-without-anxiety", ".legal-toc--card"],
  ["blog FAQ pane", "/blog/thymosin-alpha-1-benefits-vs-tb-500-immune-response", ".lib-faq details"],
  // Shop
  ["shop tile", "/shop", ".sh-tile"],
  ["shop comparison pane", "/shop/bpc-157", ".sh-pane"],
  ["shop vendors pane", "/shop/vendors", ".sh-pane"],
  ["shop COA pane", "/shop/coas", ".sh-pane"],
  ["shop submit form", "/shop/submit", ".sh-form"],
  ["shop FAQ pane", "/shop", ".sh-faq details"],
  // Science and account
  ["science card", "/blog", ".sc-card"],
  ["account pane", "/account", ".ac-pane"],
  // Site
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
