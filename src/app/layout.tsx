import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

// Fonts are located in /public/fonts, relative to /src/app/layout.tsx is ../../public/fonts
const sohne = localFont({
  src: [
    {
      path: "../../public/fonts/Sohne-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sohne-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sohne-Heavy.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-sohne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "REGEN: build your cycle",
  description: "REGEN uses AI trained on clinical data to build your custom peptide cycle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${sohne.variable} antialiased bg-white text-black font-sans tracking-[-1px]`}
      >
        {children}
      </body>
    </html>
  );
}
