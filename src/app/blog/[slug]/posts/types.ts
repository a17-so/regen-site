import React from "react";

export interface Author {
  initials: string;
  name: string;
  role: string;
  // Optional E-E-A-T enrichment (the /authors registry is the source of truth;
  // these let a post override per-author metadata if ever needed).
  slug?: string;
  credential?: string;
  sameAs?: string[];
}

export interface Reviewer {
  name: string;
  credential: string;
  slug?: string;
}

export interface PostFaq {
  q: string;
  a: string;
}

export interface PostMeta {
  title: string;
  category: string;
  date: string;
  readTime: string;
  cover: string;
  lead: string;
  author: Author;
  toc: { id: string; label: string }[];
  Content: () => React.JSX.Element;
  // --- SEO/GEO metadata (all optional) ---
  // page.tsx derives description + ISO dates from blogData when these are absent,
  // so existing posts need no edits. `reviewedBy`/`lastReviewed` stay empty until
  // a credentialed medical reviewer exists (then the byline + MedicalWebPage
  // reviewedBy render automatically).
  description?: string;
  datePublished?: string; // ISO 8601
  dateModified?: string; // ISO 8601
  reviewedBy?: Reviewer;
  lastReviewed?: string; // ISO 8601
  faq?: PostFaq[];
  /** Key Takeaways card, the breakdown treatment: 2-4 plain sentences, no
      markdown, no em dashes. Rendered above the jump chips when present. */
  takeaways?: string[];
  /** One cited headline figure from this post, used by the generated cover
   *  (src/app/lib/cover.tsx) to draw the "stat" layout. MUST be a real number
   *  the article itself states and sources -- never a rounded, illustrative,
   *  or invented one. Absent is fine: the cover falls through to another
   *  layout, which is the correct behaviour for a post with no single number. */
  stat?: { value: string; label: string };
}
