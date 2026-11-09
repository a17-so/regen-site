import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { JsonLd } from "../components/JsonLd";
import { LIBRARY_ROBOTS } from "../lib/library";
import { SHOP_VENDORS, compoundCount, effectiveScore, scoreBand, trustLine, vendorFacts, vendorHref, vendorStats, vendorsWithOffers } from "../lib/shop";
import { SITE_URL } from "../library/parts";
import ShopShell from "./ShopShell";
import { Facts, ScoreRing, Seal, Stats, VendorMark } from "./VendorParts";

const TITLE = "Peptide Vendors, Ranked and Graded";
const DESCRIPTION = `${SHOP_VENDORS.length} research-peptide vendors, ranked and graded on third-party testing, public COA archives, operator disclosure, and reviews. Each one scored on four pillars, with its catalog and live prices where the store could be read.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/shop` },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "website", url: `${SITE_URL}/shop`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * The shop leads with who to buy from. The top three stand on a podium
 * (the reference's anatomy: three cards, all the same glass), each with
 * its score ring and the three numbers that matter. Every vendor after
 * that is one quiet row in one pane: rank, name, the facts on record as
 * words, the score, certificates, reviews. The rank is the grade: no tier
 * letters anywhere, and no FAQ under the list (both cut 2026-11-08). The
 * catalog of compounds is the second tab.
 */
export default function ShopPage() {
  const appStoreUrl = buildAppStoreUrl();
  const live = new Set(vendorsWithOffers().map((v) => v.slug));
  const podium = SHOP_VENDORS.slice(0, 3);
  const rest = SHOP_VENDORS.slice(3);
  const facts = (v: (typeof SHOP_VENDORS)[number]) => [...vendorFacts(v), ...(live.has(v.slug) ? [] : ["Prices not readable"])];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/shop`,
    numberOfItems: SHOP_VENDORS.length,
    itemListElement: SHOP_VENDORS.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.name, url: `${SITE_URL}${vendorHref(v.slug)}` })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="vendors"
          eyebrow="Shop"
          title={
            <>
              Every vendor, <span className="accent-phrase">graded on its testing.</span>
            </>
          }
          lead={`${SHOP_VENDORS.length} research-peptide vendors, ranked on third-party testing, public COAs, who runs the store, and what customers report. ${compoundCount()} compounds across the ${live.size} stores that could be read. REGEN sells nothing: pick a vendor, see what it stocks, check out on its site.`}
        >
          <ol className="sh-podium" aria-label="The top three vendors">
            {podium.map((v, i) => {
              const score = effectiveScore(v);
              return (
                <li key={v.slug}>
                  <a className="sh-pane sh-podium-card" href={vendorHref(v.slug)}>
                    <div className="sh-podium-head">
                      <span className="sh-drow-rank">{String(i + 1).padStart(2, "0")}</span>
                      <VendorMark v={v} size={40} />
                      <strong className="sh-podium-name">
                        {v.name}
                        <Seal verification={v.verification} />
                      </strong>
                    </div>
                    <p className="sh-podium-line">{v.tagline ?? trustLine(v) ?? "Testing and COA disclosure not on record."}</p>
                    <Facts items={facts(v)} />
                    <div className="sh-podium-foot">
                      <div className="sh-podium-score">
                        <ScoreRing score={score} id={`p-${v.slug}`} size={52} stroke={4.5} />
                        <span>
                          <strong>{scoreBand(score)}</strong>
                          <span>Score out of 10</span>
                        </span>
                      </div>
                      <Stats stats={vendorStats(v)} />
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>

          <div className="sh-pane">
            <ol className="sh-list sh-dir" start={4}>
              {rest.map((v, i) => {
                const score = effectiveScore(v);
                const [coas, reviews] = vendorStats(v);
                return (
                  <li key={v.slug} className="sh-list-row sh-drow">
                    <span className="sh-drow-rank">{String(i + 4).padStart(2, "0")}</span>
                    <VendorMark v={v} size={32} />
                    <div className="sh-drow-body">
                      <span className="sh-drow-title">
                        <a className="sh-vendor-name" href={vendorHref(v.slug)}>
                          {v.name}
                        </a>
                        <Seal verification={v.verification} size={13} />
                      </span>
                      <Facts items={facts(v)} />
                    </div>
                    <ScoreRing score={score} id={v.slug} size={38} stroke={3.5} />
                    <span className="sh-drow-stat">
                      <strong className={coas.none ? "lib-none" : undefined}>{coas.value}</strong>
                      <span>{coas.label}</span>
                    </span>
                    <span className="sh-drow-stat">
                      <strong className={reviews.none ? "lib-none" : undefined}>{reviews.value}</strong>
                      <span>{reviews.label}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="sh-note">
            Know a store that belongs here? <a href="/shop/submit">Submit it</a> and it goes through the same research. Some vendors pay a
            referral when an order uses a REGEN code; the ranking does not change with what a vendor pays.
          </p>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
