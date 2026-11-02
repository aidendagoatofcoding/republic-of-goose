import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const NESTS = 6;
const ROUND_SECONDS = 25;
const TARGET = 15;
const SPAWN_MS = 850;
const THIEF_MS = 900;

export default function NestGuard({ onClose }) {
  const [phase, setPhase] = useState('ready');
  const [thief, setThief] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [result, setResult] = useState('');

  const thiefRef = useRef(-1);
  const scoreRef = useRef(0);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const finish = useCallback(() => {
    clearTimers();
    thiefRef.current = -1;
    setThief(-1);
    setPhase('done');
    setResult(
      scoreRef.current >= TARGET ? 'The nests are safe!' : 'The thieves got away with bread.'
    );
  }, []);

  const spawn = useCallback(() => {
    let index = Math.floor(Math.random() * NESTS);
    if (index === thiefRef.current) index = (index + 1) % NESTS;
    thiefRef.current = index;
    setThief(index);
    timers.current.push(
      setTimeout(() => {
        thiefRef.current = -1;
        setThief(-1);
      }, THIEF_MS)
    );
    timers.current.push(setTimeout(spawn, SPAWN_MS));
  }, []);

  const start = () => {
    clearTimers();
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setResult('');
    setThief(-1);
    setPhase('running');
    const startedAt = Date.now();
    const tick = () => {
      const left = ROUND_SECONDS - Math.floor((Date.now() - startedAt) / 1000);
      setTimeLeft(Math.max(0, left));
      if (left <= 0) {
        finish();
        return;
      }
      timers.current.push(setTimeout(tick, 250));
    };
    timers.current.push(setTimeout(tick, 250));
    spawn();
  };

  const grab = (index) => {
    if (phase !== 'running' || index !== thiefRef.current) return;
    thiefRef.current = -1;
    setThief(-1);
    scoreRef.current += 1;
    setScore(scoreRef.current);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 p-3 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-md border border-primary/40 bg-card p-4 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              Honk Champion Isle · Nest Guard
            </p>
            <p className="mt-1 font-display text-xl font-bold">Guard the bread nests</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Leave nests
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>
            Caught {score} · target {TARGET}
          </span>
          <span>{timeLeft}s left</span>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {Array.from({ length: NESTS }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => grab(index)}
              disabled={phase !== 'running'}
              className={`flex h-20 items-center justify-center rounded-sm border text-2xl ${
                thief === index
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15'
                  : 'border-border/70 bg-secondary/60'
              }`}
            >
              <span aria-hidden="true">{thief === index ? '🦝' : '🌾'}</span>
            </button>
          ))}
        </div>

        {phase === 'ready' && (
          <button
            type="button"
            onClick={start}
            className="mt-4 w-full rounded-sm bg-primary py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Start the watch
          </button>
        )}

        {phase === 'done' && (
          <div className="mt-4 rounded-sm border border-primary/40 bg-primary/5 p-3 text-center">
            <p className="display-title text-xl">{result}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {score} thieves caught
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-3 rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Guard again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}