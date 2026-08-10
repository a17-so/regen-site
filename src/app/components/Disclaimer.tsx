// Plain-English medical disclaimer rendered above the first H2 on every health
// article (YMYL requirement). Links to the full /disclaimer page.
//
// Styling lives in globals.css under `.post-disclaimer`. It previously carried
// inline `rgba(255,255,255,…)` borders and background from an older dark
// design, which rendered invisible on the light page, a legally load-bearing
// notice that nobody could see.
export function MedicalDisclaimer() {
  return (
    <aside className="post-disclaimer" role="note">
      <strong>Educational information, not medical advice.</strong> This article
      is general education about health and research, not a diagnosis,
      prescription, or treatment recommendation. Talk to a qualified clinician
      before acting on anything here. See our <a href="/disclaimer">full disclaimer</a>.
    </aside>
  );
}
