import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../../lib/appStoreUrl";
import NavBar from "../../../components/NavBar";
import PageClose from "../../../components/PageClose";
import { JsonLd } from "../../../components/JsonLd";
import { MedicalDisclaimer } from "../../../components/Disclaimer";
import {
  CHAPTERS,
  LIBRARY_ROBOTS,
  PEPTIDES,
  categoryBySlug,
  chapterFor,
  chapterHref,
  hrefFor,
  peptideBySlug,
  relatedPeptides,
} from "../../../lib/library";
import { headlineFor } from "../../../lib/libraryHeadlines";
import {
  ChapterPills,
  Citations,
  Crumbs,
  EvidenceTable,
  KeyTakeaways,
  LibraryByline,
  QuickFacts,
  RelatedRail,
  RichText,
  SITE_URL,
  TrialList,
} from "../../parts";

export function generateStaticParams() {
  return PEPTIDES.map((p) => ({ category: p.category, peptide: p.slug }));
}

/** Resolve, and reject a peptide reached under the wrong category segment so
    each compound has exactly one canonical URL. */
function resolve(category: string, slug: string) {
  const p = peptideBySlug(slug);
  if (!p || p.category !== category) return undefined;
  return p;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; peptide: string }>;
}): Promise<Metadata> {
  const { category, peptide } = await params;
  const p = resolve(category, peptide);
  if (!p) return {};
  const url = `${SITE_URL}${hrefFor(p)}`;
  const title = headlineFor(p.slug, p.name);
  const description = `${p.subtitle} Research grade ${p.researchTier ?? "unrated"}, with dosing protocols, side effects, and links to the primary literature.`;
  return {
    // The SERP title carries the descriptive headline, not the bare compound
    // name: the name alone repeats the URL and wins no long-tail phrasing.
    // Brand suffix kept short so the headline survives truncation.
    title: `${title} | REGEN`,
    description,
    keywords: p.topics,
    alternates: { canonical: url },
    robots: LIBRARY_ROBOTS,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      section: categoryBySlug(p.category)?.label,
      tags: p.topics,
      ...(p.publishedAt ? { publishedTime: p.publishedAt } : {}),
      ...(p.updatedAt ? { modifiedTime: p.updatedAt } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PeptidePage({
  params,
}: {
  params: Promise<{ category: string; peptide: string }>;
}) {
  const { category, peptide } = await params;
  const p = resolve(category, peptide);
  if (!p) notFound();

  const appStoreUrl = buildAppStoreUrl();
  const cat = categoryBySlug(p.category)!;
  const url = `${SITE_URL}${hrefFor(p)}`;
  const available = CHAPTERS.filter((c) => p.chapters.some((ch) => ch.key === c.key));
  const related = relatedPeptides(p, 3);

  // Takeaways come from the catalog's own evidence summary, so the card can
  // never drift from the grade shown beside it.
  const takeaways = [
    `**${p.name}** ${p.subtitle.replace(/^A /, "is a ").replace(/^An /, "is an ")}`,
    ...p.evidenceSummary.slice(0, 3),
  ];

  const faq = buildFaq(p);

  const graph: object[] = [
    {
      "@type": ["MedicalWebPage", "Article"],
      "@id": `${url}#article`,
      headline: headlineFor(p.slug, p.name),
      description: p.subtitle,
      about: { "@type": "Drug", name: p.name },
      medicalSpecialty: "Pharmacology",
      inLanguage: "en",
      ...(p.publishedAt ? { datePublished: p.publishedAt } : {}),
      ...(p.updatedAt ? { dateModified: p.updatedAt } : {}),
      author: {
        "@type": "Organization",
        name: "REGEN Editorial",
        url: `${SITE_URL}/authors/advaith-akella`,
      },
      publisher: {
        "@type": "Organization",
        name: "REGEN",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/og.png` },
      },
      mainEntityOfPage: url,
      citation: p.sources.slice(0, 12).map((s) => ({
        "@type": "CreativeWork",
        name: s.title,
        url: s.url,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Library", item: `${SITE_URL}/library` },
        { "@type": "ListItem", position: 3, name: cat.label, item: `${SITE_URL}/library/${cat.slug}` },
        { "@type": "ListItem", position: 4, name: p.name, item: url },
      ],
    },
  ];
  if (faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <article className="legal-page">
          <div className="legal-head">
            <Crumbs
              trail={[
                { label: "Home", href: "/" },
                { label: "Library", href: "/library" },
                { label: cat.label, href: `/library/${cat.slug}` },
                { label: p.name },
              ]}
            />
            <h1>{headlineFor(p.slug, p.name)}</h1>
            <p className="post-lead">{p.subtitle}</p>
            <LibraryByline updated={p.updatedAt} />
            <div className="post-meta-row">
              <span>{p.readMinutes} min read</span>
              <span className="dot"></span>
              <span>{p.sources.length} references</span>
            </div>
          </div>

          <div className="legal-body">
            <aside className="legal-toc">
              <a href="#overview">Overview</a>
              <a href="#quick-facts">Quick facts</a>
              {p.doseCard && <a href="#dosing">Dosing at a glance</a>}
              <a href="#evidence">Evidence</a>
              {available.map((c) => (
                <a key={c.slug} href={`#${c.slug}`}>
                  {c.label}
                </a>
              ))}
              {p.trials.length > 0 && <a href="#trials">Trials</a>}
              {faq.length > 0 && <a href="#faq">FAQ</a>}
              {p.sources.length > 0 && <a href="#references">References</a>}
            </aside>

            <div className="legal-content">
              <MedicalDisclaimer />
              <KeyTakeaways items={takeaways} />
              <ChapterPills p={p} />

              <h2 id="overview">What is {p.name}?</h2>
              <p>
                <RichText text={p.description} />
              </p>

              <QuickFacts p={p} />

              {p.doseCard && (
                <div className="lib-dose">
                  <h2 id="dosing">Dosing at a glance</h2>
                  <div className="lib-dose-grid">
                    <div>
                      <span>Standard dose</span>
                      <strong>{p.doseCard.primary ?? "—"}</strong>
                    </div>
                    <div>
                      <span>Frequency</span>
                      <strong>{p.doseCard.frequency ?? "—"}</strong>
                    </div>
                    <div>
                      <span>Half-life</span>
                      <strong>{p.halfLife ?? "—"}</strong>
                    </div>
                    <div>
                      <span>Routes</span>
                      <strong>{p.route.length ? p.route.join(", ") : "—"}</strong>
                    </div>
                  </div>
                  {p.reconstitution?.notes && (
                    <p className="lib-dose-note">
                      <RichText text={p.reconstitution.notes} />{" "}
                      <a href="/tools">Run the numbers in the reconstitution calculator</a>.
                    </p>
                  )}
                  <p className="lib-dose-note">
                    Doses shown are those reported in published research, not a recommendation.
                  </p>
                </div>
              )}

              <EvidenceTable p={p} />

              {/* The full reference reads on one page, top to bottom. Each
                  chapter also keeps its own URL for the long-tail query, and
                  links out to it from its heading. */}
              {available.map((c) => {
                const ch = chapterFor(p, c);
                if (!ch) return null;
                return (
                  <section key={c.slug} className="lib-chapter-block">
                    <h2 id={c.slug}>
                      {p.name} {c.titleSuffix}
                    </h2>
                    {ch.sections.map((sec, i) => (
                      <div key={i}>
                        <h3>{sec.subheader}</h3>
                        {sec.caption && <p className="lib-section-caption">{sec.caption}</p>}
                        <p>
                          <RichText text={sec.body} />
                        </p>
                      </div>
                    ))}
                    <p className="lib-chapter-more">
                      <a href={chapterHref(p, c)}>
                        More on {p.name} {c.label.toLowerCase()}
                      </a>
                    </p>
                  </section>
                );
              })}

              {p.contraindications.length > 0 && (
                <>
                  <h2 id="contraindications">Contraindications</h2>
                  <ul>
                    {p.contraindications.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </>
              )}

              <TrialList p={p} />

              {faq.length > 0 && (
                <div className="lib-faq">
                  <h2 id="faq">Frequently asked questions</h2>
                  {faq.map((f) => (
                    <details key={f.q}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              )}

              <Citations sources={p.sources} />
              <RelatedRail items={related} heading="Related compounds" />
            </div>
          </div>
        </article>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}

/**
 * FAQ entries composed from catalog fields. Only questions the data can
 * actually answer are emitted, an FAQPage block with a fabricated answer is
 * worse than no block at all.
 */
function buildFaq(p: ReturnType<typeof peptideBySlug> & object) {
  const out: { q: string; a: string }[] = [];
  if (p.doseCard?.primary) {
    out.push({
      q: `What is a typical ${p.name} dose?`,
      a: `Published research protocols report ${p.doseCard.primary}${
        p.doseCard.frequency ? `, ${p.doseCard.frequency}` : ""
      }. This is the range described in the literature, not a recommendation.`,
    });
  }
  if (p.halfLife) {
    out.push({ q: `What is the half-life of ${p.name}?`, a: `${p.halfLife}.` });
  }
  if (p.researchTier) {
    out.push({
      q: `Is ${p.name} backed by strong evidence?`,
      a: `${p.name} carries a REGEN research grade of ${p.researchTier}. ${
        p.evidenceSummary[0] ?? ""
      }`.trim(),
    });
  }
  if (p.route.length) {
    out.push({
      q: `How is ${p.name} administered?`,
      a: `Routes reported in the literature: ${p.route.join(", ")}.`,
    });
  }
  if (p.contraindications.length) {
    out.push({
      q: `Who should avoid ${p.name}?`,
      a: `Contraindications noted in the literature include ${p.contraindications.join(", ")}.`,
    });
  }
  return out;
}
