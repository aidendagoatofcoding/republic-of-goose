import { X } from 'lucide-react';

export default function PongTable({ table, role, opponentName, result, onMove, onQuit }) {
  const mine = role === 'host' ? table.scoreHost : table.scoreGuest;
  const theirs = role === 'host' ? table.scoreGuest : table.scoreHost;
  const myPaddle = role === 'host' ? table.hostY : table.guestY;

  const handleMove = (event) => {
    if (!onMove || result) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const y = (event.clientY - rect.top) / rect.height;
    onMove(y);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 p-3 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-md border border-primary/40 bg-card p-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              Pond Pong · first to five
            </p>
            <p className="mt-1 font-display text-xl font-bold">
              {mine} — {theirs}{' '}
              <span className="font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-muted-foreground">
                vs {opponentName}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onQuit}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Leave pond
          </button>
        </div>

        <div
          onPointerMove={handleMove}
          onPointerDown={handleMove}
          className="relative mt-3 aspect-[16/9] w-full touch-none overflow-hidden rounded-sm border border-primary/30 bg-[#08120F]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(190,255,140,0.08), transparent 60%)',
          }}
        >
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-primary/25" />

          <div
            className="absolute left-[4%] h-[22%] w-[6px] -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(190,255,140,0.6)]"
            style={{ top: `${table.hostY * 100}%` }}
          />
          <div
            className="absolute right-[4%] h-[22%] w-[6px] -translate-y-1/2 rounded-full bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.5)]"
            style={{ top: `${table.guestY * 100}%` }}
          />

          <div
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-[0_0_14px_rgba(255,255,255,0.7)]"
            style={{ left: `${table.ballX * 100}%`, top: `${table.ballY * 100}%` }}
          />

          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            slide the pointer to move your paddle · you are{' '}
            {role === 'host' ? 'left' : 'right'}
          </p>

          {result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/85">
              <p className="display-title text-2xl">{result}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {mine} — {theirs}
              </p>
              <button
                type="button"
                onClick={onQuit}
                className="rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
              >
                Back to the meadow
              </button>
            </div>
          )}

          <span className="pointer-events-none absolute right-2 top-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[#D4AF37]/80">
            {opponentName}
          </span>
          <span className="pointer-events-none absolute left-2 top-2 font-mono text-[8px] uppercase tracking-[0.16em] text-primary/80">
            you · {Math.round(myPaddle * 100)}
          </span>
        </div>
      </div>
    </div>
  );
}