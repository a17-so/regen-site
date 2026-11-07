import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildAppStoreUrl } from "../../../lib/appStoreUrl";
import NavBar from "../../../components/NavBar";
import PageClose from "../../../components/PageClose";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../../../lib/blogData";
import { Crumbs, SITE_URL } from "../../../library/parts";
import { CATEGORY_TITLE, CategoryTabs, ScienceCard, categorySlug } from "../../ScienceParts";

const CATS = BLOG_CATEGORIES.filter((c) => c !== "All");

export function generateStaticParams() {
  return CATS.map((c) => ({ category: categorySlug(c) }));
}

export const dynamicParams = false;

function resolve(slug: string): string | undefined {
  return CATS.find((c) => categorySlug(c) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = resolve(category);
  if (!c) return {};
  const title = CATEGORY_TITLE[c] ?? c;
  const n = BLOG_POSTS.filter((p) => p.category === c).length;
  const description = `${n} ${title.toLowerCase()} articles from REGEN Science, cited to primary sources.`;
  return {
    title: `${title} | REGEN Science`,
    description,
    alternates: { canonical: `/blog/category/${category}` },
    openGraph: { type: "website", url: `${SITE_URL}/blog/category/${category}`, title, description },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = resolve(category);
  if (!c) notFound();
  const appStoreUrl = buildAppStoreUrl();
  const posts = BLOG_POSTS.filter((p) => p.category === c).sort((a, b) => b.dateSort - a.dateSort);
  const title = CATEGORY_TITLE[c] ?? c;
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <div className="lib-page sc-page">
          <header className="lib-index-head sh-head">
            <Crumbs trail={[{ label: "Science", href: "/blog" }, { label: title }]} />
            <h1>{title}</h1>
            <p>
              {posts.length} article{posts.length === 1 ? "" : "s"}, newest first.
            </p>
          </header>
          <CategoryTabs active={c} />
          <div className="blog-grid sc-grid sc-grid--all">
            {posts.map((p, i) => (
              <ScienceCard key={p.slug} post={p} priority={i < 3} />
            ))}
          </div>
        </div>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </main>
    </>
  );
}
