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
    slug: "hcg-vs-gonadorelin-clinical-utility",
    title: "HCG vs Gonadorelin Clinical Utility Compared",
    excerpt: "HCG and gonadorelin serve distinct pharmacological roles. HCG provides sustained endocrine receptor stimulation, while gonadorelin clears rapidly in minutes.",
    category: "Science",
    date: "Jul 16, 2026",
    dateSort: 20260716,
    readTime: "3 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/hcg-vs-gonadorelin-clinical-utility",
  },
  {
    slug: "thymosin-alpha-1-clinical-profiles",
    title: "Thymosin Alpha-1 Clinical Profiles",
    excerpt: "Thymosin alpha-1 is a peptide studied for immune modulation. Clinical profiles highlight a 2-hour half-life, requiring precise tracking of inflammatory markers.",
    category: "Science",
    date: "Jul 15, 2026",
    dateSort: 20260715,
    readTime: "2 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/thymosin-alpha-1-clinical-profiles",
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
