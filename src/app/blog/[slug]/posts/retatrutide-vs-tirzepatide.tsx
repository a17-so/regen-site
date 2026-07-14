import type { PostMeta } from "./types";

function Content() {
  return (
    <>
      <h2 id="mechanism">01 — The mechanism</h2>
      <p>
        Tirzepatide is a dual agonist: GLP-1 and GIP. Retatrutide goes a step
        further with a triple agonist: GLP-1, GIP, and glucagon. That third
        receptor — the glucagon one — is what people get excited about.
        It&apos;s also what makes Retatrutide harder to titrate.
      </p>
      <p>
        The glucagon arm increases resting energy expenditure modestly but
        consistently. In aggregate that&apos;s helpful. Day-to-day, it can also
        produce nausea patterns that don&apos;t track cleanly to dose, which
        we&apos;ll come back to in section 03.
      </p>

      <h2 id="pk">02 — Pharmacokinetics</h2>
      <p>
        Both are once-weekly, both peak around 24–48 hours, both have terminal
        half-lives in the 5–7 day range. The clean conclusion from this is:{" "}
        <strong>your trough day is week + 6</strong>. Not week + 5. Not week +
        7. If you log symptoms, log them with that anchor.
      </p>
      <blockquote>
        The mistake we see most often is people titrating off the day they
        injected. The dose stays in effect long after the day of administration
        — your titration window is the trough day, not injection day.
      </blockquote>

      <h2 id="titration">03 — Titration in practice</h2>
      <p>
        Tirzepatide titrates cleanly. The textbook 2.5 → 5 → 7.5 → 10 → 12.5
        → 15 mg ladder works for most people, and the upper rungs are where the
        weight effect lives.
      </p>
      <p>
        Retatrutide does not titrate cleanly. The published phase 2 used 2 → 4
        → 8 → 12 mg, but in our clinic the better real-world ladder is 2 → 3 →
        4 → 6 → 8 mg, with the option to plateau at 6 indefinitely. The body
        acclimates more slowly to the glucagon arm, and the nausea pattern in
        weeks 4–6 catches people off guard.
      </p>
      <div className="callout">
        <strong>Our rule of thumb</strong>
        If a patient reaches the next dose and still feels nausea at trough day,
        hold the current dose for an additional two weeks. Don&apos;t reverse —
        hold.
      </div>

      <h2 id="weight">04 — Weight outcomes</h2>
      <p>
        In the head-to-head data we have so far (and we don&apos;t have a true
        RCT, so treat this carefully), Retatrutide produces roughly 24% mean
        weight loss at 48 weeks vs roughly 21% for Tirzepatide. That gap widens
        at month 18.
      </p>
      <p>
        Practically: if your goal is the last 10 lbs, Retatrutide. If your goal
        is the first 30 lbs and you want a forgiving titration, Tirzepatide.
      </p>

      <h2 id="cardio">05 — Cardio markers</h2>
      <p>
        Both improve ApoB, both improve triglycerides, both lower hsCRP.
        Retatrutide pulls A1c down faster but not lower at steady state.
        We&apos;ve seen LDL-C drift down on Retatrutide more than Tirzepatide,
        possibly via the glucagon-mediated increase in hepatic lipid oxidation,
        but this is preliminary.
      </p>

      <h2 id="side-effects">06 — Side effects</h2>
      <p>
        Side effect profiles overlap significantly: nausea, transient
        injection-site soreness, occasional constipation. The signal that
        differs is heart rate. Retatrutide produces a small (4–6 bpm) sustained
        increase in resting heart rate; Tirzepatide does not. If your patient is
        hypertensive or has any history of arrhythmia, that&apos;s the deciding
        factor.
      </p>

      <h2 id="choice">07 — How we&apos;d choose</h2>
      <ul>
        <li>
          <strong>Choose Retatrutide if:</strong> you&apos;ve already tolerated
          GLP-1s, you&apos;re aiming for the deeper end of weight outcomes, your
          cardio markers can absorb a small HR bump.
        </li>
        <li>
          <strong>Choose Tirzepatide if:</strong> you&apos;re new to GLP-1s,
          you want a predictable titration, or you have any cardiac sensitivity.
        </li>
      </ul>

      <h2 id="closing">08 — Closing</h2>
      <p>
        Neither molecule is &ldquo;better.&rdquo; They&apos;re better at
        different things. The right question isn&apos;t which one you should be
        on; it&apos;s which one matches the next 12 months of your life. If
        your job, sleep, and stress are stable, Retatrutide rewards patience. If
        they&apos;re not, Tirzepatide is the safer call.
      </p>
      <p>
        We update this analysis every quarter as new data lands. Subscribe to be
        notified.
      </p>
    </>
  );
}

const post: PostMeta = {
  title: "Retatrutide vs Tirzepatide: a practical comparison.",
  category: "Protocols",
  date: "May 18, 2026",
  readTime: "8 min read",
  cover: "/screens/screen-biomarker.png",
  lead: "Two molecules, two pharmacokinetic profiles, two very different titration curves. If you're choosing between Retatrutide and Tirzepatide for the next year, the decision is rarely about the numbers in the headline trials — it's about how the molecule behaves on weeks five and six, when most protocols quietly fall apart.",
  author: { initials: "AA", name: "Advaith Akella", role: "REGEN Editorial" },
  toc: [
    { id: "mechanism", label: "01 The mechanism" },
    { id: "pk", label: "02 Pharmacokinetics" },
    { id: "titration", label: "03 Titration in practice" },
    { id: "weight", label: "04 Weight outcomes" },
    { id: "cardio", label: "05 Cardio markers" },
    { id: "side-effects", label: "06 Side effects" },
    { id: "choice", label: "07 How we'd choose" },
    { id: "closing", label: "08 Closing" },
  ],
  Content,
};

export default post;
