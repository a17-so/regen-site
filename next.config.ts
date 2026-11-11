import type { NextConfig } from "next";
import guideSeed from "./src/app/lib/data/guide-seed.json";

// The library went flat on 2026-11-06: `/library/<category>/<compound>` and
// its chapter pages became `/library/<compound>`, and a few compounds took
// the reference's slug (hcg -> human-chorionic-gonadotropin). Every renamed
// pair comes from the seed, so a rename there is a redirect here without a
// second list to keep in step.
const OLD_CATEGORIES = "weight-loss|recovery|performance|longevity|aesthetics|cognitive";
const SEED_SLUGS = new Set((guideSeed as { slug: string }[]).map((s) => s.slug));
const RENAMED = (guideSeed as { slug: string; catalogSlug?: string }[])
  .filter((s) => s.catalogSlug && s.catalogSlug !== s.slug)
  .map((s) => ({ from: s.catalogSlug as string, to: s.slug }));
// A catalog slug that is not itself a library page (snap-8, hcg, mk-677)
// also redirects at the flat address, since those pages were once live.
// One that IS a page (bremelanotide is the approved drug, pt-141 the
// research compound; both have pages) must not.
const RENAMED_FLAT = RENAMED.filter(({ from }) => !SEED_SLUGS.has(from));
const EXCLUDED = [
  { from: "cjc-1295-no-dac", to: "/library/cjc-1295" },
  ...["bpc-157-tb-500-blend", "cjc-1295-no-dac-ipamorelin-blend", "tesamorelin-ipamorelin-blend", "glow", "klow"].map((slug) => ({ from: slug, to: `/shop/${slug}` })),
];

