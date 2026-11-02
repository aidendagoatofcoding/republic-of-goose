import { ISLE_EVENTS } from '@/lib/isleEvents';

const MEDALS = ['text-[#D4AF37]', 'text-[#cfd6d2]', 'text-[#c08a5a]'];

export default function EventLeaderboard({ boards, personal = {}, myKey = '', loading, error, onRefresh }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="meta-label">Champion Isle</span>
          <h3 className="display-title mt-1 text-lg">Standings</h3>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-sm border border-border px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 font-mono text-[10px] text-[#FF6B4A]">
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          Reading the board...
        </p>
      )}

      <ul className="mt-3 space-y-2.5">
        {ISLE_EVENTS.map((event) => {
          const rows = boards?.[event.id] || [];
          const mine = Math.round(personal?.[event.id] ?? 0);
          return (
            <li key={event.id} className="border-b border-border/50 pb-2 last:border-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-foreground">
                  {event.name}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                  {event.unit}
                </span>
              </div>
              {rows.length === 0 ? (
                <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  No record yet
                </p>
              ) : (
                <ol className="mt-1 space-y-0.5">
                  {rows.map((row, index) => (
                    <li
                      key={row.id || `${event.id}-${index}`}
                      className={`flex items-center justify-between gap-2 font-mono text-[10px] ${
                        myKey && row.citizen_key === myKey ? 'text-primary' : ''
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className={index < 3 ? MEDALS[index] : 'text-muted-foreground'}>
                          {index + 1}
                        </span>
                        <span className="truncate text-foreground/90">{row.name}</span>
                        {myKey && row.citizen_key === myKey && (
                          <span className="shrink-0 font-mono text-[7.5px] uppercase tracking-[0.1em] text-primary">
                            you
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-primary">{Math.round(row.score)}</span>
                    </li>
                  ))}
                </ol>
              )}
              {mine > 0 && (
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-primary/80">
                  Your best · {mine}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-3 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
        Best score per citizen, kept by the Isle stewards.
      </p>
    </div>
  );
}