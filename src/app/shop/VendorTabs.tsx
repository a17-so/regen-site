"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface VendorPanel {
  key: string;
  label: string;
  count?: number | string;
  node: ReactNode;
}

/**
 * The profile's own tabs (Overview · Certificates · Catalog), the
 * reference's Customer Reviews / Certificates toggle: one page, the panel
 * swaps in place, the hash remembers it. The site's Vendors · Catalog tabs
 * are NOT shown on a profile: a "Catalog" tab that opened the whole shop's
 * catalog instead of this store's was rejected ("kind of disgusting").
 */
export default function VendorTabs({ panels }: { panels: VendorPanel[] }) {
  const [active, setActive] = useState(panels[0]?.key ?? "");
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (panels.some((p) => p.key === h)) setActive(h);
  }, [panels]);
  const current = panels.find((p) => p.key === active) ?? panels[0];
  return (
    <>
      <nav className="pg-tabs sh-ptabs" aria-label="Vendor sections">
        {panels.map((p) => (
          <a
            key={p.key}
            href={`#${p.key}`}
            aria-current={p.key === current?.key ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setActive(p.key);
              window.history.replaceState(null, "", `#${p.key}`);
            }}
          >
            {p.label}
            {p.count !== undefined && <span className="pg-tab-n">{p.count}</span>}
          </a>
        ))}
      </nav>
      <div id={current?.key}>{current?.node}</div>
    </>
  );
}
