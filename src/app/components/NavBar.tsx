import { appStoreQr } from "../lib/qr";
import Nav from "./Nav";

/**
 * Server wrapper around <Nav>.
 *
 * Nav is a client component (it owns the scroll-collapse state), so it can't
 * call the QR generator itself. This builds the matrix at request time and
 * hands it down, `qrcode` never enters the client bundle, and the matrix is
 * a couple of KB of plain string in the RSC payload.
 */
export default async function NavBar({
  appStoreUrl,
  sectionBase,
}: {
  appStoreUrl: string;
  sectionBase?: string;
}) {
  const qr = await appStoreQr(appStoreUrl);
  return <Nav appStoreUrl={appStoreUrl} sectionBase={sectionBase} qr={qr} />;
}
