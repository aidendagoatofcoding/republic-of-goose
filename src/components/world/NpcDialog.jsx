import { useState } from 'react';
import { X } from 'lucide-react';

// A Zelda-style conversation: one line at a time, then two replies that split the story.
export default function NpcDialog({ target, onClose, onOutcome }) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  if (!target?.dialogue) return null;

  const dialogue = target.dialogue;
  const script = chosen ? [...dialogue.lines, ...chosen.lines] : dialogue.lines;
  const cursor = Math.min(index, script.length - 1);
  const line = script[cursor];
  const atEnd = cursor >= script.length - 1;
  const needsChoice = atEnd && !chosen;

  const advance = () => {
    if (needsChoice) return;
    if (atEnd) {
      onClose();
      return;
    }
    setIndex(cursor + 1);
  };

  const pick = (option) => {
    setChosen(option);
    setIndex(dialogue.lines.length);
    onOutcome?.(option);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="w-full max-w-2xl rounded-sm border-2 border-primary/50 bg-[#0b1310]/97 shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between border-b border-primary/25 px-4 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
            {target.name || dialogue.speaker}
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

        <button
          type="button"
          onClick={advance}
          className="block w-full px-4 py-4 text-left"
        >
          <p className="text-[15px] leading-relaxed text-foreground">{line}</p>
          {!needsChoice && (
            <span className="mt-2 block animate-pulse font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              ▼ {atEnd ? 'close' : 'next'}
            </span>
          )}
        </button>

        {needsChoice && (
          <div className="grid gap-2 border-t border-primary/20 px-4 py-3 sm:grid-cols-2">
            {dialogue.choices.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => pick(option)}
                className="rounded-sm border border-border bg-secondary/60 px-3 py-2 text-left text-[13px] leading-snug text-foreground transition-colors hover:border-primary/70 hover:text-primary"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}