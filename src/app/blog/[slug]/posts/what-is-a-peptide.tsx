import type { PostMeta } from "./types";
import PostCta from "../PostCta";

function Content() {
  return (
    <>
      <h2 id="what-is-a-peptide">01 — What a peptide is</h2>
      <p>A peptide is a short chain of amino acids joined by peptide bonds. One pharmacology review defines peptides as <a href="https://pubmed.ncbi.nlm.nih.gov/35076485/" target="_blank" rel="noopener noreferrer">short chains of 2 to 50 amino acids linked together by peptide bonds</a>, with a molecular weight under 10 kDa, and notes that the body naturally produces many different peptides.</p>
      <p>Amino acids are the building blocks of proteins. When two or more of them link through a peptide bond, the result is a peptide. That same review explains that peptides draw interest as medicines partly because so many already occur naturally in the body. The <a href="/library/all-peptides">REGEN peptide library</a> lists individual peptides along with the research published on each one.</p>

      <figure className="post-figure">
        <img src="/blog-charts/what-is-a-peptide.png" alt="Approximate amino-acid cutoffs for oligopeptides, polypeptides and proteins (Wang 2025, citing IUPAC rules)" loading="lazy" />
        <figcaption>Approximate amino-acid cutoffs for oligopeptides, polypeptides and proteins (Wang 2025, citing IUPAC rules) · Source: REGEN analysis of the cited studies</figcaption>
      </figure>

      <h2 id="peptide-vs-protein">02 — Peptides vs proteins</h2>
      <p>The main difference between a peptide and a protein is size and structure. A 2025 review, citing IUPAC naming rules, describes oligopeptides as having fewer than about 10 to 20 amino acids and polypeptides more than 20, while <a href="https://pubmed.ncbi.nlm.nih.gov/39777813/" target="_blank" rel="noopener noreferrer">proteins usually have more than 50 amino acids</a>.</p>
      <p>The cutoffs are approximate rather than exact, which is why different papers draw the line in slightly different places. The same review notes that <a href="https://pubmed.ncbi.nlm.nih.gov/39777813/" target="_blank" rel="noopener noreferrer">peptides are structural components of hormones, enzymes, toxins and antibiotics</a>. Some of its co-authors work for Procter &amp; Gamble, and the review also covers cosmetic uses of peptides.</p>

      <h2 id="peptide-drugs">03 — Peptides as approved medicines</h2>
      <p>Peptide medicines are not new. A 2021 review in Nature Reviews Drug Discovery reports that since the introduction of insulin almost a century ago, <a href="https://pubmed.ncbi.nlm.nih.gov/33536635/" target="_blank" rel="noopener noreferrer">more than 80 peptide drugs have reached the market</a>.</p>
      <p>Those drugs cover a wide range of diseases, including diabetes, cancer, osteoporosis, multiple sclerosis, HIV infection and chronic pain. The review traces how the field moved from early work on human hormones to peptides found in nature and newer design methods.</p>

      <PostCta variant="ai" />

      <h2 id="unapproved-peptides">04 — Approved drugs vs newer unapproved peptides</h2>
      <p>Not every peptide people search for is an approved drug. A 2026 review notes that while several peptide drugs have gone through formal approval processes that evaluate safety and efficacy, <a href="https://pubmed.ncbi.nlm.nih.gov/42123471/" target="_blank" rel="noopener noreferrer">novel unapproved compounds are spreading into preventive medicine and performance enhancement</a>.</p>
      <p>That review, which looked at 106 articles, concluded that <a href="https://pubmed.ncbi.nlm.nih.gov/42123471/" target="_blank" rel="noopener noreferrer">further studies are needed before most new peptides can be used safely in humans</a>. One of its two authors reports research grants from Cellgenic, a company in the regenerative medicine field.</p>
      <p><a href="/library/recovery/bpc-157">BPC-157</a> is one widely discussed example. A separate 2026 review found that <a href="https://pubmed.ncbi.nlm.nih.gov/42198317/" target="_blank" rel="noopener noreferrer">available clinical data derive from fewer than 30 subjects across three uncontrolled pilot studies</a>, none of which used standardized pharmaceutical preparations, and that no pharmaceutical-grade formulation has been developed or validated.</p>
      <p>The same review notes that despite over three decades of preclinical research, meaning lab and animal studies, <a href="/library/recovery/bpc-157">BPC-157</a> has no approved formulation, no validated dosing regimen and no completed Phase II clinical trial. Phase II trials are the stage where a treatment is first tested for effect in a larger group of patients, so the human evidence for <a href="/library/recovery/bpc-157">BPC-157</a> remains at a very early stage.</p>

      <h2 id="reading-peptide-evidence">05 — How to read evidence on a specific peptide</h2>
      <p>Because the word peptide covers both long-established medicines and compounds with almost no human data, the useful question is what the research shows for one specific peptide. That means looking at whether human trials exist, how large they were, and whether they had a comparison group. A small uncontrolled pilot study, for example, cannot show whether an observed change came from the peptide or from something else.</p>
      <p>REGEN&apos;s library summarizes the published research on individual peptides and labels the strength of the evidence, and the grading method is described on the <a href="/library/how-we-grade">how we grade page</a>.</p>

      <h2 id="faq">FAQ</h2>
        <h3 id="faq-1">What is a peptide in simple terms?</h3>
        <p>A peptide is a short chain of amino acids joined by peptide bonds. One pharmacology review defines peptides as chains of 2 to 50 amino acids, and the body naturally makes many of them.</p>
        <h3 id="faq-2">What is the difference between a peptide and a protein?</h3>
        <p>Mostly size and structure. A 2025 review citing IUPAC rules describes oligopeptides as fewer than about 10 to 20 amino acids, polypeptides as more than 20, and proteins as usually more than 50 amino acids. The cutoffs are approximate.</p>
        <h3 id="faq-3">Are peptides drugs?</h3>
        <p>Some are. A 2021 review reports that more than 80 peptide drugs have reached the market since insulin, for conditions including diabetes, cancer, osteoporosis and HIV infection. Many other peptides discussed online are not approved medicines.</p>
        <h3 id="faq-4">Has BPC-157 been tested in humans?</h3>
        <p>Only in a very limited way. A 2026 review found clinical data from fewer than 30 subjects across three uncontrolled pilot studies, and no pharmaceutical-grade formulation has been developed or validated.</p>
    </>
  );
}

