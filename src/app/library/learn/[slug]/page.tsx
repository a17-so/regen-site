import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../../lib/appStoreUrl";
import NavBar from "../../../components/NavBar";
import PageClose from "../../../components/PageClose";
import { JsonLd } from "../../../components/JsonLd";
import { MedicalDisclaimer } from "../../../components/Disclaimer";
import { LIBRARY_ROBOTS, hrefFor, type Peptide, type Source, peptideSearchRows} from "../../../lib/library";
import LibrarySearch from "../../LibrarySearch";
import {
  LEARN_ARTICLES,
  learnBySlug,
  learnReadMinutes,
  membersOf,
  type LearnArticle,
} from "../../../lib/libraryLearn";
import {
  Citations,
  Crumbs,
  KeyTakeaways,
  LibraryByline,
  Pill,
  RichText,
  SITE_URL,
  TierBadge,
} from "../../parts";

export function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = learnBySlug(slug);
  if (!a) return {};
  const url = `${SITE_URL}/library/learn/${a.slug}`;
  return {
    title: `${a.title} | REGEN Library`,
    description: a.description,
    alternates: { canonical: url },
    robots: LIBRARY_ROBOTS,
    openGraph: { type: "article", url, title: a.title, description: a.description },
    twitter: { card: "summary_large_image", title: a.title, description: a.description },
  };
}

/** Union of every member's citations, deduped by URL. */
function pooledSources(members: Peptide[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const p of members) {
    for (const s of p.sources) {
      if (!seen.has(s.url)) {
        seen.add(s.url);
        out.push(s);
      }
    }
  }
  return out;
}

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = learnBySlug(slug);
  if (!a) notFound();

  const appStoreUrl = buildAppStoreUrl();
  const members = membersOf(a);
  const url = `${SITE_URL}/library/learn/${a.slug}`;
  const sources = pooledSources(members);

  const takeaways =
    a.kind === "comparison"
      ? [
          `**${members[0].name}** carries a research grade of ${members[0].researchTier ?? "unrated"}; **${members[1].name}** carries ${members[1].researchTier ?? "unrated"}.`,
          ...members.map((m) => `**${m.name}**: ${m.subtitle}`),
        ]
      : [
          `**${members[0].name}** has the strongest evidence of the ${members.length} compounds covered here.`,
          `Grades run ${members.map((m) => `${m.name} ${m.researchTier ?? "?"}`).join(", ")}.`,
          "Ordering follows evidence quality, not popularity.",
        ];

  const faq = buildFaq(a, members);

  const graph: object[] = [
    {
      "@type": ["MedicalWebPage", "Article"],
      "@id": `${url}#article`,
      headline: a.title,
      description: a.description,
      medicalSpecialty: "Pharmacology",
      inLanguage: "en",
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
        { "@type": "ListItem", position: 3, name: "Learn", item: `${SITE_URL}/library/learn` },
        { "@type": "ListItem", position: 4, name: a.title, item: url },
      ],
    },
  ];
  if (a.kind === "best-for") {
    graph.push({
      "@type": "ItemList",
      name: a.title,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: members.length,
      itemListElement: members.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: m.name,
        url: `${SITE_URL}${hrefFor(m)}`,
      })),
    });
  }
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
      <NavBar
        appStoreUrl={appStoreUrl}
        sectionBase="/"
        slot={<LibrarySearch rows={peptideSearchRows()} variant="nav" />}
      />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <article className="legal-page">
          <div className="legal-head">
            <Crumbs
              trail={[
                { label: "Home", href: "/" },
                { label: "Library", href: "/library" },
                { label: "Learn", href: "/library/learn" },
                { label: a.cardTitle },
              ]}
            />
            <h1>{a.title}</h1>
            <p className="post-lead">{a.intent}</p>
            <div className="lib-card-chips lib-card-chips--head">
              <Pill tone="accent">{learnReadMinutes(a)} Min Read</Pill>
              {a.popular && <Pill tone="green">Popular</Pill>}
            </div>
            <LibraryByline />
          </div>

          <div className="legal-body">
            <aside className="legal-toc">
              <a href="#how-graded">How this is graded</a>
              {members.map((m) => (
                <a key={m.slug} href={`#${m.slug}`}>
                  {m.name}
                </a>
              ))}
              <a href="#at-a-glance">At a glance</a>
              {faq.length > 0 && <a href="#faq">FAQ</a>}
              {sources.length > 0 && <a href="#references">References</a>}
            </aside>

            <div className="legal-content">
              <MedicalDisclaimer />
              <KeyTakeaways items={takeaways} />

              <h2 id="how-graded">How this is graded</h2>
              <p>
                Every compound below carries a REGEN research grade, from S (regulatory approval
                behind the use it is bought for) down to F (no clinical evidence). Ordering follows
                that grade rather than search volume, so the compound at the top is the one with the
                most evidence, not the one most often sold. Doses are those reported in published
                protocols and are not recommendations.
              </p>

              {a.kind === "comparison" ? (
                <ComparisonBody members={members} />
              ) : (
                <RankingBody members={members} />
              )}

              <h2 id="at-a-glance">At a glance</h2>
              <div className="lib-table-scroll">
                <table className="lib-all-table">
                  <thead>
                    <tr>
                      <th scope="col">Compound</th>
                      <th scope="col">Grade</th>
                      <th scope="col">Reported dose</th>
                      <th scope="col">Half-life</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.slug}>
                        <th scope="row">
                          <a href={hrefFor(m)}>{m.name}</a>
                        </th>
                        <td>
                          <TierBadge tier={m.researchTier} />
                        </td>
                        <td>
                          {m.doseCard?.primary ?? "—"}
                          {m.doseCard?.frequency ? ` · ${m.doseCard.frequency}` : ""}
                        </td>
                        <td>{m.halfLife ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

              <Citations sources={sources} />

              <div className="lib-nextprev">
                <a href="/library/learn">All guides and comparisons</a>
              </div>
            </div>
          </div>
        </article>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}

