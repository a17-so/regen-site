import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../lib/ogCard";
import { paletteForRamp } from "../../lib/cover";
import { CATEGORIES, GUIDE_INDEX, categoryBySlug, guideBySlug, rowsInCategory, statusLabel } from "../../lib/guides";
import { STATUS_RAMP } from "../GuideParts";

export const alt = "REGEN Peptide Library";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [
    ...CATEGORIES.map((c) => ({ slug: c.slug })),
    ...GUIDE_INDEX.filter((r) => r.hasGuide).map((r) => ({ slug: r.slug })),
  ];
}

/** Name, status and evidence: the three facts the identity card leads with.
    The card wears the status ramp, the same mapping the page's dots use. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (cat) {
    const n = rowsInCategory(cat.slug).length;
    return ogCard({
      title: cat.label,
      category: "Peptide Library",
      palette: paletteForRamp("cool"),
      layout: "entity",
      subtitle: `${n} peptide${n === 1 ? "" : "s"} · ${cat.blurb}`,
    });
  }
  const g = guideBySlug(slug);
  if (!g) return ogCard({ title: "Peptide Library", category: "REGEN", layout: "entity" });
  return ogCard({
    title: g.name,
    category: categoryBySlug(g.category)?.label ?? "Peptide Library",
    palette: paletteForRamp(STATUS_RAMP[g.status]),
    layout: "entity",
    subtitle: `${statusLabel(g.status)} · ${g.evidence}`,
  });
}
