import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const ARROWS = 3;
const TARGET_SCORE = 90;

const RINGS = [
  { limit: 7, points: 50, label: 'Bullseye' },
  { limit: 15, points: 30, label: 'Inner ring' },
  { limit: 26, points: 15, label: 'Outer ring' },
];
const MISS = { points: 5, label: 'Into the grass' };

export default function ArcheryGame({ onClose, onFinish }) {
  const [phase, setPhase] = useState('ready');
  const [aim, setAim] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(ARROWS);
  const [last, setLast] = useState(null);
  const [shots, setShots] = useState([]);
  const [result, setResult] = useState('');

  const aimRef = useRef({ x: 50, y: 50 });
  const scoreRef = useRef(0);
  const leftRef = useRef(ARROWS);
  const startRef = useRef(0);
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const stop = useCallback(() => {
    runningRef.current = false;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const start = () => {
    stop();
    startRef.current = performance.now();
    runningRef.current = true;
    aimRef.current = { x: 50, y: 50 };
    scoreRef.current = 0;
    leftRef.current = ARROWS;
    setPhase('running');
    setAim(aimRef.current);
    setScore(0);
    setLeft(ARROWS);
    setShots([]);
    setLast(null);
    setResult('');
  };

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const step = (now) => {
      if (!runningRef.current) return;
      const t = (now - startRef.current) / 1000;
      const next = {
        x: 50 + Math.sin(t * 1.9) * 34,
        y: 50 + Math.cos(t * 2.6) * 30,
      };
      aimRef.current = next;
      setAim(next);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [phase]);

  const shoot = useCallback(() => {
    if (phase !== 'running') return;
    const { x, y } = aimRef.current;
    const distance = Math.hypot(x - 50, y - 50);
    const ring = RINGS.find((entry) => distance < entry.limit) || MISS;
    const nextScore = scoreRef.current + ring.points;
    const nextLeft = leftRef.current - 1;

    scoreRef.current = nextScore;
    leftRef.current = nextLeft;
    setScore(nextScore);
    setLeft(nextLeft);
    setLast(ring);
    setShots((list) => [...list, ring.points]);

    if (nextLeft === 0) {
      stop();
      setPhase('done');
      setResult(
        nextScore >= TARGET_SCORE
          ? 'You take the archery ribbon!'
          : 'The Champion’s aim is truer.'
      );
      finishRef.current?.(nextScore);
    }
  }, [phase, stop]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        shoot();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shoot]);

  useEffect(() => stop, [stop]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 p-3 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-md border border-primary/40 bg-card p-4 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              Honk Champion Isle · Archery
            </p>
            <p className="mt-1 font-display text-xl font-bold">Three arrows at the ring</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Leave butts
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>
            Score {score} · target {TARGET_SCORE}
          </span>
          <span>{left} arrows left</span>
        </div>

        <div className="relative mt-1 aspect-[16/9] overflow-hidden rounded-sm border border-border/70 bg-secondary/50">
          <span className="absolute left-1/2 top-1/2 h-[62%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5" />
          <span className="absolute left-1/2 top-1/2 h-[42%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10" />
          <span className="absolute left-1/2 top-1/2 h-[22%] w-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/20" />
          <span className="absolute left-1/2 top-1/2 h-[7%] w-[4.5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/70" />

          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 text-xl leading-none"
            style={{ left: `${aim.x}%`, top: `${aim.y}%` }}
            aria-hidden="true"
          >
            🎯
          </span>
        </div>

        <p className="mt-2 h-4 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
          {last ? `${last.label} · +${last.points}` : ''}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {shots.map((points, index) => (
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
            Draw three arrows
          </button>
        )}

        {phase === 'running' && (
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              shoot();
            }}
            className="mt-4 w-full select-none rounded-sm bg-primary py-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-primary-foreground active:scale-[0.99]"
          >
            Loose
          </button>
        )}

        {phase === 'done' && (
          <div className="mt-4 rounded-sm border border-primary/40 bg-primary/5 p-3 text-center">
            <p className="display-title text-xl">{result}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {score} of {ARROWS * 50} points
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-3 rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Shoot again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}