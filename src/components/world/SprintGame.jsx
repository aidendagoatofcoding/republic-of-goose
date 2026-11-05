import { useCallback, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import ArcadeShell from '@/components/world/arcade/ArcadeShell';
import { speciesInfo } from '@/lib/species';

const DISTANCE = 100;
const RIVAL_SECONDS = 13.5;
const TAP_GAIN = 2.6;

// A lane of the Honkton track: the running surface, the crowd bank and the far stand.
function Lane({ label, value, emoji, rival = false }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden border-b border-black/50 last:border-b-0">
      <div
        className="absolute inset-0"
        style={{
          background: rival
            ? 'linear-gradient(180deg, #3a2f22 0%, #4a3c2b 100%)'
            : 'linear-gradient(180deg, #4a3524 0%, #5b422d 100%)',
        }}
      />
      {/* the chalk straps of the track */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 46px)',
        }}
        aria-hidden="true"
      />
      <span className="absolute inset-x-0 top-0 h-[3px] bg-[#f6ecc9]/25" />
      {/* the finish line */}
      <span
        className="absolute inset-y-0 right-0 w-[14px]"
        style={{
          backgroundImage:
            'repeating-conic-gradient(#f6ecc9 0% 25%, #1c1a14 0% 50%)',
          backgroundSize: '14px 14px',
        }}
        aria-hidden="true"
      />
      <span className="absolute left-2 top-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-[#f6ecc9]/70">
        {label}
      </span>
      <span
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl leading-none"
        style={{
          left: `${Math.max(3, Math.min(94, value))}%`,
          transition: 'left 120ms linear',
          filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.6))',
        }}
        aria-hidden="true"
      >
        {emoji}
      </span>
      <span className="absolute bottom-1.5 right-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#f6ecc9]/80">
        {Math.round(value)} m
      </span>
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
    <ArcadeShell
      event="Honk Sprint"
      title="The 100 m dash"
      onExit={onClose}
      exitLabel="Leave track"
      hud={[
        { label: 'You', value: `${Math.round(mine)} m` },
        { label: 'Champion', value: `${Math.round(rival)} m` },
        { label: 'Clock', value: `${seconds.toFixed(1)}s` },
      ]}
      footer={
        <div>
          {phase === 'running' ? (
            <button
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                tap();
              }}
              className="w-full select-none rounded-sm bg-primary py-5 font-display text-3xl font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_8px_0_rgba(0,0,0,0.45)] active:translate-y-[3px] active:shadow-none"
            >
              HONK
            </button>
          ) : phase === 'ready' ? (
            <button
              type="button"
              onClick={start}
              className="w-full rounded-sm bg-primary py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Take your marks
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-sm border border-primary/40 bg-primary/5 px-3 py-2 sm:flex-row sm:justify-between">
              <p className="font-display text-lg leading-tight text-[#f6ecc9]">{result}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  {Math.round(mine)} m in {seconds.toFixed(1)}s · {honks} honks
                </span>
                <button
                  type="button"
                  onClick={start}
                  className="rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  Race again
                </button>
              </div>
            </div>
          )}
          {phase !== 'done' && (
            <p className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {phase === 'running'
                ? `${honks} honks · the space bar works too`
                : 'honk to run · space bar works too'}
            </p>
          )}
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-black/60 bg-[#2b2233]/90 px-3 py-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#f6ecc9]/70">
            Honkton Stadium · final
          </span>
          <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[#f6ecc9]/60">
            <Check className="h-2.5 w-2.5" /> 100 m
          </span>
        </div>
        <Lane label="You" value={mine} emoji={speciesInfo(species).emoji} />
        <Lane label="Isle Champion" value={rival} emoji={speciesInfo('goose').emoji} rival />
        <div className="shrink-0 bg-[#1d2a1f] px-2 py-1 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-[#c2ff85]/50">
          the crowd is honking
        </div>
      </div>
    </ArcadeShell>
  );
}