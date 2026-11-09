import { aura } from "../lib/aura";
import { BLOG_CATEGORIES, BLOG_POSTS, type BlogPost } from "../lib/blogData";

/** Category label as the page reads it. The data says "Science" for the
    main run of posts; inside a section called Science that label is a
    tautology, so it prints as Peptide Science everywhere it shows. */
export const CATEGORY_TITLE: Record<string, string> = {
  Science: "Peptide Science",
  Protocols: "Protocols",
  Biomarkers: "Biomarkers",
};

export function categoryTitle(c: string): string {
  return CATEGORY_TITLE[c] ?? c;
}

export function categorySlug(c: string): string {
  return c.toLowerCase();
}

export function categoryHref(c: string): string {
  return `/blog/category/${categorySlug(c)}`;
}

/** The section's categories, in the order the data ranks them. */
export const SCIENCE_CATEGORIES: string[] = BLOG_CATEGORIES.filter((c) => c !== "All");

/** Science's section tabs: all, then each category with its count. */
export function scienceTabs(): { key: string; label: string; href: string; count: number }[] {
  return [
    { key: "all", label: "All", href: "/blog", count: BLOG_POSTS.length },
    ...SCIENCE_CATEGORIES.map((c) => ({
      key: c,
      label: categoryTitle(c),
      href: categoryHref(c),
      count: BLOG_POSTS.filter((p) => p.category === c).length,
    })),
  ];
}

/** Newest first. */
export function byDate(posts: BlogPost[]): BlogPost[] {
  return posts.slice().sort((a, b) => b.dateSort - a.dateSort);
}

/** The hub's editorial picks. The featured article leads the page on
    "All"; the three picks are the evergreen explainers a first-time reader
    should open first, one per category. A slug that stops existing is
    skipped, never a dead card. */
export const FEATURED_SLUG = "what-is-a-peptide";
export const PICK_SLUGS = ["what-is-glp-1", "reconstitution-without-anxiety", "reading-free-testosterone"];

function Meta({ post }: { post: BlogPost }) {
  return (
    <div className="blog-card-meta">
      <span>{post.date}</span>
      <span className="sep" />
      <span>{post.readTime}</span>
    </div>
  );
}

/**
 * The blog's card, as it has always been: a glass pane holding the
 * generated cover, the category eyebrow, the title, a short excerpt, and
 * the date and read time. Three to a row.
 */
export function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <a className="blog-card" href={post.href}>
      {/* The cover is the post's aura painted as CSS: decorative (the title
          right under it carries the meaning), and nothing to download. */}
      <div className="blog-card-cover" style={aura(post.category, post.slug)} aria-hidden="true" />
      <span className="blog-card-cat">{categoryTitle(post.category)}</span>
      <h3 className="blog-card-title">{post.title}</h3>
      <p className="blog-card-excerpt">{post.excerpt}</p>
      <Meta post={post} />
    </a>
  );
}

/**
 * The featured pane: one article at magazine size, cover beside the words,
 * with a glass button as the way in. The whole pane is the link.
 */
export function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <a className="blog-hero" href={post.href}>
      <div className="blog-hero-cover" style={aura(post.category, post.slug)} aria-hidden="true" />
      <div className="blog-hero-body">
        <span className="blog-card-cat">{categoryTitle(post.category)}</span>
        <h2 className="blog-hero-title">{post.title}</h2>
        <p className="blog-hero-excerpt">{post.excerpt}</p>
        <Meta post={post} />
        <span className="btn btn-sm btn-glass blog-hero-cta">
          Read the article
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 3.5 13.5 8 9 12.5" />
          </svg>
        </span>
      </div>
    </a>
  );
}

/** The grid: cards, three to a row. */
export function ArticleGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="blog-grid" role="list">
      {posts.map((p) => (
        <ArticleCard key={p.slug} post={p} />
      ))}
    </div>
  );
}

/**
 * The landing's stacked index rows (.bl-list / .bl-row), for the lists that
 * sit inside an article column: a post's related articles and the author
 * page. Reused verbatim so the two indexes cannot drift apart.
 */
export function ArticleRows({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="bl-list">
      {posts.map((p) => (
        <a className="bl-row" href={p.href} key={p.slug}>
          <h3>{p.title}</h3>
          <div className="bl-meta">
            <span className="bl-cat">{categoryTitle(p.category)}</span>
            <span className="bl-dot" />
            <span>{p.date}</span>
            <span className="bl-dot" />
            <span>{p.readTime}</span>
          </div>
          <span className="bl-go glass-refract" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3.5 10.5 8 6 12.5" />
            </svg>
          </span>
        </a>
      ))}
    </div>
  );
}
