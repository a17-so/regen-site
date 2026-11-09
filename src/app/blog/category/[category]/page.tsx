import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../../lib/appStoreUrl";
import NavBar from "../../../components/NavBar";
import PageClose from "../../../components/PageClose";
import { JsonLd } from "../../../components/JsonLd";
import { BLOG_POSTS } from "../../../lib/blogData";
import { SITE_URL } from "../../../library/parts";
import ScienceHubView from "../../ScienceHub";
import { SCIENCE_CATEGORIES, categorySlug, categoryTitle } from "../../ScienceParts";

export function generateStaticParams() {
  return SCIENCE_CATEGORIES.map((c) => ({ category: categorySlug(c) }));
}

export const dynamicParams = false;

function resolve(slug: string): string | undefined {
  return SCIENCE_CATEGORIES.find((c) => categorySlug(c) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = resolve(category);
  if (!c) return {};
  const title = categoryTitle(c);
  const n = BLOG_POSTS.filter((p) => p.category === c).length;
  const description = `${n} ${title.toLowerCase()} articles from REGEN Science, cited to primary sources.`;
  return {
    title: `${title} | REGEN Science`,
    description,
    alternates: { canonical: `/blog/category/${category}` },
    openGraph: { type: "website", url: `${SITE_URL}/blog/category/${category}`, title, description },
  };
}

/** One category of Science: the hub with this category's tab preselected,
    so a direct link lands on the filtered page and a tab click never has
    to load a route. */
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = resolve(category);
  if (!c) notFound();
  const appStoreUrl = buildAppStoreUrl();
  const title = categoryTitle(c);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} | REGEN Science`,
    url: `${SITE_URL}/blog/category/${category}`,
    isPartOf: { "@id": `${SITE_URL}/blog#collection` },
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app">
        <div className="page-wash" aria-hidden="true" />
        <ScienceHubView initial={c} />
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
