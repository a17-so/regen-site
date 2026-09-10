// Author registry for E-E-A-T: named authors with credentials + external
// profiles, surfaced on /authors/[slug] and in per-post Person JSON-LD.
// `sameAs` and full bios are content the team fills in with REAL profile URLs;
// the structure is here so the SEO signals exist from post #1.

export interface AuthorProfile {
  slug: string;
  name: string;
  role: string;
  credential?: string; // e.g. "MD", "Founder"
  bio: string;
  sameAs: string[]; // external profile URLs (LinkedIn, publications, etc.)
  initials: string;
}

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^dr\.?\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// One real byline under the REGEN Editorial masthead. Posts are educational
// reporting -- cited findings, no reader-directed protocols -- so the byline is
// a real person writing for REGEN Editorial, not a roster of personas.
const AUTHORS: AuthorProfile[] = [
  {
    slug: "advaith-akella",
    name: "Advaith Akella",
    role: "REGEN Editorial",
    // Just "CTO" -- the byline already renders the role beside it, so
    // "CTO, REGEN" printed as "CTO, REGEN . REGEN Editorial".
    // Accurate title, and deliberately not dressed as a medical one.
    // NOT a medical credential, and deliberately not dressed as one: this is
    // YMYL content, where an overstated credential is worse than a modest one.
    credential: "CTO",
    // Berkeley belongs here rather than in `credential`, and says "studying"
    // explicitly. A university placed beside a byline on health content, with
    // no student qualifier, reads as institutional endorsement -- which would
    // be untrue. The authority claim rests on the citations, which is what the
    // pipeline actually enforces.
    bio: "Advaith Akella is CTO of REGEN and studies computer science at UC Berkeley. He writes REGEN's research coverage on peptides and biomarkers: what the published trials measured, how large the effect was, and where the evidence stops. Every quantitative claim is cited to a primary source, and nothing here is a protocol or a recommendation.",
    sameAs: [
      "https://www.linkedin.com/in/advaith-akella-128a462ab/",
      "https://x.com/advaithakella",
    ],
    initials: "AA",
  },
];

const BY_SLUG = new Map(AUTHORS.map((a) => [a.slug, a]));
const BY_NAME = new Map(AUTHORS.map((a) => [a.name.toLowerCase(), a]));

export function authorBySlug(slug: string): AuthorProfile | undefined {
  return BY_SLUG.get(slug);
}

export function authorForName(name: string): AuthorProfile {
  const hit = BY_NAME.get((name || "").toLowerCase());
  if (hit) return hit;
  const initials = (name || "REGEN")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return { slug: slugifyName(name || "regen"), name, role: "REGEN", bio: "", sameAs: [], initials };
}

export function allAuthors(): AuthorProfile[] {
  return AUTHORS;
}
