import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { LIBRARY_ROBOTS } from "../../lib/library";
import { SHOP_COAS, SHOP_COMPOUNDS, shopSearchRows } from "../../lib/shop";
import { SITE_URL } from "../../library/parts";
import LibrarySearch from "../../library/LibrarySearch";
import ShopShell from "../ShopShell";
import VerifyBatch from "./VerifyBatch";

const TITLE = "Verify a batch";
const DESCRIPTION = "Enter the batch number on a vial and see whether a published certificate of analysis is on file for it: vendor, lab, date, purity, and the PDF.";

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Shop`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/shop/verify` },
  robots: LIBRARY_ROBOTS,
};

export default function VerifyPage() {
  const appStoreUrl = buildAppStoreUrl();
  const names = Object.fromEntries(SHOP_COMPOUNDS.map((c) => [c.slug, c.name]));
  const withBatch = SHOP_COAS.filter((c) => c.batch);
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={<LibrarySearch rows={shopSearchRows()} variant="nav" />} />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="verify"
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Verify" }]}
          title="Verify a batch"
          lead={`Only for vials that carry a batch number. ${withBatch.length} batches are on file. A match shows the certificate behind the lot; no match means the archive has not seen it, not that the vial is bad.`}
        >
          <VerifyBatch rows={withBatch} compoundNames={names} />
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
