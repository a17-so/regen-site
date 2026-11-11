"use client";

import { useEffect, useState, type ReactNode } from "react";

export type VendorTab = { key: string; label: string; count?: number; panel: ReactNode };

/**
 * The vendor profile's tabs (2026-11-10, "vendor breakdown has to be split
 * up into tabs"): the library guide's Guide | Citations bar (`.gt`, the same
 * underline tabs), widened to the vendor's views. Each view after the first
 * is also reachable as #<key>, so a link can open Sources or the catalog
 * directly. Every panel is rendered (hidden, not unmounted), so crawlers
 * read the whole record.
 */
export default function VendorTabs({ tabs }: { tabs: VendorTab[] }) {
  const first = tabs[0]?.key ?? "";
  const [view, setView] = useState(first);
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1);
      if (h.startsWith("src-")) setView("sources");
      else if (tabs.some((t) => t.key === h)) setView(h);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [tabs]);
  function show(key: string) {
    setView(key);
    history.replaceState(null, "", key === first ? window.location.pathname : `#${key}`);
  }
  return (
    <>
      <div className="gt" role="tablist">
        {tabs.map((t) => (
          <button key={t.key} role="tab" type="button" aria-selected={view === t.key} aria-controls={`vt-${t.key}`} onClick={() => show(t.key)}>
            {t.label}
            {t.count !== undefined && <span className="gt-n"> ({t.count})</span>}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.key} id={`vt-${t.key}`} role="tabpanel" hidden={view !== t.key} className="sh-tabpanel">
          {t.panel}
        </div>
      ))}
    </>
  );
}
