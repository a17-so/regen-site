import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../../lib/ogCard";
import { paletteForRamp } from "../../../lib/cover";
import { rampFor } from "../../../lib/library";
import { LEARN_ARTICLES, learnBySlug, membersOf } from "../../../lib/libraryLearn";

export const alt = "REGEN Library guide";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ slug: a.slug }));
}

/** A comparison title ("X vs Y") takes the cover engine's split layout; a
    best-for guide runs its title as a question so the payload carries the
    ramp. Colour comes from the guide's first member, the same rule the page
    header uses. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = learnBySlug(slug);
  if (!a) return ogCard({ title: "REGEN Library", category: "Library", layout: "entity" });
  const first = membersOf(a)[0];
  const palette = first ? paletteForRamp(rampFor(first)) : undefined;
  const comparison = a.kind === "comparison" && /\bvs\.?\b/i.test(a.title);
  return ogCard({
    title: a.title,
    category: a.kind === "comparison" ? "Comparison" : "Guide",
    palette,
    layout: comparison ? "comparison" : "question",
  });
}
