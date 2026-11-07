import Image from "next/image";
import { BLOG_CATEGORIES, type BlogPost } from "../lib/blogData";
import { PRIMARY_AUTHOR } from "../lib/authors";

/** Category label as the section heading reads it. */
export const CATEGORY_TITLE: Record<string, string> = {
  Science: "Peptide Science",
  Protocols: "Protocols",
  Biomarkers: "Biomarkers",
};

export function categorySlug(c: string): string {
  return c.toLowerCase();
}

export function categoryHref(c: string): string {
  return `/blog/category/${categorySlug(c)}`;
}

/** The reference's card: image, tag and date, title, author. No excerpt. */
export function ScienceCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <a className="blog-card sc-card" href={post.href}>
      <div className="blog-card-cover">
        <Image
          className="cover-bg"
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 860px) 100vw, (max-width: 1080px) 50vw, 400px"
          priority={priority}
        />
      </div>
      <div className="sc-card-meta">
        <span className="blog-card-cat">{post.category}</span>
        <span className="sc-dot" aria-hidden="true" />
        <span>{post.date}</span>
      </div>
      <h3 className="blog-card-title">{post.title}</h3>
      <div className="sc-card-author">
        <span className="sc-avatar" aria-hidden="true">
          {PRIMARY_AUTHOR.name.slice(0, 1)}
        </span>
        {PRIMARY_AUTHOR.name}
      </div>
    </a>
  );
}

/** "Top Articles": the newest post large, the next four as a list. */
export function TopArticles({ posts }: { posts: BlogPost[] }) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  return (
    <section className="sc-top" aria-labelledby="top-h">
      <div className="lib-section-head">
        <h2 id="top-h">Top articles</h2>
      </div>
      <div className="sc-top-grid">
        <a className="blog-card sc-lead" href={lead.href}>
          <div className="blog-card-cover">
            <Image className="cover-bg" src={lead.cover} alt={lead.title} fill sizes="(max-width: 1080px) 100vw, 760px" priority />
          </div>
          <div className="sc-card-meta">
            <span className="blog-card-cat">{lead.category}</span>
            <span className="sc-dot" aria-hidden="true" />
            <span>{lead.date}</span>
          </div>
          <h3 className="blog-card-title">{lead.title}</h3>
          <p className="blog-card-excerpt">{lead.excerpt}</p>
          <div className="sc-card-author">
            <span className="sc-avatar" aria-hidden="true">
              {PRIMARY_AUTHOR.name.slice(0, 1)}
            </span>
            {PRIMARY_AUTHOR.name}
          </div>
        </a>
        <ol className="sc-top-list">
          {rest.slice(0, 4).map((p) => (
            <li key={p.slug}>
              <a href={p.href}>
                <span className="sc-card-meta">
                  <span className="blog-card-cat">{p.category}</span>
                  <span className="sc-dot" aria-hidden="true" />
                  <span>{p.date}</span>
                </span>
                <span className="sc-top-title">{p.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CategoryTabs({ active }: { active?: string }) {
  return (
    <nav className="gd-catnav sc-tabs" aria-label="Categories">
      <a href="/blog" aria-current={!active ? "page" : undefined}>
        All
      </a>
      {BLOG_CATEGORIES.filter((c) => c !== "All").map((c) => (
        <a key={c} href={categoryHref(c)} aria-current={active === c ? "page" : undefined}>
          {CATEGORY_TITLE[c] ?? c}
        </a>
      ))}
    </nav>
  );
}

export function CategorySection({ category, posts, limit = 6 }: { category: string; posts: BlogPost[]; limit?: number }) {
  if (!posts.length) return null;
  return (
    <section className="lib-section sc-section" id={categorySlug(category)} aria-labelledby={`sec-${categorySlug(category)}`}>
      <div className="lib-section-head">
        <h2 id={`sec-${categorySlug(category)}`}>{CATEGORY_TITLE[category] ?? category}</h2>
        {posts.length > limit && (
          <a className="lib-section-link" href={categoryHref(category)}>
            See all ({posts.length})
          </a>
        )}
      </div>
      <div className="blog-grid sc-grid">
        {posts.slice(0, limit).map((p) => (
          <ScienceCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
