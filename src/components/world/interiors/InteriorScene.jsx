import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DoorOpen, X } from 'lucide-react';
import InteriorRoom from '@/components/world/interiors/InteriorRoom';
import StationContent from '@/components/world/interiors/StationContent';
import Walker from '@/components/world/Walker';
import { useCitizen } from '@/hooks/useCitizen';
import useInteriorWalk from '@/hooks/useInteriorWalk';
import { stationsFor } from '@/lib/interiorStations';

const REACH = 230;

export default function InteriorScene({ place, onEnterPlace, onExit, exitLink, startOpen = '' }) {
  const { citizen } = useCitizen();
  const roomRef = useRef(null);
  const stations = stationsFor(place.id);
  const [openId, setOpenId] = useState(startOpen && stations.some((s) => s.id === startOpen) ? startOpen : '');
  const { pos, nudge } = useInteriorWalk({
    roomRef,
    start: { x: 50, y: 90, face: 1 },
    paused: Boolean(openId),
  });

  const distanceTo = useCallback(
    (station) => {
      const box = roomRef.current;
      if (!box) return null;
      const dx = ((pos.x - station.x) / 100) * box.offsetWidth;
      const dy = ((pos.y - station.y) / 100) * box.offsetHeight;
      return Math.hypot(dx, dy);
    },
    [pos.x, pos.y]
  );

  const near = stations.find((station) => {
    const distance = distanceTo(station);
    return distance !== null && distance <= REACH;
  });

  const open = stations.find((station) => station.id === openId) || null;

  // Talking to whoever is standing in the room opens the counter they serve.
  const talkTo = useCallback(
    (actor) => {
      const nearest = stations
        .map((station) => ({ station, gap: Math.hypot(station.x - actor.x, station.y - actor.y) }))
        .sort((a, b) => a.gap - b.gap)[0];
      if (nearest) setOpenId(nearest.station.id);
    },
    [stations]
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        if (openId) setOpenId('');
        else onExit?.();
        return;
      }
      if (event.key !== 'Enter' || openId || !near) return;
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag)) return;
      event.preventDefault();
      setOpenId(near.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [near, openId, onExit]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={roomRef} className="absolute inset-0">
        <InteriorRoom place={place} onTalk={talkTo} />
      </div>

      <div className="absolute left-3 top-3 z-30 max-w-[62%] sm:left-5 sm:top-5">
        <h1 className="font-display text-lg leading-tight text-[#f6ecc9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-2xl">
          {place.name}
        </h1>
        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2c96b]/80">
          {place.honkish}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#e8d9b0]/70">
          🍞 {citizen?.bread ?? 0} in hand
        </p>
      </div>

      {exitLink ? (
        <Link
          to={exitLink}
          className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-sm border border-[#f2c96b]/45 bg-[#0a0f0b]/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10 sm:right-5 sm:top-5"
        >
          <DoorOpen className="h-3.5 w-3.5" />
          To the Commons
        </Link>
      ) : (
        <button
          type="button"
          onClick={onExit}
          className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-sm border border-[#f2c96b]/45 bg-[#0a0f0b]/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10 sm:right-5 sm:top-5"
        >
          <DoorOpen className="h-3.5 w-3.5" />
          Step outside
        </button>
      )}

      {stations.map((station) => {
        const active = near?.id === station.id;
        return (
          <button
            key={station.id}
            type="button"
            onClick={() => setOpenId(station.id)}
            style={{ left: `${station.x}%`, top: `${station.y}%` }}
            className={`absolute z-20 -translate-x-1/2 translate-y-3 rounded-sm border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] transition-colors ${
              active
                ? 'border-primary bg-primary/20 text-primary shadow-[0_0_18px_rgba(190,242,100,0.25)]'
                : 'border-[#f2c96b]/30 bg-[#0a0f0b]/70 text-[#e8d9b0]/60 hover:text-[#f2c96b]'
            }`}
          >
            {station.name}
          </button>
        );
      })}

      <div className="pointer-events-none absolute inset-0 z-20">
        <Walker
          label="You"
          species={citizen?.species || 'goose'}
          worn={citizen?.worn}
          x={pos.x}
          y={pos.y}
          face={pos.face}
          isMe
          speed="0s"
        />
      </div>

      {near && !open && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-sm border border-primary/50 bg-card/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary shadow-lg">
          ⏎ Enter · {near.name}
        </div>
      )}

      {!open && (
        <div className="absolute bottom-3 left-3 z-30 grid grid-cols-3 gap-1 md:hidden">
          <span />
          <button
            type="button"
            onClick={() => nudge(0, -1)}
            aria-label="Walk up"
            className="rounded-sm border border-[#f2c96b]/40 bg-[#0a0f0b]/80 px-2 py-1.5 font-mono text-[9px] text-[#f2c96b]"
          >
            ↑
          </button>
          <span />
          <button
            type="button"
            onClick={() => nudge(-1, 0)}
            aria-label="Walk left"
            className="rounded-sm border border-[#f2c96b]/40 bg-[#0a0f0b]/80 px-2 py-1.5 font-mono text-[9px] text-[#f2c96b]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => nudge(0, 1)}
            aria-label="Walk down"
            className="rounded-sm border border-[#f2c96b]/40 bg-[#0a0f0b]/80 px-2 py-1.5 font-mono text-[9px] text-[#f2c96b]"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => nudge(1, 0)}
            aria-label="Walk right"
            className="rounded-sm border border-[#f2c96b]/40 bg-[#0a0f0b]/80 px-2 py-1.5 font-mono text-[9px] text-[#f2c96b]"
          >
            →
          </button>
        </div>
      )}

      {open && (
        <div className="absolute inset-x-0 bottom-0 z-40 max-h-[68%] overflow-y-auto border-t border-primary/35 bg-background/97 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
                  {open.name}
                </span>
                <p className="mt-0.5 truncate font-display text-lg leading-tight text-foreground">
                  {place.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenId('')}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
              >
                <X className="h-3 w-3" /> Step back
              </button>
            </div>
            <StationContent
              station={open}
              place={place}
              onEnterPlace={onEnterPlace}
              onExit={onExit}
            />
          </div>
        </div>
      )}
    </div>
  );
}