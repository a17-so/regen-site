import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../../../lib/appStoreUrl";
import NavBar from "../../../../components/NavBar";
import PageClose from "../../../../components/PageClose";
import { JsonLd } from "../../../../components/JsonLd";
import { MedicalDisclaimer } from "../../../../components/Disclaimer";
import {
  CHAPTERS,
  LIBRARY_ROBOTS,
  PEPTIDES,
  categoryBySlug,
  chapterBySlug,
  chapterFor,
  chapterHref,
  hrefFor,
  peptideBySlug,
  rampFor,
  relatedPeptides,
  type ChapterMeta,
  type Peptide,
  peptideSearchRows,
} from "../../../../lib/library";
import LibrarySearch from "../../../LibrarySearch";
import {
  ChapterPills,
  Citations,
  Crumbs,
  LibraryByline,
  RelatedRail,
  Prose,
  RichText,
  SITE_URL,
  TrialList,
} from "../../../parts";

/** One route per chapter that the compound actually carries. */
export function generateStaticParams() {
  return PEPTIDES.flatMap((p) =>
    CHAPTERS.filter((c) => p.chapters.some((ch) => ch.key === c.key)).map((c) => ({
      category: p.category,
      peptide: p.slug,
      chapter: c.slug,
    }))
  );
}

