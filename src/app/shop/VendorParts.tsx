import type { CSSProperties, ReactNode } from "react";
import { type Answer, type CoaPillar, type Pillar, type ShopVendor, type VendorStat, type Verification, formatScore, scoreRamp } from "../lib/shop";

/**
 * The vendor surfaces' parts. One coloured mark on the whole shop: the
 * score ring, painted with the app's ramp for the score band. Everything
 * else is ink on grey: the pillar rows, the price rail, the words. Tier
 * discs, four-ramp pillar tiles and a red-to-green price rail were all cut
 * on 2026-11-08 ("the coloring is just all over the place", "fuck off with
 * tiers"). Facts are words on a line (`Facts`) and numbers with a label
 * (`Stats`), never pills.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export function VendorMark({ v, size = 32 }: { v: Pick<ShopVendor, "name" | "logoUrl">; size?: number }) {
  return v.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="sh-mark" src={v.logoUrl} alt="" width={size} height={size} loading="lazy" style={{ width: size, height: size }} />
  ) : (
    <span className="sh-mark sh-mark--letter" aria-hidden="true" style={{ width: size, height: size }}>
      {v.name.slice(0, 1)}
    </span>
  );
}

/** The check-mark seal: accent for a vetted vendor, gold for a partner. */
export function Seal({ verification, size = 15 }: { verification: Verification | null; size?: number }) {
  if (verification !== "blue" && verification !== "gold") return null;
  const label = verification === "gold" ? "REGEN partner" : "REGEN vetted";
  return (
    <svg className={`sh-seal sh-seal--${verification}`} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label}>
      <title>{label}</title>
      <path
        fill="currentColor"
        d="M12 1.6l2.3 1.9 2.9-.6 1.2 2.7 2.7 1.2-.6 2.9 1.9 2.3-1.9 2.3.6 2.9-2.7 1.2-1.2 2.7-2.9-.6L12 22.4l-2.3-1.9-2.9.6-1.2-2.7-2.7-1.2.6-2.9L1.6 12l1.9-2.3-.6-2.9 2.7-1.2 1.2-2.7 2.9.6z"
      />
      <path d="M7.5 12.2l3 3 6-6.4" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The quiet facts line: words divided by middle dots. */
export function Facts({ items, className }: { items: string[]; className?: string }) {
  if (!items.length) return null;
  return (
    <p className={`sh-facts-line${className ? ` ${className}` : ""}`}>
      {items.map((t, i) => (
        <span key={t}>
          {i > 0 && <i aria-hidden="true">·</i>}
          {t}
        </span>
      ))}
    </p>
  );
}

/** Numbers with a label under each: the reference's Reviews · COAs row. */
export function Stats({ stats, className }: { stats: VendorStat[]; className?: string }) {
  return (
    <ul className={`sh-stats${className ? ` ${className}` : ""}`}>
      {stats.map((s) => (
        <li key={s.label}>
          <strong className={s.none ? "lib-none" : undefined}>{s.value}</strong>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The score as a progress ring: a grey track filled score/10 by the
 * score's ramp (green strong, gold middle, warm weak), the number in the
 * hole. `id` keys the gradient, since a page can carry forty of these.
 */
export function ScoreRing({ score, id, size = 86, stroke = 7 }: { score: number; id: string; size?: number; stroke?: number }) {
  const ramp = scoreRamp(score);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0.04, Math.min(1, score / 10));
  const gid = `ring-${id}`;
  return (
    <span className={`sh-ring sh-ring--${ramp}`} style={{ width: size, height: size }} role="img" aria-label={`Score ${formatScore(score)} out of 10`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="sh-ring-top" />
            <stop offset="1" className="sh-ring-tip" />
          </linearGradient>
        </defs>
        <circle className="sh-ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * frac} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="sh-ring-n" style={{ fontSize: Math.round(size * 0.3) }}>
        {formatScore(score)}
      </span>
    </span>
  );
}

/**
 * The pillars as hairline rows: label, an ink bar on a grey track filled
 * value/outOf, the value. Carries both the 0-10 vendor pillars and the
 * 0-100 COA components without rescaling either.
 */
export function PillarRows({ pillars, outOf = 10 }: { pillars: (Pillar | CoaPillar)[]; outOf?: number }) {
  return (
    <div className="sh-rows">
      {pillars.map((p) => (
        <div key={p.label} className="sh-row">
          <span className="sh-row-l">{p.label}</span>
          <span className="sh-row-track">
            <span className="sh-row-bar" style={{ "--v": Math.max(0, Math.min(1, p.value / outOf)) } as Vars} />
          </span>
          <strong className="sh-row-n">
            {p.value}
            <span>/{outOf}</span>
          </strong>
        </div>
      ))}
    </div>
  );
}

/**
 * The ONE section head on every shop pane: title (17/700) left, a quiet
 * note right. A second card-head style (16/500 with a stroke) sat beside
 * this one on the same page and read as two systems; it was removed.
 */
export function SheetHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="sh-sheet-head">
      <h2>{title}</h2>
      {note && <span className="sh-sheet-note">{note}</span>}
    </div>
  );
}

/** The market-position rail: a grey track, an ink marker at the vendor's fraction. */
export function PriceBar({ fraction }: { fraction: number }) {
  return (
    <div className="sh-pricebar" role="img" aria-label={`Price position ${Math.round(fraction * 100)} of 100, where 100 is the cheapest vendor`}>
      <span className="sh-pricebar-rail" />
      <span className="sh-pricebar-mark" style={{ "--f": Math.max(0, Math.min(1, fraction)) } as Vars} />
    </div>
  );
}

/**
 * The answer strip: the questions a buyer asks, answered in words, one
 * pane, the same on a vendor profile and a compound page (2026-11-10).
 * Each cell is a 13 subtext question over a 17/500 answer; `lead` holds
 * the score ring on a profile, `end` the one button.
 */
export function AnswerStrip({ items, lead, end, label = "At a glance" }: { items: Answer[]; lead?: ReactNode; end?: ReactNode; label?: string }) {
  return (
    <div className="sh-pane sh-answers" aria-label={label}>
      {lead}
      {items.map((it) => (
        <div key={it.q} className="sh-answer">
          <span className="sh-answer-q">{it.q}</span>
          <strong className={`sh-answer-a${it.none ? " lib-none" : ""}`}>{it.a}</strong>
        </div>
      ))}
      {end}
    </div>
  );
}
