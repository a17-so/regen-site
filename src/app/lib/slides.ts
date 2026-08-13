/**
 * The FAQ content the /faq page renders.
 *
 * The FAQs used to be pills pinned inside the retired feature slides; they
 * now live on their own page (src/app/faq), grouped by category, with
 * every answer rendered in full. Everything that page shows — question,
 * paragraphs, the grading ladder, the reference links — comes from this
 * array, so the copy has exactly one home. (The slide deck itself is gone;
 * this file keeps only the FAQs.)
 */

export interface Faq {
  id: string;
  q: string;
  /** Paragraphs. Kept as an array so the thread controls its own rhythm. */
  a: string[];
  /** Optional bullet list; each entry leads with its tier letter ("S, …"). */
  bullets?: string[];
  /** Answer-bubble edge tint, the app's data-tone system. */
  tone?: "accent" | "warm" | "cool" | "green";
  /** On-site destinations the answer can hand the reader to. */
  refs?: { label: string; href: string }[];
}

export const FAQS: Faq[] = [
  {
    id: "how-schedule",
    tone: "accent",
    q: "How does REGEN know when to schedule a dose?",
    a: [
      "Each compound in the catalog carries its own timing constraints, half-life, whether it needs a fasted window, whether it competes with food or with another compound in your stack.",
      "When you add something to your protocol, REGEN places it in the day around those constraints rather than asking you to pick a time and hoping you picked well. Change a dose once and the schedule, the inventory count, and the biomarker baselines all move with it.",
    ],
  },
  {
    id: "miss-dose",
    tone: "accent",
    q: "What happens if I miss a dose?",
    a: [
      "Nothing punitive. A missed dose is logged as skipped, the vial's remaining quantity stays untouched, and the schedule carries on.",
      "REGEN does not reshuffle the rest of your week to compensate. For most compounds that would be worse than simply resuming, and the app is not in a position to make that call for you.",
    ],
  },
  {
    id: "reconstitution",
    tone: "warm",
    q: "How is the reconstitution math calculated?",
    a: [
      "Three steps, and they are the same three every time. Concentration is the vial's strength divided by the volume of bacteriostatic water you added. Draw volume is your dose divided by that concentration. Units are the draw volume multiplied by your syringe's graduations per millilitre, 100 on a U-100.",
      "That last step is where people lose a factor of a hundred, because insulin syringes are marked in units rather than millilitres. You can run the same calculation on the web without installing anything.",
    ],
    refs: [{ label: "Run the calculator", href: "/tools" }],
  },
  {
    id: "expiry",
    tone: "warm",
    q: "Does it track expiry and potency?",
    a: [
      "Yes. A vial carries its reconstitution date, and REGEN counts down from there rather than from the date printed on the box, those are different numbers once a vial is mixed.",
      "Remaining quantity decrements as you log doses, so the count reflects what is actually left rather than what you think is left.",
    ],
  },
  {
    id: "ai-sources",
    tone: "cool",
    q: "Where do REGEN AI's answers come from?",
    a: [
      "Peer-reviewed literature, regulatory filings, and registered trials, the same sources behind the graded library. Answers carry their citations, so you can check the claim rather than take it.",
      "It also reads your own data. If you ask whether a marker looks off, it is answering against your panel and your current protocol, not against a population average.",
    ],
  },
  {
    id: "biomarkers",
    tone: "green",
    q: "Which biomarkers can I track?",
    a: [
      "Over thirty, spanning the panels people actually run, lipids, glucose and metabolic markers, sex hormones, thyroid, inflammation, liver and kidney function.",
      "You can enter values by hand, upload a lab PDF and have it read, or sync from Apple Health. Each one charts against its reference range and against your own protocol, so a change has context.",
    ],
    refs: [
      { label: "Reading free testosterone", href: "/blog/reading-free-testosterone" },
    ],
  },
  {
    id: "drift",
    tone: "green",
    q: "What does 'flagged drift' mean?",
    a: [
      "A single out-of-range reading is often noise. Drift is the thing worth catching: a marker moving consistently in one direction across several readings, while still sitting inside its reference range.",
      "REGEN flags the trend rather than the outlier, and tells you when enough time has passed that a retest would actually be informative.",
    ],
  },
  {
    id: "grades",
    tone: "accent",
    q: "How are compounds graded?",
    a: [
      "Every compound carries a grade from S to F describing the strength of the evidence behind it, not how well it works, which is a different claim and usually an unsupported one.",
    ],
    bullets: [
      "S, approved by the FDA or a foreign equivalent, for the use it is bought for",
      "A, peer-reviewed randomised controlled trials in humans",
      "B, human data that is observational, or an approval that is real but narrow",
      "C, reviews, meta-analyses, or evidence borrowed from a related compound",
      "D, animal and in-vitro work only",
      "F, no clinical evidence at all",
    ],
  },
];
