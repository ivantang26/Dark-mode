export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold tracking-[-0.02em] ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b79cff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="30" rx="9" fill="#0e0e15" stroke="url(#logo-g)" strokeWidth="1.5" />
        <path d="M9 21.5c3.5 0 4-11 7-11s3.5 11 7 11" fill="none" stroke="url(#logo-g)" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="9" cy="21.5" r="2" fill="#b79cff" />
        <circle cx="23" cy="21.5" r="2" fill="#22d3ee" />
      </svg>
      <span className="text-[17px]">Synapse</span>
    </span>
  );
}
