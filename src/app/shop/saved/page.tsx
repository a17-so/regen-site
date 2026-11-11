import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { SHOP_VENDORS } from "../../lib/shop";
import { SITE_URL } from "../../library/parts";
import ShopShell from "../ShopShell";
import SavedView from "./SavedView";

export const metadata: Metadata = {
  title: "Saved | REGEN Marketplace",
  description: "The packs you picked, grouped by vendor, with the code to use at each checkout.",
  alternates: { canonical: `${SITE_URL}/shop/saved` },
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  const appStoreUrl = buildAppStoreUrl();
  const vendorUrls = Object.fromEntries(SHOP_VENDORS.map((v) => [v.slug, v.url]));
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <ShopShell
          active="saved"
          crumbs={[{ label: "Marketplace", href: "/shop" }, { label: "Saved" }]}
          title="Saved"
          lead="The packs you picked, grouped by the vendor that sells them. Each vendor checks out on its own site; the code to use there is shown with the group."
        >
          <SavedView vendorUrls={vendorUrls} />
        </ShopShell>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
