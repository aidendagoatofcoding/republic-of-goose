import { useCallback, useEffect, useRef, useState } from 'react';
import { Fish, X } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import useShopItems from '@/hooks/useShopItems';
import { gearProfile, tackleSlot, depthFromCast, fishFor } from '@/lib/tackle';
import ReelMeter from '@/components/world/fishing/ReelMeter';
import TacklePanel from '@/components/world/fishing/TacklePanel';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Fishing off the harbour dock, the way it actually goes: pick your spot on the cast,
// wait for the bite, then play the fish without snapping the line.
export default function FishingGame({ onClose }) {
  const { citizen, signedIn, run } = useCitizen();
  const items = useShopItems();

  const owned = (citizen?.possessions ?? [])
    .map((id) => items.find((item) => item.id === id))
    .filter((item) => item && tackleSlot(item));
  const equippedIds = citizen?.gear ?? [];
  const equippedItems = equippedIds.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  const gear = gearProfile(equippedItems);
  const gearRef = useRef(gear);
  gearRef.current = gear;

  const [phase, setPhase] = useState('ready');
  const [power, setPower] = useState(0);
  const [tension, setTension] = useState(0);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [fish, setFish] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const powerRef = useRef(0);
  const dirRef = useRef(1);
  const fishRef = useRef(null);
  const tensionRef = useRef(0);
  const progressRef = useRef(0);
  const holdingRef = useRef(false);

  const reset = () => {
    setNote('');
    setError('');
    setPower(0);
    setProgress(0);
    setTension(0);
    setFish(null);
    powerRef.current = 0;
    dirRef.current = 1;
    tensionRef.current = 0;
    progressRef.current = 0;
    holdingRef.current = false;
    setHolding(false);
  };

  // The power bar sweeps while the line is still in hand.
  useEffect(() => {
    if (phase !== 'cast') return undefined;
    let frame = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      powerRef.current += dirRef.current * gearRef.current.castSpeed * dt;
      if (powerRef.current >= 100) {
        powerRef.current = 100;
        dirRef.current = -1;
      }
      if (powerRef.current <= 0) {
        powerRef.current = 0;
        dirRef.current = 1;
      }
      setPower(powerRef.current);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const settle = useCallback(
    (caught) => {
      const line = fishRef.current;
      if (!caught) {
        setPhase('lost');
        return;
      }
      setPhase('landed');
      run({ action: 'fishCatch', quality: line?.value ?? 1 })
        .then((data) => {
          setNote(
            `Landed a ${line?.name ?? 'fish'}! +${data.earned} bread · ${data.fish_caught} fish in all.`
          );
        })
        .catch((err) => setError(err.message));
    },
    [run]
  );

  // Waiting on the water: something always comes along, sooner with bait.
  useEffect(() => {
    if (phase !== 'wait') return undefined;
    const timer = setTimeout(
      () => setPhase('hooked'),
      Math.round((gearRef.current.biteDelay + Math.random() * 0.9) * 1000)
    );
    return () => clearTimeout(timer);
  }, [phase]);

  // The bite only lasts so long before the fish is away.
  useEffect(() => {
    if (phase !== 'hooked') return undefined;
    const timer = setTimeout(() => {
      setNote('Too slow. It spat the hook and went back down.');
      setPhase('lost');
    }, gearRef.current.hookWindow);
    return () => clearTimeout(timer);
  }, [phase]);

  // Playing the fish: hold to reel while the line is taut, ease off before it snaps.
  useEffect(() => {
    if (phase !== 'reel') return undefined;
    let frame = 0;
    let last = performance.now();
    let time = 0;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      const line = fishRef.current;
      setHolding(holdingRef.current);
      if (holdingRef.current) {
        const pull = (line?.fight ?? 1) * 24 + Math.max(0, Math.sin(time * 2.3)) * 16;
        tensionRef.current = clamp(tensionRef.current + (16 + pull) * dt, 0, 100);
        if (tensionRef.current >= 16 && tensionRef.current <= 84) {
          progressRef.current = Math.min(
            100,
            progressRef.current + (gearRef.current.reel / (line?.fight ?? 1)) * dt
          );
        }
      } else {
        tensionRef.current = clamp(tensionRef.current - 34 * dt, 0, 100);
      }
      setTension(tensionRef.current);
      setProgress(progressRef.current);
      if (tensionRef.current >= 100) {
        holdingRef.current = false;
        setHolding(false);
        setNote('The line parted with a crack. That was a good fish, too.');
        setPhase('lost');
        return;
      }
      if (progressRef.current >= 100) {
        holdingRef.current = false;
        setHolding(false);
        settle(true);
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase, settle]);

  const castOut = () => {
    reset();
    setPhase('cast');
  };

  const dropLine = () => {
    const line = fishFor(depthFromCast(powerRef.current), gearRef.current.luck);
    fishRef.current = line;
    setFish(line);
    setPhase('wait');
  };

  const hook = () => {
    tensionRef.current = 20;
    progressRef.current = 0;
    setPhase('reel');
  };

  const act = () => {
    if (phase === 'ready' || phase === 'landed' || phase === 'lost') castOut();
    else if (phase === 'cast') dropLine();
    else if (phase === 'hooked') hook();
  };

  // Space works every step of the way, and holds the line while the fish runs.
  useEffect(() => {
    const onDown = (event) => {
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (event.code !== 'Space' && event.key !== ' ') return;
      event.preventDefault();
      if (phase === 'reel') {
        holdingRef.current = true;
        return;
      }
      if (event.repeat) return;
      act();
    };
    const onUp = (event) => {
      if (event.code !== 'Space' && event.key !== ' ') return;
      holdingRef.current = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [phase, act]);

  const toggleGear = async (itemId, on) => {
    setBusy(itemId);
    setError('');
    try {
      await run({ action: on ? 'equip' : 'unequip', item_id: itemId });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const bobbing = phase === 'wait' || phase === 'hooked';
  const castLeft = 18 + (power / 100) * 64;
  const status =
    phase === 'ready'
      ? 'Ready to cast'
      : phase === 'cast'
        ? 'Choose your depth'
        : phase === 'wait'
          ? 'Waiting on the float'
          : phase === 'hooked'
            ? 'Bite! Strike now'
            : phase === 'reel'
              ? 'Playing the fish'
              : phase === 'landed'
                ? 'In the creel'
                : 'Nothing on the line';

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 p-3">
      <div className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-md border border-border bg-card p-5">
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
        ) : (
          <>
            <div
              className="relative mt-4 h-32 overflow-hidden rounded-sm border border-border"
              style={{
                background: 'linear-gradient(180deg, #17414d 0%, #103039 55%, #081a20 100%)',
              }}
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(180,231,240,0.14) 0 1px, transparent 1px 12px)',
                }}
              />
              <div className="absolute inset-x-0 top-0 h-[5px] bg-[#0c232a]" />

              <div
                className="absolute top-0 h-[46px] w-px bg-[#8ec8e0]/40 transition-[left] duration-300"
                style={{ left: `${castLeft}%` }}
              />
              <div
                className={`absolute transition-[left] duration-300 ${bobbing ? 'animate-bounce' : ''}`}
                style={{ left: `${castLeft}%`, top: 44 }}
              >
                <span className="block h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#f2c96b] shadow-[0_0_8px_rgba(242,201,107,0.7)]" />
              </div>

              {phase === 'reel' && fish && (
                <span
                  className="absolute text-2xl transition-[left] duration-200"
                  style={{ left: `${12 + (1 - progress / 100) * 70}%`, top: '58%' }}
                  aria-hidden="true"
                >
                  {fish.emoji}
                </span>
              )}

              <span className="absolute inset-x-0 bottom-1.5 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-[#bfe9f2]/70">
                {status}
              </span>
            </div>

            {phase === 'cast' && (
              <div className="mt-3">
                <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>Shallows</span>
                  <span>Mid lake</span>
                  <span>Deep water</span>
                </div>
                <div className="relative mt-1 h-4 overflow-hidden rounded-sm border border-border bg-[#0d1a1f]">
                  <div className="absolute inset-y-0 left-0 w-[36%] bg-[#8ec8e0]/12" />
                  <div className="absolute inset-y-0 left-[36%] w-[36%] bg-[#8ec8e0]/22" />
                  <div className="absolute inset-y-0 right-0 w-[28%] bg-[#8ec8e0]/35" />
                  <span className="absolute inset-y-0 w-1 bg-primary" style={{ left: `${power}%` }} />
                </div>
              </div>
            )}

            {phase === 'hooked' && (
              <p className="mt-3 animate-pulse font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                ❗ The float went under — strike!
              </p>
            )}

            {phase === 'reel' && (
              <>
                <ReelMeter tension={tension} progress={progress} fish={fish} holding={holding} />
                <button
                  type="button"
                  onMouseDown={() => {
                    holdingRef.current = true;
                  }}
                  onMouseUp={() => {
                    holdingRef.current = false;
                  }}
                  onMouseLeave={() => {
                    holdingRef.current = false;
                  }}
                  onTouchStart={(event) => {
                    event.preventDefault();
                    holdingRef.current = true;
                  }}
                  onTouchEnd={() => {
                    holdingRef.current = false;
                  }}
                  className="mt-3 w-full select-none rounded-sm bg-primary px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  Hold to reel · let go when it runs
                </button>
              </>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(phase === 'ready' || phase === 'landed' || phase === 'lost') && (
                <button
                  type="button"
                  onClick={castOut}
                  disabled={!gear.rod}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-40"
                >
                  <Fish className="h-3.5 w-3.5" />
                  Cast the line
                </button>
              )}
              {phase === 'cast' && (
                <button
                  type="button"
                  onClick={dropLine}
                  className="rounded-sm bg-primary px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  Drop it here
                </button>
              )}
              {phase === 'hooked' && (
                <button
                  type="button"
                  onClick={hook}
                  className="rounded-sm bg-primary px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  Strike
                </button>
              )}
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                🎣 {citizen?.fish_caught ?? 0} landed
              </span>
            </div>

            {!gear.rod && (
              <p className="mt-3 rounded-sm border border-border/70 bg-secondary/40 px-3 py-2 text-[13px] leading-relaxed text-foreground/70">
                Nothing is rigged. Buy a rod at the chandlery here or the tackle counter at the
                Fish Market, then rig it below.
              </p>
            )}

            <TacklePanel
              owned={owned}
              equipped={equippedIds}
              onEquip={(id) => toggleGear(id, true)}
              onUnequip={(id) => toggleGear(id, false)}
              busy={busy}
            />

            {gear.rod && equippedItems.length > 0 && (
              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                Rigged: {equippedItems.map((item) => item.name).join(' · ')}
              </p>
            )}
          </>
        )}

        {note && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{note}</p>
        )}
        {error && (
          <p role="alert" className="mt-3 font-mono text-[11px] text-[#FF6B4A]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}