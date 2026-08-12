import { BLOG_POSTS } from "../lib/blogData";
import { ArrowR } from "./icons";
import Reveal from "./Reveal";

const Chevron = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3.5 10.5 8 6 12.5" />
  </svg>
);

/**
 * Latest writing, a stacked index rather than a card carousel.
 *
 * Rows read faster than cards for a list this short, cost no images (which we
 * don't have real ones for yet), and take a fraction of the vertical space a
 * three-across grid needed.
 */
export default function BlogStrip() {
  const posts = BLOG_POSTS.slice(0, 4);

  return (
    <section className="bl" id="blog">
      <div className="bl-inner">
        <Reveal className="bl-head">
          <h2>
            Latest <span className="accent-phrase">writing.</span>
          </h2>
          <p>New articles on dosing, evidence, and bloodwork every week.</p>
        </Reveal>

        <Reveal delay={90} className="bl-list">
          {posts.map((p) => (
            <a className="bl-row" href={p.href} key={p.slug}>
              <h3>{p.title}</h3>
              <div className="bl-meta">
                <span className="bl-cat">{p.category}</span>
                <span className="bl-dot" />
                <span>{p.date}</span>
                <span className="bl-dot" />
                <span>{p.readTime}</span>
              </div>
              <span className="bl-go glass-refract" aria-hidden="true">
                <Chevron size={14} />
              </span>
            </a>
          ))}
        </Reveal>

        <Reveal delay={160} className="bl-foot">
          <a className="btn btn-sm btn-glass" href="/blog">
            View all articles
            <ArrowR size={13} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
