import { useState } from 'react';
import { Hammer } from 'lucide-react';
import ArenaGame from '@/components/arena/ArenaGame';
import SwordsmithPanel from '@/components/arena/SwordsmithPanel';
import { useCitizen } from '@/hooks/useCitizen';

// The warzone portal drops you straight onto the front line. The smith waits at the edge of the field.
export default function WarzoneBattle({ bus, mode = 'horde', onExit }) {
  const { citizen, signedIn, run } = useCitizen();
  const [smithOpen, setSmithOpen] = useState(false);
  const [note, setNote] = useState('');

  const tier = citizen?.sword_tier ?? 0;

  const record = async ({ kills, duels }) => {
    if (!signedIn) return;
    try {
      const data = await run({ action: 'arenaResult', kills, duels });
      if (data.gained) setNote(`+${data.gained} xp`);
    } catch (err) {
      /* the fight is over either way */
    }
  };

  return (
    <>
      <ArenaGame
        bus={bus}
        tier={tier}
        xp={citizen?.xp ?? 0}
        species={citizen?.species || 'goose'}
        mode={mode}
        onExit={onExit}
        onFinish={record}
      />

      <div className="fixed bottom-28 right-3 z-[75] flex flex-col items-end gap-2 sm:bottom-32">
        {note && (
          <span className="rounded-sm border border-primary/40 bg-black/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
            {note}
          </span>
        )}
        <button
          type="button"
          onClick={() => setSmithOpen((value) => !value)}
          className="inline-flex items-center gap-1.5 rounded-sm border border-[#f2c96b]/50 bg-black/70 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f2c96b] hover:bg-[#f2c96b]/15"
        >
          <Hammer className="h-3.5 w-3.5" />
          {smithOpen ? 'Close smith' : 'Smith'}
        </button>
        {smithOpen && (
          <div className="w-[286px] max-w-[calc(100vw-1.5rem)] max-h-[62vh] overflow-y-auto">
            <SwordsmithPanel onNotice={setNote} />
          </div>
        )}
      </div>
    </>
  );
}