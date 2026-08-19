/**
 * Generated blog covers, v2.
 *
 * Drawn per post from what the post already knows about itself (see pickLayout)
 * instead of sourcing stock/AI/screenshot art. Brand elements are taken from
 * the Creative Building Figma file (Brand Logo + Colors, node 1313:350):
 * the REGEN mark is a ring of six dots -- five neutral, one accent at the
 * lower-left carrying the site's exact accent gradient (#1135EF -> #7289FF).
 *
 * That one lit dot is the whole visual system here:
 *  - the mark in the footer recolors its accent dot per category
 *    (Science blue / Protocols green / Biomarkers orange),
 *  - a huge ghosted ring bleeds off the right edge of every cover with only
 *    the accent dot faintly lit in the category color -- one marker that
 *    matters among many, which is the product's own story.
 */

export type CoverLayout = "stat" | "comparison" | "question" | "entity";

export type CoverVariant = "dark" | "light" | "vivid";

export type CoverInput = {
  title: string;
  category: string;
  /** A real, cited figure from the post. NEVER synthesise one for a health
   *  post -- without a genuine number the layout falls through to another. */
  stat?: { value: string; label: string };
  /** "light" (v3) matches the site's white-glass landing language; "dark"
   *  (v2) is the ink treatment; "vivid" (v4) is light mode with the site's
   *  own signature applied to the covers -- the category gradient IN the
   *  display text and on the edge, the way the landing page uses
   *  --accent-grad in text, edges, and the chart line. */
  variant?: CoverVariant;
};

/** Category accents. `grad` mirrors the brand accent gradient's structure
 *  (deep -> light, top -> bottom) in each category's hue. */
/** `hue` is the accent for dark ground, `ink` its white-ground counterpart
 *  (the light hues wash out on white -- same reason the site's eyebrows use
 *  the deep accent, not --accent-light). `grad` is the mark's accent dot in
 *  the brand gradient's structure and never changes between variants. */
const CATEGORY: Record<string, { hue: string; ink: string; grad: [string, string] }> = {
  Science:    { hue: "#7288ff", ink: "#1135ef", grad: ["#1135EF", "#7289FF"] },  // the original
  Protocols:  { hue: "#4EDCB4", ink: "#0E9F72", grad: ["#0E9F72", "#5EE0C0"] },
  Biomarkers: { hue: "#FFB057", ink: "#D97A17", grad: ["#D97A17", "#FFB057"] },
};
const FALLBACK = CATEGORY.Science;

/** Deterministic: the same post always draws the same cover. */
export function pickLayout(input: CoverInput): CoverLayout {
  if (input.stat?.value) return "stat";
  if (/\bvs\.?\b/i.test(input.title)) return "comparison";
  if (/^(how|what|why|when|is|does|can|should)\b|\?/i.test(input.title)) return "question";
  return "entity";
}

