import Image from "next/image";
import Link from "next/link";

export default function AppStoreButton() {
    return (
        <Link
            href="#"
            className="inline-block transition-transform hover:scale-105 active:scale-95"
        >
            <Image
                src="/images/download.png"
                alt="Download on the App Store"
                width={160}
                height={54}
                className="h-[54px] w-auto"
                unoptimized
            />
        </Link>
    );
}
