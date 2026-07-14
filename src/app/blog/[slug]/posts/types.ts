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
}
