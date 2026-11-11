"use client";

import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";

/**
 * The contents card's selection as ONE lit glass layer that glides between
 * rows (2026-11-11, "table of contents the same everywhere ... glass like and
 * the double glass stacking like always, just smooth transitions"): the card
 * is the page glass, the current row sits on the layer glass, and when the
 * current row changes the layer slides to it on the filter bar's curve
 * instead of one row's fill vanishing while the next one's appears.
 *
 * Render `<span className="toc-lit" ref={lit} aria-hidden="true" />` as the
 * card's first child; the hook places it on the row marked
 * `aria-current="true"` and hides it when no row is current. The first
 * placement never animates, and only a real resize re-places it (a
 * ResizeObserver also fires once on observe, which would snap the glide).
 */
export function useTocGlide<T extends HTMLElement>(deps: DependencyList): { card: RefObject<T | null>; lit: RefObject<HTMLSpanElement | null> } {
  const card = useRef<T>(null);
  const lit = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  useLayoutEffect(() => {
    const el = card.current;
    const layer = lit.current;
    if (!el || !layer) return;
    // Three moves: a CHANGE glides; APPEARING (nothing was lit) lands on the
    // row and fades in, never sliding in from the card's corner; a RESIZE
    // snaps without a fade.
    const place = (glide: boolean) => {
      const row = el.querySelector<HTMLElement>('a[aria-current="true"]');
      if (!row) {
        layer.style.opacity = "0";
        return;
      }
      const appearing = layer.style.opacity !== "1";
      const jump = appearing || !glide;
      if (jump) layer.style.transition = appearing ? "opacity 0.3s ease" : "none";
      if (appearing) layer.style.opacity = "0";
      layer.style.width = `${row.offsetWidth}px`;
      layer.style.height = `${row.offsetHeight}px`;
      layer.style.transform = `translate(${row.offsetLeft}px, ${row.offsetTop}px)`;
      if (jump) void layer.offsetWidth;
      layer.style.opacity = "1";
      if (jump) requestAnimationFrame(() => (layer.style.transition = ""));
    };
    place(placed.current);
    placed.current = true;

    let seen = { w: el.offsetWidth, h: el.offsetHeight };
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth === seen.w && el.offsetHeight === seen.h) return;
      seen = { w: el.offsetWidth, h: el.offsetHeight };
      place(false);
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { card, lit };
}
