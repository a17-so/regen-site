import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import { authorBySlug, authorForName, allAuthors } from "../../lib/authors";
import { BLOG_POSTS } from "../../lib/blogData";
import { POSTS } from "../../blog/[slug]/posts";
import NavBar from "../../components/NavBar";
import PageClose from "../../components/PageClose";
import { JsonLd } from "../../components/JsonLd";

const SITE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(
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
    title: `${a.name} · REGEN`,
    description: a.bio || `${a.name}, ${a.role}`,
    alternates: { canonical: `${SITE_URL}/authors/${a.slug}` },
  };
}

/* A profile link is labelled by where it goes. Printing the raw URL was
   unreadable and told the reader nothing the label doesn't. Unknown hosts
   fall back to the bare hostname, which still beats the full URL. */
const LINK_LABELS: Record<string, string> = {
  "linkedin.com": "LinkedIn",
  "x.com": "X",
  "twitter.com": "X",
  "scholar.google.com": "Google Scholar",
  "orcid.org": "ORCID",
  "pubmed.ncbi.nlm.nih.gov": "PubMed",
  "github.com": "GitHub",
};

function linkLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return LINK_LABELS[host] ?? host;
  } catch {
    return url;
  }
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
  ).sort((a, b) => b.dateSort - a.dateSort);

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

  return (
    <>
      <JsonLd data={personLd} />
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <article className="legal-page">
          <div className="legal-head">
            {/* Centred as a cluster, and the name/role share a left edge —
                the head's text-align:center would otherwise centre the role
                under a name that isn't centred itself. */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                textAlign: "left",
              }}
            >
              <div
                className="author-avatar"
                style={{ width: 64, height: 64, fontSize: 22, flex: "0 0 auto" }}
              >
                {author.initials}
              </div>
              <div>
                <h1 style={{ margin: 0 }}>{author.name}</h1>
                <div style={{ marginTop: 6, opacity: 0.7 }}>
                  {author.credential ? `${author.credential} · ` : ""}
                  {author.role}
                </div>
              </div>
            </div>
          </div>
          {/* --solo: no contents rail on this page, so the body must not
              reserve the rail column. */}
          <div className="legal-body legal-body--solo">
            <div className="legal-content">
              {author.bio ? <p className="post-lead">{author.bio}</p> : null}
              {author.sameAs.length ? (
                <div className="author-links">
                  {author.sameAs.map((u) => (
                    <a
                      className="btn btn-sm btn-glass"
                      href={u}
                      key={u}
                      rel="me noopener"
                      target="_blank"
                    >
                      {linkLabel(u)}
                    </a>
                  ))}
                </div>
              ) : null}
              {byThisAuthor.length ? (
                /* The same stacked index the blog and post pages use, so the
                   three lists can't drift apart. */
                <div className="related-posts">
                  <h2>
                    {byThisAuthor.length} article
                    {byThisAuthor.length === 1 ? "" : "s"} by {author.name}
                  </h2>
                  <div className="bl-list">
                    {byThisAuthor.map((p) => (
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
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M6 3.5 10.5 8 6 12.5" />
                          </svg>
                        </span>
                      </a>
                    ))}
                  </div>
                  <div className="bl-foot">
                    <a className="btn btn-sm btn-glass" href="/blog">
                      View all articles
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </article>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
