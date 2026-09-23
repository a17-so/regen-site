import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../../lib/ogCard";
import { paletteForRamp } from "../../../lib/cover";
import { PEPTIDES, categoryBySlug, peptideBySlug, rampFor } from "../../../lib/library";

export const alt = "REGEN Library peptide reference";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return PEPTIDES.map((p) => ({ category: p.category, peptide: p.slug }));
}

/** Compound name in its category ramp, the grade and source count under it:
    the same three facts the reference header and the card lead with. */
export default async function Image({
  params,
}: {
  params: Promise<{ category: string; peptide: string }>;
}) {
  const { peptide } = await params;
  const p = peptideBySlug(peptide);
  if (!p) return ogCard({ title: "REGEN Library", category: "Library", layout: "entity" });
  const cat = categoryBySlug(p.category);
  const refs = p.sources.length;
  const subtitle = [
    p.researchTier ? `Research grade ${p.researchTier}` : null,
    refs ? `${refs} reference${refs === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return ogCard({
    title: p.name,
    category: cat?.label ?? "Library",
    palette: paletteForRamp(rampFor(p)),
    layout: "entity",
    subtitle: subtitle || p.subtitle,
  });
}
