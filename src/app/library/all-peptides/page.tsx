import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import {
  ALL_PEPTIDES_SORTED,
  CATEGORIES,
  LIBRARY_ROBOTS,
  halfLifeShort,
  hrefFor,
  regulatoryStatusLabel,
  tierSpread,
  peptideSearchRows
} from "../../lib/library";
import LibrarySearch from "../LibrarySearch";
import { Crumbs, GradeText, SITE_URL } from "../parts";

/** Empty-cell marker. A word, not an em dash: it says what the blank means,
    reads correctly to a screen reader, and keeps the house no-em-dash rule. */
const NONE = <span className="lib-none">Not reported</span>;

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
  const spread = tierSpread(items);
  // First row under each letter carries the anchor, so the jump strip lands on
  // a real table row rather than needing a separate heading between tbodies.
  const seen = new Set<string>();
  const letterOf = (name: string) => {
    const c = name[0]?.toUpperCase() ?? "#";
    return /[A-Z]/.test(c) ? c : "#";
  };
  const anchors = items.map((p) => {
    const l = letterOf(p.name);
    if (seen.has(l)) return null;
    seen.add(l);
    return l;
  });
  const letters = [...seen];

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
            <h1>{TITLE}</h1>
            <p>{DESCRIPTION}</p>
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
          </header>

          {/* Letter strip. 54 rows is past the point where scanning beats
              jumping, and it gives the index a second navigational surface for
              a crawler to follow. */}
          <nav className="lib-alpha-jump lib-alpha-jump--table" aria-label="Jump to letter">
            {letters.map((l) => (
              <a key={l} href={`#letter-${l}`}>
                {l}
              </a>
            ))}
          </nav>

          <div className="lib-table-scroll">
            <table className="lib-all-table">
              <thead>
                <tr>
                  <th scope="col">Compound</th>
                  <th scope="col">Category</th>
                  <th scope="col">Grade</th>
                  <th scope="col">Standard dose</th>
                  <th scope="col">Half-life</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p, i) => (
                  /* The whole row is the hit target: the anchor in the first
                     cell stretches over the row via ::after, so a click
                     anywhere on the line opens the compound. */
                  <tr
                    key={p.slug}
                    className="lib-row-link"
                    id={anchors[i] ? `letter-${anchors[i]}` : undefined}
                  >
                    <th scope="row">
                      <a href={hrefFor(p)}>{p.name}</a>
                    </th>
                    <td>
                      {CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category}
                    </td>
                    <td>
                      <GradeText tier={p.researchTier} />
                    </td>
                    <td>
                      {p.doseCard?.primary ?? NONE}
                      {p.doseCard?.frequency ? ` · ${p.doseCard.frequency}` : ""}
                    </td>
                    <td>{halfLifeShort(p) ?? NONE}</td>
                    <td>
                      {regulatoryStatusLabel(p) === "FDA-Approved" ? (
                        <span className="lib-card-approved">FDA-approved</span>
                      ) : (
                        "Research"
                      )}
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
