import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="what-it-measures">01 — What an IGF-1 test measures</h2>
      <p>An IGF-1 blood test measures insulin-like growth factor I in a serum sample. A 2009 review explains that IGF-I measured by immunoassay is <a href="https://pubmed.ncbi.nlm.nih.gov/19153502/" target="_blank" rel="noopener noreferrer">used to diagnose GH deficiency and acromegaly</a>, and to monitor treatment in patients with acromegaly.</p>
      <p>The same review states that <a href="https://pubmed.ncbi.nlm.nih.gov/19153502/" target="_blank" rel="noopener noreferrer">assay- and age-specific reference ranges are mandatory</a> for meaningful interpretation of IGF-I concentrations. In plain terms, a result only means something next to the reference range for that specific test and that age group. REGEN&apos;s <a href="/blog/reading-free-testosterone">guide to reading free testosterone</a> walks through the same reference-range idea for another hormone.</p>

      <figure className="post-figure">
        <img src="/blog-charts/igf-1-test.png" alt="IGF-1 results for the same 110 serum samples on four lab platforms, as a percent of DiaSorin Liaison (Lee 2023)" loading="lazy" />
        <figcaption>IGF-1 results for the same 110 serum samples on four lab platforms, as a percent of DiaSorin Liaison (Lee 2023) · Source: REGEN analysis of the cited studies</figcaption>
      </figure>

      <h2 id="age-and-sex">02 — Why age and sex change the normal range</h2>
      <p>IGF-1 levels change a lot with age. A 2014 study that built reference ranges from <a href="https://pubmed.ncbi.nlm.nih.gov/24606072/" target="_blank" rel="noopener noreferrer">15,014 subjects aged 0 to 94 across 12 cohorts</a> found a decline immediately after birth, then a rise to the highest levels around puberty, at about 15 years of age, and a continuous decrease later in life.</p>
      <p>The same study found that the impact of sex is small, although across the lifespan <a href="https://pubmed.ncbi.nlm.nih.gov/24606072/" target="_blank" rel="noopener noreferrer">women have lower mean IGF-I concentrations</a>. It also reported that geographical region and sampling setting did not affect the reference intervals, which were built for one specific automated assay.</p>

      <h2 id="lab-platforms">03 — Why the lab can change the number</h2>
      <p>Different lab machines can report different IGF-1 values for the same blood sample. A 2023 study measured 110 serum specimens on four platforms and found <a href="https://pubmed.ncbi.nlm.nih.gov/36528048/" target="_blank" rel="noopener noreferrer">approximately 36% negative variation on Siemens Immulite</a> compared with DiaSorin Liaison.</p>
      <p>Compared with Liaison, the same samples read about 8% lower on IDS iSYS and about 17% lower on LC-MS/MS, a mass-spectrometry method. The authors concluded that <a href="https://pubmed.ncbi.nlm.nih.gov/36528048/" target="_blank" rel="noopener noreferrer">overall agreement between different platforms was poor</a> and that the variation between platforms increased as IGF-1 values increased.</p>

      <PostCta variant="labs" />

      <h2 id="standardization">04 — Why labs still disagree</h2>
      <p>Representatives of the Growth Hormone Research Society, the IGF Society and the IFCC convened an international workshop on how growth hormone and IGF-I are measured. Their consensus statement concludes that <a href="https://pubmed.ncbi.nlm.nih.gov/21285256/" target="_blank" rel="noopener noreferrer">major improvements are necessary in the areas of assay performance and comparability</a>.</p>
      <p>The workshop gave special attention to preanalytical conditions, meaning how a sample is collected and handled before it is tested, and to <a href="https://pubmed.ncbi.nlm.nih.gov/21285256/" target="_blank" rel="noopener noreferrer">interference by binding proteins</a>. For IGF-I it recommended normative data by age range, with consideration of Tanner staging, which describes stage of puberty, and of body mass index.</p>

      <h2 id="low-result">05 — What a low IGF-1 result does not prove</h2>
      <p>An IGF-1 result on its own does not establish adult growth hormone deficiency. The Endocrine Society&apos;s clinical practice guideline states that <a href="https://pubmed.ncbi.nlm.nih.gov/21602453/" target="_blank" rel="noopener noreferrer">confirmation through stimulation testing is usually required</a> unless there is a proven genetic or structural lesion persistent from childhood.</p>
      <p>A stimulation test checks how much growth hormone the body releases in response to a specific trigger under medical supervision. The guideline also notes that growth hormone deficiency <a href="https://pubmed.ncbi.nlm.nih.gov/21602453/" target="_blank" rel="noopener noreferrer">can persist from childhood or be newly acquired</a> in adulthood, which is part of why the diagnosis involves more than one blood value.</p>

      <PostCta variant="ai" />

      <h2 id="tracking-over-time">06 — Comparing IGF-1 results over time</h2>
      <p>For repeat tests, the 2009 review notes that a high degree of <a href="https://pubmed.ncbi.nlm.nih.gov/19153502/" target="_blank" rel="noopener noreferrer">methodological consistency in the assay is essential for long-term monitoring</a> of individual patients. Because platforms can disagree, a change between two results is easiest to read when both came from the same lab method.</p>
      <p>REGEN lets you upload bloodwork and see biomarkers such as IGF-1 as a trend line over time, with values outside the reference range flagged. The library pages for growth-hormone-related compounds such as <a href="/library/weight-loss/tesamorelin">tesamorelin</a> and <a href="/library/performance/sermorelin">sermorelin</a> summarize the published research on each one, and the <a href="/library/how-we-grade">how we grade page</a> explains how that evidence is rated.</p>

      <h2 id="faq">FAQ</h2>
        <h3 id="faq-1">What does an IGF-1 test measure?</h3>
        <p>It measures insulin-like growth factor I in a blood serum sample. A 2009 review explains that it is used to diagnose growth hormone deficiency and acromegaly and to monitor acromegaly treatment.</p>
        <h3 id="faq-2">What is a normal IGF-1 level?</h3>
        <p>There is no single normal number. Ranges depend on age, sex and the specific assay. A 2014 study of 15,014 people found levels highest around age 15 and declining continuously later in life.</p>
        <h3 id="faq-3">Why do IGF-1 results differ between labs?</h3>
        <p>Lab platforms measure IGF-1 differently. A 2023 study of 110 samples found Siemens Immulite read about 36% lower than DiaSorin Liaison, and agreement between platforms was poor.</p>
        <h3 id="faq-4">Does a low IGF-1 test confirm growth hormone deficiency?</h3>
        <p>Not on its own. The Endocrine Society guideline says adult growth hormone deficiency usually needs confirmation through stimulation testing unless there is a proven genetic or structural lesion persistent from childhood.</p>
    </>
  );
}

