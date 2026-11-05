import { X } from 'lucide-react';

// The Champion Isle arcade: every event takes the whole screen, the way the real
// island's sports do. The playfield fills what is left between the scoreboard and the controls.
export default function ArcadeShell({
  event = 'Champion Isle',
  title,
  hud = [],
  onExit,
  exitLabel = 'Leave',
  footer = null,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[#050a07]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #c2ff85 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, #c2ff85 0 1px, transparent 1px 72px)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, rgba(194,255,133,0.10) 0%, transparent 60%), radial-gradient(90% 70% at 50% 120%, rgba(0,0,0,0.85) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <header className="relative shrink-0 border-b border-primary/20 bg-[#07100a]/92 px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-[0.26em] text-primary/80">
              Honk Champion Isle · {event}
            </p>
            <h2 className="truncate font-display text-xl leading-tight text-[#f6ecc9] sm:text-2xl">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {hud.map((chip) => (
              <span
                key={chip.label}
                className="rounded-sm border border-primary/25 bg-black/40 px-2 py-1 text-right"
              >
                <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
                  {chip.label}
                </span>
                <span className="block font-mono text-[11px] font-bold leading-tight text-primary">
                  {chip.value}
                </span>
              </span>
            ))}
            <button
              type="button"
              onClick={onExit}
              className="ml-1 inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:border-primary/60 hover:text-primary"
            >
              <X className="h-3 w-3" /> {exitLabel}
            </button>
          </div>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col gap-2 p-2 sm:gap-3 sm:p-4">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-primary/25 bg-[#08120c] shadow-[inset_0_0_60px_rgba(0,0,0,0.85)]">
          {children}
        </div>
        {footer && <div className="shrink-0">{footer}</div>}
      </div>
    </div>
  );
}