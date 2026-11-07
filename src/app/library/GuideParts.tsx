import type { ReactNode } from "react";
import {
  CATEGORIES,
  STATUSES,
  type Block,
  type CategorySlug,
  type Guide,
  type IndexRow,
  type StatusKey,
  categoryBySlug,
  categoryCount,
  categoryHref,
  formatGuideDate,
  guideHref,
  renderableSources,
  statusLabel,
  stripDeadMarkers,
} from "../lib/guides";

/* ---- Status ------------------------------------------------------------ */

/**
 * Status is shown as a dot AND its label, never the dot alone. The dots take
 * the app's own ramps rather than a new palette: approved = green, in trials
 * = gold, not approved = warm, cosmetic = cool. Same five ramps as the rest
 * of the site, so nothing new is introduced.
 */
export const STATUS_RAMP: Record<StatusKey, "green" | "gold" | "warm" | "cool"> = {
  "fda-approved": "green",
  "in-trials": "gold",
  "not-approved": "warm",
  cosmetic: "cool",
};

export function StatusTag({ status, size = "sm" }: { status: StatusKey; size?: "sm" | "md" }) {
  return (
    <span className={`gd-status gd-status--${size}`}>
      <span className={`lib-orb lib-orb--${STATUS_RAMP[status]}`} aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}

export function StatusLegend() {
  return (
    <ul className="gd-legend" aria-label="Status key">
      {STATUSES.map((s) => (
        <li key={s.key}>
          <StatusTag status={s.key} />
        </li>
      ))}
    </ul>
  );
}

/* ---- Category chrome ------------------------------------------------------ */

/** The reference's header strip: every category with its count. */
export function CategoryNav({ active }: { active?: CategorySlug }) {
  return (
    <nav className="gd-catnav" aria-label="Categories">
      {CATEGORIES.map((c) => (
        <a key={c.slug} href={categoryHref(c.slug)} aria-current={active === c.slug ? "page" : undefined}>
          {c.short} <span>({categoryCount(c.slug)})</span>
        </a>
      ))}
    </nav>
  );
}

/* ---- Slab card ---------------------------------------------------------------- */

/**
 * The reference's category row: a wide card with the compound name and its
 * status. Ours is the library card recipe (page glass, transform-only hover)
 * with the status ramp on the leading edge, the way `.lib-card::before`
 * carried the category ramp. A compound with no guide yet renders as a
 * static row, not a dead link.
 */
export function SlabCard({ row }: { row: IndexRow }) {
  const cls = `gd-slab lib-card lib-card--${STATUS_RAMP[row.status]}`;
  const inner = (
    <>
      <span className="gd-slab-name">{row.name}</span>
      <StatusTag status={row.status} />
    </>
  );
  return row.hasGuide ? (
    <a className={cls} href={guideHref(row.slug)}>
      {inner}
    </a>
  ) : (
    <div className={`${cls} is-pending`} aria-label={`${row.name}, guide in preparation`}>
      {inner}
    </div>
  );
}

export function CategorySection({
  slug,
  rows,
  limit,
}: {
  slug: CategorySlug;
  rows: IndexRow[];
  limit?: number;
}) {
  const meta = categoryBySlug(slug);
  if (!meta || rows.length === 0) return null;
  const order: StatusKey[] = ["fda-approved", "in-trials", "not-approved", "cosmetic"];
  const sorted = rows.slice().sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || a.name.localeCompare(b.name));
  const shown = limit ? sorted.slice(0, limit) : sorted;
  return (
    <section className="gd-catsec" id={slug}>
      <div className="gd-catsec-head">
        <h2>
          <a href={categoryHref(slug)}>{meta.label}</a> <span>({rows.length})</span>
        </h2>
        {limit && rows.length > limit && (
          <a className="lib-section-link" href={categoryHref(slug)}>
            See all
          </a>
        )}
      </div>
      <div className="gd-slabs">
        {shown.map((r) => (
          <SlabCard key={r.slug} row={r} />
        ))}
      </div>
    </section>
  );
}

/* ---- Guide page pieces ------------------------------------------------------------ */

