import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { SHOP_VENDORS } from "../../lib/shop";
import { SITE_URL } from "../../library/parts";
import ShopShell from "../ShopShell";
import SubmitVendorForm from "./SubmitVendorForm";

export const metadata: Metadata = {
  title: "Submit a vendor | REGEN Marketplace",
  description: `Know a peptide vendor that should be on the list? Send the store and we research it the same way as the other ${SHOP_VENDORS.length}.`,
  alternates: { canonical: `${SITE_URL}/shop/submit` },
  robots: { index: false, follow: true },
};

/**
 * Submit a vendor or a certificate as an onboarding (SubmitVendorForm): a
 * step rail on the left, one question group per step on the right, a
 * review before the send. No shop tabs: this is a task page, not a section
 * of the marketplace.
 */
export default function SubmitVendorPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          ownTabs
          crumbs={[{ label: "Marketplace", href: "/shop" }, { label: "Submit" }]}
          title="Submit a vendor"
          lead={`Know a store that belongs on the list, or a certificate the archive is missing? A few short steps, then it goes through the same research as the other ${SHOP_VENDORS.length} vendors. Nobody pays to be listed or ranked.`}
        >
          <SubmitVendorForm />
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
