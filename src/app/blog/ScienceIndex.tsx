"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/** Latest shows this many cards, then a button adds the next batch. Seventy
    covers on first paint is what made the page feel slow. */
const BATCH = 12;
import type { BlogPost } from "../lib/blogData";
import GlassTabs from "../components/GlassTabs";
import {
  ArticleGrid,
  ArticleHero,
  FEATURED_SLUG,
  PICK_SLUGS,
  SCIENCE_CATEGORIES,
  byDate,
  categorySlug,
  categoryTitle,
  scienceTabs,
} from "./ScienceParts";

/**
 * The Science index, filtered in place. The category tabs and the body
 * share one piece of state, so switching a category is a re-render, not a
 * route load (the route-per-category version took a compile per click in
 * dev and a round trip in production). The URL still moves to the
 * category's own page, which exists for crawlers and direct links; Back
 * and Forward restore the filter from the path.
 */
type Science = { cat: string; go: (key: string, href: string) => void; posts: BlogPost[] };
const ScienceCtx = createContext<Science | null>(null);

function fromPath(pathname: string): string {
  const m = pathname.match(/^\/blog\/category\/([^/]+)/);
  if (!m) return "all";
  return SCIENCE_CATEGORIES.find((c) => categorySlug(c) === m[1]) ?? "all";
}

export function ScienceProvider({ initial, posts, children }: { initial: string; posts: BlogPost[]; children: ReactNode }) {
  const [cat, setCat] = useState(initial);
  useEffect(() => {
    const onPop = () => setCat(fromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const go = useCallback((key: string, href: string) => {
    setCat(key);
    window.history.pushState(null, "", href);
  }, []);
  return <ScienceCtx.Provider value={{ cat, go, posts }}>{children}</ScienceCtx.Provider>;
}

function useScience(): Science {
  const c = useContext(ScienceCtx);
  if (!c) throw new Error("ScienceTabs and ScienceBody render inside ScienceProvider");
  return c;
}

/** PageShell's tab bar, as a client bar in the site's glass ("filters for
    the articles should be strictly our glass"): one pill, one lit thumb
    that slides to the pick. A plain click filters in place; a modified
    click (new tab) follows the link as usual. */
export function ScienceTabs() {
  const { cat, go } = useScience();
  return (
    <div className="gtabs-row pg-filter">
      <GlassTabs label="Categories" tabs={scienceTabs()} value={cat} onPick={go} />
    </div>
  );
}

function Kicker({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <h2 className="blog-kicker">
      {children}
      {count !== undefined && <span className="blog-kicker-n">{count}</span>}
    </h2>
  );
}

/** The magazine order: Featured, Start here (All only), Latest. */
export function ScienceBody({ cta }: { cta?: ReactNode }) {
  const { cat, posts } = useScience();
  const [more, setMore] = useState({ cat, n: BATCH });
  // A new category starts from the first batch again.
  const limit = more.cat === cat ? more.n : BATCH;
  const all = byDate(posts);
  const pool = cat === "all" ? all : all.filter((p) => p.category === cat);
  const hero = (cat === "all" ? all.find((p) => p.slug === FEATURED_SLUG) : undefined) ?? pool[0];
  if (!hero) return <div className="blog-empty">No articles here yet.</div>;
  const picks =
    cat === "all"
      ? PICK_SLUGS.map((s) => all.find((p) => p.slug === s)).filter((p): p is BlogPost => !!p && p.slug !== hero.slug)
      : [];
  const shown = new Set([hero.slug, ...picks.map((p) => p.slug)]);
  const latest = pool.filter((p) => !shown.has(p.slug));
  const visible = latest.slice(0, limit);
  const left = latest.length - visible.length;

  return (
    <>
      <section className="blog-section" aria-label="Featured">
        <Kicker>Featured</Kicker>
        <ArticleHero post={hero} />
      </section>
      {picks.length > 0 && (
        <section className="blog-section" aria-label="Start here">
          <Kicker>New here? Start with these</Kicker>
          <ArticleGrid posts={picks} />
        </section>
      )}
      {/* The one conversion point on the hub, between the picks and the
          archive: a reader who has just chosen what to read is shown where
          to run it. Server-rendered (it builds its own store URL and QR). */}
      {cta && <div className="blog-section blog-cta">{cta}</div>}
      {latest.length > 0 && (
        <section className="blog-section" aria-label="Latest">
          <Kicker count={latest.length}>{cat === "all" ? "Latest" : `More in ${categoryTitle(cat)}`}</Kicker>
          <ArticleGrid posts={visible} />
          {left > 0 && (
            <div className="bl-foot">
              <button type="button" className="btn btn-sm btn-glass" onClick={() => setMore({ cat, n: limit + BATCH })}>
                Show {Math.min(BATCH, left)} more
                <span className="blog-more-n">{left} left</span>
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
