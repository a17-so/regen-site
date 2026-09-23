import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../../../lib/ogCard";
import { paletteForRamp } from "../../../../lib/cover";
import {
  CHAPTERS,
  PEPTIDES,
  categoryBySlug,
  chapterBySlug,
  peptideBySlug,
  rampFor,
} from "../../../../lib/library";

export const alt = "REGEN Library peptide reference";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return PEPTIDES.flatMap((p) =>
    CHAPTERS.filter((c) => p.chapters.some((ch) => ch.key === c.key)).map((c) => ({
      category: p.category,
      peptide: p.slug,
      chapter: c.slug,
    }))
  );
}

/** Compound name in its ramp, the chapter's title as the line beneath. The
    chip carries the chapter label so a shared dosage page says "dosage". */
export default async function Image({
  params,
}: {
  params: Promise<{ category: string; peptide: string; chapter: string }>;
}) {
  const { peptide, chapter } = await params;
  const p = peptideBySlug(peptide);
  const meta = chapterBySlug(chapter);
  if (!p) return ogCard({ title: "REGEN Library", category: "Library", layout: "entity" });
  const cat = categoryBySlug(p.category)?.label ?? "Library";
  return ogCard({
    title: p.name,
    category: meta ? `${cat} · ${meta.label}` : cat,
    palette: paletteForRamp(rampFor(p)),
    layout: "entity",
    subtitle: meta?.titleSuffix ?? p.subtitle,
  });
}
