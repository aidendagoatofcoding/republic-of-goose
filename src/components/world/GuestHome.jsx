import { useEffect, useState } from 'react';
import { DoorOpen } from 'lucide-react';
import InteriorRoom from '@/components/world/interiors/InteriorRoom';
import { HOME_ROOMS, FURNITURE_SIZE, tierFor } from '@/lib/homeRooms';
import { useCitizen } from '@/hooks/useCitizen';

// Someone else's home, seen from the doormat: the furniture is where they set it, and
// nothing can be moved by a guest.
export default function GuestHome({ resident, onExit }) {
  const { run } = useCitizen();
  const [home, setHome] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    run({ action: 'guestHome', key: resident.key })
      .then((data) => {
        if (!active) return;
        if (data?.locked) {
          setError(`${resident.name}'s door is shut to visitors.`);
          return;
        }
        setHome(data);
      })
      .catch((err) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, [resident.key, resident.name, run]);

  const tier = tierFor(home?.price ?? resident.home_price ?? 0);
  const room = {
    ...HOME_ROOMS[tier],
    sign: `${resident.name.toUpperCase()} · ${tier.toUpperCase()}`,
    props: HOME_ROOMS[tier].props.map((prop) =>
      prop.label ? { ...prop, label: 'THEIR HEARTH' } : prop
    ),
  };

  return (
    <div className="fixed inset-0 z-[55] overflow-hidden bg-[#070b08]">
      <div className="absolute inset-0">
        <InteriorRoom place={room} />

        {(home?.furniture ?? []).map((entry) => (
          <span
            key={entry.item_id}
            title={entry.name}
            style={{ left: `${entry.x}%`, top: `${entry.y}%` }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 ${FURNITURE_SIZE[tier]} drop-shadow-[0_6px_6px_rgba(0,0,0,0.6)]`}
            aria-hidden="true"
          >
            {entry.emoji}
          </span>
        ))}
      </div>

      <div className="absolute left-3 top-3 z-30 max-w-[58%] sm:left-5 sm:top-5">
        <h1 className="font-display text-lg leading-tight text-[#f6ecc9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-2xl">
          {resident.name}'s home
        </h1>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#f2c96b]/80">
          {home?.is_friend ? 'a friend of yours' : 'open to visitors'}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#e8d9b0]/70">
          {home ? `${home.furniture.length} piece${home.furniture.length === 1 ? '' : 's'} set out` : 'Knocking…'}
        </p>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-sm border border-[#f2c96b]/45 bg-[#0a0f0b]/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10 sm:right-5 sm:top-5"
      >
        <DoorOpen className="h-3.5 w-3.5" />
        Step outside
      </button>

      {error && (
        <p
          role="alert"
          className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-sm border border-[#FF6B4A]/60 bg-[#0b1310]/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#FF6B4A]"
        >
          {error}
        </p>
      )}
    </div>
  );
}