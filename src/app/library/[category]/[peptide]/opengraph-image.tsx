import { ImageResponse } from "next/og";
import { PEPTIDES, categoryBySlug, peptideBySlug } from "../../../lib/library";

export const alt = "REGEN Library peptide reference";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PEPTIDES.map((p) => ({ category: p.category, peptide: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string; peptide: string }>;
}) {
  const { peptide } = await params;
  const p = peptideBySlug(peptide);
  const name = p?.name ?? "REGEN Library";
  const cat = p ? categoryBySlug(p.category)?.label ?? "" : "";
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
          REGEN Library{cat ? ` · ${cat}` : ""}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
            {name}
          </div>
          {p?.researchTier && (
            <div style={{ display: "flex", fontSize: 30, opacity: 0.7, marginTop: 16 }}>
              Research grade {p.researchTier} · {p.sources.length} references
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.7 }}>regenhealth.app</div>
      </div>
    ),
    size
  );
}
