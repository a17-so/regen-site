import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;

