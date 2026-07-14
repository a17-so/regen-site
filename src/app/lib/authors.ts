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
    bio: "Writes for REGEN Editorial on biomarkers, peptides, and what the research actually shows -- findings and citations, not protocols.",
    sameAs: [],
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
