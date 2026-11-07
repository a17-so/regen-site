import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { JsonLd } from "../components/JsonLd";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../lib/blogData";
import { SITE_URL } from "../library/parts";
import { CategorySection, CategoryTabs, TopArticles } from "./ScienceParts";
import SubscribeForm from "./SubscribeForm";

const TITLE = "Science";
const DESCRIPTION = `${BLOG_POSTS.length} articles on peptides, protocols, and biomarkers: what the trials found, how the compounds work, and what the numbers on a lab panel mean. Cited to primary sources.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN`,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: `${SITE_URL}/blog`, title: `REGEN ${TITLE}`, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: `REGEN ${TITLE}`, description: DESCRIPTION },
};

/**
 * The Science hub, in the reference blog's shape: a headline with the
 * subscribe field, category tabs, the newest articles as a featured block,
 * then one section per category with "See all" into its own page. The old
 * searchable grid lives on under /blog/category/<slug>.
 */
export default function ScienceHub() {
  const appStoreUrl = buildAppStoreUrl();
  const sorted = BLOG_POSTS.slice().sort((a, b) => b.dateSort - a.dateSort);
  const categories = BLOG_CATEGORIES.filter((c) => c !== "All");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `REGEN ${TITLE}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    isPartOf: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <header className="lib-hero sc-hero">
          <div className="lib-hero-inner">
            <p className="sc-eyebrow">REGEN Science</p>
            <h1>
              What the research
              <br />
              <span className="accent-phrase">actually says.</span>
            </h1>
            <p className="lib-hero-sub">
              Peptides, protocols, and biomarkers, one study at a time. New articles every week, cited to the primary
              sources.
            </p>
            <SubscribeForm />
          </div>
          <CategoryTabs />
        </header>

        <div className="lib-page sc-page">
          <TopArticles posts={sorted.slice(0, 5)} />
          {categories.map((c) => (
            <CategorySection key={c} category={c} posts={sorted.filter((p) => p.category === c)} />
          ))}
        </div>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
