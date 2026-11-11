"use client";

import { useCallback, useEffect, useState } from "react";
import Logo from "./Logo";
import GetAppButton from "./GetAppButton";
import SiteSearch from "./SiteSearch";
import type { QrMatrix } from "../lib/qr";

export interface NavMenuItem {
  label: string;
  href: string;
  meta?: string;
}

export interface NavMenu {
  key: string;
  label: string;
  href: string;
  items: NavMenuItem[];
}

interface NavProps {
  appStoreUrl: string;
  /** "" on the landing page, "/" elsewhere, so section anchors resolve home. */
  sectionBase?: string;
  /** App Store QR matrix, built server-side by <NavBar>. */
  qr: QrMatrix;
  /** The three sections and the links under each, built by <NavBar>. */
  menus: NavMenu[];
  /** Retired: the bar carries its own search now. Accepted so pages that
      still pass a field keep compiling; nothing is rendered from it. */
  slot?: React.ReactNode;
}

/**
 * ONE bar, the width of the page's content, laid out the way Superpower
 * sets its own: the brand and the three sections on the left (each
 * opening a dropdown of its pages), and at the far right the store pill.
 * The search is its own circle beside the bar. There is no sign-in: the
 * site is a vendor platform, not a store with accounts. One piece of
 * glass; the dropdowns and the search panel are the same material. Fixed;
 * At the top of the page there is NO bar: its items sit loose on the page
 * and the glass forms under them past 48px of scroll, where it also
 * tightens (the published site's zoom, see the `.hdr.is-collapsed`
 * rules), the layout itself never changing.
 * Below 860px the bar keeps the brand, the store pill, the search button
 * and a burger, and the drawer lists every section's links.
 */
/** The scroll zoom's thresholds, the published site's (from the app's
    ChatBarCollapse): collapse past 48px, re-expand only below 12px, so a
    scroll hovering at the boundary never flickers the chrome. */
const COLLAPSE_AT = 48;
const EXPAND_AT = 12;

export default function Nav({ appStoreUrl, sectionBase = "", qr, menus }: NavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  // The scroll zoom: read once per frame, asymmetric thresholds.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const depth = window.scrollY;
      setCollapsed((prev) => (prev ? depth > EXPAND_AT : depth > COLLAPSE_AT));
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
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

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

  // ⌘K / Ctrl-K opens the search from anywhere; Escape closes a dropdown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(null);
        setSearchOpen(true);
      }
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className={`hdr${collapsed ? " is-collapsed" : ""}`}>
        <div className="hdr-row">
          <div className="hdr-pill">
            <a className="hdr-brand" href={sectionBase === "" ? "#home" : "/"} aria-label="REGEN home">
              <Logo size={22} className="hdr-logo" />
              <span className="nm-stroke">REGEN</span>
            </a>

            <nav className="hdr-links" aria-label="Primary">
              {menus.map((m) => (
                <div
                  key={m.key}
                  className={`hdr-item${open === m.key ? " is-open" : ""}`}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setOpen(m.key);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setOpen((o) => (o === m.key ? null : o));
                  }}
                  onFocusCapture={() => setOpen(m.key)}
                  onBlurCapture={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen((o) => (o === m.key ? null : o));
                  }}
                >
                  <a href={m.href} aria-haspopup="true" aria-expanded={open === m.key}>
                    {m.label}
                  </a>
                  <div className="hdr-drop" role="menu" aria-label={m.label}>
                    {m.items.map((it) => (
                      <a key={it.href} role="menuitem" href={it.href}>
                        {it.label}
                        {it.meta !== undefined && <span className="hdr-drop-meta">{it.meta}</span>}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="hdr-acct">
              <GetAppButton appStoreUrl={appStoreUrl} qr={qr} label="Get the app" location="nav" size="sm" align="right" />
            </div>

            <button
              type="button"
              className="hdr-burger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>

          {/* Its own glass circle beside the bar, not inside it. */}
          <button
            type="button"
            className="hdr-search-btn"
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            onClick={() => {
              setOpen(null);
              setSearchOpen((v) => !v);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="9" cy="9" r="6" />
              <path d="M13.5 13.5 17 17" strokeLinecap="round" />
            </svg>
          </button>
          <SiteSearch open={searchOpen} onClose={closeSearch} />
        </div>
      </header>

      {/* The drawer: every section with its pages, then FAQ.
          The store pill stays visible in the header above it. */}
      <div className={`hdr-menu${menuOpen ? " open" : ""}`}>
        {menus.map((m) => (
          <div className="hdr-menu-group" key={m.key}>
            <a href={m.href} onClick={() => setMenuOpen(false)}>
              {m.label}
            </a>
            <div className="hdr-menu-sub">
              {m.items.map((it) => (
                <a key={it.href} href={it.href} onClick={() => setMenuOpen(false)}>
                  {it.label}
                </a>
              ))}
            </div>
          </div>
        ))}
        <div className="hdr-menu-foot">
          <a href="/faq" onClick={() => setMenuOpen(false)}>
            FAQ
          </a>
        </div>
      </div>
    </>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d={open ? "M4 4 L14 14" : "M2 6 H16"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d={open ? "M14 4 L4 14" : "M2 12 H16"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
