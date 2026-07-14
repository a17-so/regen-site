import { JsonLd } from "./JsonLd";

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItem[] = [
  { q: "Is REGEN giving medical advice?", a: "No. REGEN is a tracking and reference tool for adults who have already decided to run a protocol. Every dose calculation cites its source. We do not prescribe, diagnose, or recommend — you and your clinician do that." },
  { q: "Which peptides are supported?", a: "50+ at launch, including Retatrutide, Tirzepatide, Semaglutide, BPC-157, TB-500, CJC-1295 (with and without DAC), Ipamorelin, IGF-1 LR3, MOTS-c, Epitalon, and the full GHRP family. We add new ones every release." },
  { q: "How does REGEN AI work?", a: "It's a fine-tuned model trained exclusively on peer-reviewed literature, clinical trial data, and pharmacokinetic studies. It will not answer from forum posts or anecdotes. Every response is cited and traceable to the source paper." },
  { q: "Is my data private?", a: "Yes. End-to-end encrypted, stored only on your device by default. Opt-in cloud sync uses zero-knowledge encryption — we can't read your protocols even if we wanted to. We never sell data and we never will." },
  { q: "Does the reconstitution calculator handle multi-peptide blends?", a: "Yes. Input the mg of each peptide, the BAC water volume, and the syringe size — REGEN returns units-per-click for every component, and warns on solubility conflicts." },
  { q: "Can I share my protocol with a coach or clinician?", a: "Yes. Generate a read-only link that includes your active stack, dose schedule, recent biomarkers, and notes. Revoke access at any time. Coaches on REGEN Pro can manage multiple shared protocols from one dashboard." },
  { q: "How much does it cost?", a: "Free for the basic tracker. REGEN Pro ($14/mo or $120/yr) unlocks the AI, biomarker trends, photo meal scan, and unlimited shared protocols. Coaches get team pricing." },
  { q: "Can I import from a spreadsheet?", a: "Yes. Drop in a CSV with dose, peptide, date and REGEN reconstructs your history, fills in gaps with reasonable defaults, and asks you to confirm. Most people migrate in under 20 minutes." },
];

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function FAQ() {
  return (
    <section id="faq" className="faq">
      <JsonLd data={FAQ_LD} />

      <div className="faq-head">
        <h2 className="section-title">
          Answers, before
          <br />
          <span className="muted-phrase">you have to ask.</span>
        </h2>
        <p className="faq-quote">
          &ldquo;Anyone running peptides is already past the point where vague
          answers help. So we don&apos;t give them.&rdquo; — REGEN team
        </p>
      </div>
      <div className="faq-grid">
        {FAQ_ITEMS.map((item, i) => (
          <details className="faq-item" key={i}>
            <summary>
              {item.q}
              <span className="plus"></span>
            </summary>
            <div className="answer">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
