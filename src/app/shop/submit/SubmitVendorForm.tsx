"use client";

import { useState } from "react";
import SegBar from "../SegBar";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; known: boolean } | { kind: "error"; message: string };
type Kind = "vendor" | "coa";

/**
 * The submission form: one pane, a vendor / certificate switch (the
 * shop's segmented bar), then hairline fields (no white boxes on grey glass),
 * then the one accent button.
 */
export default function SubmitVendorForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [kind, setKind] = useState<Kind>("vendor");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (kind === "coa") data.notes = `[Certificate] ${String(data.notes ?? "")}`.trim();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/vendors/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { known?: boolean; error?: string };
      if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
      setState({ kind: "done", known: Boolean(body.known) && kind === "vendor" });
      form.reset();
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
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
          <button type="button" className="lib-filter" onClick={() => setState({ kind: "idle" })}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  const urlLabel = kind === "vendor" ? "Store URL" : "Link to the certificate";
  return (
    <form className="sh-pane sh-form" onSubmit={onSubmit}>
      <SegBar
        small
        label="What are you sending"
        value={kind}
        onChange={setKind}
        options={[
          { value: "vendor", label: "A vendor" },
          { value: "coa", label: "A certificate" },
        ]}
      />
      <label className="sh-field">
        <span>{urlLabel}</span>
        <input name="url" type="url" required placeholder="https://" autoComplete="off" />
      </label>
      <label className="sh-field">
        <span>{kind === "vendor" ? "Store name" : "Which store issued it"}</span>
        <input name="name" type="text" required maxLength={80} autoComplete="organization" placeholder={kind === "vendor" ? "Store name" : "Store name"} />
      </label>
      <label className="sh-field">
        <span>{kind === "vendor" ? "Why it belongs on the list" : "What it covers"}</span>
        <textarea
          name="notes"
          rows={3}
          maxLength={1500}
          placeholder={kind === "vendor" ? "Testing lab, COA archive, who runs it, anything you know." : "Compound, batch number, lab, test date."}
        />
      </label>
      <label className="sh-field">
        <span>
          Your email <em>optional, to hear back</em>
        </span>
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </label>
      {/* Honeypot: bots fill every field. */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      {state.kind === "error" && <p className="sh-form-error">{state.message}</p>}
      <div className="sh-form-foot">
        <button className="btn btn-accent btn-tiny" type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending" : kind === "vendor" ? "Submit the vendor" : "Submit the certificate"}
        </button>
        <span className="sh-sub">Nobody pays to be listed or ranked.</span>
      </div>
    </form>
  );
}
