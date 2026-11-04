import { SPAWN } from '@/lib/spawn';

// The jets that leave the top bowl and fall back into the basin, left and right of the pedestal.
const STREAMS = [
  { d: 'M92 76c-5 6-9 14-11 22', delay: '0s' },
  { d: 'M95 78c-3 7-5 14-6 21', delay: '0.35s' },
  { d: 'M108 76c5 6 9 14 11 22', delay: '0.15s' },
  { d: 'M105 78c3 7 5 14 6 21', delay: '0.5s' },
];

// The spray thrown up out of the bowl before it comes back down.
const JETS = [
  { d: 'M100 72c-3-7-7-11-13-13', delay: '0s' },
  { d: 'M100 72c3-7 7-11 13-13', delay: '0.3s' },
  { d: 'M100 72c-1-8-1-13 0-18', delay: '0.15s' },
];

const DROPS = [
  { cx: 84, cy: 62, delay: '0s' },
  { cx: 92, cy: 58, delay: '0.4s' },
  { cx: 100, cy: 54, delay: '0.8s' },
  { cx: 108, cy: 58, delay: '0.55s' },
  { cx: 116, cy: 62, delay: '1.1s' },
];

// The cobbled circle every goose arrives on, with the national fountain running at its heart.
export default function SpawnCircle() {
  return (
    <div
      style={{ left: `${SPAWN.x}%`, top: `${SPAWN.y}%` }}
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="relative flex h-[300px] w-[300px] items-center justify-center sm:h-[400px] sm:w-[400px]">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <clipPath id="spawn-cobble-clip">
              <circle cx="100" cy="100" r="96" />
            </clipPath>
            <pattern id="spawn-cobble" width="24" height="21" patternUnits="userSpaceOnUse">
              <rect width="24" height="21" fill="#1b231d" />
              <rect x="1" y="1" width="10" height="8.5" rx="2.8" fill="#3d4839" />
              <rect x="13" y="1" width="10" height="8.5" rx="2.8" fill="#333d32" />
              <rect x="1" y="11.5" width="10" height="8.5" rx="2.8" fill="#313b30" />
              <rect x="13" y="11.5" width="10" height="8.5" rx="2.8" fill="#3a4537" />
            </pattern>
            <radialGradient id="fountain-water" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#bfe9d8" />
              <stop offset="60%" stopColor="#6fa892" />
              <stop offset="100%" stopColor="#315c4c" />
            </radialGradient>
          </defs>
          <g clipPath="url(#spawn-cobble-clip)">
            <circle cx="100" cy="100" r="96" fill="url(#spawn-cobble)" />
            <circle cx="100" cy="100" r="96" fill="none" stroke="#77866d" strokeWidth="3.5" />
            <circle cx="100" cy="100" r="72" fill="none" stroke="#5c6a53" strokeWidth="1.4" opacity="0.8" />
          </g>
          <circle cx="100" cy="100" r="96" fill="none" stroke="#070b08" strokeWidth="6" opacity="0.55" />

          <g>
            <ellipse cx="100" cy="104" rx="40" ry="24" fill="#2b3630" stroke="#84937a" strokeWidth="2" />
            <ellipse cx="100" cy="102" rx="33" ry="18" fill="url(#fountain-water)" />

            {/* Rings spreading across the basin as the water lands. */}
            <ellipse
              className="fountain-ripple"
              cx="100"
              cy="102"
              rx="24"
              ry="13"
              fill="none"
              stroke="#dbeee4"
              strokeWidth="1"
            />
            <ellipse
              className="fountain-ripple"
              cx="100"
              cy="102"
              rx="24"
              ry="13"
              fill="none"
              stroke="#dbeee4"
              strokeWidth="1"
              style={{ animationDelay: '0.8s' }}
            />
            <ellipse
              className="fountain-ripple"
              cx="100"
              cy="102"
              rx="24"
              ry="13"
              fill="none"
              stroke="#dbeee4"
              strokeWidth="1"
              style={{ animationDelay: '1.6s' }}
            />

            <ellipse cx="100" cy="98" rx="7" ry="3.4" fill="#8e9a8c" stroke="#3a4539" strokeWidth="1.2" />
            <path d="M100 98V76" stroke="#7d8c7f" strokeWidth="3.4" strokeLinecap="round" />
            <ellipse cx="100" cy="74" rx="9" ry="4" fill="#8e9a8c" stroke="#3a4539" strokeWidth="1.2" />
            <ellipse cx="100" cy="73.4" rx="7" ry="2.6" fill="#bfe9d8" opacity="0.9" />

            {/* Water pouring over the lip of the bowl. */}
            {STREAMS.map((stream) => (
              <path
                key={stream.d}
                className="fountain-stream"
                style={{ animationDelay: stream.delay }}
                d={stream.d}
                fill="none"
                stroke="#dbeee4"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ))}

            {/* Spray going up, then coming back down. */}
            {JETS.map((jet) => (
              <path
                key={jet.d}
                className="fountain-jet"
                style={{ animationDelay: jet.delay }}
                d={jet.d}
                fill="none"
                stroke="#e8f6ee"
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.85"
              />
            ))}

            {DROPS.map((drop) => (
              <circle
                key={`${drop.cx}-${drop.cy}`}
                className="fountain-drop"
                style={{ animationDelay: drop.delay }}
                cx={drop.cx}
                cy={drop.cy}
                r="1.3"
                fill="#e8f6ee"
              />
            ))}

            <circle cx="84" cy="100" r="1.6" fill="#e8f6ee" opacity="0.7" />
            <circle cx="116" cy="100" r="1.4" fill="#e8f6ee" opacity="0.6" />
          </g>
        </svg>
      </div>
    </div>
  );
}