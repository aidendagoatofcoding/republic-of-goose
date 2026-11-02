const ROADS = [21.7, 49.4, 77.1];

const PLANKS = {
  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 2px, transparent 2px 7px)',
};

const CENTRE_LINE = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(233,220,180,0.4) 0 16px, transparent 16px 34px)',
};

export default function MeadowGround() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#16241b] via-[#1d3125] to-[#101d15]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_32%_30%,rgba(150,220,150,0.14),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_84%_78%,rgba(120,200,190,0.1),transparent_55%)]" />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <g stroke="#5a7a3f" strokeOpacity="0.5" strokeWidth="0.9" strokeLinecap="round">
          <path d="M83 66h13M83 70h13M83 74h13M83 78h13M83 82h13M83 86h13" />
        </g>

        <ellipse cx="58" cy="88" rx="13" ry="5.4" fill="none" stroke="#8d5f45" strokeOpacity="0.45" strokeWidth="2.6" />
        <ellipse cx="58" cy="88" rx="9.4" ry="3.4" fill="none" stroke="#c7b48a" strokeOpacity="0.3" strokeWidth="0.5" />

        <path d="M53 10h20M53 19h20" stroke="#c7b48a" strokeOpacity="0.35" strokeWidth="0.5" />
        <path d="M55 14.5h1M59 14.5h1M63 14.5h1M67 14.5h1M71 14.5h1" stroke="#a9b78c" strokeOpacity="0.45" strokeWidth="0.8" />

        <ellipse cx="48" cy="38" rx="4.6" ry="2.1" fill="#3f5236" fillOpacity="0.55" />
        <ellipse cx="48" cy="38" rx="3.2" ry="1.5" fill="none" stroke="#D4AF37" strokeOpacity="0.5" strokeWidth="0.4" />
        <ellipse cx="48" cy="38" rx="1.4" ry="0.7" fill="#D4AF37" fillOpacity="0.4" />

        <g fill="none" stroke="#7d7150" strokeOpacity="0.4" strokeWidth="0.6">
          <path d="M21 20c3-4.6 9-4.6 12 0" />
          <path d="M19 23.5c5-6.5 13-6.5 18 0" />
          <path d="M17 27c7-8.5 17-8.5 24 0" />
        </g>

        <ellipse cx="12" cy="29" rx="6.6" ry="3.8" fill="#22505a" />
        <ellipse cx="12" cy="29" rx="6.6" ry="3.8" fill="none" stroke="#a9d3d8" strokeOpacity="0.35" strokeWidth="0.5" />
        <ellipse cx="9.4" cy="27.6" rx="2" ry="0.9" fill="#cfe9ec" opacity="0.25" />

        <path d="M-2 47C10 41 22 52 34 47S56 37 70 45 88 51 102 43" fill="none" stroke="#1f4b55" strokeWidth="7.5" strokeLinecap="round" />
        <path d="M-2 47C10 41 22 52 34 47S56 37 70 45 88 51 102 43" fill="none" stroke="#3d7d8a" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        <path d="M-2 45C10 39 22 50 34 45S56 35 70 43 88 49 102 41" fill="none" stroke="#bfe3e6" strokeOpacity="0.28" strokeWidth="0.6" />

        <path d="M31 -2C29 12 35 22 33 30 31 38 33 43 34 47" fill="none" stroke="#1f4b55" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M31 -2C29 12 35 22 33 30 31 38 33 43 34 47" fill="none" stroke="#3d7d8a" strokeOpacity="0.45" strokeWidth="1" />

        <ellipse cx="30" cy="58" rx="5.4" ry="3.1" fill="#4b4436" fillOpacity="0.6" />
        <ellipse cx="30" cy="58" rx="5.4" ry="3.1" fill="none" stroke="#c9b98a" strokeOpacity="0.28" strokeWidth="0.4" />
      </svg>

      <div className="absolute inset-x-0 top-[64%] h-7 -translate-y-1/2 bg-[#463f31]/75 ring-1 ring-inset ring-black/20" />
      <div className="absolute inset-x-0 top-[64%] h-[2px] -translate-y-1/2" style={CENTRE_LINE} />
      <div className="absolute inset-x-0 top-[21%] h-5 -translate-y-1/2 bg-[#463f31]/65 ring-1 ring-inset ring-black/15" />

      {ROADS.map((x) => (
        <div
          key={`road-${x}`}
          className="absolute inset-y-0 w-5 -translate-x-1/2 bg-[#463f31]/70 ring-1 ring-inset ring-black/15"
          style={{ left: `${x}%` }}
        />
      ))}

      <div
        className="absolute -translate-x-1/2 ring-1 ring-inset ring-[#241d14] shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
        style={{ left: '33.5%', top: '19.5%', width: '4%', height: '5.5%', backgroundColor: '#5a4a32', ...PLANKS }}
        aria-hidden="true"
      />

      {ROADS.map((x) => (
        <div
          key={`bridge-${x}`}
          className="absolute -translate-x-1/2 ring-1 ring-inset ring-[#241d14] shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          style={{ left: `${x}%`, top: '40%', width: '5.2%', height: '13%', backgroundColor: '#5a4a32', ...PLANKS }}
        />
      ))}

      <span className="absolute left-[4%] top-[12%] text-2xl opacity-80">🌲</span>
      <span className="absolute left-[8%] top-[20%] text-lg opacity-65">🌲</span>
      <span className="absolute left-[15%] top-[9%] text-xl opacity-75">🌲</span>
      <span className="absolute left-[38%] top-[10%] text-base opacity-60">🌿</span>
      <span className="absolute left-[52%] top-[6%] text-lg opacity-65">🌾</span>
      <span className="absolute left-[70%] top-[8%] text-xl opacity-70">🌲</span>
      <span className="absolute left-[86%] top-[12%] text-2xl opacity-80">🌲</span>
      <span className="absolute left-[93%] top-[23%] text-base opacity-55">🪨</span>
      <span className="absolute left-[36%] top-[50%] text-base opacity-60">🌾</span>
      <span className="absolute left-[56%] top-[55%] text-sm opacity-55">🌿</span>
      <span className="absolute left-[68%] top-[70%] text-base opacity-55">🪨</span>
      <span className="absolute left-[96%] top-[55%] text-lg opacity-60">🌲</span>
      <span className="absolute left-[6%] top-[78%] text-lg opacity-60">🌾</span>
      <span className="absolute left-[24%] top-[88%] text-base opacity-55">🌿</span>
      <span className="absolute left-[80%] top-[92%] text-lg opacity-60">🪨</span>
    </div>
  );
}