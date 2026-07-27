import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { JsonLd } from "./components/JsonLd";

const SITE_URL = (process.env.SITE_URL ?? "https://www.regenhealth.app").replace(
  /\/$/,
  ""
);

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const TITLE = "REGEN — The world's trusted peptide health layer";
const DESCRIPTION =
  "REGEN tracks every vial, every dose, every biomarker — and gives you an AI second opinion before you draw. Built for the people who run their own protocols.";

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
      className={`${hankenGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <JsonLd data={ORGANIZATION_LD} />
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
