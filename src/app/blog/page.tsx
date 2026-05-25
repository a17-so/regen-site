import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import BlogGrid from "./BlogGrid";

export const metadata: Metadata = {
  title: "Blog — REGEN",
};

export default function BlogIndexPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <Nav appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        <main className="blog-index">
          <header className="blog-index-head">
            <h1>The Blog.</h1>
            <div className="sub">
              Notes from the protocol — what we&apos;ve learned, what the
              literature actually says, and what we&apos;re testing next.
            </div>
          </header>
          <BlogGrid />
        </main>
        <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
