import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import { BLOG_POSTS } from "../../lib/blogData";
import { authorForName } from "../../lib/authors";
import NavBar from "../../components/NavBar";
import { ArrowR } from "../../components/icons";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";
import { MedicalDisclaimer } from "../../components/Disclaimer";
import { BlogAnalytics } from "./BlogAnalytics";
import Contents from "../../library/Contents";
import { KeyTakeaways } from "../../library/parts";
import { CategoryIcon } from "../../library/CategoryIcon";
import type { IconKey } from "../../lib/library";
import { POSTS } from "./posts";

/** Blog categories mapped onto the library's marks, painted in the brand
    accent rather than a category ramp — the blue is what says "blog". */
const CATEGORY_ICON: Record<string, IconKey> = {
  Science: "flask",
  Protocols: "bandage",
  Biomarkers: "heart",
};

/** Chip label: the section title cut to its first 2-3 real words. Leading and
    trailing stopwords are trimmed so the cut never ends mid-phrase ("Biomarkers
    of immune" reads broken; "Biomarkers" reads like a chapter chip). */
const STOPWORDS = new Set([
  "a", "an", "and", "the", "of", "in", "on", "for", "to", "into", "with",
  "versus", "vs", "at", "by", "from",
]);
function chipLabel(label: string): string {
  const words = label.split(/\s+/).filter(Boolean);
  while (words.length && STOPWORDS.has(words[0].toLowerCase())) words.shift();
  const cut = words.slice(0, 3);
  // Cut at the first inner stopword: "Biomarkers of immune" reads broken,
  // "Biomarkers" reads like a chapter chip.
  const stop = cut.findIndex((w, i) => i > 0 && STOPWORDS.has(w.toLowerCase()));
  const kept = stop > 0 ? cut.slice(0, stop) : cut;
  return kept.join(" ") || label;
}

const SITE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(
  /\/$/,
  ""
);


export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

// YYYYMMDD (blogData.dateSort) -> ISO "YYYY-MM-DD".
function isoFromSort(sort?: number): string {
  const s = String(sort ?? "");
  return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : "";
}

