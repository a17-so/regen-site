import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { CATEGORIES, LIBRARY_ROBOTS, categoryBySlug, peptidesInCategory, type CategorySlug } from "../../lib/library";
import { Crumbs, PeptideCard, SITE_URL } from "../parts";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryBySlug(category);
  if (!meta) return {};
  const url = `${SITE_URL}/library/${meta.slug}`;
  const count = peptidesInCategory(meta.slug).length;
  const title = `${meta.label} Peptides`;
  const description = `${count} ${meta.label.toLowerCase()} peptides, each graded on evidence quality. ${meta.blurb}`;
  return {
    title: `${title} | REGEN Library`,
    description,
    alternates: { canonical: url },
    robots: LIBRARY_ROBOTS,
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = categoryBySlug(category);
  if (!meta) notFound();

  const appStoreUrl = buildAppStoreUrl();
  const items = peptidesInCategory(meta.slug as CategorySlug);
  const url = `${SITE_URL}/library/${meta.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: `${meta.label} Peptides`,
        description: meta.blurb,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Library", item: `${SITE_URL}/library` },
          { "@type": "ListItem", position: 3, name: meta.label, item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: `${meta.label} Peptides`,
        itemListElement: items.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/library/${p.category}/${p.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <div className="lib-page">
          <header className="lib-index-head">
            <Crumbs
              trail={[
                { label: "Home", href: "/" },
                { label: "Library", href: "/library" },
                { label: meta.label },
              ]}
            />
            <h1>{meta.label} Peptides</h1>
            <p>{meta.blurb}</p>
          </header>

          <div className="lib-grid lib-grid--3">
            {items.map((p) => (
              <PeptideCard key={p.slug} p={p} />
            ))}
          </div>

          <nav className="lib-cat-strip" aria-label="Other categories">
            {CATEGORIES.filter((c) => c.slug !== meta.slug).map((c) => (
              <a key={c.slug} href={`/library/${c.slug}`}>
                {c.label}
              </a>
            ))}
          </nav>
        </div>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
