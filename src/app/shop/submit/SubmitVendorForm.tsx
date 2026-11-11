"use client";

import { useState } from "react";

type Kind = "vendor" | "coa";
type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; known: boolean } | { kind: "error"; message: string };
type Data = Record<string, string>;

/** One question on a step: a hairline field or a row of the site's chips. */
type Field =
  | { key: string; label: string; hint?: string; type: "text" | "url" | "email" | "textarea"; placeholder?: string; required?: boolean; autoComplete?: string }
  | { key: string; label: string; hint?: string; type: "chips"; options: string[]; required?: boolean };

type Step = { id: string; title: string; lede: string; fields: Field[] };

/**
 * The submission as an onboarding, the brand-portal shape (one question
 * group per screen, a step rail that fills in as you go, a review before
 * the send) in REGEN's system. The first screen asks what you are sending;
 * a certificate takes the short branch. Everything a step collects rides
 * to `/api/vendors/submit` as `details`, folded into the notes as well so
 * the inbox email reads whole.
 */
const VENDOR_STEPS: Step[] = [
  {
    id: "store",
    title: "The store",
    lede: "Its name and its address. The address is matched against the vendors already researched.",
    fields: [
      { key: "name", label: "Store name", type: "text", required: true, autoComplete: "organization", placeholder: "Store name" },
      { key: "url", label: "Store URL", type: "url", required: true, placeholder: "https://" },
    ],
  },
  {
    id: "operator",
    title: "Who runs it",
    lede: "What you know about the people behind it. Guesses are fine, blanks are fine.",
    fields: [
      { key: "country", label: "Where it ships from", type: "text", placeholder: "Country", autoComplete: "country-name" },
      { key: "since", label: "Selling since", hint: "a year, if you know it", type: "text", placeholder: "2021" },
      { key: "operator", label: "Who is behind it", hint: "a company, a person, a lab", type: "text", placeholder: "What the site or its social accounts say" },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    lede: "Whether its purity claims can be checked. This is most of the score.",
    fields: [
      { key: "coaPublic", label: "Are certificates of analysis public?", type: "chips", options: ["Yes, on the site", "On request", "No", "Not sure"], required: true },
      { key: "lab", label: "Which lab tests it", hint: "named on the certificates", type: "text", placeholder: "Lab name" },
      { key: "coaUrl", label: "Link to a certificate or the archive", type: "url", placeholder: "https://" },
    ],
  },
  {
    id: "you",
    title: "You",
    lede: "Your relationship to the store, and where to reach you if a question comes up.",
    fields: [
      { key: "relation", label: "You are", type: "chips", options: ["A customer", "The operator", "A lab", "Other"], required: true },
      { key: "email", label: "Your email", hint: "optional, to hear back", type: "email", autoComplete: "email", placeholder: "you@example.com" },
      { key: "notes", label: "Anything else", type: "textarea", placeholder: "What went well, what went wrong, what to look at first." },
    ],
  },
];

const COA_STEPS: Step[] = [
  {
    id: "certificate",
    title: "The certificate",
    lede: "Which store issued it and where it lives.",
    fields: [
      { key: "name", label: "Which store issued it", type: "text", required: true, autoComplete: "organization", placeholder: "Store name" },
      { key: "url", label: "Link to the certificate", type: "url", required: true, placeholder: "https://" },
      { key: "notes", label: "What it covers", type: "textarea", placeholder: "Compound, batch number, lab, test date." },
    ],
  },
  {
    id: "you",
    title: "You",
    lede: "Where to reach you if a question comes up.",
    fields: [
      { key: "relation", label: "You are", type: "chips", options: ["A customer", "The operator", "A lab", "Other"], required: true },
      { key: "email", label: "Your email", hint: "optional, to hear back", type: "email", autoComplete: "email", placeholder: "you@example.com" },
    ],
  },
];

const KIND_STEP: Step = {
  id: "what",
  title: "What you are sending",
  lede: "A store that belongs on the list, or a certificate the archive is missing.",
  fields: [],
};

const REVIEW_STEP: Step = { id: "review", title: "Review", lede: "Check it over. Nothing is sent until you confirm.", fields: [] };

function stepsFor(kind: Kind | null): Step[] {
  const body = kind === "coa" ? COA_STEPS : VENDOR_STEPS;
  return [KIND_STEP, ...body, REVIEW_STEP];
}

function missing(step: Step, data: Data): string | null {
  for (const f of step.fields) {
    if (f.required && !(data[f.key] ?? "").trim()) return f.label;
    if (f.type === "url" && (data[f.key] ?? "").trim()) {
      try {
        new URL(data[f.key]);
      } catch {
        return `${f.label}: enter the full address, starting with https://`;
      }
    }
  }
  return null;
}

export default function SubmitVendorForm() {
  const [kind, setKind] = useState<Kind | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({});
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });

  const steps = stepsFor(kind);
  const cur = steps[step];
  const last = step === steps.length - 1;
  const set = (key: string, value: string) => setData((d) => ({ ...d, [key]: value }));

  function next() {
    if (step === 0 && !kind) {
      setError("Pick one to continue.");
      return;
    }
    const miss = missing(cur, data);
    if (miss) {
      setError(miss.includes(":") ? miss : `${miss} is needed to continue.`);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function send() {
    if (!consent) {
      setError("Confirm the details are accurate to send.");
      return;
    }
    setError(null);
    setState({ kind: "sending" });
    const lines = steps
      .flatMap((s) => s.fields)
      .filter((f) => (data[f.key] ?? "").trim() && !["name", "url", "email"].includes(f.key))
      .map((f) => `${f.label}: ${data[f.key].trim()}`);
    const notes = `${kind === "coa" ? "[Certificate] " : ""}${lines.join("\n")}`.trim();
    try {
      const res = await fetch("/api/vendors/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, url: data.url, name: data.name, email: data.email ?? "", notes, details: data, website: data.website ?? "" }),
      });
      const body = (await res.json().catch(() => ({}))) as { known?: boolean; error?: string };
      if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
      setState({ kind: "done", known: Boolean(body.known) && kind === "vendor" });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  function reset() {
    setKind(null);
    setStep(0);
    setData({});
    setConsent(false);
    setError(null);
    setState({ kind: "idle" });
  }

  if (state.kind === "done") {
    return (
      <div className="sh-pane sh-empty-state sh-submit-done">
        <span className="sh-empty-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2>{state.known ? "Already on the list" : "Received"}</h2>
        <p>
          {state.known
            ? "That store is already in the research set. Its profile is in the vendor list."
            : "Thanks. It goes through the same research as every vendor here before it appears, which takes days, not minutes."}
        </p>
        <div className="sh-empty-actions">
          <a className="lib-filter" href="/shop">
            Back to the vendors
          </a>
          <button type="button" className="lib-filter" onClick={reset}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  const review = steps.flatMap((s) => s.fields).filter((f) => (data[f.key] ?? "").trim());

  return (
    <div className="sh-onb">
      <ol className="sh-onb-rail" aria-label="Steps">
        {steps.map((s, i) => (
          <li key={s.id} className={i === step ? "is-current" : i < step ? "is-done" : undefined} aria-current={i === step ? "step" : undefined}>
            <span className="sh-onb-n" aria-hidden="true">
              {i < step ? (
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="sh-onb-t">{s.title}</span>
          </li>
        ))}
      </ol>

      <form
        className="sh-pane sh-form sh-onb-pane"
        onSubmit={(e) => {
          e.preventDefault();
          if (last) void send();
          else next();
        }}
      >
        <div className="sh-onb-progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <p className="sh-onb-count">
          Step {step + 1} of {steps.length}
        </p>
        <h2 className="sh-onb-h">{cur.title}</h2>
        <p className="sh-onb-lede">{cur.lede}</p>

        {step === 0 && (
          <div className="sh-onb-chips" role="radiogroup" aria-label="What you are sending">
            {(
              [
                ["vendor", "A vendor", "A store that sells research peptides."],
                ["coa", "A certificate", "A certificate of analysis the archive is missing."],
              ] as const
            ).map(([k, label, hint]) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={kind === k}
                className={`sh-onb-choice${kind === k ? " is-active" : ""}`}
                onClick={() => {
                  setKind(k);
                  setError(null);
                }}
              >
                <strong>{label}</strong>
                <span>{hint}</span>
              </button>
            ))}
          </div>
        )}

        {cur.fields.map((f) =>
          f.type === "chips" ? (
            <div className="sh-field" key={f.key} role="radiogroup" aria-label={f.label}>
              <span>
                {f.label} {f.hint && <em>{f.hint}</em>}
              </span>
              <div className="sh-onb-chips sh-onb-chips--row">
                {f.options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    role="radio"
                    aria-checked={data[f.key] === o}
                    className={`lib-filter${data[f.key] === o ? " is-active" : ""}`}
                    onClick={() => set(f.key, o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <label className="sh-field" key={f.key}>
              <span>
                {f.label} {f.hint && <em>{f.hint}</em>}
              </span>
              {f.type === "textarea" ? (
                <textarea name={f.key} rows={3} maxLength={1500} placeholder={f.placeholder} value={data[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
              ) : (
                <input
                  name={f.key}
                  type={f.type}
                  maxLength={f.key === "name" ? 80 : 240}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete ?? "off"}
                  value={data[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </label>
          )
        )}

        {last && (
          <>
            <dl className="sh-onb-review">
              <div>
                <dt>Sending</dt>
                <dd>{kind === "coa" ? "A certificate" : "A vendor"}</dd>
              </div>
              {review.map((f) => (
                <div key={f.key}>
                  <dt>{f.label}</dt>
                  <dd>{data[f.key]}</dd>
                </div>
              ))}
            </dl>
            <button type="button" className={`lib-filter sh-onb-consent${consent ? " is-active" : ""}`} role="checkbox" aria-checked={consent} onClick={() => setConsent((c) => !c)}>
              <span className="sh-onb-box" aria-hidden="true">
                {consent && (
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              The details are accurate as far as I know, and I understand nobody pays to be listed or ranked.
            </button>
          </>
        )}

        {/* Honeypot: bots fill every field. */}
        <input name="website" type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" value={data.website ?? ""} onChange={(e) => set("website", e.target.value)} />

        {(error || state.kind === "error") && <p className="sh-form-error">{error ?? (state.kind === "error" ? state.message : "")}</p>}

        <div className="sh-form-foot sh-onb-foot">
          {step > 0 ? (
            <button type="button" className="lib-filter" onClick={back}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button className="btn btn-accent btn-tiny" type="submit" disabled={state.kind === "sending"}>
            {state.kind === "sending" ? "Sending" : last ? (kind === "coa" ? "Send the certificate" : "Send the vendor") : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
