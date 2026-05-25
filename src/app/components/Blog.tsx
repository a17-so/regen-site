import { BLOG_POSTS } from "../lib/blogData";

const ArrowR = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12 h14" />
    <path d="M13 6 l6 6 -6 6" />
  </svg>
);

export default function Blog() {
  const posts = BLOG_POSTS.slice(0, 4);
  return (
    <section id="blog" className="blog-home">
      <div className="blog-home-inner">
        <div className="blog-home-head">
          <h2>Latest writing.</h2>
          <div className="sub">Notes from the protocol — updated weekly.</div>
        </div>
        <div className="blog-list">
          {posts.map((p) => (
            <a key={p.slug} href={p.href} className="blog-row">
              <div className="blog-row-title">{p.title}</div>
              <div className="blog-row-meta">
                <span className="cat">{p.category}</span>
                <span className="sep"></span>
                <span>{p.date}</span>
                <span className="sep"></span>
                <span>{p.readTime}</span>
              </div>
              <span className="blog-row-arrow">
                <ArrowR />
              </span>
            </a>
          ))}
        </div>
        <div className="blog-home-cta">
          <a href="/blog" className="btn-ghost">
            View all articles
            <ArrowR />
          </a>
        </div>
      </div>
    </section>
  );
}
