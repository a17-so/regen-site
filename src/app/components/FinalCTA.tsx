"use client";

import type { ReactNode } from "react";
import GetAppButton from "./GetAppButton";
import Reveal from "./Reveal";
import type { QrMatrix } from "../lib/qr";

/**
 * Closing section, the backdrop runs behind BOTH the CTA and the footer.
 *
 * Previously these were siblings: the CTA owned the image and the footer was
 * pulled up onto it with a negative margin. That works until the footer is
 * taller than the overlap, at which point the image stops partway down and the
 * footer finishes on bare white. Taking the footer as a child means one
 * backdrop spans the whole block and reaches the bottom of the page, whatever
 * height the footer ends up.
 */
export default function FinalCTA({
  appStoreUrl,
  qr,
  children,
}: {
  appStoreUrl: string;
  qr: QrMatrix;
  /** The footer, so it sits on the same backdrop. */
  children?: ReactNode;
}) {
  return (
    <section className="cta" id="download">
      <div className="cta-bg" aria-hidden="true">
        <div className="cta-bloom" />
        <div className="cta-scrim" />
      </div>

      <Reveal className="cta-body">
        <span className="cta-eyebrow">Protocols just got personal.</span>
        <h2>Put the whole protocol in one place.</h2>
        <p>
          Every vial, every dose and every biomarker, with an answer that shows
          its sources before you draw.
        </p>
        <GetAppButton
          appStoreUrl={appStoreUrl}
          qr={qr}
          label="Get Started"
          location="final_cta"
          size="lg"
          align="center"
        />
      </Reveal>

      {children}
    </section>
  );
}
