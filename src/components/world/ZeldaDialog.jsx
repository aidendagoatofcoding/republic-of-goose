import { useEffect } from 'react';
import { X } from 'lucide-react';
import QuestPanel from '@/components/world/QuestPanel';
import useConversation from '@/hooks/useConversation';

// A Zelda-style conversation: one sentence per box, typed out letter by letter,
// Enter to move on, and a question you answer with a key press.
export default function ZeldaDialog({ target, onClose }) {
  const { beat, text, typed, typing, advance, choose, busy, atEnd } = useConversation(target);

  const step = () => {
    if (advance() === 'end') onClose();
  };

  useEffect(() => {
    if (!target) return;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (beat?.options) return;
        step();
        return;
      }
      if (beat?.options && !typing) {
        const index = Number(event.key) - 1;
        if (index >= 0 && index < beat.options.length) {
          event.preventDefault();
          choose(beat.options[index]);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!target || !beat) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="w-full max-w-2xl rounded-sm border-2 border-primary/50 bg-[#0b1310]/97 shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between border-b border-primary/25 px-4 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
            {target.name}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="End the conversation"
            className="text-muted-foreground hover:text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {beat.quest ? (
          <div className="px-4 py-4">
            <QuestPanel questId={beat.quest} />
          </div>
        ) : (
          <button type="button" onClick={step} className="block w-full px-4 py-4 text-left">
            <p className="min-h-[3.4em] text-[15px] leading-relaxed text-foreground">
              {text.slice(0, typed)}
              {typing && (
                <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />
              )}
            </p>
            {!beat.options && !typing && (
              <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                ▼ {atEnd ? 'close' : 'next'}
              </span>
            )}
          </button>
        )}

        {beat.options && !typing && (
          <div className="grid gap-2 border-t border-primary/20 px-4 py-3 sm:grid-cols-3">
            {beat.options.map((option, index) => (
              <button
                key={option.label}
                type="button"
                disabled={busy}
                onClick={() => choose(option)}
                className="rounded-sm border border-border bg-secondary/60 px-3 py-2 text-left text-[13px] leading-snug text-foreground transition-colors hover:border-primary/70 hover:text-primary disabled:opacity-50"
              >
                <span className="mr-1.5 font-mono text-[10px] text-primary">{index + 1}</span>
                {option.label}
              </button>
            ))}
          </div>
        )}

        {beat.quest && (
          <div className="flex justify-end border-t border-primary/20 px-4 py-2">
            <button
              type="button"
              onClick={step}
              className="rounded-sm border border-primary/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
            >
              {atEnd ? 'Close' : 'Very well'} ⏎
            </button>
          </div>
        )}
      </div>
    </div>
  );
}