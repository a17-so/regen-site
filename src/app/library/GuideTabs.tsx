"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Guide | Citations, as two views of one page. The citations view is also
 * reachable as #citations, and a citation marker in the text opens it.
 */
export default function GuideTabs({ count, guide, citations }: { count: number; guide: ReactNode; citations: ReactNode }) {
  const [view, setView] = useState<"guide" | "citations">("guide");
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash;
      if (h === "#citations" || h.startsWith("#src-")) setView("citations");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  function show(v: "guide" | "citations") {
    setView(v);
    history.replaceState(null, "", v === "citations" ? "#citations" : window.location.pathname);
  }
  return (
    <>
      <div className="gt" role="tablist">
        <button role="tab" type="button" aria-selected={view === "guide"} onClick={() => show("guide")}>
          Guide
        </button>
        <button role="tab" type="button" aria-selected={view === "citations"} onClick={() => show("citations")}>
          Citations ({count})
        </button>
      </div>
      <div hidden={view !== "guide"}>{guide}</div>
      <div hidden={view !== "citations"} id="citations">
        {citations}
      </div>
    </>
  );
}
