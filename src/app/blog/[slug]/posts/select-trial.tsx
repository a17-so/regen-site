import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="the-trial-population-and-scope"><span className="lib-ch-num" aria-hidden="true">01</span>The trial population and scope</h2>
      <p>The SELECT trial included 17,604 participants, assessing the impact of a specific GLP-1 receptor agonist on cardiovascular and renal health over an extended duration. Researchers administered <a href="https://pubmed.ncbi.nlm.nih.gov/38796653/" target="_blank" rel="noopener noreferrer">once-weekly semaglutide 2.4 mg</a> to a treatment group of 8,803 individuals, comparing the results against a carefully monitored placebo group of 8,801 individuals.</p>
      <p>The study specifically targeted a high-risk demographic to isolate the compound&apos;s metabolic effects. Participants were required to have a clinical classification of overweight or obesity alongside established cardiovascular disease, while explicitly excluding individuals with a prior diabetes diagnosis to ensure the observed outcomes were not merely a byproduct of glycemic control.</p>

      <h2 id="documented-cardiovascular-reduction"><span className="lib-ch-num" aria-hidden="true">02</span>Documented cardiovascular reduction</h2>
      <p>The primary cardiovascular findings established a significant decrease in adverse events for the treatment group. The SELECT trial previously <a href="https://pubmed.ncbi.nlm.nih.gov/38796653/" target="_blank" rel="noopener noreferrer">reported a 20% reduction in major adverse cardiovascular events with semaglutide</a> versus a control baseline in patients with overweight or obesity and established cardiovascular disease, without diabetes.</p>
      <p>This substantial reduction shifted the clinical understanding of the compound from a targeted weight-management tool to a systemic metabolic stabilizer. By tracking severe cardiovascular outcomes over a multi-year timeframe, the trial provided a framework for understanding how consistent GLP-1 receptor agonism affects critical organ systems under metabolic stress.</p>

      <h2 id="defining-the-kidney-endpoints"><span className="lib-ch-num" aria-hidden="true">03</span>Defining the kidney endpoints</h2>
      <p>Beyond cardiovascular metrics, the trial framework specifically measured renal stability over time. The researchers <a href="https://pubmed.ncbi.nlm.nih.gov/38796653/" target="_blank" rel="noopener noreferrer">examined the effect of once-weekly semaglutide 2.4 mg on kidney outcomes in the SELECT trial</a>, focusing on identifying whether the cardiovascular protection extended to the renal system in this non-diabetic cohort.</p>
      <p>To quantify this protective effect, the study measured the <a href="https://pubmed.ncbi.nlm.nih.gov/38796653/" target="_blank" rel="noopener noreferrer">incidence of the pre-specified main composite kidney endpoint</a>, which established a strict threshold for renal failure. This composite endpoint explicitly included severe clinical events, specifically death from kidney disease and the formal initiation of chronic kidney replacement therapy.</p>


      <PostCta variant="labs" />

      <h2 id="tracking-egfr-and-uacr"><span className="lib-ch-num" aria-hidden="true">04</span>Tracking eGFR and UACR</h2>
      <p>Clinical trial endpoints translate into specific, trackable laboratory markers for individuals monitoring their own metabolic health. While the trial measured severe composite endpoints like the initiation of kidney replacement therapy, routine health monitoring relies on measuring the Estimated Glomerular Filtration Rate (eGFR) and Urinary Albumin-to-Creatinine Ratio (UACR).</p>
      <p>These two standard laboratory biomarkers provide a continuous view of renal function over a multi-year horizon, long before severe composite endpoints are reached. By logging these markers in a REGEN profile alongside other metabolic data, individuals establish a precise personal baseline to confirm they are capturing the protective effects associated with long-term GLP-1 therapy.</p>

      <h2 id="practical-metabolic-logging"><span className="lib-ch-num" aria-hidden="true">05</span>Practical metabolic logging</h2>
      <p>Transitioning from analyzing clinical trial data to managing personal health requires accurate, consistent record-keeping of specific physiological markers. Proper tracking ensures that metabolic interventions remain protective of internal organ function over the two-to-five-year timeline established in major clinical studies.</p>
      <p>Relying solely on external body composition changes provides an incomplete measure of overall metabolic success. For individuals managing their own protocols and interpreting laboratory results, understanding how to track these renal biomarkers is as fundamental as navigating <a href="/blog/reconstitution-without-anxiety">Reconstitution math, without the anxiety</a>, ensuring all aspects of the regimen are measured.</p>


      <PostCta variant="ai" />

      <h2 id="translating-trial-data-to-daily-use"><span className="lib-ch-num" aria-hidden="true">06</span>Translating trial data to daily use</h2>
      <p>The findings from this extensive trial confirm that specific GLP-1 therapies act as broad metabolic stabilizers rather than isolated weight-loss compounds. Tracking renal health ensures that the protective effects observed in the clinical data translate accurately to individual long-term metabolic management.</p>
      <p>Consistent logging of specific renal biomarkers ensures that the long-term effects on the kidneys remain a visible, manageable part of the health journey. Real-world users who track their eGFR and UACR avoid flying blind, successfully bridging the gap between abstract clinical trial outcomes and practical, daily metabolic health maintenance.</p>

      <div className="lib-faq">
        <h2 id="faq">Frequently asked questions</h2>
        <details>
          <summary>What is the SELECT trial?</summary>
          <p>The SELECT trial is a major clinical study that evaluated the effects of once-weekly semaglutide 2.4 mg on cardiovascular and kidney outcomes in individuals with overweight or obesity and established cardiovascular disease, without diabetes.</p>
        </details>
        <details>
          <summary>What were the main cardiovascular findings of the SELECT trial?</summary>
          <p>The trial found a 20% reduction in major adverse cardiovascular events among participants taking semaglutide compared to those taking a placebo.</p>
        </details>
        <details>
          <summary>What kidney outcomes did the SELECT trial measure?</summary>
          <p>The study measured a pre-specified composite kidney endpoint, which included severe outcomes such as death from kidney disease and the initiation of chronic kidney replacement therapy.</p>
        </details>
        <details>
          <summary>Why should eGFR and UACR be tracked?</summary>
          <p>The Estimated Glomerular Filtration Rate (eGFR) and Urinary Albumin-to-Creatinine Ratio (UACR) are specific laboratory markers that allow individuals to continuously monitor their kidney function and establish a personal health baseline over time.</p>
        </details>
      </div>
    </>
  );
}

