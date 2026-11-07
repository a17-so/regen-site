import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { LIBRARY_ROBOTS } from "../../lib/library";
import { SHOP_COAS, SHOP_COMPOUNDS, shopSearchRows } from "../../lib/shop";
import { SITE_URL } from "../../library/parts";
import LibrarySearch from "../../library/LibrarySearch";
import ShopShell from "../ShopShell";
import CoaTable from "./CoaTable";

const TITLE = "Peptide COAs";
const DESCRIPTION = `${SHOP_COAS.length} published certificates of analysis from researched vendors: date, batch number, purity, and the lab that ran the test, each linked to the PDF.`;

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Shop`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/shop/coas` },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "website", url: `${SITE_URL}/shop/coas`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function CoasPage() {
  const appStoreUrl = buildAppStoreUrl();
  const names = Object.fromEntries(SHOP_COMPOUNDS.map((c) => [c.slug, c.name]));
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={shopSearchRows()} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="coas"
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "COAs" }]}
          title="COAs"
          lead={`${SHOP_COAS.length} certificates on file, read from the vendors' own archives during research. Every batch links to its PDF. A certificate from the vendor's contracted lab is evidence, not proof; the lab and the method are shown so you can weigh it.`}
          actions={
            <p className="sh-links">
              <a href="/shop/verify">Verify a batch</a>
              <span aria-hidden="true"> · </span>
              <a href="/shop/submit">Submit a COA</a>
            </p>
          }
        >
          <CoaTable rows={SHOP_COAS} compoundNames={names} />
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