/** Ranked "best for" body: one numbered section per compound. */
function RankingBody({ members }: { members: Peptide[] }) {
  return (
    <>
      {members.map((m, i) => (
        <section key={m.slug}>
          <h2 id={m.slug}>
            {i + 1}. {m.name}
          </h2>
          <div className="lib-card-chips">
            <TierBadge tier={m.researchTier} />
            {m.doseCard?.primary && <Pill>{m.doseCard.primary}</Pill>}
            {m.halfLife && <Pill>Half-life {m.halfLife}</Pill>}
          </div>
          <p>
            <RichText text={m.description} />
          </p>
          {m.evidenceClaims.length > 0 && (
            <ul>
              {m.evidenceClaims.map((c) => (
                <li key={c.claim}>
                  <strong>{c.claim}</strong> (grade {c.tier}){c.note ? ` — ${c.note}` : ""}
                </li>
              ))}
            </ul>
          )}
          {m.trials[0]?.headlineStat && (
            <p>
              <strong>Strongest study:</strong> {m.trials[0].name}
              {m.trials[0].journal ? `, ${m.trials[0].journal}` : ""}
              {m.trials[0].date ? ` (${m.trials[0].date})` : ""} — {m.trials[0].headlineStat}
            </p>
          )}
          <p>
            <a href={hrefFor(m)}>Full {m.name} reference</a>
          </p>
        </section>
      ))}
    </>
  );
}

