import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { ArrowR } from "../../components/icons";
import { COMPOUNDS, TIERS, bySlug } from "../../lib/compounds";
import {
  reportsFor,
  outcomeDist,
  tallyFor,
  againSplit,
  durationDist,
  bandFor,
  READ_THRESHOLD,
  POSITIVE_EFFECTS,
  SIDE_EFFECTS,
  TARGETS,
} from "../../lib/community";
import { HBars, StatTiles } from "../Charts";

/**
 * One compound's community read, the page a board row opens.
 *
 * Same publishing rule as every other surface: below READ_THRESHOLD only the
 * count renders, never a breakdown. The page never shows an empty chart for
 * a compound nobody has filed on; it says so instead and points at the form,
 * deep-linked so the picker is skipped.
 */

export function generateStaticParams() {
  return COMPOUNDS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) return {};
  return {
    title: `${c.name}, community reports | REGEN`,
    description: `Anonymous community reports on ${c.name}: outcomes, side effects, and duration. Anecdote, never clinical evidence, and never the grade.`,
  };
}

export default async function CompoundReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const compound = bySlug(slug);
  if (!compound) notFound();

  const appStoreUrl = buildAppStoreUrl();
  const reports = reportsFor(compound.slug);
  const count = reports.length;
  const band = bandFor(count);
  const readable = count >= READ_THRESHOLD;
  const fileHref = `/community-notes/file?compound=${compound.slug}`;

  const again = againSplit(compound.slug);
  const avg = readable
    ? (reports.reduce((s, r) => s + r.outcome, 0) / count).toFixed(1)
    : null;
  const againPct = readable
    ? Math.round((again.yes / Math.max(1, again.yes + again.no + again.unsure)) * 100)
    : null;

  const positives = tallyFor(compound.slug, "positives", POSITIVE_EFFECTS);
  const sides = tallyFor(compound.slug, "sides", SIDE_EFFECTS);
  const targets = tallyFor(compound.slug, "targets", TARGETS);
  const durations = durationDist(compound.slug);

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <div className="cn-page">
          <div className="fr-bar">
            <a className="fr-back" href="/community-notes">
              ← The board
            </a>
            <span className="fr-progress">
              {count}/100 reports · {band.label}
            </span>
          </div>

          <header className="cn-hero cn-hero-compound">
            <span className="eyebrow">
              Community read · grade {compound.tier} ·{" "}
              {TIERS[compound.tier].label}
            </span>
            <h1>{compound.name}</h1>
            <p>{compound.blurb}</p>
            <p className="cn-hero-meta">
              {count === 0
                ? "No reports filed yet"
                : `Built from ${count} anonymous ${count === 1 ? "report" : "reports"} · ${band.note}`}
            </p>
          </header>

          {!readable ? (
            /* Below the threshold nothing is published, say so, honestly. */
            <section className="cn-card">
              <div className="cn-card-head">
                <div>
                  <h2>
                    {count === 0
                      ? "Nobody has filed on this yet."
                      : "Still gathering."}
                  </h2>
                  <p>
                    {count === 0
                      ? "The board shows a zero because nobody has filed a report, that says nothing about the compound."
                      : `${count} ${count === 1 ? "report" : "reports"} so far. A first read is published at ${READ_THRESHOLD}, below that a breakdown would just be noise wearing a chart.`}
                  </p>
                </div>
                <span className="cn-card-meta">
                  {count}/{READ_THRESHOLD} toward a first read
                </span>
              </div>
              <div className="cn-file-row">
                <a className="cn-file-cta" href={fileHref}>
                  Ran it? File the first report
                  <ArrowR size={16} />
                </a>
              </div>
            </section>
          ) : (
            <>
              <div className="cn-sep">The read</div>

              <section className="cn-card">
                <div className="cn-card-head">
                  <div>
                    <h2>What people observed</h2>
                    <p>
                      Every report answers on a 1–5 scale. This is the whole
                      distribution, never an average pretending to be one
                      number, though the average is beside it.
                    </p>
                  </div>
                  <span className="cn-card-meta">n={count}</span>
                </div>
                <HBars data={outcomeDist(compound.slug)} tone="accent" />
                <StatTiles
                  items={[
                    { value: `${avg}/5`, label: "Average reported outcome" },
                    {
                      value: `${againPct}%`,
                      label: "Would run it again",
                    },
                    {
                      value: `${count}`,
                      label: `Reports filed · ${band.label}`,
                    },
                  ]}
                />
              </section>

              {(positives.length > 0 || sides.length > 0) && (
                <section className="cn-card">
                  <div className="cn-card-head">
                    <div>
                      <h2>What it did, and what else showed up</h2>
                      <p>
                        Counts across this compound&apos;s reports, never an
                        average. One report can select several answers.
                      </p>
                    </div>
                  </div>
                  <div className="cn-split">
                    {positives.length > 0 && (
                      <div className="cn-panel">
                        <div className="cn-panel-head">
                          <h3>Reported positive outcomes</h3>
                        </div>
                        <HBars data={positives} tone="green" />
                      </div>
                    )}
                    {sides.length > 0 && (
                      <div className="cn-panel">
                        <div className="cn-panel-head">
                          <h3>Reported side effects</h3>
                        </div>
                        <p className="cn-panel-note">
                          Kept separate from positive outcomes on purpose.
                        </p>
                        <HBars data={sides} tone="warm" />
                      </div>
                    )}
                  </div>
                </section>
              )}

              {(targets.length > 0 || durations.length > 0) && (
                <section className="cn-card">
                  <div className="cn-card-head">
                    <div>
                      <h2>How it was run</h2>
                      <p>
                        What people brought it in for, and how long they stayed
                        on it. Intent, not a result or a treatment claim.
                      </p>
                    </div>
                  </div>
                  <div className="cn-split">
                    {targets.length > 0 && (
                      <div className="cn-panel">
                        <div className="cn-panel-head">
                          <h3>What people were researching</h3>
                        </div>
                        <HBars data={targets} tone="accent" />
                      </div>
                    )}
                    {durations.length > 0 && (
                      <div className="cn-panel">
                        <div className="cn-panel-head">
                          <h3>How long they ran it</h3>
                        </div>
                        <HBars data={durations} tone="cool" />
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section className="cn-safety">
                <span className="eyebrow">Safety</span>
                <h2>Anecdote, never medical advice.</h2>
                <p>
                  These are anonymous personal reports on an experimental
                  research compound, not clinical evidence, and they never set
                  the grade. Talk to a licensed clinician before you start,
                  stop, or change a dose.
                </p>
              </section>

              <div className="cn-file-row">
                <a className="cn-file-cta" href={fileHref}>
                  Ran {compound.name}? Add your report
                  <ArrowR size={16} />
                </a>
              </div>
            </>
          )}
        </div>
      </main>
      <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
    </>
  );
}
