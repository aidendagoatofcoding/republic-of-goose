import { useState } from 'react';
import { Swords } from 'lucide-react';
import ArenaGame from '@/components/arena/ArenaGame';
import SwordsmithPanel from '@/components/arena/SwordsmithPanel';
import { useCitizen } from '@/hooks/useCitizen';

// The muster point at the front. The portal itself drops you straight into the fight.
export default function WarzoneArena({ arenaBus }) {
  const { citizen, signedIn, run } = useCitizen();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');

  const tier = citizen?.sword_tier ?? 0;

  const recordFight = async ({ kills, duels }) => {
    if (!signedIn) return;
    try {
      const data = await run({ action: 'arenaResult', kills, duels });
      if (data.gained) setNote(`+${data.gained} xp banked from the front line.`);
    } catch (err) {
      /* the fight is over either way */
    }
  };

  if (open) {
    return (
      <ArenaGame
        bus={arenaBus}
        tier={tier}
        xp={citizen?.xp ?? 0}
        onExit={() => setOpen(false)}
        onFinish={recordFight}
      />
    );
  }

  return (
    <div className="space-y-3">
      <SwordsmithPanel onNotice={setNote} />

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[#e0664a]/60 bg-[#e0664a]/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ffb9a5] hover:bg-[#e0664a]/30"
      >
        <Swords className="h-4 w-4" />
        Step onto the front line
      </button>

      <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-[#e8d9b0]/50">
        WASD move · J slash · K stab · H loose arrow · L parry · Shift guard · Space dodge
      </p>

      {note && <p className="font-mono text-[10px] text-primary">{note}</p>}
    </div>
  );
}