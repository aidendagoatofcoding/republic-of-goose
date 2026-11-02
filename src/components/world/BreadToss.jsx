import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const THROWS = 5;
const SWEEP_SECONDS = 2.2;
const TARGET = 150;

const RINGS = [
  { limit: 0.12, points: 50, label: 'Bullseye' },
  { limit: 0.32, points: 30, label: 'Inner ring' },
  { limit: 0.58, points: 15, label: 'Outer ring' },
];
const MISS = { points: 5, label: 'Off the rim' };

export default function BreadToss({ onClose }) {
  const [phase, setPhase] = useState('ready');
  const [pos, setPos] = useState(0.5);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(THROWS);
  const [hits, setHits] = useState([]);
  const [last, setLast] = useState(null);
  const [result, setResult] = useState('');

  const posRef = useRef(0.5);
  const startRef = useRef(0);
  const frameRef = useRef(0);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const start = () => {
    stop();
    startRef.current = performance.now();
    runningRef.current = true;
    setPhase('running');
    setScore(0);
    setLeft(THROWS);
    setHits([]);
    setLast(null);
    setResult('');
  };

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const step = (now) => {
      if (!runningRef.current) return;
      const cycle = (((now - startRef.current) / 1000) % SWEEP_SECONDS) / SWEEP_SECONDS;
      const value = cycle < 0.5 ? cycle * 2 : 2 - cycle * 2;
      posRef.current = value;
      setPos(value);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [phase]);

  const toss = useCallback(() => {
    if (phase !== 'running') return;
    const distance = Math.abs(posRef.current - 0.5) * 2;
    const ring = RINGS.find((entry) => distance < entry.limit) || MISS;
    const nextScore = score + ring.points;
    const nextLeft = left - 1;
    setScore(nextScore);
    setLeft(nextLeft);
    setLast(ring);
    setHits((list) => [...list, ring.points]);
    if (nextLeft === 0) {
      stop();
      setPhase('done');
      setResult(
        nextScore >= TARGET ? 'You beat the Isle Champion!' : 'The Champion keeps the ribbon.'
      );
    }
  }, [phase, score, left, stop]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        toss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toss]);

  useEffect(() => stop, [stop]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 p-3 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-md border border-primary/40 bg-card p-4 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              Honk Champion Isle · Bread Toss
            </p>
            <p className="mt-1 font-display text-xl font-bold">Five loaves at the rings</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Leave range
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Score {score} · target {TARGET}</span>
          <span>{left} loaves left</span>
        </div>

        <div className="relative mt-1 h-16 overflow-hidden rounded-sm border border-border/70 bg-secondary/60">
          <span className="absolute inset-y-0 left-[22.5%] w-[55%] bg-[#D4AF37]/10" />
          <span className="absolute inset-y-0 left-[34%] w-[32%] bg-[#D4AF37]/15" />
          <span className="absolute inset-y-0 left-[44%] w-[12%] bg-[#D4AF37]/30" />
          <span
            className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-primary shadow-[0_0_10px_rgba(190,255,140,0.8)]"
            style={{ left: `${pos * 100}%` }}
          />
          <span className="pointer-events-none absolute bottom-1 left-[44%] w-[12%] text-center font-mono text-[8px] uppercase tracking-[0.12em] text-[#D4AF37]">
            50
          </span>
        </div>

        <p className="mt-2 h-4 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
          {last ? `${last.label} · +${last.points}` : ''}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {hits.map((points, index) => (
            <span
              key={`${points}-${index}`}
              className="rounded-sm border border-primary/40 px-2 py-1 font-mono text-[9px] text-primary"
            >
              {points}
            </span>
          ))}
        </div>

        {phase === 'ready' && (
          <button
            type="button"
            onClick={start}
            className="mt-4 w-full rounded-sm bg-primary py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Take five loaves
          </button>
        )}

        {phase === 'running' && (
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              toss();
            }}
            className="mt-4 w-full select-none rounded-sm bg-primary py-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-primary-foreground active:scale-[0.99]"
          >
            🍞 Toss
          </button>
        )}

        {phase === 'done' && (
          <div className="mt-4 rounded-sm border border-primary/40 bg-primary/5 p-3 text-center">
            <p className="display-title text-xl">{result}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {score} of {THROWS * 50} bread points
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-3 rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Throw again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}