import { SPAWN } from '@/lib/spawn';

// The cobbled circle every goose arrives on, ringed by the realm portals.
export default function SpawnCircle() {
  return (
    <div
      style={{ left: `${SPAWN.x}%`, top: `${SPAWN.y}%` }}
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="relative flex h-[240px] w-[240px] items-center justify-center sm:h-[320px] sm:w-[320px]">
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
          </defs>
          <g clipPath="url(#spawn-cobble-clip)">
            <circle cx="100" cy="100" r="96" fill="url(#spawn-cobble)" />
            <circle cx="100" cy="100" r="96" fill="none" stroke="#77866d" strokeWidth="3.5" />
            <circle cx="100" cy="100" r="72" fill="none" stroke="#5c6a53" strokeWidth="1.4" opacity="0.8" />
            <circle cx="100" cy="100" r="34" fill="#2a3327" stroke="#84937a" strokeWidth="2" />
          </g>
          <circle cx="100" cy="100" r="96" fill="none" stroke="#070b08" strokeWidth="6" opacity="0.55" />
        </svg>
        <span className="relative z-10 text-center">
          <span className="block font-mono text-[8px] uppercase tracking-[0.24em] text-primary/80">
            You arrive here
          </span>
          <span className="mt-1 block font-display text-sm leading-tight text-primary/90 sm:text-lg">
            The Spawn Circle
          </span>
        </span>
      </div>
    </div>
  );
}