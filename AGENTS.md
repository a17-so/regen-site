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

**Never name a competitor app, anywhere.** Not in a post, a title, a slug,
an excerpt, alt text or a keyword target. A "Shotsy App" SEO post was
published and removed on 2026-11-08 (`/blog/shotsy-app` 308s to
`/blog/glp-1-tracker-app`). Buying-intent posts target the category
("GLP-1 tracker app", "peptide app"), never a rival's brand.

## Type roles (decided 2026-11-08)

Titles are Neue Montreal MEDIUM, the app's rule: the owner picked the
Science featured title's look (500, -0.015em) to carry across the site.
Card and row titles, section heads inside a page, pane and sheet heads use
`--fw-title` / `--ls-title`; Bold (`--fw-display`) only for page H1s, the
landing's display heads and figures (numbers, prices, scores). Only 500 and
700 ship: never declare 600 or 400. The tokens (`--fs-h2`,
`--fs-card-title`, `--fs-meta`, the one Plex label `--fs-label` /
`--ls-label`, `--close-gap`, `--body-gray`) are in the top block of
globals.css. Applied so far to the library's rows and list heads; the rest
of the site (and the approved homepage trims: hero chips out, hero stats
into the subtitle, the dock off on home and shop, one "Get the app" label)
is still to do.

