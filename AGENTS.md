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

## Site architecture (since 2026-11-06)

Four pillars, each copied from a named reference and skinned in this
design system. When a surface drifts from its reference, the fix is the
reference, not an invention. Nav (Oasis's bar): Library · Science · Shop ·
FAQ · Log in · Get the app. Community Notes is gone (routes, API, CSS).

| pillar | route | reference | data |
|---|---|---|---|
| Landing | `/` | the app's two flows: Finding (goal → plan → tested source) and Tracking (dose, vial, proof) | `Hero`, `Features`, `FeatureRail` copy |
| Science | `/blog` (URLs kept; label changed) | superpower.com/blog: hero + subscribe, category tabs, Top Articles (one featured + four), a section per category with "See all" → `/blog/category/<slug>` | `lib/blogData.ts` |
| Library | `/library`, `/library/<category>`, `/library/<slug>` | superpower.com/guides/peptides | `lib/guides.ts` |
| Shop | `/shop`, `/shop/<compound>`, `/shop/vendors`, `/shop/vendors/<slug>`, `/shop/coas`, `/shop/labs`, `/shop/verify`, `/shop/cart`, `/shop/submit` | peptaura.com | `lib/shop.ts` |
| Account | `/account` | one login across app and web | `lib/firebase.ts`, `lib/auth.ts` |

Every new route goes in `sitemap.ts`; every hub goes in `llms.txt`; every
new glass surface goes in `scripts/check-glass.mjs`. Verify with screenshots
at 1440 and 390 (`playwright-core` in the scratchpad, see memory).

## The Library (`/library`): Superpower's anatomy

**Structure is superpower.com/guides/peptides, exactly.** Eight body-system
categories (`CATEGORIES` in `lib/guides.ts`: Brain & sleep, Skin & aging,
Digestive & weight, Immune & defense, Hormones & metabolism, Bones &
muscles, Heart & blood, Sexual & reproductive). Four status labels
(FDA-approved · In clinical trials · Not FDA-approved · Cosmetic and
topical). Five evidence ratings of the HUMAN research (FDA approved · Deep ·
Moderate · Limited · Low research). Guide anatomy: identity card (status
dot + label, category, H1, "Also called", Evidence, Class) in the rail,
then Key takeaway, byline (REGEN Research · citations · published ·
updated), At a glance (4-5 rows, last is Evidence strength), sections
("What is X?", optional "The history of X", "How does X work?", "Is X
FDA-approved?" with a timeline and the grey Status box, then "What is X
prescribed for?" + "What are the side effects?" for approved drugs or "What
does the research show?" for everything else, optional "X vs Y" table),
Evidence strength box, "Also in the library", "More for <category>",
Citations, disclaimer. **No dosing, no side effects for research compounds,
no S-F grades, no PK charts, no stacks, no chapters, no contents rail.** If
Superpower does not have it, the library does not have it. The app catalog
KEEPS those fields (dose cards, reconstitution math, the reference card);
only the web stopped rendering them.

**Status is a dot AND a label, painted with the app's own ramps** (approved =
green, in trials = gold, not approved = warm, cosmetic = cool; `STATUS_RAMP`
in `library/GuideParts.tsx`). No new colour; the colour never stands alone.
The body map (`library/BodyMap.tsx`) is a flat SVG, not the reference's WebGL
model, by design.

**URLs are flat:** `/library/<slug>` for a compound, `/library/<category>` for
one of the eight. The old `/library/<category>/<peptide>[/<chapter>]`,
`/library/how-we-grade`, and `/library/all-peptides` 308 in
`next.config.ts`; renamed compounds (hcg → human-chorionic-gonadotropin)
come from `guide-seed.json` so a rename there is a redirect here.
`/library/learn/*` still renders but is unlinked: Superpower has no
equivalent; decide whether they become Science posts or go.

**Data pipeline.** `data/guide-seed.json` (152 reference compounds + the
catalog's extras, built by `scripts/build-guide-seed.mjs` from a crawl of
the reference index; only the factual layer is taken: which compounds,
category, status, class) → `data/guides/<slug>.json` (one per compound,
written by `scripts/build-library-guides.mjs`, Claude with web search, every
citation checked live against Crossref / PubMed / the page; or by writer
agents against the same validator) → `scripts/bundle-guides.mjs` →
`data/guides.json` + `data/guide-index.json` (the static imports). Index
rows without a guide render as dimmed static cards, never dead links.
Guide text is cleaned ONCE at load (`cleanGuide`), the catalog's dash rule.
Citation markers are `[n]`; a marker whose source failed verification is
stripped at render so no number ever points at nothing.

**Catalog (`lib/library.ts`)** still powers `/tools/*`, the calculators,
and the app-facing facts. Never hand-edit
`src/app/lib/data/library-peptides.json`; re-run
`node scripts/build-library-data.mjs`. `hrefFor()` now returns the flat
guide URL via the seed, or `/library` for blends and variants with no page.

## The Shop (`/shop`): a comparison and a handoff, not a store

Peptaura is the reference for WHAT is on the page (compound-first, vendor
rows with price per mg, COA, batch, code; ranked vendors; a COA archive;
batch verify). It is NOT the reference for how it feels: Peptaura is a
store with a cart and checkout, REGEN sells nothing. The first build copied
the store (stacked cards, quantity steppers, Add to cart, accent on every
selection) and was rejected on sight ("a stacked material shit show").
The rebuilt rules:

- **One skeleton on every shop page** (`shop/ShopShell.tsx`): left-aligned
  head (crumbs · H1 · lead · optional actions line), the tab bar
  (`shop/ShopTabs.tsx`: Catalog · Vendors · COAs · Labs · Verify, Saved at
  the far end), then the body. Nothing sits outside it; nothing is centred.
- **Tabs are underline tabs, each a page.** Active = ink + 2px rule + a
  0.2px text stroke. No pills, no anchors mixed with routes.
- **Lists live in ONE pane** (`.sh-pane`, page glass), rows divided by
  hairlines, never a stack of cards. Comparisons are tables (`.sh-table`).
- **Selections are the lit layer with an ink stroke** (`.sh-seg
  button[aria-pressed="true"]`, `.sh-save[aria-pressed="true"]`), never an
  accent fill. The accent appears once on a page at most; in the comparison
  table the way out (`.sh-get`) is INK, because twenty accent pills down a
  column read as decoration.
- **The compound page is a comparison table**: dose-per-vial segmented
  control + sort in one toolbar, then one row per vendor (merged across its
  products) showing the best pack for that size, per mg, latest COA with
  batch, purity, code, Save, Get it; other packs expand inline.
- **"Saved", not "Cart"** (`/shop/saved`, `lib/cart.ts` storage): the packs
  a reader picked, grouped by vendor with the code and "Checkout at
  <vendor>". No quantities (that is the vendor's checkout). `/shop/cart`
  308s there.

**Vendors are ranked, never graded.** `rank` and `score` from the research
pipeline order the rows; tier letters never render. `/shop/vendors` is one
pane, 1st/2nd/3rd then 04 onward, each row: mark, name, trust line, tags,
reviews · COAs · prices-live. Trust facts come from `trustLine()`; tags are
the research playbook's fixed vocabularies.

**Data pipeline.** `scripts/build-shop-data.mjs` reads
`regen-app/data/catalogs/library/vendors.json` and the live product pulls
in `vendor-research/products/*.json` (made by
`vendor-research/pull_products.py`; 21 of 42 stores readable, the rest
`blocked`/`unreachable`, recorded honestly) and writes `shop-vendors.json`,
`shop-offers.json`, `shop-compounds.json`, `shop-coas.json`,
`shop-labs.json`. Three cleaning rules live there and must stay: a product
whose name or handle names a second compound, says blend, or is a non-vial
form (capsule, topical, nasal) is NOT listed under a single compound; same-
size variants all claiming one vial are unlabeled packs (cheapest = 1 vial,
rest `quantity: null` and no $/mg); blends tile only with 2+ vendors. AUD
stores keep their currency and get no $/mg.

**Saved** (`lib/cart.ts`, localStorage) mirrors to the account once the
app's rules allow a web write. **Submit** (`/shop/submit` →
`/api/vendors/submit`) dedupes by domain against the 42, then forwards to
`VENDOR_SUBMISSIONS_WEBHOOK_URL`; the Claude pre-check against the playbook
attaches there once `ANTHROPIC_API_KEY` is on the deployment.

