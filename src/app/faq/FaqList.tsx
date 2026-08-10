"use client";

import { useState } from "react";
import { FAQS, type Faq } from "../lib/slides";
import { CATEGORIES } from "./categories";

/**
 * The question list: categories in page order, each an anchor target for
 * the rail, rows opening independently. Answers stay in the DOM collapsed
 * (the 0fr→1fr grid transition), so open/close animates at whatever height
 * the copy needs without measuring anything.
 */

/** "S, approved by…" → { letter: "S", text: "approved by…" } */
const splitTier = (b: string) => {
  const i = b.indexOf(", ");
  return { letter: b.slice(0, i), text: b.slice(i + 2) };
};

export default function FaqList() {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="faq-cols">
      {CATEGORIES.map((c) => {
        const items = c.ids
          .map((id) => FAQS.find((f) => f.id === id))
          .filter((f): f is Faq => Boolean(f));
        return (
          <section key={c.id} id={c.id} className="faq-cat">
            <h2 className="faq-cat-head">{c.label}</h2>
            <div className="faq-rows">
              {items.map((f) => {
                const isOpen = open.has(f.id);
                return (
                  <div key={f.id} className={`faq-row${isOpen ? " open" : ""}`}>
                    <button
                      className="faq-q"
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${f.id}`}
                      onClick={() => toggle(f.id)}
                    >
                      <span>{f.q}</span>
                      <i aria-hidden="true" />
                    </button>
                    <div className="faq-a" id={`faq-a-${f.id}`}>
                      <div className="faq-a-inner">
                        {f.a.map((p) => (
                          <p key={p.slice(0, 24)}>{p}</p>
                        ))}
                        {f.bullets && (
                          <ul className="faq-tiers">
                            {f.bullets.map((b) => {
                              const t = splitTier(b);
                              return (
                                <li key={t.letter}>
                                  <span
                                    className="faq-tier-chip"
                                    data-tier={t.letter.toLowerCase()}
                                  >
                                    {t.letter}
                                  </span>
                                  <span>{t.text}</span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        {f.refs && (
                          <p className="faq-refs">
                            {f.refs.map((r) => (
                              <a key={r.href} href={r.href}>
                                {r.label} <span aria-hidden="true">→</span>
                              </a>
                            ))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
