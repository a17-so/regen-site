import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { LIBRARY_ROBOTS } from "../../lib/library";
import { compoundBySlug, shopHref } from "../../lib/shop";
import {
  CATEGORIES,
  GUIDE_INDEX,
  briefBySlug,
  type Guide,
  type CategorySlug,
  categoryBySlug,
  categoryHref,
  catalogSlugFor,
  guideBySlug,
  guideHref,
  guideSearchRows,
  hubRows,
  indexRow,
  relatedGuides,
  renderableSources,
  rowsInCategory,
} from "../../lib/guides";
import { Crumbs, SITE_URL } from "../parts";
import LibrarySearch from "../LibrarySearch";
import LibraryHub from "../LibraryHub";
import LibraryCard from "../LibraryCard";
import GuideTabs from "../GuideTabs";
import TickRail from "../TickRail";
import { statusLabel as statusLabelFor } from "../../lib/guideVocab";
import { Blocks, Byline, CitationList, EvidenceBox, GlanceTable, IdentityCard, KeyTakeaway, SourcesNote, StatusBox } from "../GuideParts";

/**
 * One route, two pages: `/library/<category>` (the eight body systems) and
 * `/library/<compound>` (a guide). No compound shares a slug with a
 * category, and flat guide URLs survive a compound changing category.
 */
export function generateStaticParams() {
  return [...CATEGORIES.map((c) => ({ slug: c.slug })), ...GUIDE_INDEX.map((r) => ({ slug: r.slug }))];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (cat) {
    const n = rowsInCategory(cat.slug).length;
    const title = `${cat.label} peptides`;
    const description = `${n} peptides for ${cat.label.toLowerCase()}: ${cat.blurb} What each one is, its FDA status, and what the research shows.`;
    return {
      title: `${title} | REGEN Peptide Library`,
      description,
      alternates: { canonical: `${SITE_URL}${categoryHref(cat.slug)}` },
      robots: LIBRARY_ROBOTS,
      openGraph: { type: "website", url: `${SITE_URL}${categoryHref(cat.slug)}`, title, description },
    };
  }
  const g = guideBySlug(slug);
  if (!g) {
    const b = briefBySlug(slug);
    return b ? { title: `${b.name} | REGEN Peptide Library`, robots: { index: false, follow: true } } : {};
  }
  const title = `${g.name}: What the Research Shows and Its FDA Status`;
  return {
    title: `${title} | REGEN`,
    description: g.summary,
    alternates: { canonical: `${SITE_URL}${guideHref(g.slug)}` },
    robots: LIBRARY_ROBOTS,
    openGraph: { type: "article", url: `${SITE_URL}${guideHref(g.slug)}`, title, description: g.summary },
    twitter: { card: "summary_large_image", title, description: g.summary },
  };
}

