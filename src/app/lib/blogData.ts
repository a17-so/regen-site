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
    slug: "what-to-look-for-in-peptide-protocol-management-workflow-for-dosing-accuracy",
    title: "What to Look for in Peptide Protocol Management Workflows for Dosing Accuracy",
    excerpt:
      "A practical framework for evaluating peptide protocol management software for dosing accuracy, from workflow mapping and reconstitution math to audit trails, collaboration, and system-of-record fit.",
    category: "Protocols",
    date: "July 12, 2026",
    dateSort: 20260712,
    readTime: "7 min read",
    cover: "/screens/screen-inventory.png",
    href: "/blog/what-to-look-for-in-peptide-protocol-management-workflow-for-dosing-accuracy",
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
