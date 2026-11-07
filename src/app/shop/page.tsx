import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { JsonLd } from "../components/JsonLd";
import { LIBRARY_ROBOTS } from "../lib/library";
import { SHOP_COMPOUNDS, money, mg, shopHref, shopSearchRows, topCompounds, vendorsWithOffers } from "../lib/shop";
import { SITE_URL } from "../library/parts";
import LibrarySearch from "../library/LibrarySearch";
import ShopShell from "./ShopShell";

const TITLE = "Peptide Shop";
const DESCRIPTION = `Compare ${SHOP_COMPOUNDS.length} peptides across ${vendorsWithOffers().length} researched vendors: live prices per mg, published COAs, and who ships from where. Pick a compound, pick a size, see every vendor that stocks it.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/shop` },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "website", url: `${SITE_URL}/shop`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is this, if REGEN does not sell anything?",
    a: "A comparison. Every vendor here went through the same research: who runs it, which lab tests it, whether the COAs are public, what customers report, and what went wrong on record. The shop puts that beside the live price so the cheapest vial and the best-documented vial can be weighed on one page, and then sends you to the vendor. REGEN holds no stock and tests nothing itself.",
  },
  {
    q: "Does REGEN make money from this?",
    a: "Some vendors pay a referral when an order uses a REGEN code. The code is shown on the row. The ranking is the research pipeline's and does not change with what a vendor pays; a vendor with no code sits exactly where its testing puts it.",
  },
  {
    q: "How is the order decided?",
    a: "Four things: named third-party testing, a browsable COA archive, a disclosed operator with a legal entity and a real address, and the review footprint. Incidents on record count against. The site shows the order, never a grade.",
  },
  {
    q: "What are the risks?",
    a: "These are research chemicals sold without a prescriber. Purity, identity, and net content vary between lots, which is why a certificate per batch matters more than a vendor's reputation. A certificate from a lab the vendor pays is evidence, not proof. Nothing here is medical advice.",
  },
  {
    q: "Why does a vendor show no prices?",
    a: "Its catalog could not be read automatically: a sign-in wall, bot protection, or no product feed. It still appears on the vendors page with its research facts, and its own site has the prices.",
  },
  {
    q: "Where should I get a vial tested?",
    a: "The Labs tab lists every laboratory named on the certificates in the archive and which vendors use each one. Independent testing you pay for yourself is the only test the vendor did not choose.",
  },
];

/**
 * The catalog. Compound-first: the most stocked six, then every compound as
 * a compact tile with its vendor count, blends and essentials, then the
 * questions. Search in the head finds a compound by name.
 */
export default function ShopPage() {
  const appStoreUrl = buildAppStoreUrl();
  const rows = shopSearchRows();
  const top = topCompounds(6);
  const compounds = SHOP_COMPOUNDS.filter((c) => c.kind === "compound");
  const blends = SHOP_COMPOUNDS.filter((c) => c.kind === "blend" && c.vendorCount >= 2);
  const essentials = SHOP_COMPOUNDS.filter((c) => c.kind === "essential");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/shop`,
    isPartOf: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={rows} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="catalog"
          crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
          title={
            <>
              Every vendor, <span className="accent-phrase">one price per mg.</span>
            </>
          }
          lead={`${compounds.length} compounds across ${vendorsWithOffers().length} researched vendors. Live prices, published COAs, who ships from where. REGEN sells nothing and ranks vendors on testing, not on what they pay.`}
          actions={
            <div className="sh-search">
              <LibrarySearch rows={rows} />
            </div>
          }
        >
          <section className="sh-section" id="top" aria-labelledby="top-h">
            <div className="sh-section-head">
              <h2 id="top-h">Most stocked</h2>
            </div>
            <div className="sh-tiles sh-tiles--3">
              {top.map((c) => (
                <a key={c.slug} className="lib-card sh-tile sh-tile--top" href={shopHref(c.slug)}>
                  <span className="sh-kicker">{c.vendorCount} vendors</span>
                  <h3>{c.name}</h3>
                  {c.minUsdPerMg !== null && (
                    <p className="sh-tile-price">
                      from <strong>{money(c.minUsdPerMg)}</strong> per mg
                    </p>
                  )}
                  <p className="sh-sub">{c.sizesMg.slice(0, 4).map(mg).join(" · ")}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="sh-section" id="catalog" aria-labelledby="catalog-h">
            <div className="sh-section-head">
              <h2 id="catalog-h">Catalog</h2>
              <span className="sh-count">{compounds.length} compounds</span>
            </div>
            <div className="sh-tiles sh-tiles--4">
              {compounds.map((c) => (
                <a key={c.slug} className="lib-card sh-tile" href={shopHref(c.slug)}>
                  <h3>{c.name}</h3>
                  <p className="sh-sub">
                    {c.vendorCount} vendor{c.vendorCount === 1 ? "" : "s"}
                    {c.minUsdPerMg !== null ? ` · from ${money(c.minUsdPerMg)}/mg` : ""}
                  </p>
                </a>
              ))}
            </div>
          </section>

          {blends.length > 0 && (
            <section className="sh-section" id="blends" aria-labelledby="blends-h">
              <div className="sh-section-head">
                <h2 id="blends-h">Blends</h2>
                <span className="sh-count">{blends.length} blends</span>
              </div>
              <div className="sh-tiles sh-tiles--4">
                {blends.map((c) => (
                  <a key={c.slug} className="lib-card sh-tile" href={shopHref(c.slug)}>
                    <h3>{c.name}</h3>
                    <p className="sh-sub">
                      {c.vendorCount} vendor{c.vendorCount === 1 ? "" : "s"}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {essentials.length > 0 && (
            <section className="sh-section" id="essentials" aria-labelledby="ess-h">
              <div className="sh-section-head">
                <h2 id="ess-h">Essentials</h2>
                <span className="sh-count">Bacteriostatic water, syringes</span>
              </div>
              <div className="sh-tiles sh-tiles--4">
                {essentials.map((c) => (
                  <a key={c.slug} className="lib-card sh-tile" href={shopHref(c.slug)}>
                    <h3>{c.name}</h3>
                    <p className="sh-sub">
                      {c.vendorCount} vendor{c.vendorCount === 1 ? "" : "s"}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          <p className="sh-note">
            Know a store that belongs here, or a certificate the archive is missing? <a href="/shop/submit">Submit it</a>.
          </p>

          <section className="sh-section lib-faq sh-faq" id="faq" aria-labelledby="faq-h">
            <div className="sh-section-head">
              <h2 id="faq-h">Questions</h2>
            </div>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
