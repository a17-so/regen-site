interface FooterProps {
  appStoreUrl: string;
  /** "" for landing pages (in-page anchors), "/" for legal pages. */
  sectionBase?: string;
}

const SOCIALS: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://instagram.com/regenhealthapp" },
  { label: "TikTok", href: "https://www.tiktok.com/@regenhealthapp" },
  { label: "X", href: "https://x.com/regenhealthapp" },
  { label: "Threads", href: "https://www.threads.com/@regenhealthapp" },
  { label: "Discord", href: "https://discord.gg/sBAF6vUjVr" },
];

export default function Footer({ appStoreUrl, sectionBase = "" }: FooterProps) {
  return (
    <footer id="download" className="footer">
      <div className="footer-cols">
        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li><a href={`${sectionBase}#home`}>Home</a></li>
            <li><a href={`${sectionBase}#features`}>Features</a></li>
            <li><a href={`${sectionBase}#reviews`}>Reviews</a></li>
            <li><a href={`${sectionBase}#faq`}>FAQ</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Socials</h4>
          <ul>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="/disclaimer">Non-medical disclaimer</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Get the app</h4>
          <ul>
            <li><a href={appStoreUrl} rel="nofollow">App Store</a></li>
            <li><a href={appStoreUrl} rel="nofollow">Google Play</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Coaches</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-meta">
        <span>REGEN Health Inc. — A protocol is not a prescription.</span>
        <span>All rights reserved © 2026</span>
      </div>
      <div className="footer-wordmark">REGEN</div>
    </footer>
  );
}
