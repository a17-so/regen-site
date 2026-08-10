import { getSiteStats, formatStat, type SiteStats } from "../lib/stats";
import CountUp from "./CountUp";

/**
 * Checkable numbers, straight from Firestore (see lib/stats.ts), rendered as
 * the hero's bottom stat row, bold lead, muted sub, hairline dividers, no
 * card. <Hero> takes it as a child so the row sits on the dark backdrop.
 *
 * A stat renders only when it can carry weight. Zero is obviously out, but so
 * is a number that undercuts the claim it is making: "2 notes filed" reads as
 * nobody using it, which is worse for a proof strip than simply showing three
 * strong figures. Notes joins once there are enough to mean something.
 */
const NOTES_FLOOR = 25;
function items(s: SiteStats) {
  return [
    { value: formatStat(s.compounds), label: "Compounds tracked", show: s.compounds > 0 },
    { value: formatStat(s.doses), label: "Doses logged", show: s.doses > 0 },
    { value: formatStat(s.notes), label: "Notes filed", show: s.notes >= NOTES_FLOOR },
    { value: formatStat(s.sources), label: "Sources cited", show: s.sources > 0 },
  ]
    .filter((i) => i.show)
    // Four across is the widest that stays readable; the strip drops the
    // rightmost rather than shrinking everything to fit a fifth.
    .slice(0, 4);
}

export default async function ProofStrip() {
  const stats = await getSiteStats();
  const shown = items(stats);

  return (
    <div className="hero-proof" aria-label="At a glance">
      {shown.map((i) => (
        <div className="hero-proof-item" key={i.label}>
          <CountUp display={i.value} />
          <span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}
