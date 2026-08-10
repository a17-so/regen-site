"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "../lib/slides";

/**
 * Pinned feature section, the Superpower pattern.
 *
 * The page does NOT scroll through four separate coloured sections. A tall
 * outer track (one viewport per slide) provides the scroll distance, and a
 * sticky inner viewport stays fixed on screen while you move through it. What
 * changes is the content inside the pinned frame: the copy and the product
 * shot crossfade, the index rail advances, the background tint shifts a few
 * degrees. The illusion is that you are scrolling *within* one screen.
 *
 * Two things this gets right that a naive version doesn't:
 *  • Scroll position is read off the track's own bounding box rather than a
 *    global offset, so the section works wherever it sits on the page.
 *  • Reduced-motion falls back to plain stacked sections. Pinning hijacks the
 *    scroll, which is exactly what that preference is asking you not to do.
 */
export default function FeatureSlides() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPinned(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    let frame = 0;

    const read = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Distance the track can travel while the sticky child is pinned.
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      // Bias slightly past each boundary so the last slide gets a full beat
      // rather than flicking over in the final pixels.
      const i = Math.min(SLIDES.length - 1, Math.floor(progress * SLIDES.length * 0.999));
      setActive((prev) => (prev === i ? prev : i));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pinned]);

  // Clicking the index rail scrolls to that slide's slot in the track.
  const jump = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      // An explicit behavior option overrides the CSS reduced-motion guard,
      // so it has to be re-checked here.
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!pinned) {
        window.scrollTo({ top: el.offsetTop, behavior: "auto" });
        return;
      }
      const travel = el.offsetHeight - window.innerHeight;
      const top = el.offsetTop + (travel * i) / SLIDES.length + 8;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    },
    [pinned]
  );

  const current = SLIDES[active];

  // Sheet motion: states before the active slide have lifted up and away,
  // states after it wait below, so the crossfade always travels upward in
  // reading direction, and reverses when scrolling back.
  const stateClass = (i: number) =>
    i === active ? " on" : i < active ? " above" : "";

  return (
    <>
      <div
        className={`fs-track${pinned ? "" : " is-static"}`}
        id="features"
        ref={trackRef}
        style={pinned ? { height: `${SLIDES.length * 100}vh` } : undefined}
      >
        <div className={`fs-pin${current.darkInk ? " fs-ink-dark" : ""}`}>
          {/* One photo per slide, pushing through vertically with the copy. */}
          <div className="fs-bg" aria-hidden="true">
            {SLIDES.map((s, i) => (
              <div
                key={s.id}
                className={`fs-bg-photo${stateClass(i)}`}
                style={{ backgroundImage: `url(${s.bg})` }}
              />
            ))}
          </div>

          <div className="fs-inner">
            <div className="fs-copy">
              {SLIDES.map((s, i) => (
                <div
                  key={s.id}
                  className={`fs-copy-state${stateClass(i)}`}
                  aria-hidden={pinned && i !== active}
                >
                  <span className="fs-num">{s.index}</span>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>

            <nav className="fs-index" aria-label="Features">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  className={`fs-index-item${i === active ? " on" : ""}`}
                  onClick={() => jump(i)}
                  aria-current={i === active}
                >
                  <em>{s.index}</em>
                  <span>{s.navLabel}</span>
                </button>
              ))}
            </nav>

          </div>
        </div>
      </div>
    </>
  );
}
