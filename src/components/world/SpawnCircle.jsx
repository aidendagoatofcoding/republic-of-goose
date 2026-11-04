import { SPAWN } from '@/lib/spawn';

// The circle every goose arrives on, with the realm portals ringing it.
export default function SpawnCircle() {
  return (
    <div
      style={{ left: `${SPAWN.x}%`, top: `${SPAWN.y}%` }}
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="relative flex h-[220px] w-[220px] items-center justify-center sm:h-[300px] sm:w-[300px]">
        <span
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
          aria-hidden="true"
        />
        <span
          className="absolute inset-6 rounded-full border border-primary/20 bg-primary/[0.04]"
          aria-hidden="true"
        />
        <span className="absolute inset-[26%] rounded-full border border-primary/30" aria-hidden="true" />
        <span className="relative text-center">
          <span className="block font-mono text-[8px] uppercase tracking-[0.28em] text-primary/80">
            You arrive here
          </span>
          <span className="mt-1 block font-display text-base text-primary/90 sm:text-xl">
            The Spawn Circle
          </span>
        </span>
      </div>
    </div>
  );
}