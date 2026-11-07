import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { JsonLd } from "../components/JsonLd";
import { LIBRARY_ROBOTS } from "../lib/library";
import { CATEGORIES, GUIDE_INDEX, guideHref, guideSearchRows, rowsInCategory } from "../lib/guides";
import { SITE_URL } from "./parts";
import LibrarySearch from "./LibrarySearch";
import BodyMap from "./BodyMap";
import { CategoryNav, CategorySection, StatusLegend } from "./GuideParts";

const TITLE = "Peptide Library";
const COUNT = GUIDE_INDEX.length;
const DESCRIPTION = `${COUNT} peptides, from approved drugs to compounds still in trials, sorted by where they act in the body. What each one is, how it works, its FDA status, and what the research shows.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/library` },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "website", url: `${SITE_URL}/library`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * The library hub. Structure is the reference's: a headline and lead with the
 * body map and status key on one side, and every category as a section of
 * compound cards on the other. The category strip under the hero mirrors the
 * reference's header row of categories with counts.
 */
export default function LibraryPage() {
  const appStoreUrl = buildAppStoreUrl();
  const rows = guideSearchRows();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/library#collection`,
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/library`,
        isPartOf: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Library", item: `${SITE_URL}/library` },
        ],
      },
      {
        "@type": "ItemList",
        name: TITLE,
        numberOfItems: GUIDE_INDEX.filter((r) => r.hasGuide).length,
        itemListElement: GUIDE_INDEX.filter((r) => r.hasGuide).map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: r.name,
          url: `${SITE_URL}${guideHref(r.slug)}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={rows} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />

        <header className="lib-hero gd-hero">
          <div className="lib-hero-inner">
            <h1>
              Every peptide,
              <br />
              <span className="accent-phrase">mapped to the body.</span>
            </h1>
            <p className="lib-hero-sub">{DESCRIPTION.split(". ")[0]}.</p>
            <LibrarySearch rows={rows} />
          </div>
          <CategoryNav />
        </header>

        <div className="lib-page gd-hub">
          <aside className="gd-hub-side">
            <BodyMap />
            <StatusLegend />
          </aside>
          <div className="gd-hub-main">
            {CATEGORIES.map((c) => (
              <CategorySection key={c.slug} slug={c.slug} rows={rowsInCategory(c.slug)} />
            ))}
          </div>
        </div>

        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