## Account (`/account`)

Firebase Auth on the app's project (`regen-health-app`, database `regen`),
Google + Apple only, from `NEXT_PUBLIC_FIREBASE_*` (see `.env.example`).
Unconfigured, every auth surface shows "Sign-in opens soon" rather than
throwing. Signed in, the page reads `users/{uid}/inventory` (owner-readable
by the app's rules) as "Your stack" and links each compound to its shop
page. The web never writes the plan.

Old library notes below describe the catalog module and the article shell
that blog posts, learn guides, and tools still use.

Routes (catalog-era, still live): `/library/learn` · `/library/learn/<slug>`.
Add any new route to `sitemap.ts` and, if it is a hub, to `llms.txt`.

**Category marks are the app's FILLED cuts.** `flame.fill`, `heart.fill`,
`leaf.fill`, `bandage.fill` paint their closed silhouettes solid with the
gradient (`--icon-paint`); the bandage knocks its dividers and pad dots out in
white. Only the marks whose SF Symbol is genuinely line art (the strength
figure, `infinity`, `brain.head.profile`) stay stroked. Outlined versions of
the filled symbols were rejected by QA ("FILL THEM LIKE FIRE"). ONE deliberate
divergence from the catalog: its `sparkles` resolves to the DROPLET
(`ICON_BY_SYMBOL`), because the blog's Science eyebrow also wore sparkles and
two unrelated surfaces sharing a mark defeats the mark. Science wears the
flask. Update the app catalog's aesthetics `sectionIcon` to a drop symbol to
restore exact parity, then point `sparkles` back or retire it.

**Category icon gradients are `gradientUnits="userSpaceOnUse"`, anchored to the
24-box.** With the default `objectBoundingBox`, every sub-path of a mark is its
own painted object, so the ramp restarts inside each one: each dumbbell plate
rendered as a near-flat block, and the horizontal bar joining them has a
ZERO-HEIGHT bounding box, which makes a vertical gradient degenerate and paints
nothing at all — the dumbbell showed as four disconnected blocks. Filled
sub-groups read `--icon-paint` (a custom property, since an SVG presentation
attribute cannot carry one); painting them `currentColor` left half of every
icon a flat ink beside a gradient-stroked label.

**The eyebrow icon aligns to the label's x-height, not to its box.** The offset
is measured (`--icon-drop`), not guessed: the glyph's optical centre sits above
the lowercase x-height, so centring the two boxes leaves it riding high. Applied
as a `translateY`, not a `margin-top`, because under `align-items: center` a
margin moves the item only half its value and the number then means nothing.

**Category identity comes from the app.** `rampFor()` / `iconFor()` in
`lib/library.ts` reproduce `LibraryModels.swift`'s `asCategoryGradient` and the
catalog's `sectionIcon`, so a compound wears the same colour and mark on both
surfaces. Five ramps only (`--cat-warm/cool/brown/green/gold`, stops copied
from `Colors.swift`). Performance and Longevity legitimately share green, as
they do in the app — the icon and label separate them. Never introduce a
seventh ramp or recolour a category on the web alone.

**Reference page header** (`ReferenceHeader` in `library/parts.tsx`) mirrors the
app's `BreakdownView.headerBlock`: category eyebrow with icon, headline, then
the compound's own subtitle sentence as the lead.

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
name tail-truncated to keep the grade beside it (`lineLimit(1)` in the app) —
the title must be `flex: 0 1 auto`, since growing it pins the grade to the far
card edge where it reads as a corner badge. ARTICLE cards (blog posts, learn
guides — anything without an orb) instead run the title to TWO lines
(`-webkit-line-clamp: 2`), the Peptidepedia treatment: they carry no grade on
the line, and one-line truncation threw away the half of the title holding the
query. Keyed on `:not(:has(.lib-orb))`, so no modifier class to forget. Blurb, then topic tags directly
under it (the blurb is 3-line clamped, so `margin-top: auto` only opened a gap
as tall as the longest sibling). One orb size everywhere, category tiles
included.

**A grid card must never transition `box-shadow`, only `transform`.** A grid of
cards streams past a stationary cursor while the reader scrolls, so every card
that passes under the pointer starts a shadow transition, and a shadow
transition repaints the card on every frame of it. On a surface that also
carries `backdrop-filter` that repaint is the expensive kind, and the result is
the grid appearing to redraw block by block as you scroll. Traced over a 2.5s
scroll with the pointer parked on the grid: 123ms of raster with the shadow
transitioned, 28ms without. Applies to `.lib-card`, `.blog-card`, and
`.lib-chapter-row`; a single interactive control (a button, the search field)
is not affected because it does not stream past the pointer. The lift is what
the eye reads and it runs on the compositor; the shadow still changes on hover,
it just swaps rather than animating.

Note what this is NOT: the page carries 122 `backdrop-filter` elements, and
that count is not the cause. Measured with the GPU enabled, scrolling runs at
120fps with them and 120fps without, and a paint trace shows 6.3ms of raster
against 5.7ms. A headless run WITHOUT a GPU reports 7fps and looks like a
smoking gun; it is software rasterisation, not the site. Do not go removing
blur from glass on the strength of that number.

**TWO tags on a card, never three.** The tag row is `nowrap`, and the component
caps the count: where the FDA badge applies it takes the second slot instead of
a second topic. Three tags overflow the card on the widest pairs ("Growth
Hormone · Body Composition · FDA-approved" needs 386px against 301px), and one
wrapped row makes that card taller, which drags its whole grid row with it. There is no icon system — the category
mark is `.lib-orb`, a small circle carrying the whole category gradient, and
`CategoryIcon.tsx` was deleted. Guide and article cards put their tags UNDER
the description (`.lib-card-chips--foot`).

**Never `replace()` on a bare selector fragment.** This has now broken things
four times in this file. `.lib-ref-eyebrow span:not(.lib-orb)` matches the tail
of all five `.lib-ref-head--{ramp} …` rules AND the last line of the
`body.is-searching` blur list; an insert anchored on it split every one of
them, leaving five unscoped gradient rules (gold won) and an unscoped
`filter: blur(18px)` that made the category label invisible on every page.
`.hdr-inner` versus `.hdr.is-collapsed .hdr-inner` was the same mistake.
Anchor on something unique, then ASSERT per variant — the eyebrow bug survived
a screenshot review because the nav pill happened to cover the label.

**The category label carries the gradient.** `--font-sf` (SF Pro, the app's
own face) at 700, bolded together with its icon by QA request — the app sets
the SF Symbol beside this label at `weight: .bold`. Through a lighter eyebrow
the ramp had too little stem to show. `--cat-*-text` runs top-to-bottom,
matching the ramp rule beside it.

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
because a 90ch line is harder to read, not easier.

**Every article on the site wears the reference anatomy.** Learn articles
(`/library/learn/<slug>`) and `/library/how-we-grade` use the same
`.legal-page--wide` shell, glass `Contents` rail, `legal-head--ref` header
(eyebrow · headline · lead sentence · byline, chips deleted, read time and
source count in the byline), disclaimer as the first `.legal-body` child, and
`lib-ch-num`-numbered compound chapters. A learn article wears the category
most of its members belong to — ramp, icon, and `sectionLabel` all come from
the first member in the dominant category, so a guide matches the reference
pages it links into; ties fall to the ranked winner. Its takeaways are plain
sentences: `KeyTakeaways` renders raw strings, so `**bold**` markup printed
literal asterisks. Category index heads carry the same eyebrow via bare
`lib-ref-head--{ramp}` on the header (NOT `lib-ref-head`, whose h1 rule would
shrink the display title) — the lone orb beside the H1 read as a smudge.

**Blog posts wear the same shell** (second QA round; "blogs can stay the same"
was reversed on sight of the old header). `legal-page--wide` WITHOUT `lib-ref`:
blog categories carry no ramp, and `.lib-ref`'s selected-row gradient reads
`--ramp-text`, which unset paints the rail label invisible. Rampless eyebrow =
the post category (the Methodology treatment: ink, SF Pro bold, lowercase).
The header banner, Get Started button, and meta row are GONE from the head —
date and read time fold into the byline sub-line, and the App Store CTAs live
in the in-article `PostCta` blocks and the page close. The blog eyebrow is
`.lib-ref-eyebrow--accent`: same anatomy, painted with `--accent-grad` and a
`CategoryIcon` (`ramp="accent"` stops in `CategoryIcon.tsx`) because blog
categories carry no library ramp and must never be given one — the icon map is
`CATEGORY_ICON` in the blog page. Post h2s use
`<span className="lib-ch-num">NN</span>` like a breakdown chapter — the old
baked "NN — Title" prefixes were also the blog's em-dash supply. Post `toc`
labels still carry their own numbers in two shapes ("01 Title", "01 — Title");
the `Contents` rail strips them and draws its own. The jump-chip row is the
breakdown's chip VERBATIM — same class, same size, no numbers, no per-surface
resizing (a shrunken variant was reverted by QA). The blog fits the row by
shortening its chip LABELS to 2-3 words at render time (`chipLabel`: cut at
the first inner stopword), never by shrinking the chip. Posts carry a
`takeaways` field rendering the library's `KeyTakeaways` card above the chips.
Post FAQs are `.lib-faq` details pills, the reference-page
treatment — the plain `h2#faq + h3/p` sections were swept into that markup.
`PostCta`'s QR panel is `drop="up"`: dropped down it extended past the card
over the next section's heading.

**Catalog bodies are blocks, not one string.** Render them with `<Prose>`, not
`<RichText>` inside a `<p>`. The bodies carry blank-line paragraph breaks and
runs of `•` bullets; collapsing a 2,400-character section into one paragraph is
what made these pages unreadable. `RichText` is only for a single inline run
(a table cell).

**Known upstream data bug:** `Research Applications` in `quickFacts` arrives
space-joined with the delimiter already lost in the APP catalog ("Sports
Medicine Research Neuroscience"), so it cannot be split back apart without
guessing. `QuickFacts` drops the row. Fix the catalog and remove the filter.

**NO EM DASHES, anywhere.** The catalog is full of them, so `library.ts`
normalises the whole dataset ONCE at module load (`cleanPeptide`), not per
component: subtitles, descriptions, chapter bodies, quick facts, dose cards,
half-lives, trials, sources, contraindications. Doing it in `<Prose>` missed
card subtitles, composed FAQ answers, meta descriptions, JSON-LD, the OG
images, and `/llms.txt`. Two converters, and they are not interchangeable:

- `dashesToCommas` for catalog prose. Paired dashes are parentheses
  ("stability—surviving extreme pH—distinguishes it") and splitting those into
  sentences leaves fragments. It also only converts SPACED en dashes: an
  unspaced one is a numeric range ("250–500 mcg") and breaking it changes what
  the page says. 201 ranges are asserted intact.
- `normalizeDashes` for short display strings (takeaways), which splits into
  two sentences and re-capitalises.

Hand-written JSX must not add them either: use `<span className="lib-none">Not
reported</span>` for an empty cell, never an em-dash glyph. Sweep with the
dash check before shipping. The grade scale is `S,A,B,C,D,F` — a `[A-F]`
character class silently misses every S-tier compound.

**The compound's category ramp runs through its article.** `lib-ref--{ramp}`
on the article root resolves `--ramp`, `--ramp-ink`, `--ramp-text`, and
`--ramp-wash`; every accent reads those, so nothing can drift from the ramp
rule on the card the reader arrived from.

**Orb glows are a RADIAL GRADIENT on `.lib-orb::before`, never a box-shadow.**
Chrome rasterises a blurred `box-shadow` on a 10px dot through an
approximation that at this radius resolves into a squarish patch with straight
edges and corners: the mark reads as a coloured block behind the orb rather
than light coming off it. Four stops, because a straight ramp to transparent
leaves its own visible edge where it lands. The orb takes `isolation: isolate`
so the halo can sit at `z-index: -1` — behind the orb's own fill, still above
the card. A hard `0 0 0 Npx` ring is wrong for the same reason it always was.

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
| category eyebrow: icon + `GradientStrokedLabel` | `.lib-ref-eyebrow` — `CategoryIcon` at 23px with a 2.4px stroke + SF Pro (`--font-sf`) at 700, LOWERCASE (the catalog writes the labels that way), gradient fill and NO text-stroke: the app's "stroke" is four offset copies of the GRADIENT, i.e. pure thickening, which the bold weight already is — a single-colour stroke read as a visible outline and was removed by QA. Margins weight the eyebrow toward the title (`--s-xl` above, `--s-md` below). `color: transparent` rides WITH each ramp-scoped gradient rule, never on the base span rule — on the base it made the rampless Methodology eyebrow invisible |
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

**Panes are for specific sections, not for everything.** Only the mechanism
chapter is a pane (`.lib-chapter-block--card`) — it is the one carrying the
rail. Chapters 02+ are plain sections under their numbered heading; a pane
behind all six turned the article into a stack of slabs. Dosing at a glance and
Quick facts are each ONE pane, with their facts and notes as hairline-divided
rows inside. Cardifying each fact and each note put six cards under one
heading, which is the same clutter one level down.
`sectionKind()` still classifies a subheader as `summary` / `safety` /
`protocol`, but it renders as a `.lib-sec-tag` beside the subheading rather
than growing another pane.

**Trials and contraindications are subsections, not sections.** Trials render
inside the research chapter and contraindications inside side effects, and
neither appears in the contents rail. As top-level sections they gave a
three-line list the same weight as a whole chapter. Never classify per compound or hand-tag a section —
if a block should be tagged, the fix is its subheader in the catalog.

**The reference header carries four things and no more:** category eyebrow with
orb, headline, lead sentence, byline. The grade/status/category chip row is
gone: the grade is stated in the takeaways and again in the evidence table, and
the category is in the breadcrumb.

**The lead is a SENTENCE, not a spec line.** This slot held
`specLine()` — "Glycoprotein hormone, LH-receptor agonist · sold as Pregnyl…" —
which reads as a database field and tells a reader arriving from search nothing
about what the compound does. Class and brand names are both rows in Quick
facts, where a spec belongs. `specLine()` was deleted rather than left dangling.
`takeawaysFor()` no longer opens with the subtitle either, so it appears exactly
once on the page; the subtitle lead survives there only as the fallback for a
compound with no evidence lines at all.

**Read time is computed from what the page renders, not `p.readMinutes`.** The
catalog field counts chapter bodies alone: hCG scores 2 minutes against a
rendered article of 1,087 words. `readMinutes()` in `library.ts` sums every
block the page puts on screen. It rides in the byline subline with the source
count ("Compiled from published research · 3 min read · 1 reference · Last
updated …"), because both qualify who wrote this and how far it goes, which is
what a byline is for. Neither is printed as zero.

**The overview is ONE column unless there is a molecular card to put in the
second.** 18 of the 54 compounds carry no molecular identifiers, and a hard
`1fr 280px` reserved the card's column on every one of them, squeezing the
article's opening paragraph to 639px of a 951px column with 312px of white
beside it holding nothing. `.lib-overview:has(> .lib-molecule)` keeps the
decision on the one fact that decides it. The `max-width: none` override on the
copy is scoped to the same `:has()`, so the single-column case takes the
article measure like any other paragraph.

**`--ref-measure` is not a character count.** `ch` is the width of "0", which in
this face is far wider than its average character: 74ch measures 840px and holds
a median of 101 rendered characters, already past the 45-90 band. It was tried
at 80ch (109 characters) and put back. If an article looks "blocked", measure
the paragraph before widening the measure — the last time, the cause was the
empty molecular column above, not the cap.

**Known upstream data bugs `<Prose>` works around** (fix the catalog and the
workarounds can go):
- 12 near-duplicate consecutive paragraph pairs across 6 compounds: the same
  sentence twice, once with `**bold**` plus a trailing label and once plain.
- Trailing evidence labels leaked into prose ("… multiple sclerosis trials.
  Animal"), stripped by `stripTrailingLabel`.

**Weight never marks state; a stroke does.** Tags, filter chips, FAQ questions,
and the selected contents row are all Neue Montreal Medium (500) with a
`-webkit-text-stroke` — the app's label treatment. Bold at tag size closes the
counters and outweighs the title above it. The selected contents row takes the
stroke in the ramp's own ink, matching the category eyebrow.

**The search overlay's header handling does three things, and each has a
reason.** `body.is-searching` (set by `LibrarySearch`) drives all of it:

1. `.hdr` lifts to `z-index: 130`, ABOVE the scrim. The nav search lives in the
   header on every library page, and `.lib-search.is-open`'s own z-index cannot
   escape `.hdr`'s stacking context.
2. `.hdr .hdr-inner` drops its glass — note the three-class selector, because
   `.hdr.is-collapsed .hdr-inner` beats a two-class one and every mobile
   viewport is collapsed.
3. Only `.hdr-brand`, `.hdr-links`, and `.hdr-cta` blur. Filtering
   `.hdr-inner` wholesale also blurred the search field being typed into.

TWO kinds of content escape a `backdrop-filter` and must blur themselves.
Both have bitten this overlay:

- Anything with its OWN `backdrop-filter` (the header pill) — separate
  backdrop root, never sampled.
- Text painted through `background-clip: text` (the hero accent clause, the
  card eyebrows, the molecular formula) — the scrim's DIM lands on it but the
  blur does not, so it sits sharp and saturated and reads as a highlight.

Any new overlay, and any new gradient-clipped text on a page that has one,
needs adding to the `body.is-searching` blur list.

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
`.lib-tier-link`, `.lib-chapter-link`, `.lib-filter`, `.getapp-panel`) are
excluded from the body-link gradient rule. A new card type rendered into the
article column needs the same exclusion or it renders as underlined blue
prose — and because `transition` is one property, the rule's own transition
REPLACES the component's whole list: the QR panel stopped morphing entirely
(instant pop, underlined caption) until it joined the exclusions.

## Publishing checklist for SEO posts

- Post file in `src/app/blog/[slug]/posts/`, registered in `posts/index.ts`,
  listed in `src/app/lib/blogData.ts` (its excerpt feeds `/llms.txt`).
- Section h2s take the breakdown numbering, never a baked prefix:
  `<h2 id="x"><span className="lib-ch-num" aria-hidden="true">01</span>Title</h2>`.
  The CSS draws the bullet separator; "01 — Title" text is both off-style and
  an em dash.
- FAQ sections are the library pills, never bare h3/p pairs:
  `<div className="lib-faq"><h2 id="faq">Frequently asked questions</h2>`
  then one `<details><summary>Q</summary><p>A</p></details>` per item. Keep
  the `faq:` data in `PostMeta` in sync — it feeds the FAQPage JSON-LD.
- 1-2 PostCta blocks per the rules above.
- Body links to other posts and to `/tools` (the reconstitution calculator) where relevant.
- Verify with `npx tsc --noEmit` before opening the PR.
