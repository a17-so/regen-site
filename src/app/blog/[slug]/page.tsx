import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import { BLOG_POSTS } from "../../lib/blogData";
import { authorForName } from "../../lib/authors";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { JsonLd } from "../../components/JsonLd";
import { MedicalDisclaimer } from "../../components/Disclaimer";
import { BlogAnalytics } from "./BlogAnalytics";
import { POSTS } from "./posts";

const SITE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(
  /\/$/,
  ""
);

const linkStyle = { color: "inherit", textDecoration: "underline" as const };

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
    title: `${post.title} — REGEN`,
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

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogAnalytics slug={slug} />
      <Nav appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <article className="legal-page">
          <div className="legal-head">
            <nav
              aria-label="Breadcrumb"
              style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}
            >
              <a href="/" style={linkStyle}>
                Home
              </a>{" "}
              <span aria-hidden> / </span>{" "}
              <a href="/blog" style={linkStyle}>
                Blog
              </a>{" "}
              <span aria-hidden> / </span> <span>{post.category}</span>
            </nav>
            <h1>{post.title}</h1>
            <div className="post-meta-row">
              <span className="cat">{post.category}</span>
              <span>{post.date}</span>
              <span className="dot"></span>
              <span>{post.readTime}</span>
            </div>
            <div
              className="post-byline"
              style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 2px", fontSize: 14 }}
            >
              <div className="author-avatar">{author.initials}</div>
              <div>
                <div>
                  By{" "}
                  <a href={`/authors/${author.slug}`} style={linkStyle}>
                    {author.name}
                  </a>
                  {author.credential ? `, ${author.credential}` : ""} · {author.role}
                </div>
                <div style={{ opacity: 0.7, fontSize: 13 }}>
                  {post.reviewedBy
                    ? `Medically reviewed by ${post.reviewedBy.name}${
                        post.reviewedBy.credential ? `, ${post.reviewedBy.credential}` : ""
                      }${post.lastReviewed ? ` · Last reviewed ${post.lastReviewed}` : ""} · `
                    : ""}
                  {dateModified ? `Last updated ${dateModified}` : ""}
                </div>
              </div>
            </div>
            <a
              className="post-hero post-hero--banner"
              href={buildAppStoreUrl()}
              rel="nofollow"
              aria-label="REGEN — The World's Trusted Peptide Care App"
            >
              <img
                src="/blog/banner.png"
                alt="REGEN — The World's Trusted Peptide Care App"
              />
            </a>
            <div className="post-hero-cta-row">
              <a
                className="btn-primary"
                href={buildAppStoreUrl()}
                rel="nofollow noopener noreferrer"
              >
                Get Started
              </a>
            </div>
            <p className="post-lead">{post.lead}</p>
          </div>

          <div className="legal-body">
            <aside className="legal-toc">
              {post.toc.map((t) => (
                <a key={t.id} href={`#${t.id}`}>
                  {t.label}
                </a>
              ))}
            </aside>
            <div className="legal-content">
              <MedicalDisclaimer />
              <Content />

              <div
                className="related-posts"
                style={{ marginTop: 44, borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 20 }}
              >
                <h2 id="related">Related articles</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {related.map((r) => (
                    <li key={r.slug} style={{ marginBottom: 8 }}>
                      <a href={r.href} style={linkStyle}>
                        {r.title}
                      </a>{" "}
                      <span style={{ opacity: 0.6 }}>· {r.category}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="post-footer">
                <div className="author">
                  <div className="author-avatar">{author.initials}</div>
                  <div>
                    <div className="author-name">
                      <a href={`/authors/${author.slug}`} style={{ color: "inherit" }}>
                        {author.name}
                      </a>
                    </div>
                    <div className="author-role">{author.role}</div>
                  </div>
                </div>
                <a className="btn-ghost" href="/blog">
                  ← All articles
                </a>
              </div>
            </div>
          </div>
        </article>
        <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
