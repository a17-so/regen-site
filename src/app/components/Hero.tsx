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

const CHIPS = ["Peptides & GLP-1s", "Dose tracking", "Cited research"];

/**
 * Centred opener on plain white — no panel, no wash, nothing boxed. The
 * column runs chips, two-line headline (second line carries the accent),
 * sub, the download button beside a quiet secondary, the stat row; the
 * phone fan closes the fold, the outer two rotated away from the centre
 * screen and every bottom edge dissolving into the white.
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

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-copy">
        <div className="hero-chips">
          {CHIPS.map((c) => (
            <span className="chip" key={c}>
              {c}
            </span>
          ))}
        </div>

        <h1>
          The Personalized
          <br />
          <span className="muted-phrase">Peptide Care App.</span>
        </h1>

        <p className="hero-sub">
          REGEN tracks every vial, every dose, every biomarker, and gives
          you an AI second opinion before you draw. Built for the people
          who run their own protocols.
        </p>

        <div className="hero-cta">
          <GetAppButton
            appStoreUrl={appStoreUrl}
            qr={qr}
            label="Download now"
            location="hero"
            size="lg"
            align="center"
            drop="up"
          />
          <a
            className="btn btn-glass"
            href="/tools"
            onClick={() => track("hero_secondary_click")}
          >
            Try the free tools
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <div className="stat-num">67+</div>
            <div className="stat-lbl">compounds supported</div>
          </div>
          {doses && (
            <div>
              <div className="stat-num">{doses}</div>
              <div className="stat-lbl">Doses logged</div>
            </div>
          )}
          {sources && (
            <div>
              <div className="stat-num">{sources}</div>
              <div className="stat-lbl">Sources cited</div>
            </div>
          )}
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
