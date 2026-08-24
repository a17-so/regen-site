import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import {
  CATEGORIES,
  LIBRARY_ROBOTS,
  categoryBySlug,
  peptidesInCategory,
  tierSpread,
  type CategorySlug,
} from "../../lib/library";
import { BEST_FOR, COMPARISONS } from "../../lib/libraryLearn";
import { CategoryChip } from "../CategoryIcon";
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
  const spread = tierSpread(items);
  const best = items[0];
  // Guides whose members live in this category. A category page that links
  // only downward to compounds is a dead end; these are the lateral links.
  const guides = [...BEST_FOR, ...COMPARISONS].filter((a) =>
    a.members.some((m) => items.some((p) => p.slug === m))
  );

  // Questions a category page can answer from its own data. Composed, never
  // hand-written, so a catalog change can never leave the answer stale.
  const faq = [
    {
      q: `How many ${meta.label.toLowerCase()} peptides are there?`,
      a: `This library covers ${items.length} ${meta.label.toLowerCase()} compounds, each graded from S (regulatory approval) to F (no usable evidence).`,
    },
    ...(best
      ? [
          {
            q: `Which ${meta.label.toLowerCase()} peptide has the strongest evidence?`,
            a: `${best.name} carries the highest research grade in this category at ${
              best.researchTier ?? "unrated"
            }. ${best.subtitle}`,
          },
        ]
      : []),
    {
      q: `What does the research grade mean?`,
      a: `The grade describes how well a compound has been measured in humans, not how well it works. S means regulatory approval; D means animal data only. Popularity and anecdote do not affect it.`,
    },
  ];

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
        numberOfItems: items.length,
        itemListElement: items.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/library/${p.category}/${p.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
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
          <header className={`lib-index-head lib-index-head--${meta.ramp}`}>
            <Crumbs
              trail={[
                { label: "Home", href: "/" },
                { label: "Library", href: "/library" },
                { label: meta.label },
              ]}
            />
            <div className="lib-index-title">
              <CategoryChip name={meta.icon} size="lg" />
              <h1>{meta.label} Peptides</h1>
            </div>
            <p>{meta.blurb}</p>
            <div className="lib-spread">
              {spread.map((r) => (
                <span className={`lib-spread--${r.tier.toLowerCase()}`} key={r.tier}>
                  <strong>{r.tier}</strong> {r.count}
                </span>
              ))}
              <a className="lib-spread-link" href="/library/how-we-grade">
                What the grades mean
              </a>
            </div>
            {/* The prose that makes this a page rather than a card grid. */}
            <p className="lib-intro">{meta.intro}</p>
          </header>

          <div className="lib-grid lib-grid--3">
            {items.map((p) => (
              <PeptideCard key={p.slug} p={p} />
            ))}
          </div>

          {guides.length > 0 && (
            <section className="lib-section" id="guides">
              <div className="lib-section-head">
                <h2>Guides in this category</h2>
              </div>
              <div className="lib-grid lib-grid--3">
                {guides.slice(0, 6).map((a) => (
                  <a className="lib-card" key={a.slug} href={`/library/learn/${a.slug}`}>
                    <div className="lib-card-top">
                      <h3>{a.title}</h3>
                    </div>
                    <p>{a.description}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="lib-section" id="faq">
            <div className="lib-section-head">
              <h2>{meta.label} peptide questions</h2>
            </div>
            <div className="lib-faq lib-faq--index">
              {faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <nav className="lib-cat-strip" aria-label="Other categories">
            {CATEGORIES.filter((c) => c.slug !== meta.slug).map((c) => (
              <a key={c.slug} href={`/library/${c.slug}`}>
                {c.label}
              </a>
            ))}
            <a href="/library/all-peptides">All {"\u00A0"}compounds</a>
          </nav>
        </div>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
