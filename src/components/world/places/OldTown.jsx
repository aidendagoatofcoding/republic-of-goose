const COTTAGES = [
  { x: 4, y: 46, w: 34 },
  { x: 42, y: 30, w: 42 },
  { x: 88, y: 50, w: 30 },
  { x: 60, y: 66, w: 36 },
];

export default function OldTown() {
  return (
    <div className="absolute left-[67%] top-[55%] -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 180 110" className="w-[200px] sm:w-[260px]">
        <ellipse cx="90" cy="58" rx="88" ry="50" fill="#33301f" fillOpacity="0.35" />
        <path d="M96 108V58M8 74h164" stroke="#463f31" strokeOpacity="0.7" strokeWidth="6" strokeLinecap="round" />
        {COTTAGES.map((house) => (
          <g key={`${house.x}-${house.y}`}>
            <rect
              x={house.x}
              y={house.y}
              width={house.w}
              height={house.w * 0.62}
              fill="#4a3a2a"
              stroke="#241a11"
              strokeWidth="1"
            />
            <path
              d={`M${house.x - 3} ${house.y} L${house.x + house.w / 2} ${house.y - house.w * 0.46} L${
                house.x + house.w + 3
              } ${house.y} Z`}
              fill="#7d4a3a"
              stroke="#241a11"
              strokeWidth="1"
            />
            <rect
              x={house.x + house.w * 0.38}
              y={house.y + house.w * 0.24}
              width={house.w * 0.22}
              height={house.w * 0.38}
              fill="#f2c96b"
              fillOpacity="0.6"
            />
          </g>
        ))}
      </svg>
      <span className="mt-0.5 block text-center font-mono text-[8px] uppercase tracking-[0.28em] text-[#c7b48a]/70">
        Old Town
      </span>
    </div>
  );
}