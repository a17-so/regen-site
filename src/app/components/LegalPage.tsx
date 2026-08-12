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

  // The FAQ rail's accent full stop, so the interior page titles match.
  const stem = title.endsWith(".") ? title.slice(0, -1) : title;

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
      <div className="page-wash" aria-hidden="true" />
      {/* .legal-doc restores the pre-redesign editorial shell for the three
          legal documents; blog articles share these class names and keep the
          centred card shell, so every override rides the modifier. */}
      <main className="legal-page legal-doc">
        <div className="legal-head">
          <h1>
            {stem}
            <span className="accent-dot">.</span>
          </h1>
          <div className="legal-updated">{updated}</div>
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
