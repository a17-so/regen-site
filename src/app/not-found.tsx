import type { Metadata } from "next";
import { buildAppStoreUrl } from "./lib/appStoreUrl";
import NavBar from "./components/NavBar";
import PageClose from "./components/PageClose";
import PageShell from "./components/PageShell";

export const metadata: Metadata = {
  title: "Page not found · REGEN",
  robots: { index: false, follow: true },
};

/** The branded 404: the site's page anatomy, the three pillars as the
    library's chips, and the search shortcut. */
export default function NotFound() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in nf">
        <div className="page-wash" aria-hidden="true" />
        <PageShell
          eyebrow="404"
          title="That page isn't here."
          lead="It may have moved when the site was reorganised, or the address has a typo. Everything on the site is one of these three."
          actions={
            <nav className="lib-filters" aria-label="Where to go">
              <a className="lib-filter" href="/library">
                Library
              </a>
              <a className="lib-filter" href="/blog">
                Science
              </a>
              <a className="lib-filter" href="/shop">
                Marketplace
              </a>
            </nav>
          }
        >
          <p className="nf-hint">
            Looking for a peptide, an article or a vendor? Press <kbd>⌘K</kbd> to search.
          </p>
        </PageShell>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
