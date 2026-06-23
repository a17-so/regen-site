"use client";
import { AppleIcon } from "./icons";
import { track } from "../lib/analytics";

interface StoreBadgesProps {
  appStoreUrl: string;
}

export default function StoreBadges({ appStoreUrl }: StoreBadgesProps) {
  return (
    <button
      className="btn-primary"
      disabled
      style={{ cursor: "not-allowed" }}
    >
      <AppleIcon />
      Launching Soon
    </button>
  );
}
