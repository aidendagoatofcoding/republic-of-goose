// A boulder or a hollow tree out on the meadow. Most are just scenery — a few hold something.
export default function HiddenSpot({ spot, near, revealed, collected, onSearch }) {
  const isRock = spot.kind === 'rock';

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onSearch(spot);
      }}
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      className={`absolute z-20 -translate-x-1/2 -translate-y-[85%] text-center focus:outline-none ${
        collected ? 'opacity-45' : ''
      }`}
      title={near ? `Search the ${isRock ? 'boulder' : 'tree'}` : ''}
    >
      <svg
        viewBox="0 0 40 46"
        className={`block ${near ? 'h-[52px] w-[46px]' : 'h-[42px] w-[38px]'} drop-shadow-[0_6px_8px_rgba(0,0,0,0.55)]`}
        aria-hidden="true"
      >
        {isRock ? (
          <>
            <ellipse cx="20" cy="42" rx="15" ry="3.5" fill="#000" opacity="0.35" />
            <path d="M5 38 L7 24 L14 15 L26 14 L34 23 L36 37 Z" fill="#5a6159" stroke="#20261f" strokeWidth="1.4" />
            <path d="M8 25 L14 16 L24 16 L20 26 Z" fill="#6d756c" />
            <path d="M20 26 L24 16 L32 24 L30 36 L21 37 Z" fill="#495047" />
            <path d="M10 30 q4 -3 8 0" stroke="#7c847a" strokeWidth="1.2" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="20" cy="43" rx="12" ry="3" fill="#000" opacity="0.35" />
            <rect x="17" y="27" width="6" height="14" rx="2" fill="#4a3a26" stroke="#241b11" strokeWidth="1.2" />
            <path d="M20 3 L33 20 L27 30 L13 30 L7 20 Z" fill="#2f5138" stroke="#152a1b" strokeWidth="1.4" />
            <path d="M20 8 L27 19 L22 26 L16 24 Z" fill="#3d6a49" />
            <circle cx="20" cy="22" r="2" fill="#12180f" stroke="#0a0f08" strokeWidth="0.8" />
          </>
        )}
      </svg>

      {revealed && !collected && (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: `radial-gradient(circle, ${spot.glow}66 0%, transparent 70%)` }}
          aria-hidden="true"
        />
      )}

      {near && (
        <span className="mt-0.5 block whitespace-nowrap rounded-sm border border-primary/50 bg-card/90 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-primary">
          ⏎ {collected ? 'Already searched' : 'Search'}
        </span>
      )}
    </button>
  );
}