import Reveal from "./Reveal";

/**
 * Three steps, mirroring the shape of onboarding: state a goal, get a
 * protocol, track it. Deliberately the same promise the app makes on the way
 * in, so the page and the first run agree with each other.
 */
const STEPS: { step: string; title: string; body: string; img?: string }[] = [
  {
    step: "01",
    img: "/screens/screen-home.png",
    title: "Tell us your goal",
    body: "Recovery, body composition, sleep, longevity. A few questions, not a questionnaire, enough for REGEN to know what you're actually optimising for.",
  },
  {
    step: "02",
    img: "/screens/screen-inventory.png",
    title: "Get a protocol",
    body: "Goal-matched picks from a verified library of peptides, stacks, and guides, with the dosing, the timing, and the reconstitution math already worked out.",
  },
  {
    step: "03",
    img: "/screens/screen-biomarker.png",
    title: "Track it",
    body: "Check-ins, meals, doses, and bloodwork logged and graphed automatically, so you can see whether the thing you're paying for is doing anything.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="section-head">
        <span className="section-eyebrow">
          How it works
        </span>
        <h2 className="section-title">
          Three steps,{" "}
          <span className="muted-phrase">then it runs itself.</span>
        </h2>
      </div>

      <div className="how-grid">
        {STEPS.map((s, i) => (
          <Reveal key={s.step} delay={i * 90}>
            <article className="how-card">
              <div className="how-visual">
                <span className="how-step">{s.step}</span>
                {s.img && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={s.img} alt="" aria-hidden="true" loading="lazy" />
                )}
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
