"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "../lib/analytics";
import { ArrowR } from "./icons";
import GetAppButton from "./GetAppButton";
import type { QrMatrix } from "../lib/qr";

interface HeroProps {
  appStoreUrl: string;
  qr: QrMatrix;
  /** The proof stat row, server-rendered, resting on the hero's bottom edge. */
  children?: ReactNode;
}

export default function Hero({ appStoreUrl, qr, children }: HeroProps) {
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
      {/* Backdrop photo, dissolving into the page below via the mask on
          .hero-bg. The veil on top keeps the left copy column legible. */}
      <div className="hero-bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-photo"
          src="/backdrops/hero.jpg"
          alt=""
          fetchPriority="high"
        />
        <div className="hero-vignette" />
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <h1>
            Run peptides <span className="muted-phrase">with a clearer plan.</span>
          </h1>

          <p className="hero-sub">
            Track every vial, dose, and biomarker in one place, and get a
            second opinion before you draw.
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
            <a className="btn btn-glass" href="/blog">
              Read the blog
              <ArrowR size={14} />
            </a>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
