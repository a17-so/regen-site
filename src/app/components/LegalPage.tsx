import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "./NavBar";
import Footer from "./Footer";

interface TocEntry {
  id: string;
  label: string;
}

interface LegalPageProps {
  title: string;
  updated: string;
  toc: TocEntry[];
  children: React.ReactNode;
}

export default function LegalPage({
  title,
  updated,
  toc,
  children,
}: LegalPageProps) {
  // Legal pages are not creator-scoped, default campaign token.
  const appStoreUrl = buildAppStoreUrl();

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
      <div className="page-wash" aria-hidden="true" />
      <main className="legal-page">
        <div className="legal-head">
          <h1>{title}</h1>
          <div className="updated">{updated}</div>
        </div>
        <div className="legal-body">
          <aside className="legal-toc">
            {toc.map((t) => (
              <a key={t.id} href={`#${t.id}`}>
                {t.label}
              </a>
            ))}
          </aside>
          <article className="legal-content">{children}</article>
        </div>
      </main>
      <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
