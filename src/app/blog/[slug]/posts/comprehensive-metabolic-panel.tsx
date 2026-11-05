import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="what-a-cmp-measures">01 — What a comprehensive metabolic panel measures</h2>
      <p>A comprehensive metabolic panel, or CMP, is a routine chemistry blood test that reports 14 markers from one sample. They fall into four groups: glucose; the electrolytes sodium, potassium, chloride and carbon dioxide (bicarbonate), plus calcium; the kidney markers blood urea nitrogen (BUN) and creatinine; and the liver and protein markers albumin, total protein, alkaline phosphatase (ALP), alanine aminotransferase (ALT), aspartate aminotransferase (AST) and bilirubin.</p>
      <p>A basic metabolic panel (BMP) is the smaller version: it keeps glucose, the electrolytes, calcium, BUN and creatinine, and drops the liver and protein markers. Most lab reports also show an estimated glomerular filtration rate (eGFR), which is calculated from creatinine rather than measured directly.</p>

      <figure className="post-figure">
        <img src="/blog-charts/comprehensive-metabolic-panel.png" alt="Upper limits of normal for ALT in use in 2002 vs updated healthy limits computed from 6,835 low-risk blood donors (Prati 2002)" loading="lazy" />
        <figcaption>Upper limits of normal for ALT in use in 2002 vs updated healthy limits computed from 6,835 low-risk blood donors (Prati 2002) · Source: REGEN analysis of the cited studies</figcaption>
      </figure>

      <h2 id="how-reference-ranges-work">02 — How reference ranges are set</h2>
      <p>Every CMP result is printed next to a reference range. A 2025 review of how labs set those ranges explains that a lab usually tests at least 120 healthy people and adopts the central 95% of their values as normal. By definition, that <a href="https://pubmed.ncbi.nlm.nih.gov/40268322/" target="_blank" rel="noopener noreferrer">labels 5% of healthy people as having an abnormal result</a> on any one test.</p>
      <p>Ranges also differ between labs. A 2026 study <a href="https://pubmed.ncbi.nlm.nih.gov/42448140/" target="_blank" rel="noopener noreferrer">derived 99% reference intervals from 23,422 adult outpatients</a> and tested them in another 28,006. For sodium, chloride, calcium and carbon dioxide, flagging barely changed between the manufacturer&apos;s ranges and the wider 99% ranges. For creatinine, AST, ALT, ALP, BUN, potassium and total protein, the manufacturer&apos;s ranges flagged a markedly higher share of results.</p>

      <h2 id="liver-markers">03 — Liver markers: ALT, AST, ALP and bilirubin</h2>
      <p>ALT and AST are enzymes released when liver cells are damaged, ALP comes from the liver and bone, and bilirubin is a breakdown product of red blood cells that the liver clears. Albumin and total protein reflect the proteins the liver makes. Where the upper limit for ALT should sit has been debated for years.</p>
      <p>A study of <a href="https://pubmed.ncbi.nlm.nih.gov/12093239/" target="_blank" rel="noopener noreferrer">6,835 first-time blood donors</a> at the lowest risk of liver disease in Milan computed healthy upper limits for ALT of 30 U/L for men and 19 U/L for women, lower than the limits then in use of 40 U/L and 30 U/L. In that study, ALT levels were independently related to body mass index and to lab signs of abnormal lipid or carbohydrate metabolism.</p>

      <h2 id="kidney-markers">04 — Kidney markers: creatinine, BUN and eGFR</h2>
      <p>Creatinine is a waste product of muscle that the kidneys filter, and BUN reflects urea, a waste product of protein. Because creatinine depends on muscle as well as kidney filtration, eGFR equations adjust it for age and sex. In 2021, <a href="https://pubmed.ncbi.nlm.nih.gov/34554658/" target="_blank" rel="noopener noreferrer">new CKD-EPI equations were developed without a race term</a> in studies of 8,254 and 5,352 participants and validated in 4,050.</p>
      <p>In that validation, an equation using both creatinine and cystatin C, a second blood marker, was <a href="https://pubmed.ncbi.nlm.nih.gov/34554658/" target="_blank" rel="noopener noreferrer">more accurate than creatinine alone</a>, and 85% or more of estimates were within 30% of measured GFR. Creatine supplements are one known non-kidney influence: a <a href="https://pubmed.ncbi.nlm.nih.gov/42035842/" target="_blank" rel="noopener noreferrer">meta-analysis of 19 randomized trials and one crossover study</a> found creatine raised serum creatinine by 0.13 mg/dL on average, with no significant difference in urea or eGFR.</p>

      <PostCta variant="ai" />

      <h2 id="exercise-and-liver-enzymes">05 — How hard training shows up on a CMP</h2>
      <p>AST and ALT are also found in muscle, so training can move them. In a <a href="https://pubmed.ncbi.nlm.nih.gov/17764474/" target="_blank" rel="noopener noreferrer">study of 15 healthy men who were active but not used to weightlifting</a>, a single one-hour weightlifting session significantly raised AST and ALT, along with the muscle markers creatine kinase and myoglobin, and they stayed elevated for at least 7 days.</p>
      <p>In the same study, bilirubin, gamma GT and ALP stayed within the normal range. The authors concluded that <a href="https://pubmed.ncbi.nlm.nih.gov/17764474/" target="_blank" rel="noopener noreferrer">intensive muscular exercise should be considered</a> as a cause of symptom-free rises in liver function tests. Similar context matters for hormone labs, which we cover in our guide to <a href="/blog/reading-free-testosterone">reading free testosterone</a>.</p>

      <h2 id="blood-draw">06 — The blood draw itself</h2>
      <p>Potassium can rise in the tube rather than in the body. A quality improvement report from a Japanese hospital found that <a href="https://pubmed.ncbi.nlm.nih.gov/20801569/" target="_blank" rel="noopener noreferrer">repeated fist clenching during the blood draw raised measured serum potassium</a> in healthy volunteers. After the hospital adopted a protocol that avoided fist clenching, unexplained potassium readings of 6.5 mmol/L or higher fell from 8 of 73,846 outpatients to 1 of 171,053.</p>
      <p>Taken together, a single flagged value on one CMP is often hard to interpret on its own, and the ordering clinician is the person to discuss it with. The same caution applies to other lab tests we cover, such as the <a href="/blog/igf-1-test">IGF-1 test</a>.</p>
      <p>For questions about what a marker can mean, Regen AI answers with the cited research shown inline, so each claim can be checked against its source. The <a href="/library">REGEN Library</a> collects research pages graded by strength of evidence, and our <a href="/library/how-we-grade">how we grade page</a> explains how those grades are set.</p>

      <h2 id="faq">FAQ</h2>
        <h3 id="faq-1">What is a comprehensive metabolic panel?</h3>
        <p>A comprehensive metabolic panel (CMP) is a routine blood test that reports 14 markers: glucose, sodium, potassium, chloride, carbon dioxide, calcium, BUN, creatinine, albumin, total protein, ALP, ALT, AST and bilirubin. Most reports also include an eGFR calculated from creatinine.</p>
        <h3 id="faq-2">What is the difference between a CMP and a BMP?</h3>
        <p>A basic metabolic panel (BMP) covers glucose, the electrolytes, calcium, BUN and creatinine. A CMP adds the liver and protein markers: albumin, total protein, ALP, ALT, AST and bilirubin.</p>
        <h3 id="faq-3">Why is a healthy person&apos;s CMP result sometimes flagged?</h3>
        <p>Reference ranges are usually set as the central 95% of results from healthy people, so 5% of healthy people fall outside the range on any one test by definition. Ranges for kidney and liver markers also vary between labs.</p>
        <h3 id="faq-4">Does exercise affect a comprehensive metabolic panel?</h3>
        <p>It can. In a study of 15 healthy men, one hour of weightlifting raised AST and ALT for at least 7 days, while bilirubin and ALP stayed normal.</p>
        <h3 id="faq-5">Does creatine affect creatinine on a CMP?</h3>
        <p>In a meta-analysis of randomized trials, creatine supplementation raised serum creatinine by 0.13 mg/dL on average, with no significant difference in urea or eGFR.</p>
    </>
  );
}

