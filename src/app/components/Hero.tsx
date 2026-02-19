import { Star } from "lucide-react";
import AppStoreButton from "./AppStoreButton";
import FeatureTags from "./FeatureTags";
import PhoneMockup from "./PhoneMockup";

export default function Hero() {
    return (
        <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-12 px-6 py-12 md:flex-row md:items-start md:px-12 lg:gap-24">
            {/* Left Column: Text & Features */}
            <div className="flex max-w-xl flex-col items-center md:items-start text-center md:text-left pt-8">
                {/* Star Rating */}
                <div className="mb-6 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className="h-5 w-5 fill-[#FFC107] text-[#FFC107]"
                        />
                    ))}
                </div>

                {/* Heading */}
                <h2 className="mb-2 text-xl font-bold text-[#5C5C5C] md:text-2xl">
                    the world&apos;s trusted health
                </h2>
                <h1 className="mb-6 text-5xl font-black uppercase tracking-tighter md:text-6xl lg:text-7xl text-gradient-primary">
                    PEPTIDE LAYER
                </h1>

                {/* Description */}
                <p className="mb-10 text-base font-medium leading-relaxed text-[#181818] md:text-lg">
                    REGEN uses AI trained on clinical data to build your custom peptide
                    cycle, source premium vendors, and track your transformation in
                    real-time.
                </p>

                {/* Feature Tags */}
                <div className="mb-12 w-full">
                    <FeatureTags />
                </div>

                {/* App Store Button */}
                <div className="mb-12">
                    <AppStoreButton />
                </div>
            </div>

            {/* Right Column: Phone Mockup */}
            <div className="flex w-full justify-center md:justify-end">
                <PhoneMockup />
            </div>
        </div>
    );
}
