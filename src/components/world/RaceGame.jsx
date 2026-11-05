import { useCallback, useEffect, useRef, useState } from 'react';
import ArcadeShell from '@/components/world/arcade/ArcadeShell';
import { speciesInfo } from '@/lib/species';

const HURDLES = 5;
const SPEED = 46;
const WINDOW = [14, 32];
const CLEAR_POINTS = 20;

const START_POSITIONS = [120, 158, 196, 234, 272];

// A reed, drawn properly: a cluster of stalks leaning with the wind.
function Reed({ x }) {
  return (
    <span
      className="pointer-events-none absolute bottom-[26%] -translate-x-1/2"
      style={{ left: `${x}%` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 70" className="h-16 w-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
        <g stroke="#4c7a3f" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M20 70V18" />
          <path d="M13 70V26M27 70V22" stroke="#3c6633" />
        </g>
        <g fill="#8a6a3a">
          <ellipse cx="20" cy="15" rx="3.4" ry="8" />
          <ellipse cx="27" cy="19" rx="2.8" ry="6.5" />
          <ellipse cx="13" cy="23" rx="2.6" ry="6" />
        </g>
      </svg>
    </span>
  );
}

export default function RaceGame({ species = 'goose', onClose, onFinish }) {
  const [phase, setPhase] = useState('ready');
  const [hurdles, setHurdles] = useState([]);
  const [cleared, setCleared] = useState(0);
  const [missed, setMissed] = useState(0);
  const [flash, setFlash] = useState('');
  const [jumping, setJumping] = useState(false);
  const [result, setResult] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  const hurdlesRef = useRef([]);
  const clearedRef = useRef(0);
  const missedRef = useRef(0);
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const lastRef = useRef(0);
  const jumpTimer = useRef(null);
  const clockRef = useRef(0);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const stop = useCallback(() => {
    runningRef.current = false;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (jumpTimer.current) clearTimeout(jumpTimer.current);
  }, []);

  const end = useCallback(() => {
    stop();
    setPhase('done');
    setFinalTime(Math.max(0, (performance.now() - clockRef.current) / 1000));
    const score = clearedRef.current * CLEAR_POINTS;
    setResult(
      score >= HURDLES * CLEAR_POINTS
        ? 'A clean run — the ribbon is yours!'
        : `${clearedRef.current} of ${HURDLES} hurdles cleared.`
    );
    finishRef.current?.(score);
  }, [stop]);

  const start = () => {
    stop();
    hurdlesRef.current = START_POSITIONS.map((x, index) => ({ id: index, x }));
    clearedRef.current = 0;
    missedRef.current = 0;
    lastRef.current = 0;
    setHurdles(hurdlesRef.current);
    setCleared(0);
    setMissed(0);
    setFlash('');
    setResult('');
    setElapsed(0);
    setFinalTime(0);
    clockRef.current = performance.now();
    setPhase('running');
    runningRef.current = true;
  };

  useEffect(() => {
    if (phase !== 'running') return undefined;
    lastRef.current = performance.now();
    const step = (now) => {
      if (!runningRef.current) return;
      const dt = Math.min(0.06, (now - lastRef.current) / 1000);
      lastRef.current = now;
      setElapsed((now - clockRef.current) / 1000);
      const moved = hurdlesRef.current
        .map((hurdle) => ({ ...hurdle, x: hurdle.x - SPEED * dt }))
        .filter((hurdle) => {
          if (hurdle.x < 4) {
            missedRef.current += 1;
            setMissed(missedRef.current);
            return false;
          }
          return true;
        });
      hurdlesRef.current = moved;
      setHurdles(moved);
      if (moved.length === 0) {
        end();
        return;
      }
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [phase, end]);

  const jump = useCallback(() => {
    if (phase !== 'running') return;
    if (jumpTimer.current) clearTimeout(jumpTimer.current);
    setJumping(true);
    jumpTimer.current = setTimeout(() => setJumping(false), 260);

    const target = hurdlesRef.current.find(
      (hurdle) => hurdle.x >= WINDOW[0] && hurdle.x <= WINDOW[1]
    );
    if (!target) {
      setFlash('Too early — steady your feet');
      return;
    }
    hurdlesRef.current = hurdlesRef.current.filter((hurdle) => hurdle.id !== target.id);
    setHurdles(hurdlesRef.current);
    clearedRef.current += 1;
    setCleared(clearedRef.current);
    setFlash(`Cleared! +${CLEAR_POINTS}`);
    if (hurdlesRef.current.length === 0) end();
  }, [phase, end]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jump]);

  useEffect(() => stop, [stop]);

  const score = cleared * CLEAR_POINTS;

  return (
    <ArcadeShell
      event="Reed Race"
      title="Jump the reeds"
      onExit={onClose}
      exitLabel="Leave track"
      hud={[
        { label: 'Score', value: `${score}` },
        { label: 'Cleared', value: `${cleared}/${HURDLES}` },
        { label: 'Time', value: `${elapsed.toFixed(2)}s` },
      ]}
      footer={
        <div>
          {phase === 'running' ? (
            <button
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                jump();
              }}
              className="w-full select-none rounded-sm bg-primary py-5 font-display text-3xl font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_8px_0_rgba(0,0,0,0.45)] active:translate-y-[3px] active:shadow-none"
            >
              Jump
            </button>
          ) : phase === 'ready' ? (
            <button
              type="button"
              onClick={start}
              className="w-full rounded-sm bg-primary py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Take the lane
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-sm border border-primary/40 bg-primary/5 px-3 py-2 sm:flex-row sm:justify-between">
              <p className="font-display text-lg leading-tight text-[#f6ecc9]">{result}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  {score} pts · {missed} missed · {finalTime.toFixed(2)}s
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
          <p className="mt-1.5 h-4 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
            {phase === 'running' ? flash || 'jump between the markers · space bar works too' : ''}
          </p>
        </div>
      }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* the evening sky over the reed beds */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3d4f63] via-[#6d7f74] to-[#2b3b2f]" />
        <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#22303a] to-transparent" />
        <span className="absolute left-[12%] top-[16%] h-10 w-10 rounded-full bg-[#f6ecc9]/80 blur-[1px]" />
        {/* hills at the back */}
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute inset-x-0 top-[38%] h-[16%] w-full">
          <path d="M0 30V16c14-9 28-2 42-7s26-6 40 1 18 8 18 8v12z" fill="#26382c" opacity="0.85" />
        </svg>
        {/* the water of the reed bed */}
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-b from-[#20463f] to-[#12241f]" />
        <div
          className="water-drift absolute inset-x-0 bottom-0 h-[46%] opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(194,255,133,0.5) 0 1px, transparent 1px 14px)',
          }}
          aria-hidden="true"
        />
        {/* the bank the goose runs along */}
        <div className="absolute inset-x-0 bottom-[18%] h-[16%] border-y border-black/40 bg-[#3c5334]" />
        <div
          className="absolute inset-x-0 bottom-[18%] h-[16%] opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 22px)',
          }}
          aria-hidden="true"
        />

        {/* the jump markers */}
        <span className="absolute bottom-[10%] top-[35%] left-[14%] w-px border-l border-dashed border-primary/50" />
        <span className="absolute bottom-[10%] top-[35%] left-[32%] w-px border-l border-dashed border-primary/30" />

        {hurdles.map((hurdle) => (
          <Reed key={hurdle.id} x={hurdle.x} />
        ))}

        <span
          className="absolute bottom-[24%] z-10 text-5xl leading-none"
          style={{
            left: '9%',
            transform: jumping ? 'translate(-50%, -54px) scale(1.05)' : 'translate(-50%, 0)',
            transition: 'transform 140ms ease-out',
            filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.6))',
          }}
          aria-hidden="true"
        >
          {speciesInfo(species).emoji}
        </span>

        <span className="absolute left-3 top-3 rounded-sm border border-primary/30 bg-black/45 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-[#f6ecc9]/75">
          the reed beds · {missed} missed
        </span>
      </div>
    </ArcadeShell>
  );
}