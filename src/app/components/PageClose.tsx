import { appStoreQr } from "../lib/qr";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";

interface PageCloseProps {
  appStoreUrl: string;
  /** "" for landing pages (in-page anchors), "/" for interior pages. */
  sectionBase?: string;
}

/**
 * The page's closing pair, everywhere: the Get REGEN glass card with its
 * drifting squares (FinalCTA), then the footer riding inside it so the
 * two cards stack flush. Every page ends through this component — a bare
 * footer with no ask above it is a dead end.
 */
export default async function PageClose({
  appStoreUrl,
  sectionBase = "",
}: PageCloseProps) {
  const qr = await appStoreQr(appStoreUrl);
  return (
    <FinalCTA appStoreUrl={appStoreUrl} qr={qr}>
      <Footer appStoreUrl={appStoreUrl} sectionBase={sectionBase} />
    </FinalCTA>
  );
}
