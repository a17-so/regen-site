import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { BlogAnalytics } from "./BlogAnalytics";

interface Author {
  initials: string;
  name: string;
  role: string;
}

interface PostMeta {
  title: string;
  category: string;
  date: string;
  readTime: string;
  cover: string;
  lead: string;
  author: Author;
  toc: { id: string; label: string }[];
  Content: () => React.JSX.Element;
}

function ReadingFreeTestosteroneContent() {
  return (
    <>
      <h2 id="why-free">01 — Why free, not total</h2>
      <p>
        Total testosterone counts every molecule in your blood, including the
        98% bound to SHBG and albumin and therefore unavailable to tissue. Free
        testosterone counts only the unbound fraction — the part that can
        actually do something. Two people with identical total numbers can have
        wildly different free values, and the symptoms track the free number,
        not the total.
      </p>

      <h2 id="shape">02 — The shape, not the number</h2>
      <p>
        One free T value is almost meaningless. Three values, taken at the same
        time of day, over a 90-day window, is a trend line. The trend line tells
        you whether the protocol is working. The single value tells you almost
        nothing.
      </p>
      <blockquote>
        If you remember nothing else: never make a protocol change off a single
        data point. Always wait for the trend.
      </blockquote>

      <h2 id="sample">03 — Sample size</h2>
      <p>
        The minimum useful sample for free T is three data points spanning at
        least 60 days. Five is better. Anything less and you&apos;re reacting
        to noise. The within-subject variability of free T on a fixed protocol
        is roughly ±12% — meaning a single 8% drop is well within noise.
      </p>

      <h2 id="seasonality">04 — Seasonality</h2>
      <p>
        Free T has a real, repeatable seasonal pattern. It peaks in late summer
        in most adults and troughs in late winter. The amplitude is small (about
        8–10% peak-to-trough), but it&apos;s enough to make a December reading
        look &ldquo;worse&rdquo; than an August one when nothing has actually
        changed.
      </p>
      <p>
        If you&apos;re comparing across more than four months, control for
        season. Compare January to last January, not January to last August.
      </p>

      <h2 id="confounders">05 — Confounders</h2>
      <ul>
        <li>
          <strong>Sleep debt</strong> — a single bad night can drop free T by
          20% the next morning. Don&apos;t draw labs the day after a red-eye.
        </li>
        <li>
          <strong>Acute illness</strong> — anything that spikes inflammation
          suppresses gonadal output. Wait two weeks past any cold or flu.
        </li>
        <li>
          <strong>SHBG drift</strong> — if SHBG moves significantly, the
          free-from-total calculation is unreliable. Insist on a direct
          equilibrium dialysis measurement, not a calculated free.
        </li>
        <li>
          <strong>Time of day</strong> — peak is between 7am and 9am. Always
          draw in that window, always.
        </li>
      </ul>

      <h2 id="action">06 — When to act</h2>
      <div className="callout">
        <strong>The threshold</strong>
        A confirmed trend (3+ points) outside the age-adjusted reference range,
        in the absence of any of the confounders above, is the threshold for a
        conversation with your clinician. Not a single value. Not a borderline
        trend with one confounder present.
      </div>
      <p>
        A protocol that produces a clean upward trend over 90 days, with each
        point above the previous one allowing for noise, is working. Don&apos;t
        change it. A protocol that produces a flat line for 90 days is not
        working, regardless of what the number is.
      </p>

      <h2 id="closing">07 — Closing</h2>
      <p>
        The point of biomarker tracking isn&apos;t to react to numbers.
        It&apos;s to see patterns. Patience pays here in a way it rarely does
        in the rest of self-experimentation.
      </p>
    </>
  );
}

