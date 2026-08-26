"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SearchRow } from "../lib/library";

/**
 * Client-side filter over the library index.
 *
 * The whole index is a few KB of name + blurb, so it ships with the page and
 * filters locally, no request per keystroke and it works with JS-disabled
 * crawlers because the cards below are server-rendered regardless.
 */
export default function LibrarySearch({
  rows,
  variant = "hero",
}: {
  rows: SearchRow[];
  /** "nav" is the compact header field: same behaviour, narrower, and it
      hides itself below 1120px where the header row is already full. */
  variant?: "hero" | "nav";
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // The scrim renders into <body> rather than in place. Any ancestor that
  // creates a stacking context (a transform, a filter, an `isolation`) would
  // otherwise trap it below the fixed header, and it would dim the page body
  // while leaving the nav lit. Portalling makes that impossible to regress.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cmd/Ctrl-K focuses the field, matching the affordance shown in the chip.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Lock the page behind the scrim, the same way the mobile nav drawer does,
  // and flag the state on <body>.
  //
  // The flag is load-bearing, not a convenience: the header pill carries its
  // own `backdrop-filter`, which puts it in a separate backdrop root, and an
  // element in another backdrop root is NOT sampled by the scrim's filter. It
  // therefore stayed crisp and fully saturated above a blurred page — most
  // visibly the blue store pill. The class lets the header blur itself.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("is-searching", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("is-searching");
    };
  }, [open]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    // Name matches first, then blurb matches, so "sema" leads with Semaglutide
    // rather than whatever happens to mention it.
    const scored = rows
      .map((r) => {
        const name = r.name.toLowerCase();
        if (name.startsWith(needle)) return { r, score: 0 };
        if (name.includes(needle)) return { r, score: 1 };
        if (r.blurb.toLowerCase().includes(needle)) return { r, score: 2 };
        return null;
      })
      .filter((x): x is { r: SearchRow; score: number } => x !== null);
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, 8).map((s) => s.r);
  }, [q, rows]);

  useEffect(() => setActive(0), [q]);

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

  return (
    <>
      {/* Dims the page so the field and its results are the only lit surface.
          Sits under the search box but over everything else, the header
          included. */}
      {mounted &&
        createPortal(
          <div
            className={`lib-search-scrim${open ? " is-open" : ""}`}
            aria-hidden="true"
            onMouseDown={() => setOpen(false)}
          />,
          document.body
        )}
      <div
        className={`lib-search lib-search--${variant}${open ? " is-open" : ""}`}
        ref={boxRef}
      >
        {open && q.trim() !== "" && (
          <div className="lib-search-results" role="listbox">
            {results.length === 0 ? (
              <div className="lib-search-empty">No matches for “{q.trim()}”</div>
            ) : (
              results.map((r, i) => (
                <a
                  key={r.slug}
                  href={r.href}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "is-active" : undefined}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="lib-search-name">{r.name}</span>
                  <span className="lib-search-cat">{r.category}</span>
                </a>
              ))
            )}
          </div>
        )}
        <div className="lib-search-field">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="9" cy="9" r="6" />
            <path d="M13.5 13.5 17 17" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={q}
            placeholder={variant === "nav" ? "Search peptides..." : "Search peptides and guides..."}
            aria-label="Search peptides and guides"
            autoComplete="off"
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
          <kbd className="lib-search-kbd">
            <span>⌘</span>K
          </kbd>
        </div>

      </div>
    </>
  );
}
