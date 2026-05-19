import { Check } from "./icons";

interface FeatureItem {
  id: string;
  eyebrow: string;
  title: string;
  titleMuted: string;
  desc: string;
  img: string;
  accent: "default" | "warm" | "blue";
  flip: boolean;
  checks: { num: string; label: string }[];
}

const FEATURES: FeatureItem[] = [
  {
    id: "schedule",
    eyebrow: "01 / SCHEDULE",
    title: "Your day, dosed.",
    titleMuted: " Down to the minute.",
    desc:
      "A timeline that knows the difference between fasted GH and post-meal berberine. REGEN sequences your day around the molecules — not a generic checklist.",
    img: "/screens/screen-home.png",
    accent: "default",
    flip: false,
    checks: [
      { num: "01", label: "Time-of-day windows" },
      { num: "02", label: "Pre-meal & fasted cues" },
      { num: "03", label: "Cycle-aware reminders" },
    ],
  },
  {
    id: "inventory",
    eyebrow: "02 / INVENTORY",
    title: "Every vial, accounted for.",
    titleMuted: "",
    desc:
      "Track reconstituted vs lyophilized, mg remaining, expiry. Scan a new vial and REGEN does the BAC water math, the IU conversion, the units-per-click — silently, correctly.",
    img: "/screens/screen-inventory.png",
    accent: "default",
    flip: true,
    checks: [
      { num: "01", label: "Reconstitution calculator" },
      { num: "02", label: "Expiry & potency alerts" },
      { num: "03", label: "Stack-level inventory" },
    ],
  },
  {
    id: "ai",
    eyebrow: "03 / REGEN AI",
    title: "A second opinion,",
    titleMuted: " before you draw.",
    desc:
      "Ask REGEN AI about interactions, half-lives, blood panels, photo marks. Trained on peer-reviewed literature — never on forum threads pretending to be science.",
    img: "/screens/screen-ai.png",
    accent: "default",
    flip: false,
    checks: [
      { num: "01", label: "Dose calculator" },
      { num: "02", label: "Bloodwork QA" },
      { num: "03", label: "Stack analysis" },
    ],
  },
  {
    id: "biomarkers",
    eyebrow: "04 / BIOMARKERS",
    title: "Numbers in,",
    titleMuted: " trends out.",
    desc:
      "Log free testosterone, lipid panels, glucose, sleep — REGEN charts the trend against your protocol, flags drift, and tells you when it's time to retest.",
    img: "/screens/screen-biomarker.png",
    accent: "warm",
    flip: true,
    checks: [
      { num: "01", label: "30+ biomarkers tracked" },
      { num: "02", label: "Reference-range bands" },
      { num: "03", label: "Auto-flagged drift" },
    ],
  },
  {
    id: "nutrition",
    eyebrow: "05 / NUTRITION",
    title: "Macros without",
    titleMuted: " the spreadsheet.",
    desc:
      "Snap a plate. REGEN breaks down calories, protein, carbs, fat — and ties it to the dose window it fell in. Because GLP-1 outcomes start at the table.",
    img: "/screens/screen-meal.png",
    accent: "default",
    flip: false,
    checks: [
      { num: "01", label: "Photo macro scan" },
      { num: "02", label: "Window-aware logging" },
      { num: "03", label: "Protein-target tracking" },
    ],
  },
];

function Feature({ f, idx }: { f: FeatureItem; idx: number }) {
  return (
    <section className={`feature ${f.flip ? "flip" : ""} accent-${f.accent}`}>
      <div className="feature-copy">
        <div className="feature-index">
          {f.eyebrow}
          <span className="line"></span>
        </div>
        <h2>
          {f.title}
          {f.titleMuted && <span className="muted-phrase">{f.titleMuted}</span>}
        </h2>
        <p className="feature-desc">{f.desc}</p>
        <div className="feature-checks">
          {f.checks.map((c) => (
            <div className="feature-check" key={c.num}>
              <div className="num">
                <span className="badge">
                  <Check />
                </span>
                {c.num}
              </div>
              {c.label}
            </div>
          ))}
        </div>
      </div>
      <div className="feature-visual">
        <div className={`phone-card ${idx % 2 === 0 ? "tilt-l" : "tilt-r"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.img} alt={f.title} loading="lazy" />
        </div>
      </div>
    </section>
  );
}

export default function Features() {
  return (
    <div id="features">
      <section className="features-intro">
        <span className="section-eyebrow">
          <span className="dot"></span>What&apos;s inside
        </span>
        <h2 className="section-title">
          Five tools that replace
          <br />
          <span className="muted-phrase">a binder full of spreadsheets.</span>
        </h2>
        <p className="section-lede">
          Every screen pulls from the same protocol. Change a dose in one place,
          the schedule, inventory, and biomarker baselines update everywhere.
        </p>
      </section>
      {FEATURES.map((f, idx) => (
        <Feature key={f.id} f={f} idx={idx} />
      ))}
    </div>
  );
}
