import Image from "next/image";
import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="flex w-full items-center justify-between px-6 py-10 md:px-12 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
                <Image
                    src="/logo.png"
                    alt="REGEN Logo"
                    width={40}
                    height={40}
                    className="h-10 w-auto object-contain"
                    priority
                />
                <span className="font-heading text-2xl font-bold text-[#181818]">REGEN</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 md:gap-6">
                <Link href="https://www.instagram.com/regenhealth.app" target="_blank" className="text-[#181818] hover:opacity-70 transition-opacity">
                    <Instagram size={20} />
                </Link>
                <Link href="https://tiktok.com/@regenapp" target="_blank" className="text-[#181818] hover:opacity-70 transition-opacity">
                    {/* TikTok Icon SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                </Link>
                <Link href="https://x.com/regenhealth_app" target="_blank" className="text-[#181818] hover:opacity-70 transition-opacity">
                    {/* X (formerly Twitter) Icon SVG */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </Link>
                <Link href="https://www.threads.com/@regenhealth.app" target="_blank" className="text-[#181818] hover:opacity-70 transition-opacity">
                    {/* Threads Icon SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-threads">
                        <path d="M22.094 10.505a9.049 9.049 0 1 0-8.914 11.52A8.1 8.1 0 0 0 16.8 21.1V21h-.002" />
                        <path d="M19.1 10.84a5.05 5.05 0 0 1-9.98-1.55c0-2.82 2.21-5.12 4.95-5.12A5.02 5.02 0 0 1 19.1 8.88V9" />
                        <path d="M8.83 14.34a3.17 3.17 0 0 0 .72-.19" />
                    </svg>
                </Link>
            </div>

            <Link
                href="https://apps.apple.com/app/apple-store/id6756548399?pt=127832534&ct=landing-page&mt=8"
                className="hidden md:inline-flex rounded-full bg-gradient-to-r from-[#3A3A3A] via-[#181818] to-[#5C5C5C] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 font-heading"
            >
                get the app →
            </Link>
        </nav>
    );
}
