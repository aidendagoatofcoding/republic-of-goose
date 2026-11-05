import { useCallback, useEffect, useRef, useState } from 'react';
import ArcadeShell from '@/components/world/arcade/ArcadeShell';

const NESTS = 6;
const ROUND_SECONDS = 25;
const TARGET = 15;
const SPAWN_MS = 850;
const THIEF_MS = 900;

export default function NestGuard({ onClose, onFinish }) {
  const [phase, setPhase] = useState('ready');
  const [thief, setThief] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [result, setResult] = useState('');

  const thiefRef = useRef(-1);
  const scoreRef = useRef(0);
  const timers = useRef([]);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

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
    finishRef.current?.(scoreRef.current);
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
    <ArcadeShell
      event="Nest Guard"
      title="Guard the bread nests"
      onExit={onClose}
      exitLabel="Leave nests"
      hud={[
        { label: 'Caught', value: `${score}/${TARGET}` },
        { label: 'Time', value: `${timeLeft}s` },
      ]}
      footer={
        <div>
          {phase === 'running' && (
            <div className="flex items-center gap-2">
              <span className="h-2 flex-1 overflow-hidden rounded-full border border-border/70 bg-black/60">
                <span
                  className="block h-full bg-primary transition-[width] duration-300"
                  style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
                />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                catch the fox
              </span>
            </div>
          )}
          {phase === 'ready' && (
            <button
              type="button"
              onClick={start}
              className="w-full rounded-sm bg-primary py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Start the watch
            </button>
          )}
          {phase === 'done' && (
            <div className="flex flex-col items-center gap-2 rounded-sm border border-primary/40 bg-primary/5 px-3 py-2 sm:flex-row sm:justify-between">
              <p className="font-display text-lg leading-tight text-[#f6ecc9]">{result}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  {score} thieves caught
                </span>
                <button
                  type="button"
                  onClick={start}
                  className="rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  Guard again
                </button>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-gradient-to-b from-[#1d3324] via-[#2a4130] to-[#101a13]">
        {/* the straw yard and the hedge behind it */}
        <div className="absolute inset-x-0 top-0 h-[22%] bg-[#16241a]">
          <div
            className="h-full w-full opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #c2ff85 0 1px, transparent 1px 46px)',
            }}
            aria-hidden="true"
          />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 top-[22%] opacity-[0.16]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #f2c96b 0 2px, transparent 2px 12px)',
          }}
          aria-hidden="true"
        />

        <div className="relative grid h-full min-h-0 grid-cols-3 grid-rows-2 gap-2 p-2 sm:gap-4 sm:p-5">
          {Array.from({ length: NESTS }, (_, index) => {
            const caught = thief === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => grab(index)}
                disabled={phase !== 'running'}
                className={`relative flex min-h-0 items-center justify-center overflow-hidden rounded-md border-2 transition-colors ${
                  caught
                    ? 'border-[#f2c96b] bg-[#f2c96b]/15'
                    : 'border-black/40 bg-[#243021]/70'
                }`}
              >
                {/* the nesting ring of straw */}
                <span
                  className="absolute inset-x-[12%] bottom-[8%] h-[52%] rounded-[50%] border-4 border-[#8a6a3a]/70 bg-[#6d5136]/70"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-x-[18%] bottom-[12%] h-[42%] rounded-[50%] bg-[#c2a56b]/25"
                  aria-hidden="true"
                />
                {caught ? (
                  <span className="relative -mt-2 text-5xl leading-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)] sm:text-6xl">
                    🦝
                  </span>
                ) : (
                  <span className="relative -mt-1 flex items-center gap-1 text-3xl leading-none sm:text-4xl">
                    <span aria-hidden="true">🥚</span>
                    <span aria-hidden="true">🥚</span>
                  </span>
                )}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-sm bg-black/45 px-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-[#f6ecc9]/60">
                  nest {index + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ArcadeShell>
  );
}