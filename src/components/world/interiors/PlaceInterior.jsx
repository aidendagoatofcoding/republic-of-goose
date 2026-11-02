import { useEffect } from 'react';
import { DoorOpen } from 'lucide-react';
import InteriorRoom from '@/components/world/interiors/InteriorRoom';
import CapitalDoors from '@/components/world/interiors/CapitalDoors';
import BankCounter from '@/components/bank/BankCounter';
import Country from '@/pages/Country';
import Games from '@/pages/Games';
import Jobs from '@/pages/Jobs';
import Laws from '@/pages/Laws';
import Market from '@/pages/Market';
import News from '@/pages/News';
import Shop from '@/pages/Shop';

const PAGES = {
  bank: BankCounter,
  parliament: Laws,
  government: Country,
  exchange: Market,
  guild: Shop,
  granary: Jobs,
  herald: News,
  bakery: Games,
  forest: Country,
};

export default function PlaceInterior({ place, onEnterPlace, onExit }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  if (!place) return null;
  const Page = PAGES[place.id];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#070b08]">
      <div className="absolute inset-0">
        <InteriorRoom place={place} />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[18%]"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(7,11,8,0.55) 55%, rgba(7,11,8,0.92) 100%)' }}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 top-[22%] flex items-start justify-center px-2 pb-2 sm:px-4 sm:pb-4">
        <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-md border border-[#f2c96b]/25 bg-background/97 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
          <div className="flex items-start justify-between gap-3 border-b border-border/70 px-3 py-2.5 sm:px-4">
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg leading-tight text-foreground sm:text-xl">
                {place.name}
              </h2>
              <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-primary/75">
                {place.honkish}
              </p>
            </div>
            <button
              type="button"
              onClick={onExit}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-[#f2c96b]/45 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/10"
            >
              <DoorOpen className="h-3.5 w-3.5" />
              Step outside
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
            {place.id === 'capital' ? (
              <CapitalDoors onEnter={onEnterPlace} onExit={onExit} />
            ) : Page ? (
              <Page />
            ) : (
              <p className="text-[15px] leading-relaxed text-foreground/75">{place.blurb}</p>
            )}
          </div>
        </div>
      </div>

      <p className="pointer-events-none absolute left-3 top-3 z-20 hidden font-mono text-[8px] uppercase tracking-[0.24em] text-[#e8d9b0]/50 sm:block">
        {place.sign} · Esc to leave
      </p>
    </div>
  );
}