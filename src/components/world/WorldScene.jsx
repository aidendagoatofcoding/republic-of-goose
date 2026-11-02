import { useRef, useState } from 'react';
import SpeciesAvatar from '@/components/SpeciesAvatar';

const ANCHORS = [
  [26, 40],
  [50, 32],
  [72, 42],
  [34, 66],
  [64, 68],
  [50, 50],
  [18, 74],
  [82, 72],
  [50, 84],
  [40, 46],
];

const clamp = (value) => Math.min(96, Math.max(4, value));

function anchorFor(resident, index) {
  const home = resident.spots.find((spot) => spot.category === 'home');
  if (home) return { x: home.x, y: home.y };
  const [x, y] = ANCHORS[index % ANCHORS.length];
  return { x, y };
}

export default function WorldScene({ residents, onMove, placing, onPlace, onCancelPlace }) {
  const boxRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [ghost, setGhost] = useState(null);

  const toPercent = (event) => {
    const rect = boxRef.current.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100),
    };
  };

  const startDrag = (event, spot) => {
    if (placing) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDrag({ item_id: spot.item_id, x: spot.x, y: spot.y });
  };

  const handlePointerMove = (event) => {
    if (placing) {
      setGhost(toPercent(event));
      return;
    }
    if (!drag || !boxRef.current) return;
    const next = toPercent(event);
    setDrag((current) => (current ? { ...current, ...next } : current));
  };

  const endDrag = () => {
    if (!drag) return;
    onMove(drag.item_id, drag.x, drag.y);
    setDrag(null);
  };

  const handleClick = (event) => {
    if (!placing) return;
    const spot = toPercent(event);
    onPlace(spot.x, spot.y);
  };

  return (
    <div
      ref={boxRef}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClick={handleClick}
      className={`relative aspect-[4/3] w-full touch-none overflow-hidden rounded-md border border-border/80 bg-secondary/40 md:aspect-[16/10] ${
        placing ? 'cursor-crosshair ring-1 ring-primary/50' : ''
      }`}
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/10 via-secondary/40 to-secondary/80"
        aria-hidden="true"
      />
      <div
        className="absolute left-[4%] top-[46%] h-[26%] w-[32%] rounded-[50%] border border-chart-4/40 bg-chart-4/20"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[18%] left-1/2 h-[8%] w-[68%] -translate-x-1/2 rounded-[50%] bg-border/40"
        aria-hidden="true"
      />
      <span className="absolute right-[8%] top-[16%] text-2xl" aria-hidden="true">
        🌲
      </span>
      <span className="absolute left-[12%] top-[22%] text-xl" aria-hidden="true">
        🌾
      </span>
      <span className="absolute bottom-[10%] right-[18%] text-xl" aria-hidden="true">
        🌿
      </span>

      {placing && (
        <div className="absolute left-2 top-2 z-40 flex items-center gap-2 rounded-sm border border-primary/50 bg-card/95 px-2.5 py-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
            Tap the meadow to place {placing.name}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCancelPlace();
            }}
            className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {placing && ghost && (
        <span
          aria-hidden="true"
          style={{ left: `${ghost.x}%`, top: `${ghost.y}%` }}
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 text-4xl opacity-60"
        >
          {placing.emoji}
        </span>
      )}

      {residents.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          The Commons are empty. Be the first to build here.
        </p>
      )}

      {residents.map((resident, index) => {
        const anchor = anchorFor(resident, index);
        return (
          <div key={resident.key}>
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-full text-center"
              style={{ left: `${anchor.x}%`, top: `${anchor.y - 4}%` }}
            >
              <SpeciesAvatar
                species={resident.species}
                src={resident.avatar_url}
                worn={resident.worn}
                size="sm"
                className={`mx-auto ${resident.is_me ? 'ring-1 ring-primary' : 'ring-1 ring-primary/40'}`}
              />
              <p className="mt-1 max-w-[110px] truncate font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/85">
                {resident.is_me ? 'You' : resident.name}
              </p>
            </div>

            {resident.spots.map((spot) => {
              const dragging = resident.is_me && drag?.item_id === spot.item_id;
              const x = dragging ? drag.x : spot.x;
              const y = dragging ? drag.y : spot.y;
              return (
                <div
                  key={spot.item_id}
                  role="img"
                  aria-label={spot.name}
                  onPointerDown={
                    resident.is_me ? (event) => startDrag(event, spot) : undefined
                  }
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none text-center leading-none ${
                    resident.is_me && !placing
                      ? 'cursor-grab active:cursor-grabbing'
                      : 'pointer-events-none'
                  }`}
                >
                  <span className="block text-4xl drop-shadow" aria-hidden="true">
                    {spot.emoji}
                  </span>
                  <span className="mt-1 block max-w-[92px] truncate font-mono text-[8px] uppercase tracking-[0.1em] text-foreground/70">
                    {spot.name}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}