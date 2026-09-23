import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../lib/ogCard";

export const alt = "How REGEN grades peptides";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({ title: "How We Grade", category: "Library", layout: "entity", subtitle: "S to F, decided by study design, not by claims" });
}
