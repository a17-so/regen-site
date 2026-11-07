import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { SHOP_COMPOUNDS } from "../lib/shop";
import { Crumbs, SITE_URL } from "../library/parts";
import AccountView from "./AccountView";

export const metadata: Metadata = {
  title: "Account | REGEN",
  description: "Sign in with the account you use in the REGEN app to see your stack and your saved cart on the web.",
  alternates: { canonical: `${SITE_URL}/account` },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  const appStoreUrl = buildAppStoreUrl();
  // Catalog slug -> shop slug. The app's inventory stores the catalog slug,
  // and the shop keys compounds by the same slug where it stocks them.
  const shopSlugs = Object.fromEntries(SHOP_COMPOUNDS.map((c) => [c.slug, c.slug]));
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <div className="lib-page sh-page">
          <header className="lib-index-head sh-head">
            <Crumbs trail={[{ label: "Home", href: "/" }, { label: "Account" }]} />
            <h1>Account</h1>
            <p>One login across the app and the web. Your stack is read from the app; the web never edits it.</p>
          </header>
          <AccountView shopSlugs={shopSlugs} />
        </div>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
