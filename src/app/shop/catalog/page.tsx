import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { LIBRARY_ROBOTS } from "../../lib/library";
import { type ShopCompound, catalogSections, compoundCount, money, shopHref, topCompounds, vendorsWithOffers } from "../../lib/shop";
import { SITE_URL } from "../../library/parts";
import ShopShell from "../ShopShell";

const TITLE = "Peptide Catalog";
const DESCRIPTION = `Compare ${compoundCount()} peptides across ${vendorsWithOffers().length} researched vendors: live prices per mg, published COAs, and who ships from where. Pick a compound, pick a size, see every vendor that stocks it.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Shop`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/shop/catalog` },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "website", url: `${SITE_URL}/shop/catalog`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/** One cell of the catalog grid: name, from per mg, variants, vendors. Every cell the same shape. */
function Cell({ c }: { c: ShopCompound }) {
  return (
    <a className="sh-cell" href={shopHref(c.slug)}>
      <span className="sh-cell-name">{c.kind === "essential" ? c.name.replace(/^Essentials\s+/i, "") : c.name}</span>
      <span className="sh-cell-price">
        {c.minUsdPerMg !== null ? (
          <>
            from <strong>{money(c.minUsdPerMg)}</strong> per mg
          </>
        ) : (
          <span className="lib-none">{c.kind === "essential" ? "Priced per pack" : "Price per mg not listed"}</span>
        )}
      </span>
      <span className="sh-cell-facts">
        {c.variantCount > 0 && (
          <span>
            {c.variantCount} variant{c.variantCount === 1 ? "" : "s"}
          </span>
        )}
        <span>
          {c.vendorCount} vendor{c.vendorCount === 1 ? "" : "s"}
        </span>
      </span>
    </a>
  );
}

/**
 * What to buy. The most-stocked compounds first, then every compound in
 * the library's own order (one section per body system), then the
 * compounds with no guide yet, blends, and essentials. Every section is
 * one pane holding a grid of equal cells, the reference catalog's frame:
 * name, a price line, two facts. Each cell opens the compound's vendors.
 */
export default function CatalogPage() {
  const appStoreUrl = buildAppStoreUrl();
  const top = topCompounds(8);
  const sections = catalogSections();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/shop/catalog`,
    isPartOf: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="catalog"
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Catalog" }]}
          title="Catalog"
          lead={`${compoundCount()} compounds across ${vendorsWithOffers().length} vendors with readable prices. Pick one, compare every vendor that stocks it by price per mg and published COA, and save the pack.`}
        >
          <section className="sh-section" id="top" aria-labelledby="top-h">
            <div className="sh-section-head">
              <h2 id="top-h">Most stocked</h2>
            </div>
            <div className="sh-pane sh-pane--cells">
              <div className="sh-cells">
                {top.map((c) => (
                  <Cell key={c.slug} c={c} />
                ))}
              </div>
            </div>
          </section>

          {sections.map((s) => (
            <section key={s.key} className="sh-section" id={s.key} aria-labelledby={`${s.key}-h`}>
              <div className="sh-section-head">
                <h2 id={`${s.key}-h`}>{s.label}</h2>
                <span className="sh-count">
                  {s.items.length} {s.key === "blends" ? "blend" : s.key === "essentials" ? "item" : "compound"}
                  {s.items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="sh-pane sh-pane--cells">
                <div className="sh-cells">
                  {s.items.map((c) => (
                    <Cell key={c.slug} c={c} />
                  ))}
                </div>
              </div>
            </section>
          ))}

          <p className="sh-note">
            Prices are read from each vendor&apos;s own catalog and can change; the vendor&apos;s page is the price. A compound missing
            here is one no readable store lists. Know a store that belongs on the list? <a href="/shop/submit">Submit it</a>.
          </p>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
