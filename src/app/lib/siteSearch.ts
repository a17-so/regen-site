/**
 * The header search's matcher (2026-11-11). Plain substring matching missed
 * most real queries: "bpc157" never found BPC-157, "tb500" found nothing,
 * "semeglutide" found nothing, "weight loss" found one article, and the
 * site's own pages ("calculator", "faq", "vendors") were not searchable.
 *
 * How it matches, all on normalised text (lowercase, accents and
 * punctuation gone):
 * - the whole query with spaces and punctuation removed against the name
 *   with the same removed, so "bpc157" = "BPC-157" and "ghkcu" = "GHK-Cu";
 * - otherwise EVERY query word must match a word of the name or the
 *   keywords, by prefix ("reta" finds Retatrutide) or within a small typo
 *   distance (one edit from 5 letters, two from 8);
 * - filler words ("best", "peptide", "for", "what is") are dropped, so a
 *   question still finds its subject.
 * Name hits outrank keyword hits; a guide or page edges out its duplicates.
 */
export interface Searchable {
  name: string;
  kind: string;
  alt?: string;
  keywords?: string;
  topic?: string;
}

const STOP = new Set(
  "a an and are best can do does for good how i in is it me my of on or peptide peptides should take the to top what which with you your".split(" ")
);
/* A calculator's name repeats its compound's full name ("DSIP (Delta
   Sleep-Inducing Peptide) calculator"), so it sits below the guide unless
   the query asks for a calculator, which only the calculators match. */
const KIND_BONUS: Record<string, number> = { Guide: 3, Page: 3, Tool: -8, Vendor: 2, Compound: 1, Article: 0 };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const squash = (s: string) => norm(s).replace(/ /g, "");

/** Levenshtein distance, stopping early once it passes `max`. */
function within(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}

/** How well one query word matches a list of words: 3 exact, 2 prefix, 1 typo, 0 none. */
function wordHit(q: string, words: string[]): number {
  let hit = 0;
  const typo = q.length >= 8 ? 2 : q.length >= 5 ? 1 : 0;
  for (const w of words) {
    if (w === q) return 3;
    // Prefix either way, the reverse only for a plural or a short suffix
    // ("muscles" finds "muscle"), never "aminoclub" finding "amino".
    if (w.startsWith(q) || (w.length >= 4 && q.startsWith(w) && q.length - w.length <= 2)) hit = Math.max(hit, 2);
    else if (typo && hit < 1 && within(q, w.slice(0, q.length + typo), typo)) hit = 1;
  }
  return hit;
}

interface Prepared<T> {
  row: T;
  nameSquash: string;
  altSquash: string[];
  nameWords: string[];
  altWords: string[];
  keyWords: string[];
  topicWords: string[];
}
const words = (s?: string) => (s ? norm(s).split(" ").filter(Boolean) : []);

export function prepare<T extends Searchable>(rows: T[]): Prepared<T>[] {
  return rows.map((row) => ({
    row,
    nameSquash: squash(row.name),
    altSquash: row.alt ? row.alt.split(/[,;]/).map(squash).filter(Boolean) : [],
    nameWords: words(row.name),
    altWords: words(row.alt),
    keyWords: words(row.keywords),
    topicWords: words(row.topic),
  }));
}

/** Points per hit level (exact 3, prefix 2, typo 1), by field. */
const WEIGHT = { name: 10, alt: 9, key: 3, topic: 1.5 };

export function search<T extends Searchable>(prepared: Prepared<T>[], query: string, limit = 12): T[] {
  const qSquash = squash(query);
  if (qSquash.length < 2) return [];
  const all = words(query);
  const meaningful = all.filter((w) => !STOP.has(w));
  const terms = meaningful.length ? meaningful : all;

  const scored: { row: T; score: number; len: number }[] = [];
  for (const p of prepared) {
    let score = 0;
    if (p.nameSquash.startsWith(qSquash) || p.altSquash.some((a) => a.startsWith(qSquash))) score = 100;
    // Inside a name but not at its start ("bpc157" in "Blend BPC 157 KPV"):
    // enough to list it, never enough to beat a real word or alias hit.
    else if (qSquash.length >= 3 && p.nameSquash.includes(qSquash)) score = 25;

    let termScore = 0;
    let allMatched = true;
    for (const t of terms) {
      const best = Math.max(
        wordHit(t, p.nameWords) * WEIGHT.name,
        wordHit(t, p.altWords) * WEIGHT.alt,
        wordHit(t, p.keyWords) * WEIGHT.key,
        wordHit(t, p.topicWords) * WEIGHT.topic
      );
      if (!best) {
        allMatched = false;
        break;
      }
      termScore += best;
    }
    if (allMatched) score = Math.max(score, termScore);
    if (!score) continue;
    scored.push({ row: p.row, score: score + (KIND_BONUS[p.row.kind] ?? 0), len: p.row.name.length });
  }
  scored.sort((a, b) => b.score - a.score || a.len - b.len);
  return scored.slice(0, limit).map((s) => s.row);
}
