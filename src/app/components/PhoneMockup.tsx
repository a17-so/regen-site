import Image from "next/image";

export default function PhoneMockup() {
    return (
        <div className="relative">
            {/* Phone Frame */}
            <div className="relative z-10 mx-auto w-[280px] md:w-[320px]">
                <Image
                    src="/images/iphone.png"
                    alt="Regen App Interface"
                    width={390}
                    height={844}
                    className="h-auto w-full drop-shadow-2xl"
                    priority
                    unoptimized
                />
            </div>
        </div>
    );
}
