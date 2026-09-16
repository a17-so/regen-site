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
//
// When the person changes (2026-09-16: Advaith Akella -> Ekam Mehat), change
// THIS entry, the `author:` line in each post under blog/[slug]/posts/, and
// add a redirect from the old /authors/<slug> in next.config.ts. Every other
// page reaches the author through PRIMARY_AUTHOR below, so nothing else moves.
const AUTHORS: AuthorProfile[] = [
  {
    slug: "ekam-mehat",
    name: "Ekam Mehat",
    role: "REGEN Editorial",
    // Just "CTO" -- the byline renders the role beside it, so anything longer
    // repeats "REGEN". NOT a medical credential, and deliberately not dressed
    // as one: this is YMYL content, where an overstated credential is worse
    // than a modest one.
    credential: "CTO",
    // The university belongs here rather than in `credential`, and says
    // "studies" explicitly. A university placed beside a byline on health
    // content, with no student qualifier, reads as institutional endorsement
    // -- which would be untrue. The authority claim rests on the citations,
    // which is what the pipeline actually enforces.
    bio: "Ekam Mehat is CTO of REGEN and studies computer science at the University of Washington. Ekam writes REGEN's research coverage on peptides and biomarkers: what the published trials measured, how large the effect was, and where the evidence stops. Every quantitative claim is cited to a primary source, and nothing here is a protocol or a recommendation.",
    sameAs: [
      "https://www.linkedin.com/in/ekam-mehat-4126153b1/",
      "https://x.com/EkamMehat",
    ],
    initials: "EM",
  },
];

// The byline every organisation-authored page (library, tools) links to as
// "REGEN Editorial". One place to change when the person does.
export const PRIMARY_AUTHOR: AuthorProfile = AUTHORS[0];

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
