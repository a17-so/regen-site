import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../lib/ogCard";

export const alt = "REGEN Peptide Library";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({ title: "Peptide Library", category: "Library", layout: "entity", subtitle: "Every compound graded on evidence quality, with dosing, side effects, and sources" });
}
