import Reveal from "./Reveal";

/**
 * The five problem slides, lifted verbatim from the app's onboarding carousel
 * (Features/Onboarding/Views/Problem/ProblemCarouselView.swift, the
 * `ProblemSlide` array). Not rewritten for web on purpose, this copy is
 * already converting inside the app, and a second variant would only dilute
 * it and drift out of sync the next time onboarding changes.
 *
 * The app hand-breaks every title and subtitle into exactly two lines to hold
 * its layout. On the web the column width does that job, so the line breaks
 * are dropped and the words are untouched.
 */
const PROBLEMS: { title: string; subtitle: string }[] = [
  {
    title: "The peptide world is pure chaos",
    subtitle:
      "thousands of compounds and no idea what to buy, how to reconstitute, or how to dose",
  },
  {
    title: "You're burning money on guesswork",
    subtitle:
      "hundreds spent on vials while nothing you can actually measure changes",
  },
  {
    title: "Your health runs blind on cycle",
    subtitle:
      "no bloodwork, no tracking, no idea what your peptides are doing inside your body",
  },
  {
    title: "The vial you buy isn't what it says",
    subtitle:
      "underdosed, mislabeled, or contaminated with something you never agreed to inject",
  },
  {
    title: "Every peptide claim, zero real proof",
    subtitle:
      "everyone sells you the promise and nobody shows you the evidence",
  },
];

export default function Problem() {
  return (
    <section className="problem" id="problem">
      <div className="section-head">
        <h2 className="section-title">
          Five things everyone{" "}
          <span className="muted-phrase">running peptides already knows.</span>
        </h2>
      </div>

      <div className="problem-grid">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.title} delay={i * 60}>
            <article className="problem-card">
              <h3>{p.title}</h3>
              <p>{p.subtitle}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