function ReconstitutionContent() {
  return (
    <>
      <h2 id="why">01 — Why people get this wrong</h2>
      <p>
        The reconstitution math is actually trivial. The hard part is that you
        do it once, you understand it for ninety seconds, and then you forget it
        until next month — and next month you&apos;re tired, or distracted, or
        it&apos;s a different vial size, and you redo the calculation under
        pressure. That&apos;s where the errors enter.
      </p>

      <h2 id="math">02 — The math, once</h2>
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
        <strong>Example</strong>
        A 5 mg vial reconstituted with 2 mL of BAC water = 2,500 mcg/mL. A 250
        mcg dose is therefore (250 ÷ 2500) × 100 = 10 units on the syringe.
      </div>
      <p>
        That&apos;s it. The math doesn&apos;t get harder. Everything else is
        logistics and attention.
      </p>

      <h2 id="routine">03 — The routine</h2>
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
          push back into the vial and redraw. Don&apos;t shave to get exact —
          the small amount of air you compress in is harmless, the wrong dose is
          not.
        </li>
        <li>
          <strong>Log immediately.</strong> Not later. Not after the injection.
          Before. This is the single change that eliminates double-doses.
        </li>
      </ul>

      <h2 id="edge-cases">04 — Edge cases</h2>
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

      <h2 id="closing">05 — Closing</h2>
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

function RetatrutideContent() {
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

const POSTS: Record<string, PostMeta> = {
  "reading-free-testosterone": {
    title: "How to read a free testosterone trend line.",
    category: "Biomarkers",
    date: "May 12, 2026",
    readTime: "6 min read",
    cover: "/screens/screen-biomarker.png",
    lead: "Total testosterone is the number on the report. Free testosterone is the one that matters. The first is easy to measure and easy to misread. The second tells you almost everything — if you know what you're looking at.",
    author: { initials: "MT", name: "Marcus Tran", role: "Head of biomarkers, REGEN" },
    toc: [
      { id: "why-free", label: "01 Why free, not total" },
      { id: "shape", label: "02 The shape, not the number" },
      { id: "sample", label: "03 Sample size" },
      { id: "seasonality", label: "04 Seasonality" },
      { id: "confounders", label: "05 Confounders" },
      { id: "action", label: "06 When to act" },
      { id: "closing", label: "07 Closing" },
    ],
    Content: ReadingFreeTestosteroneContent,
  },
  "reconstitution-without-anxiety": {
    title: "Reconstitution math, without the anxiety.",
    category: "Protocols",
    date: "May 4, 2026",
    readTime: "5 min read",
    cover: "/screens/screen-inventory.png",
    lead: "Most reconstitution mistakes are not arithmetic errors. They are attention errors. A two-step routine that removes most of the cognitive load — and most of the fear — from the moment you draw.",
    author: { initials: "JA", name: "Jordan Avery", role: "Engineer, REGEN" },
    toc: [
      { id: "why", label: "01 Why people get this wrong" },
      { id: "math", label: "02 The math, once" },
      { id: "routine", label: "03 The routine" },
      { id: "edge-cases", label: "04 Edge cases" },
      { id: "closing", label: "05 Closing" },
    ],
    Content: ReconstitutionContent,
  },
  "retatrutide-vs-tirzepatide": {
    title: "Retatrutide vs Tirzepatide: a practical comparison.",
    category: "Protocols",
    date: "May 18, 2026",
    readTime: "8 min read",
    cover: "/screens/screen-biomarker.png",
    lead: "Two molecules, two pharmacokinetic profiles, two very different titration curves. If you're choosing between Retatrutide and Tirzepatide for the next year, the decision is rarely about the numbers in the headline trials — it's about how the molecule behaves on weeks five and six, when most protocols quietly fall apart.",
    author: { initials: "LK", name: "Dr. Lena Karpov", role: "Clinical lead, REGEN" },
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
    Content: RetatrutideContent,
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return { title: `${post.title} — REGEN` };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const appStoreUrl = buildAppStoreUrl();
  const { Content } = post;

  return (
    <>
      <BlogAnalytics slug={slug} />
      <Nav appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <article className="legal-page">
          <div className="legal-head">
            <h1>{post.title}</h1>
            <div className="post-meta-row">
              <span className="cat">{post.category}</span>
              <span>{post.date}</span>
              <span className="dot"></span>
              <span>{post.readTime}</span>
            </div>
            <div className="post-hero">
              <div
                className="hero-img"
                style={{ backgroundImage: `url(${post.cover})` }}
              />
            </div>
            <p className="post-lead">{post.lead}</p>
          </div>

          <div className="legal-body">
            <aside className="legal-toc">
              {post.toc.map((t) => (
                <a key={t.id} href={`#${t.id}`}>
                  {t.label}
                </a>
              ))}
            </aside>
            <div className="legal-content">
              <Content />
              <div className="post-footer">
                <div className="author">
                  <div className="author-avatar">{post.author.initials}</div>
                  <div>
                    <div className="author-name">{post.author.name}</div>
                    <div className="author-role">{post.author.role}</div>
                  </div>
                </div>
                <a className="btn-ghost" href="/blog">
                  ← All articles
                </a>
              </div>
            </div>
          </div>
        </article>
        <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
