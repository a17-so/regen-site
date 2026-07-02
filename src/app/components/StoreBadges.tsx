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
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={() => track("app_store_click", { location: "hero" })}
    >
      <AppleIcon />
      Download
    </a>
  );
}
