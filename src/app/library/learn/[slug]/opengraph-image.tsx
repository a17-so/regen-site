import { ImageResponse } from "next/og";
import { LEARN_ARTICLES, learnBySlug } from "../../../lib/libraryLearn";

export const alt = "REGEN Library guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = learnBySlug(slug);
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
          REGEN Library · {a?.kind === "comparison" ? "Comparison" : "Guide"}
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
          {a?.title ?? "REGEN Library"}
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.7 }}>regenhealth.app</div>
      </div>
    ),
    size
  );
}
