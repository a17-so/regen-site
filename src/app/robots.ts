import type { MetadataRoute } from "next";

const BASE_URL = (process.env.SITE_URL ?? "https://regenhealth.app").replace(
  /\/$/,
  ""
);

// Explicitly welcome the AI-search + classic crawlers (crawler access is binary
// for AI citations). GPTBot is OpenAI's TRAINING crawler; it is allowed by
// default here (brand presence in model knowledge). To opt OUT of training use
// without affecting ChatGPT search, change GPTBot's entry to { disallow: "/" }.
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
