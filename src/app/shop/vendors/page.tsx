import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { LIBRARY_ROBOTS } from "../../lib/library";
import { SHOP_VENDORS, shopSearchRows, trustLine, vendorHref, vendorsWithOffers } from "../../lib/shop";
import { SITE_URL } from "../../library/parts";
import LibrarySearch from "../../library/LibrarySearch";
import ShopShell from "../ShopShell";

const TITLE = "Peptide Vendors, Ranked";
const DESCRIPTION = `${SHOP_VENDORS.length} research-peptide vendors ranked on third-party testing, public COA archives, operator disclosure, and reviews. Rank order only, no grades.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Shop`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/shop/vendors` },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "website", url: `${SITE_URL}/shop/vendors`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const PLACE = ["1st", "2nd", "3rd"];

/** One pane, one row per vendor, rank order. The facts that put each
    vendor where it is sit on the row; the profile has the rest. */
export default function VendorsPage() {
  const appStoreUrl = buildAppStoreUrl();
  const live = new Set(vendorsWithOffers().map((v) => v.slug));
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={shopSearchRows()} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="vendors"
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Vendors" }]}
          title="Vendors"
          lead="Ranked on third-party testing, the COA archive, who the operator is, and what customers report. The order is the research pipeline's and is not for sale."
        >
          <div className="sh-pane">
            <ol className="sh-list">
              {SHOP_VENDORS.map((v, i) => (
                <li key={v.slug} className="sh-list-row sh-vrow">
                  <div className="sh-col-rank">{i < 3 ? PLACE[i] : String(i + 1).padStart(2, "0")}</div>
                  <div className="sh-vendor">
                    {v.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.logoUrl} alt="" width={32} height={32} loading="lazy" />
                    ) : (
                      <span className="sh-vendor-mark" aria-hidden="true">
                        {v.name.slice(0, 1)}
                      </span>
                    )}
                    <div>
                      <a className="sh-vendor-name" href={vendorHref(v.slug)}>
                        {v.name}
                      </a>
                      <p className="sh-sub">{trustLine(v) || "Testing and COA disclosure not on record."}</p>
                      <div className="sh-badges">
                        {(v.strengthTags ?? []).map((t) => (
                          <span key={t} className="sh-badge">
                            {t}
                          </span>
                        ))}
                        {(v.watchoutTags ?? []).map((t) => (
                          <span key={t} className="sh-badge sh-badge--warn">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <dl className="sh-stats">
                    <div>
                      <dt>Reviews</dt>
                      <dd>{v.trustpilotCount ? `${v.trustpilotAverage ?? ""} (${v.trustpilotCount})` : <span className="lib-none">None</span>}</dd>
                    </div>
                    <div>
                      <dt>COAs</dt>
                      <dd>{v.coaCount ?? (v.coaArchive ? "Archive" : <span className="lib-none">None</span>)}</dd>
                    </div>
                    <div>
                      <dt>Prices</dt>
                      <dd>{live.has(v.slug) ? "Live" : <span className="lib-none">Not readable</span>}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          </div>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
