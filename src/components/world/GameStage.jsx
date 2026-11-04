import { X } from 'lucide-react';

// Fullscreen stage for every Champion Isle game.
export default function GameStage({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[65] overflow-y-auto bg-[#070b08]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #c2ff85 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, #c2ff85 0 1px, transparent 1px 64px)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col px-3 py-4 sm:px-6 sm:py-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
              Champion Isle
            </p>
            <h2 className="font-display text-xl leading-tight text-[#f6ecc9] sm:text-2xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-sm border border-primary/45 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
          >
            <X className="h-3.5 w-3.5" />
            Leave the game
          </button>
        </div>
        <div className="flex-1 rounded-md border border-border/70 bg-card/85 p-3 sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}