const post: PostMeta = {
  title: "What Is a Peptide? What the Research Shows",
  category: "Science",
  date: "Oct 29, 2026",
  readTime: "3 min read",
  cover: "/blog/what-is-a-peptide/cover",
  lead: "A peptide is a short chain of amino acids, usually defined as about 2 to 50, joined by peptide bonds. Some peptides are long-established medicines, such as insulin, while many peptides discussed online have little or no human trial data.",
  description: "What a peptide is, how peptides differ from proteins, which peptides are approved medicines, and what research shows on newer unapproved peptides.",
  datePublished: "2026-10-29",
  dateModified: "2026-10-29",
  author: { initials: "EM", name: "Ekam Mehat", role: "REGEN Editorial" },
  toc: [
    { id: "what-is-a-peptide", label: "01 \u2014 What a peptide is" },
    { id: "peptide-vs-protein", label: "02 \u2014 Peptides vs proteins" },
    { id: "peptide-drugs", label: "03 \u2014 Peptides as approved medicines" },
    { id: "unapproved-peptides", label: "04 \u2014 Approved drugs vs newer unapproved peptides" },
    { id: "reading-peptide-evidence", label: "05 \u2014 How to read evidence on a specific peptide" }
  ],
  faq: [
    { q: "What is a peptide in simple terms?", a: "A peptide is a short chain of amino acids joined by peptide bonds. One pharmacology review defines peptides as chains of 2 to 50 amino acids, and the body naturally makes many of them." },
    { q: "What is the difference between a peptide and a protein?", a: "Mostly size and structure. A 2025 review citing IUPAC rules describes oligopeptides as fewer than about 10 to 20 amino acids, polypeptides as more than 20, and proteins as usually more than 50 amino acids. The cutoffs are approximate." },
    { q: "Are peptides drugs?", a: "Some are. A 2021 review reports that more than 80 peptide drugs have reached the market since insulin, for conditions including diabetes, cancer, osteoporosis and HIV infection. Many other peptides discussed online are not approved medicines." },
    { q: "Has BPC-157 been tested in humans?", a: "Only in a very limited way. A 2026 review found clinical data from fewer than 30 subjects across three uncontrolled pilot studies, and no pharmaceutical-grade formulation has been developed or validated." }
  ],
  Content,
};

export default post;
