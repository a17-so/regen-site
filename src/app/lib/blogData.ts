export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  dateSort: number;
  readTime: string;
  cover: string;
  href: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "aod-9604-and-the-reality-of-commercial-weight-loss-claims",
    title: "AOD-9604 and the Reality of Commercial Weight-Loss Claims",
    excerpt: "AOD-9604 is not FDA-approved for weight loss. The peptide lacks demonstrated clinical outcomes, emphasizing the need to track actual metabolic biomarkers.",
    category: "Science",
    date: "Jul 21, 2026",
    dateSort: 20260721,
    readTime: "3 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/aod-9604-and-the-reality-of-commercial-weight-loss-claims",
  },
  {
    slug: "selank-immunomodulation-and-gene-expression",
    title: "Selank: Immunomodulation and Gene Expression",
    excerpt: "Selank alters the inflammatory baseline by modulating gene expression, specifically downregulating C3 and Xcr1 mRNA in animal models.",
    category: "Science",
    date: "Jul 20, 2026",
    dateSort: 20260720,
    readTime: "3 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/selank-immunomodulation-and-gene-expression",
  },
  {
    slug: "oral-vs-injectable-glp-1s-orforglipron-pharmacokinetics",
    title: "Oral vs. Injectable GLP-1s: Orforglipron Pharmacokinetics",
    excerpt: "Orforglipron is a daily oral nonpeptide GLP-1 receptor agonist. Evaluate your starting metabolic deficit to decide between oral and injectable dual agonists.",
    category: "Science",
    date: "Jul 19, 2026",
    dateSort: 20260719,
    readTime: "2 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/oral-vs-injectable-glp-1s-orforglipron-pharmacokinetics",
  },
  {
    slug: "tissue-recovery-bpc-157-vs-tb-500-mechanisms",
    title: "Tissue Recovery: BPC-157 vs TB-500 Mechanisms",
    excerpt: "Understanding tissue recovery mechanisms requires mapping molecular repair pathways against objective biomarker data to track distinct physiological changes.",
    category: "Science",
    date: "Jul 18, 2026",
    dateSort: 20260718,
    readTime: "3 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/tissue-recovery-bpc-157-vs-tb-500-mechanisms",
  },
  {
    slug: "pharmacological-profiles-pt-141-vs-melanotan-ii",
    title: "Pharmacological Profiles: PT-141 vs. Melanotan II Realities",
    excerpt: "PT-141 and Melanotan II present distinct clinical realities. While bremelanotide holds approval for HSDD, trial data reveals negligible objective improvements.",
    category: "Science",
    date: "Jul 17, 2026",
    dateSort: 20260717,
    readTime: "2 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/pharmacological-profiles-pt-141-vs-melanotan-ii",
  },
  {
    slug: "pharmacokinetic-profiles-cjc-1295-vs-sermorelin",
    title: "Pharmacokinetic Profiles: CJC-1295 vs. Sermorelin",
    excerpt: "The difference between CJC-1295 and Sermorelin lies in their pharmacokinetic architecture, contrasting a multi-day sustained baseline with a rapid endogenous",
    category: "Science",
    date: "Jul 16, 2026",
    dateSort: 20260716,
    readTime: "3 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/pharmacokinetic-profiles-cjc-1295-vs-sermorelin",
  },
  {
    slug: "tesamorelin-pharmacokinetics-and-clinical-utility",
    title: "Tesamorelin Pharmacokinetics and Clinical Utility",
    excerpt: "Tesamorelin is an FDA-approved growth hormone-releasing hormone analog. In specific clinical populations, data demonstrates it reduces visceral and hepatic fat.",
    category: "Science",
    date: "Jul 16, 2026",
    dateSort: 20260716,
    readTime: "3 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/tesamorelin-pharmacokinetics-and-clinical-utility",
  },
  {
    slug: "retatrutide-vs-tirzepatide",
    title: "Retatrutide vs Tirzepatide: a practical comparison",
    excerpt:
      "Two GLP-1s, two pharmacokinetic profiles, two very different titration curves. Here's how we'd decide between them, based on what the trials actually show.",
    category: "Protocols",
    date: "May 18, 2026",
    dateSort: 20260518,
    readTime: "8 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/retatrutide-vs-tirzepatide",
  },
  {
    slug: "reading-free-testosterone",
    title: "How to read a free testosterone trend line",
    excerpt:
      "Total T tells you almost nothing. Free T tells you most of the story. This is how to read the shape, not just the number.",
    category: "Biomarkers",
    date: "May 12, 2026",
    dateSort: 20260512,
    readTime: "6 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/reading-free-testosterone",
  },
  {
    slug: "reconstitution-without-anxiety",
    title: "Reconstitution math, without the anxiety",
    excerpt:
      "Most reconstitution errors are not math errors — they're attention errors. A two-step process that removes every chance for either.",
    category: "Protocols",
    date: "May 4, 2026",
    dateSort: 20260504,
    readTime: "5 min read",
    cover: "/screens/screen-inventory.png",
    href: "/blog/reconstitution-without-anxiety",
  },
];

export const BLOG_CATEGORIES = [
  "All",
  "Protocols",
  "Biomarkers",
  "Nutrition",
  "Recovery",
  "Science",
];
