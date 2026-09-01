import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import { MedicalDisclaimer } from "../components/Disclaimer";
import { CALCULATOR_PRESETS } from "../lib/calculators";
import Calculator from "./Calculator";

export const metadata: Metadata = {
  title: "Peptide reconstitution calculator · REGEN",
  description:
    "Work out units-per-click from vial strength, bacteriostatic water, and target dose. Free, no account, runs in the browser.",
};

/**
 * /tools IS the reconstitution calculator — the coming-soon teaser and the
 * separate /tools/reconstitution page merged into one (the old URL 308s
 * here, see next.config.ts).
 */
export default function ToolsPage() {
  const appStoreUrl = buildAppStoreUrl();

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        {/* The landing's wash, whispered, interior pages open on the same
            field so the site reads as one place. */}
        <div className="page-wash" aria-hidden="true" />
        <main className="tool-page">
          <div className="section-head">
            <h1 className="section-title">
              Reconstitution <span className="muted-phrase">calculator.</span>
            </h1>
            <p className="section-lede">
              Vial strength and bacteriostatic water in, units-per-click out.
              No account, nothing to download.
            </p>
          </div>

          <Calculator />

          <div className="tool-notes">
            <MedicalDisclaimer />

            <h2>How the math works</h2>
            <p>
              Reconstitution is two divisions and a multiplication, which is
              exactly why it&apos;s easy to get quietly wrong at 6am.
            </p>
            <p>
              Adding bacteriostatic water to a lyophilised vial gives you a
              <strong> concentration</strong>: the vial&apos;s strength divided
              by the volume of water. A 10&nbsp;mg vial with 2&nbsp;mL of water
              is 5&nbsp;mg/mL. The water volume does not change how much peptide
              you have, only how concentrated it is.
            </p>
            <p>
              To get a dose, divide it by that concentration. A 250&nbsp;mcg
              dose (0.25&nbsp;mg) at 5&nbsp;mg/mL is 0.05&nbsp;mL of liquid.
            </p>
            <p>
              Insulin syringes aren&apos;t marked in millilitres, they&apos;re
              marked in <strong>units</strong>: 100 graduations per mL on a
              U-100. So 0.05&nbsp;mL is 5 units. That last step is the one
              people skip, and it&apos;s a factor-of-100 error when they do.
            </p>
            <p>
              &quot;Units&quot; here means syringe graduations, not
              international units. They are unrelated measures that share a
              name, and conflating them is its own category of mistake.
            </p>

            <h2>Getting it wrong in the safe direction</h2>
            <p>
              More water is not more drug, it just spreads the same peptide
              across a bigger volume, which means more units drawn for the same
              dose. That&apos;s usually the safer way to be imprecise, because
              small errors on a longer draw matter proportionally less.
            </p>
            <p>
              If the calculator says your draw is more than the barrel holds,
              it will tell you. That&apos;s the failure worth catching: it
              means the numbers don&apos;t fit the syringe you picked, not that
              you should draw twice.
            </p>

            {/* Index of the per-compound calculators. This is also the crawl
                path to them: without it the 39 pages are reachable only from
                their own reference page's reconstitution note. */}
            <h2 id="by-compound">Calculators by compound</h2>
            <p>
              Each of these opens pre-filled with the vial size, water volume,
              and reported dose the REGEN catalog carries for that compound.
              Compounds taken orally or topically, and the ones dosed in
              international units rather than by mass, are not listed: there is
              no vial to reconstitute, or the arithmetic here cannot express
              their dose.
            </p>
            <ul className="tool-calc-index">
              {CALCULATOR_PRESETS.map((c) => (
                <li key={c.slug}>
                  <a href={`/tools/${c.slug}`}>{c.peptide.name} calculator</a>
                </li>
              ))}
            </ul>
          </div>

        </main>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
