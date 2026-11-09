"use client";

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";

export type GlassTab = { key: string; label: string; href: string; count?: number };

/**
 * The site's one filter bar: a page-glass pill holding the options and ONE
 * lit thumb behind them that SLIDES to the pick (the shop's SegBar, with
 * links and counts). Science's categories and the library's body systems
 * both use it, so a filter reads the same everywhere ("filters for the
 * articles should be strictly our glass").
 *
 * Options are real links, so crawlers and a new-tab click still work. With
 * `onPick`, a plain click calls it instead of navigating (filter in place,
 * or scroll the list); without it, the options are ordinary links.
 *
 * On a phone the bar scrolls sideways and keeps the pick in view.
 */
export default function GlassTabs({
  label,
  tabs,
  value,
  onPick,
  className = "",
}: {
  label: string;
  tabs: GlassTab[];
  value: string | null;
  onPick?: (key: string, href: string) => void;
  className?: string;
}) {
  const bar = useRef<HTMLElement>(null);
  const [thumb, setThumb] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  useLayoutEffect(() => {
    const el = bar.current?.querySelector<HTMLAnchorElement>("a[aria-current]");
    if (!bar.current || !el) {
      setThumb(null);
      return;
    }
    const nav = bar.current;
    const place = () => setThumb({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
    place();
    // A sideways-scrolling bar (phones) brings the pick into view.
    if (nav.scrollWidth > nav.clientWidth + 1) {
      const left = el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2;
      nav.scrollTo({ left, behavior: readyRef.current ? "smooth" : "auto" });
    }
    // Animate only after the first placement, so the thumb never slides in from 0.
    const id = requestAnimationFrame(() => {
      readyRef.current = true;
      setReady(true);
    });
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [value, tabs.length]);

  function click(e: MouseEvent<HTMLAnchorElement>, t: GlassTab) {
    if (!onPick || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onPick(t.key, t.href);
  }

  return (
    <nav className={`sh-segbar gtabs${ready ? " is-ready" : ""}${className ? ` ${className}` : ""}`} aria-label={label} ref={bar}>
      {thumb && (
        <span
          className="sh-segbar-thumb"
          aria-hidden="true"
          style={{ width: thumb.w, height: thumb.h, transform: `translate(${thumb.x}px, ${thumb.y}px)` }}
        />
      )}
      {tabs.map((t) => (
        <a key={t.key} href={t.href} aria-current={t.key === value ? "page" : undefined} onClick={(e) => click(e, t)}>
          {t.label}
          {t.count !== undefined && <span className="gtabs-n">{t.count}</span>}
        </a>
      ))}
    </nav>
  );
}
