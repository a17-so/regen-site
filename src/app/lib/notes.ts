/**
 * Community notes feed.
 *
 * ── Why this returns nothing ────────────────────────────────────────────────
 * There is no notes collection in the app. I checked the whole Firestore
 * schema in regen-app/schema/, the closest things are
 * `users/{uid}/memory/{memId}` (private REGEN AI long-term memory),
 * `ingredientReports`, and `coaReports`. None of them are user-authored public
 * notes, and none are safe to surface on a marketing page.
 *
 * So a "live feed of recent community notes" is a feature that doesn't exist
 * yet, not an integration that's missing. Filling this with invented notes
 * would be fabricating community activity for a health product, the exact
 * thing the section is supposed to prove isn't happening.
 *
 * ── What it needs to go live ────────────────────────────────────────────────
 *  1. A notes feature in the app: users write a short note against a compound
 *     or a dose, and explicitly opt in to sharing it.
 *  2. A public projection, a `communityNotes` collection holding only what's
 *     shareable (compound, body, timestamp, no uid, no dose amounts, no
 *     biomarker values), written by a trigger when a note is marked public.
 *  3. Moderation, before anything user-written renders on the marketing site.
 *
 * Once that exists this reads the latest N from that collection and the
 * section lights up on its own, no component changes needed.
 */

export interface CommunityNote {
  id: string;
  /** Compound the note is filed against, e.g. "BPC-157". */
  compound: string;
  /** The shareable note body. Already moderated. */
  body: string;
  /** Pre-formatted, e.g. "2h ago", formatted server-side so the markup is stable. */
  relativeTime: string;
}

export async function getRecentNotes(): Promise<CommunityNote[]> {
  // Intentionally empty. CommunityNotes renders null on an empty array, so
  // the section stays out of the page until there is something true to show.
  return [];
}