/** Head-to-head body: shared axes, one section each. */
function ComparisonBody({ members }: { members: Peptide[] }) {
  const [a, b] = members;
  return (
    <>
      <section>
        <h2 id={a.slug}>{a.name}</h2>
        <div className="lib-card-chips">
          <TierBadge tier={a.researchTier} />
          {a.doseCard?.primary && <Pill>{a.doseCard.primary}</Pill>}
        </div>
        <p>
          <RichText text={a.description} />
        </p>
      </section>

      <section>
        <h2 id={b.slug}>{b.name}</h2>
        <div className="lib-card-chips">
          <TierBadge tier={b.researchTier} />
          {b.doseCard?.primary && <Pill>{b.doseCard.primary}</Pill>}
        </div>
        <p>
          <RichText text={b.description} />
        </p>
      </section>

      <h2 id="evidence">Evidence compared</h2>
      <div className="lib-table-scroll">
        <table className="lib-all-table">
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">{a.name}</th>
              <th scope="col">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Research grade</th>
              <td>
                <TierBadge tier={a.researchTier} />
              </td>
              <td>
                <TierBadge tier={b.researchTier} />
              </td>
            </tr>
            <tr>
              <th scope="row">Reported dose</th>
              <td>{a.doseCard?.primary ?? "—"}</td>
              <td>{b.doseCard?.primary ?? "—"}</td>
            </tr>
            <tr>
              <th scope="row">Frequency</th>
              <td>{a.doseCard?.frequency ?? "—"}</td>
              <td>{b.doseCard?.frequency ?? "—"}</td>
            </tr>
            <tr>
              <th scope="row">Half-life</th>
              <td>{a.halfLife ?? "—"}</td>
              <td>{b.halfLife ?? "—"}</td>
            </tr>
            <tr>
              <th scope="row">Routes</th>
              <td>{a.route.join(", ") || "—"}</td>
              <td>{b.route.join(", ") || "—"}</td>
            </tr>
            <tr>
              <th scope="row">Tracked outcomes</th>
              <td>{a.evidenceClaims.map((c) => c.claim).join(", ") || "—"}</td>
              <td>{b.evidenceClaims.map((c) => c.claim).join(", ") || "—"}</td>
            </tr>
            <tr>
              <th scope="row">Contraindications</th>
              <td>{a.contraindications.join(", ") || "—"}</td>
              <td>{b.contraindications.join(", ") || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="which">Which has more behind it</h2>
      <p>
        {verdict(a, b)} Both entries link through to the full reference, where the trial list and
        citations for each claim are set out in full.
      </p>
      <p>
        <a href={hrefFor(a)}>Full {a.name} reference</a> · <a href={hrefFor(b)}>Full {b.name} reference</a>
      </p>
    </>
  );
}

const TIER_RANK: Record<string, number> = { S: 0, A: 1, B: 2, C: 3, D: 4, F: 5 };

/** States which side has the stronger evidence, or that they are level. */
function verdict(a: Peptide, b: Peptide): string {
  const ra = TIER_RANK[a.researchTier ?? "F"] ?? 9;
  const rb = TIER_RANK[b.researchTier ?? "F"] ?? 9;
  if (ra === rb) {
    return `${a.name} and ${b.name} sit at the same research grade (${a.researchTier ?? "unrated"}), so the choice between them turns on mechanism and tolerability rather than evidence weight.`;
  }
  const [strong, weak] = ra < rb ? [a, b] : [b, a];
  return `${strong.name} carries the stronger evidence grade (${strong.researchTier}) against ${weak.name} at ${weak.researchTier}, which means more of what is claimed for ${strong.name} has been tested in humans.`;
}

function buildFaq(a: LearnArticle, members: Peptide[]) {
  const out: { q: string; a: string }[] = [];
  if (!members.length) return out;

  if (a.kind === "comparison") {
    const [x, y] = members;
    out.push({
      q: `${x.name} or ${y.name}, which has better evidence?`,
      a: verdict(x, y),
    });
    out.push({
      q: `Can ${x.name} and ${y.name} be used together?`,
      a: x.commonStacks.includes(y.slug)
        ? `${x.name} and ${y.name} are commonly paired in reported protocols. Combining compounds does not combine their evidence, each still carries its own grade.`
        : `The catalog does not list ${x.name} and ${y.name} as a common pairing. Combining compounds does not combine their evidence.`,
    });
  } else {
    out.push({
      q: `Which peptide has the most evidence for ${a.cardTitle.toLowerCase()}?`,
      a: `${members[0].name}, at research grade ${members[0].researchTier ?? "unrated"}. ${members[0].evidenceSummary[0] ?? ""}`.trim(),
    });
    out.push({
      q: `How many compounds are compared here?`,
      a: `${members.length}: ${members.map((m) => m.name).join(", ")}.`,
    });
  }

  const withDose = members.find((m) => m.doseCard?.primary);
  if (withDose) {
    out.push({
      q: `What doses are reported for ${withDose.name}?`,
      a: `Published protocols report ${withDose.doseCard!.primary}${
        withDose.doseCard!.frequency ? `, ${withDose.doseCard!.frequency}` : ""
      }. This is what the literature describes, not a recommendation.`,
    });
  }
  return out;
}
