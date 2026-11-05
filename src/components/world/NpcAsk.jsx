import { useState } from 'react';
import { Send } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import { askKeeper } from '@/lib/gooseOracle';
import { sfx } from '@/lib/sfx';

// Ask the person in front of you anything. The Goose AI answers in their voice and gives them
// something to do with their hands while they do it.
export default function NpcAsk({ name, role = 'keeper', place = 'the Republic', species = 'goose' }) {
  const { citizen } = useCitizen();
  const [ask, setAsk] = useState('');
  const [turns, setTurns] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async (event) => {
    event.preventDefault();
    const question = ask.trim();
    if (!question || busy) return;
    setBusy(true);
    setError('');
    try {
      const reply = await askKeeper({
        question,
        npc: { name, role, place, species },
        goose: citizen?.goose_name || citizen?.full_name || '',
        history: turns.slice(-4),
      });
      setTurns((current) => [
        ...current.slice(-2),
        { ask: question, said: reply.line, gesture: reply.gesture },
      ]);
      setAsk('');
      sfx.choose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const last = turns[turns.length - 1];

  return (
    <div className="mt-3 border-t border-border/60 pt-2">
      {last && (
        <div className="mb-2 rounded-sm border border-primary/25 bg-primary/5 px-2 py-1.5">
          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
            you asked · {last.ask}
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-foreground">{last.said}</p>
          <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-primary/75">
            {name} {last.gesture}
          </p>
        </div>
      )}

      <form
        onSubmit={send}
        onKeyDown={(event) => event.stopPropagation()}
        className="flex items-center gap-1.5"
      >
        <input
          value={ask}
          onChange={(event) => setAsk(event.target.value)}
          maxLength={200}
          placeholder={`Ask ${name} something…`}
          aria-label={`Ask ${name} something`}
          className="min-w-0 flex-1 rounded-sm border border-input bg-background/80 px-2.5 py-1.5 text-[13px] text-foreground placeholder:text-muted-foreground/60"
        />
        <button
          type="submit"
          disabled={busy || !ask.trim()}
          aria-label="Ask"
          className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm border border-primary/50 text-primary hover:bg-primary/10 disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>

      {busy && (
        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
          {name} is thinking it over…
        </p>
      )}
      {error && (
        <p role="alert" className="mt-1 font-mono text-[9px] text-[#FF6B4A]">
          {error}
        </p>
      )}
    </div>
  );
}