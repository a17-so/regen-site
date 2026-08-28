"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GetAppButton from "./GetAppButton";
import Logo from "./Logo";
import type { QrMatrix } from "../lib/qr";

/** Routes where the bar is present from the first paint instead of waiting
 *  for the fold: the library (reference pages, learn guides, indexes) and
 *  the blog. A reader arriving from search is already mid-task there; the
 *  landing pages keep the scroll threshold so the hero makes the first ask. */
function showsImmediately(pathname: string) {
  return (
    pathname === "/library" ||
    pathname.startsWith("/library/") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/")
  );
}

/**
 * Site-wide popup footer: a fixed glass dock at the bottom edge — the raw
 * REGEN mark, title and subtitle, the standard Get REGEN button. The header
 * pill's counterpart, sharing its measure.
 *
 * It stays off two ways, and each has a reason:
 *  - above the fold on landing pages, where the hero is already making the
 *    ask (library and blog routes skip this, see showsImmediately);
 *  - while the page close is on screen, where it would cover the footer and
 *    repeat the CTA sitting right there.
 */
export default function GetBar({
  appStoreUrl,
  qr,
}: {
  appStoreUrl: string;
  qr: QrMatrix;
}) {
  const pathname = usePathname();
  const immediate = showsImmediately(pathname);
  const [pastFold, setPastFold] = useState(false);
  const [atClose, setAtClose] = useState(false);
  const [searching, setSearching] = useState(false);

  // Past-the-fold check, rAF-throttled like the header's collapse read.
  // Re-keyed on pathname: a route change resets scroll without firing it.
  // Immediate routes skip the listener — the bar is on from the start.
  useEffect(() => {
    if (immediate) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      setPastFold(window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname, immediate]);

  // Every page ends through PageClose (section.cta); while any of it is on
  // screen the bar stands down. The layout outlives each page, so the
  // observer re-binds per route.
  useEffect(() => {
    setAtClose(false);
    const cta = document.querySelector(".cta");
    if (!cta) return;
    const io = new IntersectionObserver(([entry]) =>
      setAtClose(entry.isIntersecting)
    );
    io.observe(cta);
    return () => io.disconnect();
  }, [pathname]);

  // The library search sets body.is-searching; the bar leaves the stage under
  // its scrim. Folded into `shown` rather than styled off the body class:
  // a CSS-only exit needed its own visibility transition, and Blink left that
  // zero-duration transition frozen at "running" — the bar went transparent
  // but kept intercepting clicks. One hidden pathway, driven from here.
  useEffect(() => {
    const read = () =>
      setSearching(document.body.classList.contains("is-searching"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const shown = (immediate || pastFold) && !atClose && !searching;

  return (
    <div
      className={`getbar${shown ? " is-shown" : ""}`}
      aria-hidden={!shown}
      // Belt and braces with the delayed visibility flip: nothing inside an
      // invisible bar can take focus or a click even mid-transition.
      inert={!shown}
    >
      <div className="getbar-card" role="region" aria-label="Get the REGEN app">
        <div className="getbar-icon-tile" aria-hidden="true">
          <Logo size={24} className="getbar-icon" />
        </div>
        <div className="getbar-copy">
          <p className="getbar-title">
            <span className="label-full">Looking for a place to manage your protocol?</span>
            <span className="label-short">REGEN</span>
          </p>
          <p className="getbar-sub">
            <span className="label-full">
              REGEN tracks every vial, dose, and biomarker in one place.
            </span>
            <span className="label-short">The peptide care app.</span>
          </p>
        </div>
        <GetAppButton
          appStoreUrl={appStoreUrl}
          qr={qr}
          location="footer_bar"
          size="sm"
          align="right"
          drop="up"
        />
      </div>
    </div>
  );
}
