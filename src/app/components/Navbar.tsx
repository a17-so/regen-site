import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex w-full items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex items-center">
                <Image
                    src="/logo.png"
                    alt="Regen Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                    priority
                />
            </div>
            <Link
                href="#"
                className="rounded-full bg-[#181818] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
                get the app →
            </Link>
        </nav>
    );
}
