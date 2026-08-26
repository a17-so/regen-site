import React from "react";
import {
  CHAPTERS,
  iconFor,
  brandNames,
  quickFact,
  sectionKind,
  sectionKindLabel,
  chapterHref,
  formatDate,
  hrefFor,
  rampFor,
  regulatory,
  specLine,
  type Peptide,
  type Source,
} from "../lib/library";
import { CategoryIcon } from "./CategoryIcon";

const SITE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(/\/$/, "");
export { SITE_URL };

/* ---- Inline body text ---------------------------------------------------
   Catalog bodies carry `**bold**` and nothing else. Rendering them with a
   markdown dependency would be a lot of bundle for one token, so this splits
   on the delimiter directly. Anything unmatched falls through as plain text. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

/**
 * Catalog body copy, rendered as blocks.
 *
 * The bodies carry real structure — blank lines between paragraphs, and runs
 * of `•` bullets — and rendering the whole string inside one `<p>` collapsed
 * all of it. A 2,400-character section then arrived as a single unbroken
 * wall, which is the main reason these pages were hard to read. This splits on
 * the blank lines and lifts consecutive bullet lines into a real list.
 */
export function Prose({ text }: { text: string }) {
  const raw = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  // The catalog carries 12 near-duplicate consecutive paragraph pairs across
  // six compounds: the same sentence twice, once with `**bold**` and a trailing
  // label ("… Human trial") and once plain. Rendering both makes the page look
  // broken. Where one is a prefix of the other, the longer survives — it is the
  // one carrying the emphasis and the label.
  const blocks: string[] = [];
  for (const block of raw.map(stripTrailingLabel)) {
    const prev = blocks[blocks.length - 1];
    if (prev) {
      const a = proseKey(prev);
      const b = proseKey(block);
      if (a === b || a.startsWith(b) || b.startsWith(a)) {
        if (block.length > prev.length) blocks[blocks.length - 1] = block;
        continue;
      }
    }
    blocks.push(block);
  }

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const bullets = lines.filter((l) => /^[•\u2022-]\s/.test(l));
        // A block counts as a list only when every line in it is a bullet;
        // a lead-in sentence followed by bullets keeps its sentence as a
        // paragraph, which is how the catalog actually writes them.
        if (bullets.length && bullets.length === lines.length) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>
                  <RichText text={l.replace(/^[•\u2022-]\s*/, "")} />
                </li>
              ))}
            </ul>
          );
        }
        // Mixed block: the prose lines join into a paragraph, the bullets
        // below it become a list of their own.
        if (bullets.length) {
          const lead = lines.filter((l) => !/^[•\u2022-]\s/.test(l));
          return (
            <React.Fragment key={i}>
              {lead.length > 0 && (
                <p>
                  <RichText text={lead.join(" ")} />
                </p>
              )}
              <ul>
                {bullets.map((l, j) => (
                  <li key={j}>
                    <RichText text={l.replace(/^[•\u2022-]\s*/, "")} />
                  </li>
                ))}
              </ul>
            </React.Fragment>
          );
        }
        return (
          <p key={i}>
            <RichText text={lines.join(" ")} />
          </p>
        );
      })}
    </>
  );
}

/** Quick facts table. High-value structured content, and it wins featured
    snippets. Wrapped in its own pane so it reads as a reference block rather
    than more body copy. */
/**
 * One section of a chapter.
 *
 * Summary, safety, and procedural sections render as labelled cards, the way
 * the app's breakdown renders "Reported effects", "When to stop", and
 * "Reconstitution & storage". Everything else stays prose. The split comes
 * from the catalog's own subheader, so nothing is invented.
 *
 * `rail` draws the dot-and-rail timeline, and only the mechanism chapter
 * passes it: a connected sequence means "these steps follow one another",
 * which is true of a mechanism and false of a list of side effects.
 */
export function ChapterSectionBlock({
  section,
  rail,
  headingLevel = 3,
}: {
  section: { subheader: string; body: string };
  rail?: boolean;
  /** 3 on the compound page, 2 on a chapter's own page, for the outline. */
  headingLevel?: 2 | 3;
}) {
  const kind = sectionKind(section.subheader);
  const Heading = (headingLevel === 2 ? "h2" : "h3") as "h2" | "h3";

  return (
    <div className={`lib-sec${rail ? " lib-sec--rail" : ""}`}>
      <div className="lib-sec-head">
        {kind && kind !== "summary" && (
          <span className={`lib-sec-tag lib-sec-tag--${kind}`}>{sectionKindLabel(kind)}</span>
        )}
        <Heading>{section.subheader}</Heading>
      </div>
      <Prose text={section.body} />
    </div>
  );
}

