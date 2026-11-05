import { useCallback, useEffect, useRef, useState } from 'react';
import ArcadeShell from '@/components/world/arcade/ArcadeShell';

const THROWS = 5;
const SWEEP_SECONDS = 2.2;
const TARGET = 150;

const RINGS = [
  { limit: 0.12, points: 50, label: 'Bullseye' },
  { limit: 0.32, points: 30, label: 'Inner ring' },
  { limit: 0.58, points: 15, label: 'Outer ring' },
];
const MISS = { points: 5, label: 'Off the rim' };

export default function BreadToss({ onClose, onFinish }) {
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
      finishRef.current?.(nextScore);
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
    <ArcadeShell
      event="Bread Toss"
      title="Five loaves at the rings"
      onExit={onClose}
      exitLabel="Leave range"
      hud={[
        { label: 'Score', value: `${score}` },
        { label: 'To beat', value: `${TARGET}` },
        { label: 'Loaves', value: `${left}` },
      ]}
      footer={
        <div>
          {phase === 'running' ? (
            <button
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                toss();
              }}
              className="w-full select-none rounded-sm bg-primary py-5 font-display text-3xl font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_8px_0_rgba(0,0,0,0.45)] active:translate-y-[3px] active:shadow-none"
            >
              🍞 Toss
            </button>
          ) : phase === 'ready' ? (
            <button
              type="button"
              onClick={start}
              className="w-full rounded-sm bg-primary py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Take five loaves
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-sm border border-primary/40 bg-primary/5 px-3 py-2 sm:flex-row sm:justify-between">
              <p className="font-display text-lg leading-tight text-[#f6ecc9]">{result}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  {score} of {THROWS * 50} bread points
                </span>
                <button
                  type="button"
                  onClick={start}
                  className="rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  Throw again
                </button>
              </div>
            </div>
          )}
          <div className="mt-1.5 flex min-h-4 items-center justify-center gap-1.5">
            <span className="min-w-32 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
              {last ? `${last.label} · +${last.points}` : ''}
            </span>
          </div>
        </div>
      }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-gradient-to-b from-[#1b2a20] via-[#20301f] to-[#0e1610]">
        {/* the flour barns behind the range */}
        <div className="absolute inset-x-0 top-0 h-[26%] bg-[#16201a]">
          <div
            className="h-full w-full opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #c2ff85 0 1px, transparent 1px 60px)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* the target boards, drawn as a real rack of rings */}
        <div className="absolute inset-x-0 top-[26%] bottom-[16%] flex items-center justify-center px-4">
          <div className="relative h-full w-full max-w-4xl">
            <div className="absolute inset-y-0 left-0 w-full origin-bottom rounded-sm border-4 border-[#5b422d] bg-[#6d5136] shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]">
              {/* painted rings */}
              <span className="absolute inset-y-[10%] left-[22.5%] right-[22.5%] rounded-full border-4 border-[#e8d9a8]/50 bg-[#c2a56b]/25" />
              <span className="absolute inset-y-[26%] left-[34%] right-[34%] rounded-full border-4 border-[#e8d9a8]/70 bg-[#d9a95f]/35" />
              <span className="absolute inset-y-[42%] left-[44%] right-[44%] rounded-full border-4 border-[#f6ecc9] bg-[#e8c07a] shadow-[0_0_24px_rgba(246,236,201,0.5)]" />
              <span className="absolute inset-y-[46%] left-1/2 w-px -translate-x-1/2 bg-[#f6ecc9]/40" />

              {/* the sweeping arm */}
              <span
                className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-primary shadow-[0_0_18px_rgba(190,255,140,0.95)]"
                style={{ left: `${pos * 100}%`, transition: 'left 40ms linear' }}
              />
              <span
                className="absolute top-0 -translate-x-1/2 -translate-y-full text-2xl leading-none"
                style={{ left: `${pos * 100}%`, transition: 'left 40ms linear' }}
                aria-hidden="true"
              >
                🍞
              </span>

              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#3a2b16]">
                50 · bullseye
              </span>
            </div>
          </div>
        </div>

        {/* the throwing line */}
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[#3c5334]">
          <span className="absolute inset-x-0 top-0 h-[2px] bg-[#f6ecc9]/25" />
          <div className="flex items-center justify-center gap-2 pt-3">
            {Array.from({ length: THROWS }, (_, index) => (
              <span
                key={index}
                className={`h-2.5 w-6 rounded-full border ${
                  index < THROWS - left
                    ? 'border-primary/20 bg-primary/10'
                    : 'border-[#e8c07a]/70 bg-[#d9a95f]'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-1.5">
            {hits.map((points, index) => (
              <span
                key={`${points}-${index}`}
                className="rounded-sm border border-primary/40 px-2 py-0.5 font-mono text-[9px] text-primary"
              >
                {points}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ArcadeShell>
  );
}