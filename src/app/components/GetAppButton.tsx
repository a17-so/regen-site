"use client";

import { useEffect, useRef, useState } from "react";
import { AppleIcon } from "./icons";
import QrCode from "./QrCode";
import type { QrMatrix } from "../lib/qr";
import { track } from "../lib/analytics";

/**
 * "Get REGEN" that morphs into a scannable QR on hover.
 *
 * The button stays a real anchor throughout, hover is an enhancement, never
 * the only way through. Someone on a phone (where hover doesn't exist, and
 * where a QR would be useless anyway) just taps it and lands in the App Store.
 *
 * The panel grows out of the button rather than fading in on top of it:
 * transform-origin sits on the edge the panel is anchored to, so the motion
 * reads as one object changing shape instead of two objects swapping.
 */
export default function GetAppButton({
  appStoreUrl,
  qr,
  label = "Get REGEN",
  location = "nav",
  size = "sm",
  align = "right",
  drop = "down",
  tone = "accent",
}: {
  appStoreUrl: string;
  /** Module matrix from lib/qr.ts, drawn by <QrCode>. */
  qr: QrMatrix;
  label?: string;
  location?: string;
  size?: "sm" | "lg";
  /** Which edge the panel hangs from, so it never runs off-screen. */
  align?: "left" | "right" | "center";
  /** "up" grows the panel above the button, for buttons with content
   *  directly beneath them that the card would otherwise cover. */
  drop?: "down" | "up";
  /** "inverse" is the white-on-accent variant for buttons that sit on the
   *  accent field (the closing card). */
  tone?: "accent" | "inverse";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  // A short grace period stops the panel snapping shut while the pointer
  // crosses the gap between the button and the card. Kept tight: the panel
  // overlaps the button (plus an 8px halo), and a long grace reads as the
  // close animation stuttering before it starts.
  //
  // Touch devices never open the panel at all — a QR you would have to scan
  // with the phone displaying it is useless, so a tap goes straight through
  // the anchor to the App Store. Checked here (tap fires focus, which would
  // otherwise open it for a frame) on top of the CSS that hides the panel
  // under (hover: none).
  const show = () => {
    if (window.matchMedia("(hover: none)").matches) return;
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 60);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      className={`getapp getapp-${align}${drop === "up" ? " getapp-up" : ""}${open ? " is-open" : ""}`}
      ref={wrapRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <a
        className={`btn ${size === "sm" ? "btn-sm " : ""}${tone === "inverse" ? "btn-inverse" : "btn-accent"} getapp-btn`}
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("app_store_click", { location })}
        aria-describedby={open ? "getapp-qr" : undefined}
      >
        <AppleIcon size={size === "sm" ? 23 : 26} />
        <span className="label-full">{label}</span>
        <span className="label-short">Get</span>
      </a>

      {/* The card is itself a link: scanning is the point, but clicking the
          QR should land in the App Store too. tabIndex -1 keeps it out of
          the tab order — the main button is the keyboard path. */}
      <a
        className="getapp-panel"
        id="getapp-qr"
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden={!open}
        onClick={() => track("app_store_click", { location: `${location}_qr` })}
      >
        <div className="getapp-qr">
          <QrCode matrix={qr} />
        </div>
        <span className="getapp-cap">
          <AppleIcon size={17} />
          Download from App Store
        </span>
      </a>
    </div>
  );
}
