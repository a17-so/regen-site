import { buildAppStoreUrl } from "../../lib/appStoreUrl";
import { appStoreQr } from "../../lib/qr";
import GetAppButton from "../../components/GetAppButton";

/**
 * In-article CTA — a tinted card with a device shot bleeding off its bottom
 * edge and one App Store button beside it. Posts drop `<PostCta variant />`
 * between sections; the variant picks the screenshot and copy, so the pitch
 * matches what the surrounding section is talking about. Server component:
 * it builds its own store URL and QR, so posts thread no props.
 */

const VARIANTS = {
  protocol: {
    img: "/screens/screen-home.png",
    alt: "REGEN's home screen counting down to the next dose, nutrition totals beneath",
    title: "Run the protocol, not the spreadsheet",
    body: "Doses, timing windows, water and meals land on one timeline that already knows each compound's constraints.",
    location: "post_cta_protocol",
  },
  labs: {
    img: "/screens/screen-biomarker.png",
    alt: "REGEN's data screen highlighting a Vitamin D rise against the last panel",
    title: "See what your numbers are actually doing",
    body: "Bloodwork, Apple Health and manual entries on one timeline. REGEN flags what moved, what's trending, and what's actually out of range.",
    location: "post_cta_labs",
  },
  ai: {
    img: "/screens/screen-ai.png",
    alt: "REGEN AI answering a protocol question with citations shown inline",
    title: "Get a second opinion before you draw",
    body: "Ask about a compound, a reading, or a stack. Answers come from your own logs and cited research, so you can check the claim.",
    location: "post_cta_ai",
  },
  vials: {
    img: "/screens/screen-inventory.png",
    alt: "REGEN's inventory list, each compound with its goal and daily dose",
    title: "Every vial, counted down",
    body: "Reconstitution dates, milligrams remaining, days to expiry, decremented as you log. The count is what's actually left.",
    location: "post_cta_vials",
  },
} as const;

export type PostCtaVariant = keyof typeof VARIANTS;

export default async function PostCta({
  variant = "ai",
}: {
  variant?: PostCtaVariant;
}) {
  const v = VARIANTS[variant];
  const appStoreUrl = buildAppStoreUrl();
  const qr = await appStoreQr(appStoreUrl);
  return (
    <aside className="post-cta" aria-label="Get the REGEN app">
      <div className="post-cta-copy">
        <p className="post-cta-title">{v.title}</p>
        <p className="post-cta-body">{v.body}</p>
        <GetAppButton
          appStoreUrl={appStoreUrl}
          qr={qr}
          location={v.location}
          size="sm"
          align="center"
          drop="down"
        />
      </div>
      <div className="post-cta-shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v.img} alt={v.alt} loading="lazy" />
      </div>
    </aside>
  );
}
