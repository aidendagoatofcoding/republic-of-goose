import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { speciesInfo } from '@/lib/species';

const DISTANCE = 100;
const RIVAL_SECONDS = 13.5;
const TAP_GAIN = 2.6;

function Lane({ label, value, emoji }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{label}</span>
        <span>{Math.round(value)} m</span>
      </div>
      <div className="relative mt-1 h-9 overflow-hidden rounded-sm border border-border/70 bg-secondary/60">
        <div className="absolute inset-y-0 right-0 w-[3px] bg-primary/60" />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl leading-none"
          style={{ left: `${Math.max(4, Math.min(96, value))}%` }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      </div>
    </div>
  );
}

export default function SprintGame({ species = 'goose', onClose, onFinish }) {
  const [phase, setPhase] = useState('ready');
  const [mine, setMine] = useState(0);
  const [rival, setRival] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [honks, setHonks] = useState(0);
  const [result, setResult] = useState('');

  const mineRef = useRef(0);
  const finishedRef = useRef(false);
  const startRef = useRef(0);
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const stop = useCallback(() => {
    runningRef.current = false;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const finish = useCallback(
    (won) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      stop();
      setPhase('done');
      setResult(won ? 'You take the ribbon!' : 'The Champion holds the ribbon.');
      finishRef.current?.(Math.round(mineRef.current));
    },
    [stop]
  );

  const start = () => {
    stop();
    mineRef.current = 0;
    finishedRef.current = false;
    startRef.current = performance.now();
    runningRef.current = true;
    setMine(0);
    setRival(0);
    setSeconds(0);
    setHonks(0);
    setResult('');
    setPhase('running');
  };

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const step = (now) => {
      if (!runningRef.current) return;
      const elapsed = (now - startRef.current) / 1000;
      setSeconds(elapsed);
      const nextRival = Math.min(DISTANCE, (elapsed / RIVAL_SECONDS) * DISTANCE);
      setRival(nextRival);
      if (nextRival >= DISTANCE) {
        finish(false);
        return;
      }
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [phase, finish]);

  const tap = useCallback(() => {
    if (phase !== 'running' || finishedRef.current) return;
    mineRef.current = Math.min(DISTANCE, mineRef.current + TAP_GAIN);
    setMine(mineRef.current);
    setHonks((count) => count + 1);
    if (mineRef.current >= DISTANCE) finish(true);
  }, [phase, finish]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tap]);

  useEffect(() => stop, [stop]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 p-3 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-md border border-primary/40 bg-card p-4 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              Honk Champion Isle · Honk Sprint
            </p>
            <p className="mt-1 font-display text-xl font-bold">The 100 m dash</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Leave track
          </button>
        </div>

        <Lane label="You" value={mine} emoji={speciesInfo(species).emoji} />
        <Lane label="Isle Champion" value={rival} emoji={speciesInfo('goose').emoji} />

        {phase === 'ready' && (
          <button
            type="button"
            onClick={start}
            className="mt-4 w-full rounded-sm bg-primary py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Start the race
          </button>
        )}

        {phase === 'running' && (
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              tap();
            }}
            className="mt-4 w-full select-none rounded-sm bg-primary py-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-primary-foreground active:scale-[0.99]"
          >
            HONK
          </button>
        )}

        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          {phase === 'running'
            ? `${honks} honks · ${seconds.toFixed(1)}s`
            : 'honk to run · space bar works too'}
        </p>

        {phase === 'done' && (
          <div className="mt-4 rounded-sm border border-primary/40 bg-primary/5 p-3 text-center">
            <p className="display-title text-xl">{result}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {Math.round(mine)} m in {seconds.toFixed(1)}s · {honks} honks
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-3 rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Race again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}