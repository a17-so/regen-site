"use client";

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
          filtered.map((p) => (
            <a key={p.slug} className="blog-card" href={p.href}>
              <div className="blog-card-cover">
                <div
                  className="cover-bg"
                  style={{ backgroundImage: `url(${p.cover})` }}
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
