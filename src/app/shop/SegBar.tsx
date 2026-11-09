"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * The segmented bar: one page-glass pill holding the options, and ONE lit
 * thumb behind them that slides to the picked option instead of the pick
 * jumping from button to button. The thumb is measured from the picked
 * button, so it fits labels of any width and follows a wrap.
 */
export default function SegBar<T extends string | number | null>({
  label,
  options,
  value,
  onChange,
  small = false,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  /** Row scale, for a vendor's packs inside a pane. */
  small?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = wrap.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
    if (!el) return;
    const place = () => setThumb({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
    place();
    // Animate only after the first placement, so the thumb never slides in from 0.
    const id = requestAnimationFrame(() => setReady(true));
    const ro = new ResizeObserver(place);
    ro.observe(wrap.current!);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [value, options.length]);

  return (
    <div className={`sh-segbar${small ? " sh-segbar--sm" : ""}${ready ? " is-ready" : ""}`} role="group" aria-label={label} ref={wrap}>
      {thumb && (
        <span
          className="sh-segbar-thumb"
          aria-hidden="true"
          style={{ width: thumb.w, height: thumb.h, transform: `translate(${thumb.x}px, ${thumb.y}px)` }}
        />
      )}
      {options.map((o) => (
        <button key={String(o.value)} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
