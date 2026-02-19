import {
    Scale,
    Sparkles,
    Dumbbell,
    Moon,
    Brain,
    Zap,
    Scissors,
    Bone,
} from "lucide-react";

const features = [
    { icon: Scale, label: "Weight Loss", color: "bg-[#E0F2F1]" },
    { icon: Sparkles, label: "Skin Health", color: "bg-[#FFF3E0]" },
    { icon: Dumbbell, label: "Muscle & Height", color: "bg-[#E8F5E9]" },
    { icon: Moon, label: "Sleep Qual", color: "bg-[#EDE7F6]" },
    { icon: Brain, label: "Focus and Memory", color: "bg-[#FCE4EC]" },
    { icon: Zap, label: "Recovery", color: "bg-[#F9FBE7]" },
    { icon: Scissors, label: "Hair Health", color: "bg-[#FFF8E1]" },
    { icon: Bone, label: "Joint Health", color: "bg-[#F3E5F5]" },
    
];

export default function FeatureTags() {
    const row1 = features.slice(0, 3);
    const row2 = features.slice(3, 6);
    const row3 = features.slice(6, 8);

    const renderTag = (feature: any, index: number) => (
        <div
            key={index}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-black ${feature.color} shadow-sm border border-black/5 font-sans tracking-[-1px]`}
        >
            <feature.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>{feature.label}</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-3 items-center md:items-start">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {row1.map((f, i) => renderTag(f, i))}
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {row2.map((f, i) => renderTag(f, i))}
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {row3.map((f, i) => renderTag(f, i))}
            </div>
        </div>
    );
}
