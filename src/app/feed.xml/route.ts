import { BLOG_POSTS } from "../lib/blogData";
import { POSTS } from "../blog/[slug]/posts";
import { PRIMARY_AUTHOR } from "../lib/authors";

/**
 * RSS 2.0 for Science. One item per published post, newest first, with the
 * excerpt as the description. Readers and aggregators pick it up from the
 * <link rel="alternate"> on /blog.
 */
const SITE_URL = (process.env.SITE_URL ?? "https://www.checkregen.app").replace(/\/$/, "");

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function pubDate(slug: string, fallback: string): string {
  const iso = POSTS[slug]?.datePublished;
  const d = iso ? new Date(iso) : new Date(fallback);
  return Number.isNaN(+d) ? new Date().toUTCString() : d.toUTCString();
}

export const dynamic = "force-static";

export function GET() {
  const posts = BLOG_POSTS.filter((p) => POSTS[p.slug]).slice().sort((a, b) => b.dateSort - a.dateSort);
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}${p.href}</link>
      <guid isPermaLink="true">${SITE_URL}${p.href}</guid>
      <description>${esc(p.excerpt)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${pubDate(p.slug, p.date)}</pubDate>
      <author>${esc(PRIMARY_AUTHOR.name)}</author>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>REGEN Science</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Articles on peptides, protocols, and biomarkers: what the trials found, how the compounds work, and what the numbers on a lab panel mean. Cited to primary sources.</description>
    <language>en</language>
    <lastBuildDate>${posts[0] ? pubDate(posts[0].slug, posts[0].date) : new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
