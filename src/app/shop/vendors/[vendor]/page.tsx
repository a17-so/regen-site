import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../../lib/appStoreUrl";
import NavBar from "../../../components/NavBar";
import PageClose from "../../../components/PageClose";
import { JsonLd } from "../../../components/JsonLd";
import { LIBRARY_ROBOTS } from "../../../lib/library";
import {
  SCORE_BLURB,
  SHOP_VENDORS,
  coaAnalysisFor,
  compoundBySlug,
  coaPillarsFor,
  effectiveScore,
  foundedYear,
  mg,
  money,
  packLabel,
  pillarsFor,
  priceStatus,
  proofFacts,
  scoreBand,
  shopHref,
  trustLine,
  vendorBySlug,
  storeCatalogCount,
  storeCatalogFor,
  vendorHref,
  vendorStats,
} from "../../../lib/shop";
import { SITE_URL } from "../../../library/parts";
import ShopShell from "../../ShopShell";
import CodeCopy from "../../CodeCopy";
import VendorTabs from "../../VendorTabs";
import HandoffLink from "../../HandoffLink";
import { PillarRows, PriceBar, ScoreRing, Seal, SheetHead, VendorMark } from "../../VendorParts";

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
    title: `${title} | REGEN Shop`,
    description,
    alternates: { canonical: `${SITE_URL}${vendorHref(v.slug)}` },
    robots: LIBRARY_ROBOTS,
    openGraph: { type: "website", url: `${SITE_URL}${vendorHref(v.slug)}`, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

const none = (t: string) => <span className="lib-none">{t}</span>;
const ext = { target: "_blank", rel: "noopener noreferrer nofollow sponsored" } as const;

/**
 * The vendor profile, the reference's shape: head, the strip (score ring
 * and band, the numbers, since, the one accent button), then the
 * profile's own four tabs. Every tab is built from the SAME parts: a sheet
 * pane whose sections open with `SheetHead` (one heading size, one weight,
 * one note style), hairlines between sections. No tab invents its own
 * card. Overview: highlights, scorecard, the trade, price, the brief, on
 * record; beside it the code block and one facts pane. Certificates: the
 * COA read and the certificate list. Catalog: what this store stocks, or
 * a real way to its own catalog when it could not be read. Sources.
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
  const facts = proofFacts(v);
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

  const overview = (
    <div className="sh-profile">
      <div className="sh-pane sh-sheet">
        {v.verdict && (
          <section className="sh-sheet-sec">
            <SheetHead title="The verdict" />
            <p className="sh-verdict">{v.verdict}</p>
          </section>
        )}

        {facts.length > 0 && (
          <section className="sh-sheet-sec">
            <SheetHead title="Highlights" note="From the published record" />
            <dl className="sh-highlights">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="sh-sheet-sec">
          <SheetHead title="Scorecard" note={SCORE_BLURB} />
          <PillarRows pillars={pillarsFor(v)} />
        </section>

        <section className="sh-sheet-sec">
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
          <section className="sh-sheet-sec">
            <SheetHead title="Price" note={price.word} />
            <PriceBar fraction={v.priceFraction} />
            <div className="sh-pricebar-labels" aria-hidden="true">
              <span>Priced high</span>
              <span>Market average</span>
              <span>Priced well</span>
            </div>
            {v.priceUsdPerMg !== null && <p className="sh-sheet-p">Averages {money(v.priceUsdPerMg)} per mg across a standard basket, against every other vendor here.</p>}
          </section>
        )}

        {v.summary && (
          <section className="sh-sheet-sec">
            <SheetHead title="The brief" />
            {v.summary && <p className="sh-sheet-p">{v.summary}</p>}
          </section>
        )}

        {v.incidents.length > 0 && (
          <section className="sh-sheet-sec">
            <SheetHead title="On record" />
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

      <aside className="sh-profile-side">
        {/* The app's "Shop Now" card, its own pane above the facts. */}
        {v.code && <CodeCopy code={v.code} vendor={v.slug} domain={v.domain ?? v.name} />}
        <div className="sh-pane sh-sheet sh-sheet--rail">
          {!v.code && (
            <section className="sh-sheet-sec">
              <SheetHead title="Shop now" />
              <p className="sh-code-note">No REGEN code at this store. The price on its site is the price.</p>
            </section>
          )}
          <section className="sh-sheet-sec sh-facts">
            <SheetHead title="Testing" />
            <dl>
              <div>
                <dt>Labs</dt>
                <dd>{v.labs?.length ? v.labs.join(", ") : none("Not named")}</dd>
              </div>
              <div>
                <dt>Public COAs</dt>
                <dd>{v.coaCount ?? (v.coaArchive ? "Archive" : none("None public"))}</dd>
              </div>
              <div>
                <dt>Average purity</dt>
                <dd>{v.coaAvgPurity !== null ? `${v.coaAvgPurity}%` : none("Not reported")}</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd className="sh-scope">{v.testingScope?.length ? v.testingScope.join(" · ") : none("Not stated")}</dd>
              </div>
            </dl>
          </section>
          <section className="sh-sheet-sec sh-facts">
            <SheetHead title="Operator" />
            <dl>
              <div>
                <dt>Entity</dt>
                <dd>{v.legalEntity ?? none("Not disclosed")}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{v.location ?? v.country ?? none("Not disclosed")}</dd>
              </div>
              <div>
                <dt>Storefront age</dt>
                <dd>{v.domainAgeMonths ? `${v.domainAgeMonths} months` : none("Unknown")}</dd>
              </div>
              <div>
                <dt>Reviews</dt>
                <dd>{v.trustpilotCount ? `${v.trustpilotAverage ?? ""} on Trustpilot (${v.trustpilotCount})` : none("None found")}</dd>
              </div>
              {v.contact && (
                <div>
                  <dt>Contact</dt>
                  <dd>{v.contact}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </aside>
    </div>
  );

  const certificates = (
    <div className="sh-pane sh-sheet">
      <section className="sh-sheet-sec">
        <SheetHead title={coa.title} note={coa.score !== null ? `${coa.score} of 100` : "None published"} />
        <p className="sh-sheet-p">{coa.body}</p>
        {coaPillars.length > 0 && <PillarRows pillars={coaPillars} outOf={100} />}
      </section>
      {v.coaExamples.length > 0 && (
        <section className="sh-sheet-sec">
          <SheetHead title="Certificates on file" note={`${v.coaExamples.length} shown`} />
          <ul className="sh-certs">
            {v.coaExamples.map((c, i) => {
              const panels = [c.endotoxin && "Endotoxin", c.heavyMetals && "Metals", c.sterility && "Sterility"].filter(Boolean) as string[];
              const Name = c.coaPdf ? "a" : "span";
              return (
                <li key={`${c.batchNumber ?? ""}-${i}`}>
                  <span className="sh-certs-main">
                    <Name className="sh-certs-name" {...(c.coaPdf ? { href: c.coaPdf, target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>
                      {c.productName ?? "Unnamed product"}
                    </Name>
                    <span className="sh-certs-meta">
                      {[c.testDate ?? "Undated", c.labName ?? "Lab not named", c.batchNumber ? `Batch ${c.batchNumber}` : null, c.netContentMg ? `${c.netContentMg} mg measured` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <span className="sh-certs-panels">{panels.length ? panels.join(" · ") : "Purity only"}</span>
                  <strong className="sh-certs-purity">{c.purityPercent !== null ? `${c.purityPercent}%` : none("n/a")}</strong>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );

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

  const catalogTab =
    catalog.kind === "none" ? null : (
      <div className="sh-pane sh-sheet">
        <section className="sh-sheet-sec">
          {catalog.kind === "live" && (
            <>
              <SheetHead title="Stocked here" note={`${catalog.rows.length} compounds, read from the store`} />
              <ul className="sh-vcat">
                {catalog.rows.map(({ compound, packs, bestPerMg }) => {
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
                })}
              </ul>
            </>
          )}
          {catalog.kind === "listing" && (
            <>
              <SheetHead title="Stocked here" note={`${catalog.items.length} compounds, from the store's own product list`} />
              <ul className="sh-vcat">
                {catalog.items.map((it) => (
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
                ))}
              </ul>
              <p className="sh-sheet-foot">
                Starting prices as the store lists them, read {catalog.fetchedAt}. Its storefront does not publish vial sizes in a readable form, so there is no per
                mg here.
              </p>
            </>
          )}
          {catalog.kind === "coas" && (
            <>
              <SheetHead title="Certified here" note={`${catalog.items.length} compounds with a published certificate`} />
              <ul className="sh-vcat">
                {catalog.items.map((it) => (
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
                ))}
              </ul>
              <p className="sh-sheet-foot">The store hides its prices behind a sign-in or blocks automated reads. These are the compounds it publishes certificates for.</p>
            </>
          )}
        </section>
      </div>
    );

  const sources = (
    <div className="sh-pane sh-sheet">
      <section className="sh-sheet-sec">
        <SheetHead title="Sources" note="What this profile is built from" />
        <ol className="gd-cites sh-cites">
          {v.sources.map((src, k) => (
            <li key={k}>
              <span className="gd-cites-n">{k + 1}</span>
              <span className="gd-cites-main">
                <a href={src.url} target="_blank" rel="noopener noreferrer nofollow">
                  {src.title ?? src.url}
                </a>
                <span className="gd-cites-meta">{src.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
              </span>
              <svg className="gd-also-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4.5 11.5l7-7M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          ownTabs
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Vendors", href: "/shop" }, { label: v.name }]}
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
            <p className="pg-links">
              #{position} of {SHOP_VENDORS.length}
              {v.domain ? <span aria-hidden="true"> · </span> : null}
              {v.domain && store && (
                <a href={store} {...ext}>
                  {v.domain}
                </a>
              )}
            </p>
          }
        >
          <div className="sh-pane sh-strip" aria-label="At a glance">
            <div className="sh-strip-cell">
              <ScoreRing score={score} id={`s-${v.slug}`} size={56} stroke={5} />
              <span className="sh-strip-text">
                <strong>{scoreBand(score)}</strong>
                <span>Score out of 10</span>
              </span>
            </div>
            {vendorStats(v).map((s) => (
              <div key={s.label} className="sh-strip-cell">
                <span className="sh-strip-text">
                  <strong className={s.none ? "lib-none" : undefined}>{s.value}</strong>
                  <span>{s.label}</span>
                </span>
              </div>
            ))}
            {(foundedYear(v) || v.country) && (
              <div className="sh-strip-cell">
                <span className="sh-strip-text">
                  <strong>{foundedYear(v) ? `Since ${foundedYear(v)}` : v.country}</strong>
                  <span>{foundedYear(v) ? (v.country ?? "Storefront age") : "Ships from"}</span>
                </span>
              </div>
            )}
            {store && (
              <HandoffLink className="btn btn-accent btn-tiny sh-strip-visit" handoff={{ vendorSlug: v.slug, vendorName: v.name, url: store, code: v.code, from: "vendor" }}>
                Visit {v.domain ?? v.name}
              </HandoffLink>
            )}
          </div>

          <VendorTabs
            panels={[
              { key: "overview", label: "Overview", node: overview },
              { key: "certificates", label: "Certificates", count: v.coaCount ?? (v.coaExamples.length || undefined), node: certificates },
              ...(catalogTab ? [{ key: "catalog", label: "Catalog", count: catalogCount, node: catalogTab }] : []),
              ...(v.sources.length ? [{ key: "sources", label: "Sources", count: v.sources.length, node: sources }] : []),
            ]}
          />
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
