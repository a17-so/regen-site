import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../lib/ogCard";

export const alt = "REGEN Library A-Z";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({ title: "All Peptides", category: "Library", layout: "entity", subtitle: "The full alphabetical index, with research grade beside every name" });
}