export default async function LibraryEntry({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const appStoreUrl = buildAppStoreUrl();
  const search = <LibrarySearch rows={guideSearchRows()} variant="nav" />;
  const cat = categoryBySlug(slug);

  if (cat) {
    const members = rowsInCategory(cat.slug);
    return (
      <>
        <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={search} />
        <main className="app animate-fade-in lib-shell">
          <LibraryHub rows={hubRows()} only={cat.slug as CategorySlug} title={cat.label} lead={categoryLead(members, cat.blurb)} />
          <PageClose appStoreUrl={appStoreUrl} />
        </main>
      </>
    );
  }

  const g = guideBySlug(slug);
  if (!g) {
    const b = briefBySlug(slug);
    if (!b) notFound();
    return <BriefPage b={b} appStoreUrl={appStoreUrl} search={search} />;
  }
  const category = categoryBySlug(g.category)!;
  const sources = renderableSources(g);
  const shop = compoundBySlug(catalogSlugFor(g) ?? g.slug) ?? compoundBySlug(g.slug);
  const sections = guideSections(g);
  const glance = glanceRows(g.atGlance);
  const more = moreFor(g);

  const sectionIds = ["at-a-glance", ...sections.map((s) => s.id), "evidence"];
  const sectionLabels = ["At a glance", ...sections.map((s) => s.heading), "Evidence strength"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${SITE_URL}${guideHref(g.slug)}#page`,
        name: g.name,
        headline: `${g.name}: what the research shows and its FDA status`,
        description: g.summary,
        url: `${SITE_URL}${guideHref(g.slug)}`,
        datePublished: g.published,
        dateModified: g.updated,
        author: { "@type": "Organization", name: "REGEN Research" },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: { "@type": "Drug", name: g.name, alternateName: g.alsoCalled, description: g.class },
        citation: sources.map((s) => s.url ?? (s.doi ? `https://doi.org/${s.doi}` : s.title)),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Peptide Library", item: `${SITE_URL}/library` },
          { "@type": "ListItem", position: 2, name: category.label, item: `${SITE_URL}${categoryHref(category.slug)}` },
          { "@type": "ListItem", position: 3, name: g.name, item: `${SITE_URL}${guideHref(g.slug)}` },
        ],
      },
    ],
  };

  const guideView = (
    <div className="gd-article">
      <KeyTakeaway guide={g} />
      <Byline guide={g} sourceCount={sources.length} />

      <section id="at-a-glance" className="gd-section">
        <h2>At a glance</h2>
        <GlanceTable rows={glance} />
      </section>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="gd-section">
          <h2>{s.heading}</h2>
          <Blocks blocks={s.blocks} guide={g} />
          {s.id === "fda-approved" && <StatusBox rows={g.statusBox} />}
        </section>
      ))}

      <div id="evidence" className="gd-section">
        <EvidenceBox guide={g} />
      </div>

      {more.length > 0 && (
        <section className="gd-more" aria-labelledby="more-h">
          <h2 id="more-h">More for {category.label.toLowerCase()}</h2>
          <div className="lh-cards">
            {more.map((r) => (
              <LibraryCard key={r.slug} slug={r.slug} name={r.name} status={r.status} category={g.category} href={guideHref(r.slug)} className={r.className} />
            ))}
          </div>
        </section>
      )}

      <SourcesNote guide={g} />
    </div>
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={search} />
      <main className="app animate-fade-in lib-shell lib-shell--guide">
        <TickRail ids={sectionIds} labels={sectionLabels} />
        <div className="gp">
          <div className="gp-side">
            <IdentityCard guide={g} shopHref={shop ? shopHref(shop.slug) : undefined} />
          </div>
          <div className="gp-main">
            <Crumbs
              trail={[
                { label: "Peptide Library", href: "/library" },
                { label: category.label, href: categoryHref(category.slug) },
                { label: g.name },
              ]}
            />
            <GuideTabs count={sources.length} guide={guideView} citations={<CitationList guide={g} />} />
          </div>
        </div>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}

/** A compound whose full guide is still being written: the identity card,
    the reference facts, and the way to its vendors. Not indexed. */
