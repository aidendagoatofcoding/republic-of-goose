import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCitizen } from '@/hooks/useCitizen';
import { BOSSES } from '@/lib/bosses';

// The slayers' roll: for each beast, the five quickest bouts the Republic has recorded.
export default function BossLeaderboard({ onClose }) {
  const { citizen } = useCitizen();
  const [boards, setBoards] = useState(null);
  const [error, setError] = useState('');
  const code = citizen?.passport_code || '';
  const myKey = citizen?.id || '';
  const beaten = citizen?.bosses ?? [];

  const load = useCallback(async () => {
    setError('');
    try {
      const response = await base44.functions.invoke('citizen', { action: 'leaderboard', code });
      setBoards(response?.data?.boss_boards || {});
    } catch {
      setError('The slayers board could not be read.');
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="rounded-md border border-border/80 bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="meta-label">The wilds</span>
          <h3 className="display-title mt-0.5 text-base">Slayers' Roll</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={load}
            className="rounded-sm border border-border px-1.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground hover:text-primary"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the board"
            className="text-muted-foreground hover:text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 font-mono text-[9px] text-[#FF6B4A]">
          {error}
        </p>
      )}

      {!boards && !error && (
        <p className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground">
          Reading the roll...
        </p>
      )}

      <ul className="mt-2 space-y-2">
        {BOSSES.map((boss) => {
          const rows = boards?.[boss.id] || [];
          const mine = rows.find((row) => row.citizen_key === myKey);
          return (
            <li key={boss.id} className="border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: boss.accent }}>
                  {boss.glyph} {boss.name}
                </span>
                {beaten.includes(boss.id) && (
                  <span className="shrink-0 font-mono text-[7.5px] uppercase tracking-[0.1em] text-primary">
                    beaten
                  </span>
                )}
              </div>
              <p className="mt-0.5 font-mono text-[7.5px] uppercase leading-snug tracking-[0.1em] text-muted-foreground">
                {boss.style}
              </p>
              {rows.length === 0 ? (
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/80">
                  Nobody has lived to tell it
                </p>
              ) : (
                <ol className="mt-1 space-y-0.5">
                  {rows.map((row, index) => (
                    <li
                      key={row.id || `${boss.id}-${index}`}
                      className={`flex items-center justify-between gap-2 font-mono text-[9.5px] ${
                        row.citizen_key === myKey ? 'text-primary' : 'text-foreground/85'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-1">
                        <span className="text-muted-foreground">{index + 1}</span>
                        <span className="truncate">{row.name}</span>
                      </span>
                      <span className="shrink-0">{row.turns} turns</span>
                    </li>
                  ))}
                </ol>
              )}
              {mine && (
                <p className="mt-0.5 font-mono text-[7.5px] uppercase tracking-[0.1em] text-primary/80">
                  Your quickest · {mine.turns} turns
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-2 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.1em] text-muted-foreground">
        Fewest turns leads. Beasts are found out in the realms.
      </p>
    </section>
  );
}