const post: PostMeta = {
  title: "SELECT trial: semaglutide and kidney outcomes",
  category: "Protocols",
  date: "Aug 1, 2026",
  readTime: "3 min read",
  cover: "/blog/select-trial/cover",
  // The figure this article states and sources throughout ("a 20% reduction in
  // major adverse cardiovascular events"). Hand-verified against the body copy;
  // from here on the SEO agent supplies this from the brief's cited data.
  stat: {
    value: "20%",
    label: "reduction in major adverse cardiovascular events, SELECT trial",
  },
  lead: "The SELECT trial measured the clinical effects of a specific GLP-1 receptor agonist on cardiovascular and renal outcomes. In a population of individuals with overweight or obesity and established cardiovascular disease, but without diabetes, the intervention resulted in a documented 20% reduction in major adverse cardiovascular events compared to placebo.",
  takeaways: [
    "The SELECT trial reported a 20% reduction in major adverse cardiovascular events with semaglutide in a non-diabetic population.",
    "A pre-specified composite kidney endpoint extended the finding into renal health.",
    "For individuals, the trial translates into two trackable markers: eGFR and UACR.",
  ],
  description: "The SELECT trial reveals a 20% reduction in major cardiovascular events for semaglutide users, extending critical findings into renal health tracking",
  datePublished: "2026-08-01",
  dateModified: "2026-08-01",
  author: { initials: "AA", name: "Advaith Akella", role: "REGEN Editorial" },
  toc: [
    { id: "the-trial-population-and-scope", label: "01 • The trial population and scope" },
    { id: "documented-cardiovascular-reduction", label: "02 • Documented cardiovascular reduction" },
    { id: "defining-the-kidney-endpoints", label: "03 • Defining the kidney endpoints" },
    { id: "tracking-egfr-and-uacr", label: "04 • Tracking eGFR and UACR" },
    { id: "practical-metabolic-logging", label: "05 • Practical metabolic logging" },
    { id: "translating-trial-data-to-daily-use", label: "06 • Translating trial data to daily use" }
  ],
  faq: [
    { q: "What is the SELECT trial?", a: "The SELECT trial is a major clinical study that evaluated the effects of once-weekly semaglutide 2.4 mg on cardiovascular and kidney outcomes in individuals with overweight or obesity and established cardiovascular disease, without diabetes." },
    { q: "What were the main cardiovascular findings of the SELECT trial?", a: "The trial found a 20% reduction in major adverse cardiovascular events among participants taking semaglutide compared to those taking a placebo." },
    { q: "What kidney outcomes did the SELECT trial measure?", a: "The study measured a pre-specified composite kidney endpoint, which included severe outcomes such as death from kidney disease and the initiation of chronic kidney replacement therapy." },
    { q: "Why should eGFR and UACR be tracked?", a: "The Estimated Glomerular Filtration Rate (eGFR) and Urinary Albumin-to-Creatinine Ratio (UACR) are specific laboratory markers that allow individuals to continuously monitor their kidney function and establish a personal health baseline over time." }
  ],
  Content,
};

export default post;
