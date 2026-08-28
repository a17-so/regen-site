import { appStoreQr } from "../lib/qr";
import { buildAppStoreUrl } from "../lib/appStoreUrl";
import GetBar from "./GetBar";

/**
 * Server wrapper around <GetBar>, the same split as NavBar/Nav: the client
 * bar owns scroll and dismiss state, so the QR matrix is built here and
 * handed down and `qrcode` never enters the client bundle.
 *
 * Mounted once in the root layout — the bar is site-wide by design. Its
 * store URL carries its own campaign tag ("footer-bar", the same scheme as
 * the default "landing-page"), so installs from the bar are measurable
 * apart from the page CTAs.
 */
export default async function GetAppBar() {
  const appStoreUrl = buildAppStoreUrl("footer-bar");
  const qr = await appStoreQr(appStoreUrl);
  return <GetBar appStoreUrl={appStoreUrl} qr={qr} />;
}
