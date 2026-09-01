/**
 * Per-compound reconstitution calculators.
 *
 * `/tools` is the generic calculator: empty defaults, one page. These are the
 * same arithmetic pre-filled from the catalog, one page per compound, at
 * `/tools/<slug>-calculator`.
 *
 * Why a separate page type rather than more library chapters: a calculator
 * COMPUTES rather than advises, so it carries no dosing-recommendation surface
 * the way a prose page does, and it is the one query shape an AI answer panel
 * cannot finish for the reader (it cannot do arithmetic on their vial). The
 * numbers below are the catalog's own reported values, restated, never a
 * recommendation.
 *
 * Coverage is deliberately partial. A compound qualifies only when the catalog
 * gives it BOTH a reconstitution block and a subcutaneous/intramuscular route:
 * 13 of the 54 are oral or topical (MK-677, orforglipron, 5-amino-1MQ, SNAP-8,
 * ...) and reconstitute nothing, so a "reconstitution calculator" for them
 * would be a page about an operation that does not exist. Thin invented pages
 * are the failure mode the chapter routes already demonstrate; do not widen
 * this to all 54 for the page count.
 */
import { PEPTIDES, peptideBySlug, type Peptide } from "./library";

/** Routes whose preparation involves reconstituting a lyophilised vial. */
const INJECTED_ROUTES = new Set(["subcutaneous", "intramuscular"]);

/**
 * International Units are a BIOLOGICAL ACTIVITY measure, not a mass, and the
 * IU-to-mg factor is specific to each substance. This calculator is mass-based
 * throughout (mg vial, mg/mL concentration, mcg dose), so it cannot express an
 * IU-dosed compound, and any page that tried would be wrong rather than
 * incomplete.
 *
 * This is not hypothetical. The catalog stores hCG as `vialMg: 5000`, but its
 * own note reads "5,000 IU vial + 5mL bacteriostatic water = 1000 IU/mL" — the
 * 5000 is IU, in a field named mg. Rendered as a mass calculator, a 250 IU dose
 * entered into the mcg field returns 0.025 units where the true answer is 25:
 * a 1000x error, on dosing, on a YMYL page. Oxytocin is the same shape (10 mg
 * vial is about 300 IU; doses are written in IU).
 *
 * So both are excluded from this page type entirely rather than shipped with a
 * caveat. If the catalog ever grows a real `vialIu` / IU-aware dose field, this
 * is the check to revisit — not the exclusion list to extend.
 */
const IU_RE = /\bIU\b/;

function isIuDosed(p: Peptide): boolean {
  return IU_RE.test(
    [
      p.standardDose?.unit ?? "",
      p.doseCard?.primary ?? "",
      p.reconstitution?.notes ?? "",
    ].join(" ")
  );
}

export interface CalculatorPreset {
  peptide: Peptide;
  /** URL segment: "<slug>-calculator". */
  slug: string;
  /** Vial strength in mg, from the catalog. */
  vialMg: number;
  /** Bacteriostatic water in mL, from the catalog. */
  bacMl: number;
  /**
   * Starting dose in mcg. The catalog states doses in mg or mcg depending on
   * the compound, and the calculator's input is mcg, so this normalises once
   * here rather than in the component. Null when the catalog reports no
   * standard dose (3 compounds) — the page still works, the dose field just
   * starts on the generic default.
   */
  doseMcg: number | null;
  /** The dose exactly as the catalog words it, for display. Never rephrased. */
  doseLabel: string | null;
  frequencyLabel: string | null;
}

/** Catalog doses arrive in mg or mcg; the calculator input is mcg. */
function toMcg(value: number, unit: string | undefined): number | null {
  const u = (unit ?? "").toLowerCase();
  if (u === "mcg" || u === "µg" || u === "ug") return value;
  if (u === "mg") return value * 1000;
  return null;
}

