"use client";

import { useEffect, useState } from "react";

/**
 * The reading gauge at the page's left edge: one tick per section, the
 * current one long and dark. A tick jumps to its section.
 */
export default function TickRail({ ids, labels }: { ids: string[]; labels: string[] }) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ids]);
  return (
    <nav className="tr" aria-label="Sections">
      {ids.map((id, i) => (
        <a key={id} href={`#${id}`} className={id === active ? "is-on" : undefined} aria-label={labels[i]} title={labels[i]}>
          <span />
        </a>
      ))}
    </nav>
  );
}
