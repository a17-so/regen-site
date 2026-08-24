import { ImageResponse } from "next/og";
import { CHAPTERS, PEPTIDES, chapterBySlug, peptideBySlug } from "../../../../lib/library";

export const alt = "REGEN Library peptide reference";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PEPTIDES.flatMap((p) =>
    CHAPTERS.filter((c) => p.chapters.some((ch) => ch.key === c.key)).map((c) => ({
      category: p.category,
      peptide: p.slug,
      chapter: c.slug,
    }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string; peptide: string; chapter: string }>;
}) {
  const { peptide, chapter } = await params;
  const p = peptideBySlug(peptide);
  const meta = chapterBySlug(chapter);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          color: "#ffffff",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, opacity: 0.7 }}>
          REGEN Library{meta ? ` · ${meta.label}` : ""}
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
          {p?.name ?? "REGEN"} {meta?.titleSuffix ?? ""}
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.7 }}>regenhealth.app</div>
      </div>
    ),
    size
  );
}
