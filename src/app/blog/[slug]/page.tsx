import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { BlogAnalytics } from "./BlogAnalytics";
import { POSTS } from "./posts";

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return { title: `${post.title} — REGEN` };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const appStoreUrl = buildAppStoreUrl();
  const { Content } = post;

  return (
    <>
      <BlogAnalytics slug={slug} />
      <Nav appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <article className="legal-page">
          <div className="legal-head">
            <h1>{post.title}</h1>
            <div className="post-meta-row">
              <span className="cat">{post.category}</span>
              <span>{post.date}</span>
              <span className="dot"></span>
              <span>{post.readTime}</span>
            </div>
            <div className="post-hero">
              <div
                className="hero-img"
                style={{ backgroundImage: `url(${post.cover})` }}
              />
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
              <Content />
              <div className="post-footer">
                <div className="author">
                  <div className="author-avatar">{post.author.initials}</div>
                  <div>
                    <div className="author-name">{post.author.name}</div>
                    <div className="author-role">{post.author.role}</div>
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
