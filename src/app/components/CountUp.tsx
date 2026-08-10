"use client";

import { useLayoutEffect, useState } from "react";

/**
 * The proof numbers count up once on arrival, the Superpower touch that
 * makes a stat feel measured rather than typeset.
 *
 * The server renders the real value (crawlers and no-JS readers never see a
 * zero); on hydration the number rewinds and plays forward in a layout
 * effect, so the swap lands before paint. Formatted values ("12.4k") and
 * reduced-motion users keep the static figure.
 */
export default function CountUp({ display }: { display: string }) {
  const numeric = /^\d{1,4}$/.test(display) ? parseInt(display, 10) : null;
  const [shown, setShown] = useState(display);

  useLayoutEffect(() => {
    if (numeric === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const duration = 1200;
    let raf = 0;
    let start = 0;

    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(String(Math.round(eased * numeric)));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <strong>{shown}</strong>;
}
