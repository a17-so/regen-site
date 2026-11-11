import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../../lib/appStoreUrl";
import NavBar from "../../../components/NavBar";
import PageClose from "../../../components/PageClose";
import { JsonLd } from "../../../components/JsonLd";
import { LIBRARY_ROBOTS } from "../../../lib/library";
import { Citations } from "../../../library/GuideParts";
import {
  SCORE_BLURB,
  SHOP_VENDORS,
  coaAnalysisFor,
  compoundBySlug,
  coaPillarsFor,
  effectiveScore,
  formatScore,
  mg,
  money,
  packLabel,
  pillarsFor,
  priceStatus,
  priceWord,
  scoreBand,
  shopHref,
  trustLine,
  vendorAnswers,
  vendorBySlug,
  storeCatalogCount,
  storeCatalogFor,
  vendorHref,
} from "../../../lib/shop";
import { SITE_URL } from "../../../library/parts";
import ShopShell from "../../ShopShell";
import CodeCopy from "../../CodeCopy";
import HandoffLink from "../../HandoffLink";
import VendorTabs from "../../VendorTabs";
import { AnswerStrip, PillarRows, PriceBar, ScoreRing, Seal, SheetHead, VendorMark } from "../../VendorParts";

export function generateStaticParams() {
  return SHOP_VENDORS.map((v) => ({ vendor: v.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ vendor: string }> }): Promise<Metadata> {
  const { vendor } = await params;
  const v = vendorBySlug(vendor);
  if (!v) return {};
  const title = `${v.name}: Testing, COAs, and Catalog`;
  const description = v.tagline ?? trustLine(v) ?? `${v.name} on the REGEN vendor list.`;
  return {
    title: `${title} | REGEN Marketplace`,
    description,
    alternates: { canonical: `${SITE_URL}${vendorHref(v.slug)}` },
    robots: LIBRARY_ROBOTS,
    openGraph: { type: "website", url: `${SITE_URL}${vendorHref(v.slug)}`, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

const none = (t: string) => <span className="lib-none">{t}</span>;
const ext = { target: "_blank", rel: "noopener noreferrer nofollow sponsored" } as const;

/** Who published a vendor source, for the citation's grey line, the way a
    guide's reads "Publisher, year · host". The vendor's own pages are the
    vendor; the review and registry sites are named; anything else falls
    back to its host. */
const PUBLISHERS: Record<string, string> = {
  "trustpilot.com": "Trustpilot",
  "bbb.org": "Better Business Bureau",
  "disclosedlabs.com": "Disclosed Labs",
  "reddit.com": "Reddit",
  "youtube.com": "YouTube",
  "instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "x.com": "X",
  "twitter.com": "X",
  "linkedin.com": "LinkedIn",
  "fda.gov": "FDA",
  "sec.gov": "SEC",
  "opencorporates.com": "OpenCorporates",
  "janoshik.com": "Janoshik",
  "sitejabber.com": "Sitejabber",
  "scamadviser.com": "ScamAdviser",
  "web.archive.org": "Internet Archive",
  "finnrick.com": "Finnrick",
  "peptidebase.io": "PeptideBase",
  "freedomdiagnosticstesting.com": "Freedom Diagnostics",
  "bizapedia.com": "Bizapedia",
  "ils-lab.com": "ILS Laboratories",
  "a2la.org": "A2LA",
  "justice.gov": "U.S. Department of Justice",
  "bloomberg.com": "Bloomberg",
  "substack.com": "Substack",
  "reviews.io": "REVIEWS.io",
  "provenexpert.com": "ProvenExpert",
  "tiktok.com": "TikTok",
  "accumarklabs.com": "Accumark Labs",
  "a4m.com": "A4M",
};
function sourceLine(url: string, v: { name: string; domain: string | null }): string {
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url;
  }
  const own = v.domain ? v.domain.replace(/^www\./, "").toLowerCase() : null;
  const known = Object.entries(PUBLISHERS).find(([h]) => host === h || host.endsWith(`.${h}`))?.[1];
  const publisher = own && (host === own || host.endsWith(`.${own}`)) ? v.name : known;
  return publisher ? `${publisher} · ${host}` : host;
}

/**
 * The vendor profile for an ordinary buyer: head with the one accent Visit
 * button, the four questions answered in words with the score once
 * (AnswerStrip), then the record in TABS (2026-11-10, "vendor breakdown has
 * to be split up into tabs and the sources has to look like citations in
 * library"): Overview (verdict, scorecard, trade, price, the brief),
 * Certificates, Catalog and Sources, the last being the library guide's
 * Citations view verbatim. The code card and the testing and operator facts
 * stay in the rail beside every tab.
 */
export default async function VendorPage({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;
  const v = vendorBySlug(vendor);
  if (!v) notFound();
  const appStoreUrl = buildAppStoreUrl();
  const catalog = storeCatalogFor(v);
  const catalogCount = storeCatalogCount(catalog);
  const position = SHOP_VENDORS.findIndex((x) => x.slug === v.slug) + 1;
  const score = effectiveScore(v);
  const coa = coaAnalysisFor(v);
  const coaPillars = coaPillarsFor(v);
  const price = v.priceFraction !== null ? priceStatus(v.priceFraction) : null;
  const store = v.url ?? (v.domain ? `https://${v.domain}` : null);
  const separates = v.differentiator ?? v.standoutPro ?? "No single documented edge yet. What is on record so far is ordinary for this market.";
  const holdsBack =
    v.standoutCon ??
    (v.watchoutTags?.length
      ? `The record flags: ${v.watchoutTags.join(", ").toLowerCase()}. Until those close, the score stays capped.`
      : "Nothing disqualifying on record, but nothing independently proven either.");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: v.name,
    url: v.url ?? undefined,
    logo: v.logoUrl ?? undefined,
    address: v.location ?? v.country ?? undefined,
    aggregateRating:
      v.trustpilotAverage !== null && v.trustpilotCount
        ? { "@type": "AggregateRating", ratingValue: v.trustpilotAverage, reviewCount: v.trustpilotCount, bestRating: 5 }
        : undefined,
  };

  const certsNote = v.coaCount
    ? `${v.coaCount} on file${v.coaExamples[0]?.testDate ? `, latest ${v.coaExamples[0].testDate}` : ""}`
    : v.coaExamples.length
      ? `${v.coaExamples.length} on file`
      : "None published";

  const listLink = (href: string, label: string) => (
    <a className="sh-vcat-name" href={href} {...ext}>
      {label}
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
  const compare = (slug: string | null) =>
    slug ? (
      <a className="sh-vcat-compare" href={shopHref(slug)}>
        Compare
      </a>
    ) : (
      <span />
    );

  const certRows = v.coaExamples.map((c, i) => {
    const panels = [c.endotoxin && "Endotoxin", c.heavyMetals && "Metals", c.sterility && "Sterility"].filter(Boolean) as string[];
    const Name = c.coaPdf ? "a" : "span";
    return (
      <li key={`${c.batchNumber ?? ""}-${i}`}>
        <span className="sh-certs-main">
          <Name className="sh-certs-name" {...(c.coaPdf ? { href: c.coaPdf, target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>
            {c.productName ?? "Unnamed product"}
          </Name>
          <span className="sh-certs-meta">
            {[c.testDate ?? "Undated", c.labName ?? "Lab not named", c.batchNumber ? `Batch ${c.batchNumber}` : null, c.netContentMg ? `${c.netContentMg} mg measured` : null].filter(Boolean).join(" · ")}
          </span>
        </span>
        <span className="sh-certs-panels">{panels.length ? panels.join(" · ") : "Purity only"}</span>
        <strong className="sh-certs-purity">{c.purityPercent !== null ? `${c.purityPercent}%` : none("n/a")}</strong>
      </li>
    );
  });

  const catalogRows: React.ReactNode[] | null =
    catalog.kind === "none"
      ? null
      : catalog.kind === "live"
        ? catalog.rows.map(({ compound, packs, bestPerMg }) => {
            const lead = packs.find((p) => p.perMg === bestPerMg) ?? packs[0];
            return (
              <li key={compound.slug} className="sh-vcat-row">
                {listLink(lead.offer.productUrl, compound.name)}
                <span className="sh-vcat-packs">
                  {packs.map((p, j) => (
                    <a key={j} className="lib-filter sh-pack" href={p.offer.productUrl} {...ext}>
                      {packLabel(p.variant)}
                      {p.variant.sizeMg ? ` · ${mg(p.variant.sizeMg)}` : ""} · {money(p.variant.priceUsd, p.offer.currency)}
                    </a>
                  ))}
                </span>
                <span className="sh-vcat-per">{bestPerMg !== null ? `${money(bestPerMg)}/mg` : none("No per mg")}</span>
                {compare(compound.slug)}
              </li>
            );
          })
        : catalog.kind === "listing"
          ? catalog.items.map((it) => (
              <li key={it.url} className="sh-vcat-row">
                {listLink(it.url, (it.compoundSlug && compoundBySlug(it.compoundSlug)?.name) || it.name)}
                <span className="sh-vcat-packs">
                  <a className="lib-filter sh-pack" href={it.url} {...ext}>
                    From {money(it.fromUsd)}
                  </a>
                </span>
                <span />
                {compare(it.compoundSlug)}
              </li>
            ))
          : catalog.items.map((it) => (
              <li key={it.name} className="sh-vcat-row">
                {store ? listLink(store, it.name) : <span className="sh-vcat-name">{it.name}</span>}
                <span className="sh-vcat-packs">
                  <span className="lib-filter sh-pack">
                    {it.count} certificate{it.count === 1 ? "" : "s"}
                  </span>
                </span>
                <span />
                {compare(it.compoundSlug)}
              </li>
            ));

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          ownTabs
          crumbs={[{ label: "Marketplace", href: "/shop" }, { label: "Vendors", href: "/shop" }, { label: v.name }]}
          title={
            <span className="sh-vendor--title">
              <VendorMark v={v} size={44} />
              <span>
                {v.name}
                <Seal verification={v.verification} size={22} />
              </span>
            </span>
          }
          lead={v.tagline ?? trustLine(v) ?? "Testing and COA disclosure not on record."}
          actions={
            <div className="sh-head-actions">
              <p className="pg-links">
                #{position} of {SHOP_VENDORS.length}
                {v.domain ? <span aria-hidden="true"> · </span> : null}
                {v.domain && store && (
                  <a href={store} {...ext}>
                    {v.domain}
                  </a>
                )}
              </p>
              {store && (
                <HandoffLink className="btn btn-accent btn-tiny" handoff={{ vendorSlug: v.slug, vendorName: v.name, url: store, code: v.code, from: "vendor" }}>
                  Visit {v.domain ?? v.name}
                </HandoffLink>
              )}
            </div>
          }
        >
          {/* The four questions a buyer asks, answered in words, with the
              score once. The record follows in tabs. */}
          <AnswerStrip
            items={vendorAnswers(v)}
            lead={
              <div className="sh-answer sh-answer--score">
                <ScoreRing score={score} id={`s-${v.slug}`} size={56} stroke={5} />
                <span>
                  <span className="sh-answer-q">Score out of 10</span>
                  <strong className="sh-answer-a">{scoreBand(score)}</strong>
                </span>
              </div>
            }
          />

          <div className="sh-prof">
            <div className="sh-prof-main">
              <VendorTabs
                tabs={[
                  {
                    key: "overview",
                    label: "Overview",
                    panel: (
                      <>
                        <div className="sh-pane sh-sheet">
                          <section className="sh-sheet-sec" id="verdict">
                            <SheetHead title="The verdict" />
                            <p className="sh-verdict">{v.verdict ?? v.summary ?? trustLine(v) ?? "No verdict on record yet."}</p>
                          </section>
                          <section className="sh-sheet-sec" id="scorecard">
                            <SheetHead title="Scorecard" note={`${scoreBand(score)}, ${formatScore(score)} of 10`} />
                            <PillarRows pillars={pillarsFor(v)} />
                            <p className="sh-sheet-foot">{SCORE_BLURB}</p>
                          </section>
                          <section className="sh-sheet-sec" id="trade">
                            <SheetHead title="The trade" />
                            <div className="sh-trade">
                              <div>
                                <h3>What separates them</h3>
                                <p>{separates}</p>
                              </div>
                              <div>
                                <h3>What holds them back</h3>
                                <p>{holdsBack}</p>
                              </div>
                            </div>
                          </section>
                          {price && v.priceFraction !== null && (
                            <section className="sh-sheet-sec" id="price">
                              <SheetHead title="Price" note={priceWord(v.priceFraction).a} />
                              <PriceBar fraction={v.priceFraction} />
                              <div className="sh-pricebar-labels" aria-hidden="true">
                                <span>Priced high</span>
                                <span>Market average</span>
                                <span>Priced well</span>
                              </div>
                              {v.priceUsdPerMg !== null && <p className="sh-sheet-p">Averages {money(v.priceUsdPerMg)} per mg across a standard basket, against every other vendor here.</p>}
                            </section>
                          )}
                        </div>
                        {v.summary && v.verdict && (
                          <div className="sh-pane sh-pane--pad" id="brief">
                            <SheetHead title="The brief" note="The research, in full" />
                            <p className="sh-sheet-p">{v.summary}</p>
                          </div>
                        )}
                      </>
                    ),
                  },
                  {
                    key: "certificates",
                    label: "Certificates",
                    count: v.coaCount || v.coaExamples.length,
                    panel: (
                      <div className="sh-pane sh-sheet">
                        <section className="sh-sheet-sec">
                          <SheetHead title="Certificates" note={certsNote} />
                          <p className="sh-sheet-p">
                            <strong>{coa.title}</strong>
                            {coa.score !== null ? ` (${coa.score} of 100). ` : ". "}
                            {coa.body}
                          </p>
                          {coaPillars.length > 0 && <PillarRows pillars={coaPillars} outOf={100} />}
                          {certRows.length > 0 && <ul className="sh-certs">{certRows}</ul>}
                          {(v.coaCount ?? 0) > certRows.length && certRows.length > 0 && (
                            <p className="sh-sheet-foot">
                              The latest {certRows.length} of {v.coaCount}.{store ? " The rest are on the store's own certificate pages." : ""}
                            </p>
                          )}
                        </section>
                      </div>
                    ),
                  },
                  ...(catalogRows
                    ? [
                        {
                          key: "catalog",
                          label: "Catalog",
                          count: catalogCount,
                          panel: (
                            <div className="sh-pane sh-sheet">
                              <section className="sh-sheet-sec">
                                <SheetHead
                                  title="Catalog"
                                  note={`${catalogCount} compound${catalogCount === 1 ? "" : "s"}${catalog.kind === "live" ? ", read from the store" : catalog.kind === "listing" ? ", from its product list" : " with a certificate"}`}
                                />
                                <ul className="sh-vcat">{catalogRows}</ul>
                                {catalog.kind === "listing" && (
                                  <p className="sh-sheet-foot">
                                    Starting prices as the store lists them, read {catalog.fetchedAt}. Its storefront does not publish vial sizes in a readable form, so there is no
                                    per mg here.
                                  </p>
                                )}
                                {catalog.kind === "coas" && (
                                  <p className="sh-sheet-foot">The store hides its prices behind a sign-in or blocks automated reads. These are the compounds it publishes certificates for.</p>
                                )}
                              </section>
                            </div>
                          ),
                        },
                      ]
                    : []),
                  ...(v.sources.length
                    ? [
                        {
                          key: "sources",
                          label: "Sources",
                          count: v.sources.length,
                          // The library guide's Citations view, verbatim: the
                          // bare numbered list on the page (no card, no head),
                          // each source's title over "Publisher · host".
                          panel: <Citations items={v.sources.map((src, k) => ({ id: k + 1, title: src.title ?? src.url, href: src.url, meta: sourceLine(src.url, v) }))} />,
                        },
                      ]
                    : []),
                ]}
              />
            </div>

            <aside className="sh-prof-rail">
              {v.code ? (
                <CodeCopy code={v.code} vendor={v.slug} domain={v.domain ?? v.name} />
              ) : (
                <div className="sh-pane sh-pane--pad">
                  <SheetHead title="Shop now" />
                  <p className="sh-code-note">No REGEN code at this store. The price on its site is the price.</p>
                </div>
              )}
              <div className="sh-pane sh-sheet">
                <section className="sh-sheet-sec" id="testing">
                  <SheetHead title="Testing" />
                  <dl className="sh-facts-dl">
                    <div>
                      <dt>Labs</dt>
                      <dd>{v.labs?.length ? v.labs.join(", ") : none("Not named")}</dd>
                    </div>
                    <div>
                      <dt>Average purity</dt>
                      <dd>{v.coaAvgPurity !== null ? `${v.coaAvgPurity}%` : none("Not reported")}</dd>
                    </div>
                    <div>
                      <dt>Scope</dt>
                      <dd>{v.testingScope?.length ? v.testingScope.join(" · ") : none("Not stated")}</dd>
                    </div>
                  </dl>
                </section>
                <section className="sh-sheet-sec" id="operator">
                  <SheetHead title="Operator" />
                  <dl className="sh-facts-dl">
                    <div>
                      <dt>Entity</dt>
                      <dd>{v.legalEntity ?? none("Not disclosed")}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{v.location ?? v.country ?? none("Not disclosed")}</dd>
                    </div>
                    {v.contact && (
                      <div>
                        <dt>Contact</dt>
                        <dd>{v.contact}</dd>
                      </div>
                    )}
                  </dl>
                </section>
                {v.incidents.length > 0 && (
                  <section className="sh-sheet-sec" id="record">
                    <SheetHead title="On record" note={`${v.incidents.length} entr${v.incidents.length === 1 ? "y" : "ies"}`} />
                    <ul className="sh-record">
                      {v.incidents.map((i, k) => (
                        <li key={k}>
                          {i.date ? <span className="sh-record-date">{i.date}</span> : null}
                          <span>{i.text ?? i.summary}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </aside>
          </div>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
