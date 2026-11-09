import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { JsonLd } from "../components/JsonLd";
import { BLOG_POSTS } from "../lib/blogData";
import { SITE_URL } from "../library/parts";
import ScienceHubView from "./ScienceHub";
import { byDate } from "./ScienceParts";

const TITLE = "Science";
const DESCRIPTION = `${BLOG_POSTS.length} articles on peptides, protocols, and biomarkers: what the trials found, how the compounds work, and what the numbers on a lab panel mean. Cited to primary sources.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN`,
  description: DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: { type: "website", url: `${SITE_URL}/blog`, title: `REGEN ${TITLE}`, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: `REGEN ${TITLE}`, description: DESCRIPTION },
};

/** The Science hub: the blog, on the site's page anatomy. See ScienceHub.tsx. */
export default function ScienceHub() {
  const appStoreUrl = buildAppStoreUrl();
  const posts = byDate(BLOG_POSTS);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog#collection`,
        name: `REGEN ${TITLE}`,
        description: DESCRIPTION,
        url: `${SITE_URL}/blog`,
        isPartOf: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "ItemList",
        name: `REGEN ${TITLE}`,
        numberOfItems: posts.length,
        itemListElement: posts.slice(0, 50).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          url: `${SITE_URL}${p.href}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app">
        <div className="page-wash" aria-hidden="true" />
        <ScienceHubView initial="all" />
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
