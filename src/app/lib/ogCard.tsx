/**
 * Social cards (og:image / twitter:image), drawn with the same engine as the
 * blog covers (`lib/cover.tsx`) so a shared link looks like the card it links
 * to. Every `opengraph-image.tsx` on the site goes through `ogCard()`: it
 * loads the brand fonts once per render, sets the 1.91:1 size, and picks
 * the "vivid" variant, which is the treatment the blog index shows.
 *
 * Only the 1200x630 size and font loading live here; what goes ON the card is
 * the caller's decision, passed as a `CoverInput`.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CoverCard, type CoverInput } from "./cover";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

async function fonts() {
  const dir = join(process.cwd(), "public", "fonts");
  const [display, plex] = await Promise.all([
    readFile(join(dir, "NeueMontreal-Bold.otf")),
    readFile(join(dir, "IBMPlexSans-Medium.ttf")),
  ]);
  return [
    { name: "NeueMontreal", data: display, style: "normal" as const, weight: 700 as const },
    { name: "Plex", data: plex, style: "normal" as const, weight: 500 as const },
  ];
}

export async function ogCard(input: Omit<CoverInput, "aspect" | "variant">) {
  return new ImageResponse(
    <CoverCard input={{ ...input, variant: "vivid", aspect: "og" }} />,
    { ...OG_SIZE, fonts: await fonts() }
  );
}
