import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { LIBRARY_ROBOTS } from "../../lib/library";
import { SHOP_LABS, shopSearchRows, vendorBySlug, vendorHref } from "../../lib/shop";
import { SITE_URL } from "../../library/parts";
import LibrarySearch from "../../library/LibrarySearch";
import ShopShell from "../ShopShell";

const TITLE = "Testing labs";
const DESCRIPTION = `The ${SHOP_LABS.length} laboratories named on vendors' certificates, with which vendors use each one and how many certificates on file they signed.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Shop`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/shop/labs` },
  robots: LIBRARY_ROBOTS,
};

export default function LabsPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={shopSearchRows()} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="labs"
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Labs" }]}
          title="Labs"
          lead="The laboratories vendors name on their certificates. A lab a vendor pays is not an independent test, so this is who signs the paper, not a ranking. Accreditation is noted where the lab publishes it."
        >
          <div className="sh-pane">
            <ul className="sh-list">
              {SHOP_LABS.map((l) => (
                <li key={l.name} className="sh-list-row sh-lab-row">
                  <div>
                    <h2 className="sh-lab-name">
                      {l.name}
                      {l.detail && <span className="sh-badge">{l.detail}</span>}
                    </h2>
                    <ul className="sh-badges sh-lab-vendors">
                      {l.vendors.map((slug) => {
                        const v = vendorBySlug(slug);
                        return v ? (
                          <li key={slug}>
                            <a className="sh-badge sh-badge--link" href={vendorHref(slug)}>
                              {v.name}
                            </a>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                  <dl className="sh-stats">
                    <div>
                      <dt>Vendors</dt>
                      <dd>{l.vendors.length}</dd>
                    </div>
                    <div>
                      <dt>COAs on file</dt>
                      <dd>{l.coaCount}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
