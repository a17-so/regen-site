import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { ArrowR } from "../components/icons";
import { TIERS } from "../lib/compounds";
import {
  compoundStats,
  cumulative,
  summary,
  tally,
  answered,
  READ_THRESHOLD,
  POSITIVE_EFFECTS,
  SIDE_EFFECTS,
  TARGETS,
} from "../lib/community";
import { HBars, AreaTrend, StatTiles } from "./Charts";

export const metadata: Metadata = {
  title: "Community reports, an open peptide database | REGEN",
  description:
    "Anonymous reports on what peptides did. Counts only, anecdote, never clinical evidence, and never the grade.",
};

export default function CommunityNotesPage() {
  const appStoreUrl = buildAppStoreUrl();
  const stats = compoundStats();
  const s = summary();

  const topVolume = stats.slice(0, 8).map((c) => ({
    label: c.name,
    count: c.count,
    note: `${c.band.label} · grade ${c.tier}`,
  }));

  // One count per compound, never per report: how many compounds have this as
  // their leading positive. Counting reports here would let a single
  // heavily-reported compound dominate every bar.
  const leadTally = new Map<string, number>();
  for (const c of stats) {
    if (c.count >= READ_THRESHOLD && c.topPositive) {
      leadTally.set(c.topPositive, (leadTally.get(c.topPositive) ?? 0) + 1);
    }
  }
  const leading = [...leadTally.entries()]
    .map(([label, count]) => ({ label, count, note: "compounds where this leads" }))
    .sort((a, b) => b.count - a.count);

  const positives = tally("positives", POSITIVE_EFFECTS);
  const sides = tally("sides", SIDE_EFFECTS);
  const targets = tally("targets", TARGETS);

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <div className="cn-page">
          <header className="cn-hero">
            <span className="eyebrow">Community reports · Vol 01</span>
            <h1>An open peptide database.</h1>
            <p>
              Anonymous reports on what peptides did. Anecdote, never clinical
              evidence, and never the grade.
            </p>
            <p className="cn-hero-meta">
              Built from {s.reports} reports across {s.compoundsCovered} compounds
            </p>
          </header>

          <div className="cn-sep">The data</div>

          {/* ---- Where the reports are ---------------------------------- */}
          <section className="cn-card">
            <div className="cn-card-head">
              <div>
                <h2>Where the reports are</h2>
                <p>
                  The eight compounds people have filed the most reports on.
                  Counts only, community volume never sets a grade.
                </p>
              </div>
              <span className="cn-card-meta">
                {s.reports} reports · {s.compoundsCovered} compounds
              </span>
            </div>
            <HBars data={topVolume} tone="accent" />
            <StatTiles
              items={[
                { value: String(s.readable), label: `At ${READ_THRESHOLD} reports or more, where a read opens` },
                { value: String(s.gathering), label: `Between 1 and ${READ_THRESHOLD - 1}, still gathering` },
                {
                  value: `${s.zero}/${s.compoundsTotal}`,
                  label: "Graded compounds carry no report yet, counted here, never drawn as a zero",
                },
              ]}
            />
          </section>

          {/* ---- What the reports are about ----------------------------- */}
          {leading.length > 0 && (
            <section className="cn-card">
              <div className="cn-card-head">
                <div>
                  <h2>What the reports are about</h2>
                  <p>
                    The leading positive tag on each compound with {READ_THRESHOLD}{" "}
                    or more reports. One count is one compound, never one report.
                  </p>
                </div>
                <span className="cn-card-meta">across {s.readable} compounds</span>
              </div>
              <HBars data={leading} tone="green" unit="compounds" />
              <p className="cn-footnote">
                {s.gathering} compounds are under {READ_THRESHOLD} reports, so no
                leading outcome is published for them and none is drawn here.
              </p>
            </section>
          )}

          {/* ---- What people report ------------------------------------- */}
          <section className="cn-card">
            <div className="cn-card-head">
              <div>
                <h2>What people report</h2>
                <p>
                  Counts across every filed report, never an average. One report
                  can select several answers, so a column totals more than the
                  reports behind it.
                </p>
              </div>
            </div>

            <div className="cn-triple">
              <div className="cn-panel">
                <div className="cn-panel-head">
                  <h3>Reported positive outcomes</h3>
                  <span>{answered("positives")}/{s.reports} answered</span>
                </div>
                <HBars data={positives} tone="green" />
              </div>

              <div className="cn-panel">
                <div className="cn-panel-head">
                  <h3>Reported side effects</h3>
                  <span>{answered("sides")}/{s.reports} answered</span>
                </div>
                <p className="cn-panel-note">
                  Kept separate from positive outcomes on purpose.
                </p>
                <HBars data={sides} tone="warm" />
              </div>

              <div className="cn-panel">
                <div className="cn-panel-head">
                  <h3>What people were researching</h3>
                  <span>{answered("targets")}/{s.reports} answered</span>
                </div>
                <p className="cn-panel-note">
                  Intent, not a result or a treatment claim.
                </p>
                <HBars data={targets} tone="accent" />
              </div>
            </div>
          </section>

          {/* ---- Over time ---------------------------------------------- */}
          <section className="cn-card">
            <div className="cn-card-head">
              <div>
                <h2>Reports received over time</h2>
                <p>
                  How many reports arrived. It says nothing about whether
                  anything worked.
                </p>
              </div>
              <span className="cn-card-meta">n={s.reports}</span>
            </div>
            <AreaTrend points={cumulative()} />
          </section>

          <div className="cn-sep">The board</div>

          {/* ---- The board ---------------------------------------------- */}
          <section className="cn-card">
            <div className="cn-card-head">
              <div>
                <h2>The board</h2>
                <p>
                  Every graded compound and how many reports it carries. A first
                  read appears at {READ_THRESHOLD}. A compound sits at zero because
                  nobody has filed on it, that says nothing about the compound.
                </p>
              </div>
              <span className="cn-card-meta">
                {s.readable} readable · {s.reports} filed
              </span>
            </div>

            <ol className="board">
              {stats.map((c) => {
                const pct = Math.min(100, (c.count / 100) * 100);
                return (
                  <li key={c.slug}>
                    {/* Every row opens the compound's own read. */}
                    <a className="board-row" href={`/community-notes/${c.slug}`}>
                      <span className={`tier-dot tier-${c.tier.toLowerCase()}`}>{c.tier}</span>
                      <span className="board-name">
                        {c.name}
                        <em>{TIERS[c.tier].label}</em>
                      </span>
                      <span className="board-track">
                        <span className="board-fill" style={{ width: `${Math.max(pct, 0.6)}%` }} />
                      </span>
                      <span className="board-count">
                        <strong>{c.count}</strong>/100
                      </span>
                      <span className={`board-band band-${c.band.label.replace(/\s+/g, "-")}`}>
                        {c.band.label}
                      </span>
                      <span className="board-go" aria-hidden="true">
                        <ArrowR size={13} />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="cn-sep">File yours</div>

          {/* ---- How it works ------------------------------------------- */}
          <section className="cn-card">
            <div className="cn-card-head">
              <div>
                <span className="eyebrow">Filing</span>
                <h2>How it works</h2>
              </div>
            </div>
            <ol className="cn-steps">
              <li>
                <span className="cn-step-n">01</span>
                <div>
                  <strong>Log what you ran</strong>
                  <p>Dose, duration, outcome, side effects. About a minute.</p>
                </div>
              </li>
              <li>
                <span className="cn-step-n">02</span>
                <div>
                  <strong>It stays anonymous</strong>
                  <p>No name, no email, no account. Nothing ties a row to you.</p>
                </div>
              </li>
              <li>
                <span className="cn-step-n">03</span>
                <div>
                  <strong>It adds context, not authority</strong>
                  <p>
                    Your report joins the community signal shown beside the cited
                    research. It never sets the grade.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section className="cn-safety">
            <span className="eyebrow">Safety</span>
            <h2>Anecdote, never medical advice.</h2>
            <p>
              Most compounds logged here are experimental research peptides, not
              approved drugs, and these reports are personal anecdotes, not
              medical advice. Talk to a licensed clinician before you start,
              stop, or change a dose. If something causes a bad reaction, stop
              and get medical care.
            </p>
          </section>

          <div className="cn-file-row">
            <a className="cn-file-cta" href="/community-notes/file">
              File your own report
              <ArrowR size={16} />
            </a>
          </div>
        </div>
      </main>
      <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
    </>
  );
}
