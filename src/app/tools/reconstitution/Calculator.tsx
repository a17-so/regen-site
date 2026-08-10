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

export default function Calculator() {
  const [vialMg, setVialMg] = useState("10");
  const [bacMl, setBacMl] = useState("2");
  const [doseMcg, setDoseMcg] = useState("250");
  const [syringe, setSyringe] = useState(SYRINGES[0]);

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
    <div className="calc">
      <div className="calc-inputs">
        <label className="calc-field">
          <span>Vial strength</span>
          <div className="calc-input">
            <input
              inputMode="decimal"
              value={vialMg}
              onChange={(e) => setVialMg(e.target.value)}
              aria-label="Vial strength in milligrams"
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
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="calc-result">
        {!r ? (
          <p className="calc-empty">Enter a vial strength, water volume, and dose.</p>
        ) : (
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
              <span className="calc-barrel-max">{barrelUnits}u</span>
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
          </>
        )}
      </div>
    </div>
  );
}
