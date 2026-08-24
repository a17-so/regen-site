import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { ALL_PEPTIDES_SORTED, CATEGORIES, LIBRARY_ROBOTS, hrefFor } from "../../lib/library";
import { Crumbs, TierBadge, SITE_URL } from "../parts";

const TITLE = "All Peptides";
const DESCRIPTION =
  "Every compound in the REGEN library, listed alphabetically with its evidence grade, category, and standard dose.";

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Library`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/library/all-peptides` },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "website", url: `${SITE_URL}/library/all-peptides`, title: TITLE, description: DESCRIPTION },
};

export default function AllPeptidesPage() {
  const appStoreUrl = buildAppStoreUrl();
  // This index reads alphabetically, unlike the promise-ordered decks: someone
  // landing here is looking up a specific name, not browsing.
  const items = [...ALL_PEPTIDES_SORTED].sort((a, b) => a.name.localeCompare(b.name));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Library", item: `${SITE_URL}/library` },
          { "@type": "ListItem", position: 3, name: TITLE, item: `${SITE_URL}/library/all-peptides` },
        ],
      },
      {
        "@type": "ItemList",
        name: TITLE,
        numberOfItems: items.length,
        itemListElement: items.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}${hrefFor(p)}`,
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
                { label: TITLE },
              ]}
            />
            <h1>{TITLE}</h1>
            <p>{DESCRIPTION}</p>
          </header>

          <div className="lib-table-scroll">
            <table className="lib-all-table">
              <thead>
                <tr>
                  <th scope="col">Compound</th>
                  <th scope="col">Category</th>
                  <th scope="col">Grade</th>
                  <th scope="col">Standard dose</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  /* The whole row is the hit target: the anchor in the first
                     cell stretches over the row via ::after, so a click
                     anywhere on the line opens the compound. */
                  <tr key={p.slug} className="lib-row-link">
                    <th scope="row">
                      <a href={hrefFor(p)}>{p.name}</a>
                    </th>
                    <td>
                      {CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category}
                    </td>
                    <td>
                      <TierBadge tier={p.researchTier} />
                    </td>
                    <td>
                      {p.doseCard?.primary ?? "—"}
                      {p.doseCard?.frequency ? ` · ${p.doseCard.frequency}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
