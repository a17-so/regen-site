# regen-site — agent brief

Marketing site for REGEN (iOS peptide tracking app). Next.js App Router,
all styling in `src/app/globals.css` (token-driven; never inline a hex or
spacing value that isn't declared in the token block at the top).

## Copy voice

Short, declarative, benefit-led. No em dashes anywhere in user-facing copy.
No hype adjectives ("world-class", "trusted", "revolutionary"). Concrete
nouns over abstractions: vials, doses, biomarkers, sources. Reference
register: "Run peptides with a clearer plan." / "Every vial, counted down" /
"Start without downloading anything."

## In-article CTA blocks (SEO articles: REQUIRED)

Every published blog article carries 1-2 `<PostCta>` blocks — a tinted card
with an app screenshot and one App Store button. When writing or publishing
a new post in `src/app/blog/[slug]/posts/`:

1. Import it after the types import:
   `import PostCta from "../PostCta";`
2. Place the FIRST block immediately before the third content `<h2>` (after
   the second section). Posts with fewer than 4 sections: before the second.
3. Posts with 5+ content sections also get a SECOND block, with a different
   variant, immediately before `<h2 id="faq">` (or before the last content
   h2 if the post has no FAQ).
4. Indent 6 spaces like sibling h2s, one blank line above and below:
   `      <PostCta variant="labs" />`

Pick the variant whose screen matches the surrounding section's topic:

| variant    | screenshot                        | shows                                   | use for sections about |
|------------|-----------------------------------|-----------------------------------------|------------------------|
| `protocol` | `/screens/screen-home.png`        | next-dose countdown, day's nutrition    | dosing schedules, titration, timing, stacking |
| `labs`     | `/screens/screen-biomarker.png`   | Vitamin D highlight vs last panel       | bloodwork, biomarkers, trial outcomes, measured effects |
| `ai`       | `/screens/screen-ai.png`          | REGEN AI answering with citations       | mechanisms, evidence review, research claims |
| `vials`    | `/screens/screen-inventory.png`   | activity stats, compound inventory list | reconstitution, storage, expiry, vial handling |

`/screens/screen-meal.png` (nutrition logging) exists but has no variant
yet; add one to `src/app/blog/[slug]/PostCta.tsx` before referencing it.
New variants need: img, alt, title, one-sentence body (no em dashes), and a
`post_cta_*` analytics location string.

## The Library (`/library`)

Peptide reference generated from the iOS catalog. Never hand-edit
`src/app/lib/data/library-peptides.json` — re-run
`node scripts/build-library-data.mjs` (reads
`regen-app/data/catalogs/library/peptides.json`, strips affiliate offers,
in-app cards, hotlinked images, and competitor sources).

Routes: `/library` · `/library/all-peptides` · `/library/how-we-grade` ·
`/library/<category>` · `/library/<category>/<peptide>` ·
`/library/<category>/<peptide>/<chapter>` · `/library/learn/<slug>`.
Add any new route to `sitemap.ts` and, if it is a hub, to `llms.txt`.

**Category identity comes from the app.** `rampFor()` / `iconFor()` in
`lib/library.ts` reproduce `LibraryModels.swift`'s `asCategoryGradient` and the
catalog's `sectionIcon`, so a compound wears the same colour and mark on both
surfaces. Five ramps only (`--cat-warm/cool/brown/green/gold`, stops copied
from `Colors.swift`). Performance and Longevity legitimately share green, as
they do in the app — the icon and label separate them. Never introduce a
seventh ramp or recolour a category on the web alone.

**Reference page header** (`ReferenceHeader` in `library/parts.tsx`) mirrors the
app's `BreakdownView.headerBlock`: category eyebrow with icon, headline, grade
plaque + status chip + category chip, subtitle, then the spec line
(class · half-life · brands).

**Regulatory status is computed, never substring-matched.** `regulatory()`
returns `approved` / `approved-narrow` / `otc` / `research`. Seventeen catalog
entries open with "Not FDA-approved", so a plain `includes("approved")` puts a
false regulatory claim on a health page. Keep the negation lookback.

**Every grade badge is a claim.** Anything asserting a tier links to
`/library/how-we-grade`, which defines S-F from study design and names live
examples pulled from the catalog. Do not hard-code example compounds there.

**Two grade treatments, and they are not interchangeable.** On an index
surface (cards, related rails, the all-peptides table) the grade is
`<GradeText>`: plain black type in the eyebrow face, no pill. On a reference
page, where the grade is the page's own claim, it is `<TierBadge>` /
`<TierLink>`: a glass tag keeping its tier colour. A tinted pill on a card
fights the compound name for the same line and 54 of them read as decoration.

**Layered glass is the library's chrome.** The recipe is the footer's
"Download from App Store" panel: a brighter fill, the same rim and inner bevel,
and NO drop shadow, because a pane resting on a pane casts nothing. Tokens are
`--glass-layer-bg` (a layer over glass) and `--glass-layer-shadow` (the shadow,
used over the white page too, where the fill stays `--glass-bg` so the pane
still reads). Every library surface takes it: cards, chips, icon plates, the
contents rail, dose panes, FAQ panes, the search field and its ⌘K tag. Never
give a library surface `--glass-shadow` — the card-scale drop fogs anything
pill-sized and reads as a smudge.

**Colour lives in type, not fills.** Tone changes text colour only; the surface
stays one glass recipe. The category icon plate is colourless and its glyph is
`--ink`. Category colour appears in exactly two places per card: the ramp rule
down the leading edge, and the gradient section eyebrow (`--cat-*-text`, the
ramps run horizontally and stop at the 30% stop so they stay legible). The one
coloured chip is `.lib-badge` for FDA approval, and the tier letter.

**Card chip order.** On a guide or article card the tags sit UNDER the
description (`.lib-card-chips--foot`), not between it and the title, and they
are set in ink. On a compound card the grade sits on the title's line.

**The reference page mirrors the app's breakdown.** Header = category eyebrow,
headline, chips, subtitle, spec line (`BreakdownView.headerBlock`). Contents is
a glass card with a live selected state (`library/Contents.tsx`). Dosing is a
pane grid, not a definition list. The concentration curve is the catalog's own
`pkChart` (`pull.py`'s `pk_decay_chart`, 29 of 54 compounds) drawn by
`library/PkChart.tsx` in the compound's ramp — never synthesise a curve for a
compound that has no chart data.

**The header carries the search on library pages.** `<NavBar slot={...}>` takes
a `<LibrarySearch variant="nav" />`; the header pill widens via `.hdr--slot`
because its normal 880/1040px measure has no slack. Below 1240px the field
hides and ⌘K still works. `.hdr-mid` must be `display: contents` at the mobile
breakpoint or it becomes a third grid child and wraps the store pill.

**Hub section order** is Notable Peptides, Peptide Science, Best Peptides
For..., Peptide Comparisons, Browse by Category. Peptide Science is fed from
`BLOG_POSTS` where `category === "Science"`. There is deliberately no A-Z
block on the hub; the alphabetical index lives on `/library/all-peptides`.

Component anchors inside `.legal-content` (`.lib-card`, `.lib-quicklink`,
`.lib-tier-link`) are excluded from the body-link gradient rule. A new card
type rendered into the article column needs the same exclusion or it renders as
underlined blue prose.

## Publishing checklist for SEO posts

- Post file in `src/app/blog/[slug]/posts/`, registered in `posts/index.ts`,
  listed in `src/app/lib/blogData.ts` (its excerpt feeds `/llms.txt`).
- 1-2 PostCta blocks per the rules above.
- Body links to other posts and to `/tools` (the reconstitution calculator) where relevant.
- Verify with `npx tsc --noEmit` before opening the PR.
