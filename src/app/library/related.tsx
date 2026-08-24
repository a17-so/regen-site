import { BLOG_POSTS, type BlogPost } from "../lib/blogData";
import type { Peptide } from "../lib/library";

/**
 * Blog coverage of a compound.
 *
 * The library and the blog write about the same molecules from two different
 * angles, and until now neither linked to the other. Matching is deliberately
 * conservative: a post counts only when the compound's name (or a name it is
 * commonly sold or written under) appears as a whole token in the post's slug,
 * title, or excerpt. A loose substring match would put "NAD+" on every post
 * containing "nad" and "VIP" on anything mentioning a VIP, which is worse than
 * no rail at all.
 */

/** Extra spellings a compound is written under, keyed by catalog slug. */
const ALIASES: Record<string, string[]> = {
  semaglutide: ["ozempic", "wegovy"],
  tirzepatide: ["mounjaro", "zepbound"],
  liraglutide: ["victoza", "saxenda"],
  "mk-677": ["ibutamoren"],
  somatropin: ["hgh"],
  "melanotan-ii": ["melanotan-2", "melanotan ii"],
  "ss-31": ["elamipretide"],
  "melanotan-i": ["afamelanotide"],
  "cjc-1295-no-dac": ["cjc-1295", "modified grf"],
  "thymosin-alpha-1": ["thymosin alpha", "ta-1"],
  "nad-plus": ["nad+"],
  klow: ["klow"],
  glow: ["glow blend"],
};

/** Names too short or too generic to match on their own. */
const TOO_GENERIC = new Set(["vip", "glow", "hcg", "kpv", "dsip"]);

function tokensFor(p: Peptide): string[] {
  const out = [p.name.toLowerCase(), ...(ALIASES[p.slug] ?? [])];
  // A blend's own name rarely appears in prose; its slug form usually does.
  out.push(p.slug.replace(/-/g, " "));
  return [...new Set(out)].filter(Boolean);
}

/** Whole-token match: "bpc-157" hits "BPC-157 Apeiron" but "nad" never hits
    "gonadorelin". Hyphens and plus signs count as word characters here, since
    they are part of the compound names themselves. */
function mentions(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9+-])${escaped}([^a-z0-9+-]|$)`, "i").test(haystack);
}

export function relatedPosts(p: Peptide, limit = 3): BlogPost[] {
  const needles = tokensFor(p);
  // A generic short name must appear in the slug or title, never the excerpt.
  const strict = TOO_GENERIC.has(p.slug);
  const hits = BLOG_POSTS.filter((post) => {
    const strong = `${post.slug.replace(/-/g, " ")} ${post.title}`;
    const full = strict ? strong : `${strong} ${post.excerpt}`;
    return needles.some((n) => mentions(full, n));
  });
  return hits.slice(0, limit);
}

/** Closing rail on a reference page. Renders nothing when there is no
    coverage, rather than padding the page with unrelated posts. */
export function FurtherReading({ posts, name }: { posts: BlogPost[]; name: string }) {
  if (!posts.length) return null;
  return (
    <div className="lib-related">
      <h2 id="further-reading">More on {name}</h2>
      <div className="lib-grid lib-grid--3">
        {posts.map((post) => (
          <a className="lib-card" key={post.slug} href={post.href}>
            <div className="lib-card-top">
              <h3>{post.title}</h3>
            </div>
            <div className="lib-card-eyebrow">{post.category}</div>
            <p>{post.excerpt}</p>
            <div className="lib-card-foot">
              <span>{post.readTime}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
