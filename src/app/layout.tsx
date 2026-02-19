import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

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
});

export const metadata: Metadata = {
  title: "Regen - The World's Trusted Health Peptide Layer",
  description: "Regen uses AI trained on clinical data to build your custom peptide cycle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${sohne.variable} antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}
