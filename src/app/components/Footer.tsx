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
            Every vial, every dose, and every biomarker, held in one place.
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
                  <a href={`${sectionBase}#features`}>Features</a>
                </li>
                <li>
                  <a href={`${sectionBase}#features`}>How it works</a>
                </li>
                <li>
                  <a href={`${sectionBase}#stories`}>Member stories</a>
                </li>
                <li>
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download on iOS
                  </a>
                </li>
              </ul>
            </div>

            <div className="ft-col">
              <h4>Tools</h4>
              <ul>
                <li>
                  <a href="/tools/reconstitution">Reconstitution calculator</a>
                </li>
                <li>
                  <a href="/tools">All tools</a>
                </li>
                <li>
                  <a href="/community-notes">Community reports</a>
                </li>
                <li>
                  <a href="/community-notes/file">File a report</a>
                </li>
                <li>
                  <a href="/blog">Peptide guides</a>
                </li>
              </ul>
            </div>

            <div className="ft-col">
              <h4>Read</h4>
              <ul>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="/blog">Latest research</a>
                </li>
                <li>
                  <a href="/faq">FAQs</a>
                </li>
                <li>
                  <a href="/tools/reconstitution">Dosing math</a>
                </li>
                <li>
                  <a href="/disclaimer">Our disclaimer</a>
                </li>
                <li>
                  <a href="/privacy">How we use data</a>
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
