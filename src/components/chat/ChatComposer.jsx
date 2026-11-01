import { useState } from 'react';
import { Send } from 'lucide-react';

const LIMIT = 500;

export default function ChatComposer({ onSend }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    setError('');
    try {
      await onSend(body.slice(0, LIMIT));
      setText('');
    } catch (err) {
      setError('That honk did not make it through. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-border/70 bg-secondary/30 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, LIMIT))}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Honk something to the nation..."
          aria-label="Your message"
          className="min-h-[54px] w-full resize-y rounded-sm border border-input bg-background/80 px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60"
        />
        <button
          onClick={submit}
          disabled={busy || !text.trim()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" /> {busy ? 'Sending' : 'Honk'}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Enter to send · Shift + Enter for a new line
        </span>
        {error ? (
          <span role="alert" className="font-mono text-[10px] text-[#FF6B4A]">
            {error}
          </span>
        ) : (
          <span className="font-mono text-[9px] text-muted-foreground">
            {text.length}/{LIMIT}
          </span>
        )}
      </div>
    </div>
  );
}