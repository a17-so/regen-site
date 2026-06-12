---
name: project-analytics
description: Mixpanel analytics setup — token, events tracked, and file locations
metadata:
  type: project
---

Mixpanel project token: `bde57612bb37e4bb082f3a918fd99960` (client-safe, hardcoded in `src/app/lib/analytics.ts`).
API secret must never go in client code — server-side use only.

**Events tracked:**
- `page_viewed` — every route change, with `path`, `url`, UTM params (AnalyticsProvider)
- `download_clicked` — App Store button click, `location: "nav" | "hero"`
- `hero_viewed` — IntersectionObserver fires once at 40% threshold (Hero.tsx)
- `blog_post_viewed` — on blog post mount, with `slug` + UTM params (BlogAnalytics)
- `scroll_depth` — at 25/50/75/100%, with `slug` and `depth` (BlogAnalytics)
- `time_on_page` — `beforeunload`, with `slug` and `seconds` (BlogAnalytics)

**Key files:**
- `src/app/lib/analytics.ts` — Mixpanel init + `track()` wrapper
- `src/app/components/AnalyticsProvider.tsx` — wraps app in layout, handles page_viewed
- `src/app/blog/[slug]/BlogAnalytics.tsx` — blog-specific tracking
- `src/app/components/Hero.tsx` — hero_viewed via IntersectionObserver
- `src/app/components/StoreBadges.tsx` — download_clicked (hero)
- `src/app/components/Nav.tsx` — download_clicked (nav)

**Why:** User requested analytics covering landing page funnel (hero→download ratio, bounce, geo) and blog engagement (UTM, scroll depth, time on page).
**How to apply:** Add new events using `track()` from `src/app/lib/analytics.ts`. Country/city come from Mixpanel's built-in geo enrichment — no extra setup needed.
