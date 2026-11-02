import { useState } from 'react';
import PongLobby from '@/components/world/PongLobby';

const SPORTS = [
  { id: 'pong', name: 'Pond Pong', note: 'Two paddles · first to five', action: 'Match' },
  { id: 'sprint', name: 'Honk Sprint', note: 'Outrun the Champion · 100 m', action: 'Play' },
  { id: 'toss', name: 'Bread Toss', note: 'Five loaves · five rings', action: 'Play' },
];

export default function ChampionIsle({ people, seat, pong, onPlay }) {
  const [open, setOpen] = useState('pong');

  const choose = (sport) => {
    setOpen(sport);
    if (sport !== 'pong') onPlay(sport);
  };

  return (
    <section className="rounded-md border border-border/80 bg-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="meta-label">Champion Isle</span>
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
          3 events
        </span>
      </div>

      <ul className="mt-3 space-y-1">
        {SPORTS.map((sport) => (
          <li key={sport.id}>
            <button
              type="button"
              onClick={() => choose(sport.id)}
              className={`flex w-full items-center justify-between gap-2 rounded-sm border px-2.5 py-2 text-left ${
                open === sport.id
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-border/70 hover:border-primary/40'
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
                  {sport.name}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                  {sport.note}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.14em] text-primary">
                {sport.action}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open === 'pong' && (
        <div className="mt-3 border-t border-border/60 pt-3">
          <PongLobby
            people={people}
            seat={seat}
            incoming={pong.incoming}
            notice={pong.notice}
            active={pong.game}
            onChallenge={pong.challenge}
            onAccept={pong.accept}
            onDecline={pong.decline}
          />
        </div>
      )}
    </section>
  );
}