import { useCallback, useEffect, useRef, useState } from 'react';
import ArenaField from '@/components/arena/ArenaField';
import ArenaHud from '@/components/arena/ArenaHud';
import { ARENA, ARENA_ATTACKS, withinReach } from '@/lib/arena';
import { swordPower } from '@/lib/swords';

let counter = 0;
const nextId = () => `a${(counter += 1)}`;

const makePlayer = () => ({
  x: 50,
  y: 78,
  aimX: 0,
  aimY: -1,
  hp: ARENA.maxHp,
  stamina: 100,
  parryUntil: 0,
  block: false,
  dashUntil: 0,
  dashX: 0,
  dashY: -1,
  cooldowns: { slash: 0, stab: 0 },
});

export default function ArenaGame({ bus = null, tier = 0, xp = 0, species = 'goose', mode = 'horde', onExit, onFinish }) {
  const playerRef = useRef(makePlayer());
  const ducksRef = useRef([]);
  const remotesRef = useRef(new Map());
  const effectsRef = useRef([]);
  const keysRef = useRef(new Set());
  const killsRef = useRef(0);
  const duelsRef = useRef(0);
  const phaseRef = useRef('fight');
  const spawnRef = useRef({ at: 0, interval: ARENA.spawnMs });
  const lastPostRef = useRef(0);
  const finishedRef = useRef(false);
  const busRef = useRef(bus);
  const tierRef = useRef(tier);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const finishRef = useRef(onFinish);

  const [status, setStatus] = useState({ phase: 'fight', kills: 0, duels: 0 });
  const [, redraw] = useState(0);

  busRef.current = bus;
  tierRef.current = tier;
  finishRef.current = onFinish;

  const hurt = useCallback((amount) => {
    const player = playerRef.current;
    if (!player || phaseRef.current !== 'fight') return;
    const damage = player.block ? amount * 0.3 : amount;
    player.hp = Math.max(0, player.hp - damage);
    if (player.hp <= 0) {
      phaseRef.current = 'down';
      setStatus({ phase: 'down', kills: killsRef.current, duels: duelsRef.current });
      busRef.current?.send?.({
        type: 'arena_pos',
        x: player.x,
        y: player.y,
        hp: 0,
        down: true,
      });
    }
  }, []);

  const attack = useCallback(
    (kind) => {
      const player = playerRef.current;
      const spec = ARENA_ATTACKS[kind];
      if (!player || !spec || phaseRef.current !== 'fight') return;
      const now = performance.now();
      if (now < (player.cooldowns[kind] || 0) || player.stamina < spec.cost) return;

      player.stamina -= spec.cost;
      player.cooldowns[kind] = now + spec.cooldown;
      const damage = spec.damage * swordPower(tierRef.current);

      effectsRef.current.push({
        id: nextId(),
        x: player.x + player.aimX * spec.reach * 0.55,
        y: player.y + player.aimY * spec.reach * 0.55,
        kind,
        until: now + 240,
      });

      let kills = 0;
      const survivors = [];
      ducksRef.current.forEach((duck) => {
        if (!withinReach(player, duck, spec)) {
          survivors.push(duck);
          return;
        }
        const left = duck.hp - damage;
        if (left <= 0) {
          kills += 1;
          effectsRef.current.push({ id: nextId(), x: duck.x, y: duck.y, kind: 'hurt', until: now + 300 });
          return;
        }
        survivors.push({ ...duck, hp: left, stunned: now + 180 });
      });
      ducksRef.current = survivors;
      if (kills > 0) {
        killsRef.current += kills;
        setStatus((current) => ({ ...current, kills: killsRef.current }));
      }

      const room = busRef.current;
      if (room?.send && room.seat) {
        let strikes = 0;
        remotesRef.current.forEach((remote, key) => {
          if (!withinReach(player, remote, spec)) return;
          room.send({ type: 'arena_hit', to: key, kind, damage });
          effectsRef.current.push({ id: nextId(), x: remote.x, y: remote.y, kind: 'hurt', until: now + 300 });
          strikes += 1;
        });
        if (strikes > 0) {
          duelsRef.current += strikes;
          setStatus((current) => ({ ...current, duels: duelsRef.current }));
        }
      }
    },
    []
  );

  const parry = useCallback(() => {
    const player = playerRef.current;
    if (!player || phaseRef.current !== 'fight') return;
    const now = performance.now();
    if (now < player.parryUntil + ARENA.parryMs - 60) return;
    player.parryUntil = now + ARENA.parryMs;
    effectsRef.current.push({ id: nextId(), x: player.x, y: player.y, kind: 'parry', until: now + 380 });
  }, []);

  const dodge = useCallback(() => {
    const player = playerRef.current;
    if (!player || phaseRef.current !== 'fight' || player.stamina < 22) return;
    const now = performance.now();
    player.stamina -= 22;
    player.dashUntil = now + ARENA.dashMs;
    player.dashX = player.aimX;
    player.dashY = player.aimY;
  }, []);

  // Pull a comrade back onto their feet. Helping counts as a duel won in the Republic's books.
  const revive = useCallback(() => {
    const player = playerRef.current;
    if (!player || phaseRef.current !== 'fight') return;
    const room = busRef.current;
    const now = performance.now();
    let helped = 0;
    remotesRef.current.forEach((remote, key) => {
      if (!remote.down) return;
      const dist = Math.hypot(remote.x - player.x, (remote.y - player.y) * 0.62);
      if (dist > ARENA.reviveRange) return;
      room?.send?.({ type: 'arena_revive', to: key });
      effectsRef.current.push({ id: nextId(), x: remote.x, y: remote.y, kind: 'parry', until: now + 420 });
      helped += 1;
    });
    if (helped > 0) {
      duelsRef.current += helped;
      setStatus((current) => ({ ...current, duels: duelsRef.current }));
    }
  }, []);

  const restart = useCallback(() => {
    playerRef.current = makePlayer();
    ducksRef.current = [];
    effectsRef.current = [];
    killsRef.current = 0;
    duelsRef.current = 0;
    phaseRef.current = 'fight';
    spawnRef.current = { at: 0, interval: ARENA.spawnMs };
    finishedRef.current = false;
    setStatus({ phase: 'fight', kills: 0, duels: 0 });
  }, []);

  // One animation loop drives movement, duck swarms and the broadcast of your position.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let lastPaint = 0;

    const step = (now, dt) => {
      const player = playerRef.current;
      player.stamina = Math.min(100, player.stamina + 24 * dt);

      const keys = keysRef.current;
      let vx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
      let vy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
      const dashing = now < player.dashUntil;
      if (dashing) {
        vx = player.dashX;
        vy = player.dashY;
      }
      const length = Math.hypot(vx, vy);
      if (length > 0 && phaseRef.current === 'fight') {
        const nx = vx / length;
        const ny = vy / length;
        player.aimX = nx;
        player.aimY = ny;
        const speed = dashing ? ARENA.dash : ARENA.speed;
        player.x = Math.min(96, Math.max(4, player.x + nx * speed * dt));
        player.y = Math.min(90, Math.max(14, player.y + ny * speed * dt));
      }

      // The duelling ring holds only the geese in the room — no ducks are sent in.
      if (phaseRef.current === 'fight') {
        if (modeRef.current !== 'duel' && now > spawnRef.current.at && ducksRef.current.length < ARENA.maxAlive) {
          spawnRef.current.interval = Math.max(650, ARENA.spawnMs - killsRef.current * 18);
          spawnRef.current.at = now + spawnRef.current.interval;
          ducksRef.current.push({
            id: nextId(),
            hp: ARENA.duckHp,
            x: Math.random() < 0.5 ? 6 + Math.random() * 12 : 82 + Math.random() * 12,
            y: 18 + Math.random() * 66,
            stunned: 0,
            nextBite: now + 900,
          });
        }

        ducksRef.current.forEach((duck) => {
          if (now < duck.stunned) return;
          const dx = player.x - duck.x;
          const dy = player.y - duck.y;
          const dist = Math.hypot(dx, dy * 0.62) || 1;
          if (dist > 6.5) {
            duck.x += (dx / dist) * ARENA.duckSpeed * dt;
            duck.y += (dy / dist) * ARENA.duckSpeed * dt * 0.62;
            return;
          }
          if (now < duck.nextBite) return;
          duck.nextBite = now + 1150;
          if (now < player.parryUntil) {
            duck.stunned = now + 1200;
            duck.hp -= 10;
          } else {
            hurt(ARENA.duckDamage);
          }
        });
        ducksRef.current = ducksRef.current.filter((duck) => duck.hp > 0);
        effectsRef.current = effectsRef.current.filter((effect) => effect.until > now);

        const room = busRef.current;
        if (room?.send && now - lastPostRef.current > 130) {
          lastPostRef.current = now;
          room.send({ type: 'arena_pos', x: player.x, y: player.y, hp: player.hp });
        }
      }
    };

    const loop = (now) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(now, dt);
      if (now - lastPaint > 32) {
        lastPaint = now;
        redraw((value) => value + 1);
      }
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [hurt]);

  useEffect(() => {
    const MAP = {
      arrowleft: 'left',
      a: 'left',
      arrowright: 'right',
      d: 'right',
      arrowup: 'up',
      w: 'up',
      arrowdown: 'down',
      s: 'down',
    };
    const onDown = (event) => {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const key = event.key?.toLowerCase();
      if (key === 'j') {
        attack('slash');
        return;
      }
      if (key === 'k') {
        attack('stab');
        return;
      }
      if (key === 'h') {
        attack('bow');
        return;
      }
      if (key === 'l') {
        parry();
        return;
      }
      if (key === 'r') {
        revive();
        return;
      }
      if (key === ' ') {
        event.preventDefault();
        dodge();
        return;
      }
      if (key === 'shift') {
        event.preventDefault();
        if (playerRef.current) playerRef.current.block = true;
        return;
      }
      const direction = MAP[key];
      if (!direction) return;
      event.preventDefault();
      keysRef.current.add(direction);
    };
    const onUp = (event) => {
      const key = event.key?.toLowerCase();
      if (key === 'shift' && playerRef.current) playerRef.current.block = false;
      const direction = MAP[key];
      if (direction) keysRef.current.delete(direction);
    };
    const clear = () => {
      keysRef.current.clear();
      if (playerRef.current) playerRef.current.block = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', clear);
    };
  }, [attack, parry, dodge, revive]);

  // Blows from other fighters land here.
  useEffect(() => {
    if (!bus?.subscribe) return undefined;
    const off = bus.subscribe((msg) => {
      if (msg.type === 'arena_hit' && msg.to === bus.seat) {
        hurt(msg.damage);
        const player = playerRef.current;
        effectsRef.current.push({
          id: nextId(),
          x: player.x,
          y: player.y,
          kind: 'hurt',
          until: performance.now() + 300,
        });
      } else if (msg.type === 'arena_pos') {
        // The meadow echoes every message back to its sender — never draw yourself twice.
        if (msg.from === bus.seat) return;
        remotesRef.current.set(msg.from, {
          name: msg.name,
          species: msg.species || 'goose',
          x: msg.x,
          y: msg.y,
          hp: msg.hp,
          down: Boolean(msg.down),
          at: performance.now(),
        });
      } else if (msg.type === 'arena_revive' && msg.to === bus.seat) {
        const player = playerRef.current;
        if (player && phaseRef.current === 'down') {
          player.hp = ARENA.reviveHp;
          phaseRef.current = 'fight';
          setStatus((current) => ({ ...current, phase: 'fight' }));
          busRef.current?.send?.({ type: 'arena_pos', x: player.x, y: player.y, hp: player.hp });
        }
      } else if (msg.type === 'arena_leave') {
        remotesRef.current.delete(msg.from);
      }
    });
    return off;
  }, [bus, hurt]);

  useEffect(() => {
    if (status.phase !== 'down' || finishedRef.current) return;
    finishedRef.current = true;
    finishRef.current?.({ kills: killsRef.current, duels: duelsRef.current });
  }, [status.phase]);

  useEffect(
    () => () => {
      busRef.current?.send?.({ type: 'arena_leave' });
    },
    []
  );

  const now = performance.now();
  const remotes = [...remotesRef.current.entries()].filter(([, remote]) => now - remote.at < 4000);

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-[#070b08]">
      <ArenaField
        player={playerRef.current}
        ducks={ducksRef.current}
        remotes={remotes}
        effects={effectsRef.current}
        tier={tier}
        species={species}
      />
      <ArenaHud
        player={playerRef.current}
        kills={status.kills}
        duels={status.duels}
        tier={tier}
        xp={xp}
        phase={status.phase}
        onExit={onExit}
        onRestart={restart}
        onAttack={attack}
        onParry={parry}
        onDodge={dodge}
        onHelp={revive}
        onBlock={() => {
          const player = playerRef.current;
          player.block = !player.block;
        }}
      />
    </div>
  );
}