function comparisonSides(title: string): [string, string] {
  const m = title.match(/^(.*?)\s+vs\.?\s+([^:,(]+)/i);
  const clean = (s: string) => s.replace(/^[^:]*:\s*/, "").trim();
  return m ? [clean(m[1]), clean(m[2])] : [title, ""];
}

function subject(title: string): string {
  return title.split(/[:—]/)[0].trim();
}

/**
 * The REGEN mark as an SVG data URI -- exact geometry from Figma node
 * 1313:375 (six r=105 circles in a 688x745 box, accent lower-left).
 *
 * mode "footer": light dots (#999->#F1F1F1) + accent gradient in the
 * category color. mode "ghost": near-invisible white dots with only the
 * accent dot lit -- the background signature.
 */
function markDataUri(grad: [string, string], mode: "footer" | "ghost",
                     variant: CoverVariant = "dark"): string {
  const NEUTRAL: Array<[number, number]> = [
    [344, 105], [583, 249], [583, 506], [344, 640], [105, 249],
  ];
  let defs = "";
  let circles = "";
  // Neutral dot fills, both straight from the Figma file: light variant of
  // the mark for dark ground, dark variant (#0D0D0D -> #535353) for white.
  const stops: [string, string] =
    variant === "dark" ? ["#999999", "#F1F1F1"] : ["#0D0D0D", "#535353"];
  if (mode === "footer") {
    NEUTRAL.forEach(([cx, cy], i) => {
      defs +=
        `<linearGradient id="n${i}" x1="${cx}" y1="${cy - 105}" x2="${cx}" y2="${cy + 105}" gradientUnits="userSpaceOnUse">` +
        `<stop offset="0.1" stop-color="${stops[0]}"/><stop offset="0.9" stop-color="${stops[1]}"/></linearGradient>`;
      circles += `<circle cx="${cx}" cy="${cy}" r="105" fill="url(#n${i})"/>`;
    });
    defs +=
      `<linearGradient id="a" x1="105" y1="402" x2="105" y2="612" gradientUnits="userSpaceOnUse">` +
      `<stop stop-color="${grad[0]}"/><stop offset="1" stop-color="${grad[1]}"/></linearGradient>`;
    circles += `<circle cx="105" cy="507" r="105" fill="url(#a)"/>`;
  } else {
    // dark: white dots / light: ink dots / vivid: the ring itself takes the
    // category tint, and the lit dot turns almost solid pastel.
    const ghost: [string, string] =
      variant === "dark" ? ["#FFFFFF", "0.05"]
      : variant === "vivid" ? [grad[1], "0.11"]
      : ["#101114", "0.05"];
    NEUTRAL.forEach(([cx, cy]) => {
      circles += `<circle cx="${cx}" cy="${cy}" r="105" fill="${ghost[0]}" fill-opacity="${ghost[1]}"/>`;
    });
    circles += `<circle cx="105" cy="507" r="105" fill="${grad[1]}" fill-opacity="${variant === "dark" ? "0.22" : variant === "vivid" ? "0.34" : "0.28"}"/>`;
  }
  const svg =
    `<svg width="688" height="745" viewBox="0 0 688 745" fill="none" xmlns="http://www.w3.org/2000/svg">` +
    `<defs>${defs}</defs>${circles}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const INK = "#101114";

export function CoverCard({ input }: { input: CoverInput }) {
  const layout = pickLayout(input);
  const cat = CATEGORY[input.category] ?? FALLBACK;
  const variant: CoverVariant = input.variant ?? "dark";
  const light = variant === "light" || variant === "vivid";
  const vivid = variant === "vivid";
  // The site's signature, per category: --accent-grad's structure in the
  // category hues, usable on text via backgroundClip.
  const gradCss = `linear-gradient(180deg, ${cat.grad[0]} 0%, ${cat.grad[1]} 100%)`;
  const gradText = {
    backgroundImage: gradCss,
    backgroundClip: "text",
    color: "transparent",
  } as const;
  // Accent for text/chips: light hue on ink ground, deep ink shade on white.
  const hue = light ? cat.ink : cat.hue;
  // Ground + washes. Light mode speaks the landing page's language: the
  // page's own white (#FAFAFA -> white, like --gray50 on --bg) with a soft
  // top-right category bloom at the site's wash strength
  // (cf. globals.css: rgba(114,136,255,0.18) transparent 70%) and text in
  // --ink. Dark mode is v2, unchanged.
  const ground = vivid
    ? {
        background: "#FDFDFC",
        backgroundImage: `radial-gradient(95% 95% at 90% 6%, ${cat.grad[1]}3d 0%, ${cat.grad[1]}00 68%), radial-gradient(70% 60% at 4% 102%, ${cat.grad[0]}1f 0%, ${cat.grad[0]}00 60%)`,
        color: "#1a1a1a",
      }
    : light
    ? {
        background: "#FBFBFA",
        backgroundImage: `radial-gradient(90% 90% at 88% 8%, ${cat.grad[1]}2e 0%, ${cat.grad[1]}00 70%), radial-gradient(80% 70% at 0% 100%, ${cat.grad[0]}14 0%, ${cat.grad[0]}00 62%)`,
        color: "#1a1a1a",
      }
    : {
        background: INK,
        backgroundImage: `radial-gradient(120% 90% at 100% 0%, ${cat.hue}30 0%, ${cat.hue}00 55%), radial-gradient(90% 70% at 0% 100%, ${cat.grad[0]}42 0%, ${cat.grad[0]}00 60%)`,
        color: "#ffffff",
      };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        fontFamily: "NeueMontreal",
        ...ground,
      }}
    >
      {/* vivid only: the category gradient on the top edge -- the site runs
          --accent-grad along edges; the cover carries its category's. */}
      {vivid && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 12,
            backgroundImage: `linear-gradient(90deg, ${cat.grad[0]} 0%, ${cat.grad[1]} 100%)`,
            display: "flex",
          }}
        />
      )}

      {/* The signature: the brand ring, ghosted, one lit dot. In vivid the
          whole ring takes the category tint and sits a touch larger. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori tree, not the DOM */}
      <img
        alt=""
        src={markDataUri(cat.grad, "ghost", variant)}
        width={vivid ? 396 : 356}
        height={vivid ? 429 : 385}
        style={{ position: "absolute", top: vivid ? 222 : 236, right: vivid ? 52 : 96 }}
      />

      {vivid ? (
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: 12,
            padding: "12px 24px",
            borderRadius: 999,
            background: `${cat.grad[1]}1f`,
            border: `1.5px solid ${cat.grad[1]}30`,
          }}
        >
          <div style={{ display: "flex", width: 11, height: 11, borderRadius: 11, backgroundImage: `linear-gradient(180deg, ${cat.grad[0]}, ${cat.grad[1]})` }} />
          <div style={{ display: "flex", fontFamily: "Plex", fontSize: 24, letterSpacing: 2.5, textTransform: "uppercase", color: cat.ink }}>
            {input.category}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 12, height: 12, borderRadius: 12, background: hue }} />
          <div
            style={{
              display: "flex",
              fontFamily: "Plex",
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: hue,
            }}
          >
            {input.category}
          </div>
        </div>
      )}

      {layout === "stat" && (
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ display: "flex", fontSize: 205, lineHeight: 1, letterSpacing: -6, ...(vivid ? gradText : {}) }}>
            {input.stat!.value}
          </div>
          {(() => {
            const [main, source] = input.stat!.label.split(/\s+—\s+/, 2);
            return (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 39, lineHeight: 1.28, opacity: light ? 0.72 : 0.87, marginTop: 20, color: light ? "#3b3b3b" : "#ffffff" }}>
                  {main}
                </div>
                {source && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22 }}>
                    <div style={{ display: "flex", width: 34, height: 2, background: hue }} />
                    <div style={{ display: "flex", fontFamily: "Plex", fontSize: 24, letterSpacing: 2.5, textTransform: "uppercase", color: hue }}>
                      {source}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {layout === "comparison" && (
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div style={{ display: "flex", fontSize: 94, lineHeight: 1.06, letterSpacing: -2 }}>
            {comparisonSides(input.title)[0]}
          </div>
          {/* The divider IS the brand: a hairline carrying a small VS chip,
              knocked out of the line, category-tinted. Both names hang from
              the same left edge -- the things compared read as equals. */}
          <div style={{ display: "flex", alignItems: "center", margin: "26px 0" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Plex",
                fontSize: 24,
                letterSpacing: 4,
                color: vivid ? "#ffffff" : hue,
                borderRadius: 999,
                ...(vivid
                  ? { padding: "10.5px 23.5px",
                      backgroundImage: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }
                  : { padding: "9px 22px",
                      border: `1.5px solid ${hue}${light ? "47" : "59"}`,
                      background: light ? "#ffffff" : "#15161a" }),
              }}
            >
              VS
            </div>
            <div style={{ display: "flex", flexGrow: 1, height: 1.5, background: light ? "#1a1a1a1c" : "#ffffff1f", marginLeft: 26 }} />
          </div>
          <div style={{ display: "flex", fontSize: 94, lineHeight: 1.06, letterSpacing: -2 }}>
            {comparisonSides(input.title)[1]}
          </div>
        </div>
      )}

      {(layout === "question" || layout === "entity") && (
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          {vivid && layout === "question" ? (
            (() => {
              // The payload of the question -- its last few words -- carries
              // the gradient; the set-up stays ink. Deterministic split.
              const words = input.title.split(/\s+/);
              const n = words.length >= 6 ? 3 : 2;
              const head = words.slice(0, -n).join(" ");
              const tail = words.slice(-n).join(" ");
              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", fontSize: 76, lineHeight: 1.1, letterSpacing: -2 }}>{head}</div>
                  <div style={{ display: "flex", fontSize: 76, lineHeight: 1.1, letterSpacing: -2, ...gradText }}>{tail}</div>
                </div>
              );
            })()
          ) : (
            <div style={{ display: "flex", fontSize: layout === "question" ? 76 : 96, lineHeight: 1.1, letterSpacing: -2, ...(vivid && layout === "entity" ? gradText : {}) }}>
              {layout === "question" ? input.title : subject(input.title)}
            </div>
          )}
          {layout === "entity" && (
            <div style={{ display: "flex", fontSize: 36, opacity: light ? 0.66 : 0.8, marginTop: 20, color: light ? "#3b3b3b" : "#ffffff" }}>
              {input.title.split(/[:—]/).slice(1).join(":").trim()}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* The real mark, category accent. 688x745 scaled to 38px tall. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori tree, not the DOM */}
          <img alt="" src={markDataUri(cat.grad, "footer", variant)} width={35} height={38} style={{ display: "flex" }} />
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 1 }}>REGEN</div>
        </div>
        <div style={{ display: "flex", fontFamily: "Plex", fontSize: 24, opacity: 0.55, color: light ? "#3b3b3b" : "#ffffff" }}>
          regenhealth.app
        </div>
      </div>
    </div>
  );
}
