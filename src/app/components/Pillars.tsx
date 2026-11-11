import { GUIDE_INDEX } from "../lib/guides";
import { SHOP_VENDORS, SHOP_COAS } from "../lib/shop";
import { BLOG_POSTS } from "../lib/blogData";
import Reveal from "./Reveal";

/**
 * The bridge from the app to the site: the three things the site is for,
 * as one hairline stats row. Each cell is a real count and a way in.
 */
export default function Pillars() {
  const cells = [
    { n: String(GUIDE_INDEX.length), label: "peptides, sorted by where they act in the body", cta: "Open the Library", href: "/library" },
    { n: String(SHOP_VENDORS.length), label: `vendors ranked and graded on testing, ${SHOP_COAS.length} COAs on file`, cta: "Compare in the Marketplace", href: "/shop" },
    { n: String(BLOG_POSTS.length), label: "articles on what the trials found, cited", cta: "Read the Science", href: "/blog" },
  ];
  return (
    <section className="pillars" id="site">
      <Reveal className="section-head">
        <h2 className="section-title">
          Research it here.
          <br />
          <span className="muted-phrase">Track it in the app.</span>
        </h2>
        <p className="section-lede">What a peptide is, who sells it on what evidence, and what the studies show. Free, no account.</p>
      </Reveal>
      <div className="pillars-row">
        {cells.map((c) => (
          <a key={c.href} className="pillars-cell" href={c.href}>
            <span className="pillars-n">{c.n}</span>
            <span className="pillars-label">{c.label}</span>
            <span className="pillars-cta">
              {c.cta}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
