import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../../lib/appStoreUrl";
import NavBar from "../../../components/NavBar";
import PageClose from "../../../components/PageClose";
import { LIBRARY_ROBOTS } from "../../../lib/library";
import { SHOP_VENDORS, mg, money, packLabel, perMg, shopHref, shopSearchRows, trustLine, vendorBySlug, vendorCatalog, vendorHref } from "../../../lib/shop";
import { SITE_URL } from "../../../library/parts";
import LibrarySearch from "../../../library/LibrarySearch";
import ShopShell from "../../ShopShell";

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

export default async function VendorPage({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;
  const v = vendorBySlug(vendor);
  if (!v) notFound();
  const appStoreUrl = buildAppStoreUrl();
  const catalog = vendorCatalog(v);
  const position = SHOP_VENDORS.findIndex((x) => x.slug === v.slug) + 1;

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={shopSearchRows()} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="vendors"
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Vendors", href: "/shop/vendors" }, { label: v.name }]}
          title={
            <span className="sh-vendor sh-vendor--title">
              {v.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.logoUrl} alt="" width={44} height={44} />
              ) : null}
              {v.name}
            </span>
          }
          lead={`#${position} of ${SHOP_VENDORS.length} · ${trustLine(v) || "Testing and COA disclosure not on record."}`}
          actions={
            <p className="sh-links">
              {v.url && (
                <a href={v.url} target="_blank" rel="noopener noreferrer nofollow sponsored">
                  Visit {v.domain ?? "store"}
                </a>
              )}
              {v.url && v.code && <span aria-hidden="true"> · </span>}
              {v.code && (
                <span>
                  Code <code>{v.code}</code>
                </span>
              )}
            </p>
          }
        >
          <div className="sh-profile">
            <div className="sh-profile-main">
              {v.tagline && <p className="sh-profile-lead">{v.tagline}</p>}
              {v.summary && <p>{v.summary}</p>}
              {(v.standoutPro || v.standoutCon) && (
                <div className="sh-procon">
                  {v.standoutPro && (
                    <div className="sh-pane sh-pane--pad">
                      <div className="sh-kicker">What carries it</div>
                      <p>{v.standoutPro}</p>
                    </div>
                  )}
                  {v.standoutCon && (
                    <div className="sh-pane sh-pane--pad">
                      <div className="sh-kicker">What holds it back</div>
                      <p>{v.standoutCon}</p>
                    </div>
                  )}
                </div>
              )}
              {v.verdict && (
                <div className="sh-pane sh-pane--pad">
                  <div className="sh-kicker">Verdict</div>
                  <p>{v.verdict}</p>
                </div>
              )}
              {v.incidents.length > 0 && (
                <section className="sh-incidents">
                  <h2>On record</h2>
                  <ul>
                    {v.incidents.map((i, k) => (
                      <li key={k}>{i.text ?? i.summary}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="sh-profile-side">
              <div className="sh-pane sh-pane--pad sh-facts">
                <div className="sh-kicker">Testing</div>
                <dl>
                  <div>
                    <dt>Labs</dt>
                    <dd>{v.labs?.length ? v.labs.join(", ") : <span className="lib-none">Not named</span>}</dd>
                  </div>
                  <div>
                    <dt>Public COAs</dt>
                    <dd>{v.coaCount ?? (v.coaArchive ? "Archive" : <span className="lib-none">None public</span>)}</dd>
                  </div>
                  <div>
                    <dt>Average purity</dt>
                    <dd>{v.coaAvgPurity !== null ? `${v.coaAvgPurity}%` : <span className="lib-none">Not reported</span>}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{v.testingScope?.length ? v.testingScope.join("; ") : <span className="lib-none">Not stated</span>}</dd>
                  </div>
                </dl>
              </div>
              <div className="sh-pane sh-pane--pad sh-facts">
                <div className="sh-kicker">Operator</div>
                <dl>
                  <div>
                    <dt>Entity</dt>
                    <dd>{v.legalEntity ?? <span className="lib-none">Not disclosed</span>}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{v.location ?? v.country ?? <span className="lib-none">Not disclosed</span>}</dd>
                  </div>
                  <div>
                    <dt>Storefront age</dt>
                    <dd>{v.domainAgeMonths ? `${v.domainAgeMonths} months` : <span className="lib-none">Unknown</span>}</dd>
                  </div>
                  <div>
                    <dt>Reviews</dt>
                    <dd>{v.trustpilotCount ? `${v.trustpilotAverage ?? ""} on Trustpilot (${v.trustpilotCount})` : <span className="lib-none">None found</span>}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          <section className="sh-section" id="catalog" aria-labelledby="vcat-h">
            <div className="sh-section-head">
              <h2 id="vcat-h">Catalog</h2>
              <span className="sh-count">{catalog.length ? `${catalog.length} compounds, read from the store` : "Not readable from the store"}</span>
            </div>
            {catalog.length === 0 ? (
              <p className="sh-empty">
                This store&apos;s catalog could not be read automatically (sign-in wall, bot protection, or no product feed).
                Browse it on the vendor&apos;s site.
              </p>
            ) : (
              <div className="sh-pane">
                <ul className="sh-list">
                  {catalog.map(({ compound, offers }) => (
                    <li key={compound.slug} className="sh-list-row sh-vcat-row">
                      <a className="sh-vendor-name" href={shopHref(compound.slug)}>
                        {compound.name}
                      </a>
                      <ul className="sh-packs sh-packs--row">
                        {offers.flatMap((o) =>
                          o.variants.map((x, j) => {
                            const pm = perMg(x);
                            return (
                              <li key={`${o.productUrl}-${j}`}>
                                <a href={o.productUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">
                                  {money(x.priceUsd, o.currency)}{" "}
                                  <span className="sh-sub">
                                    {packLabel(x)}
                                    {x.sizeMg ? ` · ${mg(x.sizeMg)}` : ""}
                                    {pm !== null && o.currency === "USD" ? ` · ${money(pm)}/mg` : ""}
                                  </span>
                                </a>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
