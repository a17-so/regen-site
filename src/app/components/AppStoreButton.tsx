import Image from "next/image";

export default function AppStoreButton() {
  return (
    <a
      href="https://apps.apple.com/us/app/hardmaxx-transform-now/id6756548399"
      className="inline-block transition-transform hover:scale-105 active:scale-95"
      rel="nofollow"
    >
      <Image
        src="/images/download.png"
        alt="Download on the App Store"
        width={200}
        height={66}
        className="h-[60px] w-auto rounded-[18px]"
        unoptimized
        priority
      />
    </a>
  );
}