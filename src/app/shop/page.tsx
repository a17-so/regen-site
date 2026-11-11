import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { JsonLd } from "../components/JsonLd";
import { LIBRARY_ROBOTS } from "../lib/library";
import { SHOP_VENDORS, compoundCount, effectiveScore, scoreBand, vendorAnswers, vendorHref, vendorsWithOffers } from "../lib/shop";
import { SITE_URL } from "../library/parts";
import ShopShell from "./ShopShell";
import { ScoreRing, Seal, VendorMark } from "./VendorParts";

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
 * The marketplace leads with who to buy from, in a buyer's words
 * (2026-11-10, "still cluttery as hell"): the top three on a podium (the
 * reference's anatomy, three cards of the same glass), each with its
 * score ring and band and the FOUR answers (tested? who runs it? what do
 * people say? cost?) and nothing else; every vendor after that one quiet
 * row under one head row of the same four questions: rank, mark, name,
 * ring, four answers in words. No taglines, no facts line, no stats, no
 * tier letters, no FAQ. The catalog of compounds is the second tab.
 */
const QUESTIONS = ["Tested?", "Who runs it?", "What people say", "Cost"];

export default function ShopPage() {
  const appStoreUrl = buildAppStoreUrl();
  const live = new Set(vendorsWithOffers().map((v) => v.slug));
  const podium = SHOP_VENDORS.slice(0, 3);
  const rest = SHOP_VENDORS.slice(3);

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
          eyebrow="Marketplace"
          title={
            <>
              Every vendor, <span className="accent-phrase">graded on its testing.</span>
            </>
          }
          lead={`${SHOP_VENDORS.length} vendors, ranked on testing, who runs them, what buyers say and price. ${compoundCount()} compounds across ${live.size} readable stores. REGEN sells nothing: pick one and check out on its site.`}
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
                    <div className="sh-podium-score">
                      <ScoreRing score={score} id={`p-${v.slug}`} size={52} stroke={4.5} />
                      <span>
                        <strong>{scoreBand(score)}</strong>
                        <span>Score out of 10</span>
                      </span>
                    </div>
                    <dl className="sh-podium-answers">
                      {vendorAnswers(v, true).map((it) => (
                        <div key={it.q}>
                          <dt>{it.q}</dt>
                          <dd className={it.none ? "lib-none" : undefined}>{it.a}</dd>
                        </div>
                      ))}
                    </dl>
                  </a>
                </li>
              );
            })}
          </ol>

          <div className="sh-pane">
            <div className="sh-dir-head" aria-hidden="true">
              <span />
              <span />
              <span>Vendor</span>
              <span />
              {QUESTIONS.map((q) => (
                <span key={q}>{q}</span>
              ))}
            </div>
            <ol className="sh-list sh-dir" start={4}>
              {rest.map((v, i) => {
                const score = effectiveScore(v);
                return (
                  <li key={v.slug} className="sh-list-row sh-drow">
                    <span className="sh-drow-rank">{String(i + 4).padStart(2, "0")}</span>
                    <VendorMark v={v} size={32} />
                    <span className="sh-drow-title">
                      <a className="sh-vendor-name" href={vendorHref(v.slug)}>
                        {v.name}
                      </a>
                      <Seal verification={v.verification} size={13} />
                    </span>
                    <ScoreRing score={score} id={v.slug} size={38} stroke={3.5} />
                    <span className="sh-drow-answers">
                      {vendorAnswers(v, true).map((it) => (
                        <span key={it.q} className={`sh-drow-ans${it.none ? " lib-none" : ""}`}>
                          {it.a}
                        </span>
                      ))}
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
