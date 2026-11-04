const ROADS = [21.7, 49.4, 77.1];

const PLANKS = {
  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 2px, transparent 2px 7px)',
};

const CENTRE_LINE = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(233,220,180,0.4) 0 16px, transparent 16px 34px)',
};

// The Odder runs the width of the meadow; the mill race joins it from the northern hills.
const RIVER = 'M-2 47C10 41 22 52 34 47S56 37 70 45 88 51 102 43';
const RIVER_BACK = 'M-2 45C10 39 22 50 34 45S56 35 70 43 88 49 102 41';
const RIVER_BELOW = 'M-2 49C10 43 22 54 34 49S56 39 70 47 88 53 102 45';
const RACE = 'M31 -2C29 12 35 22 33 30 31 38 33 43 34 47';

const GRASS_TUFTS = [
  [6, 12], [9, 33], [14, 66], [19, 88], [26, 24], [37, 78], [44, 14],
  [52, 58], [59, 90], [64, 22], [72, 72], [81, 16], [88, 60], [92, 86], [97, 36],
];

export default function MeadowGround() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* turf, with the low sun of a Nordic evening raking across it */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#16241b] via-[#1d3125] to-[#101d15]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_32%_30%,rgba(150,220,150,0.14),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_84%_78%,rgba(120,200,190,0.1),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(48deg, #4d7040 0 1px, transparent 1px 5px), repeating-linear-gradient(-24deg, #2f4a2c 0 1px, transparent 1px 7px)',
        }}
      />

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

        <ellipse cx="12" cy="29" rx="7.4" ry="4.2" fill="#123640" />
        <ellipse cx="12" cy="29" rx="6.6" ry="3.8" fill="#22505a" />
        <ellipse cx="12" cy="29" rx="6.6" ry="3.8" fill="none" stroke="#a9d3d8" strokeOpacity="0.35" strokeWidth="0.5" />
        <ellipse cx="9.4" cy="27.6" rx="2" ry="0.9" fill="#cfe9ec" opacity="0.25" />
      </svg>

      {/* ---- the rivers: still beds, then moving water laid over them ---- */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path d={RIVER} fill="none" stroke="#123842" strokeWidth="9" strokeLinecap="round" />
        <path d={RIVER} fill="none" stroke="#2f6f7c" strokeWidth="7" strokeLinecap="round" />
        <path d={RIVER_BELOW} fill="none" stroke="#8fd0d6" strokeOpacity="0.14" strokeWidth="2.6" strokeLinecap="round" />
        <path d={RIVER_BACK} fill="none" stroke="#a9dcdd" strokeOpacity="0.2" strokeWidth="1.2" strokeLinecap="round" />

        <path d={RACE} fill="none" stroke="#123842" strokeWidth="4.4" strokeLinecap="round" />
        <path d={RACE} fill="none" stroke="#2f6f7c" strokeWidth="3.2" strokeLinecap="round" />

        {/* drifting currents, drawn twice at different speeds for depth */}
        <path
          d={RIVER_BACK}
          fill="none"
          stroke="#e6f7f7"
          strokeOpacity="0.55"
          strokeWidth="0.7"
          strokeDasharray="9 21"
          strokeLinecap="round"
          className="river-current"
        />
        <path
          d={RIVER}
          fill="none"
          stroke="#c9efef"
          strokeOpacity="0.4"
          strokeWidth="0.6"
          strokeDasharray="5 17"
          strokeLinecap="round"
          className="river-current-slow"
        />
        <path
          d={RIVER_BELOW}
          fill="none"
          stroke="#b7e6e6"
          strokeOpacity="0.3"
          strokeWidth="0.5"
          strokeDasharray="14 30"
          strokeLinecap="round"
          className="river-current"
        />
        <path
          d={RACE}
          fill="none"
          stroke="#e6f7f7"
          strokeOpacity="0.5"
          strokeWidth="0.8"
          strokeDasharray="6 16"
          strokeLinecap="round"
          className="river-current"
        />

        {/* the shallows catch the light along the bank */}
        <path d={RIVER_BACK} fill="none" stroke="#9fd6b8" strokeOpacity="0.3" strokeWidth="0.35" />

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

      {GRASS_TUFTS.map(([x, y]) => (
        <span
          key={`tuft-${x}-${y}`}
          className="absolute text-[9px] opacity-40"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          🌿
        </span>
      ))}

      <span className="absolute left-[4%] top-[12%] opacity-80" style={{ fontSize: 116 }}>🌲</span>
      <span className="absolute left-[8%] top-[20%] opacity-65" style={{ fontSize: 92 }}>🌲</span>
      <span className="absolute left-[15%] top-[9%] opacity-75" style={{ fontSize: 100 }}>🌲</span>
      <span className="absolute left-[24%] top-[30%] opacity-70" style={{ fontSize: 96 }}>🌲</span>
      <span className="absolute left-[45%] top-[14%] opacity-75" style={{ fontSize: 104 }}>🌲</span>
      <span className="absolute left-[52%] top-[6%] text-lg opacity-65">🌾</span>
      <span className="absolute left-[61%] top-[26%] opacity-65" style={{ fontSize: 88 }}>🌲</span>
      <span className="absolute left-[70%] top-[8%] opacity-70" style={{ fontSize: 96 }}>🌲</span>
      <span className="absolute left-[86%] top-[12%] opacity-80" style={{ fontSize: 112 }}>🌲</span>
      <span className="absolute left-[93%] top-[23%] text-base opacity-55">🪨</span>
      <span className="absolute left-[36%] top-[50%] text-base opacity-60">🌾</span>
      <span className="absolute left-[56%] top-[55%] text-sm opacity-55">🌿</span>
      <span className="absolute left-[68%] top-[70%] text-base opacity-55">🪨</span>
      <span className="absolute left-[96%] top-[55%] opacity-60" style={{ fontSize: 92 }}>🌲</span>
      <span className="absolute left-[6%] top-[78%] text-lg opacity-60">🌾</span>
      <span className="absolute left-[80%] top-[92%] text-lg opacity-60">🪨</span>
      <span className="absolute left-[42%] top-[96%] opacity-65" style={{ fontSize: 100 }}>🌲</span>
      <span className="absolute left-[74%] top-[74%] opacity-70" style={{ fontSize: 96 }}>🌲</span>
      <span className="absolute left-[28%] top-[46%] opacity-60" style={{ fontSize: 86 }}>🌲</span>
      <span className="absolute left-[90%] top-[38%] opacity-65" style={{ fontSize: 94 }}>🌲</span>
    </div>
  );
}