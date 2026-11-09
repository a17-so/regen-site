import { buildAppStoreUrl } from "../lib/appStoreUrl";
import { appStoreQr } from "../lib/qr";
import { getSiteStats, formatStat } from "../lib/stats";
import NavBar from "./NavBar";
import Hero from "./Hero";
import Features from "./Features";
import Reviews from "./Reviews";
import Pillars from "./Pillars";
import BlogStrip from "./BlogStrip";
import PageClose from "./PageClose";

interface LandingProps {
  /** Approved creator slug, drives the App Store campaign token. */
  creatorSlug?: string;
}

/**
 * Section order follows the agreed sitemap, with one deliberate throwback:
 * the hero and the 01–05 feature rows are the pre-slides versions, restyled
 * to the current system (see Hero.tsx / Features.tsx). The pinned slide
 * deck and the free-tools strip left with that swap; tools now live on
 * their own page at /tools, linked from compound pages and the shop.
 *
 * Community Notes was cut on 2026-11-06 along with the app's community
 * surfaces; the section, its routes, API, and CSS are gone.
 */
export default async function Landing({ creatorSlug }: LandingProps) {
  const appStoreUrl = buildAppStoreUrl(creatorSlug);
  const qr = await appStoreQr(appStoreUrl);
  // Checkable numbers for the hero stat row; a count too small to carry
  // weight is passed as null and the row omits it.
  const stats = await getSiteStats();

  return (
    <>
      <NavBar appStoreUrl={appStoreUrl} />
      <main className="app animate-fade-in">
        <Hero
          appStoreUrl={appStoreUrl}
          qr={qr}
          doses={stats.doses > 0 ? formatStat(stats.doses) : null}
          sources={stats.sources > 0 ? formatStat(stats.sources) : null}
        />
        <Features />
        <Pillars />
        <Reviews />
        <BlogStrip />
        <PageClose appStoreUrl={appStoreUrl} />
      </main>
    </>
  );
}
