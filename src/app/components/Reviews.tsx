import { REVIEWS } from "../lib/reviews";
import Reveal from "./Reveal";

/**
 * Member stories in a single moving row.
 *
 * A three-column wall was eating most of a viewport for nine short quotes.
 * One marquee says the same thing in a fraction of the height, and the motion
 * signals there are more without needing a control. Duplicated once so the
 * -50% keyframe loops seamlessly; pauses on hover so a quote can be read.
 */
export default function Reviews() {
  return (
    <section className="rv" id="stories">
      <Reveal className="section-head rv-head">
        <h2 className="section-title">
          What changed
          <br />
          <span className="accent-phrase">once it was all in one place.</span>
        </h2>
        <p className="section-lede">What some of our early users are saying about their experience.</p>
      </Reveal>

      <div className="rv-mask">
        <div className="rv-track">
          {/* The loop needs the row twice for the -50% keyframe, but only
              one copy should exist for assistive tech, the second set is
              aria-hidden, and drops entirely in touch/reduced-motion modes
              where the row scrolls instead of sliding. */}
          {[false, true].map((dupe) => (
            <div
              key={dupe ? "dupe" : "set"}
              className={`rv-set${dupe ? " rv-set-dupe" : ""}`}
              aria-hidden={dupe || undefined}
            >
              {REVIEWS.map((r) => (
                <figure className="rv-card" key={r.id}>
                  <blockquote>{r.body}</blockquote>
                  <figcaption>
                    <strong className="rv-name">
                      {r.name}, {r.age}
                    </strong>
                    <span className="rv-sub">
                      <span>
                        {r.region} · {r.status}
                      </span>
                      {r.renewal && <span className="rv-chip">{r.renewal}</span>}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
