import { useState } from 'react';
import { Palette } from 'lucide-react';
import { applyTheme, DEFAULT_THEME, THEMES } from '@/lib/themes';
import { cn } from '@/lib/utils';

export default function ThemePicker({ theme, run }) {
  const [selected, setSelected] = useState(theme || DEFAULT_THEME);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const choose = (name) => {
    setSelected(name);
    applyTheme(name);
  };

  const save = async () => {
    setBusy(true);
    setStatus('');
    try {
      await run('saveTheme', { theme: selected });
      setStatus('National colour theme saved for all visitors.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-md border border-[#D4AF37]/40 bg-card p-6 md:p-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">
        Directive 03 · National Colours
      </span>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {Object.entries(THEMES).map(([name, config]) => (
          <button
            key={name}
            onClick={() => choose(name)}
            className={cn(
              'flex items-center gap-3 rounded-sm border px-3 py-3 text-left transition-colors',
              selected === name
                ? 'border-[#D4AF37] bg-background/60'
                : 'border-border hover:border-[#D4AF37]/50'
            )}
          >
            <span
              className="h-4 w-4 shrink-0 rounded-full border border-white/20"
              style={{ backgroundColor: config.swatch }}
            />
            <span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-foreground">
                {config.label}
              </span>
              <span className="block font-mono text-[10px] text-muted-foreground">
                {config.note}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-sm bg-[#D4AF37] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A0F0D] disabled:opacity-50"
        >
          <Palette className="h-3 w-3" />
          {busy ? 'Transmitting...' : 'Save Theme'}
        </button>
        {status && <span className="font-mono text-[11px] text-muted-foreground">{status}</span>}
      </div>
    </section>
  );
}