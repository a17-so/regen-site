import { notFound } from "next/navigation";
import Landing from "../components/Landing";
import { isApprovedCreator, APPROVED_CREATORS } from "../lib/appStoreUrl";

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

    return <Landing creatorSlug={creatorSlug} />;
}
