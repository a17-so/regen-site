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

/**
 * The pre-slides hero on a clean white ground: headline, one download
 * button, the stat row, the colliding two-phone stack, and the brand
 * squares drifting behind it.
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
          <h1>
            The world&apos;s trusted peptide{" "}
            <span className="muted-phrase">health layer.</span>
          </h1>

          <p className="hero-sub">
            REGEN tracks every vial, every dose, every biomarker, and gives
            you an AI second opinion before you draw. Built for the people who
            run their own protocols.
          </p>

          <div className="hero-cta">
            <GetAppButton
              appStoreUrl={appStoreUrl}
              qr={qr}
              location="hero"
              size="lg"
              align="left"
              drop="up"
            />
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

        {/* Decorative duplicates of screens the feature rows describe in
            full, so they're hidden from the tree wholesale. The brand
            squares from the banner float around the pair, slowly bobbing. */}
        <div className="hero-phones" aria-hidden="true">
          <i className="sq sq-warm hero-sq hero-sq-1" />
          <i className="sq sq-cool hero-sq hero-sq-2" />
          <i className="sq sq-gold hero-sq hero-sq-3" />
          <i className="sq sq-green hero-sq hero-sq-4" />
          <i className="sq sq-cool hero-sq hero-sq-5" />
          {/* lazy: below 1024px the container is display:none, and lazy
              images outside the render tree never download — this is what
              keeps ~6MB of PNG off phone connections. On desktop they're
              in-viewport and load immediately anyway. */}
          <div className="hero-phone phone-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screens/screen-biomarker.png" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="hero-phone phone-bottom">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screens/screen-home.png" alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}
