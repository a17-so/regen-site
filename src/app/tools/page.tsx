import type { Metadata } from "next";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ToolsTeaser from "../components/ToolsTeaser";

export const metadata: Metadata = {
  title: "Free tools, coming soon · REGEN",
  description:
    "Peptide math in the browser is on the way: dose conversion, half-life, and vial duration. The reconstitution calculator is live today.",
};

export default function ToolsPage() {
  const appStoreUrl = buildAppStoreUrl();
  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <div className="app animate-fade-in">
        {/* The landing's wash, whispered, interior pages open on the same
            field so the site reads as one place. */}
        <div className="page-wash" aria-hidden="true" />
        <main className="tools-page">
          <ToolsTeaser />
        </main>
        <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
      </div>
    </>
  );
}
