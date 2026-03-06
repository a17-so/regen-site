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
    ];
  },
};

export default nextConfig;
