import { guideSearchRows } from "../lib/guides";
import { BLOG_POSTS } from "../lib/blogData";
import { categoryTitle } from "../blog/ScienceParts";
import compoundsRaw from "../lib/data/shop-compounds.json";
import { SHOP_VENDORS, effectiveScore, scoreBand } from "../lib/shop";

/**
 * The site search index: every library guide, Science article, marketplace
 * compound and vendor as one flat list, each row labelled by what it is
 * (Guide · Article · Compound · Vendor). The header's search fetches this
 * once, on first open, so no page carries the index in its own payload.
 */
export interface SiteSearchRow {
  name: string;
  href: string;
  kind: "Guide" | "Article" | "Compound" | "Vendor";
  meta: string;
  blurb?: string;
  /** Extra text a query may match (a vendor's domain). */
  alt?: string;
}

interface ShopCompoundRow {
  slug: string;
  name: string;
  kind: string;
  vendorCount: number;
}

export const dynamic = "force-static";

export function GET() {
  const rows: SiteSearchRow[] = [
    ...guideSearchRows().map((g) => ({ name: g.name, href: g.href, kind: "Guide" as const, meta: g.category, blurb: g.blurb })),
    ...BLOG_POSTS.map((p) => ({ name: p.title, href: p.href, kind: "Article" as const, meta: categoryTitle(p.category), blurb: p.excerpt })),
    ...(compoundsRaw as ShopCompoundRow[])
      .filter((c) => c.vendorCount > 0)
      .map((c) => ({
        name: c.name,
        href: `/shop/${c.slug}`,
        kind: "Compound" as const,
        meta: `${c.vendorCount} vendor${c.vendorCount === 1 ? "" : "s"}`,
      })),
    ...SHOP_VENDORS.map((v) => ({
      name: v.name,
      href: `/shop/vendors/${v.slug}`,
      kind: "Vendor" as const,
      meta: `${scoreBand(effectiveScore(v))} · #${v.rank} of ${SHOP_VENDORS.length}`,
      alt: v.domain ?? undefined,
    })),
  ];
  return Response.json(rows, { headers: { "Cache-Control": "public, max-age=3600" } });
}
