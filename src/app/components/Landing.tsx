import { buildAppStoreUrl } from "../lib/appStoreUrl";
import Nav from "./Nav";
import Hero from "./Hero";
import Features from "./Features";
import Reviews from "./Reviews";
import Blog from "./Blog";
import FAQ from "./FAQ";
import Footer from "./Footer";

interface LandingProps {
  /** Approved creator slug — drives the App Store campaign token. */
  creatorSlug?: string;
}

export default function Landing({ creatorSlug }: LandingProps) {
  const appStoreUrl = buildAppStoreUrl(creatorSlug);

  return (
    <>
      <Nav appStoreUrl={appStoreUrl} />
      <div className="app animate-fade-in">
        <Hero appStoreUrl={appStoreUrl} />
        <Features />
        <Reviews />
        <Blog />
        <FAQ />
        <Footer appStoreUrl={appStoreUrl} />
      </div>
    </>
  );
}
