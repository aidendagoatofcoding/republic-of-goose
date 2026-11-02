import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DoorOpen } from 'lucide-react';
import InteriorRoom from '@/components/world/interiors/InteriorRoom';
import Walker from '@/components/world/Walker';
import BankCounter from '@/components/bank/BankCounter';
import HouseRules from '@/components/bank/HouseRules';
import BankPanel from '@/components/bank/BankPanel';
import { useCitizen } from '@/hooks/useCitizen';
import { PLACES } from '@/lib/places';

const STATIONS = {
  desk: { name: 'Loans Desk', x: 32, y: 68, hint: 'Enter · speak to the clerk' },
  vault: { name: 'The Vault', x: 78, y: 48, hint: 'Enter · inspect the reserves' },
};

const KEYS = {
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const SPEED = 165;
const REACH = 190;

export default function BankRoom() {
  const { citizen, signedIn } = useCitizen();
  const roomRef = useRef(null);
  const keysRef = useRef(new Set());
  const [me, setMe] = useState({ x: 44, y: 86, face: 1 });
  const meRef = useRef(me);
  const [desk, setDesk] = useState('');

  const distanceTo = useCallback(
    (station) => {
      const box = roomRef.current;
      if (!box) return null;
      const dx = ((me.x - station.x) / 100) * box.offsetWidth;
      const dy = ((me.y - station.y) / 100) * box.offsetHeight;
      return Math.hypot(dx, dy);
    },
    [me.x, me.y]
  );

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const box = roomRef.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!box || desk) return;
      const keys = keysRef.current;
      const vx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
      const vy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
      if (!vx && !vy) return;
      const length = Math.hypot(vx, vy) || 1;
      const current = meRef.current;
      const next = {
        x: clamp(current.x + (((vx / length) * SPEED * dt) / box.offsetWidth) * 100, 5, 95),
        y: clamp(current.y + (((vy / length) * SPEED * dt) / box.offsetHeight) * 100, 62, 93),
        face: vx < 0 ? -1 : vx > 0 ? 1 : current.face,
      };
      meRef.current = next;
      setMe(next);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [desk]);

  const nearId =
    Object.keys(STATIONS).find((id) => {
      const distance = distanceTo(STATIONS[id]);
      return distance !== null && distance <= REACH;
    }) || '';

  useEffect(() => {
    const onDown = (event) => {
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      const direction = KEYS[event.key?.toLowerCase()];
      if (direction) {
        event.preventDefault();
        keysRef.current.add(direction);
        return;
      }
      if (event.key === 'Enter' && nearId) {
        event.preventDefault();
        setDesk(nearId);
      }
      if (event.key === 'Escape') setDesk('');
    };
    const onUp = (event) => {
      const direction = KEYS[event.key?.toLowerCase()];
      if (direction) keysRef.current.delete(direction);
    };
    const clear = () => keysRef.current.clear();
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', clear);
    };
  }, [nearId]);

  const nudge = (dx, dy) => {
    const current = meRef.current;
    const next = {
      x: clamp(current.x + dx, 5, 95),
      y: clamp(current.y + dy, 62, 93),
      face: dx < 0 ? -1 : dx > 0 ? 1 : current.face,
    };
    meRef.current = next;
    setMe(next);
  };

  return (
    <div className="relative -mx-4 -mb-24 -mt-8 h-[calc(100dvh-8rem)] min-h-[540px] overflow-hidden border-y border-border md:-mx-10 md:-mt-10">
      <div ref={roomRef} className="absolute inset-0">
        <InteriorRoom place={PLACES.bank} />

        <div className="absolute left-3 top-3 z-30 sm:left-5 sm:top-5">
          <h1 className="font-display text-xl leading-tight text-[#f6ecc9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-2xl">
            The National Bank
          </h1>
          <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.22em] text-[#f2c96b]/80">
            HONKK HOOONKK HONK
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#e8d9b0]/70">
            {signedIn ? `🍞 ${citizen?.bread ?? 0} in hand` : 'Walk in · sign in at the desk'}
          </p>
        </div>

        <Link
          to="/world"
          className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-sm border border-[#f2c96b]/45 bg-[#0a0f0b]/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10 sm:right-5 sm:top-5"
        >
          <DoorOpen className="h-3.5 w-3.5" />
          To the Commons
        </Link>

        {Object.entries(STATIONS).map(([id, station]) => {
          const near = nearId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setDesk(id)}
              style={{ left: `${station.x}%`, top: `${station.y}%` }}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-sm border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] transition-colors ${
                near
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-[#f2c96b]/30 bg-[#0a0f0b]/70 text-[#e8d9b0]/60 hover:text-[#f2c96b]'
              }`}
            >
              {station.name}
            </button>
          );
        })}

        <Walker
          label="You"
          species={citizen?.species || 'goose'}
          worn={citizen?.worn}
          x={me.x}
          y={me.y}
          face={me.face}
          isMe
          speed="0.12s"
        />

        {nearId && !desk && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-sm border border-primary/50 bg-card/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary shadow-lg">
            {STATIONS[nearId].hint}
          </div>
        )}

        {!desk && (
          <div className="absolute bottom-4 left-3 z-30 grid grid-cols-3 gap-1 md:hidden">
            <span />
            <button
              type="button"
              onClick={() => nudge(0, -4)}
              aria-label="Walk up"
              className="rounded-sm border border-[#f2c96b]/40 bg-[#0a0f0b]/80 px-2 py-1.5 font-mono text-[9px] text-[#f2c96b]"
            >
              ↑
            </button>
            <span />
            <button
              type="button"
              onClick={() => nudge(-4, 0)}
              aria-label="Walk left"
              className="rounded-sm border border-[#f2c96b]/40 bg-[#0a0f0b]/80 px-2 py-1.5 font-mono text-[9px] text-[#f2c96b]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => nudge(0, 4)}
              aria-label="Walk down"
              className="rounded-sm border border-[#f2c96b]/40 bg-[#0a0f0b]/80 px-2 py-1.5 font-mono text-[9px] text-[#f2c96b]"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => nudge(4, 0)}
              aria-label="Walk right"
              className="rounded-sm border border-[#f2c96b]/40 bg-[#0a0f0b]/80 px-2 py-1.5 font-mono text-[9px] text-[#f2c96b]"
            >
              →
            </button>
          </div>
        )}

        {desk && (
          <BankPanel
            title={desk === 'vault' ? 'At the vault' : 'At the loans desk'}
            onClose={() => setDesk('')}
          >
            {desk === 'vault' ? (
              <div className="space-y-3">
                <span className="meta-label">House rules</span>
                <HouseRules />
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {signedIn
                    ? `Reserves held here · your balance ${citizen?.bread ?? 0} bread`
                    : 'The vault stays locked for visitors'}
                </p>
              </div>
            ) : (
              <BankCounter />
            )}
          </BankPanel>
        )}
      </div>
    </div>
  );
}