export default function DevOpsLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 160 160"
        className="h-11 w-11 shrink-0 drop-shadow-[0_0_18px_rgba(96,165,250,0.18)]"
      >
        <defs>
          <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="core" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>

        <circle cx="80" cy="80" r="74" fill="url(#ring)" />
        <circle cx="80" cy="80" r="66" fill="#0f172a" />
        <circle cx="80" cy="80" r="60" fill="url(#core)" />

        <path
          d="M44 62c0-15 12-27 27-27 4-11 15-18 27-18 16 0 29 11 31 26 12 1 22 11 22 24v16H44V62Z"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M42 85c12-12 23-18 32-18 11 0 19 7 26 16 8 10 15 18 26 18 9 0 18-6 28-18"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M42 85c12-12 23-18 32-18 11 0 19 7 26 16 8 10 15 18 26 18 9 0 18-6 28-18"
          fill="none"
          stroke="url(#flow)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M42 99c12 12 23 18 32 18 11 0 19-7 26-16 8-10 15-18 26-18 9 0 18 6 28 18"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M42 99c12 12 23 18 32 18 11 0 19-7 26-16 8-10 15-18 26-18 9 0 18 6 28 18"
          fill="none"
          stroke="url(#flow)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        <path d="M34 117h92" stroke="#64748b" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
        <path d="M34 126h92" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
        <g fill="#cbd5e1">
          <circle cx="53" cy="117" r="4" />
          <circle cx="75" cy="126" r="4" />
          <circle cx="97" cy="117" r="4" />
          <circle cx="119" cy="126" r="4" />
        </g>
        <g stroke="#94a3b8" strokeWidth="3" strokeLinecap="round">
          <path d="M53 117v-12" />
          <path d="M75 126v-16" />
          <path d="M97 117v-14" />
          <path d="M119 126v-11" />
        </g>

        <path d="M50 84l9 9-9 9" fill="none" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M65 102h13" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round" />
      </svg>

      <div className="leading-none">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-slate-400">
          Maksym
        </div>
        <div className="text-lg font-semibold tracking-tight text-slate-100">
          DevOps
        </div>
      </div>
    </div>
  );
}
