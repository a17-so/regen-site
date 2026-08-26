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

**Glass has exactly TWO recipes, and the footer defines both.** Copy it:

| where the surface sits | recipe | example |
|---|---|---|
| on the page (white) | `--glass-bg` + blur + `--glass-shadow` | `.ft-card`, `.lib-card`, `.lib-takeaways`, `.lib-dose-grid > div`, `.lib-pk-plot`, `.legal-toc--card`, `.lib-facts-pane`, `.lib-molecule`, `.lib-search-field` |
| on another pane | `--glass-layer-bg` + blur + `--glass-layer-shadow` | `.ft-get`, `.lib-search-kbd`, chips inside a `.lib-card`, the selected contents row |

`--glass-layer-shadow` and `--glass-shadow-sm` resolve to the same value on
purpose; the two names only record which side of the rule a surface is on.
Never invent a third. This has drifted four times, always on the shadow, and
the symptom survives a screenshot review, so it has a guard:
`node scripts/check-glass.mjs` (dev server running) asserts every surface
resolves to one of exactly two computed values. Run it after touching any
glass, and add new surfaces to its `LAYER` / `PAGE` lists.

**Card anatomy is the app's `LibraryRow`.** Orb, name, grade on one line, the
name tail-truncated to keep the grade beside it (`lineLimit(1)` in the app);
blurb; topic tags along the bottom. There is no icon system — the category
mark is `.lib-orb`, a small circle carrying the whole category gradient, and
`CategoryIcon.tsx` was deleted. Guide and article cards put their tags UNDER
the description (`.lib-card-chips--foot`).

**The category label carries the gradient.** `--font-sans` at 500, not the
Plex eyebrow face — through a 400-weight eyebrow the ramp had too little stem
to show. `--cat-*-text` runs top-to-bottom, matching the ramp rule beside it.

**The article has one glass rail.** Every pane in the article flow bleeds
`--pane-bleed` (one pane inset) to the LEFT of the text column, so the glass
edge always comes before the words: headings and body copy sit on one
vertical, panes start outside it. Any new pane must be added to BOTH lists in
the rail block — the bleed list and the `padding-left: var(--s-xl)` list — or
its inner text lands off the vertical. The bleed is zeroed below 1080px.

**One vertical for the whole article.** `.legal-page--wide` is centred, and the
header, the rule under it, the contents rail, and the disclaimer all share its
left edge; the article column and every pane's inner text share a second
vertical inboard of that, with glass edges one `--pane-bleed` before it.
Asserted at 1280/1440/1680/1920. The medical notice sits ABOVE the rule with
the byline — it is about the page, not a step in the article.

**Reference pages use `.legal-page--wide`.** A 68ch column strangles a chart, a
dose grid, and a card rail, and the centred `TOC + content` cluster left a dead
gutter on both sides. The wide variant pushes the cluster left and lets
components fill; running text keeps its own 74ch measure inside that width,
because a 90ch line is harder to read, not easier. The blog keeps the standard
shell.

**Catalog bodies are blocks, not one string.** Render them with `<Prose>`, not
`<RichText>` inside a `<p>`. The bodies carry blank-line paragraph breaks and
runs of `•` bullets; collapsing a 2,400-character section into one paragraph is
what made these pages unreadable. `RichText` is only for a single inline run
(a table cell).

**Known upstream data bug:** `Research Applications` in `quickFacts` arrives
space-joined with the delimiter already lost in the APP catalog ("Sports
Medicine Research Neuroscience"), so it cannot be split back apart without
guessing. `QuickFacts` drops the row. Fix the catalog and remove the filter.

**Display copy goes through the copy layer, catalog prose does not.** Takeaways
come from `takeawaysFor()`, which drops database bookkeeping ("3 tracked
outcome areas with graded citations"), rewrites the tier label into a sentence,
and runs `normalizeDashes()`. The reference header's lead does the same. Both
are DISPLAY strings; body prose is rendered as written, because rewriting
punctuation mid-paragraph risks changing what it says. The grade scale is
`S,A,B,C,D,F` — a `[A-F]` character class silently misses every S-tier
compound.

**The compound's category ramp runs through its article.** `lib-ref--{ramp}`
on the article root resolves `--ramp`, `--ramp-ink`, `--ramp-text`, and
`--ramp-wash`; every accent reads those, so nothing can drift from the ramp
rule on the card the reader arrived from.

The accent appears as the RAMP, never a solid tint pulled out of it — every
orb (`.lib-orb`, the rail dots, the eyebrow mark) and every accent label (the
selected contents row, the molecular formula) paints `--ramp` or `--ramp-text`
through `background-clip`. A flat `--ramp-ink` fill throws away the gradient at
exactly the mark meant to carry it.

`background-clip: text` clips whatever the element paints, so an element can
never carry BOTH gradient type and a pane fill — put the gradient on an inner
span (see `.legal-toc-label`). It also silently blanks any sibling matched by
too broad a selector: `.lib-ref-eyebrow span` once hit the orb and rendered it
invisible.

Everything in the type is ink, chapter numbers and their separators included;
the only tinted text on a reference page is the amber SAFETY tag.

**Reference-page anatomy is ported from `BreakdownView` / 
`LibraryChapterContentView`, not invented:**

| app | web |
|---|---|
| "01 • How it Works" chapter header | `.lib-ch-num` inside the h2, all ink |
| dot-and-rail section list | `.lib-sec--rail`, MECHANISM CHAPTER ONLY |
| "Reported effects" / "When to stop" / "Reconstitution & storage" cards | `.lib-callout`, classified by `sectionKind()` |
| chart card: title, grey sub-line, plot, honesty footnote | `.lib-pk-head` / `.lib-pk-footnote` |
| Sources card | `.lib-refs ol` as one pane, host · authors · year meta line |
| numbered chapter pill | `.legal-toc-num` in the contents rail |

Keep them in sync when the app's breakdown changes.

**The rail is opt-in and means "these follow one another".** Only the
mechanism chapter passes `rail` to `ChapterSectionBlock`. A connected sequence
of dots asserts an order, which is true of a mechanism and false of a list of
side effects.

**ONE brick per chapter, not one card per section.** The chapter is the pane
(`.lib-chapter-block`); its sections are headings inside it. Cardifying each
section stacked four or five panes under a single heading and read as clutter.
`sectionKind()` still classifies a subheader as `summary` / `safety` /
`protocol`, but it now renders as a `.lib-sec-tag` beside the subheading rather
than growing another pane. Never classify per compound or hand-tag a section —
if a block should be tagged, the fix is its subheader in the catalog.

**The reference header carries five things and no more:** category eyebrow with
orb, headline, spec line (class · half-life · brands), byline, notice. The
grade/status/category chip row, the subtitle lead, and the read-time and
reference counts were all removed — the grade is stated in the takeaways and
again in the evidence table, and the category is in the breadcrumb.

**Known upstream data bugs `<Prose>` works around** (fix the catalog and the
workarounds can go):
- 12 near-duplicate consecutive paragraph pairs across 6 compounds: the same
  sentence twice, once with `**bold**` plus a trailing label and once plain.
- Trailing evidence labels leaked into prose ("… multiple sclerosis trials.
  Animal"), stripped by `stripTrailingLabel`.

**Grade letters and list markers are ink.** The tier colours live on
`/library/how-we-grade`, where the scale is explained. A lone orange letter in
an article header carries no meaning a reader can decode.

**Key Takeaways are plain sentences.** No bullet markers, no bold runs, no
dashes. Four sentences with a marker each and a bolded compound name read as a
diagram, not a summary.

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
