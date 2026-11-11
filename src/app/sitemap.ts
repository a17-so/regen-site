import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "./lib/blogData";
import { generateStaticParams as blogStaticParams } from "./blog/[slug]/page";
import { CATEGORIES, GUIDE_INDEX, allGuides, categoryHref, guideHref } from "./lib/guides";
import { CALCULATOR_PRESETS } from "./lib/calculators";
import { SHOP_COMPOUNDS, SHOP_VENDORS, shopHref, vendorHref } from "./lib/shop";
import { BLOG_CATEGORIES } from "./lib/blogData";
import { allAuthors } from "./lib/authors";

// Canonical production origin. Override with SITE_URL if the domain ever changes.
const BASE_URL = (process.env.SITE_URL ?? "https://www.checkregen.app").replace(
  /\/$/,
  ""
);

// Parse a "May 18, 2026" style date into a Date, falling back to now.
function postDate(slug: string): Date {
  const match = BLOG_POSTS.find((p) => p.slug === slug);
  const parsed = match ? new Date(match.date) : new Date();
  return Number.isNaN(+parsed) ? new Date() : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/library`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // The reference page behind the calculators. Ranked above /tools itself:
    // it answers a question in its own right rather than hosting a widget.
    {
      url: `${BASE_URL}/tools/bacteriostatic-water`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // Marketplace. The compound pages carry live prices and change weekly.
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/shop/catalog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...BLOG_CATEGORIES.filter((c) => c !== "All").map((c) => ({
      url: `${BASE_URL}/blog/category/${c.toLowerCase()}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Only the blog slugs that actually render a page (POSTS keys).
  // Author pages: the byline behind every post.
  const authorRoutes: MetadataRoute.Sitemap = allAuthors().map((a) => ({
    url: `${BASE_URL}/authors/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogStaticParams().map(({ slug }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: postDate(slug),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Creator landing pages (/<slug>) are deliberately NOT listed: each one is
  // the homepage with a different App Store campaign tag and canonicals to
  // "/". Listing them told Google to index ten copies of the same page.

  // Library. Guide pages outrank the marketing routes on crawl priority: they
  // are the pages built to be found. The eight category pages sit above them
  // so a crawler that budgets shallowly still reaches every compound. Only
  // compounds with a written guide are listed; the index rows without one
  // render as static cards and have no URL yet.
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter((c) =>
    GUIDE_INDEX.some((r) => r.category === c.slug && r.hasGuide)
  ).map((c) => ({
    url: `${BASE_URL}${categoryHref(c.slug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const peptideRoutes: MetadataRoute.Sitemap = allGuides().map((g) => ({
    url: `${BASE_URL}${guideHref(g.slug)}`,
    lastModified: new Date(g.updated),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const chapterRoutes: MetadataRoute.Sitemap = [];

  // Per-compound reconstitution calculators. Same priority as a peptide hub:
  // a tool page answers a query the reference pages cannot (the reader's own
  // vial), and it is the page type a search answer panel cannot complete.
  const calculatorRoutes: MetadataRoute.Sitemap = CALCULATOR_PRESETS.map((c) => ({
    url: `${BASE_URL}/tools/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const shopRoutes: MetadataRoute.Sitemap = [
    ...SHOP_COMPOUNDS.map((c) => ({
      url: `${BASE_URL}${shopHref(c.slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: c.kind === "compound" ? 0.8 : 0.5,
    })),
    ...SHOP_VENDORS.map((v) => ({
      url: `${BASE_URL}${vendorHref(v.slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...peptideRoutes,
    ...chapterRoutes,
    ...calculatorRoutes,
    ...shopRoutes,
    ...blogRoutes,
    ...authorRoutes,
  ];
}
