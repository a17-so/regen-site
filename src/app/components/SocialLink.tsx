// One profile link as a solid brand-coloured pill. The host decides the
// mark, the colour and whether a label is shown (X's mark IS its name, so
// that pill is mark-only). Unknown hosts get an ink pill with the hostname.

const LINKEDIN =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const X =
  "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";

interface Network {
  label: string;
  cls: string;
  path?: string;
  size?: number;
  markOnly?: boolean;
}

const NETWORKS: Record<string, Network> = {
  "linkedin.com": { label: "LinkedIn", cls: "soc-link--in", path: LINKEDIN, size: 18 },
  "x.com": { label: "X", cls: "soc-link--x", path: X, size: 18, markOnly: true },
  "twitter.com": { label: "X", cls: "soc-link--x", path: X, size: 18, markOnly: true },
};

function network(url: string): Network {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return NETWORKS[host] ?? { label: host, cls: "soc-link--other" };
  } catch {
    return { label: url, cls: "soc-link--other" };
  }
}

export default function SocialLink({ href }: { href: string }) {
  const n = network(href);
  return (
    <a
      className={`soc-link ${n.cls}${n.markOnly ? " soc-link--mark" : ""}`}
      href={href}
      rel="me noopener"
      target="_blank"
      aria-label={n.label}
      title={n.label}
    >
      {n.path ? (
        <svg width={n.size} height={n.size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={n.path} />
        </svg>
      ) : null}
      {n.markOnly ? null : n.label}
    </a>
  );
}
