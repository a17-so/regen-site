import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { JsonLd } from "../components/JsonLd";
import { LIBRARY_ROBOTS } from "../lib/library";
import { CATEGORIES, GUIDE_INDEX, guideHref, guideSearchRows, hubRows } from "../lib/guides";
import { SITE_URL } from "./parts";
import LibrarySearch from "./LibrarySearch";
import LibraryHub from "./LibraryHub";

const TITLE = "Peptide Library";
const COUNT = GUIDE_INDEX.length;
const APPROVED = GUIDE_INDEX.filter((r) => r.status === "fda-approved").length;
/* The numbers ride in the subtitle; the stats row is gone ("minimality"). */
const LEAD = `${COUNT} peptides across ${CATEGORIES.length} body systems, from ${APPROVED} FDA-approved drugs to compounds still in trials.`;
const DESCRIPTION = `${LEAD} What each one is, how it works, its FDA status, and what the research shows.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/library` },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "website", url: `${SITE_URL}/library`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function LibraryPage() {
  const appStoreUrl = buildAppStoreUrl();
  const written = GUIDE_INDEX.filter((r) => r.hasGuide);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${SITE_URL}/library#collection`, name: TITLE, description: DESCRIPTION, url: `${SITE_URL}/library`, isPartOf: { "@id": `${SITE_URL}/#organization` } },
      {
        "@type": "ItemList",
        name: TITLE,
        numberOfItems: written.length,
        itemListElement: written.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.name, url: `${SITE_URL}${guideHref(r.slug)}` })),
      },
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={guideSearchRows()} variant="nav" />} />
      <main className="app animate-fade-in lib-shell">
        <LibraryHub
          rows={hubRows()}
          title={
            <>
              Every peptide,
              <br />
              mapped to the body.
            </>
          }
          lead={LEAD}
        />
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
