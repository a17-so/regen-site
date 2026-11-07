import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { LIBRARY_ROBOTS } from "../../lib/library";
import {
  CATEGORIES,
  GUIDE_INDEX,
  type CategorySlug,
  categoryBySlug,
  categoryHref,
  guideBySlug,
  guideHref,
  guideReadMinutes,
  guideSearchRows,
  indexRow,
  relatedGuides,
  renderableSources,
  rowsInCategory,
} from "../../lib/guides";
import { Crumbs, SITE_URL } from "../parts";
import LibrarySearch from "../LibrarySearch";
import BodyMap from "../BodyMap";
import {
  Blocks,
  Byline,
  CategoryNav,
  CategorySection,
  EvidenceBox,
  FactRows,
  IdentityCard,
  KeyTakeaway,
  MoreFor,
  Sources,
  StatusLegend,
} from "../GuideParts";

/**
 * One route, two pages. `/library/<category>` is a category index (eight
 * fixed slugs); `/library/<compound>` is a guide. No compound shares a slug
 * with a category, and keeping guides flat means a compound can change
 * category without changing its URL.
 */
export function generateStaticParams() {
  return [
    ...CATEGORIES.map((c) => ({ slug: c.slug })),
    ...GUIDE_INDEX.filter((r) => r.hasGuide).map((r) => ({ slug: r.slug })),
  ];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (cat) {
    const n = rowsInCategory(cat.slug).length;
    const title = `${cat.label} peptides`;
    const description = `${n} peptides for ${cat.label.toLowerCase()}: ${cat.blurb} What each one is, its FDA status, and what the research shows.`;
    return {
      title: `${title} | REGEN Peptide Library`,
      description,
      alternates: { canonical: `${SITE_URL}${categoryHref(cat.slug)}` },
      robots: LIBRARY_ROBOTS,
      openGraph: { type: "website", url: `${SITE_URL}${categoryHref(cat.slug)}`, title, description },
      twitter: { card: "summary_large_image", title, description },
    };
  }
  const g = guideBySlug(slug);
  if (!g) return {};
  const title = `${g.name}: What the Research Shows and Its FDA Status`;
  return {
    title: `${title} | REGEN`,
    description: g.summary,
    alternates: { canonical: `${SITE_URL}${guideHref(g.slug)}` },
    robots: LIBRARY_ROBOTS,
    openGraph: { type: "article", url: `${SITE_URL}${guideHref(g.slug)}`, title, description: g.summary },
    twitter: { card: "summary_large_image", title, description: g.summary },
  };
}

export default async function LibraryEntry({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const appStoreUrl = buildAppStoreUrl();
  const rows = guideSearchRows();
  const cat = categoryBySlug(slug);

  if (cat) return <CategoryPage slug={cat.slug} appStoreUrl={appStoreUrl} rows={rows} />;

  const g = guideBySlug(slug);
  if (!g) notFound();
  const category = categoryBySlug(g.category);
  const sources = renderableSources(g);
  const related = relatedGuides(g, 6).map((r) => indexRow(r.slug)!).filter(Boolean);
  const alsoIn = (g.alsoInLibrary ?? []).map((s) => indexRow(s)).filter((r): r is NonNullable<typeof r> => Boolean(r));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${SITE_URL}${guideHref(g.slug)}#page`,
        name: g.name,
        headline: `${g.name}: what the research shows and its FDA status`,
        description: g.summary,
        url: `${SITE_URL}${guideHref(g.slug)}`,
        datePublished: g.published,
        dateModified: g.updated,
        author: { "@type": "Organization", name: "REGEN Research" },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: { "@type": "Drug", name: g.name, alternateName: g.alsoCalled, description: g.class },
        citation: sources.map((s) => s.url ?? s.text),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Library", item: `${SITE_URL}/library` },
          ...(category
            ? [{ "@type": "ListItem", position: 3, name: category.label, item: `${SITE_URL}${categoryHref(category.slug)}` }]
            : []),
          { "@type": "ListItem", position: category ? 4 : 3, name: g.name, item: `${SITE_URL}${guideHref(g.slug)}` },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={rows} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <article className="legal-page legal-page--wide gd-page">
          <div className="gd-page-head">
            <Crumbs
              trail={[
                { label: "Peptide Library", href: "/library" },
                ...(category ? [{ label: category.label, href: categoryHref(category.slug) }] : []),
                { label: g.name },
              ]}
            />
            <nav className="gd-tabs" aria-label="Sections">
              <a href={guideHref(g.slug)} aria-current="page">
                Guide
              </a>
              <a href="#citations">Citations ({sources.length})</a>
            </nav>
          </div>

          <div className="legal-body gd-body-grid">
            <IdentityCard guide={g} />

            <div className="legal-content gd-content">
              <KeyTakeaway guide={g} />
              <Byline guide={g} sourceCount={sources.length} />

              <h2 id="at-a-glance">At a glance</h2>
              <FactRows rows={g.atGlance} />

              {g.sections.map((s) => (
                <section key={s.id} id={s.id} className="gd-section">
                  <h2>{s.heading}</h2>
                  <Blocks blocks={s.blocks} guide={g} />
                  {s.id === "fda-approved" && <FactRows title="Status" rows={g.statusBox} />}
                </section>
              ))}

              <EvidenceBox guide={g} />

              {alsoIn.length > 0 && (
                <section className="gd-more" aria-labelledby="also-h">
                  <h2 id="also-h">Also in the library</h2>
                  <ul className="gd-also">
                    {alsoIn.map((r) => (
                      <li key={r.slug}>
                        {r.hasGuide ? (
                          <a className="gd-pill" href={guideHref(r.slug)}>
                            {r.name}
                          </a>
                        ) : (
                          <span className="gd-pill">{r.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <MoreFor guide={g} rows={related} />
              <Sources guide={g} />

              <p className="gd-disclaimer">
                This page is educational. It is not medical advice, not a health claim, and not an offer to sell any
                product. Regulatory status changes; verify it with the FDA before relying on it. {guideReadMinutes(g)} min
                read.
              </p>
            </div>
          </div>
        </article>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}

function CategoryPage({
  slug,
  appStoreUrl,
  rows,
}: {
  slug: CategorySlug;
  appStoreUrl: string;
  rows: ReturnType<typeof guideSearchRows>;
}) {
  const cat = categoryBySlug(slug)!;
  const members = rowsInCategory(slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.label} peptides`,
    url: `${SITE_URL}${categoryHref(slug)}`,
    isPartOf: { "@id": `${SITE_URL}/library#collection` },
    hasPart: members.filter((r) => r.hasGuide).map((r) => ({ "@type": "WebPage", name: r.name, url: `${SITE_URL}${guideHref(r.slug)}` })),
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={rows} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <header className="lib-hero gd-hero">
          <div className="lib-hero-inner">
            <Crumbs trail={[{ label: "Peptide Library", href: "/library" }, { label: cat.label }]} />
            <h1>
              {cat.label.split(" & ")[0]}
              <br />
              <span className="accent-phrase">&amp; {cat.label.split(" & ")[1]}.</span>
            </h1>
            <p className="lib-hero-sub">{cat.blurb}</p>
            <LibrarySearch rows={rows} />
          </div>
          <CategoryNav active={slug} />
        </header>
        <div className="lib-page gd-hub">
          <aside className="gd-hub-side">
            <BodyMap active={slug} />
            <StatusLegend />
          </aside>
          <div className="gd-hub-main">
            <CategorySection slug={slug} rows={members} />
          </div>
        </div>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
