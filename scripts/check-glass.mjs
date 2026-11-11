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
  ["footer download panel", "/", ".ft-get"],
  // Status tags sit on a row's pane and on the identity card.
  ["library row status tag", "/library", ".lc-tag"],
  // The submit onboarding's two first-screen choices sit on the form pane.
  ["shop submit choice", "/shop/submit", ".sh-onb-choice"],
  ["library card status tag", "/library/bremelanotide", ".gi-status"],
  // The picked size and pack are the library filter chip's `is-active`
  // state, which is the layer.
  ["shop size bar thumb", "/shop/bpc-157", ".sh-segbar-thumb"],
  ["shop save icon button", "/shop/bpc-157", ".sh-icon-btn:not(.sh-icon-btn--go)"],
  ["shop pack bar", "/shop/bpc-157", ".sh-segbar--sm"],
  // The filter bar's thumb on its glass track (GlassTabs: Science, the library).
  ["filter bar thumb", "/blog", ".gtabs-thumb"],
  ["shop store catalog pack", "/shop/vendors/oros-research#catalog", ".sh-vcat-packs .sh-pack"],
];

const PAGE = [
  // Library (the guide page's own panes, `.gd-identity` and `.lib-takeaways`
  // on /library/bpc-157, join this list once the first guide is generated).
  ["library card", "/library", ".lc"],
  ["library hotspot label", "/library", ".bf3-spot.is-on .bf3-label"],
  ["library identity card", "/library/bremelanotide", ".gi"],
  ["library takeaway pane", "/library/bremelanotide", ".gd-takeaway"],
  // The header: one bar on the page. The dropdowns and the search panel
  // are the same material but only exist while open, so they are checked
  // by eye.
  // The bar's glass is its ::before (see .hdr-pill::before for why); the
  // search circle is its own pane beside it.
  ["header bar", "/", ".hdr-pill::before"],
  ["header search button", "/", ".hdr-search-btn"],
  ["blog contents rail", "/blog/reconstitution-without-anxiety", ".legal-toc--card"],
  ["blog FAQ pane", "/blog/thymosin-alpha-1-benefits-vs-tb-500-immune-response", ".lib-faq details"],
  ["FAQ page pane", "/faq", ".faq-group .lib-faq details"],
  // Shop
  ["shop catalog pane", "/shop/catalog", ".sh-pane--cells"],
  ["shop offers pane", "/shop/bpc-157", ".sh-pane.sh-offers"],
  ["shop size bar", "/shop/bpc-157", ".sh-segbar"],
  ["shop compound answer strip", "/shop/bpc-157", ".sh-answers"],
  ["shop podium card", "/shop", ".sh-podium-card"],
  ["shop directory pane", "/shop", ".sh-pane:has(> .sh-dir)"],
  ["shop profile answer strip", "/shop/vendors/oros-research", ".sh-answers"],
  ["shop profile sheet", "/shop/vendors/oros-research", ".sh-prof-main .sh-sheet"],
  ["shop profile rail sheet", "/shop/vendors/oros-research", ".sh-prof-rail .sh-sheet"],
  ["shop saved empty state", "/shop/saved", ".sh-empty-state"],
  // The app's "Shop Now" card: its own pane in the profile rail.
  ["shop profile prompt card", "/shop/vendors/oros-research", ".sh-prompt"],
  ["shop submit form", "/shop/submit", ".sh-form"],
  // Science
  ["science card", "/blog", ".blog-card"],
  ["science featured pane", "/blog", ".blog-hero"],
  ["filter bar track", "/blog", ".gtabs"],
  // Site
  ["footer card", "/", ".ft-card"],
  ["popup footer dock", "/", ".getbar-card"],
  ["reconstitution chart", "/tools/bpc-157-calculator", ".tool-table-wrap"],
];

function read(sel) {
  const [base, pseudo] = sel.split(/(?=::(?:before|after)$)/);
  const el = document.querySelector(base);
  if (!el) return null;
  const cs = getComputedStyle(el, pseudo ?? null);
  return { bg: cs.backgroundColor, shadow: cs.boxShadow.replace(/\s+/g, " ") };
}

// The new headless mode: the old one has no WebGL with this playwright, so
// the library's 3D figure fell back to the flat SVG and its glass hotspot
// label was never on the page to measure. Still headless; no window opens.
const browser = await chromium.launch({ executablePath: EXEC, headless: false, args: ["--headless=new"] });

/** One page per URL, reused across every selector on it. */
async function measure(rows) {
  const byUrl = new Map();
  for (const [, url] of rows) byUrl.set(url, null);
  for (const url of byUrl.keys()) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    // The header's glass exists only once the page has scrolled (at the top
    // the bar is gone); measure it formed.
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
    await page.waitForTimeout(700);
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
