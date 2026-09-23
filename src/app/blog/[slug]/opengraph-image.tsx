import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../lib/ogCard";
import { POSTS } from "./posts";

export const alt = "REGEN blog article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

/** The post's own cover, at social size: same title, category, and stat the
    blog card draws, so the link preview matches the card it came from. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  return ogCard({
    title: post?.title ?? "REGEN",
    category: post?.category ?? "Science",
    stat: post?.stat,
  });
}
