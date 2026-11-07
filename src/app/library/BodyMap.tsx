import { CATEGORIES, categoryHref, type CategorySlug } from "../lib/guides";

/**
 * "Every peptide, mapped to the body": a silhouette with one hotspot per
 * body system. The reference draws this as a WebGL model; ours is a flat SVG
 * in the system's own ink, which prints, scales, and renders without a GPU.
 * Each dot links to its category and carries the label as a title, so the
 * colour never stands alone.
 */
const SPOTS: Record<CategorySlug, { x: number; y: number }> = {
  brain: { x: 100, y: 38 },
  sexual: { x: 100, y: 262 },
  heart: { x: 112, y: 128 },
  immune: { x: 86, y: 150 },
  hormones: { x: 100, y: 96 },
  digestive: { x: 100, y: 186 },
  bones: { x: 134, y: 215 },
  skin: { x: 60, y: 206 },
};

export default function BodyMap({ active }: { active?: CategorySlug }) {
  return (
    <figure className="gd-body" aria-label="Body map of peptide categories">
      <svg viewBox="0 0 200 440" role="img" aria-hidden="true">
        {/* Silhouette: head, neck, torso, arms, legs. One closed path so the
            fill reads as a single figure. */}
        <path
          className="gd-body-fig"
          d="M100 10c-14 0-24 11-24 26 0 12 6 22 14 27v9c-20 4-37 12-44 26-7 15-9 40-10 72l-1 46c0 6 5 9 9 9 4 0 8-3 8-8l5-80 6 35v86l-8 150c0 5 4 8 9 8s9-3 9-8l14-120 4-4 4 4 14 120c0 5 4 8 9 8s9-3 9-8l-8-150v-86l6-35 5 80c0 5 4 8 8 8 4 0 9-3 9-9l-1-46c-1-32-3-57-10-72-7-14-24-22-44-26v-9c8-5 14-15 14-27 0-15-10-26-24-26z"
        />
        {CATEGORIES.map((c) => {
          const s = SPOTS[c.slug];
          const on = active === c.slug;
          return (
            <a key={c.slug} href={categoryHref(c.slug)} className={`gd-body-spot${on ? " is-active" : ""}`}>
              <title>{c.label}</title>
              <circle cx={s.x} cy={s.y} r={on ? 9 : 7} className="gd-body-halo" />
              <circle cx={s.x} cy={s.y} r={3.2} className="gd-body-dot" />
            </a>
          );
        })}
      </svg>
    </figure>
  );
}
