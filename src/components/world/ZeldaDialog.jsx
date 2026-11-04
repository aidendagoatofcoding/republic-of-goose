import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import QuestPanel from '@/components/world/QuestPanel';
import { conversationFor } from '@/lib/dialogues';

const TYPE_MS = 22;

// A Zelda-style conversation: one sentence per box, typed out letter by letter,
// Enter to move on, and a question you answer with a key press.
export default function ZeldaDialog({ target, onClose }) {
  const script = useMemo(() => (target ? conversationFor(target) : null), [target]);
  const [beats, setBeats] = useState([]);
  const [pos, setPos] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    setBeats(script ? script.beats : []);
    setPos(0);
    setTyped(0);
  }, [script]);

  const beat = beats[pos] || null;
  const text = beat?.prompt || beat?.text || '';
  const typing = typed < text.length;

  useEffect(() => {
    if (!text) {
      setTyped(0);
      return;
    }
    setTyped(0);
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setTyped(count);
      if (count >= text.length) clearInterval(timer);
    }, TYPE_MS);
    return () => clearInterval(timer);
  }, [text, pos]);

  const advance = () => {
    if (!beat) return;
    if (typing) {
      setTyped(text.length);
      return;
    }
    if (beat.options) return;
    if (pos >= beats.length - 1) {
      onClose();
      return;
    }
    setPos(pos + 1);
  };

  const choose = (option) => {
    const replies = (option.reply || []).map((line) => ({ text: line }));
    setBeats((current) => [...current.slice(0, pos + 1), ...replies, ...current.slice(pos + 1)]);
    setPos(pos + 1);
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
        advance();
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

  const atEnd = pos >= beats.length - 1;

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
          <button type="button" onClick={advance} className="block w-full px-4 py-4 text-left">
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
                onClick={() => choose(option)}
                className="rounded-sm border border-border bg-secondary/60 px-3 py-2 text-left text-[13px] leading-snug text-foreground transition-colors hover:border-primary/70 hover:text-primary"
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
              onClick={advance}
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