function resolve(category: string, peptide: string, chapter: string) {
  const p = peptideBySlug(peptide);
  if (!p || p.category !== category) return undefined;
  const meta = chapterBySlug(chapter);
  if (!meta) return undefined;
  const ch = chapterFor(p, meta);
  if (!ch) return undefined;
  return { p, meta, ch };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; peptide: string; chapter: string }>;
}): Promise<Metadata> {
  const { category, peptide, chapter } = await params;
  const hit = resolve(category, peptide, chapter);
  if (!hit) return {};
  const { p, meta } = hit;
  const url = `${SITE_URL}${chapterHref(p, meta)}`;
  const title = `${p.name} ${meta.titleSuffix}`;
  const description = meta.descriptionStem.replace(/\{name\}/g, p.name);
  return {
    title: `${title} | REGEN Library`,
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
      ...(p.updatedAt ? { modifiedTime: p.updatedAt } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ category: string; peptide: string; chapter: string }>;
}) {
  const { category, peptide, chapter } = await params;
  const hit = resolve(category, peptide, chapter);
  if (!hit) notFound();
  const { p, meta, ch } = hit;

  const appStoreUrl = buildAppStoreUrl();
  const cat = categoryBySlug(p.category)!;
  const url = `${SITE_URL}${chapterHref(p, meta)}`;
  const title = `${p.name} ${meta.titleSuffix}`;
  const description = meta.descriptionStem.replace(/\{name\}/g, p.name);

  // Only the citations this chapter's subject actually needs. Research and
  // pharmacokinetics carry the full list; the rest get a trimmed set, so 54
  // pages do not all repeat 17 identical references.
  const sources = meta.key === "research" || meta.key === "pharmacokinetics"
    ? p.sources
    : p.sources.slice(0, 6);

  const graph: object[] = [
    {
      "@type": ["MedicalWebPage", "Article"],
      "@id": `${url}#article`,
      headline: title,
      description,
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
      isPartOf: { "@id": `${SITE_URL}${hrefFor(p)}#article` },
      citation: sources.slice(0, 12).map((s) => ({
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
        { "@type": "ListItem", position: 4, name: p.name, item: `${SITE_URL}${hrefFor(p)}` },
        { "@type": "ListItem", position: 5, name: meta.label, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
      <NavBar
        appStoreUrl={appStoreUrl}
        sectionBase="/"
        slot={<LibrarySearch rows={peptideSearchRows()} variant="nav" />}
      />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <article className={`legal-page legal-page--wide lib-ref lib-ref--${rampFor(p)}`}>
          <div className="legal-head">
            <Crumbs
              trail={[
                { label: "Home", href: "/" },
                { label: "Library", href: "/library" },
                { label: cat.label, href: `/library/${cat.slug}` },
                { label: p.name, href: hrefFor(p) },
                { label: meta.label },
              ]}
            />
            <h1>{title}</h1>
            <p className="post-lead">{description}</p>
            <LibraryByline updated={p.updatedAt} />
          </div>

          <div className="legal-body">
            <aside className="legal-toc">
              <a href={hrefFor(p)}>← {p.name} overview</a>
              {ch.sections.map((s, i) => (
                <a key={i} href={`#s${i}`}>
                  {s.subheader}
                </a>
              ))}
              {meta.key === "research" && p.trials.length > 0 && <a href="#trials">Trials</a>}
              {sources.length > 0 && <a href="#references">References</a>}
            </aside>

            <div className="legal-content">
              <MedicalDisclaimer />
              <ChapterPills p={p} active={meta.slug} />

              {ch.sections.map((s, i) => (
                <section key={i} className="lib-sec">
                  <h2 id={`s${i}`}>{s.subheader}</h2>
                  <Prose text={s.body} />
                </section>
              ))}

              <ChapterExtras p={p} meta={meta} />

              {meta.key === "research" && <TrialList p={p} />}

              <Citations sources={sources} />

              <div className="lib-nextprev">
                <a href={hrefFor(p)}>All {p.name} sections</a>
              </div>

              <RelatedRail items={relatedPeptides(p, 3)} heading="Related compounds" />
            </div>
          </div>
        </article>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}

/**
 * Structured data a given chapter should carry beyond its prose: the dosage
 * page gets the dose card and reconstitution maths, side effects gets
 * contraindications, pharmacokinetics gets the PK facts. Keeps each chapter
 * page substantive rather than a single lifted paragraph.
 */
function ChapterExtras({ p, meta }: { p: Peptide; meta: ChapterMeta }) {
  if (meta.key === "dosing") {
    return (
      <>
        <h2 id="dose-card">Reported protocol doses</h2>
        <div className="lib-dose-grid">
          <div>
            <span>Standard dose</span>
            <strong>{p.doseCard?.primary ?? "—"}</strong>
          </div>
          <div>
            <span>Frequency</span>
            <strong>{p.doseCard?.frequency ?? "—"}</strong>
          </div>
          <div>
            <span>Routes</span>
            <strong>{p.route.length ? p.route.join(", ") : "—"}</strong>
          </div>
        </div>
        {p.reconstitution && (
          <>
            <h2 id="reconstitution">Reconstitution</h2>
            <p>
              {p.reconstitution.vialMg && p.reconstitution.recommendedBacMl ? (
                <>
                  A {p.reconstitution.vialMg}mg vial with {p.reconstitution.recommendedBacMl}mL of
                  bacteriostatic water is the pairing reported most often.{" "}
                </>
              ) : null}
              {p.reconstitution.notes && <RichText text={p.reconstitution.notes} />}
            </p>
            <p>
              <a href="/tools">Work out your own concentration with the reconstitution calculator</a>.
            </p>
          </>
        )}
        <p className="lib-dose-note">
          Doses shown are those reported in published research, not a recommendation.
        </p>
      </>
    );
  }

  if (meta.key === "side-effects" && p.contraindications.length) {
    return (
      <>
        <h2 id="contraindications">Contraindications</h2>
        <ul>
          {p.contraindications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </>
    );
  }

  if (meta.key === "pharmacokinetics") {
    const pk = p.quickFacts.filter((f) =>
      /half-life|solubility|storage|molecular|sequence|cas/i.test(f.key)
    );
    if (!pk.length) return null;
    return (
      <>
        <h2 id="pk-facts">Physicochemical and PK profile</h2>
        <dl className="lib-facts-dl">
          {pk.map((f) => (
            <div key={f.key}>
              <dt>{f.key}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </>
    );
  }

  if (meta.key === "paired-stacks" && p.commonStacks.length) {
    const stacks = p.commonStacks.map(peptideBySlug).filter(Boolean);
    if (!stacks.length) return null;
    return (
      <>
        <h2 id="paired-with">Commonly paired with</h2>
        <ul>
          {stacks.map((s) => (
            <li key={s!.slug}>
              <a href={hrefFor(s!)}>{s!.name}</a> — {s!.subtitle}
            </li>
          ))}
        </ul>
      </>
    );
  }

  return null;
}