const nextConfig: NextConfig = {
  images: {
    // Local image sources may carry a query string (a cache-busting
    // `?v=N`). Without this entry next/image refuses any local src with one.
    localPatterns: [{ pathname: "/**" }],
  },
  async redirects() {
    return [
      // A post named for a competitor's app was removed (never name
      // competitors); its URL lands on our own GLP-1 tracker guide.
      { source: "/blog/shotsy-app", destination: "/blog/glp-1-tracker-app", permanent: true },
      // The old "best for" and "X vs Y" guides were deleted (2026-11-10).
      { source: "/library/learn", destination: "/library", permanent: true },
      { source: "/library/learn/:slug", destination: "/library", permanent: true },
      // Library: category hubs and the grade explainer folded into the hub.
      { source: "/library/how-we-grade", destination: "/library", permanent: true },
      { source: "/library/all-peptides", destination: "/library", permanent: true },
      // Renamed compounds first, so the generic rule below does not catch them.
      ...RENAMED.flatMap(({ from, to }) => [
        { source: `/library/:category(${OLD_CATEGORIES})/${from}`, destination: `/library/${to}`, permanent: true },
        { source: `/library/:category(${OLD_CATEGORIES})/${from}/:chapter`, destination: `/library/${to}`, permanent: true },
      ]),
      ...RENAMED_FLAT.map(({ from, to }) => ({ source: `/library/${from}`, destination: `/library/${to}`, permanent: true })),
      // Catalog items the library deliberately has no page for (the seed maps
      // them to null): the no-DAC form shares the CJC-1295 page, and each
      // blend lands on its shop comparison, so none of the once-live URLs
      // falls through to a 404.
      ...EXCLUDED.flatMap(({ from, to }) => [
        { source: `/library/:category(${OLD_CATEGORIES})/${from}`, destination: to, permanent: true },
        { source: `/library/:category(${OLD_CATEGORIES})/${from}/:chapter`, destination: to, permanent: true },
        { source: `/library/${from}`, destination: to, permanent: true },
      ]),
      { source: `/library/:category(${OLD_CATEGORIES})/:slug`, destination: "/library/:slug", permanent: true },
      { source: `/library/:category(${OLD_CATEGORIES})/:slug/:chapter`, destination: "/library/:slug", permanent: true },
      // The shop's saved list was briefly /shop/cart.
      { source: "/shop/cart", destination: "/shop/saved", permanent: true },
      // Sign-in was cut on 2026-11-08: the site is a vendor platform, no accounts.
      { source: "/account", destination: "/shop", permanent: true },
      // The shop went vendor-first on 2026-11-07: the ranked list IS /shop,
      // the compound catalog moved to /shop/catalog, and the COA archive,
      // the labs list and batch verify were folded into the vendor profiles.
      { source: "/shop/vendors", destination: "/shop", permanent: true },
      { source: "/shop/coas", destination: "/shop", permanent: true },
      { source: "/shop/labs", destination: "/shop", permanent: true },
      { source: "/shop/verify", destination: "/shop", permanent: true },
      // The old category hubs map onto the body-system categories.
      { source: "/library/weight-loss", destination: "/library/digestive", permanent: true },
      { source: "/library/recovery", destination: "/library/bones", permanent: true },
      { source: "/library/performance", destination: "/library/hormones", permanent: true },
      { source: "/library/longevity", destination: "/library/heart", permanent: true },
      { source: "/library/aesthetics", destination: "/library/skin", permanent: true },
      { source: "/library/cognitive", destination: "/library/brain", permanent: true },
      // /tools and /tools/reconstitution merged into one page: /tools IS the
      // reconstitution calculator now. 308 so the old URL's search signal
      // consolidates onto the merged page.
      {
        source: "/tools/reconstitution",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/ugc",
        destination:
          "https://fog-booklet-8f9.notion.site/31b39b5e840f80b6a5a5ff2c13cacfef?pvs=105",
        permanent: false,
      },
      {
        source: "/ai-influencers",
        destination:
          "https://fog-booklet-8f9.notion.site/31b39b5e840f80aba077c81dfceb98d9?pvs=105",
        permanent: false,
      },
      {
        source: "/payouts",
        destination:
          "https://fog-booklet-8f9.notion.site/31b39b5e840f802aa218e550456bc99a?pvs=105",
        permanent: false,
      },
      {
        source: "/payouts-ugc",
        destination:
          "https://fog-booklet-8f9.notion.site/32539b5e840f80f39b98db4793c3038b?pvs=105",
        permanent: false,
      },
      // A deleted blog post whose subject IS covered by a live post:
      // gonadorelin is a GnRH analog, and the GnRH-analog pharmacology post
      // answers what this URL promised. permanent: true = 308, so any signal
      // the old URL holds consolidates onto the live page.
      //
      // Two other posts were deleted at the same time and are deliberately
      // left as 404s rather than redirected:
      //   /blog/kpv-tripeptide-and-targeted-inflammatory-modulation
      //   /blog/thymosin-alpha-1-clinical-profiles
      // No live post covers KPV or thymosin alpha-1, and pointing them at a
      // loosely-related article is a soft-404 -- which Google treats as a
      // quality signal against the site, not a favour. Measured 2026-08-09:
      // all three had ZERO Search Console impressions and zero clicks over 90
      // days, so there is no equity to preserve and 404 is the honest answer.
      // If either subject gets written properly later, add its redirect then.
      {
        source: "/blog/hcg-vs-gonadorelin-clinical-utility",
        destination: "/blog/pharmacological-nuances-of-gnrh-analogs",
        permanent: true,
      },
      // The byline changed hands 2026-09-16 (see lib/authors.ts). The old
      // author page had been live and linked from every post for six days;
      // 308 it to the current byline rather than 404 a URL Google may hold.
      {
        source: "/authors/advaith-akella",
        destination: "/authors/ekam-mehat",
        permanent: true,
      },
      // Deleted 2026-09-22: three of its seven sections were built around
      // papers the agent's PubMed enrichment pulled in by keyword alone -- a
      // sepsis drug derived from hCG, a cancer marker, rectal suppositories --
      // so the page did not answer its own title. The library's hCG entry
      // does; 308 there. (0 clicks / 30 impressions in its 11 days live.)
      {
        source: "/blog/what-does-hcg-do-to-a-man-biology-pharmacokinetics",
        destination: "/library/human-chorionic-gonadotropin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

