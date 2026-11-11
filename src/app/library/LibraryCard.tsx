import { CATEGORY_TONE, CATEGORY_SHADE, statusLabel, type CategorySlug, type StatusKey } from "../lib/guideVocab";
import { libraryAura } from "../lib/aura";

/**
 * The library row: the name and the status (words, a small glass tag)
 * beside a thumbnail in the compound's BODY SYSTEM colour: a soft aura in
 * the app's ramp for that system, seeded by the slug, painted as CSS (no
 * image, nothing to load). Colour codes the body system, never the FDA
 * status (2026-11-09). Rejected before it: brand-tile compositions ("the
 * stupid squares") and a structure-of-cubes drawing ("fuck off with the
 * cube artwork"). A compound whose full guide is still being written opens
 * its brief page.
 */
export default function LibraryCard({
  slug,
  name,
  status,
  category,
  href,
  pending = false,
}: {
  slug: string;
  name: string;
  status: StatusKey;
  category: CategorySlug;
  href?: string;
  /** The compound's class (kept for callers; the simplified row omits it). */
  className?: string;
  pending?: boolean;
}) {
  const tone = CATEGORY_TONE[category];
  const cls = `lc lc--${tone}${pending ? " is-pending" : ""}`;
  const inner = (
    <>
      <span className="lc-art lib-aura" style={libraryAura(tone, slug, CATEGORY_SHADE[category])} aria-hidden="true" />
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
