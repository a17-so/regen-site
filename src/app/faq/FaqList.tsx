import { FAQS, type Faq } from "../lib/slides";
import { CATEGORIES } from "./categories";

/**
 * The questions, grouped by category under a kicker, each one a page-glass
 * pane that unfolds (the posts' `.lib-faq` details, Oasis-style rows). No
 * client state: the browser owns open and closed.
 */

/** "S, approved by…" → { letter: "S", text: "approved by…" } */
const splitTier = (b: string) => {
  const i = b.indexOf(", ");
  return { letter: b.slice(0, i), text: b.slice(i + 2) };
};

export default function FaqList() {
  return (
    <div className="faq-groups">
      {CATEGORIES.map((c) => {
        const items = c.ids.map((id) => FAQS.find((f) => f.id === id)).filter((f): f is Faq => Boolean(f));
        return (
          <section key={c.id} id={c.id} className="faq-group" aria-labelledby={`faq-k-${c.id}`}>
            <h2 id={`faq-k-${c.id}`} className="blog-kicker">
              {c.label}
              <span className="blog-kicker-n">{items.length}</span>
            </h2>
            <div className="lib-faq lib-faq--index">
              {items.map((f) => (
                <details key={f.id} id={`faq-${f.id}`}>
                  <summary>{f.q}</summary>
                  {f.a.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                  {f.bullets && (
                    <ul className="faq-tiers">
                      {f.bullets.map((b) => {
                        const t = splitTier(b);
                        return (
                          <li key={t.letter}>
                            <span className="faq-tier-chip" data-tier={t.letter.toLowerCase()}>
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
                </details>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
