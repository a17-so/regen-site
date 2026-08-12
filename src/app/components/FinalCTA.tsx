"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import GetAppButton from "./GetAppButton";
import Reveal from "./Reveal";
import type { QrMatrix } from "../lib/qr";

/** Two rows of faint verbs riding the card's corners, the reference's
 *  CHECK / KNOW / PREVENT treatment in REGEN's own register. */
const GHOSTS = ["Track", "Dose", "Verify", "Track", "Dose", "Verify"];

/** Cursor repel field: how far it reaches and how hard it pushes. Kept
 *  broad and weak — strong pushes with a quick ease read as jitter. */
const REPEL_RADIUS = 380;
const REPEL_STRENGTH = 22;

/**
 * Closing section: one big glass platform — ink headline, the standard
 * Get REGEN button with its hover-QR panel (the panel needs the card
 * unclipped, see .cta-card), brand squares drifting in the field, ghost
 * verbs in the corners. The footer follows on the page's white below.
 *
 * The squares also swish away from the pointer: a distance-falloff push
 * written to the `translate` property, which composes with the ambient
 * `transform` drift keyframes instead of fighting them. The eased CSS
 * transition on `translate` is what makes the dodge read as swimming
 * rather than tracking. Touch and reduced-motion never attach it.
 */
export default function FinalCTA({
  appStoreUrl,
  qr,
  children,
}: {
  appStoreUrl: string;
  qr: QrMatrix;
  /** The footer, so the closing block owns the bottom of the page. */
  children?: ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const squares = Array.from(card.querySelectorAll<HTMLElement>(".cta-sq"));
    let frame = 0;
    let cx = 0;
    let cy = 0;

    const apply = () => {
      frame = 0;
      for (const sq of squares) {
        // Layout position (offset*), not getBoundingClientRect: the rect
        // includes the drift and the current push, which would feed back.
        const bx = sq.offsetLeft + sq.offsetWidth / 2;
        const by = sq.offsetTop + sq.offsetHeight / 2;
        const dx = bx - cx;
        const dy = by - cy;
        const d = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - d / REPEL_RADIUS);
        const push = f * f * REPEL_STRENGTH;
        sq.style.translate = `${(dx / d) * push}px ${(dy / d) * push}px`;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      cx = e.clientX - r.left;
      cy = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const sq of squares) sq.style.translate = "0px 0px";
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="cta" id="download">
      <Reveal className="cta-shell">
        <div className="cta-card" ref={cardRef}>
          <div className="cta-ghosts" aria-hidden="true">
            {GHOSTS.map((g, i) => (
              <span key={`${g}-${i}`}>{g}</span>
            ))}
          </div>
          <i className="sq cta-sq cta-sq-1 sq-warm" aria-hidden="true" />
          <i className="sq cta-sq cta-sq-2 sq-gold" aria-hidden="true" />
          <i className="sq cta-sq cta-sq-3 sq-green" aria-hidden="true" />
          <i className="sq cta-sq cta-sq-4 sq-cool" aria-hidden="true" />

          <h2>
            Put the whole protocol
            <br />
            <span className="muted-phrase">in one place.</span>
          </h2>

          <GetAppButton
            appStoreUrl={appStoreUrl}
            qr={qr}
            label="Download now"
            location="final_cta"
            size="lg"
            align="center"
          />
        </div>
      </Reveal>

      {children}
    </section>
  );
}
