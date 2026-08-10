import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { JsonLd } from "./components/JsonLd";
import GlassDefs from "./components/GlassDefs";

const SITE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(
  /\/$/,
  ""
);

// Same two faces the iOS app registers in FontRegistrar. Medium carries body
// and UI copy, Bold carries every heading, the app ships no other weights, so
// the web must not invent one.
const neueMontreal = localFont({
  src: [
    { path: "../../public/fonts/NeueMontreal-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/NeueMontreal-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-nm",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

// Eyebrows only, uppercase + kerned, mirrors `.ibmPlexSans` in
// Typography.swift. This is the app's own IBMPlexSans-Medium.ttf rather than
// the Google-hosted family, so the web and the app render the identical file
// and the site carries no third-party font request.
//
// Note it is Plex SANS. The app ships no monospace face at all, the only
// fonts FontRegistrar registers are the two Neue Montreals and this.
const ibmPlexSans = localFont({
  src: [{ path: "../../public/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" }],
  variable: "--font-plex",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const TITLE = "REGEN · Run peptides with a clearer plan";
const DESCRIPTION =
  "Track every vial, dose, and biomarker in one place, and get a second opinion with sources before you draw. Built for people who run their own protocols.";

export const metadata: Metadata = {
  metadataBase: new URL(
    (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(/\/$/, "")
  ),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "REGEN Health",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "REGEN",
      url: SITE_URL,
      logo: `${SITE_URL}/og.png`,
    },
    {
      "@type": "SoftwareApplication",
      name: "REGEN",
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS, Android",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: [
        {
          "@type": "Offer",
          price: "14.00",
          priceCurrency: "USD",
          description: "REGEN Pro (monthly)",
        },
        {
          "@type": "Offer",
          price: "120.00",
          priceCurrency: "USD",
          description: "REGEN Pro (yearly)",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${neueMontreal.variable} ${ibmPlexSans.variable}`}
    >
      <body>
        <GlassDefs />
        <JsonLd data={ORGANIZATION_LD} />
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