/**
 * Strip the trailing evidence label some catalog paragraphs carry.
 *
 * The duplicated pairs append a bare tag to the sentence ("… multiple
 * sclerosis trials. Animal", "… fully published. Human trial"). It is a field
 * value that leaked into the prose, and it reads as a truncation. Matched
 * narrowly: a short capitalised fragment after a full stop, with no closing
 * punctuation of its own.
 */
function stripTrailingLabel(text: string): string {
  return text.replace(
    /\.\s+((?:Animal|Human|In vitro|Preclinical|Clinical)(?:\s+(?:trial|study|data|model)s?)?)\s*$/,
    "."
  );
}

/** Comparison key for near-duplicate paragraph detection: markup and casing
    removed, whitespace collapsed, trailing period dropped. */
function proseKey(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.$/, "");
}

/** Evidence grade chip. Letter always renders beside the colour, never colour alone. */
export function TierBadge({ tier, size = "sm" }: { tier?: string | null; size?: "sm" | "lg" }) {
  if (!tier) return null;
  return (
    <span className={`lib-tier lib-tier--${tier.toLowerCase()} lib-tier--${size}`}>
      <span className="lib-tier-letter">{tier}</span>
      <span className="lib-tier-word">grade</span>
    </span>
  );
}

/** Grade as plain type, for index surfaces. Set in the eyebrow face at the
    subtitle's weight and always black: a tinted pill on a card competes with
    the compound name for the same line, and a grid of 24 of them reads as
    decoration rather than data. `flex: none` is what guarantees it fits. */
export function GradeText({ tier }: { tier?: string | null }) {
  if (!tier) return null;
  return <span className="lib-grade-text">{tier}-grade</span>;
}

/** The same chip, linked to the methodology. Used wherever the grade is the
    page's own claim rather than a repeated label in a list. */
export function TierLink({ tier, size = "sm" }: { tier?: string | null; size?: "sm" | "lg" }) {
  if (!tier) return null;
  return (
    <a className="lib-tier-link" href="/library/how-we-grade" title="How REGEN grades evidence">
      <TierBadge tier={tier} size={size} />
    </a>
  );
}

export function Pill({ children, tone }: { children: React.ReactNode; tone?: "accent" | "green" | "plain" }) {
  return <span className={`lib-pill${tone ? ` lib-pill--${tone}` : ""}`}>{children}</span>;
}

