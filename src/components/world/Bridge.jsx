// A proper stone-and-timber bridge where a street crosses the Odder: two arched abutments,
// planked deck, hand rails on both sides and the water breaking against the piers.
export default function Bridge({ x, y }) {
  return (
    <div
      style={{ left: `${x}%`, top: `${y}%` }}
      className="pointer-events-none absolute h-[15%] w-[68px] -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <svg viewBox="0 0 68 200" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="bridge-deck" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a3524" />
            <stop offset="30%" stopColor="#7b5a3c" />
            <stop offset="60%" stopColor="#8a6647" />
            <stop offset="100%" stopColor="#432f20" />
          </linearGradient>
          <pattern id="bridge-planks" width="10" height="8" patternUnits="userSpaceOnUse">
            <rect width="10" height="8" fill="none" />
            <line x1="0" y1="7.5" x2="10" y2="7.5" stroke="#2a1c11" strokeWidth="1.1" />
          </pattern>
        </defs>

        {/* the river under the span, darker where it is in shadow */}
        <rect x="0" y="46" width="68" height="108" fill="#20493e" opacity="0.55" />
        {[0, 1, 2, 3].map((line) => (
          <path
            key={`riffle-${line}`}
            d={`M6 ${56 + line * 22}q10 -5 20 0t20 0t16 0`}
            fill="none"
            stroke="#bfe9d8"
            strokeOpacity="0.28"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        ))}

        {/* stone abutments at each bank */}
        {[18, 176].map((top) => (
          <g key={`abutment-${top}`}>
            <rect x="2" y={top} width="64" height="14" rx="2" fill="#6d6f63" />
            <rect x="2" y={top} width="64" height="4" rx="1.5" fill="#8c8e80" />
            <rect x="2" y={top + 8} width="64" height="6" fill="#4f5148" opacity="0.8" />
            {[8, 20, 32, 44, 56].map((bx) => (
              <line
                key={`joint-${top}-${bx}`}
                x1={bx}
                y1={top}
                x2={bx}
                y2={top + 14}
                stroke="#3f4139"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
          </g>
        ))}

        {/* the deck, arching very slightly over the water */}
        <path
          d="M6 40q28 -10 56 0v120q-28 -10 -56 0z"
          fill="url(#bridge-deck)"
          stroke="#241708"
          strokeWidth="1.6"
        />
        <path d="M6 40q28 -10 56 0v120q-28 -10 -56 0z" fill="url(#bridge-planks)" opacity="0.9" />

        {/* hand rails, with a post at each end and one mid-span */}
        {[12, 56].map((rx) => (
          <g key={`rail-${rx}`}>
            <path
              d={`M${rx} 44q0 58 0 112`}
              fill="none"
              stroke="#8a6647"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            <path
              d={`M${rx} 44q0 58 0 112`}
              fill="none"
              stroke="#c2a273"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {[44, 86, 128].map((py) => (
              <g key={`post-${rx}-${py}`}>
                <rect x={rx - 3} y={py} width="6" height="18" rx="1.4" fill="#6a4c33" />
                <rect x={rx - 3} y={py} width="2.4" height="18" rx="1" fill="#a17f57" opacity="0.7" />
              </g>
            ))}
          </g>
        ))}

        {/* the piers standing in the water */}
        {[20, 44].map((px) => (
          <g key={`pier-${px}`}>
            <rect x={px} y="92" width="7" height="30" rx="1.6" fill="#5b5d52" />
            <rect x={px} y="92" width="2" height="30" fill="#7f8175" opacity="0.6" />
            <ellipse cx={px + 3.5} cy="124" rx="9" ry="3" fill="#bfe9d8" opacity="0.25" />
          </g>
        ))}

        {/* the shadow the bridge lays on the water */}
        <ellipse cx="34" cy="140" rx="26" ry="7" fill="#06110d" opacity="0.35" />
      </svg>
    </div>
  );
}