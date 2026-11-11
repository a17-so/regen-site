import { allGuides, guideSearchRows, categoryBySlug } from "../lib/guides";
import { BLOG_POSTS } from "../lib/blogData";
import { categoryTitle } from "../blog/ScienceParts";
import compoundsRaw from "../lib/data/shop-compounds.json";
import { SHOP_VENDORS, effectiveScore, scoreBand } from "../lib/shop";
import { CALCULATOR_PRESETS } from "../lib/calculators";

/**
 * The site search index: every library guide, Science article, marketplace
 * compound and vendor, the site's own pages and the calculators, as one
 * flat list, each row labelled by what it is. The header's search fetches
 * this once, on first open, so no page carries the index in its own payload.
 *
 * `keywords` is everything a query may match beyond the name (2026-11-11,
 * "does the search have a proper function, like anything you search for
 * it'll work"): a guide's other names (brand names), class, body system
 * with the everyday words people use for it ("weight loss", "sleep", "hair
 * loss"), status and summary; a vendor's domain; a page's synonyms.
 */
export interface SiteSearchRow {
  name: string;
  href: string;
  kind: "Guide" | "Article" | "Compound" | "Vendor" | "Page" | "Tool";
  meta: string;
  /** Other names, matched as strongly as the name (brand names, a domain). */
  alt?: string;
  /** Specific text a query may match (class, summary, excerpt), never shown. */
  keywords?: string;
  /** The body system's everyday words; the weakest match, so a goal finds
      every compound for it but the ones whose own text names it rank first. */
  topic?: string;
}

interface ShopCompoundRow {
  slug: string;
  name: string;
  kind: string;
  vendorCount: number;
  guideSlug: string | null;
  category: string | null;
}

/** The everyday words for each body system, so a goal finds its compounds. */
const SYSTEM_WORDS: Record<string, string> = {
  brain: "brain sleep insomnia cognition focus memory mood anxiety stress depression nootropic neuro nerve",
  skin: "skin aging anti-aging hair hair loss wrinkles collagen tanning beauty cosmetic wound acne glow",
  hormones: "hormones metabolism growth hormone gh hgh testosterone diabetes insulin blood sugar energy longevity mitochondria",
  immune: "immune immunity defense infection antibiotic antifungal antimicrobial antiviral inflammation",
  heart: "heart blood cardiovascular blood pressure clotting cholesterol circulation",
  digestive: "digestive gut stomach weight loss fat loss obesity appetite glp-1 glp1 diabetes bowel",
  sexual: "sexual sex libido arousal erectile fertility ivf reproductive pregnancy menopause prostate",
  bones: "bones bone muscle muscles strength recovery injury tendon ligament joint healing bodybuilding osteoporosis",
};

const PAGES: SiteSearchRow[] = [
  { name: "Peptide Library", href: "/library", kind: "Page", meta: "Every peptide by body system", keywords: "library encyclopedia peptides compounds body systems guides" },
  { name: "Science", href: "/blog", kind: "Page", meta: "Articles and research", alt: "blog articles", keywords: "science blog articles research studies news" },
  { name: "Marketplace", href: "/shop", kind: "Page", meta: "Vendors, ranked and graded", alt: "vendors stores shop", keywords: "marketplace shop vendors stores sellers where to buy ranking best vendor coa certificates testing" },
  { name: "Compound catalog", href: "/shop/catalog", kind: "Page", meta: "Every compound sold, by body system", alt: "prices", keywords: "catalog compounds prices price per mg compare buy" },
  { name: "Submit a vendor", href: "/shop/submit", kind: "Page", meta: "Add a store or a certificate", keywords: "submit vendor add store list my store brand certificate coa apply" },
  { name: "Saved", href: "/shop/saved", kind: "Page", meta: "Packs you saved", keywords: "saved bookmarks favorites cart" },
  { name: "Tools", href: "/tools", kind: "Page", meta: "Calculators", alt: "calculators", keywords: "tools calculator calculators reconstitution dose dosing units syringe math" },
  { name: "Bacteriostatic water guide", href: "/tools/bacteriostatic-water", kind: "Tool", meta: "Reconstitution", keywords: "bac water bacteriostatic water reconstitution mixing" },
  { name: "FAQ", href: "/faq", kind: "Page", meta: "Questions and answers", keywords: "faq questions help support how does regen work app" },
  { name: "Medical disclaimer", href: "/disclaimer", kind: "Page", meta: "Legal", keywords: "disclaimer medical advice legal" },
  { name: "Privacy policy", href: "/privacy", kind: "Page", meta: "Legal", keywords: "privacy data policy legal" },
  { name: "Terms of service", href: "/terms", kind: "Page", meta: "Legal", keywords: "terms service conditions legal" },
];

export const dynamic = "force-static";

export function GET() {
  const guides = new Map(allGuides().map((g) => [g.slug, g]));
  const systemWords = (cat: string | null | undefined) => (cat ? `${categoryBySlug(cat)?.label ?? ""} ${SYSTEM_WORDS[cat] ?? ""}` : "");

  const rows: SiteSearchRow[] = [
    ...guideSearchRows().map((r) => {
      const g = guides.get(r.slug);
      return {
        name: r.name,
        href: r.href,
        kind: "Guide" as const,
        meta: r.category,
        alt: g?.alsoCalled,
        keywords: [g?.class, r.status, g?.summary?.slice(0, 220)].filter(Boolean).join(" "),
        topic: systemWords(g?.category),
      };
    }),
    ...BLOG_POSTS.map((p) => ({ name: p.title, href: p.href, kind: "Article" as const, meta: categoryTitle(p.category), keywords: `${categoryTitle(p.category)} ${p.excerpt ?? ""}` })),
    ...(compoundsRaw as ShopCompoundRow[])
      .filter((c) => c.vendorCount > 0)
      .map((c) => {
        const g = c.guideSlug ? guides.get(c.guideSlug) : undefined;
        return {
          name: c.name,
          href: `/shop/${c.slug}`,
          kind: "Compound" as const,
          meta: `${c.vendorCount} vendor${c.vendorCount === 1 ? "" : "s"}`,
          alt: g?.alsoCalled,
          keywords: "buy price prices cheap cheapest deal compare vendors where to buy",
          topic: systemWords(c.category),
        };
      }),
    ...SHOP_VENDORS.map((v) => ({
      name: v.name,
      href: `/shop/vendors/${v.slug}`,
      kind: "Vendor" as const,
      meta: `${scoreBand(effectiveScore(v))} · #${v.rank} of ${SHOP_VENDORS.length}`,
      alt: v.domain ?? undefined,
      keywords: "vendor store shop coa certificates testing",
    })),
    ...PAGES,
    ...CALCULATOR_PRESETS.map((c) => ({
      name: `${c.peptide.name} calculator`,
      href: `/tools/${c.slug}`,
      kind: "Tool" as const,
      meta: "Reconstitution",
      keywords: "calculator reconstitution dose units syringe bac water",
    })),
  ];
  return Response.json(rows, { headers: { "Cache-Control": "public, max-age=3600" } });
}
