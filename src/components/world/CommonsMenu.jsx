import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import TradePanel from '@/components/world/TradePanel';
import EventLeaderboard from '@/components/world/EventLeaderboard';

const TABS = [
  { id: 'trades', label: 'Trades' },
  { id: 'champions', label: 'Champions' },
];

export default function CommonsMenu({
  offerCount,
  offers,
  busyId,
  tradeError,
  onReply,
  onWithdraw,
  onRefreshTrades,
  boards,
  personal,
  myKey,
  boardsLoading,
  boardsError,
  onRefreshBoards,
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('trades');
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em]',
          open
            ? 'border-primary/60 text-primary'
            : 'border-border text-muted-foreground hover:text-foreground'
        )}
      >
        <Trophy className="h-3 w-3" />
        <span className="hidden sm:inline">Standings &amp; trades</span>
        <span className="sm:hidden">Isle</span>
        {offerCount > 0 && (
          <span className="rounded-full bg-primary px-1.5 font-mono text-[8px] font-bold leading-4 text-primary-foreground">
            {offerCount}
          </span>
        )}
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[72vh] w-[330px] max-w-[calc(100vw-1rem)] overflow-y-auto rounded-md border border-border bg-card p-3 shadow-2xl">
          <div className="flex gap-1.5">
            {TABS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setTab(entry.id)}
                className={cn(
                  'flex-1 rounded-sm border px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em]',
                  tab === entry.id
                    ? 'border-primary/60 bg-primary/10 text-primary'
                    : 'border-border/70 text-muted-foreground hover:text-foreground'
                )}
              >
                {entry.label}
                {entry.id === 'trades' && offerCount > 0 ? ` · ${offerCount}` : ''}
              </button>
            ))}
          </div>

          <div className="mt-3">
            {tab === 'trades' ? (
              <TradePanel
                offers={offers}
                busyId={busyId}
                error={tradeError}
                onReply={onReply}
                onWithdraw={onWithdraw}
                onRefresh={onRefreshTrades}
              />
            ) : (
              <EventLeaderboard
                boards={boards}
                personal={personal}
                myKey={myKey}
                loading={boardsLoading}
                error={boardsError}
                onRefresh={onRefreshBoards}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}