function BriefPage({ b, appStoreUrl, search }: { b: NonNullable<ReturnType<typeof briefBySlug>>; appStoreUrl: string; search: React.ReactNode }) {
  const category = categoryBySlug(b.category)!;
  const pseudo = { slug: b.slug, name: b.name, alsoCalled: b.alsoCalled, class: b.className ?? "Peptide", category: b.category, status: b.status, evidence: b.evidence ?? "Not yet rated" } as unknown as Guide;
  const shop = compoundBySlug(b.slug);
  const peers = hubRows().filter((r) => r.category === b.category && r.slug !== b.slug && r.hasGuide).slice(0, 6);
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" slot={search} />
      <main className="app animate-fade-in lib-shell lib-shell--guide">
        <div className="gp">
          <div className="gp-side">
            <IdentityCard guide={pseudo} shopHref={shop ? shopHref(shop.slug) : undefined} />
          </div>
          <div className="gp-main gd-article">
            <Crumbs trail={[{ label: "Peptide Library", href: "/library" }, { label: category.label, href: categoryHref(category.slug) }, { label: b.name }]} />
            <section className="gd-takeaway">
              <div className="gd-label">Full guide in progress</div>
              <p>
                The full {b.name} guide is being written and checked against its sources. Until it is published, these are the
                facts on record.
              </p>
            </section>
            <section className="gd-section">
              <h2>At a glance</h2>
              <GlanceTable
                rows={[
                  { label: "FDA status", value: statusLabelFor(b.status) },
                  { label: "Body system", value: category.label },
                  ...(b.className ? [{ label: "Class", value: b.className }] : []),
                  ...(b.alsoCalled ? [{ label: "Also called", value: b.alsoCalled }] : []),
                  { label: "Evidence strength", value: b.evidence ?? "Not yet rated" },
                ]}
              />
            </section>
            {peers.length > 0 && (
              <section className="gd-more">
                <h2>More for {category.label.toLowerCase()}</h2>
                <div className="lh-cards">
                  {peers.map((r) => (
                    <LibraryCard key={r.slug} slug={r.slug} name={r.name} status={r.status} category={b.category} href={guideHref(r.slug)} className={r.className} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}

/* ---- The breakdown, cut to the reference's outline ----------------------------
   Superpower's guide is: What is it, How does it work, Is it FDA-approved,
   then What is it prescribed for + What are the side effects (an approved
   drug or a cosmetic) or What does the research show (everything else),
   and an X vs Y table where one helps. The generator also wrote a history
   section and topical extras ("sold online", "sport"); the web stops
   rendering those, the data keeps them ("we just do way too much"). */
const OUTLINE = ["what-is", "how-it-works", "fda-approved", "prescribed-for", "research", "side-effects"];

function guideSections(g: Guide): Guide["sections"] {
  const byId = new Map(g.sections.map((s) => [s.id, s]));
  const out = OUTLINE.map((id) => byId.get(id)).filter((s): s is Guide["sections"][number] => Boolean(s));
  const compare = g.sections.find((s) => /(^vs-|-vs-|compar)/.test(s.id) && s.blocks.some((b) => b.type === "table"));
  if (compare) out.push(compare);
  return out;
}

/* At a glance holds four rows, as the reference's does: the FDA status, the
   two most useful facts after it, and the evidence strength last. */
const GLANCE_PRIORITY = ["Approved for", "Main uses", "Approved form", "Used in", "Research", "Key trial", "Phase 3 result", "Results", "Key benefit", "How it works", "How it's taken", "Topical form"];

function glanceRows(rows: Guide["atGlance"]): Guide["atGlance"] {
  const first = rows.find((r) => r.label === "FDA status");
  const last = rows.find((r) => r.label === "Evidence strength");
  const rest = rows.filter((r) => r !== first && r !== last);
  const rank = (label: string) => {
    const i = GLANCE_PRIORITY.indexOf(label);
    return i < 0 ? GLANCE_PRIORITY.length : i;
  };
  const middle = [...rest].sort((a, b) => rank(a.label) - rank(b.label)).slice(0, 2);
  const keep = new Set([first, ...middle, last].filter(Boolean));
  return rows.filter((r) => keep.has(r));
}

/* One list at the end, not two: the close relatives the guide names come
   first, then the rest of the body system, six at most. A relative filed
   under another body system stays in the article text, not under a heading
   that names this one. */
function moreFor(g: Guide): { slug: string; name: string; status: Guide["status"]; className?: string }[] {
  const rows = new Map(hubRows().map((r) => [r.slug, r]));
  const out: { slug: string; name: string; status: Guide["status"]; className?: string }[] = [];
  const seen = new Set([g.slug]);
  const push = (slug: string) => {
    const r = rows.get(slug);
    if (!r || seen.has(slug) || r.category !== g.category || !r.hasGuide) return;
    seen.add(slug);
    out.push({ slug: r.slug, name: r.name, status: r.status, className: r.className });
  };
  for (const s of g.alsoInLibrary ?? []) push(s);
  for (const r of relatedGuides(g, 12)) push(r.slug);
  return out.slice(0, 6);
}

/* The numbers live in the subtitle, not a stats row ("can go to hell and
   just be moved into the subtitle to maintain minimality"). */
function categoryLead(members: { status: string }[], blurb: string): string {
  const approved = members.filter((r) => r.status === "fda-approved").length;
  const trials = members.filter((r) => r.status === "in-trials").length;
  const parts = [`${members.length} peptides`];
  if (approved) parts.push(`${approved} FDA-approved`);
  if (trials) parts.push(`${trials} in clinical trials`);
  const head = parts.length > 2 ? `${parts[0]}, ${parts[1]} and ${parts[2]}` : parts.join(", ");
  return `${head}. ${blurb}`;
}
