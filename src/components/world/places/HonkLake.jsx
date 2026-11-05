export default function HonkLake() {
  return (
    <div className="absolute left-[87%] top-[46%] -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 260 180" className="w-[300px] sm:w-[400px]">
        <ellipse cx="130" cy="90" rx="122" ry="76" fill="#173f49" />
        <ellipse cx="130" cy="90" rx="122" ry="76" fill="none" stroke="#a9d3d8" strokeOpacity="0.25" strokeWidth="2" />
        <ellipse cx="112" cy="76" rx="122" ry="76" fill="none" stroke="#3d7d8a" strokeOpacity="0.35" strokeWidth="1.2" />
        <path
          d="M30 76c24-13 46 5 70-5s50-11 70 3"
          fill="none"
          stroke="#9fd8de"
          strokeOpacity="0.3"
          strokeWidth="1.6"
        />
        <path
          d="M44 108c26-10 48 6 72-3s40-8 64 2"
          fill="none"
          stroke="#9fd8de"
          strokeOpacity="0.2"
          strokeWidth="1.4"
        />
        <g stroke="#4d7c46" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round">
          <path d="M20 58v-16M26 60v-12M14 60v-11" />
          <path d="M236 122v-15M242 124v-11M230 124v-10" />
        </g>

        {/* the birds are drawn rather than stamped, so they sit on the water */}
        <g>
          <ellipse cx="88" cy="92" rx="20" ry="5" fill="#cfe9ec" opacity="0.16" />
          <path d="M70 84c-6-1-10 2-11 5 6 3 12 2 16-1" fill="#efece0" />
          <ellipse cx="86" cy="82" rx="19" ry="9" fill="#efece0" />
          <path
            d="M99 78c7-4 8-13 3-17-4-3-9 0-8 5 1 4 4 5 5 8"
            fill="none"
            stroke="#efece0"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="102" cy="59" r="4.4" fill="#efece0" />
          <path d="M98 59h-5l5 2.4z" fill="#d9a24a" />
          <circle cx="103" cy="57.4" r="0.8" fill="#2a241a" />
          <path d="M76 84c8 3 18 3 26 0" stroke="#cfd6c9" strokeOpacity="0.45" strokeWidth="0.8" fill="none" />
        </g>
        <g>
          <ellipse cx="176" cy="132" rx="14" ry="4" fill="#cfe9ec" opacity="0.14" />
          <ellipse cx="172" cy="124" rx="13" ry="7" fill="#6b5a3f" />
          <circle cx="184" cy="114" r="5" fill="#6b5a3f" />
          <path d="M188 114h4l-4 2.2z" fill="#d9a24a" />
          <circle cx="185" cy="112.4" r="0.8" fill="#1c1812" />
          <path d="M164 126c5 2 11 2 16 0" stroke="#cfd6c9" strokeOpacity="0.32" strokeWidth="0.7" fill="none" />
        </g>
      </svg>
      <span className="mt-1 block text-center font-mono text-[8px] uppercase tracking-[0.28em] text-[#a9d3d8]/70">
        Honk Lake
      </span>
    </div>
  );
}