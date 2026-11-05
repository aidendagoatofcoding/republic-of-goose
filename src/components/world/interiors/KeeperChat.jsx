import { useMemo, useState } from 'react';
import QuestPanel from '@/components/world/QuestPanel';
import useConversation from '@/hooks/useConversation';
import { QUESTS_FOR_PLACE } from '@/lib/quests';

// The keeper behind the counter talks first. A favour only comes up a few lines in,
// and only if you are still standing there to hear it.
export default function KeeperChat({ placeId }) {
  const quest = useMemo(() => QUESTS_FOR_PLACE(placeId)[0] || null, [placeId]);
  const target = useMemo(
    () =>
      quest
        ? { key: quest.id, name: quest.giver, species: 'goose', questId: quest.id }
        : null,
    [quest]
  );
  const { beat, text, typed, typing, advance, choose, busy, atEnd } = useConversation(target);
  const [finished, setFinished] = useState(false);

  if (!target) return null;

  const step = () => {
    if (advance() === 'end') setFinished(true);
  };

  return (
    <div className="rounded-sm border border-[#D4AF37]/40 bg-[#0b1310]/60 p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
        {target.name}
      </p>

      {finished || !beat ? (
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/75">
          That is all for now. Come back when it is done.
        </p>
      ) : beat.quest ? (
        <>
          <div className="mt-2">
            <QuestPanel questId={beat.quest} />
          </div>
          <button
            type="button"
            onClick={step}
            className="mt-3 rounded-sm border border-[#D4AF37]/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            {atEnd ? 'That is all' : 'Right'}
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={step} className="mt-2 block w-full text-left">
            <p className="min-h-[3em] text-[15px] leading-relaxed text-foreground">
              {text.slice(0, typed)}
              {typing && (
                <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />
              )}
            </p>
            {!beat.options && !typing && (
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                ▼ {atEnd ? 'that is all' : 'go on'}
              </span>
            )}
          </button>

          {beat.options && !typing && (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {beat.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  disabled={busy}
                  onClick={() => choose(option)}
                  className="rounded-sm border border-border bg-secondary/60 px-3 py-2 text-left text-[13px] leading-snug text-foreground transition-colors hover:border-primary/70 hover:text-primary disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}