function resolve(slug: string) {
  const post = POSTS[slug];
  const card = BLOG_POSTS.find((b) => b.slug === slug);
  const datePublished = post?.datePublished || isoFromSort(card?.dateSort);
  const dateModified = post?.dateModified || post?.lastReviewed || datePublished;
  const description = post?.description || card?.excerpt || post?.lead || "";
  return { post, datePublished, dateModified, description };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post, datePublished, dateModified, description } = resolve(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title: `${post.title} · REGEN`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: datePublished || undefined,
      modifiedTime: dateModified || undefined,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { post, datePublished, dateModified, description } = resolve(slug);
  if (!post) notFound();

  const appStoreUrl = buildAppStoreUrl();
  const { Content } = post;
  const author = authorForName(post.author.name);
  const url = `${SITE_URL}/blog/${slug}`;

  const graph: object[] = [
    {
      "@type": ["Article", "MedicalWebPage"],
      "@id": `${url}#article`,
      headline: post.title,
      description,
      image: post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}`,
      ...(datePublished ? { datePublished } : {}),
      ...(dateModified ? { dateModified } : {}),
      ...(post.lastReviewed ? { lastReviewed: post.lastReviewed } : {}),
      author: {
        "@type": "Person",
        "@id": `${SITE_URL}/authors/${author.slug}#person`,
        name: author.name,
        url: `${SITE_URL}/authors/${author.slug}`,
        ...(author.sameAs.length ? { sameAs: author.sameAs } : {}),
      },
      ...(post.reviewedBy
        ? {
            reviewedBy: {
              "@type": "Person",
              name: post.reviewedBy.name,
              ...(post.reviewedBy.credential ? { jobTitle: post.reviewedBy.credential } : {}),
            },
          }
        : {}),
      publisher: {
        "@type": "Organization",
        name: "REGEN",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/og.png` },
      },
      mainEntityOfPage: url,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq && post.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  const sameCat = BLOG_POSTS.filter((b) => b.slug !== slug && b.category === post.category);
  const related = (sameCat.length ? sameCat : BLOG_POSTS.filter((b) => b.slug !== slug)).slice(0, 3);

  // One strip, shared by the contents rail and the jump chips, so the two
  // can never disagree about a label.
  const tocItems = post.toc.map((t) => ({
    id: t.id,
    label: t.label.replace(/^\d+\s*(?:[—–•·-]\s*)?/, ""),
  }));

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogAnalytics slug={slug} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        {/* The peptide breakdown's shell, whole: wide article, ref header
            (eyebrow · headline · lead · byline, nothing else), disclaimer
            spanning the columns, glass contents rail. The header banner, the
            Get Started button, and the meta row are gone — a breakdown header
            carries four things, and the App Store CTAs live in the in-article
            PostCta blocks and the page close. No `lib-ref` class: blog
            categories carry no ramp, and `.lib-ref`'s selected-row gradient
            reads `--ramp-text`, which unset paints the label invisible. */}
        <article className="legal-page legal-page--wide">
          <div className="legal-head legal-head--ref">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden>/</span>
              <a href="/blog">Blog</a>
              <span aria-hidden>/</span>
              <span>{post.category}</span>
            </nav>
            <div className="lib-ref-head">
              {/* Accent eyebrow: same anatomy as a category eyebrow, painted
                  with the brand gradient since blog categories carry no ramp. */}
              <div className="lib-ref-eyebrow lib-ref-eyebrow--accent">
                <CategoryIcon
                  name={CATEGORY_ICON[post.category] ?? "sparkles"}
                  size={23}
                  ramp="accent"
                />
                <span>{post.category}</span>
              </div>
              <h1>{post.title}</h1>
              <p className="lib-ref-lead">{post.lead}</p>
            </div>
            <div className="post-byline">
              <div className="author-avatar">{author.initials}</div>
              <div>
                <div>
                  By{" "}
                  <a href={`/authors/${author.slug}`}>{author.name}</a>
                  {author.credential ? `, ${author.credential}` : ""} · {author.role}
                </div>
                <div className="post-byline-sub">
                  {post.reviewedBy
                    ? `Medically reviewed by ${post.reviewedBy.name}${
                        post.reviewedBy.credential ? `, ${post.reviewedBy.credential}` : ""
                      }${post.lastReviewed ? ` · Last reviewed ${post.lastReviewed}` : ""} · `
                    : ""}
                  {post.date} · {post.readTime}
                  {dateModified ? ` · Last updated ${dateModified}` : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="legal-body">
            <MedicalDisclaimer />
            {/* The library's glass contents card, with its live selected
                state. Post data carries numbered labels in two shapes ("01
                Title" and "01 — Title"); the rail and the jump chips draw
                their own numbers, so only the title survives the strip. */}
            <Contents items={tocItems} />
            <div className="legal-content">
              {post.takeaways && post.takeaways.length > 0 && (
                <KeyTakeaways items={post.takeaways} />
              )}
              {/* Quick jumper: the breakdown's chip row, copied verbatim.
                  Names only — no numbers — shortened to 2-3 words so the row
                  reads like the breakdown's chapter chips. */}
              <nav className="lib-filters" aria-label="Jump to a section">
                {tocItems.map((t) => (
                  <a key={t.id} className="lib-filter" href={`#${t.id}`}>
                    {chipLabel(t.label)}
                  </a>
                ))}
              </nav>
              <Content />

              {/* Same stacked-index rows as the landing page's Latest writing. */}
              <div className="related-posts">
                <h2 id="related">Related articles</h2>
                <div className="bl-list">
                  {related.map((r) => (
                    <a className="bl-row" href={r.href} key={r.slug}>
                      <h3>{r.title}</h3>
                      <div className="bl-meta">
                        <span className="bl-cat">{r.category}</span>
                        <span className="bl-dot" />
                        <span>{r.date}</span>
                        <span className="bl-dot" />
                        <span>{r.readTime}</span>
                      </div>
                      <span className="bl-go glass-refract" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M6 3.5 10.5 8 6 12.5" />
                        </svg>
                      </span>
                    </a>
                  ))}
                </div>
                <div className="bl-foot">
                  <a className="btn btn-sm btn-glass" href="/blog">
                    View all articles
                    <ArrowR size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
