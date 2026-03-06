export default function AppStoreButton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <a
        href="https://apps.apple.com/app/apple-store/id6756548399?pt=127832534&ct=landing-page&mt=8"
        rel="nofollow"
        className="flex items-center gap-3 bg-gradient-to-r from-[#3A3A3A] via-[#181818] to-[#5C5C5C] text-white px-8 py-4 rounded-full transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_24px_rgba(0,0,0,0.25)] font-heading"
        style={{ minWidth: 220 }}
      >
        {/* Apple logo — Font Awesome path, renders cleanly at all sizes */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="white"
          className="w-5 h-5 flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        <span className="text-xl font-semibold tracking-tight">download →</span>
      </a>
      {/* Only show on mobile */}
      <p className="md:hidden text-md font-semibold" style={{ fontFamily: "'Instrument Sans', sans-serif", color: '#181818' }}>hold + press to open</p>
    </div>
  );
}