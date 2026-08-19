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
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CoverCard } from "../../../lib/cover";
import { POSTS } from "../posts";

export const dynamic = "force-static";
// 4:3 -- the shape the blog card crops to.
export const size = { width: 1200, height: 900 };
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

  const fonts = join(process.cwd(), "public", "fonts");
  const [display, mono] = await Promise.all([
    readFile(join(fonts, "NeueMontreal-Bold.otf")),
    readFile(join(fonts, "IBMPlexSans-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <CoverCard
        input={{
          title: post.title,
          category: post.category,
          stat: post.stat,
          variant: "vivid",
        }}
      />
    ),
    {
      ...size,
      fonts: [
        { name: "NeueMontreal", data: display, style: "normal", weight: 700 },
        { name: "Plex", data: mono, style: "normal", weight: 500 },
      ],
    }
  );
}
