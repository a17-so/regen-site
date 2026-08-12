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

/** One conveyor of app screens, the dose dial leading — the flowiest,
 *  most REGEN-specific screen in the set. Same files the feature rail
 *  loads, so the hero adds no transfer the page wasn't already paying. */
const SCREENS = [
  "/screens/screen-home.png",
  "/screens/screen-ai.png",
  "/screens/screen-biomarker.png",
  "/screens/screen-inventory.png",
  "/screens/screen-library.png",
  "/screens/screen-meal.png",
];

const CHIPS = ["Peptides & GLP-1s", "Dose tracking", "Cited research"];

/**
 * Coast-style hero: an airy left column — chips, two-sentence headline
 * (second sentence carries the accent), sub, a primary download button
 * beside a quiet secondary, the stat row — and on the right one column of
 * app screens drifting steadily downward on the plain white, cropped by a
 * soft mask. The set is duplicated once so the -50% keyframe loops without
 * a seam.
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
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-chips">
            {CHIPS.map((c) => (
              <span className="chip" key={c}>
                {c}
              </span>
            ))}
          </div>

          <h1>
            The personalized
            <br />
            <span className="muted-phrase">peptide care app.</span>
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
              align="left"
              drop="up"
            />
            <a
              className="btn btn-glass"
              href="/tools/reconstitution"
              onClick={() => track("hero_secondary_click")}
            >
              Try the free tools
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="stat-num">50+</div>
              <div className="stat-lbl">Peptides supported</div>
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
            the whole conveyor is hidden from the tree. */}
        <div className="hero-field" aria-hidden="true">
          <div className="hc-mask">
            <div className="hc-track">
              {[false, true].map((dupe) => (
                <div className="hc-set" key={dupe ? "dupe" : "set"}>
                  {SCREENS.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" decoding="async" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
