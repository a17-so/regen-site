import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import { authorBySlug, authorForName, allAuthors } from "../../lib/authors";
import { BLOG_POSTS } from "../../lib/blogData";
import { POSTS } from "../../blog/[slug]/posts";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { JsonLd } from "../../components/JsonLd";

const SITE_URL = (process.env.SITE_URL ?? "https://regenhealth.app").replace(
  /\/$/,
  ""
);

export function generateStaticParams() {
  return allAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = authorBySlug(slug);
  if (!a) return {};
  return {
    title: `${a.name} — REGEN`,
    description: a.bio || `${a.name}, ${a.role}`,
    alternates: { canonical: `${SITE_URL}/authors/${a.slug}` },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = authorBySlug(slug);
  if (!author) notFound();

  const appStoreUrl = buildAppStoreUrl();
  const byThisAuthor = BLOG_POSTS.filter(
    (b) => authorForName(POSTS[b.slug]?.author?.name ?? "").slug === slug
  );

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/authors/${author.slug}#person`,
    name: author.name,
    jobTitle: author.credential || author.role,
    description: author.bio,
    url: `${SITE_URL}/authors/${author.slug}`,
    ...(author.sameAs.length ? { sameAs: author.sameAs } : {}),
    worksFor: { "@type": "Organization", name: "REGEN", url: SITE_URL },
  };

  const linkStyle = { color: "inherit", textDecoration: "underline" as const };

  return (
    <>
      <JsonLd data={personLd} />
      <Nav appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <article className="legal-page">
          <div className="legal-head">
            <div
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <div
                className="author-avatar"
                style={{ width: 56, height: 56, fontSize: 20 }}
              >
                {author.initials}
              </div>
              <div>
                <h1 style={{ margin: 0 }}>{author.name}</h1>
                <div style={{ opacity: 0.7 }}>
                  {author.credential ? `${author.credential} · ` : ""}
                  {author.role}
                </div>
              </div>
            </div>
          </div>
          <div className="legal-body">
            <div className="legal-content">
              {author.bio ? <p className="post-lead">{author.bio}</p> : null}
              {author.sameAs.length ? (
                <p>
                  {author.sameAs.map((u, i) => (
                    <a key={i} href={u} style={{ ...linkStyle, marginRight: 12 }}>
                      {u}
                    </a>
                  ))}
                </p>
              ) : null}
              {byThisAuthor.length ? (
                <>
                  <h2>Articles by {author.name}</h2>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {byThisAuthor.map((p) => (
                      <li key={p.slug} style={{ marginBottom: 8 }}>
                        <a href={p.href} style={linkStyle}>
                          {p.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <a className="btn-ghost" href="/blog">
                ← All articles
              </a>
            </div>
          </div>
        </article>
        <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
