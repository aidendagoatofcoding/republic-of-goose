const WRAP = 'absolute -translate-x-1/2 -translate-y-1/2';

// A timbered pit prop: two posts, a cap beam and the braces that hold the roof up.
export function Timber({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="relative h-32 w-28">
        <span
          className="absolute bottom-0 left-1 h-full w-3.5 rounded-sm border border-[#4e3820]"
          style={{ background: 'linear-gradient(90deg,#8a6a41,#5a4227)' }}
        />
        <span
          className="absolute bottom-0 right-1 h-full w-3.5 rounded-sm border border-[#4e3820]"
          style={{ background: 'linear-gradient(270deg,#8a6a41,#5a4227)' }}
        />
        <span
          className="absolute left-0 right-0 top-0 h-4 rounded-sm border border-[#4e3820]"
          style={{ background: 'linear-gradient(180deg,#9a7748,#634c2c)' }}
        />
        <span className="absolute left-2 top-3 h-1.5 w-10 origin-top-left rotate-[32deg] bg-[#6d5334]" />
        <span className="absolute right-2 top-3 h-1.5 w-10 origin-top-right -rotate-[32deg] bg-[#6d5334]" />
      </div>
    </div>
  );
}

// A seam of bread ore in the wall, lit from within.
export function OreVein({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="relative h-24 w-40">
        <svg viewBox="0 0 160 96" className="h-full w-full">
          <path
            d="M8 78c18-10 22-26 42-32s28-12 48-18 28-6 38-4"
            fill="none"
            stroke="#e0a94f"
            strokeOpacity="0.22"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M8 78c18-10 22-26 42-32s28-12 48-18 28-6 38-4"
            fill="none"
            stroke="#f6cf82"
            strokeOpacity="0.72"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <g fill="#ffd894">
            <circle cx="34" cy="58" r="2.6" />
            <circle cx="70" cy="42" r="2.2" />
            <circle cx="112" cy="26" r="2.6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// Narrow-gauge track laid across the floor boards.
export function Rails({ p }) {
  return (
    <div className={WRAP} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      <div className="relative h-7 w-48">
        <span
          className="absolute bottom-0 left-0 right-0 h-2.5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg,#4a3c2a 0 10px, transparent 10px 23px)',
          }}
        />
        <span className="absolute bottom-1.5 left-0 right-0 h-[3px] rounded-full bg-[#8f8778]" />
        <span className="absolute bottom-[9px] left-0 right-0 h-[3px] rounded-full bg-[#6d675c]" />
      </div>
    </div>
  );
}