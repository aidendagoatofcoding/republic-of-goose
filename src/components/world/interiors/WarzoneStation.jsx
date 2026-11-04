import { useEffect, useRef, useState } from 'react';

const ROUND_SECONDS = 40;
const LINES = 3;
const DUCK_TTL = 2100;

export default function WarzoneStation() {
  const [phase, setPhase] = useState('idle');
  const [ducks, setDucks] = useState([]);
  const [hits, setHits] = useState(0);
  const [lines, setLines] = useState(LINES);
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const ducksRef = useRef([]);
  ducksRef.current = ducks;

  useEffect(() => {
    if (phase !== 'fight') return undefined;
    const spawn = setInterval(() => {
      const now = Date.now();
      const current = ducksRef.current;
      const alive = current.filter((duck) => now - duck.born < DUCK_TTL);
      const lost = current.length - alive.length;
      if (lost > 0) setLines((value) => Math.max(0, value - lost));
      const next =
        Math.random() < 0.8
          ? [
              ...alive,
              {
                id: `${now}-${Math.random()}`,
                x: 8 + Math.random() * 84,
                y: 34 + Math.random() * 48,
                born: now,
              },
            ]
          : alive;
      setDucks(next);
    }, 620);
    const clock = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => {
      clearInterval(spawn);
      clearInterval(clock);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'fight' && (lines === 0 || seconds === 0)) {
      setPhase('over');
      setDucks([]);
    }
  }, [phase, lines, seconds]);

  const start = () => {
    setHits(0);
    setLines(LINES);
    setSeconds(ROUND_SECONDS);
    setDucks([]);
    setPhase('fight');
  };

  const honk = (duck) => {
    setDucks((current) => current.filter((entry) => entry.id !== duck.id));
    setHits((value) => value + 1);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Ducks repelled <span className="text-primary">{hits}</span> · line {lines}/{LINES} ·{' '}
          {phase === 'fight' ? `${seconds}s` : '—'}
        </p>
        <button
          type="button"
          onClick={start}
          className="rounded-sm border border-primary/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
        >
          {phase === 'fight' ? 'Restart the line' : 'Hold the line'}
        </button>
      </div>

      <div className="relative h-[300px] overflow-hidden rounded-sm border border-[#e0664a]/40 bg-[#0e0a08]">
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ background: 'linear-gradient(180deg, #2b140f 0%, #170d0a 100%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-30"
          style={{ background: 'repeating-linear-gradient(90deg, #4a2a1c 0 2px, transparent 2px 26px)' }}
          aria-hidden="true"
        />
        <span className="absolute left-1/2 top-2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.24em] text-[#e0664a]/70">
          The duck line
        </span>

        {phase === 'fight' &&
          ducks.map((duck) => (
            <button
              key={duck.id}
              type="button"
              onClick={() => honk(duck)}
              style={{ left: `${duck.x}%`, top: `${duck.y}%` }}
              aria-label="Honk the duck away"
              className="meadow-bob absolute z-10 -translate-x-1/2 -translate-y-1/2 text-3xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
            >
              <span aria-hidden="true">🦆</span>
            </button>
          ))}

        {phase !== 'fight' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1.5 bg-black/45 px-4 text-center">
            {phase === 'idle' ? (
              <>
                <p className="font-display text-xl text-[#f6ecc9]">The front is quiet. For now.</p>
                <p className="max-w-xs text-[13px] leading-snug text-[#e8d9b0]/75">
                  Tap every duck that breaks the line before it slips past. Three get through and the
                  line falls.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-xl text-[#f6ecc9]">
                  {lines === 0 ? 'The line broke.' : 'The ducks retreated.'}
                </p>
                <p className="text-[13px] text-[#e8d9b0]/80">
                  {hits} duck{hits === 1 ? '' : 's'} repelled for the Republic.
                </p>
              </>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-1 rounded-sm border border-[#e0664a]/60 bg-[#e0664a]/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ffb9a5] hover:bg-[#e0664a]/25"
            >
              {phase === 'idle' ? 'Sound the horn' : 'Fight again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}