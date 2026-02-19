import Image from "next/image";
import Link from "next/link";

export default function AppStoreButton() {
    return (
        <Link
            href="https://apps.apple.com/us/app/hardmaxx-transform-now/id6756548399"
            className="inline-block transition-transform hover:scale-105 active:scale-95"
        >
            <Image
                src="/images/download.png"
                alt="Download on the App Store"
                width={200}
                height={66}
                className="h-[60px] w-auto rounded-[18px]"
                unoptimized
            />
        </Link>
    );
}
