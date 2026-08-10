"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

export default function SubmitForm() {
  const [compound, setCompound] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  const remaining = 600 - body.length;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ compound, body, website }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setState("sent");
      setCompound("");
      setBody("");
    } catch {
      setState("error");
      setMessage("Couldn't reach the server.");
    }
  }

  if (state === "sent") {
    return (
      <div className="cn-form cn-form-done">
        <h3>Sent for review.</h3>
        <p>
          A human reads every submission before it appears. Nothing is published
          automatically, and nothing identifying was attached to it.
        </p>
        <button className="btn btn-sm btn-glass" onClick={() => setState("idle")}>
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form className="cn-form" onSubmit={submit}>
      <h3>Add a note</h3>
      <p className="cn-form-lede">
        No account, no email, nothing tied to you. Write what you actually
        observed, not what you read somewhere.
      </p>

      <label className="cn-field">
        <span>Compound</span>
        <input
          value={compound}
          onChange={(e) => setCompound(e.target.value)}
          placeholder="BPC-157"
          maxLength={60}
          required
        />
      </label>

      <label className="cn-field">
        <span>Your note</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 600))}
          placeholder="What you ran, for how long, and what actually changed."
          rows={5}
          required
        />
        <span className={`cn-count${remaining < 60 ? " low" : ""}`}>
          {remaining} left
        </span>
      </label>

      {/* Honeypot, visually hidden, never focusable, bots fill it anyway. */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {state === "error" && <p className="cn-error">{message}</p>}

      <button
        className="btn btn-accent"
        type="submit"
        disabled={state === "sending" || compound.length < 2 || body.trim().length < 20}
      >
        {state === "sending" ? "Sending…" : "Submit anonymously"}
      </button>

      <p className="cn-legal">
        Don&apos;t include anything that identifies you or anyone else.
        Submissions are moderated, and notes are experience reports, not
        medical advice, and not evidence.
      </p>
    </form>
  );
}
