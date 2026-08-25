"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * The reference page's contents rail.
 *
 * Server-rendered as a plain list of anchors, so it works with JS off and a
 * crawler sees every section link. The client half only adds the selected
 * state: an IntersectionObserver watching each section heading, picking the
 * topmost one currently past the header.
 */
export default function Contents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    // Track visibility per id rather than reacting to each entry in isolation:
    // a single callback fires for whichever headings crossed, and the winner is
    // the highest one still on screen, which is what a reader considers "here".
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = targets.find((t) => visible.get(t.id));
        if (first) setActive(first.id);
      },
      {
        // Top inset clears the fixed header; the bottom inset keeps the band
        // shallow so the selection tracks the heading you are reading rather
        // than whatever is furthest down the viewport.
        rootMargin: "-120px 0px -65% 0px",
        threshold: 0,
      }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="legal-toc legal-toc--card">
      <div className="legal-toc-title">Contents</div>
      {items.map((item, idx) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
        >
          {/* Mirrors the app's numbered chapter pill and the blog rail's
              "number + label" convention. */}
          <span className="legal-toc-num" aria-hidden="true">
            {String(idx + 1).padStart(2, "0")}
          </span>
          {item.label}
        </a>
      ))}
    </aside>
  );
}
