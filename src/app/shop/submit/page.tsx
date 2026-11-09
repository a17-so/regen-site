import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { SHOP_VENDORS } from "../../lib/shop";
import { SITE_URL } from "../../library/parts";
import ShopShell from "../ShopShell";
import SubmitVendorForm from "./SubmitVendorForm";
import { SheetHead } from "../VendorParts";

export const metadata: Metadata = {
  title: "Submit a vendor | REGEN Shop",
  description: `Know a peptide vendor that should be on the list? Send the store and we research it the same way as the other ${SHOP_VENDORS.length}.`,
  alternates: { canonical: `${SITE_URL}/shop/submit` },
  robots: { index: false, follow: true },
};

const STEPS = [
  { title: "We check the list", body: `Matched by domain against the ${SHOP_VENDORS.length} vendors already researched. A known store gets its profile back at once.` },
  { title: "We do the research", body: "Who runs it, which lab tests it, whether the certificates are public and verify, what customers report, what went wrong on record." },
  { title: "It is scored and placed", body: "The same four pillars as every vendor here. It lands where its score puts it, not where anyone asks." },
];

/**
 * Submit a vendor or a certificate: the form in one pane on the left, what
 * happens next on the right. No shop tabs: this is a task page, not a
 * section of the shop.
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
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Submit" }]}
          title="Submit a vendor"
          lead="Know a store that belongs on the list, or a certificate the archive is missing? Send it and it goes through the same research as every vendor here."
        >
          <div className="sh-submit">
            <SubmitVendorForm />
            <aside className="sh-pane sh-sheet sh-submit-side" aria-label="What happens next">
              <section className="sh-sheet-sec">
                <SheetHead title="What happens next" />
                <ol className="sh-steps">
                  {STEPS.map((st, i) => (
                    <li key={st.title}>
                      <span className="sh-steps-n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="sh-steps-main">
                        <strong>{st.title}</strong>
                        <span>{st.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </aside>
          </div>
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
