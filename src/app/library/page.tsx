import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { JsonLd } from "../components/JsonLd";
import { ArrowR } from "../components/icons";
import {
  CATEGORIES,
  LIBRARY_ROBOTS,
  PEPTIDES,
  ALL_PEPTIDES_SORTED,
  notablePeptides,
  peptideSearchRows,
  peptidesInCategory,
} from "../lib/library";
import { BEST_FOR, COMPARISONS, learnReadMinutes } from "../lib/libraryLearn";
import { BLOG_POSTS } from "../lib/blogData";
import LibrarySearch from "./LibrarySearch";
import { CategoryChip } from "./CategoryIcon";
import { PeptideCard, Pill, SITE_URL } from "./parts";

const TITLE = "The Independent Peptide Encyclopedia";
const DESCRIPTION =
  "An evidence-graded peptide reference. Every compound carries a research grade, dosing from published protocols, and links to the primary literature.";

export const metadata: Metadata = {
  title: `${TITLE} | REGEN Library`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/library` },
  robots: LIBRARY_ROBOTS,
  openGraph: {
    type: "website",
    url: `${SITE_URL}/library`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function LibraryPage() {
  const appStoreUrl = buildAppStoreUrl();
  const notable = notablePeptides(24);
  const rows = peptideSearchRows();
  // Peptide Science: the explainer layer above the compound entries. The blog
  // already carries it, and until now the two hubs never linked to each other.
  const science = BLOG_POSTS.filter((b) => b.category === "Science").slice(0, 6);
  const sectionCount = PEPTIDES.reduce((n, p) => n + p.chapters.length, 0);
  const sourceCount = PEPTIDES.reduce((n, p) => n + p.sources.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/library#collection`,
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/library`,
        isPartOf: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Library", item: `${SITE_URL}/library` },
        ],
      },
      {
        // Every compound as an ItemList, so the encyclopedia reads as a
        // structured index even though the page itself now shows a curated
        // deck rather than all 54.
        "@type": "ItemList",
        name: "Peptide Encyclopedia",
        numberOfItems: PEPTIDES.length,
        itemListElement: ALL_PEPTIDES_SORTED.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/library/${p.category}/${p.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />

        <header className="lib-hero">
          <div className="lib-hero-inner">
            {/* Second line carries the accent gradient, same treatment as the
                landing hero's "Peptide Care App." line. */}
            <h1>
              The Independent
              <br />
              <span className="accent-phrase">Peptide Encyclopedia.</span>
            </h1>
            <p className="lib-hero-sub">
              An evidence-graded peptide reference. Every compound carries a research grade,
              dosing drawn from published protocols, and links to the primary literature.
            </p>
            <LibrarySearch rows={rows} />
            <p className="lib-hero-meta">
              {PEPTIDES.length} compounds · {sectionCount} reference sections · {sourceCount}{" "}
              cited sources
            </p>
          </div>
        </header>

        <div className="lib-page">
          {/* Section order follows the reference encyclopedias: the compounds
              someone came for, then the explainer layer, then the two guide
              families, and browse-by-category last as the catch-all for a
              reader who did not find their way in above. */}

          {/* ---- Notable peptides ------------------------------------- */}
          <section className="lib-section" id="notable">
            <div className="lib-section-head">
              <h2>Notable Peptides</h2>
              <a className="lib-section-link" href="/library/all-peptides">
                All {PEPTIDES.length} compounds <ArrowR size={13} />
              </a>
            </div>
            <div className="lib-grid lib-grid--3">
              {notable.map((p) => (
                <PeptideCard key={p.slug} p={p} />
              ))}
            </div>
          </section>

          {/* ---- Peptide science -------------------------------------- */}
          {science.length > 0 && (
            <section className="lib-section" id="science">
              <div className="lib-section-head">
                <h2>Peptide Science</h2>
                <a className="lib-section-link" href="/blog">
                  All articles <ArrowR size={13} />
                </a>
              </div>
              <div className="lib-grid lib-grid--3">
                {science.map((post) => (
                  <a className="lib-card" key={post.slug} href={post.href}>
                    <div className="lib-card-top">
                      <h3>{post.title}</h3>
                    </div>
                    <p>{post.excerpt}</p>
                    <div className="lib-card-chips lib-card-chips--foot">
                      <Pill>{post.readTime}</Pill>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ---- Best peptides for ------------------------------------ */}
          <section className="lib-section" id="best-for">
            <div className="lib-section-head">
              <h2>Best Peptides For...</h2>
              <a className="lib-section-link" href="/library/learn">
                All guides <ArrowR size={13} />
              </a>
            </div>
            <div className="lib-grid lib-grid--3">
              {BEST_FOR.map((a) => (
                <a className="lib-card" key={a.slug} href={`/library/learn/${a.slug}`}>
                  <div className="lib-card-top">
                    <h3>{a.cardTitle}</h3>
                  </div>
                  <p>{a.description}</p>
                  <div className="lib-card-chips lib-card-chips--foot">
                    <Pill>{learnReadMinutes(a)} Min Read</Pill>
                    {a.popular && <Pill>Popular</Pill>}
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ---- Comparisons ------------------------------------------ */}
          <section className="lib-section" id="comparisons">
            <div className="lib-section-head">
              <h2>Peptide Comparisons</h2>
              <a className="lib-section-link" href="/library/learn">
                All guides <ArrowR size={13} />
              </a>
            </div>
            <div className="lib-grid lib-grid--3">
              {COMPARISONS.map((a) => (
                <a className="lib-card" key={a.slug} href={`/library/learn/${a.slug}`}>
                  <div className="lib-card-top">
                    <h3>{a.cardTitle}</h3>
                  </div>
                  <p>{a.description}</p>
                  <div className="lib-card-chips lib-card-chips--foot">
                    <Pill>{learnReadMinutes(a)} Min Read</Pill>
                    {a.popular && <Pill>Popular</Pill>}
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ---- Browse by category ----------------------------------- */}
          <section className="lib-section" id="categories">
            <div className="lib-section-head">
              <h2>Browse by Category</h2>
              <a className="lib-section-link" href="/library/how-we-grade">
                How we grade evidence <ArrowR size={13} />
              </a>
            </div>
            <div className="lib-grid lib-grid--3">
              {CATEGORIES.map((c) => (
                <a
                  className={`lib-card lib-card--cat lib-card--${c.ramp}`}
                  key={c.slug}
                  href={`/library/${c.slug}`}
                >
                  <div className="lib-card-top">
                    <CategoryChip name={c.icon} size="lg" />
                    <h3>{c.label}</h3>
                  </div>
                  <p>{c.blurb}</p>
                  <div className="lib-card-foot">
                    <span>{peptidesInCategory(c.slug).length} compounds</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
