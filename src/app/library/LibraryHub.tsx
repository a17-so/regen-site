"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, STATUSES, STATUS_TONE, type CategorySlug } from "../lib/guideVocab";
import type { HubRow } from "../lib/guides";
import GlassTabs from "../components/GlassTabs";
import BodyFigure3D from "./BodyFigure3D";
import LibraryCard from "./LibraryCard";

/**
 * The hub, laid out like the reference: the intro and status key on the
 * left, the body in the middle, the compounds on the right, under one glass
 * filter bar (the body systems, centred, no title: the nav already says
 * Library).
 *
 * The hub is ONE scroll container the height of the screen under the nav:
 * the bar sticks to its top, the intro and the body stay put beside the
 * list, and only the list moves. So a scroll anywhere over the hub scrolls
 * the compounds, and a fast fling stops at the end of the list instead of
 * carrying the page past the body into the footer ("never lets me scroll
 * lower than the bottom of the body"); the next scroll continues down the
 * page. Below 1160px the hub is one column in the page's own scroll, with
 * the bar sticky under the nav.
 *
 * Whichever category is in view lights its hotspot and slides the bar's
 * thumb to it. A tab or a hotspot scrolls the list to its category; while
 * that scroll runs, the spy holds the picked category, so the thumb and the
 * body go straight to it instead of flicking through every system on the way.
 */
export default function LibraryHub({
  rows,
  only,
  title,
  lead,
}: {
  rows: HubRow[];
  /** Category page: just this category, its hotspot fixed on. */
  only?: CategorySlug;
  title: React.ReactNode;
  lead: string;
}) {
  const cats = useMemo(() => CATEGORIES.filter((c) => !only || c.slug === only), [only]);
  const counts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.slug, rows.filter((r) => r.category === c.slug).length])) as Record<CategorySlug, number>,
    [rows]
  );
  const labels = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.label])) as Record<CategorySlug, string>, []);
  const tabs = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        key: c.slug,
        label: c.short,
        count: counts[c.slug],
        href: only ? `/library/${c.slug}` : `#cat-${c.slug}`,
      })),
    [counts, only]
  );
  const [active, setActive] = useState<CategorySlug>(only ?? cats[0].slug);
  const hubRef = useRef<HTMLDivElement>(null);
  /** A tab or hotspot pick holds the spy until its scroll lands. */
  const hold = useRef<{ slug: CategorySlug; until: number } | null>(null);

  // The figure's column (and the hub's own scroll) need about 1160px; below
  // that the figure is never mounted, so a phone never downloads three.js.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1161px)");
    const read = () => setWide(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  // Scroll-spy: the last category whose heading has crossed a line a third
  // of the way down the visible list. Read once per frame, deterministic,
  // so a slow scroll never flickers between two systems.
  useEffect(() => {
    if (only) return;
    const hub = hubRef.current;
    if (!hub) return;
    const target: HTMLElement | Window = wide ? hub : window;
    let raf = 0;
    const read = () => {
      raf = 0;
      const h = hold.current;
      if (h) {
        if (performance.now() < h.until) return;
        hold.current = null;
      }
      const box = wide ? hub.getBoundingClientRect() : { top: 0, height: window.innerHeight };
      const line = box.top + box.height * 0.32;
      let cur = cats[0].slug;
      for (const c of cats) {
        const el = document.getElementById(`cat-${c.slug}`);
        if (el && el.getBoundingClientRect().top <= line) cur = c.slug;
      }
      // At the very end of the list the last system wins, however short it is.
      if (wide && hub.scrollTop + hub.clientHeight >= hub.scrollHeight - 2) cur = cats[cats.length - 1].slug;
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    target.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      target.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cats, only, wide]);

  // The list never depends on the active category, so a category change
  // during a scroll re-renders the bar and the figure, never 159 cards.
  const list = useMemo(
    () =>
      cats.map((c) => {
        const members = rows.filter((r) => r.category === c.slug);
        if (!members.length) return null;
        return (
          <section key={c.slug} id={`cat-${c.slug}`} className="lh-cat" aria-labelledby={`cat-h-${c.slug}`}>
            {/* A category page's H1 already names it; its list head would
                say the same thing twice, so there it is for screen readers only. */}
            <h2 id={`cat-h-${c.slug}`} className={only ? "sr-only" : undefined}>
              {c.label} <span>({members.length})</span>
            </h2>
            <div className="lh-cards">
              {members.map((r) => (
                <LibraryCard key={r.slug} slug={r.slug} name={r.name} status={r.status} href={`/library/${r.slug}`} className={r.className} pending={!r.hasGuide} />
              ))}
            </div>
          </section>
        );
      }),
    [cats, rows, only]
  );

  function pick(slug: CategorySlug) {
    if (only) {
      window.location.href = `/library/${slug}`;
      return;
    }
    const hub = hubRef.current;
    const el = document.getElementById(`cat-${slug}`);
    if (!hub || !el) return;
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    setActive(slug);
    hold.current = { slug, until: performance.now() + 1400 };
    const release = () => {
      if (hold.current?.slug === slug) hold.current = { slug, until: performance.now() + 60 };
    };
    if (wide) {
      // The list sits under the sticky bar inside the hub's own scroll.
      const bar = hub.querySelector<HTMLElement>(".lb")?.offsetHeight ?? 0;
      const top = el.getBoundingClientRect().top - hub.getBoundingClientRect().top + hub.scrollTop - bar - 8;
      hub.addEventListener("scrollend", release, { once: true });
      hub.scrollTo({ top: Math.max(0, top), behavior });
    } else {
      const bar = hub.querySelector<HTMLElement>(".lb")?.getBoundingClientRect().bottom ?? 0;
      window.addEventListener("scrollend", release, { once: true });
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - bar - 16, behavior });
    }
  }

  return (
    <div className="lhw" ref={hubRef}>
      <div className="lb">
        <GlassTabs label="Body systems" tabs={tabs} value={active} onPick={only ? undefined : (key) => pick(key as CategorySlug)} />
      </div>
      <div className="lh">
        <aside className="lh-intro">
          <div>
            <h1>{title}</h1>
            <p>{lead}</p>
          </div>
          <ul className="lh-key" aria-label="Status key">
            {STATUSES.map((s) => (
              <li key={s.key}>
                <i className={`lib-orb lib-orb--${STATUS_TONE[s.key]}`} aria-hidden="true" />
                {s.label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="lh-figure">{wide && <BodyFigure3D active={active} labels={labels} counts={counts} onPick={pick} />}</div>

        <div className="lh-list">{list}</div>
      </div>
    </div>
  );
}