/** Breadcrumb, mirrors the blog's `.crumbs`. */
export function Crumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {trail.map((t, i) => (
        <React.Fragment key={`${t.label}-${i}`}>
          {i > 0 && <span aria-hidden>/</span>}
          {t.href ? <a href={t.href}>{t.label}</a> : <span>{t.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

/** The "Key Takeaways" card that opens every reference article.
    Plain statements, set close together. No bullet markers, no bold runs: the
    reference sites set this block as a short paragraph stack, and a marker per
    line plus a bolded compound name turned four sentences into a diagram. */
export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside className="lib-takeaways">
      <h2>Key Takeaways</h2>
      {items.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
    </aside>
  );
}

/** Chapter jump pills under the takeaways, the row of topic buttons. */
export function ChapterPills({ p, active }: { p: Peptide; active?: string }) {
  const available = CHAPTERS.filter((c) => p.chapters.some((ch) => ch.key === c.key));
  if (!available.length) return null;
  return (
    <nav className="lib-filters" aria-label="Sections">
      {available.map((c) => (
        <a
          key={c.slug}
          href={chapterHref(p, c)}
          className={`lib-filter${c.slug === active ? " is-active" : ""}`}
          aria-current={c.slug === active ? "page" : undefined}
        >
          {c.label}
        </a>
      ))}
    </nav>
  );
}

export function QuickFacts({ p }: { p: Peptide }) {
  // "Research Applications" arrives as a space-joined run of titles with the
  // delimiter already lost UPSTREAM, in the app catalog itself ("Sports
  // Medicine Research Neuroscience"). It cannot be split back apart without
  // guessing where one title ends, so it is dropped here rather than printed
  // as a run-on. Fix the catalog and it can come back.
  const facts = p.quickFacts.filter((f) => !/research applications/i.test(f.key));
  if (!facts.length) return null;
  return (
    <div className="lib-facts">
      <h2 id="quick-facts">Quick facts</h2>
      <dl className="lib-facts-pane">
        {facts.map((f) => (
          <div key={f.key}>
            <dt>{f.key}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EvidenceTable({ p }: { p: Peptide }) {
  if (!p.evidenceClaims.length) return null;
  return (
    <div className="lib-evidence">
      <h2 id="evidence">What the evidence supports</h2>
      <div className="lib-table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Claim</th>
              <th scope="col">Grade</th>
              <th scope="col">Basis</th>
            </tr>
          </thead>
          <tbody>
            {p.evidenceClaims.map((c) => (
              <tr key={c.claim}>
                <th scope="row">{c.claim}</th>
                <td>
                  <TierBadge tier={c.tier} />
                </td>
                <td>{c.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TrialList({ p }: { p: Peptide }) {
  if (!p.trials.length) return null;
  return (
    <div className="lib-trials">
      <h2 id="trials">Trials and reviews</h2>
      <ul>
        {p.trials.map((t, i) => (
          <li key={`${t.name}-${i}`}>
            <div className="lib-trial-head">
              <span className="lib-trial-name">{t.name}</span>
              {t.journal && <span className="lib-trial-journal">{t.journal}</span>}
              {t.date && <span className="lib-trial-date">{t.date}</span>}
            </div>
            {t.headlineStat && <p>{t.headlineStat}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Citation list, styled like the app's Sources card: the title is the link,
    with host, authors, and year on a quiet meta line under it. Research links
    only — the generator drops the rest. */
export function Citations({ sources, id = "references" }: { sources: Source[]; id?: string }) {
  if (!sources.length) return null;
  return (
    <div className="lib-refs">
      <h2 id={id}>References</h2>
      <ol>
        {sources.map((s, i) => (
          <li key={`${s.url}-${i}`}>
            <a href={s.url} target="_blank" rel="noopener nofollow">
              {s.title}
            </a>
            <span className="lib-ref-meta">
              {[hostOf(s.url), s.authors?.length ? s.authors.join(", ") : null, s.year]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** "pubmed.ncbi.nlm.nih.gov" from a citation URL, for the meta line. */
function hostOf(url: string): string | null {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Card used on the hub, category pages, and related rails.
    Anatomy mirrors the app's LibraryRow: category mark, name, grade on the
    same line; section eyebrow; blurb; then the dose/half-life foot rule that
    lets someone compare two compounds without opening either. */
export function PeptideCard({ p }: { p: Peptide }) {
  const ramp = rampFor(p);
  const reg = regulatory(p);
  return (
    <a className={`lib-card lib-card--${ramp}`} href={hrefFor(p)}>
      {/* Anatomy copied from the app's Read-next card: orb, name, tier on one
          line; blurb; topic tags along the bottom. The orb carries the whole
          category ramp, so the mark is the colour rather than an icon sitting
          on a plate. */}
      <div className="lib-card-top">
        <span className={`lib-orb lib-orb--${ramp}`} aria-hidden="true" />
        <h3>{p.name}</h3>
        <GradeText tier={p.researchTier} />
      </div>
      <p>{p.subtitle}</p>
      <div className="lib-card-tags">
        {p.topics.slice(0, 2).map((t) => (
          <span className="lib-tag" key={t}>
            {t}
          </span>
        ))}
        {(reg === "approved" || reg === "approved-narrow") && (
          <span className="lib-tag lib-tag--approved">FDA-approved</span>
        )}
      </div>
    </a>
  );
}

/* ---- Reference page header ----------------------------------------------
   Ported from the app's `BreakdownView.headerBlock`:
     category eyebrow (icon + label)
     title + grade plaque
     subtitle
     spec line   — "GLP-1 / GIP dual agonist · half-life ~5 days"
     status chip — FDA-Approved / Research Compound
   The web adds the byline and the read/reference counts underneath, because a
   reference page has to show its work in a way an app screen does not. */
export function ReferenceHeader({ p, headline }: { p: Peptide; headline: string }) {
  const ramp = rampFor(p);
  const spec = specLine(p);
  const brands = brandNames(p);
  return (
    <div className={`lib-ref-head lib-ref-head--${ramp}`}>
      {/* Icon plus gradient-stroked label — `BreakdownView.headerBlock`'s
          category eyebrow. The catalog writes these labels lowercase already,
          so they are left that way rather than shouted in caps. */}
      <div className="lib-ref-eyebrow">
        <CategoryIcon name={iconFor(p)} size={22} ramp={ramp} />
        <span>{p.sectionLabel}</span>
      </div>
      <h1>{headline}</h1>
      {/* Classification sits directly under the title. The grade, status, and
          category chips are gone: the grade is stated in the takeaways and
          again in the evidence table, the category is in the breadcrumb, and
          three chips under a headline read as furniture. */}
      {(spec || brands) && (
        <p className="lib-ref-spec">
          {spec}
          {spec && brands ? " · " : ""}
          {brands ? `sold as ${brands}` : ""}
        </p>
      )}
    </div>
  );
}

/** The chapter filter row.
    One chip per chapter this compound carries, in the same pill the rest of
    the library uses. It replaces a six-card grid whose panes were the only
    surface on the page not following the glass rule, and it matches how the
    reference sites present the same jump targets. */
export function ChapterFilters({ p }: { p: Peptide }) {
  const available = CHAPTERS.filter((c) => p.chapters.some((ch) => ch.key === c.key));
  if (!available.length) return null;
  return (
    <nav className="lib-filters" aria-label="Jump to a section">
      {available.map((c) => (
        <a className="lib-filter" key={c.slug} href={`#${c.slug}`}>
          {c.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * Molecular profile.
 *
 * The reference sites put a 2D structure diagram in this slot. Every structure
 * image in the catalog was hotlinked from a competitor and is stripped by the
 * generator, so rather than fabricate one this renders the identifiers we
 * actually hold: formula, weight, CAS, and sequence. Renders nothing when the
 * catalog has none of them.
 */
export function MolecularProfile({ p }: { p: Peptide }) {
  const formula = quickFact(p, "Molecular Formula");
  const weight = quickFact(p, "Molecular Weight");
  const cas = quickFact(p, "CAS Number");
  const sequence = quickFact(p, "Sequence");
  if (!formula && !weight && !cas && !sequence) return null;

  return (
    <aside className="lib-molecule">
      <div className="lib-molecule-head">Molecular profile</div>
      {formula && (
        <div className="lib-molecule-formula" aria-label={`Molecular formula ${formula}`}>
          <Formula text={formula} />
        </div>
      )}
      <dl className="lib-molecule-facts">
        {weight && (
          <div>
            <dt>Weight</dt>
            <dd>{weight}</dd>
          </div>
        )}
        {cas && (
          <div>
            <dt>CAS</dt>
            <dd>{cas}</dd>
          </div>
        )}
      </dl>
      {sequence && (
        <div className="lib-molecule-seq">
          <span>Sequence</span>
          <code>{sequence}</code>
        </div>
      )}
    </aside>
  );
}

/** "C62H98N16O22" with the digits set as real subscripts. */
function Formula({ text }: { text: string }) {
  const parts = text.split(/(\d+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\d+$/.test(part) ? <sub key={i}>{part}</sub> : <span key={i}>{part}</span>
      )}
    </>
  );
}

/** Related compounds rail, closes every reference page. */
export function RelatedRail({
  items,
  heading,
  cols = 3,
}: {
  items: Peptide[];
  heading: string;
  /** Two inside an article column — three compound cards in a measure that
      narrow wraps every title to four lines. */
  cols?: 2 | 3;
}) {
  if (!items.length) return null;
  return (
    <div className="lib-related">
      <h2 id="related">{heading}</h2>
      <div className={`lib-grid lib-grid--${cols}`}>
        {items.map((r) => (
          <PeptideCard key={r.slug} p={r} />
        ))}
      </div>
    </div>
  );
}

/** Byline. No credentialed reviewer exists yet, so this renders the editorial
    masthead only, and `reviewedBy` stays out of the JSON-LD until one does. */
export function LibraryByline({ updated }: { updated?: string | null }) {
  // The catalog stores an ISO timestamp. Printing it raw in the byline
  // ("2026-08-18T00:00:00.000Z") undercuts the one thing the line is there to
  // establish, so it always goes through `formatDate`.
  const when = formatDate(updated);
  return (
    <div className="post-byline">
      <div className="author-avatar">RE</div>
      <div>
        <div>
          By <a href="/authors/advaith-akella">REGEN Editorial</a>
        </div>
        <div className="post-byline-sub">
          Compiled from published research · {when ? `Last updated ${when}` : "Continuously updated"}
        </div>
      </div>
    </div>
  );
}
