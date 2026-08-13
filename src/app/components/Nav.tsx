"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import GetAppButton from "./GetAppButton";
import type { QrMatrix } from "../lib/qr";

interface NavProps {
  appStoreUrl: string;
  /** "" on the landing page, "/" elsewhere, so section anchors resolve home. */
  sectionBase?: string;
  /** App Store QR matrix, built server-side by <NavBar>. */
  qr: QrMatrix;
}

/**
 * Collapse thresholds lifted from `ChatBarCollapse` in the iOS app
 * (Components/DesignSystem/ChatBarScroll.swift). The gap between the two is
 * hysteresis: once collapsed the header only re-expands below 12px, so a
 * scroll hovering at the boundary can't flicker the chrome.
 */
const COLLAPSE_AT = 48;
const EXPAND_AT = 12;

export default function Nav({ appStoreUrl, sectionBase = "", qr }: NavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const depth = window.scrollY;
      // Same asymmetric test the Swift modifier runs: which threshold applies
      // depends on the state we're already in.
      setCollapsed((prev) => (prev ? depth > EXPAND_AT : depth > COLLAPSE_AT));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Lock the page behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // The drawer only exists below 860px. If the viewport crosses back over
  // that line while it's open (rotation, window resize), the burger and
  // drawer vanish but the scroll lock would survive, so close it.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const onChange = () => {
      if (!mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const links = [
    { href: "/tools", label: "Tools" },
    { href: "/community-notes", label: "Notes" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <header className={`hdr${collapsed ? " is-collapsed" : ""}`}>
        <div className="hdr-inner">
          <a
            className="hdr-brand"
            href={sectionBase === "" ? "#home" : "/"}
            aria-label="REGEN home"
          >
            <Logo size={25} className="hdr-logo" />
            <span className="nm-stroke">REGEN</span>
          </a>

          <nav className="hdr-links" aria-label="Primary">
            {links.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hdr-cta">
            <GetAppButton
              appStoreUrl={appStoreUrl}
              qr={qr}
              location="nav"
              size="sm"
              align="right"
            />
            <button
              className="hdr-burger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Links only — the header's Get Now pill stays visible above the
          drawer, so a second store button here was redundant. */}
      <div className={`hdr-menu${menuOpen ? " open" : ""}`}>
        {links.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d={open ? "M4 4 L14 14" : "M2 6 H16"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d={open ? "M14 4 L4 14" : "M2 12 H16"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
