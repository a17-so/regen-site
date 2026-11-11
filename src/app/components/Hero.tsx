"use client";

import { useEffect, useRef } from "react";
import { track } from "../lib/analytics";
import GetAppButton from "./GetAppButton";
import type { QrMatrix } from "../lib/qr";

interface HeroProps {
  appStoreUrl: string;
  qr: QrMatrix;
  /** Preformatted Firestore counts (see lib/stats.ts), null when a count
   *  is too small to carry weight — the row simply omits that stat. */
  doses: string | null;
  sources: string | null;
}

/** The fan at the foot of the hero, read left to right. The dose dial
 *  stands upright in the middle — the flowiest, most REGEN-specific screen
 *  in the set — with the two it leads to angled away behind it. Same files
 *  the feature rail loads, so the hero adds no transfer the page wasn't
 *  already paying. */
const FAN = [
  { src: "/screens/screen-ai.png", cls: "fan-l" },
  { src: "/screens/screen-home.png", cls: "fan-c" },
  { src: "/screens/screen-biomarker.png", cls: "fan-r" },
];

/**
 * Centred opener on plain white: no panel, no wash, nothing boxed. The
 * column runs the two-line headline (second line carries the accent), the
 * sub with the three counts folded into it as words, the store button
 * beside a quiet secondary; the phone fan closes the fold, the outer two
 * rotated away from the centre screen and every bottom edge dissolving
 * into the white. The chip row and the stat row were trimmed on
 * 2026-11-09 (approved homepage trims).
 */
export default function Hero({ appStoreUrl, qr, doses, sources }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("hero_viewed");
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const counts = ["67+ compounds", doses && `${doses} doses logged`, sources && `${sources} sources cited`].filter(
    (c): c is string => Boolean(c)
  );
  const countLine = counts.length > 1 ? `${counts.slice(0, -1).join(", ")} and ${counts[counts.length - 1]}.` : `${counts[0]}.`;

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-copy">
        <h1>
          The Personalized
          <br />
          <span className="muted-phrase">Peptide Care App.</span>
        </h1>

        <p className="hero-sub">
          Pick a goal. REGEN finds the peptides for it, a tested source to get
          them from, and when to take them, then shows you the number moving.
          For a first protocol and for the people deep in one. {countLine}
        </p>

        <div className="hero-cta">
          <GetAppButton
            appStoreUrl={appStoreUrl}
            qr={qr}
            label="Get the app"
            location="hero"
            size="lg"
            align="center"
            drop="up"
          />
          <a
            className="btn btn-glass"
            href="/library"
            onClick={() => track("hero_secondary_click")}
          >
            Browse the Library
          </a>
        </div>
      </div>

      {/* Decorative: the feature rail names every one of these screens, so
          the whole fan is hidden from the tree. */}
      <div className="hero-fan" aria-hidden="true">
        {FAN.map(({ src, cls }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={cls} key={src} src={src} alt="" decoding="async" />
        ))}
      </div>
    </section>
  );
}
