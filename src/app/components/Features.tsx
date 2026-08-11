import Reveal from "./Reveal";
import Logo from "./Logo";

/**
 * The classic 01–05 feature rows, back from the pre-slides build by request:
 * same copy, same alternating layout, restyled to the current system:
 * token spacing, the eyebrow face, grey accent phrases.
 *
 * One fix over the original: the inventory and biomarker rows carried each
 * other's screenshots. 02 now shows the vial list, 04 the trend chart.
 */

interface FeatureItem {
  id: string;
  eyebrow: string;
  /** Brand-square tones: `tone` leads the eyebrow, both trail the phone. */
  tone: string;
  toneB: string;
  title: string;
  titleMuted: string;
  desc: string;
  img: string;
  alt: string;
  flip: boolean;
  /** Labels carry an explicit \n so every check renders exactly two
   *  tight lines — CSS wrapping made them ragged (1 line vs 2). */
  checks: { num: string; label: string }[];
}

const FEATURES: FeatureItem[] = [
  {
    id: "schedule",
    tone: "sq-warm",
    toneB: "sq-gold",
    eyebrow: "01 · SCHEDULE",
    title: "Your day, dosed.",
    titleMuted: " Down to the minute.",
    desc:
      "A timeline that knows the difference between fasted GH and post-meal berberine. REGEN sequences your day around the molecules, not a generic checklist.",
    img: "/screens/screen-home.png",
    alt: "REGEN's home screen counting down to the next dose, nutrition totals beneath",
    flip: false,
    checks: [
      { num: "01", label: "Time-of-day\nwindows" },
      { num: "02", label: "Pre-meal &\nfasted cues" },
      { num: "03", label: "Cycle-aware\nreminders" },
    ],
  },
  {
    id: "inventory",
    tone: "sq-cool",
    toneB: "sq-green",
    eyebrow: "02 · INVENTORY",
    title: "Every vial, accounted for.",
    titleMuted: "",
    desc:
      "Track reconstituted vs lyophilized, mg remaining, expiry. Scan a new vial and REGEN does the BAC water math, the IU conversion, the units-per-click. Silently, correctly.",
    img: "/screens/screen-inventory.png",
    alt: "REGEN's inventory list, each compound with its goal and daily dose",
    flip: true,
    checks: [
      { num: "01", label: "Reconstitution\ncalculator" },
      { num: "02", label: "Expiry &\npotency alerts" },
      { num: "03", label: "Stack-level\ninventory" },
    ],
  },
  {
    id: "ai",
    tone: "sq-warm",
    toneB: "sq-cool",
    eyebrow: "03 · REGEN AI",
    title: "A second opinion,",
    titleMuted: " before you draw.",
    desc:
      "Ask REGEN AI about interactions, half-lives, blood panels, photo marks. Trained on peer-reviewed literature, never on forum threads pretending to be science.",
    img: "/screens/screen-ai.png",
    alt: "REGEN AI answering a protocol question with citations shown inline",
    flip: false,
    checks: [
      { num: "01", label: "Dose\ncalculator" },
      { num: "02", label: "Bloodwork\nQA" },
      { num: "03", label: "Stack\nanalysis" },
    ],
  },
  {
    id: "biomarkers",
    tone: "sq-gold",
    toneB: "sq-green",
    eyebrow: "04 · BIOMARKERS",
    title: "Numbers in,",
    titleMuted: " trends out.",
    desc:
      "Log free testosterone, lipid panels, glucose, sleep. REGEN charts the trend against your protocol, flags drift, and tells you when it's time to retest.",
    img: "/screens/screen-biomarker.png",
    alt: "REGEN's data screen highlighting a Vitamin D rise against the last panel",
    flip: true,
    checks: [
      { num: "01", label: "30+ biomarkers\ntracked" },
      { num: "02", label: "Reference-range\nbands" },
      { num: "03", label: "Auto-flagged\ndrift" },
    ],
  },
  {
    id: "nutrition",
    tone: "sq-green",
    toneB: "sq-warm",
    eyebrow: "05 · NUTRITION",
    title: "Macros without",
    titleMuted: " the spreadsheet.",
    desc:
      "Snap a plate. REGEN breaks down calories, protein, carbs, fat, and ties it to the dose window it fell in. Because GLP-1 outcomes start at the table.",
    img: "/screens/screen-meal.png",
    alt: "A meal logged in REGEN, calories and macros broken down from a photo",
    flip: false,
    checks: [
      { num: "01", label: "Photo macro\nscan" },
      { num: "02", label: "Window-aware\nlogging" },
      { num: "03", label: "Protein-target\ntracking" },
    ],
  },
];

function Feature({ f, idx }: { f: FeatureItem; idx: number }) {
  return (
    <Reveal as="section" className={`feature${f.flip ? " flip" : ""}`}>
      <div className="feature-copy">
        <div className="feature-index">
          <i className={`sq sq-mini ${f.tone}`} aria-hidden="true" />
          {f.eyebrow}
        </div>
        <h2>
          {f.title}
          {f.titleMuted && <span className="muted-phrase">{f.titleMuted}</span>}
        </h2>
        <p className="feature-desc">{f.desc}</p>
        <div className="feature-checks">
          {f.checks.map((c) => (
            <div className="feature-check" key={c.num}>
              <div className="num">{c.num}</div>
              {c.label}
            </div>
          ))}
        </div>
      </div>
      <div className="feature-visual">
        <div className={`phone-card ${idx % 2 === 0 ? "tilt-l" : "tilt-r"}`}>
          <i className={`sq feat-sq feat-sq-a ${f.tone}`} aria-hidden="true" />
          <i className={`sq feat-sq feat-sq-b ${f.toneB}`} aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.img} alt={f.alt} loading="lazy" />
        </div>
      </div>
    </Reveal>
  );
}

export default function Features() {
  return (
    <div className="feats" id="features">
      <section className="feats-intro">
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
          <h2 className="section-title">
            Five tools that replace
            <br />
            <span className="muted-phrase">a binder full of spreadsheets.</span>
          </h2>
          <p className="section-lede">
            Every screen pulls from the same protocol. Change a dose in one
            place, the schedule, inventory, and biomarker baselines update
            everywhere.
          </p>
        </div>
      </section>
      {FEATURES.map((f, idx) => (
        <Feature key={f.id} f={f} idx={idx} />
      ))}
    </div>
  );
}
