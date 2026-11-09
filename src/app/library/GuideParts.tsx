import type { ReactNode } from "react";
import type { CSSProperties } from "react";
import { STATUS_TONE, categoryLabel, statusLabel } from "../lib/guideVocab";
import { tileArt } from "./tileArt";
import {
  type Block,
  type Guide,
  categoryHref,
  formatGuideDate,
  renderableSources,
  sourceHref,
  sourceMeta,
  stripDeadMarkers,
} from "../lib/guides";

/* ---- Text -------------------------------------------------------------- */

/** `[n]` markers become small superscript links into the citations view. */
export function Inline({ text, guide }: { text: string; guide: Guide }) {
  const clean = stripDeadMarkers(text, guide);
  const parts: ReactNode[] = [];
  const re = /\[(\d+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean))) {
    if (m.index > last) parts.push(clean.slice(last, m.index));
    parts.push(
      <sup key={`${m.index}-${m[1]}`} className="gd-cite">
        <a className="gd-cite-link" href={`#src-${m[1]}`} aria-label={`Citation ${m[1]}`}>
          {m[1]}
        </a>
      </sup>
    );
    last = m.index + m[0].length;
  }
  if (last < clean.length) parts.push(clean.slice(last));
  return <>{parts}</>;
}

export function Blocks({ blocks, guide }: { blocks: Block[]; guide: Guide }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "p")
          return (
            <p key={i}>
              <Inline text={b.text} guide={guide} />
            </p>
          );
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline text={it} guide={guide} />
                </li>
              ))}
            </ul>
          );
        if (b.type === "timeline")
          return (
            <ul key={i} className="gd-timeline">
              {b.items.map((it, j) => (
                <li key={j}>
                  <strong>{it.date}:</strong> <Inline text={it.text} guide={guide} />
                </li>
              ))}
            </ul>
          );
        return (
          <div key={i} className="gd-table-wrap">
            <table className="gd-table">
              <thead>
                <tr>
                  {b.columns.map((c, j) => (
                    <th key={j} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, j) => (
                  <tr key={j}>
                    {r.map((cell, k) => (
                      <td key={k}>
                        <Inline text={cell} guide={guide} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {b.note && <p className="gd-table-note">{b.note}</p>}
          </div>
        );
      })}
    </>
  );
}

/* ---- Identity card ------------------------------------------------------- */

/** The card that holds the page's H1, sticky beside the article: artwork in
    the brand's tiles above, then the app's header block (status orb and
    label, the body system, the name, "Also called", Evidence and Class),
    then the way to the vendors. */
export function IdentityCard({ guide, shopHref }: { guide: Guide; shopHref?: string }) {
  const tone = STATUS_TONE[guide.status];
  return (
    <aside className={`gi gi--${tone}`}>
      <div className={`gi-art gi-art--${tone}`} aria-hidden="true">
        {tileArt(guide.slug).map((t, i) => (
          <i
            key={i}
            className={`sq ${t.glass ? "gi-tile--glass" : `sq-${tone}`} gi-tile`}
            style={{ "--x": `${t.x}%`, "--y": `${t.y}%`, "--s": `${t.s}%`, "--sq-rot": `${t.r}deg`, "--d": t.d } as CSSProperties}
          />
        ))}
      </div>
      <div className="gi-body">
        <div className="gi-tags">
          <span className="gi-status">{statusLabel(guide.status)}</span>
          <a href={categoryHref(guide.category)}>{categoryLabel(guide.category)}</a>
        </div>
        <h1>{guide.name}</h1>
        {guide.alsoCalled && <p className="gi-also">Also called {guide.alsoCalled}</p>}
        <dl className="gi-facts">
          <div>
            <dt>Evidence</dt>
            <dd>{guide.evidence}</dd>
          </div>
          <div>
            <dt>Class</dt>
            <dd>{guide.class}</dd>
          </div>
        </dl>
        {shopHref && (
          <a className="gi-shop" href={shopHref}>
            Compare vendors
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </aside>
  );
}

/* ---- Article pieces --------------------------------------------------------- */

export function KeyTakeaway({ guide }: { guide: Guide }) {
  return (
    <section className="gd-takeaway" aria-label="Key takeaway">
      <div className="gd-label">Key takeaway</div>
      <p>{guide.keyTakeaway}</p>
    </section>
  );
}

export function Byline({ guide, sourceCount }: { guide: Guide; sourceCount: number }) {
  return (
    <dl className="gd-byline">
      <div>
        <dt>Written by</dt>
        <dd>
          REGEN Research
          <span>Library team</span>
        </dd>
      </div>
      <div>
        <dt>Sources</dt>
        <dd>
          <a href="#citations">
            {sourceCount} citation{sourceCount === 1 ? "" : "s"}
          </a>
          <span>Each checked against the source</span>
        </dd>
      </div>
      <div>
        <dt>Published</dt>
        <dd>{formatGuideDate(guide.published)}</dd>
      </div>
      <div>
        <dt>Last updated</dt>
        <dd>{formatGuideDate(guide.updated)}</dd>
      </div>
    </dl>
  );
}

/** At a glance: bordered label / value rows. */
export function GlanceTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="gd-glance">
      <table>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The grey Status box under "Is it FDA-approved?". */
export function StatusBox({ rows }: { rows: { label: string; value: string }[] }) {
  // At a glance already opens with the FDA status; the box carries the rest.
  rows = rows.filter((r) => r.label !== "FDA status");
  if (!rows.length) return null;
  return (
    <div className="gd-box">
      <div className="gd-label">Status</div>
      <dl>
        {rows.map((r) => (
          <div key={r.label}>
            <dt>{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EvidenceBox({ guide }: { guide: Guide }) {
  return (
    <section className="gd-box gd-box--evidence" aria-label="Evidence strength">
      <div className="gd-label">Evidence strength</div>
      <p className="gd-box-value">{guide.evidence}</p>
      <p>{guide.evidenceNote}</p>
    </section>
  );
}

/** The Citations view: numbered, title, then publisher and locator, external arrow. */
export function CitationList({ guide }: { guide: Guide }) {
  const list = renderableSources(guide);
  return (
    <ol className="gd-cites">
      {list.map((s) => {
        const href = sourceHref(s);
        return (
          <li key={s.id} id={`src-${s.id}`}>
            <span className="gd-cites-n">{s.id}</span>
            <span className="gd-cites-main">
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer nofollow">
                  {s.title}
                </a>
              ) : (
                s.title
              )}
              <span className="gd-cites-meta">{sourceMeta(s)}</span>
            </span>
            {href && (
              <svg className="gd-also-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4.5 11.5l7-7M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function SourcesNote({ guide }: { guide: Guide }) {
  return (
    <p className="gd-sources-note">
      {guide.sourcesNote ? `Sources: ${guide.sourcesNote} ` : ""}This page is educational. It is not medical advice, not a health
      claim, and not an offer to sell any product. Regulatory status changes; check it with the FDA before relying on it.
    </p>
  );
}
