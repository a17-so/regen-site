import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { LIBRARY_ROBOTS, peptideSearchRows} from "../../lib/library";
import LibrarySearch from "../LibrarySearch";
import { BEST_FOR, COMPARISONS, learnReadMinutes } from "../../lib/libraryLearn";
import { Crumbs, Pill, SITE_URL } from "../parts";
import { OG_IMAGES, TWITTER_IMAGES } from "../../lib/ogImage";

const TITLE = "Learn";
const DESCRIPTION =
  "Goal-based peptide rankings and head-to-head comparisons, each built from graded evidence and linked to the primary research.";

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Library`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/library/learn` },
  robots: LIBRARY_ROBOTS,
  openGraph: {
    type: "website",
    url: `${SITE_URL}/library/learn`,
    title: TITLE,
    description: DESCRIPTION,
    images: OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: TWITTER_IMAGES,
  },
};

export default function LearnIndexPage() {
  const appStoreUrl = buildAppStoreUrl();
  const all = [...BEST_FOR, ...COMPARISONS];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/library/learn#collection`,
        name: `${TITLE} — REGEN Library`,
        description: DESCRIPTION,
        url: `${SITE_URL}/library/learn`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Library", item: `${SITE_URL}/library` },
          { "@type": "ListItem", position: 3, name: TITLE, item: `${SITE_URL}/library/learn` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Peptide guides and comparisons",
        numberOfItems: all.length,
        itemListElement: all.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.title,
          url: `${SITE_URL}/library/learn/${a.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar
        appStoreUrl={appStoreUrl}
        sectionBase="/"
        slot={<LibrarySearch rows={peptideSearchRows()} variant="nav" />}
      />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <div className="lib-page">
          <header className="lib-index-head">
            <Crumbs
              trail={[
                { label: "Home", href: "/" },
                { label: "Library", href: "/library" },
                { label: TITLE },
              ]}
            />
            <h1>Learn</h1>
            <p>{DESCRIPTION}</p>
          </header>

          <section className="lib-section" id="best-for">
            <div className="lib-section-head">
              <h2>Best Peptides For...</h2>
            </div>
            <div className="lib-grid lib-grid--3">
              {BEST_FOR.map((a) => (
                <a className="lib-card" key={a.slug} href={`/library/learn/${a.slug}`}>
                  <h3>{a.cardTitle}</h3>
                  <div className="lib-card-chips">
                    <Pill tone="accent">{learnReadMinutes(a)} Min Read</Pill>
                    {a.popular && <Pill tone="green">Popular</Pill>}
                  </div>
                  <p>{a.description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="lib-section" id="comparisons">
            <div className="lib-section-head">
              <h2>Peptide Comparisons</h2>
            </div>
            <div className="lib-grid lib-grid--3">
              {COMPARISONS.map((a) => (
                <a className="lib-card" key={a.slug} href={`/library/learn/${a.slug}`}>
                  <h3>{a.cardTitle}</h3>
                  <div className="lib-card-chips">
                    <Pill tone="accent">{learnReadMinutes(a)} Min Read</Pill>
                    {a.popular && <Pill tone="green">Popular</Pill>}
                  </div>
                  <p>{a.description}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
