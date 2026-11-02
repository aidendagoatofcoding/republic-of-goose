import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { speciesInfo } from '@/lib/species';

const HURDLES = 5;
const SPEED = 46;
const WINDOW = [14, 32];
const CLEAR_POINTS = 20;

const START_POSITIONS = [120, 158, 196, 234, 272];

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 p-3 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-md border border-primary/40 bg-card p-4 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              Honk Champion Isle · Reed Race
            </p>
            <p className="mt-1 font-display text-xl font-bold">Jump the reeds</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Leave track
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>
            Score {score} · {cleared}/{HURDLES} cleared
          </span>
          <span>{elapsed.toFixed(2)} s</span>
          <span>{missed} missed</span>
        </div>

        <div className="relative mt-1 h-24 overflow-hidden rounded-sm border border-border/70 bg-secondary/50">
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#2b3b2f]" />
          <span
            className="absolute bottom-[30%] z-10 text-2xl leading-none"
            style={{
              left: '9%',
              transform: jumping ? 'translate(-50%, -26px)' : 'translate(-50%, 0)',
              transition: 'transform 140ms ease-out',
            }}
            aria-hidden="true"
          >
            {speciesInfo(species).emoji}
          </span>
          <span className="absolute inset-y-0 left-[14%] w-px bg-primary/40" />
          <span className="absolute inset-y-0 left-[32%] w-px bg-primary/20" />
          {hurdles.map((hurdle) => (
            <span
              key={hurdle.id}
              className="absolute bottom-[28%] -translate-x-1/2 text-xl leading-none"
              style={{ left: `${hurdle.x}%` }}
              aria-hidden="true"
            >
              🌾
            </span>
          ))}
        </div>

        <p className="mt-2 h-4 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
          {flash}
        </p>

        {phase === 'ready' && (
          <button
            type="button"
            onClick={start}
            className="mt-2 w-full rounded-sm bg-primary py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Take the lane
          </button>
        )}

        {phase === 'running' && (
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              jump();
            }}
            className="mt-2 w-full select-none rounded-sm bg-primary py-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-primary-foreground active:scale-[0.99]"
          >
            Jump
          </button>
        )}

        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          {phase === 'running' ? 'jump between the markers · space bar works too' : ''}
        </p>

        {phase === 'done' && (
          <div className="mt-2 rounded-sm border border-primary/40 bg-primary/5 p-3 text-center">
            <p className="display-title text-xl">{result}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {score} points · {missed} missed · {finalTime.toFixed(2)} s
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