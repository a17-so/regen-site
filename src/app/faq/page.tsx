import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
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

export default function FaqPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        {/* The landing's wash, whispered, interior pages open on the same
            field so the site reads as one place. */}
        <div className="page-wash" aria-hidden="true" />
        <main className="faq-page">
          <div className="faq-grid">
            <aside className="faq-rail">
              <h1>
                FAQs<span className="accent-dot">.</span>
              </h1>
              <nav className="faq-rail-nav" aria-label="FAQ categories">
                {CATEGORIES.map((c) => (
                  <a key={c.id} href={`#${c.id}`}>
                    {c.label}
                  </a>
                ))}
              </nav>
              <p className="faq-rail-note">
                Anything about your own numbers is a question for the app.
              </p>
            </aside>
            <FaqList />
          </div>
        </main>
        <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
