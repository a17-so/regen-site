"use client";

import { useState } from "react";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; known: boolean } | { kind: "error"; message: string };

export default function SubmitVendorForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/vendors/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { known?: boolean; error?: string };
      if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
      setState({ kind: "done", known: Boolean(body.known) });
      form.reset();
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (state.kind === "done") {
    return (
      <div className="lib-facts-pane sh-form-done">
        <h2>{state.known ? "Already on the list" : "Received"}</h2>
        <p>
          {state.known
            ? "That store is already in the research set. Its page is in the vendors list."
            : "Thanks. New stores go through the research pipeline before they appear; that takes days, not minutes."}
        </p>
      </div>
    );
  }

  return (
    <form className="lib-facts-pane sh-form" onSubmit={onSubmit}>
      <label>
        Store URL
        <input name="url" type="url" required placeholder="https://" autoComplete="off" />
      </label>
      <label>
        Store name
        <input name="name" type="text" required maxLength={80} autoComplete="organization" />
      </label>
      <label>
        Why it belongs on the list
        <textarea name="notes" rows={4} maxLength={1500} placeholder="Testing lab, COA archive, who runs it, anything you know." />
      </label>
      <label>
        Your email (optional, if you want to hear back)
        <input name="email" type="email" autoComplete="email" />
      </label>
      {/* Honeypot: bots fill every field. */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      {state.kind === "error" && <p className="sh-form-error">{state.message}</p>}
      <button className="btn btn-sm btn-primary" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Sending" : "Submit"}
      </button>
    </form>
  );
}
