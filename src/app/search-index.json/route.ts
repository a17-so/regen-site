import { guideSearchRows } from "../lib/guides";
import { BLOG_POSTS } from "../lib/blogData";
import { categoryTitle } from "../blog/ScienceParts";
import compoundsRaw from "../lib/data/shop-compounds.json";

/**
 * The site search index: every library guide, Science article, and shop
 * compound as one flat list. The header's search fetches this once, on first
 * open, so no page carries the index in its own payload.
 */
export interface SiteSearchRow {
  name: string;
  href: string;
  kind: "Library" | "Science" | "Shop";
  meta: string;
  blurb?: string;
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
    ...guideSearchRows().map((g) => ({ name: g.name, href: g.href, kind: "Library" as const, meta: g.category, blurb: g.blurb })),
    ...BLOG_POSTS.map((p) => ({ name: p.title, href: p.href, kind: "Science" as const, meta: categoryTitle(p.category), blurb: p.excerpt })),
    ...(compoundsRaw as ShopCompoundRow[])
      .filter((c) => c.vendorCount > 0)
      .map((c) => ({
        name: c.name,
        href: `/shop/${c.slug}`,
        kind: "Shop" as const,
        meta: `${c.vendorCount} vendor${c.vendorCount === 1 ? "" : "s"}`,
      })),
  ];
  return Response.json(rows, { headers: { "Cache-Control": "public, max-age=3600" } });
}
