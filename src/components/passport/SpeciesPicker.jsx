import { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import { SPECIES } from '@/lib/species';

export default function SpeciesPicker({ species }) {
  const { run } = useCitizen();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const choose = async (value) => {
    if (value === species) {
      setOpen(false);
      return;
    }
    setBusy(value);
    setError('');
    try {
      await run({ action: 'changeSpecies', species: value });
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/60 hover:text-primary"
      >
        <PawPrint className="h-3 w-3" /> {open ? 'Close animals' : 'Change animal'}
      </button>

      {open && (
        <div className="mt-3 grid gap-2 border border-border/70 bg-secondary/30 p-3 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIES.map((option) => {
            const active = option.value === species;
            return (
              <button
                key={option.value}
                type="button"
                disabled={Boolean(busy)}
                onClick={() => choose(option.value)}
                className={`rounded-sm border px-2.5 py-2 text-left transition-colors disabled:opacity-60 ${
                  active
                    ? 'border-primary/70 bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:border-primary/50'
                }`}
              >
                <span className="block text-[15px] leading-none">
                  <span aria-hidden="true">{option.emoji}</span>{' '}
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
                    {busy === option.value ? 'Changing' : option.label}
                  </span>
                </span>
                <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                  {option.note}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 font-mono text-[11px] text-[#FF6B4A]">
          {error}
        </p>
      )}
    </div>
  );
}