"use client";

import Image from "next/image";
import { useState } from "react";
import { BLOG_POSTS, BLOG_CATEGORIES } from "../lib/blogData";

export default function BlogGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = BLOG_POSTS.filter((p) => {
    const catMatch = activeCategory === "All" || p.category === activeCategory;
    if (!catMatch) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="blog-controls">
        <label className="blog-search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21 l-4.3 -4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search articles, topics, peptides…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="blog-filters">
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-chip${activeCategory === c ? " active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-grid">
        {filtered.length === 0 ? (
          <div className="blog-empty">
            No articles match. Try a different keyword or category.
          </div>
        ) : (
          filtered.map((p, i) => (
            <a key={p.slug} className="blog-card" href={p.href}>
              <div className="blog-card-cover">
                <Image
                  className="cover-bg"
                  src={p.cover}
                  /* The title IS the alt text: these covers illustrate the
                     article, so the headline is what a screen reader (and
                     Google Images) should get. A CSS background-image, which
                     this replaced, carries no alt at all and is not indexed
                     as an image by Google. */
                  alt={p.title}
                  fill
                  /* 3 cols above 1080px inside a 1240px shell => ~400px max;
                     2 cols to 1080px; 1 col to 860px. Without this every card
                     downloads a full-width source. */
                  sizes="(max-width: 860px) 100vw, (max-width: 1080px) 50vw, 400px"
                  /* Only the first row is above the fold. */
                  priority={i < 3}
                  /* Covers published before 2026-08-13 are Google Drive URLs
                     that 302 to googleusercontent. Sending those through the
                     optimizer turns a slow third-party fetch into a broken
                     image, so they load as-is until the backfill moves them
                     to /blog-covers/. */
                  unoptimized={/^https?:\/\//.test(p.cover)}
                />
              </div>
              <span className="blog-card-cat">{p.category}</span>
              <h3 className="blog-card-title">{p.title}</h3>
              <p className="blog-card-excerpt">{p.excerpt}</p>
              <div className="blog-card-meta">
                <span>{p.date}</span>
                <span className="sep"></span>
                <span>{p.readTime}</span>
              </div>
            </a>
          ))
        )}
      </div>
    </>
  );
}
