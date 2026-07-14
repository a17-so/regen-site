// Plain-English medical disclaimer rendered above the first H2 on every health
// article (YMYL requirement). Links to the full /disclaimer page.
export function MedicalDisclaimer() {
  return (
    <aside
      className="post-disclaimer"
      role="note"
      style={{
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: 12,
        padding: "12px 16px",
        margin: "0 0 28px",
        fontSize: 14,
        lineHeight: 1.5,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <strong>Educational information, not medical advice.</strong> This article
      is general education about health and research, not a diagnosis,
      prescription, or treatment recommendation. Talk to a qualified clinician
      before acting on anything here. See our{" "}
      <a href="/disclaimer" style={{ color: "inherit", textDecoration: "underline" }}>
        full disclaimer
      </a>
      .
    </aside>
  );
}
