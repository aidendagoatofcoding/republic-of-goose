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
      </svg>
      <span className="absolute left-[26%] top-[34%] text-base opacity-70">🦢</span>
      <span className="absolute left-[62%] top-[62%] text-sm opacity-60">🦆</span>
      <span className="mt-1 block text-center font-mono text-[8px] uppercase tracking-[0.28em] text-[#a9d3d8]/70">
        Honk Lake
      </span>
    </div>
  );
}