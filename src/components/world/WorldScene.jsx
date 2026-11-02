import { useCallback, useEffect, useRef, useState } from 'react';
import HouseSprite from '@/components/world/HouseSprite';
import MeadowGround from '@/components/world/MeadowGround';
import Walker from '@/components/world/Walker';
import WorldBubble from '@/components/world/WorldBubble';
import useCommonsRoom from '@/hooks/useCommonsRoom';

const clamp = (value, min = 4, max = 96) => Math.min(max, Math.max(min, value));

const NPC_LINES = ['HONK!', 'Lovely day.', 'Any bread?', 'Mind the pond.', 'HONK honk.'];
const KNOCKS = ['Come in!', 'Who honks there?', 'Door is open.', 'Wipe your webbed feet.'];
const pick = (list) => list[Math.floor(Math.random() * list.length)];

export default function WorldScene({ residents, onMove, placing, onPlace, onCancelPlace, profile }) {
  const boxRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [ghost, setGhost] = useState(null);
  const draggedRef = useRef(false);
  const [bubbles, setBubbles] = useState({});
  const [wander, setWander] = useState({});

  const mine = residents.find((resident) => resident.is_me) || null;
  const myHome = mine?.spots.find((spot) => spot.category === 'home');
  const [me, setMe] = useState({
    x: clamp((myHome?.x ?? 50) + (myHome ? 5 : 0), 8, 92),
    y: clamp((myHome?.y ?? 58) + 9, 18, 92),
    face: 1,
  });
  const meRef = useRef(me);

  const say = useCallback((key, text) => {
    setBubbles((current) => ({ ...current, [key]: { text, at: Date.now() } }));
  }, []);

  const handleHonk = useCallback(
    (event) => {
      say(`seat:${event.from}`, 'HONK!');
      if (event.target) say(`seat:${event.target}`, 'HONK!');
    },
    [say]
  );

  const { people, seat, connected, move, honk } = useCommonsRoom({ profile, onHonk: handleHonk });
  const myKey = seat ? `seat:${seat}` : 'me';

  const send = useCallback(
    (next) => {
      meRef.current = next;
      setMe(next);
      move(next.x, next.y, next.face);
    },
    [move]
  );

  useEffect(() => {
    if (connected) move(meRef.current.x, meRef.current.y, meRef.current.face);
  }, [connected, move]);

  const stepTo = useCallback(
    (point) => {
      const current = meRef.current;
      send({
        x: clamp(point.x),
        y: clamp(point.y, 18, 94),
        face: point.x >= current.x ? 1 : -1,
      });
    },
    [send]
  );

  const stepBy = useCallback(
    (dx, dy) => {
      const current = meRef.current;
      send({
        x: clamp(current.x + dx),
        y: clamp(current.y + dy, 18, 94),
        face: dx < 0 ? -1 : dx > 0 ? 1 : current.face,
      });
    },
    [send]
  );

  useEffect(() => {
    const onKey = (event) => {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const key = event.key?.toLowerCase();
      const deltas = {
        arrowleft: [-3, 0],
        arrowright: [3, 0],
        arrowup: [0, -3],
        arrowdown: [0, 3],
        a: [-3, 0],
        d: [3, 0],
        w: [0, -3],
        s: [0, 3],
      };
      const delta = deltas[key];
      if (!delta) return;
      event.preventDefault();
      stepBy(delta[0], delta[1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stepBy]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWander((current) => {
        const next = { ...current };
        residents.forEach((resident, index) => {
          if (resident.is_me) return;
          const home = resident.spots.find((spot) => spot.category === 'home');
          const base = home || { x: 24 + ((index * 19) % 56), y: 46 + ((index * 13) % 32) };
          if (Math.random() < 0.45) {
            next[resident.key] = {
              x: clamp(base.x + (Math.random() - 0.5) * 20, 8, 92),
              y: clamp(base.y + (Math.random() - 0.5) * 14 + 6, 20, 92),
              face: Math.random() > 0.5 ? 1 : -1,
            };
          }
          resident.spots
            .filter((spot) => spot.category === 'pet')
            .forEach((spot) => {
              if (Math.random() < 0.4) {
                next[spot.item_id] = {
                  x: clamp(spot.x + (Math.random() - 0.5) * 10, 5, 95),
                  y: clamp(spot.y + (Math.random() - 0.5) * 8, 12, 94),
                  face: Math.random() > 0.5 ? 1 : -1,
                };
              }
            });
        });
        return next;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [residents]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBubbles((current) => {
        const now = Date.now();
        const next = {};
        let changed = false;
        Object.entries(current).forEach(([key, value]) => {
          if (now - value.at < 2600) next[key] = value;
          else changed = true;
        });
        return changed ? next : current;
      });
    }, 700);
    return () => clearInterval(timer);
  }, []);

  const toPercent = (event) => {
    const rect = boxRef.current.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100),
    };
  };

  const startDrag = (event, spot) => {
    if (placing) return;
    event.preventDefault();
    draggedRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDrag({ item_id: spot.item_id, x: spot.x, y: spot.y });
  };

  const handlePointerMove = (event) => {
    if (placing) {
      setGhost(toPercent(event));
      return;
    }
    if (!drag || !boxRef.current) return;
    const next = toPercent(event);
    draggedRef.current = true;
    setDrag((current) => (current ? { ...current, ...next } : current));
  };

  const endDrag = () => {
    if (!drag) return;
    onMove(drag.item_id, drag.x, drag.y);
    setDrag(null);
  };

  const handleClick = (event) => {
    if (placing) {
      const spot = toPercent(event);
      onPlace(spot.x, spot.y);
      return;
    }
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    if (!mine) return;
    stepTo(toPercent(event));
  };

  const knock = (resident, spot) => {
    say(`house:${spot.item_id}`, pick(KNOCKS));
    if (!resident.is_me && Math.random() < 0.7) {
      say(resident.key, `${String(resident.name).split(' ')[0]} honks back.`);
    }
  };

  const honkAt = (targetSeat) => {
    say(myKey, 'HONK!');
    if (targetSeat) say(`seat:${targetSeat}`, 'HONK!');
    honk(targetSeat || 0);
  };

  const live = people.filter((person) => person.seat !== seat);

  return (
    <div
      ref={boxRef}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClick={handleClick}
      className={`relative aspect-[4/3] w-full touch-none overflow-hidden rounded-md border border-border/80 bg-secondary/40 md:aspect-[16/10] ${
        placing ? 'cursor-crosshair ring-1 ring-primary/50' : ''
      }`}
    >
      <MeadowGround />

      {placing && (
        <div className="absolute left-2 top-2 z-40 flex items-center gap-2 rounded-sm border border-primary/50 bg-card/95 px-2.5 py-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
            Tap the meadow to place {placing.name}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCancelPlace();
            }}
            className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {!placing && mine && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            say(myKey, 'HONK!');
            honk(0);
          }}
          className="absolute right-2 top-2 z-40 rounded-sm border border-primary/60 bg-card/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary hover:bg-primary/10"
        >
          Honk
        </button>
      )}

      {placing && ghost && (
        <div
          style={{ left: `${ghost.x}%`, top: `${ghost.y}%` }}
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-[88%] opacity-70"
        >
          {placing.category === 'home' ? (
            <HouseSprite name={placing.name} className="w-[74px] sm:w-[86px]" />
          ) : (
            <span className="block text-3xl" aria-hidden="true">
              {placing.emoji}
            </span>
          )}
        </div>
      )}

      {residents.length === 0 && (
        <p className="absolute inset-0 z-30 flex items-center justify-center px-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          The Commons are empty. Be the first to build here.
        </p>
      )}

      {residents.flatMap((resident) =>
        resident.spots
          .filter((spot) => spot.category === 'home')
          .map((spot) => {
            const dragging = resident.is_me && drag?.item_id === spot.item_id;
            const x = dragging ? drag.x : spot.x;
            const y = dragging ? drag.y : spot.y;
            const bubble = bubbles[`house:${spot.item_id}`]?.text;
            return (
              <button
                key={spot.item_id}
                type="button"
                aria-label={`${spot.name}, ${resident.is_me ? 'your home' : `${resident.name}'s home`}`}
                onPointerDown={resident.is_me ? (event) => startDrag(event, spot) : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  if (draggedRef.current) {
                    draggedRef.current = false;
                    return;
                  }
                  knock(resident, spot);
                }}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-[88%] ${
                  resident.is_me && !placing ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                }`}
              >
                {bubble && <WorldBubble text={bubble} />}
                <HouseSprite
                  name={spot.name}
                  className="w-[68px] drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)] sm:w-[84px]"
                />
                <span className="mt-0.5 block max-w-[104px] truncate font-mono text-[8px] uppercase tracking-[0.1em] text-foreground/70">
                  {spot.name}
                </span>
              </button>
            );
          })
      )}

      {residents.flatMap((resident) =>
        resident.spots
          .filter((spot) => spot.category !== 'home')
          .map((spot) => {
            const dragging = resident.is_me && drag?.item_id === spot.item_id;
            const isPet = spot.category === 'pet';
            const drift = isPet ? wander[spot.item_id] : null;
            const x = dragging ? drag.x : drift ? drift.x : spot.x;
            const y = dragging ? drag.y : drift ? drift.y : spot.y;
            return (
              <div
                key={spot.item_id}
                title={spot.name}
                onPointerDown={resident.is_me ? (event) => startDrag(event, spot) : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  if (draggedRef.current) draggedRef.current = false;
                }}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transition: dragging ? 'none' : 'left 2.6s linear, top 2.6s linear',
                }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none text-center leading-none ${
                  resident.is_me && !placing
                    ? 'cursor-grab active:cursor-grabbing'
                    : 'pointer-events-none'
                }`}
              >
                <span
                  className="block"
                  style={{ transform: drift?.face === -1 ? 'scaleX(-1)' : undefined }}
                  aria-hidden="true"
                >
                  <span className={`block ${isPet ? 'meadow-bob' : ''} ${dragging ? 'text-4xl' : 'text-3xl'}`}>
                    {spot.emoji}
                  </span>
                </span>
                {spot.category === 'vehicle' && (
                  <span className="mt-1 block max-w-[92px] truncate font-mono text-[8px] uppercase tracking-[0.1em] text-foreground/70">
                    {spot.name}
                  </span>
                )}
              </div>
            );
          })
      )}

      {residents
        .filter((resident) => !resident.is_me)
        .map((resident, index) => {
          const home = resident.spots.find((spot) => spot.category === 'home');
          const base = home || { x: 24 + ((index * 19) % 56), y: 46 + ((index * 13) % 32) };
          const position = wander[resident.key] || {
            x: base.x + 5,
            y: base.y + 9,
            face: 1,
          };
          return (
            <Walker
              key={resident.key}
              label={resident.name}
              species={resident.species}
              avatar={resident.avatar_url}
              worn={resident.worn}
              x={position.x}
              y={position.y}
              face={position.face}
              bubble={bubbles[resident.key]?.text}
              speed="2.6s"
              onPoke={() => {
                say(resident.key, pick(NPC_LINES));
                honkAt(0);
              }}
            />
          );
        })}

      {live.map((person) => (
        <Walker
          key={`person-${person.seat}`}
          label={person.name}
          species={person.species}
          worn={person.worn}
          x={person.x}
          y={person.y}
          face={person.face}
          bubble={bubbles[`seat:${person.seat}`]?.text}
          speed="1.4s"
          onPoke={() => honkAt(person.seat)}
        />
      ))}

      {mine && (
        <Walker
          label="You"
          species={mine.species}
          avatar={mine.avatar_url}
          worn={mine.worn}
          x={me.x}
          y={me.y}
          face={me.face}
          isMe
          bubble={bubbles[myKey]?.text}
          speed="0.45s"
          onPoke={() => {
            say(myKey, 'HONK!');
            honk(0);
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex flex-wrap items-end justify-between gap-2 p-2">
        <p className="rounded-sm border border-border/70 bg-card/90 px-2 py-1 font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
          Tap the meadow to walk · arrow keys to move · tap a neighbour to honk · tap a house to knock
        </p>
        {connected && (
          <span className="rounded-sm border border-primary/40 bg-card/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-primary">
            {people.length} wandering now
          </span>
        )}
      </div>
    </div>
  );
}