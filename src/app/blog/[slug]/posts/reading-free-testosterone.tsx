import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="why-free">01 • Why free, not total</h2>
      <p>
        Total testosterone counts every molecule in your blood, including the
        98% bound to SHBG and albumin and therefore unavailable to tissue. Free
        testosterone counts only the unbound fraction, the part that can
        actually do something. Two people with identical total numbers can have
        wildly different free values, and the symptoms track the free number,
        not the total.
      </p>

      <h2 id="shape">02 • The shape, not the number</h2>
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

      <PostCta variant="labs" />

      <h2 id="sample">03 • Sample size</h2>
      <p>
        The minimum useful sample for free T is three data points spanning at
        least 60 days. Five is better. Anything less and you&apos;re reacting
        to noise. The within-subject variability of free T on a fixed protocol
        is roughly ±12%, meaning a single 8% drop is well within noise.
      </p>

      <h2 id="seasonality">04 • Seasonality</h2>
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

      <h2 id="confounders">05 • Confounders</h2>
      <ul>
        <li>
          <strong>Sleep debt</strong>: a single bad night can drop free T by
          20% the next morning. Don&apos;t draw labs the day after a red-eye.
        </li>
        <li>
          <strong>Acute illness</strong>: anything that spikes inflammation
          suppresses gonadal output. Wait two weeks past any cold or flu.
        </li>
        <li>
          <strong>SHBG drift</strong>: if SHBG moves significantly, the
          free-from-total calculation is unreliable. Insist on a direct
          equilibrium dialysis measurement, not a calculated free.
        </li>
        <li>
          <strong>Time of day</strong>: peak is between 7am and 9am. Always
          draw in that window, always.
        </li>
      </ul>

      <h2 id="action">06 • When to act</h2>
      <div className="callout">
        <strong>The threshold</strong>: A confirmed trend (3+ points) outside
        the age-adjusted reference range,
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

      <PostCta variant="ai" />

      <h2 id="closing">07 • Closing</h2>
      <p>
        The point of biomarker tracking isn&apos;t to react to numbers.
        It&apos;s to see patterns. Patience pays here in a way it rarely does
        in the rest of self-experimentation.
      </p>
    </>
  );
}

const post: PostMeta = {
  title: "How to read a free testosterone trend line.",
  category: "Biomarkers",
  date: "May 12, 2026",
  readTime: "6 min read",
  cover: "/blog/reading-free-testosterone/cover",
  lead: "Total testosterone is the number on the report. Free testosterone is the one that matters. The first is easy to measure and easy to misread. The second tells you almost everything, if you know what you're looking at.",
  author: { initials: "AA", name: "Advaith Akella", role: "REGEN Editorial" },
  toc: [
    { id: "why-free", label: "01 Why free, not total" },
    { id: "shape", label: "02 The shape, not the number" },
    { id: "sample", label: "03 Sample size" },
    { id: "seasonality", label: "04 Seasonality" },
    { id: "confounders", label: "05 Confounders" },
    { id: "action", label: "06 When to act" },
    { id: "closing", label: "07 Closing" },
  ],
  Content,
};

export default post;
