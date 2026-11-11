"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SiteSearchRow } from "../search-index.json/route";
import { prepare, search } from "../lib/siteSearch";

/**
 * The header's search: one field, one list. Opens from the round button
 * beside the bar (or ⌘K), fetches the site index the first time it opens,
 * and filters locally from then on (lib/siteSearch.ts: punctuation-blind,
 * every word must match, small typos forgiven, name hits first).
 */
export default function SiteSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<SiteSearchRow[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (rows === null) {
      fetch("/search-index.json")
        .then((r) => (r.ok ? (r.json() as Promise<SiteSearchRow[]>) : Promise.reject(new Error(String(r.status)))))
        .then(setRows)
        .catch(() => setRows([]));
    }
  }, [open, rows]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t) && !(t as Element).closest?.(".hdr-search-btn")) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose]);

  const prepared = useMemo(() => (rows ? prepare(rows) : null), [rows]);
  const results = useMemo(() => (prepared ? search(prepared, q) : []), [q, prepared]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      const hit = results[active];
      if (hit) window.location.href = hit.href;
    }
  };

  if (!open) return null;
  const typed = q.trim() !== "";
  return (
    <div className="hdr-search" ref={panelRef} role="dialog" aria-label="Search">
      <div className="hdr-search-field">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="9" cy="9" r="6" />
          <path d="M13.5 13.5 17 17" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={q}
          placeholder="Search peptides, goals, vendors, tools"
          aria-label="Search the site"
          autoComplete="off"
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="hdr-search-close" aria-label="Close search" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3 3 13" />
          </svg>
        </button>
      </div>
      {typed && (
        <div className="hdr-search-results" role="listbox">
          {rows === null ? (
            <div className="hdr-search-empty">Loading the index.</div>
          ) : results.length === 0 ? (
            <div className="hdr-search-empty">No matches for “{q.trim()}”</div>
          ) : (
            results.map((r, i) => (
              <a
                key={`${r.kind}-${r.href}`}
                href={r.href}
                role="option"
                aria-selected={i === active}
                className={i === active ? "is-active" : undefined}
                onMouseEnter={() => setActive(i)}
              >
                <span className="hdr-search-name">{r.name}</span>
                <span className="hdr-search-meta">
                  <span className="hdr-search-kind">{r.kind}</span>
                  {r.meta}
                </span>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
