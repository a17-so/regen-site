# REGEN Peptide Library: guide spec

One JSON file per compound at `src/app/lib/data/guides/<slug>.json`. The
page renders it in Superpower's information layering (identity card, key
takeaway, byline, at a glance, sections, status box, evidence box, related,
citations). This file is the whole brief for a writer.

## Voice

- Plain, declarative, for a careful non-specialist. Define a term the first
  time you use it, in a short aside ("subcutaneous (under the skin)").
- Third person. No "you". No hype words (breakthrough, revolutionary,
  powerful, miracle).
- NEVER an em dash or en dash. Use a comma, a period, parentheses, or "to"
  for ranges ("250 to 500 mcg").
- Write the characters, never HTML entities (write `<`, `&`, not `&lt;`).
- Report, never prescribe: no doses for anyone to take, no "you should",
  no "recommended dose", no protocol. Trial doses may be reported as what
  the trial used ("participants received 1.75 mg").
- Honest about weak evidence. For research peptides, say plainly what is
  animal-only, what is a small uncontrolled human report, and what has never
  been tested. That honesty is the product.
- ORIGINAL PROSE. The reference brief points at facts and sources; every
  sentence is yours. The validator fails any 8-word run copied from the
  reference page.

## Research

1. Read the lead file (scratchpad `leads/<slug>.json`): reference status,
   category, class, aliases, the section plan, glance labels, and the
   primary sources the reference cited (`referenceSources`, with the
   anchor phrase each one supported).
2. Open those primary sources (WebFetch) and confirm what they say. Search
   for anything newer: regulatory status changes in 2025 and 2026 (FDA
   approvals, 503A bulks list and compounding category changes, enforcement
   discretion notices), new phase 3 readouts, WADA status.
3. Optional background: our in-app catalog entry in
   `src/app/lib/data/library-peptides.json` (match by `catalogSlug` in
   `src/app/lib/data/guide-seed.json`). It is a lead, not a source.
4. Cite only pages you actually opened: FDA.gov, EMA, ClinicalTrials.gov,
   PubMed / a DOI, WADA, a company press release, a major journal or a
   reference publisher (ScienceDirect topics, StatPearls, NCBI Bookshelf).
   Never a vendor, forum, Reddit, Wikipedia, or a blog selling peptides.

## JSON shape

```json
{
  "slug": "bremelanotide",
  "name": "Bremelanotide",
  "alsoCalled": "PT-141",                       // or null
  "class": "MC4R agonist",                      // 2 to 8 words
  "category": "brain",                          // brain|skin|digestive|immune|hormones|bones|heart|sexual
  "status": "fda-approved",                     // fda-approved|in-trials|not-approved|cosmetic
  "evidence": "FDA approved",                   // FDA approved (only if fda-approved) | Deep research | Moderate research | Limited research | Low research
  "evidenceNote": "One or two sentences saying why the rating is what it is.",
  "summary": "One sentence under 160 characters for search snippets and cards.",
  "keyTakeaway": "60 to 110 words: what it is, what the human evidence shows with the key number, FDA status as of today, the caveat that matters (sport status, online versions).",
  "atGlance": [
    { "label": "FDA status", "value": "..." },  // ALWAYS first
    { "label": "How it works", "value": "..." },
    { "label": "...", "value": "..." },         // 2 to 3 rows chosen for this compound (Approved for, Main uses, Research, Sold online, Sport, How it's taken, FDA filing, Topical form)
    { "label": "Evidence strength", "value": "FDA approved" }   // ALWAYS last, equal to evidence
  ],
  "sections": [
    { "id": "what-is", "heading": "What is bremelanotide?", "blocks": [ { "type": "p", "text": "..." } ] },
    { "id": "history", "heading": "The history of bremelanotide", "blocks": [...] },          // when there is a real history
    { "id": "how-it-works", "heading": "How does bremelanotide work?", "blocks": [...] },
    { "id": "fda-approved", "heading": "Is it FDA-approved?", "blocks": [...] },             // the status box renders after this section
    { "id": "prescribed-for", "heading": "What is bremelanotide prescribed for?", "blocks": [...] },   // approved drugs
    { "id": "side-effects", "heading": "What are the side effects?", "blocks": [...] },               // approved drugs (label adverse effects)
    { "id": "research", "heading": "What does the research show?", "blocks": [...] },                 // everything not approved
    { "id": "...", "heading": "A compound-specific question", "blocks": [...] }                         // optional, e.g. "What about \"PT-141\" sold online?", "What is the difference between X and Y?"
  ],
  "statusBox": [
    { "label": "FDA status", "value": "..." },  // first; add Sport / Compounding / FDA filing rows when relevant
  ],
  "sources": [
    { "id": 1, "title": "Vyleesi (bremelanotide) prescribing information", "publisher": "FDA", "year": 2019, "url": "https://www.accessdata.fda.gov/...", "doi": null, "pmid": null },
    { "id": 2, "title": "Bremelanotide for the Treatment of Hypoactive Sexual Desire Disorder", "publisher": "Obstetrics & Gynecology", "year": 2019, "url": "https://doi.org/10.1097/AOG.0000000000003500", "doi": "10.1097/AOG.0000000000003500", "pmid": null }
  ],
  "sourcesNote": "One or two sentences naming the kinds of sources used (label, pivotal trials, regulator pages). The page appends the educational disclaimer.",
  "alsoInLibrary": ["pt-141"]                   // slugs from guide-seed.json that are the same molecule or a close variant; [] if none
}
```

Section rules:
- Order: What is → (history) → How does it work → Is it FDA-approved →
  then either prescribed-for + side-effects (approved) or research (not
  approved), then any compound-specific section.
- 600 to 1,100 words of paragraphs in total. Paragraphs of 2 to 5 sentences.
- Blocks: `p`, `ul` (items), `timeline` (items of `{date, text}`, for
  regulatory events), `table` (`columns`, `rows`; use for trial results:
  Trial | Population | Result, or Outcome | Change vs placebo, or a
  Feature | X | Y comparison).
- Citation markers `[n]` sit at the end of the claim they support, inside
  paragraph, list, timeline and table text only. Every source is cited at
  least once; every marker has a source. No markers in keyTakeaway,
  summary, class, evidenceNote, atGlance, statusBox.
- Evidence scale for non-approved compounds, judged on HUMAN data: Deep =
  multiple large randomized trials; Moderate = at least one randomized
  human trial or several controlled human studies; Limited = small or
  uncontrolled human studies only; Low = animal and lab only, or human data
  limited to short biomarker studies.

## Done means

`REGEN_REF_DIR=<scratchpad>/sp-pages node scripts/validate-guides.mjs <slug> --no-bundle`
prints `ok`. It checks the shape, the voice rules, that every source
resolves on the live web, and originality. Fix and re-run until it passes.
