import { useCallback, useEffect, useRef, useState } from 'react';
import ArcadeShell from '@/components/world/arcade/ArcadeShell';

const PADS = [
  { id: 0, label: 'Low', emoji: '🪿', color: '#c2ff85' },
  { id: 1, label: 'Mid', emoji: '🎵', color: '#8ff2e0' },
  { id: 2, label: 'High', emoji: '✨', color: '#ff9ad5' },
  { id: 3, label: 'Soprano', emoji: '🎶', color: '#f2c96b' },
];
const WIN_LEVEL = 5;
const SHOW_MS = 520;

const randomPad = () => Math.floor(Math.random() * PADS.length);

export default function ChoirGame({ onClose, onFinish }) {
  const [phase, setPhase] = useState('ready');
  const [sequence, setSequence] = useState([]);
  const [lit, setLit] = useState(-1);
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState(0);
  const [message, setMessage] = useState('The Champion honks a phrase. Repeat it back.');
  const [result, setResult] = useState('');

  const timers = useRef([]);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const playSequence = useCallback((seq) => {
    clearTimers();
    setPhase('show');
    setStep(0);
    seq.forEach((pad, index) => {
      timers.current.push(setTimeout(() => setLit(pad), index * SHOW_MS));
      timers.current.push(setTimeout(() => setLit(-1), index * SHOW_MS + SHOW_MS * 0.6));
    });
    timers.current.push(
      setTimeout(() => {
        setPhase('input');
        setMessage('Your turn — repeat the phrase.');
      }, seq.length * SHOW_MS + 200)
    );
  }, []);

  const start = () => {
    const first = [randomPad(), randomPad()];
    setLevel(1);
    setResult('');
    setSequence(first);
    setMessage('Level 1 — watch closely.');
    playSequence(first);
  };

  const press = (id) => {
    if (phase !== 'input') return;
    setLit(id);
    timers.current.push(setTimeout(() => setLit(-1), 160));

    if (sequence[step] !== id) {
      clearTimers();
      setPhase('done');
      setMessage('');
      setResult(`The Choir caught you at level ${level}.`);
      finishRef.current?.(Math.max(0, level - 1) * 20);
      return;
    }

    if (step + 1 < sequence.length) {
      setStep(step + 1);
      return;
    }

    if (level >= WIN_LEVEL) {
      clearTimers();
      setPhase('done');
      setMessage('');
      setResult('You completed the Champion’s Choir!');
      finishRef.current?.(WIN_LEVEL * 20);
      return;
    }

    const grown = [...sequence, randomPad()];
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setSequence(grown);
    setStep(0);
    setMessage(`Level ${nextLevel} — watch closely.`);
    timers.current.push(setTimeout(() => playSequence(grown), 700));
    setPhase('show');
  };

  return (
    <ArcadeShell
      event="Honk Choir"
      title="Repeat the Champion"
      onExit={onClose}
      exitLabel="Leave choir"
      hud={[
        { label: 'Level', value: `${level}/${WIN_LEVEL}` },
        { label: 'Phrase', value: `${sequence.length} notes` },
      ]}
      footer={
        <div>
          {phase === 'ready' && (
            <button
              type="button"
              onClick={start}
              className="w-full rounded-sm bg-primary py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Join the choir
            </button>
          )}
          {phase === 'done' && (
            <div className="flex flex-col items-center gap-2 rounded-sm border border-primary/40 bg-primary/5 px-3 py-2 sm:flex-row sm:justify-between">
              <p className="font-display text-lg leading-tight text-[#f6ecc9]">{result}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  reached level {level} of {WIN_LEVEL}
                </span>
                <button
                  type="button"
                  onClick={start}
                  className="rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  Sing again
                </button>
              </div>
            </div>
          )}
          <p className="mt-1.5 h-4 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
            {message}
          </p>
        </div>
      }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-gradient-to-b from-[#241a2e] via-[#1b2a24] to-[#0b120e]">
        {/* the loft windows behind the choir */}
        <div className="absolute inset-x-0 top-0 flex h-[30%] items-end justify-center gap-6 opacity-40">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-full w-16 rounded-t-full border-x border-t border-[#f2c96b]/40 bg-gradient-to-b from-[#f2c96b]/25 to-transparent"
            />
          ))}
        </div>

        <div className="relative grid h-full min-h-0 grid-cols-2 grid-rows-2 gap-2 p-2 sm:gap-4 sm:p-5">
          {PADS.map((pad) => {
            const on = lit === pad.id;
            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => press(pad.id)}
                disabled={phase !== 'input'}
                className="relative flex min-h-0 items-center justify-center gap-2 overflow-hidden rounded-md border-2 font-display text-2xl uppercase tracking-[0.12em] transition-all duration-100 disabled:cursor-default sm:text-3xl"
                style={{
                  borderColor: on ? pad.color : 'rgba(246,236,201,0.18)',
                  background: on
                    ? `radial-gradient(circle at 50% 45%, ${pad.color}cc 0%, ${pad.color}33 65%, rgba(0,0,0,0.4) 100%)`
                    : 'linear-gradient(180deg, rgba(246,236,201,0.08) 0%, rgba(0,0,0,0.42) 100%)',
                  boxShadow: on
                    ? `0 0 48px ${pad.color}99, inset 0 0 40px ${pad.color}55`
                    : 'inset 0 2px 0 rgba(255,255,255,0.06)',
                  color: on ? '#0a1410' : 'rgba(246,236,201,0.72)',
                  transform: on ? 'scale(0.985)' : 'none',
                }}
              >
                <span aria-hidden="true">{pad.emoji}</span>
                <span>{pad.label}</span>
                {on && (
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1"
                    style={{ background: pad.color }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </ArcadeShell>
  );
}