import AppStoreButton from "./AppStoreButton";
import FeatureTags from "./FeatureTags";
import PhoneMockup from "./PhoneMockup";

export default function Hero() {
    return (
        <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-12 px-6 pt-20 pb-12 md:flex-row md:items-start md:px-12 lg:gap-24">
            {/* Left Column: Text & Features */}
            <div className="flex max-w-3xl flex-col items-center md:items-start text-center md:text-left pt-8">
                {/* Star Rating */}
                <div className="mb-6 text-2xl tracking-widest">
                    ⭐⭐⭐⭐⭐
                </div>

                {/* Heading */}
                <h2 className="mb-0 text-2xl md:text-3xl font-bold font-heading text-gradient-primary pb-1">
                    the world&apos;s trusted health
                </h2>
                <h1 className="mb-6 text-4xl font-black uppercase tracking-tighter md:text-6xl lg:text-7xl text-gradient-primary font-heading pb-2 pr-2 whitespace-nowrap">
                    PEPTIDE LAYER
                </h1>

                {/* Description */}
                <p className="mb-10 text-base font-bold leading-tight text-[#181818] md:text-lg font-sans max-w-2xl tracking-[-1px]">
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
