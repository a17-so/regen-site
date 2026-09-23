import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../lib/ogCard";

export const alt = "REGEN Library guides";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({ title: "Peptide Guides", category: "Library", layout: "entity", subtitle: "Best-for rankings and head-to-head comparisons, built from the graded reference" });
}
