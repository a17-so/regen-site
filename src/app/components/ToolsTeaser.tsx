import { ArrowR } from "./icons";
import Logo from "./Logo";

/**
 * The /tools page body: a plain coming-soon statement under the banner
 * lockup, not a roadmap grid — the four-card strip read as a live catalog.
 * The reconstitution calculator is the one tool that exists, so it gets
 * the single link out.
 */
export default function ToolsTeaser() {
  return (
    <section className="tools" id="tools">
      <div className="tools-inner">
        <div className="section-head">
          {/* The banner lockup: two tiles, the logo, two tiles. */}
          <span className="sq-row" aria-hidden="true">
            <i className="sq sq-warm" />
            <i className="sq sq-cool" />
            <span className="sq-row-logo">
              <Logo size={22} />
            </span>
            <i className="sq sq-gold" />
            <i className="sq sq-green" />
          </span>
          {/* h1: this is the /tools page's top-level heading. */}
          <h1 className="section-title">
            Free tools, <span className="muted-phrase">coming soon.</span>
          </h1>
          <p className="section-lede">
            Dose conversion, half-life curves, and vial duration, running
            right in the browser. No download, no account. The reconstitution
            calculator is live today.
          </p>
          <div className="tools-cta">
            <a className="btn btn-glass" href="/tools/reconstitution">
              Run the reconstitution calculator
              <ArrowR size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
