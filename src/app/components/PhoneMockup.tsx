import Image from "next/image";

export default function PhoneMockup() {
    return (
        <div className="relative">
            {/* Phone Frame */}
            <div className="relative z-10 mx-auto w-[280px] md:w-[500px] pointer-events-none select-none">
                <Image
                    src="/images/iphone.png"
                    alt="REGEN App Interface"
                    width={600}
                    height={1223}
                    className="h-auto w-full drop-shadow-2xl"
                    priority
                    unoptimized
                />
            </div>
        </div>
    );
}
