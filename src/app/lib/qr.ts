import QRCode from "qrcode";

/**
 * App Store QR codes.
 *
 * This returns the raw module matrix rather than the library's rendered SVG,
 * so the front end can draw the code itself, rounded modules, custom finder
 * eyes, whatever. The library's output is a single monolithic path with square
 * modules and no styling hooks.
 *
 * `qrcode` is a server-only import, called from server components, so it never
 * reaches the client bundle. Generating per-URL matters: `buildAppStoreUrl`
 * stamps a campaign token per creator slug, and a hardcoded code would
 * attribute every creator's scans to the landing page.
 */

export interface QrMatrix {
  /** Modules per side, excluding the quiet zone. */
  size: number;
  /** Row-major "1"/"0" string, `size * size` long. */
  bits: string;
}

const cache = new Map<string, QrMatrix>();

export async function appStoreQr(url: string): Promise<QrMatrix> {
  const hit = cache.get(url);
  if (hit) return hit;

  // Level M tolerates ~15% damage, the usual choice for a code scanned off a
  // screen at an angle, and it leaves enough redundancy that rounding the
  // modules doesn't hurt read rate.
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const data = qr.modules.data;

  let bits = "";
  for (let i = 0; i < data.length; i++) bits += data[i] ? "1" : "0";

  const matrix = { size, bits };
  cache.set(url, matrix);
  return matrix;
}
