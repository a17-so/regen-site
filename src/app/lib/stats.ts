/**
 * Site stats for the proof strip.
 *
 * ── How this works ─────────────────────────────────────────────────────────
 * An hourly Cloud Function in regen-app (`functions/src/scheduled/siteStats.ts`)
 * rolls the counters into one world-readable document, `siteStats/current`, in
 * the named `regen` database. This reads that document over the Firestore REST
 * API, no Firebase SDK in the bundle, one fetch, revalidated hourly.
 *
 * Counting here instead would mean a collection-group scan over every user's
 * private `doseLogs` on every render, which is slow, expensive, and walks
 * health data to produce an integer. The aggregate doc holds only integers.
 *
 * ── No API key, deliberately ───────────────────────────────────────────────
 * Firestore's REST API evaluates security rules on unauthenticated requests
 * without one. Verified against this project: a keyless GET on `peptides`
 * returns 403 PERMISSION_DENIED (rules evaluated, correctly denying) while one
 * on `siteStats/current` returns 404 NOT_FOUND (request accepted, document
 * simply absent). So the rule below is the entire access control, and there is
 * no key to rotate, restrict, or leak.
 *
 * ── Before this goes live ──────────────────────────────────────────────────
 *  1. Deploy the function:  cd regen-app/functions && npm run deploy
 *  2. Deploy the rule that opens this one document:
 *       npx firebase-tools deploy --only firestore:rules
 *
 * Until both are done the fetch 404s, `live` stays false, and the hand-counted
 * fallbacks below render instead. The strip never shows a zero or an empty slot.
 */

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? "regen-health-app";
const DATABASE_ID = process.env.FIREBASE_DATABASE_ID ?? "regen";
/**
 * Re-fetch window, matching the aggregator's hourly cron.
 *
 * Deliberately NOT named `revalidate`: that export only configures a route
 * when it lives in a page or layout file, and exporting it from a lib does
 * nothing. What actually makes the page ISR is passing this to the fetch
 * below, which the build output confirms as "Revalidate 1h" on /.
 */
const REVALIDATE_SECONDS = 3600;

export interface SiteStats {
  /** Compounds in the catalog. */
  compounds: number;
  /** Distinct cited source URLs across the library. */
  sources: number;
  /** Doses logged by users, all time. */
  doses: number;
  /** Community notes / COA reports filed. */
  notes: number;
  /** True when these came from Firestore rather than the fallbacks. */
  live: boolean;
}

/**
 * Snapshot of production, counted directly against Firestore with the Admin
 * SDK on 2026-08-06. Not guesses, the same aggregations the scheduled
 * function runs, so these are what the live values were at that moment and
 * they only go stale in one direction (upward).
 *
 * `sources` is 449 distinct URLs. An earlier build claimed 1,240, which was
 * never derived from anything and overstated it ~2.8×. If you change any of
 * these by hand, count first.
 */
const FALLBACK: SiteStats = {
  compounds: 54,
  sources: 449,
  doses: 84,
  notes: 2,
  live: false,
};

/** Firestore REST wraps every value in a type tag: {"integerValue":"54"}. */
function readInt(fields: Record<string, unknown>, key: string): number | undefined {
  const field = fields?.[key] as { integerValue?: string; doubleValue?: number } | undefined;
  if (!field) return undefined;
  if (typeof field.integerValue === "string") {
    const n = Number.parseInt(field.integerValue, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  if (typeof field.doubleValue === "number") return Math.round(field.doubleValue);
  return undefined;
}

export async function getSiteStats(): Promise<SiteStats> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/${DATABASE_ID}/documents/siteStats/current`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return FALLBACK;

    const doc = (await res.json()) as { fields?: Record<string, unknown> };
    const f = doc.fields;
    if (!f) return FALLBACK;

    // Each field falls back independently: if the aggregator hasn't written
    // `doses` yet, that shouldn't drag the catalog counts back to stale values.
    return {
      compounds: readInt(f, "compounds") ?? FALLBACK.compounds,
      sources: readInt(f, "sources") ?? FALLBACK.sources,
      doses: readInt(f, "doses") ?? FALLBACK.doses,
      notes: readInt(f, "notes") ?? FALLBACK.notes,
      live: true,
    };
  } catch {
    // A stats outage degrades to last-known numbers, never to a broken strip.
    return FALLBACK;
  }
}

/** 1240 → "1,240". Keeps the strip readable at a glance. */
export function formatStat(n: number): string {
  return n.toLocaleString("en-US");
}
