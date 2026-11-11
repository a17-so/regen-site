"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "../lib/analytics";
import Logo from "../components/Logo";

/**
 * The discount code, as the app shows it: VendorBreakdownView's "Shop Now"
 * PromptCard ported 1:1 ("regen copy paste text should be a lot more our
 * app like"). The REGEN mark (40), the title with its arrow, one grey line
 * that carries the code, and the accent Copy pill, whose label never
 * changes. Copying confirms the app's way: a glass toast rises from the
 * foot of the screen (0.18s in, out 1.4s after the tap, 0.18s out).
 *
 * The toast is portalled to <body>: inside the card's backdrop-filter a
 * `position: fixed` element is fixed to the card, not the screen.
 */
export default function CodeCopy({ code, vendor }: { code: string; vendor: string; domain?: string }) {
  const [shown, setShown] = useState(false);
  // The toast's words outlive `shown` by its fade, so it eases out with them.
  const [words, setWords] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    setMounted(true);
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      track("shop_code_copied", { vendor, code });
      timers.current.forEach((t) => window.clearTimeout(t));
      setShown(true);
      setWords(true);
      timers.current = [window.setTimeout(() => setShown(false), 1400), window.setTimeout(() => setWords(false), 1600)];
    } catch {
      setShown(false);
    }
  }
  return (
    <div className="sh-prompt">
      <Logo size={40} className="sh-prompt-logo" />
      <div className="sh-prompt-text">
        <p className="sh-prompt-title">
          Shop Now
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
        <p className="sh-prompt-sub">Use code {code} at checkout</p>
      </div>
      <button type="button" className="sh-prompt-btn" onClick={copy} aria-label={`Copy code ${code}`}>
        Copy
      </button>
      {mounted &&
        createPortal(
          <div className={`sh-toast${shown ? " is-on" : ""}`} role="status" aria-live="polite">
            {words ? "Link code copied" : ""}
          </div>,
          document.body
        )}
    </div>
  );
}
