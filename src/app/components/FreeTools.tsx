import Reveal from "./Reveal";

/** Small line-art marks, in the spirit of the app's meal-card icons. */
const ICONS: Record<string, React.ReactElement> = {
  "Reconstitution calculator": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 3h6M10 3v5.2L5.6 17.4A2 2 0 0 0 7.4 20h9.2a2 2 0 0 0 1.8-2.6L14 8.2V3" />
      <path d="M7.4 14h9.2" />
    </svg>
  ),
  "Dose converter": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8h13M14 5l3 3-3 3" />
      <path d="M20 16H7M10 13l-3 3 3 3" />
    </svg>
  ),
  "Half-life & steady state": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17c3.5 0 3.5-10 7-10s3.5 10 7 10 3.5-4 4-4" />
    </svg>
  ),
  "Vial duration": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  ),
};

const Chevron = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3.5 10.5 8 6 12.5" />
  </svg>
);

/**
 * The "start without downloading anything" strip.
 *
 * Everything is listed as coming for now, so the strip reads as a roadmap
 * rather than a set of dead links. A tool gets `href` the moment its page
 * is ready to show; until then it renders unclickable and says so.
 */
const TOOLS: { name: string; desc: string; href?: string }[] = [
  {
    name: "Reconstitution calculator",
    desc: "Vial strength plus BAC water in, units-per-click out.",
  },
  {
    name: "Dose converter",
    desc: "mg, mcg, IU, and units, without the mental arithmetic.",
  },
  {
    name: "Half-life & steady state",
    desc: "When a compound plateaus, and when it clears.",
  },
  {
    name: "Vial duration",
    desc: "How long a vial lasts at your dose and frequency.",
  },
];

export default function FreeTools() {
  return (
    <section className="tools" id="tools">
      <div className="tools-inner">
        <div className="section-head">
          <h2 className="section-title">
            Start without{" "}
            <span className="accent-phrase">downloading anything.</span>
          </h2>
          <p className="section-lede">
            The math that trips people up runs in the browser, free, no account.
            The app is where it gets remembered.
          </p>
        </div>

        <div className="tools-grid">
          {TOOLS.map((t, i) => {
            const inner = (
              <>
                <span className="tools-icon" aria-hidden="true">
                  {ICONS[t.name]}
                </span>
                <div className="tools-body">
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                </div>
                {t.href ? (
                  <span className="tools-go" aria-hidden="true">
                    <Chevron />
                  </span>
                ) : (
                  <span className="tools-soon">Soon</span>
                )}
              </>
            );

            return (
              <Reveal key={t.name} delay={i * 60}>
                {t.href ? (
                  <a className="tools-card" href={t.href}>
                    {inner}
                  </a>
                ) : (
                  <div className="tools-card is-soon" aria-disabled="true">
                    {inner}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
