import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../lib/ogCard";
import { paletteForRamp } from "../../lib/cover";
import { CATEGORIES, categoryBySlug, peptidesInCategory } from "../../lib/library";

export const alt = "REGEN Library category";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const meta = categoryBySlug(category);
  if (!meta) return ogCard({ title: "REGEN Library", category: "Library", layout: "entity" });
  const count = peptidesInCategory(meta.slug).length;
  return ogCard({
    title: `${meta.label} Peptides`,
    category: "Library",
    palette: paletteForRamp(meta.ramp),
    layout: "entity",
    subtitle: `${count} compounds, each graded on evidence quality`,
  });
}
