import React from "react";
import { CHAPTERS, chapterHref, hrefFor, type Peptide, type Source } from "../lib/library";

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

/** Card used on the hub, category pages, and related rails. */
export function PeptideCard({ p }: { p: Peptide }) {
  return (
    <a className="lib-card" href={hrefFor(p)}>
      <h3>{p.name}</h3>
      <div className="lib-card-chips">
        <Pill tone="accent">{p.sectionLabel}</Pill>
        <TierBadge tier={p.researchTier} />
      </div>
      <p>{p.subtitle}</p>
    </a>
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
  return (
    <div className="post-byline">
      <div className="author-avatar">RE</div>
      <div>
        <div>
          By <a href="/authors/advaith-akella">REGEN Editorial</a>
        </div>
        <div className="post-byline-sub">
          Compiled from published research · {updated ? `Last updated ${updated}` : "Continuously updated"}
        </div>
      </div>
    </div>
  );
}
