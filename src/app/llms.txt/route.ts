import { BLOG_POSTS } from "../lib/blogData";

const SITE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(
  /\/$/,
  ""
);

// Serves /llms.txt — a lowest-priority, unratified convention (ship it, don't
// over-invest). Summarizes the site + lists blog articles for AI agents.
export function GET() {
  const lines = [
    "# REGEN",
    "",
    "> REGEN is a consumer health app and reference layer for people running peptide/biomarker protocols. It tracks vials, doses, and biomarkers, and gives an AI second opinion grounded in cited research.",
    "",
    "## Key pages",
    `- [Home](${SITE_URL}/): what REGEN is`,
    `- [Blog](${SITE_URL}/blog): educational articles on biomarkers, peptides, and protocols`,
    "",
    "## Blog articles",
    ...BLOG_POSTS.map((p) => `- [${p.title}](${SITE_URL}${p.href}): ${p.excerpt}`),
    "",
    "## Content policy",
    "Educational only, not medical advice. Quantitative claims are cited to primary sources. REGEN does not prescribe, diagnose, or recommend dosing.",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
