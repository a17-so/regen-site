import { buildAppStoreUrl } from "../lib/appStoreUrl";
import { appStoreQr } from "../lib/qr";
import NavBar from "./NavBar";
import Hero from "./Hero";
import ProofStrip from "./ProofStrip";
import Problem from "./Problem";
import FeatureSlides from "./FeatureSlides";
import FreeTools from "./FreeTools";
import CommunityNotes from "./CommunityNotes";
import Reviews from "./Reviews";
import BlogStrip from "./BlogStrip";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";

interface LandingProps {
  /** Approved creator slug, drives the App Store campaign token. */
  creatorSlug?: string;
}

/**
 * Section order follows the agreed sitemap.
 *
 * Two sections from the previous build are deliberately gone, because the
 * sitemap doesn't have them: the methodology block and the review marquee.
 * The reviews were also the fabricated ones, so nothing of value was lost —
 * but say the word and either comes back.
 *
 * CommunityNotes renders null until real notes exist (see lib/notes.ts), so
 * today the page goes Free tools → Blog.
 */
export default async function Landing({ creatorSlug }: LandingProps) {
  const appStoreUrl = buildAppStoreUrl(creatorSlug);
  const qr = await appStoreQr(appStoreUrl);

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} />
      <main className="app animate-fade-in">
        <Hero appStoreUrl={appStoreUrl} qr={qr}>
          <ProofStrip />
        </Hero>
        <Problem />
        <FeatureSlides />
        <FreeTools />
        <Reviews />
        <CommunityNotes />
        <BlogStrip />
        <FinalCTA appStoreUrl={appStoreUrl} qr={qr}>
          <Footer appStoreUrl={appStoreUrl} />
        </FinalCTA>
      </main>
    </>
  );
}
