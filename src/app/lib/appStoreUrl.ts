/**
 * Approved creator slugs.
 * Add new creators here — no other files need to change.
 */
export const APPROVED_CREATORS: ReadonlySet<string> = new Set([
  "achilleas",
  "bareblad",
  "ethan",
  "flash",
  "hullo",
  "jomltn",
  "kyan",
  "matteo"
]);

export function isApprovedCreator(slug: string): boolean {
  return APPROVED_CREATORS.has(slug);
}

/**
 * Builds an App Store campaign URL for the REGEN app.
 * @param creatorSlug - Optional creator slug used as the `ct` campaign parameter.
 *                      Defaults to "landing-page" when omitted (root route behavior).
 */
export function buildAppStoreUrl(creatorSlug?: string): string {
  const url = new URL(
    "https://apps.apple.com/app/apple-store/id6756548399"
  );
  url.searchParams.set("pt", "127832534");
  url.searchParams.set("ct", creatorSlug ?? "landing-page");
  url.searchParams.set("mt", "8");
  return url.toString();
}
