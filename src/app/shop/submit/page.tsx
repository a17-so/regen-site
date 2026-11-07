import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { SITE_URL } from "../../library/parts";
import ShopShell from "../ShopShell";
import SubmitVendorForm from "./SubmitVendorForm";

export const metadata: Metadata = {
  title: "Submit a vendor | REGEN Shop",
  description: "Know a peptide vendor that should be on the list? Send the store and we research it the same way as the other 42.",
  alternates: { canonical: `${SITE_URL}/shop/submit` },
  robots: { index: false, follow: true },
};

export default function SubmitVendorPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Submit" }]}
          title="Submit a vendor or a COA"
          lead="Send the store. We check it against the list, run it through the same research as every other vendor (testing, COA archive, who runs it, what customers report), and add it if it holds up. A certificate the archive is missing goes the same way."
        >
          <SubmitVendorForm />
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
