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
  {
    slug: "how-to-verify-peptide-vendors-and-compare-marketplace-software",
    title: "How to Verify Peptide Vendors and Compare Marketplace Software",
    excerpt:
      "A practical workflow for COA validation, lot traceability, and comparing marketplace software against the way vendor data actually moves through dosing protocols.",
    category: "Protocols",
    date: "July 13, 2026",
    dateSort: 20260713,
    readTime: "9 min read",
    cover: "/screens/screen-ai.png",
    href:
      "/blog/how-to-verify-peptide-vendors-and-compare-marketplace-software",
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
