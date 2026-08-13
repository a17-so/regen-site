import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import PageClose from "../components/PageClose";
import BlogGrid from "./BlogGrid";

export const metadata: Metadata = {
  title: "Blog · REGEN",
};

export default function BlogIndexPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        {/* The landing's wash, whispered, interior pages open on the same
            field so the site reads as one place. */}
        <div className="page-wash" aria-hidden="true" />
        <main className="blog-index">
          <header className="blog-index-head">
            <h1>
              Latest <span className="accent-phrase">writing.</span>
            </h1>
            <div className="sub">
              What we&apos;ve learned, what the literature actually says, and
              what we&apos;re testing next.
            </div>
          </header>
          <BlogGrid />
        </main>
        <PageClose appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
