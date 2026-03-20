import { notFound } from "next/navigation";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { buildAppStoreUrl, isApprovedCreator, APPROVED_CREATORS } from "../lib/appStoreUrl";

interface CreatorPageProps {
    params: Promise<{ creatorSlug: string }>;
}

// Tells Next.js which slugs are valid at build time.
export function generateStaticParams() {
    return Array.from(APPROVED_CREATORS).map((slug) => ({ creatorSlug: slug }));
}

export default async function CreatorPage({ params }: CreatorPageProps) {
    const { creatorSlug } = await params;

    if (!isApprovedCreator(creatorSlug)) {
        notFound();
    }

    const appStoreUrl = buildAppStoreUrl(creatorSlug);

    return (
        <main className="flex min-h-screen flex-col items-center bg-white animate-fade-in">
            <Navbar appStoreUrl={appStoreUrl} />
            <Hero creatorSlug={creatorSlug} />
        </main>
    );
}