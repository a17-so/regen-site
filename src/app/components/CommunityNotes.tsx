import { getRecentNotes } from "../lib/notes";

/**
 * Community notes teaser, a live feed of what people are logging.
 *
 * ⚠️ Renders nothing today, on purpose. There is no notes collection in the
 * app's Firestore yet (see lib/notes.ts), so the only way to fill this
 * section right now would be to invent the notes, fabricated community
 * activity on a health product, which is the one thing this section must
 * never be. It stays wired and dormant until the data is real.
 */
export default async function CommunityNotes() {
  const notes = await getRecentNotes();
  if (notes.length === 0) return null;

  return (
    <section className="notes" id="notes">
      <div className="notes-inner">
        <div className="section-head">
          <span className="section-eyebrow">
            Community
          </span>
          <h2 className="section-title">
            What people are{" "}
            <span className="muted-phrase">actually logging.</span>
          </h2>
        </div>

        <div className="notes-marquee-mask">
          <div className="notes-marquee">
            {[...notes, ...notes].map((n, i) => (
              <article className="note-card" key={`${n.id}-${i}`}>
                <span className="note-compound">{n.compound}</span>
                <p>{n.body}</p>
                <span className="note-meta">{n.relativeTime}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
