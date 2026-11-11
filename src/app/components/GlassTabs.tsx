"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";
import type { IconKey } from "../lib/library";
import { CategoryIcon } from "../library/CategoryIcon";

export type GlassTab = { key: string; label: string; href: string; count?: number; icon?: IconKey; tone?: string };

/**
 * The site's filter bar: the app's GlassIconSegmentedControl, ported
 * ("copy regen app's segmented control where it expands when it's in focus,
 * and without it it's just an icon"). A grey track; every option an ink
 * icon; ONLY the pick opens to show its label (and count) beside its icon,
 * on a white thumb.
 *
 * Motion is transforms only (FLIP), so it stays smooth: when the pick
 * changes, the bar takes its new layout at once, then every option starts
 * from where it was drawn and slides home, the thumb glides from the old
 * pick to the new one, and the new label fades up. Animating widths
 * re-laid the bar on every frame and read as lag.
 *
 * Options are real links, so crawlers and a new-tab click still work. With
 * `onPick`, a plain click calls it instead of navigating. On a phone the bar
 * wraps onto a second row; no bar on the site scrolls sideways.
 */
/* An ease-out-quint: a quick start that settles long and soft, the feel of
   the app's critically damped segment glide (2026-11-10, "make them
   soooth"). */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MS = 560;

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
  const thumb = useRef<HTMLSpanElement>(null);
  /** Where each option and the thumb were last drawn. */
  const last = useRef<{ x: Map<string, number>; thumb: { x: number; w: number } | null; key: string | null; label: { html: string; x: number; y: number } | null }>({ x: new Map(), thumb: null, key: null, label: null });

  useLayoutEffect(() => {
    const nav = bar.current;
    const th = thumb.current;
    if (!nav || !th) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const links = [...nav.querySelectorAll<HTMLAnchorElement>("a[data-key]")];
    const pick = links.find((a) => a.dataset.key === value) ?? null;
    const prev = last.current;
    const animate = !reduce && prev.thumb !== null;

    // The outgoing label: React has already removed it, so a ghost copy
    // fades out where it sat while the thumb slides away, instead of the
    // words vanishing in one frame.
    if (animate && prev.label && prev.key !== value) {
      const ghost = document.createElement("span");
      ghost.className = "gtabs-ghost";
      ghost.setAttribute("aria-hidden", "true");
      ghost.innerHTML = prev.label.html;
      ghost.style.left = `${prev.label.x}px`;
      ghost.style.top = `${prev.label.y}px`;
      nav.appendChild(ghost);
      ghost.addEventListener("animationend", () => ghost.remove(), { once: true });
      window.setTimeout(() => ghost.remove(), 600);
    }
    // Options: start where they were drawn, slide home.
    for (const a of links) {
      const was = prev.x.get(a.dataset.key!);
      const dx = was === undefined ? 0 : was - a.offsetLeft;
      if (animate && dx) {
        a.style.transition = "none";
        a.style.transform = `translateX(${dx}px)`;
      }
    }
    // Thumb: from the old pick's box to the new one.
    const to = pick ? { x: pick.offsetLeft, w: pick.offsetWidth } : null;
    if (!to) {
      th.style.opacity = "0";
    } else {
      th.style.opacity = "1";
      th.style.height = `${pick!.offsetHeight}px`;
      if (animate && prev.thumb) {
        th.style.transition = "none";
        th.style.transform = `translate(${prev.thumb.x}px, ${pick!.offsetTop}px)`;
        th.style.width = `${prev.thumb.w}px`;
      } else {
        th.style.transition = "none";
        th.style.transform = `translate(${to.x}px, ${pick!.offsetTop}px)`;
        th.style.width = `${to.w}px`;
      }
    }
    // One reflow, then everything eases to rest on the same curve.
    void nav.offsetWidth;
    const run = `transform ${MS}ms ${EASE}`;
    for (const a of links) {
      a.style.transition = animate ? `${run}, color 0.3s ease` : "color 0.3s ease";
      a.style.transform = "";
    }
    if (to) {
      th.style.transition = animate ? `${run}, width ${MS}ms ${EASE}` : "none";
      th.style.transform = `translate(${to.x}px, ${pick!.offsetTop}px)`;
      th.style.width = `${to.w}px`;
    }
    const labelOf = () => {
      const l = pick?.querySelector<HTMLElement>(".gtabs-label");
      return pick && l ? { html: l.innerHTML, x: pick.offsetLeft + l.offsetLeft, y: pick.offsetTop + l.offsetTop } : null;
    };
    last.current = { x: new Map(links.map((a) => [a.dataset.key!, a.offsetLeft])), thumb: to, key: value, label: labelOf() };

    // Only a real resize (the window, a wrap) re-places the thumb. A
    // ResizeObserver also fires once the moment it starts observing, and that
    // first call used to snap the thumb straight to the new pick on every
    // click, so it never visibly glided.
    let seen = { w: nav.offsetWidth, h: nav.offsetHeight };
    const ro = new ResizeObserver(() => {
      if (!pick) return;
      if (nav.offsetWidth === seen.w && nav.offsetHeight === seen.h) return;
      seen = { w: nav.offsetWidth, h: nav.offsetHeight };
      th.style.transition = "none";
      th.style.transform = `translate(${pick.offsetLeft}px, ${pick.offsetTop}px)`;
      th.style.width = `${pick.offsetWidth}px`;
      last.current = { x: new Map(links.map((a) => [a.dataset.key!, a.offsetLeft])), thumb: { x: pick.offsetLeft, w: pick.offsetWidth }, key: value, label: labelOf() };
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, [value, tabs.length]);

  function click(e: MouseEvent<HTMLAnchorElement>, t: GlassTab) {
    if (!onPick || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onPick(t.key, t.href);
  }

  return (
    <nav className={`gtabs${className ? ` ${className}` : ""}`} aria-label={label} ref={bar}>
      <span className="gtabs-thumb" aria-hidden="true" ref={thumb} />
      {tabs.map((t) => {
        const on = t.key === value;
        return (
          <a
            key={t.key}
            data-key={t.key}
            href={t.href}
            aria-current={on ? "page" : undefined}
            aria-label={t.count !== undefined ? `${t.label}, ${t.count}` : t.label}
            title={on ? undefined : t.label}
            onClick={(e) => click(e, t)}
          >
            {t.icon && <CategoryIcon name={t.icon} size={17} />}
            {(on || !t.icon) && (
              <span className="gtabs-label" aria-hidden="true">
                {t.label}
                {t.count !== undefined && <span className="gtabs-n">{t.count}</span>}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