const post: PostMeta = {
  title: "IGF-1 Test: What It Measures and How to Read It",
  category: "Biomarkers",
  date: "Oct 31, 2026",
  readTime: "3 min read",
  cover: "/blog/igf-1-test/cover",
  lead: "An IGF-1 test measures insulin-like growth factor I in your blood, and doctors use it to look for growth hormone disorders. A result only makes sense against an age- and assay-specific reference range, and different lab platforms can report noticeably different values for the same sample.",
  stat: { value: "36%", label: "lower IGF-1 on one lab platform than another for the same samples" },
  description: "What an IGF-1 blood test measures, why normal ranges depend on age and lab method, and why one low result does not confirm GH deficiency.",
  datePublished: "2026-10-31",
  dateModified: "2026-10-31",
  author: { initials: "EM", name: "Ekam Mehat", role: "REGEN Editorial" },
  toc: [
    { id: "what-it-measures", label: "01 \u2014 What an IGF-1 test measures" },
    { id: "age-and-sex", label: "02 \u2014 Why age and sex change the normal range" },
    { id: "lab-platforms", label: "03 \u2014 Why the lab can change the number" },
    { id: "standardization", label: "04 \u2014 Why labs still disagree" },
    { id: "low-result", label: "05 \u2014 What a low IGF-1 result does not prove" },
    { id: "tracking-over-time", label: "06 \u2014 Comparing IGF-1 results over time" }
  ],
  faq: [
    { q: "What does an IGF-1 test measure?", a: "It measures insulin-like growth factor I in a blood serum sample. A 2009 review explains that it is used to diagnose growth hormone deficiency and acromegaly and to monitor acromegaly treatment." },
    { q: "What is a normal IGF-1 level?", a: "There is no single normal number. Ranges depend on age, sex and the specific assay. A 2014 study of 15,014 people found levels highest around age 15 and declining continuously later in life." },
    { q: "Why do IGF-1 results differ between labs?", a: "Lab platforms measure IGF-1 differently. A 2023 study of 110 samples found Siemens Immulite read about 36% lower than DiaSorin Liaison, and agreement between platforms was poor." },
    { q: "Does a low IGF-1 test confirm growth hormone deficiency?", a: "Not on its own. The Endocrine Society guideline says adult growth hormone deficiency usually needs confirmation through stimulation testing unless there is a proven genetic or structural lesion persistent from childhood." }
  ],
  Content,
};

export default post;
