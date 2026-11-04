import { useCallback, useEffect, useRef, useState } from 'react';
import { DoorOpen, Fish } from 'lucide-react';
import CivicBuilding from '@/components/world/areas/CivicBuilding';
import HarbourDock from '@/components/world/HarbourDock';
import FishingGame from '@/components/world/FishingGame';
import RealmScenery from '@/components/world/RealmScenery';
import Walker from '@/components/world/Walker';
import { useCitizen } from '@/hooks/useCitizen';
import useInteriorWalk from '@/hooks/useInteriorWalk';

const REACH = 185;
const BOUNDS = { x: [6, 94], y: [58, 92] };
const EXIT = { x: 8, y: 88 };

export default function RealmScene({ realm, onExit, onEnterPlace, blocked = false }) {
  const { citizen } = useCitizen();
  const [fishing, setFishing] = useState(false);
  const boxRef = useRef(null);
  const { pos, nudge } = useInteriorWalk({
    roomRef: boxRef,
    start: { x: 50, y: 88, face: 1 },
    paused: blocked,
    bounds: BOUNDS,
  });

  const distanceTo = useCallback(
    (point) => {
      const box = boxRef.current;
      if (!box) return null;
      const dx = ((here.x - point.x) / 100) * box.offsetWidth;
      const dy = ((here.y - point.y) / 100) * box.offsetHeight;
      return Math.hypot(dx, dy);
    },
    [here.x, here.y]
  );

  // Nobody walks on the lake: the only footing past the shore is the pier itself.
  const inWater = realm.water && pos.y > 66 && (pos.x < 42 || pos.x > 58);
  const here = inWater ? { ...pos, y: 66 } : pos;
  const exitAt = realm.centerReturn || EXIT;

  const nearBuilding = realm.buildings.find((building) => {
    const distance = distanceTo(building);
    return distance !== null && distance <= REACH;
  });
  const nearExit = (() => {
    const distance = distanceTo(exitAt);
    return distance !== null && distance <= REACH;
  })();
  const nearDock = (() => {
    if (!realm.dock) return false;
    const distance = distanceTo(realm.dock);
    return distance !== null && distance <= REACH + 30;
  })();

  useEffect(() => {
    const onKey = (event) => {
      if (blocked) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onExit();
        return;
      }
      if (event.key !== 'Enter') return;
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag)) return;
      if (nearExit) {
        event.preventDefault();
        onExit();
      } else if (nearDock) {
        event.preventDefault();
        setFishing(true);
      } else if (nearBuilding) {
        event.preventDefault();
        onEnterPlace(nearBuilding.place);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [blocked, nearBuilding, nearDock, nearExit, onEnterPlace, onExit]);

  return (
    <div
      className="fixed inset-0 z-[45] overflow-hidden"
      style={
        realm.bright
          ? { background: 'linear-gradient(180deg, #2b1030 0%, #5b2a52 40%, #12525c 100%)' }
          : { background: '#070b08' }
      }
    >
      <div ref={boxRef} className="absolute inset-0">
        <RealmScenery realm={realm} />

        {realm.water && <HarbourDock />}

        {realm.dock && (
          <button
            type="button"
            onClick={() => setFishing(true)}
            style={{ left: `${realm.dock.x}%`, top: `${realm.dock.y}%` }}
            title="Fish off the harbour dock"
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                nearDock
                  ? 'border-primary bg-primary/25 text-primary'
                  : 'border-[#8ec8e0]/50 bg-background/80 text-[#8ec8e0]'
              }`}
            >
              <Fish className="h-4 w-4" />
            </span>
            <span className="mt-1 block whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] text-[#8ec8e0]">
              {nearDock ? '⏎ Fish here' : 'The dock'}
            </span>
          </button>
        )}

        {realm.buildings.map((building) => (
          <CivicBuilding
            key={building.id}
            building={building}
            onEnter={onEnterPlace}
            reachable={nearBuilding?.id === building.id}
          />
        ))}

        <button
          type="button"
          onClick={onExit}
          style={{ left: `${exitAt.x}%`, top: `${exitAt.y}%` }}
          title="Back through the portal to the Commons"
          className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center ${
            realm.centerReturn ? 'scale-150' : ''
          }`}
        >
          <span className="relative mx-auto flex h-14 w-14 items-center justify-center">
            <span className="portal-ring absolute inset-0 rounded-full" aria-hidden="true" />
            <span
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-base ${
                nearExit ? 'border-primary bg-primary/20' : 'border-primary/60 bg-background/85'
              }`}
            >
              <DoorOpen className="h-4 w-4 text-primary" />
            </span>
          </span>
          <span className="mt-1 block whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] text-primary/80">
            {nearExit ? '⏎ The Commons' : 'Commons'}
          </span>
        </button>

        <div className="pointer-events-none absolute inset-0 z-10">
          <Walker
            label="You"
            species={citizen?.species || 'goose'}
            worn={citizen?.worn}
            x={here.x}
            y={here.y}
            face={here.face}
            isMe
            speed="0s"
          />
        </div>
      </div>

      <div className="absolute left-3 top-3 z-30 max-w-[62%] sm:left-5 sm:top-5">
        <h1 className="font-display text-lg leading-tight text-[#f6ecc9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-2xl">
          {realm.name}
        </h1>
        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f2c96b]/80">
          {realm.honkish}
        </p>
        <p className="mt-1 hidden max-w-sm text-[12px] leading-snug text-[#e8d9b0]/70 sm:block">
          {realm.blurb}
        </p>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-sm border border-[#f2c96b]/45 bg-[#0a0f0b]/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10 sm:right-5 sm:top-5"
      >
        <DoorOpen className="h-3.5 w-3.5" />
        To the Commons
      </button>

      {!blocked && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-sm border border-primary/50 bg-card/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary shadow-lg">
          {nearExit
            ? '⏎ Back to the Commons'
            : nearDock
              ? '⏎ Fish off the dock'
              : nearBuilding
                ? `⏎ Enter · ${nearBuilding.name}`
                : 'Walk with W A S D · ⏎ enter a building'}
        </div>
      )}

      {fishing && <FishingGame onClose={() => setFishing(false)} />}

      {!blocked && (
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
    </div>
  );
}