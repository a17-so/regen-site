import type { CSSProperties } from "react";
import { STATUS_TONE, statusLabel, type StatusKey } from "../lib/guideVocab";
import { tileRowArt } from "./tileArt";

/**
 * The library row: the identity card, simplified to a row ("the cards are a
 * little overwhelming, simplify those"). The brand tiles in the status ramp
 * on the left (static), then the name and the status as a small glass tag,
 * no dot: the tiles carry the colour. One glass pane. Not the reference's
 * tile: their liquid stills, colour bar and slab are theirs; the tiles are
 * REGEN's. A compound whose full guide is still being written opens its
 * brief page. (A structure-of-cubes artwork was tried on 2026-11-08 and
 * rejected: "fuck off with the cube artwork".)
 */
export default function LibraryCard({
  slug,
  name,
  status,
  href,
  pending = false,
}: {
  slug: string;
  name: string;
  status: StatusKey;
  href?: string;
  /** The compound's class (kept for callers; the simplified row omits it). */
  className?: string;
  pending?: boolean;
}) {
  const tone = STATUS_TONE[status];
  const cls = `lc lc--${tone}${pending ? " is-pending" : ""}`;
  const inner = (
    <>
      <span className={`lc-art gi-art--${tone}`} aria-hidden="true">
        {tileRowArt(slug).map((t, i) => (
          <i
            key={i}
            className={`sq sq-${tone} lc-tile`}
            style={{ "--x": `${t.x}%`, "--y": `${t.y}%`, "--s": `${t.s}%`, "--sq-rot": `${t.r}deg` } as CSSProperties}
          />
        ))}
      </span>
      <span className="lc-body">
        <span className="lc-name">{name}</span>
        <span className="lc-tag">{statusLabel(status)}</span>
      </span>
    </>
  );
  return href ? (
    <a className={cls} href={href} data-slug={slug}>
      {inner}
    </a>
  ) : (
    <div className={cls} data-slug={slug}>
      {inner}
    </div>
  );
}
