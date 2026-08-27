import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { MedicalDisclaimer } from "../../components/Disclaimer";
import {
  ALL_PEPTIDES_SORTED,
  LIBRARY_ROBOTS,
  PEPTIDES,
  hrefFor,
  tierSpread,
  type Tier,
  peptideSearchRows
} from "../../lib/library";
import LibrarySearch from "../LibrarySearch";
import Contents from "../Contents";
import { Crumbs, LibraryByline, TierBadge, SITE_URL } from "../parts";

const TITLE = "How REGEN Grades Peptide Evidence";
const DESCRIPTION =
  "The S to F research grade behind every compound in the REGEN library: what each tier requires, what it deliberately ignores, and why a popular compound can grade low.";

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Library`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/library/how-we-grade` },
  robots: LIBRARY_ROBOTS,
  openGraph: {
    type: "article",
    url: `${SITE_URL}/library/how-we-grade`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * The tier definitions.
 *
 * These describe study design, not effect size. That distinction is the whole
 * method: a compound with a large reported effect and no controlled trial
 * grades below one with a modest effect measured properly.
 */
const TIERS: { tier: Tier; name: string; requires: string; note: string }[] = [
  {
    tier: "S",
    name: "Regulatory approval",
    requires:
      "Approved by the FDA or an equivalent regulator for a named indication, on the strength of phase 3 trials.",
    note: "Approval is a statement about a specific indication at a specific dose. It does not transfer to off-label use of the same molecule.",
  },
  {
    tier: "A",
    name: "Randomised human trials",
    requires:
      "Multiple randomised, controlled human trials with consistent results, but no approval for the use described here.",
    note: "This is the strongest grade an unapproved compound can reach, and very few do.",
  },
  {
    tier: "B",
    name: "Controlled human data",
    requires:
      "At least one randomised or well-controlled human trial, or a body of consistent controlled work in a related indication.",
    note: "Enough to say an effect has been measured in people, not enough to say how reliably it reproduces.",
  },
  {
    tier: "C",
    name: "Uncontrolled human data",
    requires:
      "Small human pilots, open-label series, or case reports, usually alongside a substantial animal literature.",
    note: "Where most of the popular research peptides sit. A C is not a verdict that the compound fails, it is a statement that the trial to answer the question has not been run.",
  },
  {
    tier: "D",
    name: "Preclinical only",
    requires: "Animal or in-vitro work only, with no human data of any design.",
    note: "Mechanism can be well characterised at this grade. Dose translation from a rodent model is the part that does not carry over.",
  },
  {
    tier: "F",
    name: "No usable evidence",
    requires:
      "No published study of the compound in any model, or evidence that has been retracted or withdrawn.",
    note: "Includes compounds whose headline result was later retracted, which is worse than never having been studied.",
  },
];

export default function HowWeGradePage() {
  const appStoreUrl = buildAppStoreUrl();
  const spread = tierSpread(ALL_PEPTIDES_SORTED);
  const url = `${SITE_URL}/library/how-we-grade`;

  // Named examples make the tiers checkable. Pulled from the catalog rather
  // than hard-coded, so a regrade can never leave this page asserting
  // something the library no longer says.
  const exampleFor = (tier: Tier) =>
    ALL_PEPTIDES_SORTED.filter((p) => p.researchTier === tier).slice(0, 3);

  const faq = [
    {
      q: "Does a low grade mean a peptide does not work?",
      a: "No. The grade describes the quality of the evidence, not the size of the effect. A compound graded D may well do what people report; it means no human trial has been run to check. Popularity, anecdote, and mechanism plausibility do not move a grade.",
    },
    {
      q: "Why is an FDA-approved drug graded higher than a well-studied research peptide?",
      a: "Approval requires phase 3 trials powered for a defined endpoint, plus a regulator reviewing the full dataset including the failures. No amount of preclinical work substitutes for that, so approval is its own tier.",
    },
    {
      q: "Do you grade a compound differently for different uses?",
      a: "The headline grade reflects the strongest evidence for the use the compound is best known for. Where the evidence differs by claim, the evidence table on each compound page grades each claim separately.",
    },
    {
      q: "Who writes and reviews these grades?",
      a: "Grades are assigned by REGEN editorial from the published literature and re-checked when new trials appear. Every grade on a compound page links back to the sources it rests on, so the reasoning is auditable rather than asserted.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Article", "WebPage"],
        "@id": `${url}#article`,
        headline: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        mainEntityOfPage: url,
        author: {
          "@type": "Organization",
          name: "REGEN Editorial",
          url: `${SITE_URL}/authors/advaith-akella`,
        },
        publisher: { "@type": "Organization", name: "REGEN", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Library", item: `${SITE_URL}/library` },
          { "@type": "ListItem", position: 3, name: "How we grade", item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
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
      <NavBar
        appStoreUrl={appStoreUrl}
        sectionBase="/"
        slot={<LibrarySearch rows={peptideSearchRows()} variant="nav" />}
      />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        {/* The reference-page shell without a ramp: the methodology page is
            about every category at once, so its accents stay ink and the
            contents rail's selected state keeps the base glass treatment. */}
        <article className="legal-page legal-page--wide">
          <div className="legal-head legal-head--ref">
            <Crumbs
              trail={[
                { label: "Home", href: "/" },
                { label: "Library", href: "/library" },
                { label: "How we grade" },
              ]}
            />
            <div className="lib-ref-head">
              <div className="lib-ref-eyebrow">
                <span>Methodology</span>
              </div>
              <h1>{TITLE}</h1>
              <p className="post-lead">
                Every compound in this library carries one letter. This is what the letter means,
                and what it deliberately refuses to take into account.
              </p>
            </div>
            <LibraryByline updated={null} />
            <div className="lib-spread">
              {spread.map((r) => (
                <span className={`lib-spread--${r.tier.toLowerCase()}`} key={r.tier}>
                  <strong>{r.tier}</strong> {r.count}
                </span>
              ))}
            </div>
          </div>

          <div className="legal-body">
            <MedicalDisclaimer />
            <Contents
              items={[
                { id: "principle", label: "The principle" },
                { id: "tiers", label: "The six tiers" },
                { id: "what-we-ignore", label: "What a grade ignores" },
                { id: "regrade", label: "When a grade changes" },
                { id: "faq", label: "FAQ" },
              ]}
            />

            <div className="legal-content">
              <h2 id="principle">The principle</h2>
              <p>
                A grade here answers one question: how well has this been measured in humans? It
                does not answer whether the compound is effective, whether it is safe, or whether
                it is worth taking. Those are different questions, and conflating them is how
                reference sites end up ranking a rodent study alongside a phase 3 trial.
              </p>
              <p>
                The result is that the grades often disagree with the popular ranking. BPC-157 is
                one of the most searched compounds in this field and grades a{" "}
                <TierBadge tier="C" /> because no completed randomised human trial exists for it.
                That is not a criticism of the compound. It is a description of the literature.
              </p>

              <h2 id="tiers">The six tiers</h2>
              <div className="lib-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Grade</th>
                      <th scope="col">What it requires</th>
                      <th scope="col">In this library</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIERS.map((t) => {
                      const examples = exampleFor(t.tier);
                      return (
                        <tr key={t.tier}>
                          <th scope="row">
                            <TierBadge tier={t.tier} />
                            <div className="lib-tier-name">{t.name}</div>
                          </th>
                          <td>
                            {t.requires}
                            <div className="lib-tier-note">{t.note}</div>
                          </td>
                          <td>
                            {examples.length ? (
                              examples.map((p, i) => (
                                <span key={p.slug}>
                                  {i > 0 && ", "}
                                  <a href={hrefFor(p)}>{p.name}</a>
                                </span>
                              ))
                            ) : (
                              <span>none</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <h2 id="what-we-ignore">What a grade ignores</h2>
              <ul>
                <li>
                  <strong>Anecdote and community consensus.</strong> Both are useful signals about
                  what to study. Neither is evidence of an effect.
                </li>
                <li>
                  <strong>Mechanism plausibility.</strong> A convincing pathway is a reason to run
                  a trial, not a substitute for one.
                </li>
                <li>
                  <strong>Vendor claims and marketing copy.</strong> This library carries no
                  affiliate offers and links to no sellers, which is why the grades can say what
                  they say.
                </li>
                <li>
                  <strong>Search volume.</strong> The most searched compounds in this field are
                  frequently the least evidenced, and the ordering on our category pages puts
                  grade ahead of popularity for exactly that reason.
                </li>
              </ul>

              <h2 id="regrade">When a grade changes</h2>
              <p>
                Grades move when the literature moves: a trial reads out, a compound is approved,
                a result is retracted. They do not move because a compound became popular. The{" "}
                <a href="/library">library</a> currently covers {PEPTIDES.length} compounds across{" "}
                {PEPTIDES.reduce((n, p) => n + p.sources.length, 0)} cited sources, and each
                compound page shows the date it was last reviewed alongside the sources it rests
                on.
              </p>

              <div className="lib-faq">
                <h2 id="faq">Frequently asked questions</h2>
                {faq.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </article>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
