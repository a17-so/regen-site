import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { MedicalDisclaimer } from "../../components/Disclaimer";
import {
  CALCULATOR_PRESETS,
  calculatorBySlug,
  fmt,
  presetMath,
  reconstitutionChart,
  type CalculatorPreset,
} from "../../lib/calculators";
import { categoryBySlug, hrefFor, LIBRARY_ROBOTS } from "../../lib/library";
import { Crumbs, SITE_URL } from "../../library/parts";
import Calculator from "../Calculator";

/**
 * Per-compound reconstitution calculators, `/tools/<slug>-calculator`.
 *
 * One route generating 39 static pages from the catalog (see
 * `lib/calculators.ts` for which compounds qualify and why the rest do not).
 * Deliberately NOT a seventh library chapter: this page computes rather than
 * advises, so it carries no dosing-recommendation surface, and it is the one
 * query shape a search answer panel cannot finish for the reader.
 *
 * Every number on the page is the catalog's own reported value or arithmetic
 * derived from it. Nothing here recommends a dose.
 */

export function generateStaticParams() {
  return CALCULATOR_PRESETS.map((c) => ({ tool: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const c = calculatorBySlug(tool);
  if (!c) return {};
  const p = c.peptide;
  const url = `${SITE_URL}/tools/${c.slug}`;
  const title = `${p.name} Reconstitution Calculator`;
  const description = `Work out ${p.name} units per syringe from vial strength, bacteriostatic water, and target dose. Free, no account, runs in the browser.`;
  return {
    title: `${title} | REGEN`,
    description,
    alternates: { canonical: url },
    robots: LIBRARY_ROBOTS,
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** The worked example, stated in prose so the page answers the query even
    before anyone touches an input. Every figure comes from presetMath. */
function WorkedExample({ c }: { c: CalculatorPreset }) {
  const m = presetMath(c);
  const p = c.peptide;
  return (
    <>
      <h2>The numbers for a {fmt(c.vialMg, 2)} mg {p.name} vial</h2>
      <p>
        Reconstituting a {fmt(c.vialMg, 2)}&nbsp;mg vial with{" "}
        {fmt(c.bacMl, 2)}&nbsp;mL of bacteriostatic water gives a concentration
        of <strong>{fmt(m.concentration, 2)}&nbsp;mg/mL</strong>. On a U-100
        insulin syringe, where one unit is 0.01&nbsp;mL, that puts{" "}
        <strong>{fmt(m.mcgPerUnit, 1)}&nbsp;mcg in every unit</strong> drawn.
      </p>
      {m.units !== null && m.drawMl !== null && c.doseMcg !== null && (
        <p>
          A {fmt(c.doseMcg, 0)}&nbsp;mcg dose at that concentration is{" "}
          {fmt(m.drawMl, 3)}&nbsp;mL, which is{" "}
          <strong>{fmt(m.units, 1)} units</strong> on the syringe
          {m.dosesPerVial ? (
            <>
              , and the vial holds about {m.dosesPerVial} of them
            </>
          ) : null}
          .
        </p>
      )}
      <p>
        Those are the values the calculator above opens with. The vial size and
        water volume are the amounts the REGEN catalog reports for {p.name};
        change any field and the arithmetic follows.
      </p>
    </>
  );
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const c = calculatorBySlug(tool);
  if (!c) notFound();

  const p = c.peptide;
  const appStoreUrl = buildAppStoreUrl();
  const category = categoryBySlug(p.category);
  const url = `${SITE_URL}/tools/${c.slug}`;
  const title = `${p.name} Reconstitution Calculator`;
  const m = presetMath(c);
  const chart = reconstitutionChart(c);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: title,
          url,
          applicationCategory: "HealthApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          description: `Reconstitution calculator for ${p.name}: converts vial strength, bacteriostatic water, and target dose into syringe units.`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          isAccessibleForFree: true,
          publisher: { "@type": "Organization", name: "REGEN", url: SITE_URL },
        }}
      />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <main className="tool-page">
          <Crumbs
            trail={[
              { label: "Tools", href: "/tools" },
              { label: p.name, href: hrefFor(p) },
              { label: "Calculator" },
            ]}
          />
          <div className="section-head">
            <h1 className="section-title">
              {p.name} reconstitution{" "}
              <span className="muted-phrase">calculator.</span>
            </h1>
            <p className="section-lede">
              Pre-filled with the {fmt(c.vialMg, 2)}&nbsp;mg vial and{" "}
              {fmt(c.bacMl, 2)}&nbsp;mL of bacteriostatic water the REGEN
              catalog reports for {p.name}. Every field is editable.
            </p>
          </div>

          <Calculator
            defaults={{ vialMg: c.vialMg, bacMl: c.bacMl, doseMcg: c.doseMcg }}
          />

          <div className="tool-notes">
            <MedicalDisclaimer />

            <WorkedExample c={c} />

            {c.doseLabel && (
              <>
                <h2>What the research reports for {p.name}</h2>
                <p>
                  Published protocols for {p.name} report{" "}
                  <strong>{c.doseLabel}</strong>
                  {c.frequencyLabel ? `, ${c.frequencyLabel}` : ""}. That is
                  what the literature describes, not a recommendation.{" "}
                  {/* Only claim the prefill when there IS one. Five compounds
                      deliberately start with an empty dose field: their catalog
                      dose is weight-based, absent, or (Melanotan I) an implant
                      larger than the vial, so there is no starting number to
                      honestly put in the box. */}
                  {c.doseMcg !== null
                    ? "The calculator starts at the low end of it."
                    : "The dose field starts empty, because that figure does not convert to a single dose for this vial."}{" "}
                  The <a href={hrefFor(p)}>{p.name} reference page</a> carries
                  the evidence grade, the side-effect profile, and the primary
                  sources behind that range.
                </p>
              </>
            )}

            <h2 id="chart">
              {p.name} reconstitution chart for a {fmt(c.vialMg, 2)} mg vial
            </h2>
            <p>
              The same {fmt(c.vialMg, 2)}&nbsp;mg of {p.name} at four common
              water volumes. More water does not mean more compound, it spreads
              the same amount across a bigger volume, so the same dose is drawn
              to a higher number of units. That is usually the safer direction
              to be imprecise in: small errors on a longer draw matter
              proportionally less.
            </p>
            <div className="tool-table-wrap">
              <table className="tool-table">
                <thead>
                  <tr>
                    <th scope="col">Bacteriostatic water</th>
                    <th scope="col">Concentration</th>
                    <th scope="col">Per unit (U-100)</th>
                    {c.doseMcg !== null && (
                      <th scope="col">
                        Units for {fmt(c.doseMcg, 0)}&nbsp;mcg
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {chart.map((row) => (
                    <tr key={row.bacMl} className={row.isDefault ? "is-default" : undefined}>
                      <th scope="row">
                        {fmt(row.bacMl, 2)}&nbsp;mL
                        {row.isDefault ? " (catalog)" : ""}
                      </th>
                      <td>{fmt(row.concentration, 2)}&nbsp;mg/mL</td>
                      <td>{fmt(row.mcgPerUnit, 1)}&nbsp;mcg</td>
                      {c.doseMcg !== null && (
                        <td>{row.units === null ? "" : `${fmt(row.units, 1)} units`}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              &quot;Units&quot; here means syringe graduations, not
              international units. They are unrelated measures that share a
              name, and conflating them is its own category of mistake. The{" "}
              <a href="/tools">reconstitution calculator</a> explains the
              arithmetic behind these columns in full.
            </p>

            <h2>More on {p.name}</h2>
            <p>
              The <a href={hrefFor(p)}>{p.name} reference page</a> covers how it
              works, what the research grade means, side effects, and
              pharmacokinetics
              {category ? (
                <>
                  , alongside the rest of the{" "}
                  <a href={`/library/${category.slug}`}>
                    {category.label.toLowerCase()}
                  </a>{" "}
                  compounds
                </>
              ) : null}
              . For a different compound, the{" "}
              <a href="/tools">generic reconstitution calculator</a> takes any
              vial and dose.
            </p>
          </div>
        </main>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
