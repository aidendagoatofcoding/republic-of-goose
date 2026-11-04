import { useState } from 'react';
import { ScrollText } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import { QUESTS, QUESTS_FOR_PLACE, findById } from '@/lib/quests';

// The side quests a keeper of this building has going.
export default function QuestPanel({ placeId, questId }) {
  const { citizen, signedIn, run } = useCitizen();
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const quests = questId
    ? QUESTS.filter((quest) => quest.id === questId)
    : QUESTS_FOR_PLACE(placeId);
  if (quests.length === 0) return null;

  const finds = citizen?.finds ?? [];
  const done = citizen?.quests ?? [];
  const fish = citizen?.fish_caught ?? 0;

  const claim = async (quest) => {
    setBusy(quest.id);
    setError('');
    setNote('');
    try {
      const data = await run({ action: 'claimQuest', quest_id: quest.id });
      setNote(`Paid: 🍞 ${data.reward.bread} and ${data.reward.xp} xp.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-[#D4AF37]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Side quests
        </p>
      </div>

      {quests.map((quest) => {
        const paid = done.includes(quest.id);
        const found = (quest.finds ?? []).filter((id) => finds.includes(id)).length;
        const wanted = (quest.finds ?? []).length;
        const caught = Math.min(quest.fish ?? 0, fish);
        const complete = paid || (found === wanted && caught === (quest.fish ?? 0));
        return (
          <div key={quest.id} className="rounded-sm border border-border/70 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
              {quest.giver}
            </p>
            <h4 className="mt-1 font-display text-lg leading-tight">{quest.title}</h4>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground/70">{quest.brief}</p>

            <ul className="mt-2 space-y-1">
              {(quest.finds ?? []).map((id) => {
                const item = findById(id);
                const have = finds.includes(id);
                return (
                  <li
                    key={id}
                    className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                      have ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {have ? '✓' : '○'} {item?.emoji} {item?.name || id}
                  </li>
                );
              })}
              {quest.fish ? (
                <li
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                    caught >= quest.fish ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  🎣 Fish landed {caught}/{quest.fish}
                </li>
              ) : null}
            </ul>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#D4AF37]">
                🍞 {quest.reward.bread} · {quest.reward.xp} xp
              </span>
              {paid ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                  Paid
                </span>
              ) : (
                <button
                  type="button"
                  disabled={!signedIn || !complete || busy === quest.id}
                  onClick={() => claim(quest)}
                  className="rounded-sm bg-[#D4AF37] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#0A0F0D] disabled:opacity-40"
                >
                  {busy === quest.id ? 'Collecting...' : complete ? 'Turn in' : 'Not finished'}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {!signedIn && (
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Sign in with a passport to take on quests.
        </p>
      )}
      {note && <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{note}</p>}
      {error && (
        <p role="alert" className="font-mono text-[11px] text-[#FF6B4A]">
          {error}
        </p>
      )}
    </div>
  );
}