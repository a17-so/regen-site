"use client";

import { useState } from "react";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

/** The hero's subscribe field. Posts to the newsletter route the footer uses. */
export default function SubscribeForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) return;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "science" }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? (res.status === 503 ? "Signups are not open yet." : "Could not subscribe."));
      setState({ kind: "done" });
      form.reset();
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Could not subscribe." });
    }
  }
  if (state.kind === "done") return <p className="sc-sub-done">You&apos;re in. New research lands in your inbox.</p>;
  return (
    <form className="sc-sub" onSubmit={onSubmit}>
      <input name="email" type="email" required placeholder="Enter email" aria-label="Email address" autoComplete="email" />
      <button className="btn btn-sm btn-primary" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Sending" : "Subscribe"}
      </button>
      {state.kind === "error" && <span className="sc-sub-error">{state.message}</span>}
    </form>
  );
}
