"use client";

import { useEffect, useRef } from "react";

/**
 * The five feature boxes as a horizontal rail driven by vertical scroll.
 *
 * The wrapper (.rail) is tall; a sticky child (.rail-sticky) pins one
 * viewport while the page scrolls through that height, and the scroll
 * progress maps linearly onto the track's horizontal travel — panels slide
 * sideways one by one, and when the last panel is on screen the wrapper
 * runs out and the page continues down. No wheel hijacking: the scrollbar
 * stays honest, deep links and keyboard scrolling keep working.
 *
 * Under prefers-reduced-motion the JS never attaches and the CSS stacks
 * the panels as a plain vertical list.
 *
 * Each panel takes one of the four banner-tile gradients, laid out per the
 * reference: number and title left, the phone centre, description and
 * capability tags right. Numbers are the site's two-digit idiom.
 */

interface RailFeature {
  num: string;
  /** Brand-gradient key, matched by the .rp-* background classes. */
  tone: "warm" | "cool" | "gold" | "green" | "accent";
  title: string;
  desc: string;
  img: string;
  alt: string;
  tags: string[];
}

/* Five boxes, four gradients, the warm one twice (01 and 05, kept apart).
   The order — warm, cool, gold, green, warm — is the user's explicit pick. */
const FEATURES: RailFeature[] = [
  {
    num: "01",
    tone: "warm",
    title: "Your day, dialed.",
    desc: "Some doses need an empty stomach, some go with food. REGEN builds the day around each compound's timing rules, not a checklist.",
    img: "/screens/screen-home.png",
    alt: "REGEN's home screen counting down to the next dose, nutrition totals beneath",
    tags: ["Dose windows", "Fasted cues", "Cycle reminders"],
  },
  {
    num: "02",
    tone: "cool",
    title: "Numbers in, trends out.",
    desc: "Log free testosterone, lipid panels, glucose, sleep. REGEN charts the trend against your protocol, flags drift, and tells you when it's time to retest.",
    img: "/screens/screen-biomarker.png",
    alt: "REGEN's data screen highlighting a Vitamin D rise against the last panel",
    tags: ["30+ biomarkers", "Reference ranges", "Drift alerts"],
  },
  {
    num: "03",
    tone: "gold",
    title: "Macros without the spreadsheet.",
    desc: "Scan your meal and REGEN scores it against your cycle: calories, protein, carbs, and fat. On a GLP-1, protein matters as much as the dose.",
    img: "/screens/screen-meal.png",
    alt: "A meal logged in REGEN, calories and macros broken down from a photo",
    tags: ["Photo macro scan", "Food library", "Macro targets"],
  },
  {
    num: "04",
    tone: "green",
    title: "The library behind it all.",
    desc: "Pick a goal and REGEN narrows it down: fifty-plus peptides and curated stacks, what each compound does, and the guides to run it right.",
    img: "/screens/screen-library.png",
    alt: "REGEN's library tab, a featured stack over the searchable compound list",
    tags: ["50+ peptides", "Goal matching", "Guides"],
  },
  {
    num: "05",
    tone: "warm",
    title: "A second opinion, before you draw.",
    desc: "Ask REGEN AI about interactions, half-lives, or what a blood panel means. Every answer cites peer-reviewed research, not forum threads.",
    img: "/screens/screen-ai.png",
    alt: "REGEN AI answering a protocol question with citations shown inline",
    tags: ["Reconstitution calc.", "Bloodwork QA", "Stack analysis"],
  },
];

export default function FeatureRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rail = railRef.current;
    const trackEl = trackRef.current;
    if (!rail || !trackEl) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const total = rail.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const y = Math.min(Math.max(-rail.getBoundingClientRect().top, 0), total);
      // Travel comes from layout geometry, not scrollWidth: Chromium drops
      // the last panel's trailing margin from scrollable overflow, which
      // parked the final card flush right instead of centred. The end
      // margin mirrors the leading one, so: last card's far edge plus the
      // symmetric end inset, minus one viewport.
      const first = trackEl.firstElementChild as HTMLElement | null;
      const last = trackEl.lastElementChild as HTMLElement | null;
      if (!first || !last) return;
      const maxX = Math.max(
        0,
        last.offsetLeft + last.offsetWidth + first.offsetLeft - trackEl.clientWidth
      );
      trackEl.style.transform = `translate3d(${-(maxX * (y / total))}px, 0, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="rail" ref={railRef}>
      <div className="rail-sticky">
        <div className="rail-track" ref={trackRef}>
          {FEATURES.map((f) => (
            <section className={`rail-panel rp-${f.tone}`} key={f.num} aria-label={f.title}>
              <div className="rp-inner">
                <div className="rp-head">
                  <div className="rp-num">{f.num}</div>
                  <h3>{f.title}</h3>
                </div>
                <div className="rp-phone">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.alt} loading="lazy" decoding="async" />
                </div>
                <div className="rp-copy">
                  <p>{f.desc}</p>
                  <div className="rp-tags">
                    {f.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
