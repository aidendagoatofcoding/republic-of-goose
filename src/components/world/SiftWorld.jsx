import { useCallback, useEffect, useRef, useState } from 'react';
import { DoorOpen, Sparkles } from 'lucide-react';
import { Image } from '@/components/ui/image';
import SiftScenery from '@/components/world/SiftScenery';
import Walker from '@/components/world/Walker';
import BossLair from '@/components/world/BossLair';
import BossFight from '@/components/world/BossFight';
import { useCitizen } from '@/hooks/useCitizen';
import useBattlePet from '@/hooks/useBattlePet';
import { bossFor } from '@/lib/bosses';
import useInteriorWalk from '@/hooks/useInteriorWalk';
import { SIFT_CENTER, SIFT_PORTALS, SIFT_RING_RADIUS, SIFT_WELCOME_IMAGE } from '@/lib/sift';
import { sfx } from '@/lib/sfx';

const REACH = 175;
const BOUNDS = { x: [8, 92], y: [46, 93] };

// The Sift: the Republic a turn to the left of itself. Its own ring of portals stands on the
// bright stone where the fountain would be, and the middle of the ring is the way back.
export default function SiftWorld({ onExit, onEnterPlace, blocked = false }) {
  const { citizen } = useCitizen();
  const { pet } = useBattlePet();
  const boss = bossFor('dragon');
  const beaten = (citizen?.bosses ?? []).includes('dragon');
  const [bossOpen, setBossOpen] = useState(false);
  const boxRef = useRef(null);
  const [arrived, setArrived] = useState(false);
  const { pos, nudge } = useInteriorWalk({
    roomRef: boxRef,
    start: { x: SIFT_CENTER.x, y: SIFT_CENTER.y + 15, face: 1 },
    paused: blocked || !arrived,
    bounds: BOUNDS,
  });

  // You arrive before you can move: the Sift settles round you first.
  useEffect(() => {
    sfx.door();
    const timer = setTimeout(() => setArrived(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  // The ring shrinks on a narrow screen so every portal stays on it.
  const [ringRadius, setRingRadius] = useState(SIFT_RING_RADIUS);
  useEffect(() => {
    const measure = () => {
      const width = window.innerWidth || 1000;
      const height = window.innerHeight || 800;
      setRingRadius(Math.round(Math.min(SIFT_RING_RADIUS, width * 0.33, height * 0.26)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const pointAt = (angle) => {
    const box = boxRef.current;
    if (!box) return null;
    const rad = (angle * Math.PI) / 180;
    return {
      x: (SIFT_CENTER.x / 100) * box.offsetWidth + Math.cos(rad) * ringRadius,
      y: (SIFT_CENTER.y / 100) * box.offsetHeight + Math.sin(rad) * ringRadius,
    };
  };

  const gapTo = useCallback(
    (point) => {
      const box = boxRef.current;
      if (!box || !point) return null;
      const meX = (pos.x / 100) * box.offsetWidth;
      const meY = (pos.y / 100) * box.offsetHeight;
      return Math.hypot(meX - point.x, meY - point.y);
    },
    [pos.x, pos.y]
  );

  const nearPortal =
    SIFT_PORTALS.map((portal) => ({ portal, gap: gapTo(pointAt(portal.angle)) }))
      .filter((entry) => entry.gap !== null && entry.gap <= REACH)
      .sort((a, b) => a.gap - b.gap)[0]?.portal || null;

  const centreGap = gapTo({
    x: (SIFT_CENTER.x / 100) * (boxRef.current?.offsetWidth ?? 0),
    y: (SIFT_CENTER.y / 100) * (boxRef.current?.offsetHeight ?? 0),
  });
  const nearCentre = centreGap !== null && centreGap <= REACH;

  const bossGap = boss
    ? gapTo({
        x: (boss.at.x / 100) * (boxRef.current?.offsetWidth ?? 0),
        y: (boss.at.y / 100) * (boxRef.current?.offsetHeight ?? 0),
      })
    : null;
  const nearBoss = bossGap !== null && bossGap <= REACH + 20;

  useEffect(() => {
    const onKey = (event) => {
      if (blocked) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onExit();
        return;
      }
      if (event.key !== 'Enter' || !arrived) return;
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag)) return;
      if (nearBoss) {
        event.preventDefault();
        if (pet) setBossOpen(true);
      } else if (nearPortal) {
        event.preventDefault();
        sfx.door();
        onEnterPlace?.(nearPortal.place);
      } else if (nearCentre) {
        event.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [blocked, arrived, nearPortal, nearCentre, nearBoss, pet, onEnterPlace, onExit]);

  const ringSize = ringRadius * 2;

  return (
    <div className="fixed inset-0 z-[45] overflow-hidden bg-[#16040f]">
      <div ref={boxRef} className="absolute inset-0">
        <SiftScenery />

        <BossLair
          boss={boss}
          near={nearBoss}
          beaten={beaten}
          pet={pet}
          onOpen={() => pet && setBossOpen(true)}
        />

        {/* the way back, standing exactly where the fountain stands in the Commons */}
        <button
          type="button"
          onClick={onExit}
          style={{ left: `${SIFT_CENTER.x}%`, top: `${SIFT_CENTER.y}%` }}
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 text-center"
          title="Step back into the Commons"
        >
          <span className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <span className="portal-ring absolute inset-0 rounded-full" aria-hidden="true" />
            <span
              className="absolute inset-[10px] rounded-full border border-[#8ff2e0]/70"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, #4b123d 0%, #1b0417 62%, #ff9ad566 100%)',
                boxShadow: nearCentre
                  ? 'inset 0 0 26px rgba(143,242,224,0.85), 0 0 30px rgba(255,154,213,0.6)'
                  : 'inset 0 0 18px rgba(255,154,213,0.5)',
              }}
              aria-hidden="true"
            />
            <DoorOpen className="relative h-6 w-6 text-[#ffd6ef]" />
          </span>
          <span className="mt-1 block whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] text-[#8ff2e0]">
            {nearCentre ? '⏎ The Commons' : 'The way back'}
          </span>
        </button>

        {/* the Sift's own ring of portals */}
        <div
          style={{ left: `${SIFT_CENTER.x}%`, top: `${SIFT_CENTER.y}%`, width: ringSize, height: ringSize }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
        >
          <span
            className="absolute inset-0 rounded-full border border-dashed border-[#ff9ad5]/40"
            aria-hidden="true"
          />
          {SIFT_PORTALS.map((portal) => {
            const rad = (portal.angle * Math.PI) / 180;
            const active = nearPortal?.id === portal.id;
            return (
              <button
                key={portal.id}
                type="button"
                title={`${portal.name} — press Enter to step through`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  sfx.door();
                  onEnterPlace?.(portal.place);
                }}
                style={{
                  left: `${50 + Math.cos(rad) * 50}%`,
                  top: `${50 + Math.sin(rad) * 50}%`,
                }}
                className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 text-center"
              >
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full opacity-90"
                    style={{
                      background:
                        'conic-gradient(from 0deg, transparent 0%, #ff9ad5 18%, transparent 44%, #8ff2e0 70%, transparent 96%)',
                      filter: 'blur(2px)',
                      animation: 'portal-spin 6s linear infinite',
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-[7px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 50% 45%, #3a0f31 0%, #12030f 78%)',
                      boxShadow: active
                        ? 'inset 0 0 16px rgba(143,242,224,0.9), 0 0 18px rgba(255,154,213,0.65)'
                        : 'inset 0 0 12px rgba(255,154,213,0.45)',
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative text-xl leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {portal.glyph}
                  </span>
                </span>
                <span
                  className={`mt-1 block whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] ${
                    active ? 'text-[#8ff2e0]' : 'text-[#ffd6ef]/85'
                  }`}
                >
                  {active ? `⏎ ${portal.name}` : portal.name}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-700 ${
            arrived ? 'opacity-100' : 'opacity-0'
          }`}
        >
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
      </div>

      <div className="pointer-events-none absolute left-3 top-3 z-30 max-w-[62%] sm:left-5 sm:top-5">
        <h1 className="font-display text-lg leading-tight text-[#fff0f9] drop-shadow-[0_2px_10px_rgba(30,0,24,0.95)] sm:text-2xl">
          The Sift
        </h1>
        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#8ff2e0]/85">
          HONK HOOONKK HONK
        </p>
        <p className="mt-1 hidden max-w-sm text-[12px] leading-snug text-[#ffd6ef]/80 sm:block">
          Pink sky, turquoise water, and the Commons one turn to the left of itself.
        </p>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-sm border border-[#ff9ad5]/55 bg-[#1b0518]/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#ffd6ef] hover:bg-[#ff9ad5]/15 sm:right-5 sm:top-5"
      >
        <DoorOpen className="h-3.5 w-3.5" />
        To the Commons
      </button>

      {arrived && !blocked && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-sm border border-[#ff9ad5]/60 bg-[#1b0518]/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8ff2e0] shadow-lg">
          {nearBoss
            ? pet
              ? `⏎ Face ${boss.name}`
              : 'A pet from the Menagerie is needed here'
            : nearPortal
            ? `⏎ Enter · ${nearPortal.name}`
            : nearCentre
              ? '⏎ Back to the Commons'
              : 'Walk with W A S D · ⏎ step into a portal'}
        </div>
      )}

      {!blocked && (
        <div className="absolute bottom-3 left-3 z-30 grid grid-cols-3 gap-1 md:hidden">
          <span />
          <button
            type="button"
            onClick={() => nudge(0, -1)}
            aria-label="Walk up"
            className="rounded-sm border border-[#ff9ad5]/50 bg-[#1b0518]/85 px-2 py-1.5 font-mono text-[9px] text-[#ffd6ef]"
          >
            ↑
          </button>
          <span />
          <button
            type="button"
            onClick={() => nudge(-1, 0)}
            aria-label="Walk left"
            className="rounded-sm border border-[#ff9ad5]/50 bg-[#1b0518]/85 px-2 py-1.5 font-mono text-[9px] text-[#ffd6ef]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => nudge(0, 1)}
            aria-label="Walk down"
            className="rounded-sm border border-[#ff9ad5]/50 bg-[#1b0518]/85 px-2 py-1.5 font-mono text-[9px] text-[#ffd6ef]"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => nudge(1, 0)}
            aria-label="Walk right"
            className="rounded-sm border border-[#ff9ad5]/50 bg-[#1b0518]/85 px-2 py-1.5 font-mono text-[9px] text-[#ffd6ef]"
          >
            →
          </button>
        </div>
      )}

      {bossOpen && boss && (
        <BossFight boss={boss} pet={pet} onClose={() => setBossOpen(false)} />
      )}

      {/* arriving: the gate opens, the world catches you, then you find your feet */}
      <div
        className={`pointer-events-none absolute inset-0 z-[60] flex items-center justify-center transition-opacity duration-1000 ${
          arrived ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={SIFT_WELCOME_IMAGE}
          alt="The open Sift gate"
          fittingType="fill"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#12030f]/70" />
        <div className="relative mx-4 max-w-md rounded-sm border border-[#ff9ad5]/60 bg-[#1b0518]/88 px-6 py-7 text-center backdrop-blur-sm">
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[#8ff2e0]">
            <Sparkles className="h-3.5 w-3.5" /> HONK HOOONKK HONK
          </span>
          <h2 className="mt-2 font-display text-3xl leading-tight text-[#fff0f9] sm:text-4xl">
            Welcome to the Sift
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#ffd6ef]/85">
            The gate has taken your keys. The fountain is gone, and a portal stands in its place —
            six other gateways ring it, none of them the ones you know.
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8ff2e0]/80">
            finding your footing…
          </p>
        </div>
      </div>
    </div>
  );
}