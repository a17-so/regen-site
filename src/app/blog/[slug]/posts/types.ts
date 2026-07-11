import React from "react";

export interface Author {
  initials: string;
  name: string;
  role: string;
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
}
