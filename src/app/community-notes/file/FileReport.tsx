"use client";

import { useMemo, useState } from "react";
import { groupedByTier, TIER_GROUPS, type CompoundRef } from "../../lib/compounds";
import {
  POSITIVE_EFFECTS,
  SIDE_EFFECTS,
  TARGETS,
  DURATIONS,
  UNITS,
  ROUTES,
  AGE_BANDS,
} from "../../lib/community";
import { ArrowR } from "../../components/icons";

const OUTCOMES = [
  { v: 1, label: "no effect" },
  { v: 2, label: "barely" },
  { v: 3, label: "modest" },
  { v: 4, label: "clearly worked" },
  { v: 5, label: "textbook" },
];

interface Draft {
  amount: string;
  unit: string;
  interval: string;
  route: string;
  duration: string;
  targets: string[];
  outcome: number | null;
  positives: string[];
  sides: string[];
  notes: string;
  again: string;
  coa: string;
  sex: string;
  age: string;
}

const EMPTY: Draft = {
  amount: "", unit: "mcg", interval: "", route: "",
  duration: "", targets: [], outcome: null,
  positives: [], sides: [], notes: "",
  again: "", coa: "", sex: "", age: "",
};

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function FileReport({
  initialCompound = null,
}: {
  /** Catalog slug from the ?compound= deep link, pre-picks it and opens the
   *  report directly, so the app can link straight into a compound's quiz. */
  initialCompound?: string | null;
}) {
  const [step, setStep] = useState<1 | 2>(initialCompound ? 2 : 1);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>(
    initialCompound ? [initialCompound] : []
  );
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return groupedByTier()
      .map((g) => ({
        ...g,
        items: needle
          ? g.items.filter(
              (c) =>
                c.name.toLowerCase().includes(needle) ||
                c.blurb.toLowerCase().includes(needle)
            )
          : g.items,
      }))
      .filter((g) => g.items.length > 0);
  }, [q]);

  const total = useMemo(() => groupedByTier().reduce((n, g) => n + g.items.length, 0), []);
  const all = useMemo(() => groupedByTier().flatMap((g) => g.items), []);
  const current: CompoundRef | undefined = all.find((c) => c.slug === picked[index]);
  const draft = (current && drafts[current.slug]) ?? EMPTY;

  function patch(p: Partial<Draft>) {
    if (!current) return;
    setDrafts((d) => ({ ...d, [current.slug]: { ...draft, ...p } }));
  }

  // Eight questions, all optional except the consent gate, a form that
  // demands everything on an anonymous submission just gets abandoned.
  const answeredCount = [
    draft.amount, draft.duration, draft.targets.length, draft.outcome,
    draft.positives.length, draft.sides.length, draft.notes, draft.again,
  ].filter(Boolean).length;

  async function submit() {
    if (!consent || state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          compound: current?.name ?? picked.join(", "),
          body: JSON.stringify(drafts),
          website: "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setState("sent");
    } catch {
      setState("error");
      setError("Couldn't reach the server.");
    }
  }

  // ---- Sent ---------------------------------------------------------------
  if (state === "sent") {
    return (
      <div className="fr-done">
        <h2>Report filed.</h2>
        <p>
          It goes to moderation before it appears anywhere. Nothing identifying
          was attached, and nothing publishes automatically.
        </p>
        <div className="fr-done-row">
          <a className="btn btn-accent" href="/community-notes">
            Back to the database
          </a>
          <button
            className="btn btn-glass"
            onClick={() => {
              setState("idle"); setStep(1); setPicked([]); setDrafts({});
              setIndex(0); setConsent(false);
            }}
          >
            File another
          </button>
        </div>
      </div>
    );
  }

  // ---- Step 1: pick compounds --------------------------------------------
  if (step === 1) {
    return (
      <>
        <div className="fr-bar">
          <a className="fr-back" href="/community-notes">← Community</a>
          <span className="fr-progress">
            Step 1/2 · Pick compounds
            <span className="fr-pips"><i className="on" /><i /></span>
          </span>
        </div>

        <header className="fr-head">
          <span className="eyebrow">Community report · file yours</span>
          <h1>Which ones did you run?</h1>
          <p>
            All {total} compounds by grade, S to F. Tap every one you have data
            on. Anonymous, no personal information collected.
          </p>
        </header>

        <label className="fr-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21 l-4.3 -4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search all ${total} compounds`}
            autoComplete="off"
          />
        </label>

        {groups.map((g) => (
          <section className={`fr-group tier-edge-${g.tier.toLowerCase()}`} key={g.tier}>
            <div className="fr-group-head">
              <span className={`tier-dot tier-${g.tier.toLowerCase()}`}>{g.tier}</span>
              <h2>{TIER_GROUPS[g.tier].label}</h2>
              <span className="fr-group-n">{g.items.length}</span>
            </div>
            <p className="fr-group-note">{TIER_GROUPS[g.tier].note}</p>
            <div className="fr-grid">
              {g.items.map((c) => (
                <button
                  key={c.slug}
                  className={`fr-pick${picked.includes(c.slug) ? " on" : ""}`}
                  onClick={() => setPicked((p) => toggle(p, c.slug))}
                  aria-pressed={picked.includes(c.slug)}
                >
                  <span className="fr-check" aria-hidden />
                  <span>
                    <strong>{c.name}</strong>
                    <em>{c.blurb}</em>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <p className="blog-empty">Nothing matches “{q}”.</p>
        )}

        <div className="fr-sticky">
          <span>
            {picked.length === 0
              ? "Pick at least one"
              : `${picked.length} selected`}
          </span>
          <button
            className="btn btn-accent"
            disabled={picked.length === 0}
            onClick={() => { setStep(2); setIndex(0); }}
          >
            Continue <ArrowR size={14} />
          </button>
        </div>
      </>
    );
  }

  // ---- Step 2: the report -------------------------------------------------
  return (
    <>
      <div className="fr-bar">
        <button className="fr-back" onClick={() => setStep(1)}>← Compounds</button>
        <span className="fr-progress">
          Step 2/2 · The report
          <span className="fr-pips"><i className="on" /><i className="on" /></span>
        </span>
      </div>

      {picked.length > 1 && (
        <div className="fr-multi" aria-label="Selected compounds">
          {picked.map((slug, i) => {
            const c = all.find((x) => x.slug === slug);
            if (!c) return null;
            return (
              <button
                key={slug}
                className={`fr-chip${i === index ? " on" : ""}`}
                onClick={() => setIndex(i)}
                aria-current={i === index}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      <header className="fr-head fr-head-compound">
        <span className="eyebrow">
          Compound {index + 1} of {picked.length} · {current?.tier}-grade
        </span>
        <h1>{current?.name}</h1>
        <p>
          Honest answers, about a minute. Anonymous, no personal information
          collected, nothing here is medical advice.
        </p>
      </header>

      <Q n="01" kicker="Dose" title="Reported amount, reported interval.">
        <div className="fr-dose">
          <input
            className="fr-input"
            inputMode="decimal"
            placeholder="250"
            value={draft.amount}
            onChange={(e) => patch({ amount: e.target.value })}
            aria-label="Dose amount"
          />
          <Chips options={[...UNITS]} value={draft.unit} onPick={(v) => patch({ unit: v })} />
          <input
            className="fr-input fr-input-wide"
            placeholder="e.g. 2x daily, EOD"
            value={draft.interval}
            onChange={(e) => patch({ interval: e.target.value })}
            aria-label="Dose interval"
          />
        </div>
        <Chips options={[...ROUTES]} value={draft.route} onPick={(v) => patch({ route: v })} />
      </Q>

      <Q n="02" kicker="Duration" title="How long did you run it?">
        <Chips options={[...DURATIONS]} value={draft.duration} onPick={(v) => patch({ duration: v })} />
      </Q>

      <Q n="03" kicker="What you tracked" title="What were you running it for?"
         note="Optional. This records the question you brought in, not whether the compound changed it.">
        <Chips multi options={[...TARGETS]} values={draft.targets} onPick={(v) => patch({ targets: toggle(draft.targets, v) })} />
      </Q>

      <Q n="04" kicker="Outcome" title="What did you observe?">
        <div className="fr-scale">
          {OUTCOMES.map((o) => (
            <button
              key={o.v}
              className={`fr-scale-b${draft.outcome === o.v ? " on" : ""}`}
              onClick={() => patch({ outcome: o.v })}
              aria-pressed={draft.outcome === o.v}
            >
              <strong>{o.v}</strong>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      </Q>

      <Q n="05" kicker="Positive effects" title="What improved?">
        <Chips multi options={[...POSITIVE_EFFECTS]} values={draft.positives} onPick={(v) => patch({ positives: toggle(draft.positives, v) })} />
      </Q>

      <Q n="06" kicker="Side effects" title="What else showed up?">
        <Chips multi options={[...SIDE_EFFECTS]} values={draft.sides} onPick={(v) => patch({ sides: toggle(draft.sides, v) })} />
      </Q>

      <Q n="07" kicker="Notes" title="Anything the form didn't ask for.">
        <textarea
          className="fr-textarea"
          rows={4}
          maxLength={600}
          placeholder="Stack context, onset, how it compared to what you expected"
          value={draft.notes}
          onChange={(e) => patch({ notes: e.target.value })}
        />
        <p className="fr-hint">
          Don&apos;t include your name, email, or anything identifying, it gets
          stripped server-side anyway.
        </p>
      </Q>

      <Q n="08" kicker="The verdict" title="Would you run it again?">
        <div className="fr-verdict">
          <div>
            <span className="fr-sub">Run it again</span>
            <Chips options={["yes", "no", "unsure"]} value={draft.again} onPick={(v) => patch({ again: v })} />
          </div>
          <div>
            <span className="fr-sub">Verified the source (COA)</span>
            <Chips options={["yes", "no", "unsure"]} value={draft.coa} onPick={(v) => patch({ coa: v })} />
          </div>
          <div>
            <span className="fr-sub">Sex · optional</span>
            <Chips options={["male", "female", "other", "prefer not to say"]} value={draft.sex} onPick={(v) => patch({ sex: v })} />
          </div>
          <div>
            <span className="fr-sub">Age band · optional</span>
            <Chips options={[...AGE_BANDS]} value={draft.age} onPick={(v) => patch({ age: v })} />
          </div>
        </div>
      </Q>

      <label className="fr-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          I&apos;m 21 or older and understand this is anonymous research data,
          not medical advice.
        </span>
      </label>

      {error && <p className="cn-error">{error}</p>}

      <div className="fr-sticky">
        <span>{answeredCount} / 8 answered</span>
        <div className="fr-sticky-actions">
          {index < picked.length - 1 ? (
            <button className="btn btn-glass" onClick={() => setIndex((i) => i + 1)}>
              Next compound <ArrowR size={14} />
            </button>
          ) : null}
          <button
            className="btn btn-accent"
            disabled={!consent || state === "sending"}
            onClick={submit}
          >
            {state === "sending" ? "Filing…" : "File report"}
          </button>
        </div>
      </div>
    </>
  );
}

// ---- Small pieces ---------------------------------------------------------

function Q({
  n, kicker, title, note, children,
}: {
  n: string; kicker: string; title: string; note?: string; children: React.ReactNode;
}) {
  return (
    <section className="fr-q">
      <span className="fr-q-kicker">{n} · {kicker}</span>
      <h2>{title}</h2>
      {note && <p className="fr-q-note">{note}</p>}
      {children}
    </section>
  );
}

function Chips({
  options, value, values, onPick, multi,
}: {
  options: string[];
  value?: string;
  values?: string[];
  onPick: (v: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="fr-chips">
      {options.map((o) => {
        const on = multi ? (values ?? []).includes(o) : value === o;
        return (
          <button
            key={o}
            className={`fr-chip${on ? " on" : ""}`}
            onClick={() => onPick(o)}
            aria-pressed={on}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
