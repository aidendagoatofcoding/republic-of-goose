import Walker from '@/components/world/Walker';

// The last lamp of the Republic, and the warden who keeps it at the far edge of the Commons.
export const EDGE_WARDEN = { x: 96, y: 54 };

export default function EdgeWarden({ near = false, onOpen }) {
  return (
    <>
      <span
        style={{ left: `${EDGE_WARDEN.x}%`, top: `${EDGE_WARDEN.y - 6}%` }}
        className="pointer-events-none absolute z-30 -translate-x-1/2 font-display text-2xl font-bold text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
        aria-hidden="true"
      >
        !
      </span>

      <span
        style={{ left: `${EDGE_WARDEN.x + 2.4}%`, top: `${EDGE_WARDEN.y + 4}%` }}
        className="glow-pulse pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full text-3xl"
        aria-hidden="true"
      >
        🏮
      </span>

      <Walker
        label="The Edge Warden"
        species="fox"
        x={EDGE_WARDEN.x}
        y={EDGE_WARDEN.y}
        face={-1}
        speed="0s"
        bubble={near ? 'A word, traveller?' : undefined}
        onPoke={onOpen}
      />
    </>
  );
}