import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { MedicalDisclaimer } from "../../components/Disclaimer";
import { LIBRARY_ROBOTS, type Source } from "../../lib/library";
import { Citations, Crumbs, LibraryByline, SITE_URL } from "../../library/parts";

/**
 * `/tools/bacteriostatic-water` — the reference page behind the calculators.
 *
 * A static sibling of the `[tool]` route (Next resolves literal segments
 * first, so the two do not collide). It sits under /tools rather than in the
 * library because the library composes every page from the peptide catalog:
 * bacteriostatic water is not a compound, has no catalog row, and needs prose
 * of its own.
 *
 * Every quantitative claim here is the FDA label or CDC/USP guidance, cited
 * inline and listed at the foot. Nothing on this page recommends a volume, a
 * dose, or a supplier: it describes what the product is and what the
 * regulators say about handling it.
 */

const TITLE = "Bacteriostatic water for peptides";
const DESCRIPTION =
  "What bacteriostatic water is, how it differs from sterile water, how long it lasts after the first puncture, and how it is stored. Sourced to the FDA label and CDC guidance.";
const URL = `${SITE_URL}/tools/bacteriostatic-water`;
const UPDATED = "2026-09-02";

export const metadata: Metadata = {
  title: `${TITLE} | REGEN`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: LIBRARY_ROBOTS,
  openGraph: { type: "article", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const SOURCES: Source[] = [
  {
    url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=ccadcf46-6a6f-436b-9bbc-17e2983a335f",
    title: "Bacteriostatic Water for Injection, USP: FDA prescribing information",
    year: 2024,
  },
  {
    url: "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html",
    title: "Preventing Unsafe Injection Practices: multi-dose vial guidance",
    year: 2024,
  },
  {
    url: "https://www.nejm.org/doi/abs/10.1056/NEJM198211253072206",
    title: "The Gasping Syndrome and Benzyl Alcohol Poisoning",
    authors: ["Gershanik J", "Boecler B", "Ensley H", "McCloskey S", "George W"],
    year: 1982,
  },
];

/** Asked verbatim on the SERP, answered in one paragraph each. Shared by the
    visible FAQ and the FAQPage schema so the two can never drift. */
const FAQ = [
  {
    q: "What is bac water?",
    a: "Bac water is shorthand for Bacteriostatic Water for Injection, USP: sterile water with 0.9% (9 mg/mL) benzyl alcohol added as a preservative. The preservative stops bacteria multiplying in the vial, which is what allows the same vial to be punctured more than once instead of being discarded after a single preparation.",
  },
  {
    q: "Is bacteriostatic water the same as sterile water?",
    a: "No. Sterile Water for Injection contains no preservative and is intended for a single use. Bacteriostatic water is the same water with benzyl alcohol added, which is why it is supplied as a multi-dose vial. The FDA label also states that where water is needed to prepare or dilute medication for neonates, only preservative-free Sterile Water for Injection should be used.",
  },
  {
    q: "How long is bacteriostatic water good for after opening?",
    a: "CDC guidance for multi-dose vials is that once a vial is punctured it should be dated and discarded within 28 days, unless the manufacturer states another date. The vial's printed expiration date still applies, so whichever comes first is the one that governs. The 28-day count starts at the first needle puncture, not at the first dose.",
  },
  {
    q: "Does bacteriostatic water need to be refrigerated?",
    a: "The FDA label directs storage at 20 to 25 degrees C (68 to 77 degrees F), which is controlled room temperature, so the water itself does not require refrigeration. Refrigeration guidance people encounter usually belongs to the peptide after it has been reconstituted, which is a separate vial with its own storage instructions.",
  },
];

/** Rows are stated as label-or-guidance facts, never as instructions. Cells
    stay terse on purpose: the paragraphs around the table carry the nuance,
    and long cells wrap to one word per line on a phone. */
const COMPARISON = [
  {
    row: "Preservative",
    bac: "0.9% benzyl alcohol",
    sterile: "None",
  },
  {
    row: "Vial type",
    bac: "Multi-dose",
    sterile: "Single-dose",
  },
  {
    row: "After first puncture",
    bac: "28 days (CDC)",
    sterile: "Not retained",
  },
  {
    row: "Neonates",
    bac: "Not for use",
    sterile: "The preservative-free option",
  },
];

export default function BacteriostaticWaterPage() {
  const appStoreUrl = buildAppStoreUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Article", "MedicalWebPage"],
        "@id": `${URL}#article`,
        headline: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        mainEntityOfPage: URL,
        dateModified: UPDATED,
        author: {
          "@type": "Organization",
          name: "REGEN Editorial",
          url: `${SITE_URL}/authors/advaith-akella`,
        },
        publisher: { "@type": "Organization", name: "REGEN", url: SITE_URL },
        citation: SOURCES.map((s) => ({
          "@type": "CreativeWork",
          name: s.title,
          url: s.url,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
          { "@type": "ListItem", position: 3, name: "Bacteriostatic water", item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <main className="tool-page">
          <Crumbs
            trail={[
              { label: "Tools", href: "/tools" },
              { label: "Bacteriostatic water" },
            ]}
          />
          <div className="section-head">
            <h1 className="section-title">
              Bacteriostatic water{" "}
              <span className="muted-phrase">for peptides.</span>
            </h1>
            <p className="section-lede">
              Sterile water with 0.9% benzyl alcohol added, which is what lets
              one vial be drawn from for 28&nbsp;days instead of once. What that
              means in practice, and where it differs from the sterile water
              sold beside it.
            </p>
          </div>

          <div className="tool-notes">
            <LibraryByline updated={UPDATED} minutes={5} references={SOURCES.length} />

            <MedicalDisclaimer />

            <h2 id="what-it-is">What bacteriostatic water is</h2>
            <p>
              Bacteriostatic Water for Injection, USP, is water for injection
              with <strong>0.9% (9&nbsp;mg/mL) benzyl alcohol</strong> added as
              a preservative. Most people searching for it write it as{" "}
              <strong>bac water</strong>, and the two are the same product.
            </p>
            <p>
              &quot;Bacteriostatic&quot; is a precise word: benzyl alcohol stops
              bacteria multiplying rather than killing them outright. That
              distinction is the entire product. It does not rescue a vial that
              has already been contaminated, and it does not sterilise anything.
              It keeps an already-sterile vial from spoiling between draws.
            </p>
            <p>
              This is why it turns up alongside lyophilised, or freeze-dried,
              peptide vials. A vial is rarely used all at once: a 10&nbsp;mg
              vial drawn at 250&nbsp;mcg holds around 40 draws, spread over
              weeks. Water without a preservative offers nothing across that
              window.
            </p>

            <h2 id="vs-sterile-water">
              Bacteriostatic water vs sterile water for injection
            </h2>
            <p>
              They are sold in near-identical vials and they are not
              interchangeable. The difference is the preservative, and every
              other difference follows from it.
            </p>
            <div className="tool-table-wrap">
              <table className="tool-table tool-table--prose">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Bacteriostatic water</th>
                    <th scope="col">Sterile water for injection</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((c) => (
                    <tr key={c.row}>
                      <th scope="row">{c.row}</th>
                      <td>{c.bac}</td>
                      <td>{c.sterile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              The neonate row is not a footnote. Benzyl alcohol has been
              associated with fatal toxicity in newborns, documented in 1982 as
              gasping syndrome, and the label carries an unqualified{" "}
              <strong>NOT FOR USE IN NEONATES</strong> as a result. Where water
              is required to prepare or dilute medication for that population,
              the label directs the preservative-free product instead.
            </p>

            <h2 id="how-long">How long it lasts once punctured</h2>
            <p>
              Two clocks run at the same time, and the one that expires first is
              the one that counts.
            </p>
            <div className="tool-table-wrap">
              <table className="tool-table tool-table--prose">
                <thead>
                  <tr>
                    <th scope="col">State of the vial</th>
                    <th scope="col">How long it holds</th>
                    <th scope="col">Where that comes from</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Sealed, never entered</th>
                    <td>The printed expiration date</td>
                    <td>Manufacturer label</td>
                  </tr>
                  <tr className="is-default">
                    <th scope="row">After the first puncture</th>
                    <td>
                      <strong>28&nbsp;days</strong>, or the printed expiration
                      date if sooner
                    </td>
                    <td>CDC injection-safety guidance</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The CDC wording is specific: once a multi-dose vial is opened, it
              &quot;should be dated and discarded within 28&nbsp;days unless the
              manufacturer states another date for that opened vial.&quot; The
              count starts at the <strong>first puncture of the stopper</strong>
              , not at the first dose drawn, which is why the guidance says to
              date the vial at that moment rather than trusting memory a month
              later.
            </p>

            <h2 id="storage">Storing it</h2>
            <p>
              The FDA label directs storage at{" "}
              <strong>20 to 25&nbsp;degrees&nbsp;C (68 to 77&nbsp;degrees F)</strong>
              , controlled room temperature. The water itself does not need a
              refrigerator, before or after it has been entered.
            </p>
            <p>
              This is the most common mix-up worth naming. Refrigeration advice
              in this space usually attaches to the{" "}
              <strong>peptide after it has been reconstituted</strong>, which is
              a different vial with its own storage instructions and its own
              shelf life. The water and the mixed compound are two separate
              questions; each compound&apos;s own{" "}
              <a href="/library">reference page</a> carries what published
              sources report for it.
            </p>

            <h2 id="handling">Handling facts from the label and CDC</h2>
            <p>
              Four things are stated by the regulators rather than inferred, so
              they are worth having in one place.
            </p>
            <ul>
              <li>
                It is <strong>prescription-only</strong> in the US. The label
                reads &quot;Rx only&quot; and the product is classified as a
                human prescription drug.
              </li>
              <li>
                It is <strong>not for use in neonates</strong>, for the benzyl
                alcohol reason above.
              </li>
              <li>
                CDC guidance is to <strong>assign a multi-dose vial to a single
                person</strong> wherever possible. A vial shared between people
                is an infection-control risk, not a convenience.
              </li>
              <li>
                Injectable products are <strong>inspected before use</strong>{" "}
                for particles and discolouration, and discarded rather than used
                if either is present.
              </li>
            </ul>

            <h2 id="how-much">How much water a vial takes</h2>
            <p>
              There is no single correct volume, and that surprises people. The
              water sets <strong>concentration</strong>, not the amount of
              compound: adding more does not dilute the dose, it spreads the
              same milligrams across a larger liquid volume, so the same dose is
              drawn to a higher number of units on the syringe.
            </p>
            <p>
              That is generally the more forgiving direction to be imprecise in,
              because a small error on a longer draw is proportionally smaller.
              The <a href="/tools">reconstitution calculator</a> converts any
              vial size, water volume, and target dose into syringe units, and
              the <a href="/tools#by-compound">per-compound calculators</a> open
              pre-filled with the vial size and water volume the REGEN catalog
              reports for that compound. Those figures are what published
              sources describe, not a recommendation from REGEN.
            </p>

            <div className="lib-faq">
              <h2 id="faq">Frequently asked questions</h2>
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>

            <Citations sources={SOURCES} />
          </div>
        </main>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
