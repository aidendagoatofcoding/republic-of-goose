import { useEffect } from 'react';
import { DoorOpen } from 'lucide-react';
import InteriorRoom from '@/components/world/interiors/InteriorRoom';
import CapitalDoors from '@/components/world/interiors/CapitalDoors';
import Bank from '@/pages/Bank';
import Country from '@/pages/Country';
import Games from '@/pages/Games';
import Jobs from '@/pages/Jobs';
import Laws from '@/pages/Laws';
import Market from '@/pages/Market';
import News from '@/pages/News';
import Shop from '@/pages/Shop';

const PAGES = {
  bank: Bank,
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
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070b08] md:flex-row">
      <div className="relative h-[32vh] shrink-0 md:h-auto md:flex-1">
        <InteriorRoom place={place} />

        <div className="absolute left-3 top-3 z-30 max-w-[calc(100%-6rem)] sm:left-5 sm:top-5">
          <h2 className="font-display text-xl leading-tight text-[#f6ecc9] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-2xl">
            {place.name}
          </h2>
          <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.22em] text-[#f2c96b]/80">
            {place.honkish}
          </p>
          <p className="mt-1 hidden max-w-xs text-[13px] leading-snug text-[#e8d9b0]/70 sm:block">
            {place.blurb}
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
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-[#f2c96b]/25 bg-background md:w-[48%] md:max-w-2xl md:border-l md:border-t-0">
        <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-muted-foreground">
            At the counter
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
            Esc to leave
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
          {place.id === 'capital' ? (
            <CapitalDoors onEnter={onEnterPlace} onExit={onExit} />
          ) : (
            <Page />
          )}
        </div>
      </div>
    </div>
  );
}