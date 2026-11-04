import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import { heistQuest } from '@/lib/quests';

const CODE = ['left', 'right', 'left'];

// Three tumblers between a citizen and the national vault. Get the order right.
export default function BankHeist() {
  const { citizen, signedIn, run } = useCitizen();
  const [turn, setTurn] = useState([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const quest = heistQuest();
  const done = (citizen?.quests ?? []).includes(quest.id);

  if (!signedIn) {
    return (
      <p className="text-[13px] text-muted-foreground">
        A goose in a long coat looks you up and down. "No passport, no plan," it says.
      </p>
    );
  }

  if (done) {
    return (
      <div className="space-y-2">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          "You already cleaned it out," the goose says, and will not meet your eye again.
        </p>
      </div>
    );
  }

  const push = async (direction) => {
    if (busy) return;
    const next = [...turn, direction];
    setTurn(next);
    if (next.length < CODE.length) {
      setNote('');
      return;
    }
    if (next.every((value, index) => value === CODE[index])) {
      setBusy(true);
      try {
        const data = await run({ action: 'claimQuest', quest_id: quest.id });
        setNote(`The vault door sighs open. You walk out with 🍞 ${data.reward.bread} and ${data.reward.xp} xp.`);
      } catch (error) {
        setNote(error.message);
      } finally {
        setBusy(false);
      }
      return;
    }
    setNote('A tumbler clunks wrong. The whole lock resets.');
    setTurn([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-[#f2c96b]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f2c96b]">
          The honk heist
        </p>
      </div>

      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Three tumblers on the vault door. Somebody in the street swears it is left, right, left.
        Take a guess and hope the Bank is looking the other way.
      </p>

      <div className="flex justify-center gap-3">
        {[0, 1, 2].map((slot) => (
          <span
            key={slot}
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg ${
              turn[slot]
                ? 'border-[#f2c96b] bg-[#f2c96b]/15 text-[#f2c96b]'
                : 'border-border bg-secondary/50 text-muted-foreground'
            }`}
          >
            {turn[slot] === 'left' ? '↺' : turn[slot] === 'right' ? '↻' : '•'}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => push('left')}
          disabled={busy || turn.length >= CODE.length}
          className="rounded-sm border border-border bg-secondary/60 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-[#f2c96b] hover:text-[#f2c96b] disabled:opacity-40"
        >
          Turn left ↺
        </button>
        <button
          type="button"
          onClick={() => push('right')}
          disabled={busy || turn.length >= CODE.length}
          className="rounded-sm border border-border bg-secondary/60 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-[#f2c96b] hover:text-[#f2c96b] disabled:opacity-40"
        >
          Turn right ↻
        </button>
      </div>

      {turn.length === CODE.length && !note && (
        <button
          type="button"
          onClick={() => setTurn([])}
          className="w-full rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
        >
          Reset the tumblers
        </button>
      )}

      {note && (
        <p className="rounded-sm border border-[#f2c96b]/40 bg-[#f2c96b]/10 px-3 py-2 text-[12px] text-[#f2c96b]">
          {note}
        </p>
      )}
    </div>
  );
}