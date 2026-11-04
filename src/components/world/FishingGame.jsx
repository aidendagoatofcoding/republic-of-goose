import { useEffect, useRef, useState } from 'react';
import { Fish, X } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import useShopItems from '@/hooks/useShopItems';

// Casting off the harbour dock: stop the line inside the shoal and the fish is yours.
export default function FishingGame({ onClose }) {
  const { citizen, signedIn, run } = useCitizen();
  const items = useShopItems();
  const [phase, setPhase] = useState('idle');
  const [pos, setPos] = useState(0);
  const [zone, setZone] = useState(50);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const posRef = useRef(0);
  const dirRef = useRef(1);

  const rod = (citizen?.possessions ?? [])
    .map((id) => items.find((item) => item.id === id))
    .find((item) => item && /rod/i.test(item.name));

  useEffect(() => {
    if (phase !== 'cast') return undefined;
    let frame = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.06, (now - last) / 1000);
      last = now;
      posRef.current += dirRef.current * 108 * dt;
      if (posRef.current >= 100) {
        posRef.current = 100;
        dirRef.current = -1;
      }
      if (posRef.current <= 0) {
        posRef.current = 0;
        dirRef.current = 1;
      }
      setPos(posRef.current);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const cast = () => {
    setError('');
    setNote('');
    setZone(22 + Math.random() * 56);
    posRef.current = 0;
    dirRef.current = 1;
    setPos(0);
    setPhase('cast');
  };

  const strike = async () => {
    if (phase !== 'cast') return;
    setPhase('idle');
    const hit = Math.abs(posRef.current - zone) <= 14;
    if (!hit) {
      setNote('It slipped off the hook. Cast again.');
      return;
    }
    setBusy(true);
    try {
      const data = await run({ action: 'fishCatch' });
      setNote(`Landed one! +${data.earned} bread · ${data.fish_caught} fish in all.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-md border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8ec8e0]">
              Honk Lake Harbour
            </p>
            <h3 className="display-title mt-1 text-2xl">Fishing off the dock</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Leave the dock"
            className="rounded-sm border border-border p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!signedIn ? (
          <p className="mt-4 text-[15px] text-foreground/70">
            Sign in with your passport to fish off the national dock.
          </p>
        ) : !rod ? (
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">
            You need a fishing rod. The chandlery on this harbour sells them, and the tackle
            counter at the Fish Market keeps a few behind the slab.
          </p>
        ) : (
          <>
            <p className="mt-3 text-[14px] text-foreground/70">
              Cast, then strike when the line is over the shoal.
            </p>

            <div className="relative mt-4 h-10 overflow-hidden rounded-sm border border-border bg-[#0d1a1f]">
              <div
                className="absolute inset-y-0 rounded-sm bg-[#8ec8e0]/35"
                style={{ left: `${Math.max(0, zone - 14)}%`, width: '28%' }}
              />
              <span className="absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${pos}%` }} />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#8ec8e0]/60">
                {phase === 'cast' ? 'in the water' : 'ready'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {phase === 'cast' ? (
                <button
                  type="button"
                  onClick={strike}
                  disabled={busy}
                  className="rounded-sm bg-primary px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50"
                >
                  {busy ? 'Reeling...' : 'Strike'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cast}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50"
                >
                  <Fish className="h-3.5 w-3.5" />
                  Cast the line
                </button>
              )}
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                🎣 {citizen?.fish_caught ?? 0} landed
              </span>
            </div>
          </>
        )}

        {note && <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{note}</p>}
        {error && (
          <p role="alert" className="mt-3 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}