import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { FAQS } from "../lib/slides";
import { CATEGORIES } from "./categories";
import FaqList from "./FaqList";

export const metadata: Metadata = {
  title: "FAQs · REGEN",
  description:
    "How REGEN schedules doses, tracks vials and biomarkers, grades compounds, and where its answers come from.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: [...f.a, ...(f.bullets ?? [])].join(" "),
    },
  })),
};

/**
 * Same editorial shell as the legal documents (LegalPage / .legal-doc):
 * display title over a hairline, numbered contents rail on the left, the
 * body beside it. The rows keep their plus-button unfold — only the page
 * furniture matches Terms, not the interaction.
 */
export default function FaqPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        {/* The landing's wash, whispered, interior pages open on the same
            field so the site reads as one place. */}
        <div className="page-wash" aria-hidden="true" />
        <main className="legal-page legal-doc">
          <div className="legal-head">
            <h1>
              FAQs<span className="accent-dot">.</span>
            </h1>
            <div className="legal-updated">
              Anything about your own numbers is a question for the app.
            </div>
          </div>
          <div className="legal-body">
            <aside className="legal-toc">
              {CATEGORIES.map((c, i) => (
                <a key={c.id} href={`#${c.id}`}>
                  {String(i + 1).padStart(2, "0")} {c.label}
                </a>
              ))}
            </aside>
            <FaqList />
          </div>
        </main>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
