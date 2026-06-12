#!/usr/bin/env node
// Run: bun scripts/seed-mixpanel.mjs

const TOKEN = "bde57612bb37e4bb082f3a918fd99960";
const API_SECRET = "94823471452be0905cd6fac7a607b35c";

const now = Math.floor(Date.now() / 1000);
const DAY = 86400;

let _id = 0;
function insertId() { return `seed-${now}-${++_id}`; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function tsAgo(daysBack) { return now - daysBack * DAY - rand(0, DAY); }

const GEO = {
  US: ["New York", "Los Angeles", "Austin", "San Francisco", "Seattle", "Miami"],
  GB: ["London", "Manchester", "Edinburgh"],
  CA: ["Toronto", "Vancouver", "Calgary"],
  AU: ["Sydney", "Melbourne"],
  DE: ["Berlin", "Munich"],
  FR: ["Paris"],
  NL: ["Amsterdam"],
};
const COUNTRIES = [
  "US","US","US","US","US","US","GB","GB","CA","CA","AU","DE","FR","NL",
];

const BLOG_SLUGS = [
  "reading-free-testosterone",
  "reconstitution-without-anxiety",
  "retatrutide-vs-tirzepatide",
];
const UTM_SOURCES = ["instagram","twitter","google","newsletter","reddit","substack"];
const UTM_MEDIUMS = ["social","cpc","organic","email","referral"];

const events = [];

function base(userId, time, country) {
  const city = pick(GEO[country]);
  return {
    token: TOKEN,
    distinct_id: userId,
    time,
    $insert_id: insertId(),
    $country_code: country,
    $city: city,
  };
}

// ── Landing page visitors (300 sessions over 30 days) ───────────────────────
for (let i = 1; i <= 300; i++) {
  const uid = `seed-lp-${String(i).padStart(3, "0")}`;
  const country = pick(COUNTRIES);
  const t = tsAgo(rand(0, 29));

  // page_viewed
  events.push({ event: "page_viewed", properties: { ...base(uid, t, country), path: "/", url: "https://regenhealth.app/" } });

  // 78% see the hero
  if (rand(1, 100) <= 78) {
    events.push({ event: "hero_viewed", properties: { ...base(uid, t + rand(2, 8), country) } });

    // 22% of hero viewers click download (hero→download funnel)
    if (rand(1, 100) <= 22) {
      events.push({
        event: "download_clicked",
        properties: { ...base(uid, t + rand(12, 90), country), location: rand(1, 3) <= 2 ? "hero" : "nav" },
      });
    }
  }
}

// ── Blog readers (80 sessions) ───────────────────────────────────────────────
for (let i = 1; i <= 80; i++) {
  const uid = `seed-blog-${String(i).padStart(2, "0")}`;
  const country = pick(COUNTRIES);
  const slug = pick(BLOG_SLUGS);
  const t = tsAgo(rand(0, 29));
  const isDirect = rand(1, 5) === 1;
  const source = isDirect ? undefined : pick(UTM_SOURCES);
  const medium = isDirect ? undefined : pick(UTM_MEDIUMS);

  // page_viewed for blog post
  events.push({
    event: "page_viewed",
    properties: {
      ...base(uid, t, country),
      path: `/blog/${slug}`,
      url: `https://regenhealth.app/blog/${slug}`,
      ...(source ? { utm_source: source, utm_medium: medium } : {}),
    },
  });

  // blog_post_viewed
  events.push({
    event: "blog_post_viewed",
    properties: {
      ...base(uid, t + 1, country),
      slug,
      ...(source ? { utm_source: source, utm_medium: medium } : {}),
    },
  });

  // scroll depth — 25% always, then drop-off at each threshold
  const maxDepth = pick([25, 25, 50, 50, 75, 100, 100]);
  for (const d of [25, 50, 75, 100]) {
    if (d > maxDepth) break;
    events.push({ event: "scroll_depth", properties: { ...base(uid, t + rand(15, 60), country), slug, depth: d } });
  }

  // time_on_page
  const seconds = rand(30, 520);
  events.push({ event: "time_on_page", properties: { ...base(uid, t + seconds, country), slug, seconds } });

  // some blog readers then hit download
  if (rand(1, 10) <= 2) {
    events.push({ event: "download_clicked", properties: { ...base(uid, t + seconds + rand(5, 30), country), location: "nav" } });
  }
}

// Strip undefined values that JSON.stringify drops anyway
const clean = JSON.parse(JSON.stringify(events));
console.log(`Seeding ${clean.length} events…`);

// ── Send to Mixpanel in batches of 200 ─────────────────────────────────────
const auth = Buffer.from(`${API_SECRET}:`).toString("base64");
const BATCH = 200;

for (let i = 0; i < clean.length; i += BATCH) {
  const batch = clean.slice(i, i + BATCH);
  const res = await fetch("https://api.mixpanel.com/import?strict=1", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(batch),
  });
  const body = await res.text();
  const sent = Math.min(i + BATCH, clean.length);
  console.log(`  [${sent}/${clean.length}] HTTP ${res.status} — ${body}`);
  if (!res.ok) {
    console.error("Import failed, stopping.");
    process.exit(1);
  }
}

console.log("Done. Open Mixpanel → Events to verify, then build your boards.");
