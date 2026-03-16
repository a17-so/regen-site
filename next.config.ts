import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;

