interface NavProps {
  appStoreUrl: string;
  /** "" for landing pages (in-page anchors), "/" for legal pages (links back to home). */
  sectionBase?: string;
}

export default function Nav({ appStoreUrl, sectionBase = "" }: NavProps) {
  const homeHref = sectionBase === "/" ? "/" : "#home";
  return (
    <nav
      className="nav"
      style={{
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        background: "rgba(255,255,255,0.72)",
      }}
    >
      <div className="nav-links">
        <a href={`${sectionBase}#home`}>Home</a>
        <a href={`${sectionBase}#features`}>Features</a>
        <a href={`${sectionBase}#reviews`}>Reviews</a>
        <a href={`${sectionBase}#faq`}>FAQ</a>
      </div>
      <a href={homeHref} className="nav-wordmark" aria-label="REGEN — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/regen-logo.png"
          width={28}
          height={28}
          alt="REGEN"
          style={{ display: "block", objectFit: "contain" }}
        />
        <span>REGEN</span>
      </a>
      <div className="nav-cta">
        <a className="btn-pill" href={appStoreUrl} rel="nofollow">
          <span className="dot"></span>
          <span className="label-full">Download now</span>
          <span className="label-short">Download</span>
        </a>
      </div>
    </nav>
  );
}
