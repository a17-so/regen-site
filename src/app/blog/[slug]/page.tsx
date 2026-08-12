import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import { appStoreQr } from "../../lib/qr";
import { BLOG_POSTS } from "../../lib/blogData";
import { authorForName } from "../../lib/authors";
import NavBar from "../../components/NavBar";
import GetAppButton from "../../components/GetAppButton";
import { ArrowR } from "../../components/icons";
import Footer from "../../components/Footer";
import { JsonLd } from "../../components/JsonLd";
import { MedicalDisclaimer } from "../../components/Disclaimer";
import { BlogAnalytics } from "./BlogAnalytics";
import { POSTS } from "./posts";

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
  const qr = await appStoreQr(appStoreUrl);
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
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <article className="legal-page">
          <div className="legal-head">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden>/</span>
              <a href="/blog">Blog</a>
              <span aria-hidden>/</span>
              <span>{post.category}</span>
            </nav>
            <h1>{post.title}</h1>
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
                  {dateModified ? `Last updated ${dateModified}` : ""}
                </div>
              </div>
            </div>
            <a
              className="post-hero post-hero--banner"
              href={buildAppStoreUrl()}
              rel="nofollow"
              aria-label="REGEN, The World's Trusted Peptide Care App"
            >
              <img
                src="/blog/banner.png"
                alt="REGEN, The World's Trusted Peptide Care App"
              />
            </a>
            <div className="post-hero-cta-row">
              <GetAppButton
                appStoreUrl={appStoreUrl}
                qr={qr}
                label="Get Started"
                location="article"
                size="lg"
                align="center"
              />
            </div>
            <div className="post-meta-row">
              <span>{post.date}</span>
              <span className="dot"></span>
              <span>{post.readTime}</span>
            </div>
            <p className="post-lead">{post.lead}</p>
          </div>

          <div className="legal-body">
            <aside className="legal-toc">
              {post.toc.map((t) => (
                <a key={t.id} href={`#${t.id}`}>
                  {/* Post data carries "01 — Title" labels; the index reads
                      "number + title" bare, the same as the legal pages. */}
                  {t.label.replace(/^(\d+)\s*[—–-]\s*/, "$1 ")}
                </a>
              ))}
            </aside>
            <div className="legal-content">
              <MedicalDisclaimer />
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
        <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
