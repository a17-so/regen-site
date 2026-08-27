// Next.js merges metadata shallowly at the `openGraph` / `twitter` keys: a page
// that declares either one WITHOUT `images` replaces the root layout's block
// entirely, so the page ships with no og:image at all. Every page that sets its
// own openGraph must therefore restate the image. Routes with a file-convention
// `opengraph-image.tsx` (blog posts, reference pages, learn articles) are the
// exception, since that file injects the tags itself.
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "REGEN Health",
} as const;

export const OG_IMAGES = [OG_IMAGE];
export const TWITTER_IMAGES = [OG_IMAGE.url];
