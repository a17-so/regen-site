"use client";
import { AppleIcon } from "./icons";
import { track } from "../lib/analytics";

interface StoreBadgesProps {
  appStoreUrl: string;
}

export default function StoreBadges({ appStoreUrl }: StoreBadgesProps) {
  return (
    <a
      className="btn-primary"
      href={appStoreUrl}
      rel="nofollow"
      onClick={() => track("download_clicked", { location: "hero" })}
    >
      <AppleIcon />
      Get REGEN Free
    </a>
  );
}
