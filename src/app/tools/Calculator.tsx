"use client";

import { useMemo, useState } from "react";

/**
 * Reconstitution math, same arithmetic the app runs.
 *
 *   concentration (mg/mL) = vial strength (mg) / BAC water (mL)
 *   draw volume   (mL)    = dose (mg) / concentration
 *   syringe units         = draw volume (mL) × units per mL
 *
 * "Units" are insulin-syringe graduations, not IU of anything. A U-100
 * syringe has 100 graduations per mL, U-50 has 50 per mL, that ratio is the
 * only thing the last line depends on, which is why it's a picker and not a
 * constant.
 *
 * One card, two faces: the form morphs into the result on Calculate;
 * clicking anywhere on the result face (or the hidden Edit button, for
 * keyboards) morphs it back. Both panes share one grid cell, so the card
 * holds the taller pane's height and nothing jumps during the crossfade.
 */

const SYRINGES = [
  { label: "U-100 (1 mL)", unitsPerMl: 100 },
  { label: "U-100 (0.5 mL)", unitsPerMl: 100 },
  { label: "U-50 (0.5 mL)", unitsPerMl: 50 },
];

function parse(v: string): number {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function round(n: number, dp: number): string {
  if (!Number.isFinite(n)) return "·";
  return n.toFixed(dp).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

/**
 * Starting values. Omitted on /tools (the generic calculator keeps its own
 * defaults, unchanged); the per-compound pages at /tools/<slug>-calculator
 * pass the catalog's reported vial, water, and dose so the page opens already
 * answering the query that brought the reader to it. These are only the
 * INITIAL values of ordinary inputs, so every field stays editable and the
 * arithmetic below is untouched by which page it renders on.
 */
export interface CalculatorDefaults {
  vialMg?: number;
  bacMl?: number;
  doseMcg?: number | null;
}

export default function Calculator({ defaults }: { defaults?: CalculatorDefaults } = {}) {
  const [vialMg, setVialMg] = useState(
    defaults?.vialMg != null ? String(defaults.vialMg) : "10"
  );
  const [bacMl, setBacMl] = useState(
    defaults?.bacMl != null ? String(defaults.bacMl) : "2"
  );
  const [doseMcg, setDoseMcg] = useState(
    defaults?.doseMcg != null ? String(defaults.doseMcg) : defaults ? "" : "250"
  );
  const [syringe, setSyringe] = useState(SYRINGES[0]);
  const [view, setView] = useState<"form" | "result">("form");

  const r = useMemo(() => {
    const mg = parse(vialMg);
    const ml = parse(bacMl);
    const doseMg = parse(doseMcg) / 1000;

    if (!mg || !ml || !doseMg) return null;

    const concentration = mg / ml; // mg per mL
    const drawMl = doseMg / concentration;
    const units = drawMl * syringe.unitsPerMl;
    const mcgPerUnit = (concentration * 1000) / syringe.unitsPerMl;
    const dosesPerVial = Math.floor(mg / doseMg);

    return { concentration, drawMl, units, mcgPerUnit, dosesPerVial };
  }, [vialMg, bacMl, doseMcg, syringe]);

  // A draw past the barrel is the mistake this tool exists to catch.
  const barrelUnits = syringe.label.includes("0.5")
    ? syringe.unitsPerMl / 2
    : syringe.unitsPerMl;
  const overdraw = r ? r.units > barrelUnits : false;
  const fill = r ? Math.min(100, (r.units / barrelUnits) * 100) : 0;

  return (
    <div className={`calc calc-${view}`}>
      <div className="calc-pane calc-form-pane" aria-hidden={view !== "form"}>
        <label className="calc-field">
          <span>Vial strength</span>
          <div className="calc-input">
            <input
              inputMode="decimal"
              value={vialMg}
              onChange={(e) => setVialMg(e.target.value)}
              aria-label="Vial strength in milligrams"
              tabIndex={view === "form" ? 0 : -1}
            />
            <em>mg</em>
          </div>
        </label>

        <label className="calc-field">
          <span>Bacteriostatic water</span>
          <div className="calc-input">
            <input
              inputMode="decimal"
              value={bacMl}
              onChange={(e) => setBacMl(e.target.value)}
              aria-label="Bacteriostatic water in millilitres"
              tabIndex={view === "form" ? 0 : -1}
            />
            <em>mL</em>
          </div>
        </label>

        <label className="calc-field">
          <span>Target dose</span>
          <div className="calc-input">
            <input
              inputMode="decimal"
              value={doseMcg}
              onChange={(e) => setDoseMcg(e.target.value)}
              aria-label="Target dose in micrograms"
              tabIndex={view === "form" ? 0 : -1}
            />
            <em>mcg</em>
          </div>
        </label>

        <div className="calc-field">
          <span>Syringe</span>
          <div className="calc-syringes">
            {SYRINGES.map((s) => (
              <button
                key={s.label}
                className={`calc-chip${s.label === syringe.label ? " active" : ""}`}
                onClick={() => setSyringe(s)}
                tabIndex={view === "form" ? 0 : -1}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-accent calc-go"
          onClick={() => setView("result")}
          disabled={!r}
          tabIndex={view === "form" ? 0 : -1}
        >
          Calculate
        </button>
      </div>

      <div
        className="calc-pane calc-result-pane"
        aria-hidden={view !== "result"}
        onClick={() => view === "result" && setView("form")}
      >
        {r && (
          <>
            <div className="calc-headline">
              <span className="calc-big">{round(r.units, 1)}</span>
              <span className="calc-unit">units</span>
            </div>
            <p className="calc-sub">
              Draw to <strong>{round(r.units, 1)}</strong> on a{" "}
              {syringe.label.split(" ")[0]} syringe, that&apos;s{" "}
              {round(r.drawMl, 3)} mL.
            </p>

            <div className={`calc-barrel${overdraw ? " over" : ""}`}>
              <div className="calc-fill" style={{ width: `${fill}%` }} />
            </div>

            {overdraw && (
              <p className="calc-warn">
                That&apos;s more than this syringe holds ({barrelUnits} units).
                Use less water, a bigger syringe, or split the dose.
              </p>
            )}

            <dl className="calc-facts">
              <div>
                <dt>Concentration</dt>
                <dd>{round(r.concentration, 2)} mg/mL</dd>
              </div>
              <div>
                <dt>Per unit</dt>
                <dd>{round(r.mcgPerUnit, 1)} mcg</dd>
              </div>
              <div>
                <dt>Doses per vial</dt>
                <dd>{r.dosesPerVial}</dd>
              </div>
            </dl>

            {/* No visible back control by request — the whole face flips
                back on click; keyboard and AT get the hidden button. */}
            <button
              className="sr-only"
              onClick={() => setView("form")}
              tabIndex={view === "result" ? 0 : -1}
            >
              Edit the numbers
            </button>
          </>
        )}
      </div>
    </div>
  );
}
