import type { Metadata } from "next";
import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import { bySlug } from "../../lib/compounds";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import FileReport from "./FileReport";

export const metadata: Metadata = {
  title: "File a community report | REGEN",
  description:
    "Log what you ran, anonymously. Dose, duration, outcome, side effects, about a minute, no account.",
  // Nothing to index here, and a half-filled form is a bad search result.
  robots: { index: false, follow: true },
};

export default async function FileReportPage({
  searchParams,
}: {
  searchParams: Promise<{ compound?: string }>;
}) {
  const appStoreUrl = buildAppStoreUrl();
  // Deep-link contract with the app: ?compound=<catalog slug> opens the report
  // for that compound directly, skipping the picker. An unknown slug falls
  // back to the picker rather than erroring, links outlive catalogs.
  const { compound } = await searchParams;
  const initialCompound = (compound && bySlug(compound)?.slug) || null;

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} sectionBase="/" />
      <main className="app animate-fade-in">
        <div className="page-wash" aria-hidden="true" />
        <div className="fr-page">
          <FileReport initialCompound={initialCompound} />
        </div>
      </main>
      <Footer appStoreUrl={appStoreUrl} sectionBase="/" />
    </>
  );
}
