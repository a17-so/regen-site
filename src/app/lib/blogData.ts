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
    slug: "tavyn-test-blog-regen-the-worlds-trusted-peptide-health-layer",
    title: "Tavyn test blog for REGEN — The world's trusted peptide health layer",
    excerpt:
      "A test article that validates REGEN's blog integration path end to end, from repository write-through to final rendered route.",
    category: "Science",
    date: "June 26, 2026",
    dateSort: 20260626,
    readTime: "2 min read",
    cover: "/screens/screen-ai.png",
    href: "/blog/tavyn-test-blog-regen-the-worlds-trusted-peptide-health-layer",
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
  {
    slug: "glp1-plateau-macros",
    title: "GLP-1 plateau? Read your macros first",
    excerpt:
      "Nine times out of ten, a stalled GLP-1 protocol isn't a dose problem — it's a protein problem. Here's how to tell the difference.",
    category: "Nutrition",
    date: "April 27, 2026",
    dateSort: 20260427,
    readTime: "7 min read",
    cover: "/screens/screen-meal.png",
    href: "/blog/retatrutide-vs-tirzepatide",
  },
  {
    slug: "bpc157-literature",
    title: "BPC-157: what the literature actually says",
    excerpt:
      "Strip out the forum noise and you're left with a small, surprisingly consistent body of work. Here's our annotated summary.",
    category: "Science",
    date: "April 21, 2026",
    dateSort: 20260421,
    readTime: "9 min read",
    cover: "/screens/screen-ai.png",
    href: "/blog/reading-free-testosterone",
  },
  {
    slug: "sleep-hrv-stack-stalls",
    title: "Sleep, HRV, and why your stack stalls",
    excerpt:
      "The fastest way to predict whether your next titration will work isn't a biomarker — it's last week's HRV trend.",
    category: "Recovery",
    date: "April 14, 2026",
    dateSort: 20260414,
    readTime: "6 min read",
    cover: "/screens/screen-home.png",
    href: "/blog/reconstitution-without-anxiety",
  },
  {
    slug: "monthly-bloodwork",
    title: "The case for monthly bloodwork",
    excerpt:
      "Quarterly was a print-era number. If you're titrating, monthly is the floor — and here's how to pay for it without going broke.",
    category: "Biomarkers",
    date: "April 6, 2026",
    dateSort: 20260406,
    readTime: "5 min read",
    cover: "/screens/screen-biomarker.png",
    href: "/blog/retatrutide-vs-tirzepatide",
  },
  {
    slug: "cycling-off",
    title: "Cycling off: a quiet, underrated skill",
    excerpt:
      "Knowing how to stop a peptide cleanly is half the protocol. We rarely talk about it. We should.",
    category: "Protocols",
    date: "March 30, 2026",
    dateSort: 20260330,
    readTime: "7 min read",
    cover: "/screens/screen-home.png",
    href: "/blog/reading-free-testosterone",
  },
  {
    slug: "photo-logging",
    title: "Photo logging: why three angles beat the scale",
    excerpt:
      "The scale lags by 2–3 weeks. Photos don't. A short note on how we use them and what to discard.",
    category: "Recovery",
    date: "March 24, 2026",
    dateSort: 20260324,
    readTime: "4 min read",
    cover: "/screens/screen-meal.png",
    href: "/blog/reconstitution-without-anxiety",
  },
  {
    slug: "glucose-without-cgm",
    title: "Glucose awareness without a CGM",
    excerpt:
      "Not everyone wants a sensor stuck to their arm. Here's the next-best practice, with cited reference ranges.",
    category: "Nutrition",
    date: "March 18, 2026",
    dateSort: 20260318,
    readTime: "6 min read",
    cover: "/screens/screen-meal.png",
    href: "/blog/reading-free-testosterone",
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
