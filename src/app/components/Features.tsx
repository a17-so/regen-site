import Logo from "./Logo";
import FeatureRail from "./FeatureRail";

/**
 * Features: the intro head (banner lockup, scaled up, over the section
 * title), then the four gradient boxes on the horizontal scroll rail
 * (FeatureRail.tsx). The rail leads straight into the reviews marquee.
 */
export default function Features() {
  return (
    <div className="feats" id="features">
      <section className="feats-intro">
        <div className="section-head">
          {/* The banner lockup: two tiles, the logo, two tiles. */}
          <span className="sq-row sq-row-lg" aria-hidden="true">
            <i className="sq sq-warm" />
            <i className="sq sq-cool" />
            <span className="sq-row-logo">
              <Logo size={36} />
            </span>
            <i className="sq sq-gold" />
            <i className="sq sq-green" />
          </span>
          <h2 className="section-title">
            Five tools that replace
            <br />
            <span className="muted-phrase">the forums and the guesswork.</span>
          </h2>
          <p className="section-lede">
            Every screen pulls from the same protocol. Change a dose once and
            your schedule, inventory, and biomarker baselines update together.
          </p>
        </div>
      </section>

      <FeatureRail />
    </div>
  );
}
