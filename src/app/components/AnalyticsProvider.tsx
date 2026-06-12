"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanel, track } from "../lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Dict = {};
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]) {
      const val = params.get(key);
      if (val) utm[key] = val;
    }
    track("page_viewed", { path: pathname, url: window.location.href, ...utm });
  }, [pathname]);

  return <>{children}</>;
}

type Dict = Record<string, string>;
