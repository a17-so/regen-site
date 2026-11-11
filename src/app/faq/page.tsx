import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import PageShell from "../components/PageShell";
import { FAQS } from "../lib/slides";
import FaqList from "./FaqList";

export const metadata: Metadata = {
  title: "FAQs · REGEN",
  alternates: { canonical: "/faq" },
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
 * The site's one page anatomy (PageShell head), then the questions as
 * glass rows grouped by category (2026-11-09). The legal-document shell
 * with its numbered rail is gone.
 */
export default function FaqPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <PageShell eyebrow="Help" title="Frequently asked questions." lead="How REGEN schedules doses, counts vials, reads biomarkers and grades the research. Anything about your own numbers is a question for the app.">
          <FaqList />
        </PageShell>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