export function presetFor(p: Peptide): CalculatorPreset | undefined {
  const recon = p.reconstitution;
  const vialMg = recon?.vialMg;
  const bacMl = recon?.recommendedBacMl;
  if (!recon || !vialMg || !bacMl) return undefined;
  if (!p.route.some((r) => INJECTED_ROUTES.has(r.toLowerCase()))) return undefined;
  if (isIuDosed(p)) return undefined;

  const dose = p.standardDose;
  // Start at the LOW end of a reported range. The page states the full range in
  // prose; pre-filling the top of a titration ladder would put the largest
  // number on screen as if it were a starting point.
  let doseMcg = dose?.low ? toMcg(dose.low, dose.unit) : null;

  // A dose larger than the whole vial is not a dose for THIS vial, so it must
  // not be pre-filled as one. Melanotan-I is the live case: its catalog dose is
  // "16 mg implant" (the approved Scenesse implant) against a 10 mg research
  // vial. The page still renders, the dose field just starts empty rather than
  // asserting an impossible draw.
  if (doseMcg !== null && doseMcg / 1000 > vialMg) doseMcg = null;

  return {
    peptide: p,
    slug: `${p.slug}-calculator`,
    vialMg,
    bacMl,
    doseMcg,
    doseLabel: p.doseCard?.primary ?? null,
    frequencyLabel: p.doseCard?.frequency ?? null,
  };
}

/** Every compound that gets a calculator page, in catalog order. */
export const CALCULATOR_PRESETS: CalculatorPreset[] = PEPTIDES.map(presetFor).filter(
  (c): c is CalculatorPreset => Boolean(c)
);

const BY_SLUG = new Map(CALCULATOR_PRESETS.map((c) => [c.slug, c]));

export function calculatorBySlug(slug: string): CalculatorPreset | undefined {
  return BY_SLUG.get(slug);
}

/** The calculator page for a compound, or undefined when it has none. */
export function calculatorHrefFor(p: Peptide): string | undefined {
  return BY_SLUG.has(`${p.slug}-calculator`) ? `/tools/${p.slug}-calculator` : undefined;
}

/**
 * The derived numbers the page states in prose, so the text and the
 * calculator's own first render agree. Mirrors Calculator.tsx exactly; a
 * change there needs the same change here.
 */
export function presetMath(c: CalculatorPreset) {
  const concentration = c.vialMg / c.bacMl; // mg/mL
  const mcgPerUnit = (concentration * 1000) / 100; // per U-100 graduation
  const doseMg = c.doseMcg === null ? null : c.doseMcg / 1000;
  const drawMl = doseMg === null ? null : doseMg / concentration;
  const units = drawMl === null ? null : drawMl * 100;
  const dosesPerVial = doseMg === null ? null : Math.floor(c.vialMg / doseMg);
  return { concentration, mcgPerUnit, drawMl, units, dosesPerVial };
}

/** Trim trailing zeros so "5.00" reads as "5". */
export function fmt(n: number, dp: number): string {
  return n.toFixed(dp).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

/** Bacteriostatic water volumes a vial is commonly reconstituted with. The
    catalog's own recommendation is merged in and the list de-duplicated, so
    every chart contains the number the rest of the page is built on. */
const COMMON_BAC_ML = [1, 2, 3, 5];

export interface ChartRow {
  bacMl: number;
  concentration: number;
  mcgPerUnit: number;
  /** Units on a U-100 syringe for the compound's reported dose, when it has one. */
  units: number | null;
  /** True for the volume the rest of the page uses. */
  isDefault: boolean;
}

/**
 * The reconstitution chart: one row per common water volume, for THIS vial.
 *
 * This is the page's own reference content, and it is different on all 39
 * pages because it is derived from the compound's vial size and dose. It also
 * answers the "dosage chart" phrasing directly, which is a distinct query from
 * "calculator" and is not something a calculator widget alone satisfies.
 */
export function reconstitutionChart(c: CalculatorPreset): ChartRow[] {
  const volumes = [...new Set([...COMMON_BAC_ML, c.bacMl])].sort((a, b) => a - b);
  return volumes.map((bacMl) => {
    const concentration = c.vialMg / bacMl;
    const mcgPerUnit = (concentration * 1000) / 100;
    const units =
      c.doseMcg === null ? null : (c.doseMcg / 1000 / concentration) * 100;
    return { bacMl, concentration, mcgPerUnit, units, isDefault: bacMl === c.bacMl };
  });
}

/** Guard: a preset must resolve to a real catalog compound. */
export function assertKnown(slug: string): Peptide | undefined {
  return peptideBySlug(slug);
}
