import React from "react";
import {
  CHAPTERS,
  brandNames,
  categoryBySlug,
  chapterHref,
  formatDate,
  hrefFor,
  iconFor,
  rampFor,
  regulatory,
  regulatoryStatusLabel,
  specLine,
  type Peptide,
  type Source,
} from "../lib/library";
import { CategoryChip, CategoryIcon } from "./CategoryIcon";

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

/** The "Key Takeaways" card that opens every reference article. */
export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside className="lib-takeaways">
      <h2>Key Takeaways</h2>
      <ul>
        {items.map((t, i) => (
          <li key={i}>
            <RichText text={t} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Chapter jump pills under the takeaways, the row of topic buttons. */
export function ChapterPills({ p, active }: { p: Peptide; active?: string }) {
  const available = CHAPTERS.filter((c) => p.chapters.some((ch) => ch.key === c.key));
  if (!available.length) return null;
  return (
    <nav className="lib-chapter-pills" aria-label="Sections">
      {available.map((c) => (
        <a
          key={c.slug}
          href={chapterHref(p, c)}
          className={c.slug === active ? "is-active" : undefined}
          aria-current={c.slug === active ? "page" : undefined}
        >
          {c.label}
        </a>
      ))}
    </nav>
  );
}

/** Quick facts table. High-value structured content, and it wins featured snippets. */
export function QuickFacts({ p }: { p: Peptide }) {
  if (!p.quickFacts.length) return null;
  return (
    <div className="lib-facts">
      <h2 id="quick-facts">Quick facts</h2>
      <dl>
        {p.quickFacts.map((f) => (
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

/** Numbered citation list. Research links only, the generator drops the rest. */
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
            {s.authors?.length ? <span> · {s.authors.join(", ")}</span> : null}
            {s.year ? <span> · {s.year}</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Card used on the hub, category pages, and related rails.
    Anatomy mirrors the app's LibraryRow: category mark, name, grade on the
    same line; section eyebrow; blurb; then the dose/half-life foot rule that
    lets someone compare two compounds without opening either. */
export function PeptideCard({ p }: { p: Peptide }) {
  const ramp = rampFor(p);
  const dose = p.doseCard?.primary;
  // The card prints the short form. A narrow approval still says "approved"
  // here because it is one, and the reference page carries the indication.
  const reg = regulatory(p);
  return (
    <a className={`lib-card lib-card--${ramp}`} href={hrefFor(p)}>
      <div className="lib-card-top">
        <CategoryChip name={iconFor(p)} />
        <h3>{p.name}</h3>
        <GradeText tier={p.researchTier} />
      </div>
      <div className="lib-card-eyebrow">{p.sectionLabel}</div>
      <p>{p.subtitle}</p>
      <div className="lib-card-foot">
        {dose && <span>{dose}</span>}
        {reg === "otc" && <span>Supplement</span>}
        {p.isFeatured && !dose && reg === "research" && <span>Popular</span>}
        {(reg === "approved" || reg === "approved-narrow") && (
          <span className="lib-badge">FDA-approved</span>
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
  const cat = categoryBySlug(p.category);
  const spec = specLine(p);
  const status = regulatoryStatusLabel(p);
  const approved = regulatory(p) !== "research" && regulatory(p) !== "otc";
  const brands = brandNames(p);
  return (
    <div className={`lib-ref-head lib-ref-head--${ramp}`}>
      <div className="lib-ref-eyebrow">
        <CategoryIcon name={iconFor(p)} size={16} />
        <span>{p.sectionLabel}</span>
      </div>
      <h1>{headline}</h1>
      <div className="lib-ref-title-row">
        <TierLink tier={p.researchTier} size="lg" />
        {status && (
          <span className={`lib-status${approved ? " is-approved" : ""}`}>{status}</span>
        )}
        {cat && (
          <a className="lib-status lib-status--link" href={`/library/${cat.slug}`}>
            {cat.label}
          </a>
        )}
      </div>
      <p className="post-lead">{p.subtitle}</p>
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

/** Peptidepedia-style jump deck: one card per chapter this compound carries.
    Chapter pills read as filters; a titled card reads as a destination, and it
    is a far better internal-link surface for the chapter URLs. */
export function QuickLinks({ p }: { p: Peptide }) {
  const available = CHAPTERS.filter((c) => p.chapters.some((ch) => ch.key === c.key));
  if (!available.length) return null;
  return (
    <nav className="lib-quicklinks" aria-label="Jump to a section">
      <h2 id="sections">On this compound</h2>
      <div className="lib-quicklinks-grid">
        {available.map((c) => (
          <a className="lib-quicklink" key={c.slug} href={`#${c.slug}`}>
            <span className="lib-quicklink-label">{c.label}</span>
            <span className="lib-quicklink-sub">
              {p.name} {c.titleSuffix.toLowerCase()}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

/** Related compounds rail, closes every reference page. */
export function RelatedRail({ items, heading }: { items: Peptide[]; heading: string }) {
  if (!items.length) return null;
  return (
    <div className="lib-related">
      <h2 id="related">{heading}</h2>
      <div className="lib-grid lib-grid--3">
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
