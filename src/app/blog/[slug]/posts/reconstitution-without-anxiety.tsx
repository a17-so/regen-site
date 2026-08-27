import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="why"><span className="lib-ch-num" aria-hidden="true">01</span>Why people get this wrong</h2>
      <p>
        The reconstitution math is actually trivial. The hard part is that you
        do it once, you understand it for ninety seconds, and then you forget it
        until next month, and next month you&apos;re tired, or distracted, or
        it&apos;s a different vial size, and you redo the calculation under
        pressure. That&apos;s where the errors enter.
      </p>

      <h2 id="math"><span className="lib-ch-num" aria-hidden="true">02</span>The math, once</h2>
      <p>For any peptide, the formula is the same:</p>
      <p>
        <strong>
          units per click = (dose in mcg ÷ concentration in mcg/mL) ×
          syringe-units-per-mL
        </strong>
      </p>
      <p>
        For a U-100 insulin syringe (the only kind anyone should be using for
        these doses), syringe-units-per-mL is 100. So:
      </p>
      <div className="callout">
        <strong>Example</strong>: A 5 mg vial reconstituted with 2 mL of BAC
        water = 2,500 mcg/mL. A 250
        mcg dose is therefore (250 ÷ 2500) × 100 = 10 units on the syringe.
      </div>
      <p>
        That&apos;s it. The math doesn&apos;t get harder. Everything else is
        logistics and attention.
      </p>

      <PostCta variant="vials" />

      <h2 id="routine"><span className="lib-ch-num" aria-hidden="true">03</span>The routine</h2>
      <p>This is the routine we recommend, in order, every time:</p>
      <ul>
        <li>
          <strong>Pre-flight, on paper.</strong> Before touching a needle, write
          the dose, the vial concentration, and the units on a piece of paper or
          in REGEN. Don&apos;t compute in your head at the moment of drawing.
        </li>
        <li>
          <strong>Check the vial label.</strong> Out loud. The mg quantity, the
          lot, and the expiry. Errors here are catastrophic and surprisingly
          common.
        </li>
        <li>
          <strong>Reconstitute slowly.</strong> Aim BAC water at the side of
          the vial, not directly at the lyophilized cake. Swirl, don&apos;t
          shake. Wait until the solution is fully clear before drawing.
        </li>
        <li>
          <strong>Draw the exact number, then stop.</strong> If you overshoot,
          push back into the vial and redraw. Don&apos;t shave to get exact,
          the small amount of air you compress in is harmless, the wrong dose is
          not.
        </li>
        <li>
          <strong>Log immediately.</strong> Not later. Not after the injection.
          Before. This is the single change that eliminates double-doses.
        </li>
      </ul>

      <h2 id="edge-cases"><span className="lib-ch-num" aria-hidden="true">04</span>Edge cases</h2>
      <p>
        <strong>Multi-peptide blends.</strong> Same math, just done per
        component. Don&apos;t try to do it in your head. Use the calculator.
      </p>
      <p>
        <strong>Different syringe sizes.</strong> If you&apos;re using anything
        other than a U-100 1mL insulin syringe, stop and use one. The U-100
        1mL is the standard for a reason: the math is clean, the calibration is
        precise, the unit increments are visible.
      </p>
      <p>
        <strong>Refrigeration interruptions.</strong> A few hours at room
        temperature is fine for most reconstituted peptides. A day is not. If
        you find a vial that&apos;s been out longer than overnight, dispose of
        it. The cost of a vial is much less than the cost of a contaminated
        dose.
      </p>

      <PostCta variant="protocol" />

      <h2 id="closing"><span className="lib-ch-num" aria-hidden="true">05</span>Closing</h2>
      <p>
        The right way to think about reconstitution is not as a calculation to
        perform, but as a routine to execute. A consistent five-step routine,
        followed every time, eliminates the conditions that produce errors. The
        arithmetic is easy. The discipline of doing the same five things in the
        same order is what makes it safe.
      </p>
    </>
  );
}

const post: PostMeta = {
  title: "Reconstitution math, without the anxiety.",
  category: "Protocols",
  date: "May 4, 2026",
  readTime: "5 min read",
  cover: "/blog/reconstitution-without-anxiety/cover",
  lead: "Most reconstitution mistakes are not arithmetic errors. They are attention errors. A two-step routine that removes most of the cognitive load, and most of the fear, from the moment you draw.",
  takeaways: [
    "Most reconstitution mistakes are attention errors, not arithmetic errors.",
    "The math is one formula done once; the routine is what keeps it safe under pressure.",
    "A consistent five-step routine removes the conditions that produce dosing errors.",
  ],
  author: { initials: "AA", name: "Advaith Akella", role: "REGEN Editorial" },
  toc: [
    { id: "why", label: "01 Why people get this wrong" },
    { id: "math", label: "02 The math, once" },
    { id: "routine", label: "03 The routine" },
    { id: "edge-cases", label: "04 Edge cases" },
    { id: "closing", label: "05 Closing" },
  ],
  Content,
};

export default post;