**Site-wide pass, 2026-11-09 (approved).** Only 500 and 700 are declared
in globals.css now: every card and row title, in-page section head, pane
head, menu label and status word is `var(--fw-title)`; every H1, display
head and figure (prices, scores, stats, COA numbers) is `var(--fw-display)`.
The shop's "15/600 the thing · 17/600 lead number" scale reads 15/500 and
17/700 (SheetHead stays 17/700). Homepage: the hero chip row and the stat
row are gone, the three counts are a sentence at the end of the hero sub.
The dock (`GetBar.hiddenOn`) is off on `/`, `/shop` and every shop route,
the library hub and its category pages. ONE store label, "Get the app"
(GetAppButton's default, the hero, the page close, the mobile pill).
Articles: no jump-chip row under the takeaways, and the medical notice is
one line in the byline (`.post-byline-note`, blog posts and the library's
`LibraryByline`); the `MedicalDisclaimer` pane survives only on the tools.
`/faq` is a PageShell head (eyebrow Help) over kickers and `.lib-faq`
glass rows (the posts' details anatomy), no legal-document rail.
`not-found.tsx` is the branded 404 (eyebrow 404, the three pillars as
`.lib-filter` chips, a ⌘K hint, the normal nav and close).

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
| `hub`      | `/screens/screen-library.png`     | stack analysis, saved stack             | the Science hub ONLY, never inside a post |

`/screens/screen-meal.png` (nutrition logging) exists but has no variant
yet; add one to `src/app/blog/[slug]/PostCta.tsx` before referencing it.
New variants need: img, alt, title, one-sentence body (no em dashes), and a
`post_cta_*` analytics location string.

## Site architecture (since 2026-11-06)

**Marketplace and nav pass, 2026-11-10 (supersedes conflicting lines
below).** The Shop pillar is LABELLED "Marketplace" everywhere a reader
sees it (nav, dropdown, footer column, eyebrow, crumbs, Pillars CTA, 404
chips, metadata titles, llms.txt, the search index's kind); the `/shop`
URLs, route files and code identifiers are unchanged, and the vendor
profile's "Shop Now" card keeps the app's own copy. The vendor profile's
Sources tab renders the library guide's OWN `Citations` component
(`library/GuideParts.tsx`; `CitationList` wraps it for a guide), so the
two lists are one object; the `.sh-cites` overrides are deleted. NO
filter or tab bar scrolls sideways: `.gtabs` and `.pg-tabs` wrap onto a
second row on a phone (the FLIP thumb is placed from offsetTop, so it
follows), and GlassTabs' scroll-into-view branch is gone. The nav's
SCROLL ZOOM is back from the published site ("navbar zoom bring back"):
past 48px of scroll, re-expanding below 12px (the app's ChatBarCollapse
hysteresis), `.hdr.is-collapsed` lifts the bar to the top, narrows the
row by 160px and drops `--hdr-h` 64 to 56 (the pill, the search circle
and the links' axis follow), over the old fold's 0.42s spring; the
layout, the glass and the single bar never change. The "no collapse, no
transition" line below is superseded.

Four pillars, each copied from a named reference and skinned in this
design system. When a surface drifts from its reference, the fix is the
reference, not an invention. Community Notes is gone (routes, API, CSS).

**At the top of a page there is NO bar (2026-11-10, "navbar quite literally
has to disappear upon reaching the top, it only transforms into the navbar
upon scrolling"): the brand, links, store pill and search mark sit loose
on the page (`.hdr:not(.is-collapsed) .hdr-pill::before { opacity: 0 }`,
the search circle likewise bare), and the glass fades in under them past
48px of scroll with the tightening. `check-glass.mjs` scrolls each page
400px before measuring, or the bar's glass is not there to measure.**

**Nav is ONE glass bar, set out Superpower's way (`components/Nav.tsx`,
built by `NavBar.tsx`).** The bar spans the page's content measure
(`.hdr-row` is `--maxw` minus the gutters, so it starts where `.pg-head`
starts). Left: the brand. Centre, on the PAGE's axis (the line the hub
heads sit on): Library · Science · Shop (`.hdr-links` is absolutely
centred with an offset for the search circle; below 1080px it falls back
into the flow after the brand). Far right, inside the same bar
(`.hdr-acct`, `margin-left: auto`): Get the app, alone. Beside the bar, NOT in it (2026-11-08, by request): the
search, its own round pane on the page at the bar's height (`--hdr-h`),
page glass. Two things were rejected on sight on 2026-11-08 and must
not come back: Get the app inside the link group ("I hate its current
position"), and a two-pill split with a gap between navigation and the
store pill ("not a valid pull"). Fixed, and the same at every scroll
depth: no collapse, no transition (the old fold and its thresholds are
gone). Below 860px the bar keeps the brand, the store pill and the burger,
the search circle stays beside it. **The bar's
glass is `.hdr-pill::before`, never the pill itself.** An element with a
backdrop-filter is a backdrop root, so a dropdown nested in a glass pill
blurs only the pill and the page text behind it stayed readable through
the menu ("elements under it sway what I'm looking at"). Any glass that
contains a blurring child carries its glass on a pseudo-element; the
guard reads `.hdr-pill::before`. Each section opens a dropdown of its
pages on hover or focus (`NavBar.menus()` builds them from the same data
the hubs read: the eight body systems with counts, the Science categories
with counts, the shop tabs). The open label and the hovered row wear the
lit layer; the dropdown and the search panel are the SAME glass as the
pills (`--glass-bg` + blur + `--glass-shadow`). They were solid `--bg`
for a day because the hero's gradient-clipped headline sat sharp through
them; the cause was the hero's entrance animations filling FORWARD
(`both`), which keeps the headline on its own compositing layer for the
life of the page, and that layer escapes every backdrop blur above it.
The hero animations fill `backwards` now and the glass samples the
headline like any other text. Never give an entrance animation a forward
fill when its end keyframe is the resting state. Search (`SiteSearch.tsx`) is one field and one list over
`/search-index.json` (guides, articles, marketplace compounds AND the 42
vendors since 2026-11-10, each row labelled Guide · Article · Compound ·
Vendor; a vendor also matches on its domain; fetched on first open, ⌘K
opens it). Since 2026-11-11 it also lists the site's pages and the 40
calculators (Page · Tool), and matching lives in `lib/siteSearch.ts`:
punctuation-blind ("bpc157" = BPC-157), every query word must hit, prefix
and small-typo matches, filler words dropped, weighted by field (name >
`alt` brand names/domain > `keywords` class/summary > `topic` body-system
everyday words from `SYSTEM_WORDS` in the index route). Calculators carry a
rank penalty so they lead only when the query asks for one. Re-test with a
query batch (brand names, goals, typos, pages) after any change. `NavBar`'s `slot` prop is retired
and ignored; pages still passing a `LibrarySearch` can drop it. FAQ lives
in the footer and the drawer, not the bar.

| pillar | route | reference | data |
|---|---|---|---|
| Landing | `/` | the app's two flows: Finding (goal → plan → tested source) and Tracking (dose, vial, proof) | `Hero`, `Features`, `FeatureRail` copy |
| Science | `/blog` (URLs kept; label changed) | the old blog, rebranded the way popular blogs are set: centred PageShell head, a tab bar that filters in place, a Featured pane, Start here picks, then the blog's three-column glass card grid (`blog/ScienceHub.tsx`, `blog/ScienceIndex.tsx`, `blog/ScienceParts.tsx`); `/blog/category/<slug>` is the hub with that tab preselected | `lib/blogData.ts` |
| Library | `/library`, `/library/<category>`, `/library/<slug>` | superpower.com/guides/peptides | `lib/guides.ts` |
| Marketplace (label; was Shop until 2026-11-10, URLs unchanged) | `/shop` (vendors, graded), `/shop/catalog`, `/shop/<compound>`, `/shop/vendors/<slug>`, `/shop/saved`, `/shop/submit` | peptaura.com for the data, the app's `VendorBreakdownView` for the grading | `lib/shop.ts` |

**One page anatomy (`components/PageShell.tsx`)** for every hub and index
page: eyebrow (hubs) or crumbs (sub-pages), headline with at most one
accent phrase, lede, optional actions line, underline section tabs with
counts, body. The Library is the one exception: Superpower's three-column
hub with a centred glass filter bar (`GlassTabs`: the 8 body systems with
counts, no title) in place of PageShell tabs, and no bar at all on a guide
page. Science tabs = All +
categories; Shop tabs = Vendors + Catalog via `ShopShell` (Saved at the end).
Never give a hub a pill row again. Heads are left-aligned, with ONE
exception: Science passes `align="center"` (head and tab bar on the page
axis, by request on 2026-11-08) and `nav` (a client tab bar in the tabs
slot). The landing
links the three pillars with one hairline stats row (`components/Pillars.tsx`),
and the footer columns mirror the site: Product · Research · Shop · Help ·
Connect. FAQ lives in the footer, not the nav.

Every new route goes in `sitemap.ts`; every hub goes in `llms.txt`; every
new glass surface goes in `scripts/check-glass.mjs`. Verify with screenshots
at 1440 and 390 (`playwright-core` in the scratchpad, see memory).

## The Library (`/library`): Superpower's anatomy

**Changed on 2026-11-09; supersedes everything below, the 11-08 block included.**
- **Colour codes the BODY SYSTEM, never FDA status, in the app's FIVE
  ramps** (Colors.swift; the app has no body-system colours, so its catalog
  categories are the reference): `CATEGORY_TONE` in `lib/guideVocab.ts`:
  brain brown, skin green, hormones warm, immune cool, heart warm,
  digestive gold, sexual brown, bones green (the app's own analogies:
  cognition and sexual health brown, skin and muscle green, metabolism
  warm, recovery cool, longevity gold; no two neighbours alike). An
  eight-colour set adding blue, pink and orange was cut the same day: "far
  too many colors, check app for proper ref". REMAPPED by association the same evening ("make sexual more
  peach ... use psychology", supersedes the brown/green/warm list above):
  Heart dark warm (blood) / Sexual light warm (peach), Brain dark cool
  (calm, night) / Immune light cool (clean, clinical), Bones dark brown
  (sturdy) / Skin light brown (skin tone; leads with the tan middle stop,
  brown's palest stop is olive), Hormones gold (energy), Digestive green
  (food, gut). `CATEGORY_TONE` + `CATEGORY_SHADE` in `lib/guideVocab.ts`;
  `libraryAura(tone, seed, shade)` only re-weights the SAME ramp's stops,
  so it is still five colours. Icons follow the same associations
  (`CATEGORY_ICON`): Immune a shield, Digestive a leaf, Sexual a flame,
  Hormones the flask. The filter bar (GlassTabs) glides on an
  ease-out-quint over 560ms, the outgoing label fades out as a ghost, and
  its ResizeObserver ignores its first call (that call snapped the thumb
  to the new pick on every click, so it never glided). Status is words only (the
  glass tag); the hub's status key is the blog's contents card WITHOUT
  numbers (statuses with counts; a row filters the list, again clears).
- **Thumbnails are auras, not tiles** ("the thumbnail ... need to be a lot
  better, not just the stupid squares"): `libraryAura()` in `lib/aura.ts`,
  the Science covers' technique (CSS radial blobs + the shared grain) in
  the system's ramp, led by its middle and light stops with the darkest
  only a faint depth, a white highlight and one soft sheen, plus a second
  arrangement and balance of stops per compound, ALWAYS within the
  system's own ramp (cross-colour accents were cut as too many colours). Rows
  and the identity card share it. `tileArt.ts` is deleted.
- **The filter bar is the app's `GlassIconSegmentedControl`**
  (`components/GlassTabs.tsx`) made in OUR glass ("segmented should be
  glass made"): the track is the page glass, the thumb the layer glass;
  every option an INK icon (`CATEGORY_ICON`; Science: sparkles, flask,
  bandage, heart), only the pick shows its label + count.
  Motion is FLIP, transforms only: options slide from where they were
  drawn, the thumb glides (iOS curve, 460ms), the label fades up. Animating
  label widths re-laid the bar every frame ("super laggy"); coloured icons
  were rejected (icons stay ink, picked or not).
- **The figure (2026-11-09, late; supersedes the colour and camera rules
  below): a LEAN-IN that never crops, and ONE colour.**
  Superpower was captured headless at 1440 that night: its figure is WHOLE
  at every moment (no close-up on hover or scroll), small in its column,
  nothing cropped, no edge fade, and one mint for the dot, its rings and
  the lit area. Ours had zoomed into busts that overfilled the narrow
  column, so the side mask ate the shoulders and the foot mask dissolved
  the torso mid-chest, in five vivid hues ("the shape of the dummy, the
  fade out sizings, the coloring"). A whole-figure-only cut was rejected
  within the hour ("ur not zooming for specific areas"), a lean-in that
  kept the arms in frame was "terrible zoom", and shots centred on each
  hotspot "just doesn't have the same-ness of superpower's zoom at all;
  copy their angles". So their angles were MEASURED (2026-11-10): a
  playwright-core script (scratchpad `refcam4.mjs` pattern: addInitScript
  hooks `getUniformLocation` and `uniformMatrix4fv` to read
  `projectionMatrix` and `modelViewMatrix`, then wheels their list in
  500px steps and grabs the canvas). Their camera never moves closer: the
  LENS narrows and the aim slides. Whole figure at 6 degrees (their figure
  is 0.69 of the frame, so FULL.half = H / 1.4); Skin 5.7 and Immune 5.35
  (barely in, aim up 0.05 H); Bones 4.0 (aim 0.097 H); Heart and Digestive
  2.5 (aim 0.26 H: crown under a tenth of air, the heart mid-frame, the
  belly low); Hormones 2.3 (aim 0.33 H); Sexual 2.73 (aim 0.235 H there,
  0.18 here because our column is narrower and the pelvis sat in the foot
  fade). Their Brain is the idle whole figure with every ring pulsing;
  ours is the head shot (2.3, aim 0.345 H) because he wants a zoom per
  area. `Z(fov, aim)` in BodyFigure3D builds each shot: half = FULL.half
  x fov / 6, y = H / 2 + aim x H; `view()` allows at most a quarter of
  the frame above the crown and never looks up from below the floor. A
  SHORT side fade (outer 8%, slid off the canvas by mask-size for a
  whole-figure shot) softens the arms leaving a close frame, and the foot
  fade is a mask twice the canvas height whose fade lives in its lower
  half, slid into view by `.is-close` (mask-position transition) and out
  again, so the feet and floor shadow stand clean on Skin and Bones. Never
  again the old 15% side fade and 62% foot fade. Re-measure the reference
  before changing a shot; do not tune by eye.
  Matched side by side on their Digestive frame (2026-11-10, "just match
  the ratio"): the framing ratio already agreed (crown a quarter down,
  belly dot two thirds down); what differed was the GLOW and the fade.
  Zones now paint at 0.62 (pastel half white) with a brighter core, the
  stomach is three ellipsoids about a hand wide (ZONES in the build
  script; re-run it, never edit body-spots.json), and the foot fade holds
  only the last tenth of the frame (gradient from 90%).
  The indicator is REGEN blue again ("the body indicator can always be
  blue"): every zone, the Skin halo, the dot, the ring and the halo are the
  accent; `--cat-*-vivid` is no longer set on a hotspot. Zones keep their
  organ shapes but as LIGHT: a pale tint (0.4) with a faint brighter core
  and a swell of a fifth. A hotspot label goes right and flips left only
  when its measured width would overrun the column by more than 40px (it
  may run into the gap before the list); the old 62% rule put "Immune &
  defense" over the chest. Hidden labels carry no backdrop-filter (moving
  eight blurred labels every frame re-rasterised each of them). Measured
  at 2x after the change: 8.3ms scroll frames with everything on; the
  lag Advaith felt that day was ten orphaned headless Chromium processes
  from earlier agent runs, so kill `ms-playwright/chromium` after every
  agent run before judging performance.
- **The figure lights each system in its colour** (zone colours `uC[]`,
  hotspot `--spot-grad` / `--spot-ink` / `--spot-halo`, the Skin halo in
  skin's green); REGEN blue is no longer the indicator. **Camera = the
  reference's angles**: FOV 6 (near-orthographic), close-ups with the head
  mid-frame and air above, head to hips for chest and gut, head to shins
  for Bones; Skin and Immune sit between their neighbours so the path
  still only descends; Skin shows the WHOLE figure, the reference's widest
  shot and the limit on how far the camera ever zooms out. **The fade is
  invisible by design**: eased multi-stop masks over the foot (from 62%)
  and sides (15%), no top fade; hotspots in the faded foot step away, so a
  framing must keep its own hotspot above it. **Zones are painted organ
  shapes, not glows** ("the highlighted zones need a dire upgrade, they
  look laggy"): one organ's ellipsoids sum into a field cut by a soft
  threshold (one shape, clean soft edge; gaussian pools read as smudges,
  a hard max as stacked discs), filled with a LIGHT pastel of the system's
  ramp (saturated first, then whitened, so brown and cool never go grey),
  at about half strength ("make the highlights less thick") with a slow
  pulse of about a quarter. The hotspot dot, its ring and the picked
  filter icon wear the same saturated colour (`--cat-*-vivid`, CategoryIcon
  `vivid-*` ramps), so a tag matches the light it points at. The porcelain
  carries a little more form than the reference (a tighter key, deeper
  shade and contact shadow) because "it looks a little too flat", with the
  baked normals smoothed 7 passes (`NORMAL_SMOOTH`) so the extra light
  never picks out the torso and waist creases ("way too bumpy").
- **Regen AI links (regen-app)**: backend `functions/src/ai/tools.ts` and iOS
  `ContextCardView.swift` build `/library/<slug>` (renamed and folded
  compounds via `SITE_PATH_OVERRIDE`, blends to `/shop/<slug>`) and
  `/shop/vendors/<slug>` (matched by slug, name or domain, else `/shop`).
  Regenerate both tables from this repo's data when guides or vendors change.

**Changed on 2026-11-08 (evening); these supersede anything below that
conflicts.**
- **The hub is ONE scroll container** (`.lhw`, the screen under the nav;
  LibraryHub): the filter bar sticks to its top, the intro and the figure
  are sticky inside it, only the list moves. A scroll anywhere over the hub
  scrolls the list, and a fast fling ends at the list's last row instead of
  running into the footer (the browser latches a fling to its scroller);
  the next gesture carries on down the page. Below 1160px it is one column
  in the page's scroll with the bar sticky under the nav. The card list is
  memoized: a category change during a scroll re-renders the bar and the
  figure, never 159 cards.
- **The bar is `components/GlassTabs.tsx`** (the shop SegBar's glass with
  links and counts: one page-glass pill, one lit thumb that slides),
  centred, NO "Peptide Library" title ("we have library at the top"),
  rendered inside LibraryHub so the thumb follows the scroll-spy. A tab or
  a hotspot smooth-scrolls the list and holds the spy until it lands.
  `LibraryBar.tsx` is deleted. Science's category filter is the same
  component ("filters for the articles should be strictly our glass").
- **No stats row and no connector lines.** The numbers live in the lede
  ("159 peptides across 8 body systems, from 77 FDA-approved drugs to
  compounds still in trials."; a category page: "15 peptides, 13
  FDA-approved and 2 in clinical trials. <blurb>"). A category page's list
  heading is screen-reader only (the H1 already names it).
- **CATEGORIES run top to bottom of the body** (brain, skin, hormones,
  immune, heart, digestive, sexual, bones; `lib/guideVocab.ts`), so the list,
  the tabs, the nav dropdown and the shop catalog sections all follow it and
  scrolling the list walks the highlight DOWN the body ("seamless build down").
- **Rows slide INWARD on hover** (`translateX(-12px)`, transform only; "when
  a card is hovered over bring it inwards"). Dimming the neighbours was cut
  for its repaints. Row titles and list headings are Medium (`--fw-title`).
- **REJECTED: a chemical-structure-of-cubes artwork** for the rows and the
  identity card (each compound's residues as brand cubes, from a researched
  sequence file): "fuck off with the cube artwork". The hand-set tile
  compositions (`tileArt.ts`) are the art. Do not bring the structures back.
- **The figure (BodyFigure3D)**: the active hotspot is REGEN blue with a
  pulsing ring (3.2s, the reference's keyframes), inactive hotspots are
  GREY and quiet ("dots should gray out when we're not focused on them");
  each system lights its organ as soft breathing light (cranium, the face
  and a silhouette halo for Skin, thyroid, thymus + armpit nodes, a
  heart-shaped patch, stomach/liver, the pelvis; Bones & muscles lights
  shoulders, upper arms, thighs, knees and shins, using the last of the 24
  zone slots), never a vague region; the finish is matte (no specular, no pearl rim); pixel ratio
  1.5 at most. The Skin halo is drawn BEFORE the body (opaque pass, custom
  blending, no depth write): drawn after it, the inflated shell showed
  through the eye sockets, nostrils and lips as blue makeup. **Framing
  widens down the list** (`SHOTS` with a per-shot width the column must
  hold: head and shoulders at Brain, head to hips at Heart, the whole
  figure at Bones). Tight close-ups for every system were rejected: "the
  body zoom got fucked, it's all jammed in one place". **No nipples**: the
  build fits a quadric to the chest around each nipple and sets the patch
  onto it; a thin-plate smoothing fill settled under the pec's dome and
  read as inverted nipples (rejected). "open edges: 0" still holds.
- **Guide page**: the tick rail is placed from the grid's own edge and the
  identity card sits exactly midway between the rail and the article
  ("the card in the midpoint between the lines and the citations"). The
  current crumb is ink on every page (`.crumbs [aria-current="page"]`).

**Structure is superpower.com/guides/peptides, exactly.** Eight body-system
categories (`CATEGORIES` in `lib/guides.ts`: Brain & sleep, Skin & aging,
Digestive & weight, Immune & defense, Hormones & metabolism, Bones &
muscles, Heart & blood, Sexual & reproductive). Four status labels
(FDA-approved · In clinical trials · Not FDA-approved · Cosmetic and
topical). Five evidence ratings of the HUMAN research (FDA approved · Deep ·
Moderate · Limited · Low research). Guide anatomy: identity card (status
dot + label, category, H1, "Also called", Evidence, Class) in the rail,
then Key takeaway, byline (REGEN Research · citations · published ·
updated), At a glance (EXACTLY 4 rows: FDA status, the two most useful
facts by `GLANCE_PRIORITY`, Evidence strength last), then the reference's
outline and nothing else (`guideSections()` in `library/[slug]/page.tsx`):
"What is X?", "How does X work?", "Is X FDA-approved?" (timeline + the
grey Status box, which drops its own "FDA status" row because At a glance
opens with it), then "What is X prescribed for?" + "What are the side
effects?" for an approved drug or a cosmetic, or "What does the research
show?" for everything else, and an "X vs Y" section only when it carries a
table. Then the Evidence strength box, ONE related list ("More for
<category>": the relatives the guide names first, then the body system,
six at most, same category only), Citations, disclaimer. The generator's
history sections and topical extras ("sold online", "sport", 47 + 15 + more
guides) are not rendered: "we just do way too much" (2026-11-07). The
separate "Also in the library" list was folded into "More for"; two lists
of peptides at the foot of one page "doesn't make sense". **No dosing, no side effects for research compounds,
no S-F grades, no PK charts, no stacks, no chapters, no contents rail.** If
Superpower does not have it, the library does not have it. The app catalog
KEEPS those fields (dose cards, reconstitution math, the reference card);
only the web stopped rendering them.

**Status is a dot AND a label, painted with the app's own ramps** (approved =
green, in trials = gold, not approved = warm, cosmetic = cool; `STATUS_TONE`
in `lib/guideVocab.ts`, re-exported with `CATEGORIES` by `lib/guides.ts`). No new colour; the colour never stands alone.
**The hub (`library/LibraryHub.tsx`) is three columns**: intro + status key
(sticky), the body (sticky), the compounds per category (scrolling). Scroll-
spy sets the active category; the active hotspot lights and the glass
bar's thumb slides to it (the hairline connector was removed on 2026-11-08:
"the lines can be removed, I find them useless"). **The body is a real anatomical mesh, loaded** (`library/BodyFigure3D.tsx`,
since 2026-11-07). Two hand-built figures were rejected next to the
reference's sculpted one: a raymarched blob, then an anatomical SDF
mannequin ("still looks like a clay project from the third grade", "looks
like jack shit still"). Primitives cannot carry a face, hands and feet; a
sculpted mesh is the floor. The mesh is the MakeHuman base mesh (CC0 1.0,
per makehuman's LICENSE.md: "The base mesh and proxies ... have been
released under CC0"), body + eyes only, posed with MakeHuman's own default
skeleton and skin weights (also CC0) by `scripts/build-body-mesh.mjs`.
**The figure is a MAN** (MakeHuman's male-young ethnic targets mixed a third
each, max muscle at AVERAGE weight at exactly 1, plus a light touch of
torso V-shape 0.28, waist 0.25, hip width 0.18, hips 0.14, flat stomach
0.21, stomach tone 0.21). The bar is a REAL athletic man, an ordinary
athletic base mesh ("something like this is more practical, I don't like
this fictional bullshit"). Rejected side by side on 2026-11-08: the lean
(minimum-weight) muscle target (bulges the front of the hips), muscle past
1 ("fat and disproportionate", wide waist and frame), a strong V-taper (a
comic-book torso). Then 3 passes of Taubin smoothing (`SMOOTH`): takes out
wobble without shrinking the form; 6 passes erased the muscle).
**Clavicles are drawn twice from one line** ("add proper clavicles";
MakeHuman has no target for them): the build sculpts the broad form along
the skeleton's clavicle bones, extended to the point of the shoulder (and
the AO bake picks up the hollow), and writes that line to
`body-spots.json` as `clavicles`; the shader draws the crisp ridge and the
hollow above it from the same line as a normal perturbation (`clavH()`),
because the base mesh's ~1.5cm spacing cannot carry a 1cm bone (the first
sculpt moved 30 vertices and showed nothing): the reference's is a woman, and a
woman in the same porcelain read as a copy of theirs. Arms
lowered from the A-pose to hang at the sides (linear blend skinning, the
turn spread clavicle 20% / shoulder 35% / upper arm 45% so the shoulder
rolls instead of kinking), elbows straightened about each arm's own hinge
axis (upper arm x forearm) to a relaxed 14 degrees, so the hands hang at
the thighs instead of reaching forward palms up once the figure turns,
fingers curled gently toward the palm (each segment about its own axis:
segment direction x palm normal; more read as claws), arms 86 degrees off
horizontal, legs in 6 degrees ("needs to look a little less awkward"). The script fetches the three
source files from a PINNED commit into `node_modules/.cache/makehuman/`,
writes `public/library/body.bin` (251 KB: Int16 positions quantised to
the box, Uint16 indices, then a u8 of baked AO per vertex) and `src/app/lib/data/body-spots.json` (one surface
point per body system: the front-most vertex near a target). Re-run it to
change the pose or the hotspots; never hand-edit either output. It prints
`open edges: 0`: the mesh is watertight, and that must stay 0 after any
change.
`scripts/check-glass.mjs` launches Chromium in the NEW headless mode
(`headless: false` + `--headless=new`, still no window): the old mode has
no WebGL with the repo's playwright-core 1.62, so the figure fell back to
the flat SVG and its glass label was never there to measure. The old
"do not bring a rigged model back" referred to a Mixamo GLB rejected on
sight; this is a static posed mesh in our own material, not a rig. Render:
three.js mesh, MSAA, BAKED AMBIENT OCCLUSION (the build script ray-casts 72
cosine rays per vertex over a grid and appends a u8 per vertex to
`body.bin`; it is what darkens the chin, armpits, arm-flank gaps and
between the legs: without it the figure read as "a shadowless dummy"),
a studio key from HIGH AND TO THE SIDE (a key on the view axis lit every
front surface alike), a smoothstep terminator, edges that fall into shade
on the dark side, a ShaderMaterial in LIGHT GREY porcelain ("the dummy
can be a bit darker": lit side ~#f0f1f3, shadow side a cool grey, pearl
rim, faint broad specular). **The indicator is always REGEN blue** ("the
body indicator can always be blue"; this reverses the earlier green-ramp
and status-tinted rules): hotspots wear `--accent-grad`, the zone light
is the accent's lighter stop (`#5a74ff`), and the entrance scan band is
blue. **Each body system lights a ZONE as light, not paint** ("the glow
needs to be more modern"): a gaussian pool of blue on the surface inside
the system's ellipsoid (`SPOTS[slug].zone`, model space so it turns with
the body), brightest at the core, plus light along the silhouette inside
it; `rim` weights edge over pool. **Every system has its own WEIGHT**
(`uZp[i].z`), faded in over 0.55s and out over 0.75s, eased at both ends, so
a change is a crossfade ("transitions smooth, highlighting smooth"). Never
go back to moving ONE zone's centre and radius between systems: brain to
Skin swelled a blob across the torso. **Whole-body systems are their own
case**: Skin lights the whole outline (rim 0.9), Bones & muscles the limbs
through a mask with LONG soft edges (a hard cut at hips and shoulders read
as paint), and both (`whole: true`) sweep a soft band of blue crown to feet
(`uSweep`, 2.4s, again every 4.2s) so "all of you" reads as all of you.
Screenshots catch the band only by timing; it works. Keep a zone tight to its
organ: a head-sized brain zone painted the whole face blue; the cranium
alone reads as the brain. The active dot carries a soft bloom of light
(`.bf3-spot::before`, faded in on `.is-on`, never popped). **The camera FRAMES the active system**
("do more dynamic zooming based off the area"): each system has a shot
(`SPOTS[slug].shot`: centre height and half-height), a close-up on the
head for Brain & sleep, head and shoulders for Hormones, the chest for
Heart, the whole figure for Skin and for Bones & muscles, every move a
critically damped SPRING (velocity carried, so it eases in as well as out;
an exponential ease lurched at its start) so a scroll flows region to region. On mount the whole
figure is shown while the scan runs (bringing each hotspot in as it
passes, `data-in`, an attribute React does not own), then the camera
flows in. Spots out of frame step away with those on the far side
(`data-back`), and the floor shadow fades in a close-up (`.is-close`).
There is NO "Drag to turn" hint ("pretty self explanatory", removed
2026-11-08); the cursor (grab) and the aria-label say it. **Left alone it SWAYS** a few degrees either side ("have
the body slightly rotate to show the responsiveness"); a drag or the arrow
keys turn it by hand, the sway holds off for 6s after a touch, and 4s after
letting go it eases home. So the scene draws continuously while on screen;
a reduced-motion page has no sway and draws only until its eases settle.
The mesh and three.js load only above 1160px (`matchMedia` in LibraryHub),
and `resize()` ignores a 0 x 0 column. **Hotspots are TINY**, the reference's
scale ("tiny little dots look a lot more attractive"): a 7px centre in an
18px halo (also the hit area). Every hotspot carries its
label AND count; the active one shows it, the rest on hover or focus; the
label is PAGE GLASS ("tags need to be glass"). The connector to the
category heading is snapped to half pixels (`crispEdges`), so the 1px line
renders sharp, with a small dot at each end ("lines need to be more
pointy"). A change of category SLIDES the line (`glide` in LibraryHub: the
ends carry an offset from where they were drawn that eases to zero over
520ms); only the offset animates, so a scroll still tracks exactly. It
used to blink out and jump.
`BodyFigure.tsx` (flat SVG) is the fallback when WebGL or the mesh fails;
plain headless Chromium renders the WebGL figure, so screenshots show the
real one.

**Rows are the identity card in a row, never the reference's tiles**
(`library/LibraryCard.tsx`). The first cut copied Superpower's tile
(liquid-still artwork, a 3px status bar, a tinted slab) and was rejected as
a rip-off; the bare app row that replaced it was "so bare bones". A row is
now one page-glass pane: the BRAND TILES in the status ramp on the left
(`tileRowArt()`, a static 2:1 variant of the identity card's art: no glass
tile and no drift, because 159 rows of backdrop blur and animation is the
expensive kind), then the name, a plain status dot + label, and the class
SIMPLIFIED ("the cards are a little overwhelming, simplify those"): the
name, then the status as a small LAYER-GLASS tag with no dot ("the
FDA-approved tags don't need the circle"; the tiles carry the colour), no
class line. The identity card's status uses the same glass tag. **The art is
HAND-SET COMPOSITIONS** (`ROW` / `CARD` in `tileArt.ts`, 2026-11-08): five
arrangements drawn like layouts (constellation, steps, keys, orbit, row),
four or five tiles on a row, five or six on the identity card (one clear
glass), picked per slug by bits 11+ of the FNV-1a hash (the low bits
barely vary); only the lean varies within one. No overlaps, no crops, and
leave room for tilt and drift. Rejected on the way: six random layouts with
up to seven tiles ("too funky"), one tile at a random spot ("random blocks
in the middle of nowhere"), a giant tile cropped by the edges (a slab), and
a fixed pair ("I don't like the two square thing; as many squares as you
want, change it around"). The art panel paints a soft wash of the ramp, divided from the text
by a SEAM (`--glass-seam` dark line + `--glass-hairline` white beside it, a
bevel: the white alone was invisible). **The card is one glass pane, colour
panel included**: an inset shadow paints beneath children, so the art hid
the rim and the left half read as a slab; `.lc::after` / `.gi::after` carry
`--glass-rim` + `--glass-inner` above the art. **Colours are the app's,
verbatim**: tiles wear `--cat-*-v` (Colors.swift's three-stop vertical
ramps; `--sq-gold` is the landing's and is NOT the app's yellow), the key's
dots the ramps' MIDDLE stop (`--cat-*-mid`; the top stop read too dark). `.lc` carries `min-width: 0` and `.lh-cards` a
`minmax(0, 1fr)` track: a long nowrap name otherwise pushed a whole
category's track wider than its column. Rows sit `--s-md` apart;
categories `--s-xxxl + --s-lg`. **The identity card (`.gi`) is big, as the
reference's is**: a 460px column, a 5:4 artwork panel of the same brand
tiles (the composed pair plus one clear layer-glass tile, drifting on
`cta-drift`; `library/tileArt.ts`), then the app's header
block (status dot + label, the body system, a 40-60px H1, "Also called",
Evidence and Class over a hairline, Compare vendors). Tile positions are
rounded to 0.01: `Math.sin`/`Math.cos` differ in the last digit between the
server's V8 and the browser's, and an unrounded style string was a
hydration mismatch on every card. **Status is a PLAIN DOT, the reference's
system** ("they're not orbs, copy that system"): inside `.lib-shell` the
`.lib-orb` is a flat 7px dot of the ramp's middle stop (`--cat-*-mid`), no halo, no
gradient, always beside its label; it now appears only in the status key
(four stacked rows), since rows and the identity card carry status as a
glass tag. **The hub and its bar run wider than the site**
(`--lib-maxw: 1480px` on `.lb`, `.lh`, `.gp`; "superpower just widens the
elements a lot more"). **The bar is the glass filter (`GlassTabs`)**,
since 2026-11-08 (it was underline tabs before), shared with Science.

**The guide page carries no library bar.** The category tabs on a
breakdown were questioned on sight ("idk why there are the category tabs on
the breakdown level"); the crumbs name the category. The glass bar renders
(inside LibraryHub) on the hub and the eight category pages only. The guide's main column has
more air than the reference's: `.gp` gap `clamp(40px, 4.5vw, 72px)`, the
takeaway and the Status and Evidence boxes padded `--s-xxl`, the byline a
hairline strip, section h2s `--s-xxxl + --s-md` above.

**The dock (`GetBar`) never shows on the hub or a body-system page**
(`hiddenOn()` in the component; "get regen cta has to go on this screen"):
the figure and the status key own the bottom of that screen. It still
shows on guide pages, compact everywhere: 760px pill, 34px icon tile, 41px
button, two short lines.

**The hub intro's stats row was removed on 2026-11-08** ("can go to hell
and just be moved into the subtitle to maintain minimality"): the same
three numbers are words in the lede.
The hub is three columns only above 1160px (their minimums need it; below,
one column, no figure), and the list track is `minmax(0, 1.25fr)` so rows
are never clipped by `main.app`'s `overflow-x: clip`.

**URLs are flat:** `/library/<slug>` for a compound, `/library/<category>` for
one of the eight. The old `/library/<category>/<peptide>[/<chapter>]`,
`/library/how-we-grade`, and `/library/all-peptides` 308 in
`next.config.ts`; renamed compounds (hcg → human-chorionic-gonadotropin)
come from `guide-seed.json` so a rename there is a redirect here.
`/library/learn/*` is DELETED (2026-11-10, "they go to hell"): pages and
`lib/libraryLearn.ts` removed, both URLs 308 to `/library`, the blog posts'
inline links to them unwrapped to plain text.

**Data pipeline.** `data/guide-seed.json` (152 reference compounds + the
catalog's extras, built by `scripts/build-guide-seed.mjs` from a crawl of
the reference index; only the factual layer is taken: which compounds,
category, status, class). A catalog compound that is a reference compound
under another name is an ALIAS in that script, never a second row: SNAP-8
is acetyl octapeptide-3's trade name and was listed twice until 2026-11-07
(`"snap-8": "acetyl-octapeptide-3"`); the alias puts the catalog slug on
the reference row as `catalogSlug`, and `next.config.ts` turns every such
pair into a 308 at the flat address too (`/library/snap-8`), skipping any
catalog slug that is itself a page. An index row takes its category and
status from the GUIDE when one exists (the generator researched them), so
a row can diverge from the reference on purpose: bremelanotide and PT-141
are Sexual & reproductive (the reference files them under Brain), and every
antimicrobial is Immune & defense (vancomycin and echinocandins were Heart,
bacitracin, daptomycin and dalbavancin Skin; moved 2026-11-10; the shop's
`shop-compounds.json` category was patched to match because
`build-shop-data.mjs` needs regen-app's untracked `data/catalogs`);
enlicitide is Heart &
blood here (a PCSK9 inhibitor; the reference files it under Digestive),
and the compounds whose trials ended (aviptadil, larazotide, murepavadin,
PN-943, the trofinetide predecessor programs; plus davunetide, selepressin
and efpeglenatide since the 2026-11-10 fact-check: no active US trials,
efpeglenatide's Korea approval stays in its status rows) read Not
FDA-approved where the reference still says In clinical trials. Category counts therefore
differ from the reference's by the seven catalog-only extras plus that one
move. `bundle-guides.mjs` prints every such override (`override <slug>:
status a -> b`) so none is silent. Catalog slugs the seed maps to `null`
(the no-DAC CJC-1295, the five blends) 308 to `/library/cjc-1295` or their
`/shop/<slug>` comparison (`EXCLUDED` in `next.config.ts`), never to a 404
→ `data/guides/<slug>.json` (one per compound, still UNTRACKED in git as of
2026-11-07: commit the directory with the bundles or a fresh clone bundles
zero guides;
written by `scripts/build-library-guides.mjs`, Claude with web search, every
citation checked live against Crossref / PubMed / the page; or by writer
agents against the same validator) → `scripts/bundle-guides.mjs` →
`data/guides.json` + `data/guide-index.json` (the static imports). An
index row without a guide still links, to the compound's brief page
(identity card + reference facts, noindex), dimmed with `is-pending`. The
guide page finds its shop compound through `catalogSlugFor()` (the guide's
own `catalogSlug`, else the index row's), which is how an aliased page
like acetyl octapeptide-3 keeps its Compare vendors link to `/shop/snap-8`.
Guide text is cleaned ONCE at load (`cleanGuide`), the catalog's dash rule.
Citation markers are `[n]`; a marker whose source failed verification is
stripped at render so no number ever points at nothing.

**Catalog (`lib/library.ts`)** still powers `/tools/*`, the calculators,
and the app-facing facts. Never hand-edit
`src/app/lib/data/library-peptides.json`; re-run
`node scripts/build-library-data.mjs`. `hrefFor()` now returns the flat
guide URL via the seed, or `/library` for blends and variants with no page.

## The Shop (`/shop`): a comparison and a handoff, not a store

Peptaura is the reference for WHAT is on the page (vendor rows with price
per mg, COA, batch, code; ranked vendors). It is NOT the reference for how
it feels: Peptaura is a store with a cart and checkout, REGEN sells nothing.
The first build copied the store (stacked cards, quantity steppers, Add to
cart, accent on every selection) and was rejected on sight ("a stacked
material shit show"). The second build had five tabs (Catalog · Vendors ·
COAs · Labs · Verify) and was rejected as clutter ("I just wanted two simple
sections: one place to search, another place to source"). Since 2026-11-07
the shop is TWO pages and a saved list:

| tab | route | what it is |
|---|---|---|
| Vendors | `/shop` | who to buy from: the top three on a podium, the other 39 as quiet rows in one pane, all ranked AND graded |
| Catalog | `/shop/catalog` | what to buy: one pane per section (Most stocked, then the body systems), each a grid of equal hairline cells |
| Saved | `/shop/saved` | the packs a reader picked, grouped by vendor with the code |

`/shop/vendors`, `/shop/coas`, `/shop/labs`, `/shop/verify` 308 to
`/shop` (`next.config.ts`); the certificates and labs live on each vendor's
profile now. Do not add a third tab. The rules that survived:

- **One skeleton on every shop page** (`shop/ShopShell.tsx`): left-aligned
  head (eyebrow or crumbs · H1 · lead · optional actions line), the two
  underline tabs with counts (Vendors 42 · Catalog 55) and Saved at the far
  end, then the body. Nothing sits outside it; nothing is centred.
- **Lists live in ONE pane** (`.sh-pane`, page glass), rows divided by
  hairlines, never a stack of cards. The one exception is the podium on
  `/shop`: three panes for the top three, because the reference sets its
  top three as cards and Advaith asked for the top vendors to be
  "prioritized" over rows that "look ubiquitous". All three are the SAME
  glass: an ink first step was tried and rejected ("card colors have to
  be ubiquitous"). Every pane on the site is the one glass; no surface
  gets its own colour. Tables (`.sh-table`) survive only for a vendor's
  certificates and its catalog.
- **The catalog is a grid of equal cells** (`.sh-pane--cells > .sh-cells
  > .sh-cell`), the reference catalog's frame: name on one line (cut with
  an ellipsis), "from $x per mg", then two tracked facts (variants,
  vendors). Cells draw their own top and left hairlines and the grid is
  pulled up and left by 1px so the pane's edge hides the outer lines
  whatever the last row holds. Tiles with size chips and a stats row were
  rejected ("tags for mg, variants and heights of the peptide cards are
  all over the place"); nothing in a cell may vary in height. Four across,
  three at 1080, two at 600.
- **Facts are WORDS on a line, never pills.** The pill tag cloud and the
  row-scale pillar bars were cut on 2026-11-08 ("tags and rating bars
  look so clunky and cluttery"). A vendor's record is `vendorFacts()`
  (`Facts`: "Third-party tested · 81 public COAs · 3 named labs", dots
  between) and `vendorStats()` (`Stats`: a number over its label, the
  reference's Reviews · COAs row). `strengthTags` / `watchoutTags` still
  feed the profile's "What holds them back" copy; they are not rendered
  as chips anywhere.
- **Every control on the shop is the site's own chip.** The dose-per-vial
  filter, the sort, and a vendor's packs are all `.lib-filter` (the
  library's glass pill); the picked one is its `is-active` state, the lit
  layer with the heavier stroke. Bordered squares and bordered pack boxes
  were tried and rejected ("not colored or styled like the rest of the
  site, looks like you injected some new piece"). Never draw a control
  the site does not already have. The accent appears once on a page at
  most: the vendor profile's "Visit" button in the strip (the one buy
  path), nowhere else. The way out on a compound page (`.sh-get`) is INK,
  because twenty accent pills down a column read as decoration.
- **The compound page is one block per vendor, not a table**
  (`shop/VendorOffers.tsx`, rebuilt 2026-11-08 after "too cluttery").
  The size chips with the count and sort at the row's end, then one pane
  with one hairline row per vendor (merged across its products): rank ·
  mark · name · seal · facts line | its packs as chips (one
  line each: pack · price · per mg; pick one and Save / Get it follow it;
  the tail folds behind "+n more" past four) over a Latest COA · Archive
  purity · Code line | Save · Get it. Nine columns of small type read as
  a spreadsheet.
- **The catalog is organised the library's way** (`catalogSections()`):
  Most stocked (8), then one section per body-system category in
  `CATEGORIES` order, then "Other compounds" (no guide row), Blends (2+
  vendors only), Essentials. The category is the library's own, read from
  `guide-index.json` at build time (the seed only as a fallback; a
  catalog-only compound has a null seed category) and written as `category`
  on `shop-compounds.json`, never matched at render. Fix a category in the
  guide, re-bundle, then re-run `build-shop-data.mjs`.
- **"Saved", not "Cart"** (`lib/cart.ts` storage): no quantities (that is
  the vendor's checkout). `/shop/cart` 308s there.
- **No sign-in, no accounts, no orders (cut 2026-11-08).** "We're not
  doing orders anymore, it's just going to be more of a vendor platform":
  the Log in button, the avatar menu, `/account` (308 to `/shop`), the
  Firebase SDK, the account sync of Saved and the checkout history are all
  gone. Saved lives in this browser only. Every exit to a vendor still goes
  through `shop/HandoffLink` (new tab, `nofollow sponsored`), which records
  nothing. Do not bring a login back without being asked. Saved's empty state is the words "Nothing saved
  yet" and nothing else (a three-step guide was rejected).

**The vendor profile and the compound page, 2026-11-10 (supersedes the
profile, strip, tabs, rail and compound-page bullets below).** Advaith:
"so much fucking information and doesn't actually show the user
information the average person would find valuable about a vendor, makes
it appeal to the wrong person"; the compound page's top bar "same thing,
just make it ubiquitous and more well designed". Both pages now open the
same way:

- **Head** (ShopShell): crumbs, mark + name + seal, one plain sentence,
  "#n of 42 · domain".
- **The answer strip** (`AnswerStrip` in `shop/VendorParts.tsx`, `.sh-answers`,
  one pane on both pages): the questions a buyer asks, answered in WORDS
  (`vendorAnswers()` in `lib/shop.ts`): Is it tested? ("Third-party
  tested, 43 public COAs, 2 named labs" or "No public testing") · Who runs
  it? ("Named company in United States, since 2019" or "Operator not
  disclosed") · What do people say? ("4.3 of 5 on Trustpilot, 177 reviews"
  or "No reviews on record") · What does it cost? (`priceWord()`: "Cheaper
  than most" / "About average" / "Pricier than most" / "Prices not
  readable"). The score ring and its band word lead the strip, ONCE; the
  one accent Visit button ends it. A cell is a 13 subtext question over a
  17/500 answer; a missing record is `lib-none` grey. The compound page
  fills the same strip with Lowest price · Who sells it? · Vial sizes ·
  Tested vendors, and Read the guide as the glass button.
- **The list (/shop) speaks the same four answers** (2026-11-10, "the main
  page, still cluttery as hell"): the podium card is rank, mark, name,
  the ring with its band, then the four answers two by two under a
  hairline (`.sh-podium-answers`, `vendorAnswers(v, true)` for the short
  wording: "43 COAs", "United States, since 2019", "4.3 on Trustpilot,
  177 reviews"); the directory is ONE head row of the four questions
  (`.sh-dir-head`) then a row per vendor: rank, mark, name, ring, four
  answers in 13px words. Taglines, the facts line and the COAs/reviews
  stats are gone from the list; the lede is one sentence of the same four
  words. Below 1080px the answers wrap into one dotted line under the name.
- **The one accent Visit button sits on the rank line** (`.sh-head-actions`,
  "#1 of 42 · domain · Visit"), so the strip stays ONE line.
- **SUPERSEDED the same night: the record is in TABS** ("vendor breakdown
  has to be split up into tabs and the sources has to look like citations
  in library"). `shop/VendorTabs.tsx` (recreated) under the AnswerStrip in
  the main column, the library guide's `.gt` underline bar: Overview (the
  sheet + The brief) · Certificates (n) · Catalog (n) · Sources (n); the
  rail stays beside every tab. Panels render hidden, not unmounted
  (`.sh-tabpanel[hidden]` must stay `display: none`, the panel's grid
  overrode the attribute once); #certificates / #catalog / #sources open
  their tab. No caps inside tabs; Certificates notes "The latest 5 of 81"
  when the research captured fewer rows than the count. Sources is the
  guide's Citations view verbatim: bare list, no card or head, grey line
  "Publisher · host" (`sourceLine()` + `PUBLISHERS` in the vendor page; the
  vendor's own domain reads as the vendor). Counts hide under 480px so the
  bar stays one line. The rail holds ONLY the code card, sticky under the
  nav (Testing / Operator / On record beside every tab read as a "random
  card"); those three are the last pane of Overview (`.sh-company`, Testing
  and Operator side by side, the record under both). The two-column layout
  below still describes each tab's contents.
- **Then the record, OPEN on the page, in two columns** (`.sh-prof`:
  main column + 320px rail). Main: ONE sheet (`.sh-sheet` with hairline
  `.sh-sheet-sec`s: The verdict at 18/500, Scorecard as the four ink
  pillar rows, The trade as two columns, Price with the rail), then The
  brief (only when a verdict exists above it), Certificates (the COA read,
  its component rows, the certificate list), Catalog, Sources (the
  library's Citations). A long list shows its first rows (6 certificates,
  8 compounds) and the rest open behind ONE `.sh-cap` chip ("Show all 33
  compounds"), which disappears once opened. Rail: the Shop Now code card
  (or a "No REGEN code" pane), then one sheet of Testing (labs, purity,
  scope), Operator (entity, location, contact) and On record. Sections
  keep their ids (#certificates, #catalog, #sources) as plain anchors.
  REJECTED the same day: a cut that folded all of it into seven identical
  `details` accordion rows under the strip ("why does it still look like
  ass"): the page read as empty. Fold only what is long; never the record.
  `VendorTabs.tsx`, the Highlights grid, the stats strip and the facts
  rail are deleted; nothing above the fold may carry a number that does
  not answer one of the four questions.
- **The compound page's list** (`VendorOffers.tsx`): one SegBar row (vial
  size, the sort at its end, no count), then one pane with one row per
  vendor: rank · mark · name + seal · ONE fact line in a buyer's words
  ("Third-party tested · 81 COAs · 4.9 on Trustpilot") · the picked pack's
  price as the lead number with "1 vial · 10 mg · $6.00 per mg" beneath
  and the row-scale pack SegBar when there is more than one · Save · Get
  it. The header row, the Testing column, batch numbers and archive purity
  are gone (the profile holds them).

**Vendors are ranked AND graded, in the app's own scorecard anatomy.** The
2026-11-06 "never graded" rule was reversed on 2026-11-07 ("I need the
charts and gradings layered perfectly"). Every vendor surface renders the
app's `VendorBreakdownView` / `VendorScorecard`, ported in
`shop/VendorParts.tsx` with the derivations in `lib/shop.ts`:

- **The score** is reptides' four-pillar rubric (voice · age · scale ·
  labs, 0-10 each; `scores` when recorded, else `derivedPillars()`, the
  app's exact fallback). The overall is `effectiveScore()`; the band word
  (Excellent / Strong / Good / Average / Weak) and the ring's ramp (green
  >= 7, gold >= 4, warm) come from `scoreBand()` / `scoreRamp()`.
- **The scorecard** is a score ring (`ScoreRing`, SVG, round caps, the
  ramp's own end stops via `--cat-*-top/tip`) plus four pillar tiles
  (`PillarTiles`: a 44px block rising 26 + 46 × value/outOf on a 72px
  track, value, lowercase label). The SAME tile draws the COA components
  at `outOf={100}`. The podium card carries the ring at 52px with the
  band word; the directory row carries the ring at 38px, public COAs and
  reviews as numbers; the profile carries the ring once, in the strip,
  and the four pillars as ink rows (`PillarRows`) in the Scorecard pane.
- **One type scale on every shop surface, no exceptions.** Pane section
  head = `SheetHead` (17/700 title, 13 subtext note); the thing a row is
  about (vendor, compound, certificate, source) = 15/600 ink; what
  qualifies it = 13 subtext; column labels = 12 subtle; a lead number
  (price, highlight, stat) = 17/600. A second card-head style (16/500 with
  a stroke) beside `SheetHead` was the "bolded vs not bolded" complaint;
  it is deleted. Before adding any text style to the shop, use one of
  these five. Hovering any link or linked name turns it `--accent`, no
  underline (the site-wide rule).
- **Every profile tab is a sheet** (`.sh-sheet`: one pane, `.sh-sheet-sec`
  sections with hairlines): Overview (Highlights from `proofFacts()`,
  Scorecard, The trade, Price, The brief, On record), Certificates (COA
  read, then certificates as rows), Catalog, Sources (fourth tab, only when
  there are sources). A store whose catalog could not be read gets a real
  empty state with a way to its own site, never a grey sentence ("catalog
  isn't loading"). The rail opens with the app's "Shop Now" PromptCard (`shop/CodeCopy.tsx`,
  ported 1:1 from VendorBreakdownView on 2026-11-08: the 40px mark, "Shop
  Now" with its arrow, "Copy code REGEN for a discount at checkout", the
  accent Copy pill whose label never changes, and the app's "Link code
  copied" glass toast, portalled to <body> because a fixed element inside a
  backdrop-filter is fixed to the card); then one sheet: Testing, Operator.
  This adds a second accent button to the profile (Copy beside Visit), by
  request ("a lot more our app like").
- **Label selectors are scoped by class**, never `span span`: that pattern
  matched the number inside the score ring and greyed it.
- **The compound page is one aligned grid with a header row** (Vendor ·
  Price · Latest COA · Purity · actions). Price = the picked pack's price
  as the lead number, size and per mg beneath, other packs as row-scale
  chips without stroke (fold past four). Save and Get it are ICON buttons
  (bookmark on the layer, accent when saved; arrow on an ink disc). No
  subtitle links line under the lead.
- **A vendor's Catalog tab always shows the store's catalog, never a
  link away** ("open Amino Club, no, fuck that"). `storeCatalogFor()`
  picks the best honest source: `live` (packs, sizes, per mg from the
  product pull), `listing` (the store's own product list from its
  `/llms.txt`: name, starting price, product link, pulled by
  `scripts/pull-store-listings.mjs` into `shop-listings.json`, with the
  shop's cleaning rules: no sprays, mists, water or blends), `coas` (the
  compounds it publishes certificates for, no prices), else the tab is
  not drawn. The tab carries its count. Only Amino Club publishes a usable
  listing today; re-run the script when the vendor set changes.
- **Overview opens with The verdict** (the research's takeaway, 18/500),
  then Highlights, Scorecard, The trade, Price, The brief. The blue-ruled
  Takeaway quote at the bottom was rejected.
- **Sources is the library's citation list** (`.gd-cites`: number, title,
  host and path, arrow), the same object as a guide's Citations.
- **The compound page opens like a vendor profile**: crumbs, title, lead,
  then a strip (lowest per mg, vendors, vial sizes, certificates on file,
  Read the guide as glass), no shop tabs. Vial size and sort are segmented
  bars (`shop/SegBar.tsx`: one page-glass pill and ONE lit thumb that
  SLIDES to the pick, measured from the picked button; never a pick that
  teleports), not loose chips or a dropdown. A vendor's packs are the SAME
  bar at row scale (`SegBar small`: on the layer, white thumb, fitted to
  its contents), labelled by vial count, or by price when the store never
  states the count; loose pack chips were rejected ("look like ass"). Footnotes run the full content width
  (a 72ch cap stranded them in the corner); their links are the Science
  article's body link (accent gradient text, soft underline). No Submit
  button in the `/shop` header (rejected); the footnote link is the way. The
  catalog has no search field of its own (the nav search and ⌘K cover it). Columns: Vendor · Price · Testing (COA date,
  batch, archive purity) · actions. Get it is the ACCENT disc, like Get
  the app; Save is glass.
- **The order IS the score.** `SHOP_VENDORS` sorts by `effectiveScore()`
  descending (the pipeline's `rank` only breaks ties) and rewrites `rank`
  to the position, so no vendor ever sits above a higher ring. Ranking by
  the pipeline's own order put an 8 below a 6.8 ("shows our inconsistency
  as a platform").
- **Bars are the signature blue.** Pillar rows fill with the accent ramp
  run across (`#1135ef` to `#7288ff`); the price marker is the accent
  dot. Ink bars were rejected ("black just isn't the type of bar color we
  use").
- **No tier letters anywhere.** `tier` stays in the data and is NOT
  rendered: S to F discs were cut on 2026-11-08 ("fuck off with tiers,
  please, I beg you"; "placing the vendors is a lot more logical"). The
  rank is the grade. The COA grade
  (`coaScore` / `coaGrade`, Disclosed Labs) is a DIFFERENT axis with its
  own harsher bands (`coaTier()`: 92 S, 80 A, 68 B, 54 C, 38 D) and leads
  the profile's COA analysis; without one, `coaAnalysisFor()` reads the
  lead certificate's completeness or says plainly that none is published.
- **Price vs market** (`PriceBar`, `priceFraction` 0..1, 1 = cheapest):
  one red → green rail, a white marker; only when the catalog was readable.
- **ONE coloured mark on the shop: the score ring**, painted with the
  app's ramp for its band (green >= 7, gold >= 4, warm). Everything else
  is ink on grey: pillar rows are ink bars on `--gray200` tracks, the
  price rail is a grey track with an ink marker, status words have no
  dot. The four-ramp pillar tiles, the red-to-green price rail, the tier
  discs and the signifier dots were all cut on 2026-11-08 ("the coloring
  is just all over the place"; "the little orbs seem like you're trying
  to replicate our app's essence, but just not reaching it"). The seal
  (accent / gold) and the one accent button are the only other colour.
- **The profile is the reference's shape** (Peptaura's vendor page: head,
  a stat line, then its own tabs): head (mark · name · seal · tagline ·
  "#n of 42 · domain") → the strip (`.sh-strip`: score ring + band ·
  public COAs · Trustpilot · named labs · Since year / country · the ONE
  accent "Visit" button) → the profile's OWN tabs (`shop/VendorTabs.tsx`,
  `ShopShell ownTabs`): Overview · Certificates (n) · Catalog (n), swapped
  in place, hash-addressed. The site's Vendors · Catalog bar is NOT drawn
  on a profile: its Catalog tab opened the whole shop's catalog where the
  reader expected the store's ("kind of disgusting"). Overview = ONE sheet pane
  (Scorecard rows · The trade as two columns · Price, divided by hairlines;
  stacked panes read as "block blast") then The brief · On record ·
  Sources, beside a rail of the Shop Now card (see above) and ONE facts pane (Testing, then Operator). The six
  proof squares and the second score ring were cut as repetition.
  Certificates = the COA read (score of 100, four component rows) and the
  certificate table. Catalog = one row per compound: the name opens the product on the
  vendor's site, each pack chip opens that pack, "Compare vendors" opens
  the compound across the shop (no table header, no "best per mg" column). Saved's empty state is a centred pane with three numbered steps; Submit
  is a task page (no shop tabs), see **Submit** below. Mocked app sections
  (Storage, Customer Service, Community Reports) were NOT ported. No FAQ
  on `/shop` ("the most awkwardly gutter-fucked place").

**Data pipeline.** `scripts/build-shop-data.mjs` reads
`regen-app/data/catalogs/library/vendors.json` and the live product pulls
in `vendor-research/products/*.json` (made by
`vendor-research/pull_products.py`; 21 of 42 stores readable, the rest
`blocked`/`unreachable`, recorded honestly) and writes `shop-vendors.json`
(public fields plus tier, scores, coaScore/coaGrade/coaComponents, certs,
sources, priceFraction, priceUsdPerMg, contact), `shop-offers.json`,
`shop-compounds.json` (with the library category), `shop-coas.json`. Three
cleaning rules live there and must stay: a product whose name or handle
names a second compound, says blend, or is a non-vial form (capsule,
topical, nasal) is NOT listed under a single compound; same-size variants
all claiming one vial are unlabeled packs (cheapest = 1 vial, rest
`quantity: null` and no $/mg); blends tile only with 2+ vendors. AUD stores
keep their currency and get no $/mg.

**Saved** (`lib/cart.ts`, localStorage) stays in the browser.

**Submit is an ONBOARDING (2026-11-10, `shop/submit/SubmitVendorForm.tsx`),
the brand-portal shape** (Advaith pointed at Oasis's brand portal
onboarding, brands.oasishealth.app; it shows only a work-email sign-in
before an account, so the flow copies the SHAPE of such a portal, one
question group per screen, in its clarity). A step rail on the left
(`.sh-onb-rail`: numbered discs, the current one ink, done ones ticked;
below 1080px a line of discs over the pane with only the current title),
ONE pane on the right (`.sh-onb-pane`: an accent progress line across
its top, "Step n of 6", the step's title and one-line lede, hairline
fields, chips for choices, Back as a chip and Continue as the page's one
accent button). Steps for a vendor: What you are sending (two layer-glass
choice cards: a vendor / a certificate) → The store (name, URL) → Who runs
it (country, since, operator) → Testing (COAs public? chips, lab, link) →
You (relation chips, email, anything else) → Review (every answer as a
list, a consent chip, Send). A certificate takes the short branch (The
certificate → You → Review). Nothing is sent before Review. `/api/vendors/submit`
is still the endpoint: it dedupes by domain against the 42, then EMAILS the
team for approval (2026-11-10: "vendor sign ups go to our emails to approve
them and then when they are approved they join") through Resend's REST API
(`RESEND_API_KEY`, `VENDOR_SUBMISSIONS_EMAIL` comma-separated,
`VENDOR_SUBMISSIONS_FROM` on a Resend-verified domain; Reply-To = the
vendor, so approving is a reply). `VENDOR_SUBMISSIONS_WEBHOOK_URL` still
works alongside, with `kind` and the step answers as `details`; the Claude
pre-check against the playbook attaches there once `ANTHROPIC_API_KEY` is
on the deployment. The "What happens next" aside is gone (the lede says
it); `.sh-steps` CSS is unused.

## Science (`/blog`): the blog, rebranded

The user's brief (2026-11-07): "a rebrand of blogs, nothing more nothing
less". Three cuts were rejected on sight before this one: Superpower's
magazine (featured block + per-category card grids); a hairline row stack
("a clutter of articles"); and the old card grid under a left-aligned
head with a subscribe form ("email part looks like ass", "thumbnails look
like hot ass", "make sure everything's centered and the filters are also
centered", "clicking a category takes ten years", "lacks the kick that
makes someone click", "reference popular blogs"). Since 2026-11-08:

- **Head**: `PageShell` with `align="center"`, the one hub that centres:
  eyebrow Science, a plain ink headline (no accent phrase, by request),
  a balanced lede. No subscribe
  form and no actions line (`/api/subscribe` stays for the footer).
- **Tabs filter in place**, in the site's glass: `ScienceTabs` is
  `GlassTabs` (one glass pill, a lit thumb that slides; "filters for the
  articles should be strictly our glass"). `blog/ScienceIndex.tsx` is a client provider:
  `ScienceTabs` (handed to PageShell as `nav`) and `ScienceBody` share
  one category state, so a click is a re-render (tens of milliseconds), not a
  route load. The URL moves to `/blog/category/<slug>` with `pushState` and
  Back restores the filter from the path. The category routes still exist
  (static, for crawlers and direct links) and render the SAME hub
  (`blog/ScienceHub.tsx`) with the tab preselected; only the metadata
  differs. Never make a tab a route load again.
- **Order, the one popular blogs share**: Featured (one `.blog-hero` pane:
  3:2 cover beside category, title, excerpt, meta and a glass "Read the
  article" button; the whole pane is the link), Start here (three evergreen
  picks, All only), Latest (the old blog's three-column `.blog-grid` of
  `.blog-card`, newest first). On a category the hero is its newest post
  and the grid is "More in <category>". `FEATURED_SLUG` and `PICK_SLUGS`
  live in `ScienceParts.tsx`; a missing slug is skipped, never a dead
  card. Section labels are `.blog-kicker`.
- **Loading.** Latest shows 12 cards and a "Show 12 more" button
  (`BATCH` in `ScienceIndex.tsx`). Covers cost nothing to load (below),
  and the hub and category pages skip the site's 0.8s `animate-fade-in`
  on `<main>`: a whole page easing in read as lag. The page close sits
  one step under the button (`.pg--center` bottom padding and
  `.pg--center + .cta`), not a full section beat away.
- **Covers are an aura, not objects or words.** `lib/coverArt.tsx` draws
  the card cover at 3:2: a soft mesh of five radial blobs in the category's
  family of hues on a light ground, EVERY hue a stop from the app's own
  gradients in `Colors.swift` (Science: accent #1135EF/#7288FF + cool
  #A8CDC8; Protocols: green ramp + cool; Biomarkers: yellow ramp + warm
  amber on the app's cream #FFF8E6). Violet, cyan, teal and coral were
  tried and removed ("purple was never in our app"); the OG card's
  category colours follow the same ramps, a fine SVG grain over
  it, seeded by slug. No text, no figure, no mark: the title sits under
  it. Rejected before it, at card size: the infographic (pill, figure,
  caption, mark, domain), flat gradient tiles ("hot shit"), and lit 3D
  spheres (stock clipart, a wall of saturated blue). **The cards and the
  featured pane paint the aura as CSS**: `aura()` in `lib/aura.ts` returns
  the background layers, set inline, with one shared SVG grain on
  `::after`. No image request, no render, no shimmer, nothing to wait for.
  The cover ROUTE paints the same `aura()` through next/og
  (`lib/coverArt.tsx`) only for the post's JSON-LD image, so both match.
  The social card keeps `lib/cover.tsx`, which a link preview needs.
- **Featured title is Medium (500), -0.015em.** Bold with tight tracking
  packed it into one dark block.
- **One conversion point**: `<PostCta variant="hub" />` (library screen,
  "Read it here. Run it in REGEN.", location `science_hub_cta`) sits
  between the picks and the archive, passed from the server
  `ScienceHub.tsx` into the client `ScienceBody` as `cta`. The page dock
  and the page close are the other two; do not add more.
- Lists INSIDE an article column (a post's Related articles, the author
  page) are the landing's `.bl-list` / `.bl-row` rows via `ArticleRows`.
- The data category "Science" prints as "Peptide Science" everywhere
  (`categoryTitle()`); the data and the `/blog/category/science` URL keep
  the old name. `/feed.xml` is RSS 2.0 over the same list and is the
  `<link rel="alternate">` on `/blog`.

**Every post wears the breakdown anatomy, by codemod.** All 78 posts were
swept on 2026-11-07: numbered h2s (`lib-ch-num`), `.lib-faq` details
pills, toc labels without baked numbers, zero em dashes, and 1-2 PostCta
blocks per the rules above. A new post must land in that shape; the
codemod lives in the session scratchpad only, so write it right the first
time (see the publishing checklist).

Old library notes below describe the catalog module and the article shell
that blog posts, learn guides, and tools still use.

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
3. Only `.hdr-brand`, `.hdr-links`, and `.hdr-acct` blur. Filtering
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
