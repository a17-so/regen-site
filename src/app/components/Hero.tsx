"use client";
import { useEffect, useRef } from "react";
import StoreBadges from "./StoreBadges";
import { track } from "../lib/analytics";

interface HeroProps {
  appStoreUrl: string;
}

export default function Hero({ appStoreUrl }: HeroProps) {
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
      <div className="hero-bg-mark">
        <span>REGEN</span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="chip">50+ peptides</span>
            <span className="chip">Reconstitution math</span>
            <span className="chip">AI guidance</span>
          </div>
          <h1>
            The world&apos;s trusted peptide{" "}
            <span className="muted-phrase">health layer.</span>
          </h1>
          <p className="hero-sub">
            REGEN tracks every vial, every dose, every biomarker — and gives you
            an AI second opinion before you draw. Built for the people who run
            their own protocols.
          </p>
          <div className="cta-row">
            <StoreBadges appStoreUrl={appStoreUrl} />
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-num">50+</div>
              <div className="stat-lbl">Peptides supported</div>
            </div>
            <div>
              <div className="stat-num">1.2k</div>
              <div className="stat-lbl">Cited studies</div>
            </div>
            <div>
              <div className="stat-num">4.9</div>
              <div className="stat-lbl">App Store rating</div>
            </div>
          </div>
        </div>
        <div className="hero-phones hero-variantA">
          <div className="hero-phone phone-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screens/screen-biomarker.png"
              alt="Biomarker tracking — Free Testosterone trend"
            />
          </div>
          <div className="hero-phone phone-bottom">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screens/screen-home.png"
              alt="Today's protocol timeline"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
