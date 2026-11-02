import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const PADS = [
  { id: 0, label: 'Low', emoji: '🪿' },
  { id: 1, label: 'Mid', emoji: '🎵' },
  { id: 2, label: 'High', emoji: '✨' },
  { id: 3, label: 'Soprano', emoji: '🎶' },
];
const WIN_LEVEL = 5;
const SHOW_MS = 520;

const randomPad = () => Math.floor(Math.random() * PADS.length);

export default function ChoirGame({ onClose }) {
  const [phase, setPhase] = useState('ready');
  const [sequence, setSequence] = useState([]);
  const [lit, setLit] = useState(-1);
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState(0);
  const [message, setMessage] = useState('The Champion honks a phrase. Repeat it back.');
  const [result, setResult] = useState('');

  const timers = useRef([]);
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 p-3 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-md border border-primary/40 bg-card p-4 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              Honk Champion Isle · Honk Choir
            </p>
            <p className="mt-1 font-display text-xl font-bold">Repeat the Champion</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Leave choir
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{message}</span>
          <span>
            {level}/{WIN_LEVEL}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {PADS.map((pad) => (
            <button
              key={pad.id}
              type="button"
              onClick={() => press(pad.id)}
              disabled={phase !== 'input'}
              className={`flex items-center justify-center gap-2 rounded-sm border py-4 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                lit === pad.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border/70 bg-secondary/60 text-foreground/80 disabled:opacity-60'
              }`}
            >
              <span aria-hidden="true">{pad.emoji}</span> {pad.label}
            </button>
          ))}
        </div>

        {phase === 'ready' && (
          <button
            type="button"
            onClick={start}
            className="mt-4 w-full rounded-sm bg-primary py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Join the choir
          </button>
        )}

        {phase === 'done' && (
          <div className="mt-4 rounded-sm border border-primary/40 bg-primary/5 p-3 text-center">
            <p className="display-title text-xl">{result}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              reached level {level} of {WIN_LEVEL}
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-3 rounded-sm bg-primary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Sing again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}