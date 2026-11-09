import Logo from "./Logo";
import { AppleIcon } from "./icons";
import { appStoreQr } from "../lib/qr";
import QrCode from "./QrCode";

interface FooterProps {
  appStoreUrl: string;
  /** "" for landing pages (in-page anchors), "/" for legal and blog pages. */
  sectionBase?: string;
}

const SOCIALS: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://instagram.com/regenhealthapp" },
  { label: "TikTok", href: "https://www.tiktok.com/@regenhealthapp" },
  { label: "X", href: "https://x.com/regenhealthapp" },
  { label: "Threads", href: "https://www.threads.com/@regenhealthapp" },
  { label: "Discord", href: "https://discord.gg/sBAF6vUjVr" },
];

/**
 * Footer, on a glass card.
 *
 * The signup posts to /api/subscribe, which forwards to NEWSLETTER_WEBHOOK_URL.
 * Unset, it returns 503 and the form says signups aren't open, so it looks
 * complete and can't silently swallow an address. Set the env var and it works
 * for real with no front-end change.
 */
export default async function Footer({
  appStoreUrl,
  sectionBase = "",
}: FooterProps) {
  const qr = await appStoreQr(appStoreUrl);
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="ft-card">
        {/* One line: mark, wordmark, and what the product is. */}
        <div className="ft-brandline">
          <a className="footer-brand" href={sectionBase === "" ? "#home" : "/"}>
            <Logo size={26} />
            <span className="nm-stroke">REGEN</span>
          </a>
          <p>
            Find the peptide, compare who sells it, track it in the app.
          </p>
        </div>

        <div className="ft-main">
          <div className="ft-get">
            <div className="ft-qr">
              <QrCode matrix={qr} />
            </div>
            <div className="ft-get-copy">
              <strong>Download from App Store</strong>
              <span>Free on iOS. Nothing to set up.</span>
              <a
                className="btn btn-tiny btn-glass"
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppleIcon size={18} />
                App Store
              </a>
            </div>
          </div>

          <div className="ft-links">
            <div className="ft-col">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href={`${sectionBase}#features`}>How it works</a>
                </li>
                <li>
                  <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                    iOS app
                  </a>
                </li>
              </ul>
            </div>

            <div className="ft-col">
              <h4>Research</h4>
              <ul>
                <li>
                  <a href="/library">Peptide Library</a>
                </li>
                <li>
                  <a href="/blog">Science</a>
                </li>
                <li>
                  <a href="/tools">Dose calculator</a>
                </li>
                <li>
                  <a href="/tools/bacteriostatic-water">Bac water guide</a>
                </li>
              </ul>
            </div>

            <div className="ft-col">
              <h4>Shop</h4>
              <ul>
                <li>
                  <a href="/shop">Vendors</a>
                </li>
                <li>
                  <a href="/shop/catalog">Catalog</a>
                </li>
                <li>
                  <a href="/shop/saved">Saved</a>
                </li>
                <li>
                  <a href="/shop/submit">Submit a vendor</a>
                </li>
              </ul>
            </div>

            <div className="ft-col">
              <h4>Help</h4>
              <ul>
                <li>
                  <a href="/faq">FAQ</a>
                </li>
                <li>
                  <a href="/disclaimer">Disclaimer</a>
                </li>
                <li>
                  <a href="/privacy">Privacy</a>
                </li>
              </ul>
            </div>

            <div className="ft-col">
              <h4>Connect</h4>
              <ul>
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <span className="ft-legal-co">
            © {year} REGEN Health Inc. DBA A17 LLC. All rights reserved.
          </span>
          <nav className="ft-legal-links" aria-label="Legal">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy policy</a>
            <a href="/disclaimer">Medical disclaimer</a>
          </nav>
        </div>

        <p className="ft-disclaimer">
          REGEN is a tracking and reference tool, not a medical device. Nothing
          on this site is medical advice, and nothing here diagnoses, treats, or
          prescribes. Most compounds referenced are experimental research
          peptides rather than approved drugs. Talk to a licensed clinician
          before starting, changing, or stopping any protocol.
        </p>
      </div>
    </footer>
  );
}
