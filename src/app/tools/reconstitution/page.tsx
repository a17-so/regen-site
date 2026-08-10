import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { MedicalDisclaimer } from "../../components/Disclaimer";
import { AppleIcon } from "../../components/icons";
import Calculator from "./Calculator";

export const metadata: Metadata = {
  title: "Peptide reconstitution calculator · REGEN",
  description:
    "Work out units-per-click from vial strength, bacteriostatic water, and target dose. Free, no account, runs in the browser.",
};

export default function ReconstitutionPage() {
  const appStoreUrl = buildAppStoreUrl();

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <section className="tool-page">
          <div className="tool-head">
            <span className="section-eyebrow">
              <span className="dot" />
              Free tool
            </span>
            <h1>Reconstitution calculator</h1>
            <p>
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
          </div>

          <div className="tool-cta">
            <h2>REGEN remembers all of this</h2>
            <p>
              The app keeps the concentration attached to the vial, tracks mg
              remaining as you dose, and warns you before an expired vial gets
              used.
            </p>
            <a
              className="btn btn-accent"
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppleIcon size={21} />
              Get REGEN, free
            </a>
          </div>
        </section>
      </main>
      <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
    </>
  );
}