const post: PostMeta = {
  title: "Comprehensive Metabolic Panel: What It Measures",
  category: "Biomarkers",
  date: "Nov 5, 2026",
  readTime: "4 min read",
  cover: "/blog/comprehensive-metabolic-panel/cover",
  lead: "A comprehensive metabolic panel (CMP) is a 14-marker blood test covering glucose, electrolytes, kidney function and liver function. Reference ranges are usually set as the central 95% of healthy results, so 5% of healthy people land outside any one range by design.",
  stat: { value: "5%", label: "of healthy people fall outside a typical 95% reference range on any one test, by definition (2025 review)" },
  description: "What does a comprehensive metabolic panel measure? A plain guide to the 14 CMP markers, how reference ranges are set, and what can move liver and kidney results.",
  datePublished: "2026-11-05",
  dateModified: "2026-11-05",
  author: { initials: "EM", name: "Ekam Mehat", role: "REGEN Editorial" },
  toc: [
    { id: "what-a-cmp-measures", label: "01 \u2014 What a comprehensive metabolic panel measures" },
    { id: "how-reference-ranges-work", label: "02 \u2014 How reference ranges are set" },
    { id: "liver-markers", label: "03 \u2014 Liver markers: ALT, AST, ALP and bilirubin" },
    { id: "kidney-markers", label: "04 \u2014 Kidney markers: creatinine, BUN and eGFR" },
    { id: "exercise-and-liver-enzymes", label: "05 \u2014 How hard training shows up on a CMP" },
    { id: "blood-draw", label: "06 \u2014 The blood draw itself" }
  ],
  faq: [
    { q: "What is a comprehensive metabolic panel?", a: "A comprehensive metabolic panel (CMP) is a routine blood test that reports 14 markers: glucose, sodium, potassium, chloride, carbon dioxide, calcium, BUN, creatinine, albumin, total protein, ALP, ALT, AST and bilirubin. Most reports also include an eGFR calculated from creatinine." },
    { q: "What is the difference between a CMP and a BMP?", a: "A basic metabolic panel (BMP) covers glucose, the electrolytes, calcium, BUN and creatinine. A CMP adds the liver and protein markers: albumin, total protein, ALP, ALT, AST and bilirubin." },
    { q: "Why is a healthy person's CMP result sometimes flagged?", a: "Reference ranges are usually set as the central 95% of results from healthy people, so 5% of healthy people fall outside the range on any one test by definition. Ranges for kidney and liver markers also vary between labs." },
    { q: "Does exercise affect a comprehensive metabolic panel?", a: "It can. In a study of 15 healthy men, one hour of weightlifting raised AST and ALT for at least 7 days, while bilirubin and ALP stayed normal." },
    { q: "Does creatine affect creatinine on a CMP?", a: "In a meta-analysis of randomized trials, creatine supplementation raised serum creatinine by 0.13 mg/dL on average, with no significant difference in urea or eGFR." }
  ],
  Content,
};

export default post;
