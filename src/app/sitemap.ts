import type { MetadataRoute } from "next";
import { APPROVED_CREATORS } from "./lib/appStoreUrl";
import { BLOG_POSTS } from "./lib/blogData";
import { generateStaticParams as blogStaticParams } from "./blog/[slug]/page";

// Canonical production origin. Override with SITE_URL if the domain ever changes.
const BASE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(
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
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Only the blog slugs that actually render a page (POSTS keys).
  const blogRoutes: MetadataRoute.Sitemap = blogStaticParams().map(({ slug }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: postDate(slug),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const creatorRoutes: MetadataRoute.Sitemap = Array.from(APPROVED_CREATORS).map(
    (slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    })
  );

  return [...staticRoutes, ...blogRoutes, ...creatorRoutes];
}
