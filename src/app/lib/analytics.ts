import mixpanel, { type Dict } from "mixpanel-browser";

// Project token, public, intentionally in client bundle (standard Mixpanel usage).
// API secret must never be used here; it belongs in server-only routes only.
const TOKEN = "bde57612bb37e4bb082f3a918fd99960";

let ready = false;

export function initMixpanel() {
  if (ready || typeof window === "undefined") return;
  mixpanel.init(TOKEN, {
    track_pageview: false, // we handle page views manually in AnalyticsProvider
    persistence: "localStorage",
  });
  ready = true;
}

export function track(event: string, props?: Dict) {
  if (typeof window === "undefined") return;
  initMixpanel();
  mixpanel.track(event, props);
}
