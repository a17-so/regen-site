/**
 * Per-post blog cover, drawn at build time.
 *
 * Replaces sourced cover art (stock photo / AI image / one of five app
 * screenshots / a Google Drive link). That approach left 13 posts sharing 5
 * images, 11 covers on a host Google cannot crawl, and a per-post image-search
 * + vision-QA bill. These are unique by construction, cost nothing per post,
 * and are served from our own domain.
 *
 * Same engine the site already uses for social cards (next/og). Prerendered:
 * generateStaticParams + force-static means all covers are baked into the
 * build, so a reader never waits on an image render.
 *
 * The drawing is lib/coverArt.tsx (tiles and the one figure, no words); the
 * social card keeps lib/cover.tsx, which carries the caption and the mark a
 * link preview needs.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CoverArt } from "../../../lib/coverArt";
import { POSTS } from "../posts";

export const dynamic = "force-static";
// 3:2 -- the shape the blog card and the featured pane crop to.
export const size = { width: 1200, height: 800 };
export const contentType = "image/png";

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return new Response("Not found", { status: 404 });

  const display = await readFile(join(process.cwd(), "public", "fonts", "NeueMontreal-Bold.otf"));

  return new ImageResponse(
    <CoverArt input={{ category: post.category, seed: slug }} />,
    {
      ...size,
      fonts: [{ name: "NeueMontreal", data: display, style: "normal", weight: 700 }],
    }
  );
}
