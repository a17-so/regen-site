import { AppleIcon, GooglePlayIcon } from "./icons";

interface StoreBadgesProps {
  appStoreUrl: string;
}

export default function StoreBadges({ appStoreUrl }: StoreBadgesProps) {
  return (
    <div className="store-row">
      <a className="store-badge" href={appStoreUrl} rel="nofollow">
        <AppleIcon />
        <span className="store-label">
          <span className="small">Download on the</span>
          <span>App Store</span>
        </span>
      </a>
      <a className="store-badge" href={appStoreUrl} rel="nofollow">
        <GooglePlayIcon />
        <span className="store-label">
          <span className="small">Get it on</span>
          <span>Google Play</span>
        </span>
      </a>
    </div>
  );
}
