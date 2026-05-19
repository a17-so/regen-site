import { Star } from "./icons";

interface Review {
  name: string;
  handle: string;
  initials: string;
  quote: string;
}

const REVIEWS_A: Review[] = [
  { name: "Marcus T.", handle: "@mtran.proto", initials: "MT", quote: "Finally an app that knows what 'reconstituted at 2mL' means without me explaining peptides to it. The dose calc alone is worth the install." },
  { name: "Dr. Lena K.", handle: "Longevity coach", initials: "LK", quote: "I've moved every one of my clients onto REGEN. The biomarker trend view is the cleanest I've seen — clearer than my EMR." },
  { name: "Jordan A.", handle: "@retatrutide_log", initials: "JA", quote: "Switched from a Google Sheet I'd been maintaining for 14 months. Migrated in one evening. The AI flagged two interactions I'd missed." },
  { name: "Sasha R.", handle: "GLP-1 user, 9 months", initials: "SR", quote: "The meal scan is the secret weapon. I stopped guessing protein and my titration finally smoothed out." },
  { name: "Ben H.", handle: "@ben.h", initials: "BH", quote: "Reconstitution math used to make me anxious. REGEN turned it into a two-tap thing. Anxiety gone." },
];

const REVIEWS_B: Review[] = [
  { name: "Priya M.", handle: "@priya.lifts", initials: "PM", quote: "Inventory + expiry alerts saved me from injecting an expired BPC vial last week. Worth every penny just for that." },
  { name: "Tom Z.", handle: "Coach, San Diego", initials: "TZ", quote: "I run 30+ clients. The shared protocol view in REGEN replaced my entire ops stack. Notion, Sheets, all gone." },
  { name: "Aisha O.", handle: "@aisha.optimize", initials: "AO", quote: "The timeline is the calmest dosing UI I've ever used. No red badges screaming at me. Just 'this is what's next.'" },
  { name: "Ravi P.", handle: "@ravi.peptides", initials: "RP", quote: "REGEN AI quoted me a half-life paper from 2019, with citation. I checked. It was real. That sold me." },
  { name: "Claire D.", handle: "Anti-aging clinician", initials: "CD", quote: "The biomarker module references my labs against age-adjusted ranges. Not population averages. Huge for my practice." },
];

function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="review-card">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} />
        ))}
      </div>
      <p className="quote">&ldquo;{r.quote}&rdquo;</p>
      <div className="meta-row">
        <div className="avatar">{r.initials}</div>
        <div className="who">
          <div className="name">{r.name}</div>
          <div className="handle">{r.handle}</div>
        </div>
      </div>
    </div>
  );
}

function Marquee({ items, reverse }: { items: Review[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee ${reverse ? "reverse" : ""}`}>
      <div className="marquee-track">
        {doubled.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="reviews">
      <div className="reviews-header">
        <h2 className="section-title">
          Loved by the people who
          <br />
          <span className="muted-phrase">read their own bloodwork.</span>
        </h2>
        <div className="review-stars">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} />
            ))}
          </div>
          <div>
            <div className="score">4.9 / 5</div>
            <div className="meta">From 2,400+ App Store reviews</div>
          </div>
        </div>
      </div>
      <Marquee items={REVIEWS_A} />
      <Marquee items={REVIEWS_B} reverse />
    </section>
  );
}
