import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../lib/ogCard";

export const alt = "REGEN Peptide Library";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({
    title: "Peptide Library",
    category: "REGEN",
    layout: "entity",
    subtitle: "Every peptide, mapped to the body. What it is, how it works, its FDA status, and what the research shows.",
  });
}
