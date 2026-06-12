"use client";
import { useEffect } from "react";
import { track } from "../../lib/analytics";

export function BlogAnalytics({ slug }: { slug: string }) {
  useEffect(() => {
    const startTime = Date.now();
    const reached = new Set<number>();

    // Capture UTM + fire blog_post_viewed
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
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
    track("blog_post_viewed", { slug, ...utm });

    // Scroll depth at 25 / 50 / 75 / 100 %
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = Math.round(((scrollTop + clientHeight) / scrollHeight) * 100);
      for (const threshold of [25, 50, 75, 100]) {
        if (pct >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          track("scroll_depth", { slug, depth: threshold });
        }
      }
    };

    // Time on page — fires on tab close / navigation
    const onUnload = () => {
      track("time_on_page", {
        slug,
        seconds: Math.round((Date.now() - startTime) / 1000),
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [slug]);

  return null;
}