/** Inline `[n]` markers become superscript links to the sources list. */
export function Inline({ text, guide }: { text: string; guide: Guide }) {
  const clean = stripDeadMarkers(text, guide);
  const parts: ReactNode[] = [];
  const re = /\[(\d+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean))) {
    if (m.index > last) parts.push(clean.slice(last, m.index));
    const n = m[1];
    parts.push(
      <sup key={`${m.index}-${n}`} className="gd-cite">
        <a className="gd-cite-link" href={`#src-${n}`} aria-label={`Source ${n}`}>
          {n}
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
        switch (b.type) {
          case "p":
            return (
              <p key={i}>
                <Inline text={b.text} guide={guide} />
              </p>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} guide={guide} />
                  </li>
                ))}
              </ul>
            );
          case "timeline":
            return (
              <ol key={i} className="gd-timeline">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <span className="gd-timeline-date">{it.date}</span>
                    <span>
                      <Inline text={it.text} guide={guide} />
                    </span>
                  </li>
                ))}
              </ol>
            );
          case "table":
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
                        {r.map((cell, k) =>
                          k === 0 ? (
                            <th key={k} scope="row">
                              <Inline text={cell} guide={guide} />
                            </th>
                          ) : (
                            <td key={k}>
                              <Inline text={cell} guide={guide} />
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {b.note && (
                  <p className="gd-table-note">
                    <Inline text={b.note} guide={guide} />
                  </p>
                )}
              </div>
            );
        }
      })}
    </>
  );
}

/** Label / value rows in one pane: At a glance and the Status box. */
export function FactRows({ rows, title, id }: { rows: { label: string; value: string }[]; title?: string; id?: string }) {
  return (
    <div className="gd-facts lib-facts-pane" id={id}>
      {title && <div className="gd-facts-title">{title}</div>}
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

export function KeyTakeaway({ guide }: { guide: Guide }) {
  return (
    <section className="lib-takeaways gd-takeaway" aria-labelledby="takeaway">
      <h2 id="takeaway">Key takeaway</h2>
      <p>{guide.keyTakeaway}</p>
    </section>
  );
}

export function Byline({ guide, sourceCount }: { guide: Guide; sourceCount: number }) {
  return (
    <dl className="gd-byline">
      <div>
        <dt>Written by</dt>
        <dd>REGEN Research</dd>
      </div>
      <div>
        <dt>Sources</dt>
        <dd>
          <a href="#citations">
            {sourceCount} citation{sourceCount === 1 ? "" : "s"}
          </a>
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

export function EvidenceBox({ guide }: { guide: Guide }) {
  return (
    <aside className="gd-evidence lib-facts-pane" aria-labelledby="evidence">
      <div className="gd-facts-title" id="evidence">
        Evidence strength
      </div>
      <p className="gd-evidence-value">{guide.evidence}</p>
      <p className="gd-evidence-note">{guide.evidenceNote}</p>
    </aside>
  );
}

export function Sources({ guide }: { guide: Guide }) {
  const list = renderableSources(guide);
  if (!list.length) return null;
  return (
    <section className="lib-refs gd-sources" id="citations" aria-labelledby="citations-h">
      <h2 id="citations-h">Citations</h2>
      <ol>
        {list.map((s) => (
          <li key={s.id} id={`src-${s.id}`} value={s.id}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">
                {s.text}
              </a>
            ) : (
              s.text
            )}
            {s.doi && <span className="lib-ref-meta">doi: {s.doi}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The sticky card beside the article: status, category, name, aliases,
 *  evidence, class. The page's H1 lives here, as it does in the reference. */
export function IdentityCard({ guide, shopHref }: { guide: Guide; shopHref?: string }) {
  const cat = categoryBySlug(guide.category);
  return (
    <aside className={`gd-identity legal-toc--card gd-identity--${STATUS_RAMP[guide.status]}`}>
      <div className="gd-identity-tags">
        <StatusTag status={guide.status} />
        {cat && <a href={categoryHref(cat.slug)}>{cat.label}</a>}
      </div>
      <h1>{guide.name}</h1>
      {guide.alsoCalled && <p className="gd-identity-also">Also called {guide.alsoCalled}</p>}
      <dl className="gd-identity-facts">
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
        <a className="btn btn-sm btn-glass gd-identity-cta" href={shopHref}>
          Compare vendors
        </a>
      )}
    </aside>
  );
}

export function MoreFor({ guide, rows }: { guide: Guide; rows: IndexRow[] }) {
  const cat = categoryBySlug(guide.category);
  if (!cat || !rows.length) return null;
  return (
    <section className="gd-more" aria-labelledby="more-h">
      <h2 id="more-h">More for {cat.label.toLowerCase()}</h2>
      <div className="gd-slabs gd-slabs--grid">
        {rows.map((r) => (
          <SlabCard key={r.slug} row={r} />
        ))}
      </div>
    </section>
  );
}
