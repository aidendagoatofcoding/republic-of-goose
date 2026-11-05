import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useCitizen } from '@/hooks/useCitizen';
import { kitFor } from '@/lib/petAbilities';
import { sfx } from '@/lib/sfx';

const PET_HP = 90;

// A turn-based bout: you pick one of your pet's three abilities, then the beast answers.
// Each beast follows its own pattern, and the next step is always shown, so the fight can be read.
export default function BossFight({ boss, pet, onClose }) {
  const { run } = useCitizen();
  const kit = kitFor(pet?.name);
  const petHpRef = useRef(PET_HP);
  const bossHpRef = useRef(boss.hp);
  const turnsRef = useRef(0);
  const [bossHp, setBossHp] = useState(boss.hp);
  const [petHp, setPetHp] = useState(PET_HP);
  const [log, setLog] = useState([boss.intro]);
  const [turn, setTurn] = useState('player');
  const [cool, setCool] = useState({});
  // Kept in refs: the beast's turn reads them, and changing them must not restart that turn.
  const guardRef = useRef(0);
  const chargeRef = useRef(0);
  const orderRef = useRef(0);
  const [buried, setBuried] = useState(false);
  const [order, setOrder] = useState(0);
  const [turns, setTurns] = useState(0);
  const [reward, setReward] = useState(null);
  const [slayers, setSlayers] = useState(null);
  const [note, setNote] = useState('');

  const say = (line) => setLog((current) => [...current.slice(-3), line]);
  const setHealth = (value) => {
    petHpRef.current = value;
    setPetHp(value);
  };
  const setBossHealth = (value) => {
    bossHpRef.current = value;
    setBossHp(value);
  };

  const pattern = boss.pattern;
  const next = pattern[order % pattern.length];
  const enraged = Boolean(boss.enrage) && bossHp <= boss.hp / 2;

  useEffect(() => {
    sfx.roar();
  }, []);

  // The beast follows its own pattern: some steps only wind up, some hide, some bite.
  useEffect(() => {
    if (turn !== 'boss') return undefined;
    const timer = setTimeout(() => {
      const enragedNow = Boolean(boss.enrage) && bossHpRef.current <= boss.hp / 2;

      // A beast that regrows does it on its own turn, before it moves.
      if (boss.regen && bossHpRef.current > 0) {
        const healed = Math.min(boss.hp, bossHpRef.current + boss.regen);
        if (healed > bossHpRef.current) {
          setBossHealth(healed);
          say(`Moss knits back over ${boss.name} — ${boss.regen} health.`);
        }
      }

      const step = pattern[orderRef.current % pattern.length];
      orderRef.current += 1;
      setOrder(orderRef.current);
      setCool((current) =>
        Object.fromEntries(
          Object.entries(current).map(([key, value]) => [key, Math.max(0, value - 1)])
        )
      );

      if (step.effect === 'charge') {
        chargeRef.current = step.bonus ?? 7;
        say(`${boss.name} uses ${step.name} — ${step.hint}.`);
        setTurn('player');
        return;
      }
      if (step.effect === 'burrow') {
        setBuried(true);
        say(`${boss.name} uses ${step.name} — ${step.hint}.`);
        setTurn('player');
        return;
      }

      const wound = chargeRef.current;
      const power = step.power + wound + (enragedNow ? boss.enrage : 0);
      const dealt = Math.max(3, power - guardRef.current);
      guardRef.current = 0;
      chargeRef.current = 0;
      sfx.hit();
      say(
        `${boss.name} uses ${step.name} — ${dealt} damage${
          wound > 0 ? ' from the wound-up blow' : ''
        }${enragedNow && wound === 0 ? ', angrier than before' : ''}.`
      );
      if (step.effect === 'drain') {
        const taken = Math.ceil(dealt / 2);
        setBossHealth(Math.min(boss.hp, bossHpRef.current + taken));
        say(`${boss.name} takes ${taken} health back through the roots.`);
      }
      const left = Math.max(0, petHpRef.current - dealt);
      setHealth(left);
      setTurn(left <= 0 ? 'lost' : 'player');
      if (left <= 0) sfx.fail();
    }, 800);
    return () => clearTimeout(timer);
  }, [turn, boss, pattern]);

  // A beaten beast pays out once, through the passport office, and the board is written up.
  useEffect(() => {
    if (turn !== 'won') return undefined;
    let alive = true;
    run({ action: 'bossWin', boss_id: boss.id, turns: turnsRef.current })
      .then((data) => {
        if (!alive) return;
        setReward(data.reward || boss.reward);
        setSlayers(data.boss_boards?.[boss.id] || []);
      })
      .catch((error) => {
        if (alive) setNote(error.message);
      });
    return () => {
      alive = false;
    };
  }, [turn]);

  // Named plainly: a "use…" function would be read as a hook by the linter.
  const spendTurn = (ability) => {
    if (turn !== 'player' || (cool[ability.id] ?? 0) > 0) return;
    sfx.choose();
    turnsRef.current += 1;
    setTurns(turnsRef.current);

    if (ability.kind === 'guard') {
      guardRef.current = ability.power;
      sfx.guard();
      say(`${pet.name} uses ${ability.name} — the next blow lands softer.`);
    } else if (ability.kind === 'mend') {
      setHealth(Math.min(PET_HP, petHpRef.current + ability.power));
      sfx.heal();
      say(`${pet.name} uses ${ability.name} — ${ability.power} health back.`);
    }

    if (ability.kind === 'strike') {
      if (buried) {
        setBuried(false);
        say(`${pet.name} strikes where ${boss.name} was — nothing there.`);
      } else {
        const left = Math.max(0, bossHpRef.current - ability.power);
        setBossHealth(left);
        say(`${pet.name} uses ${ability.name} — ${ability.power} damage.`);
        if (left <= 0) {
          sfx.win();
          setTurn('won');
          return;
        }
      }
    }

    setCool((current) => ({ ...current, [ability.id]: ability.kind === 'strike' ? 1 : 2 }));
    setTurn('boss');
  };

  const reset = () => {
    turnsRef.current = 0;
    orderRef.current = 0;
    chargeRef.current = 0;
    guardRef.current = 0;
    setTurns(0);
    setOrder(0);
    setHealth(PET_HP);
    setBossHealth(boss.hp);
    setLog([boss.intro]);
    setCool({});
    setBuried(false);
    setReward(null);
    setSlayers(null);
    setNote('');
    setTurn('player');
    sfx.roar();
  };

  const bar = (value, total, color) => (
    <span className="block h-2 w-full overflow-hidden rounded-full border border-white/15 bg-black/60">
      <span
        className="block h-full transition-[width] duration-300"
        style={{ width: `${Math.max(0, (value / total) * 100)}%`, background: color }}
      />
    </span>
  );

  const ready = turn === 'player';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050a07]/96 p-3">
      <div
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-sm border-2 bg-[#0a120d] p-3 sm:p-4"
        style={{ borderColor: `${boss.accent}88` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: boss.accent }}>
              {boss.title}
            </p>
            <h2 className="font-display text-xl leading-tight text-[#f6ecc9]">{boss.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Leave the bout"
            className="text-muted-foreground hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-4xl leading-none" style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.7))' }}>
            {boss.glyph}
          </span>
          <span className="flex-1">
            {bar(bossHp, boss.hp, boss.accent)}
            <span className="mt-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              <span>
                {bossHp} / {boss.hp}
              </span>
              {enraged && (
                <span className="text-[#e0664a]">enraged · +{boss.enrage} a blow</span>
              )}
              {boss.regen ? <span>regrows {boss.regen} a turn</span> : null}
            </span>
          </span>
        </div>

        {/* what the beast does next, so its pattern can be learnt */}
        {turn !== 'won' && turn !== 'lost' && next && (
          <p className="mt-2 rounded-sm border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: boss.accent }}>
            {boss.style} · next: {next.name}
            {next.effect === 'charge'
              ? ' — brace or strike now'
              : next.effect === 'burrow'
                ? ' — it will not be there'
                : next.effect === 'drain'
                  ? ' — it heals a little'
                  : ` (${next.power})`}
          </p>
        )}

        <div className="mt-3 max-h-28 overflow-y-auto rounded-sm border border-white/10 bg-black/40 p-2">
          {log.map((line, index) => (
            <p key={`${index}-${line}`} className="font-mono text-[10px] leading-relaxed text-foreground/75">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-3xl leading-none">{pet?.emoji || '🐾'}</span>
          <span className="flex-1">
            <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
              {pet?.name || 'Your pet'} · {kit.name}
            </span>
            {bar(petHp, PET_HP, 'hsl(var(--primary))')}
            <span className="mt-1 block font-mono text-[9px] text-muted-foreground">
              {petHp} / {PET_HP}
            </span>
          </span>
        </div>

        {turn === 'won' ? (
          <div className="mt-3 rounded-sm border border-primary/40 bg-primary/10 p-3">
            <p className="font-display text-base text-primary">
              {boss.name} is beaten{turns > 0 ? ` in ${turns} turns` : ''}.
            </p>
            <p className="mt-1 text-[13px] text-foreground/80">
              {reward
                ? `${reward.bread} bread and ${reward.xp} experience, paid into your passport.`
                : note || 'The passport office is counting it up…'}
            </p>
            {slayers && slayers.length > 0 && (
              <div className="mt-2">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-primary/80">
                  Quickest slayings
                </span>
                <ol className="mt-1 space-y-0.5">
                  {slayers.slice(0, 5).map((row, index) => (
                    <li
                      key={row.id || `${row.name}-${index}`}
                      className="flex items-center justify-between gap-2 font-mono text-[10px] text-foreground/80"
                    >
                      <span className="truncate">
                        {index + 1}. {row.name}
                      </span>
                      <span className="shrink-0 text-primary">{row.turns} turns</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-sm border border-primary/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
            >
              Leave it be
            </button>
          </div>
        ) : turn === 'lost' ? (
          <div className="mt-3 rounded-sm border border-[#e0664a]/50 bg-[#e0664a]/10 p-3">
            <p className="font-display text-base text-[#e0664a]">{pet?.name || 'Your pet'} is spent.</p>
            <p className="mt-1 text-[13px] text-foreground/80">
              {boss.name} is still standing. Rest, then come back at it.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="rounded-sm border border-primary/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary hover:bg-primary/10"
              >
                Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
              >
                Walk away
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {kit.abilities.map((ability) => {
              const waiting = cool[ability.id] ?? 0;
              return (
                <button
                  key={ability.id}
                  type="button"
                  disabled={!ready || waiting > 0}
                  onClick={() => spendTurn(ability)}
                  className="rounded-sm border border-border bg-secondary/60 px-2.5 py-2 text-left transition-colors hover:border-primary/70 hover:text-primary disabled:opacity-45"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
                    {ability.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-foreground/70">
                    {ability.note}
                  </span>
                  <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                    {ability.kind === 'strike'
                      ? `${ability.power} damage · 1 turn`
                      : ability.kind === 'guard'
                        ? `soaks ${ability.power} · 2 turns`
                        : `heals ${ability.power} · 2 turns`}
                    {waiting > 0 ? ` · ready in ${waiting}` : ''}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
          {turn === 'player'
            ? `Your turn${turns > 0 ? ` · turn ${turns + 1}` : ''}`
            : turn === 'boss'
              ? `${boss.name} is moving…`
              : 'The bout is over'}
        </p>
      </div>
    </div>
  );
}