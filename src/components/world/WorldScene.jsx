import { useCallback, useEffect, useRef, useState } from 'react';
import HouseSprite from '@/components/world/HouseSprite';
import MeadowGround from '@/components/world/MeadowGround';
import Walker from '@/components/world/Walker';
import WorldBubble from '@/components/world/WorldBubble';
import NeighbourDialog from '@/components/world/NeighbourDialog';
import ChampionIsle from '@/components/world/ChampionIsle';
import PongTable from '@/components/world/PongTable';
import SprintGame from '@/components/world/SprintGame';
import BreadToss from '@/components/world/BreadToss';
import ChoirGame from '@/components/world/ChoirGame';
import NestGuard from '@/components/world/NestGuard';
import ArcheryGame from '@/components/world/ArcheryGame';
import RaceGame from '@/components/world/RaceGame';
import Realms from '@/components/world/Realms';
import useCommonsRoom from '@/hooks/useCommonsRoom';
import usePong from '@/hooks/usePong';

const clamp = (value, min = 4, max = 96) => Math.min(max, Math.max(min, value));

const NPC_LINES = ['HONK!', 'Lovely day.', 'Any bread?', 'Mind the pond.', 'HONK honk.'];
const KNOCKS = ['Come in!', 'Who honks there?', 'Door is open.', 'Wipe your webbed feet.'];
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const REACH_PX = 190;
const MOVE_SPEED = 300;

export default function WorldScene({
  residents,
  onMove,
  placing,
  onPlace,
  onCancelPlace,
  profile,
  run,
  onOffersChanged,
  onBoards,
  panelsHidden,
}) {
  const boxRef = useRef(null);
  const [camera, setCamera] = useState(0);
  const [viewTick, setViewTick] = useState(0);
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
  const keysRef = useRef(new Set());
  const walkRef = useRef(null);
  const pendingOfferRef = useRef(null);
  const openOfferRef = useRef(null);
  const lastPublishRef = useRef(0);

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

  const pongHandler = useRef(null);
  const { people, seat, connected, move, honk, send: sendRoom } = useCommonsRoom({
    profile,
    onHonk: handleHonk,
    onPong: (msg) => pongHandler.current?.(msg),
  });
  const pong = usePong({ seat, send: sendRoom });
  pongHandler.current = pong.handlePong;
  const [sport, setSport] = useState('');
  const myKey = seat ? `seat:${seat}` : 'me';

  const [offerTarget, setOfferTarget] = useState(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerBusy, setOfferBusy] = useState(false);
  const [offerError, setOfferError] = useState('');

  useEffect(() => {
    if (connected) move(meRef.current.x, meRef.current.y, meRef.current.face);
  }, [connected, move]);

  const distanceTo = useCallback((spot, position) => {
    const box = boxRef.current;
    if (!box || !position) return null;
    const dx = ((position.x - spot.x) / 100) * box.offsetWidth;
    const dy = ((position.y - spot.y) / 100) * box.offsetHeight;
    return Math.hypot(dx, dy);
  }, []);

  useEffect(() => {
    const onResize = () => setViewTick((value) => value + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    const view = box?.parentElement;
    if (!box || !view) return;
    const worldWidth = box.offsetWidth || view.clientWidth;
    const viewWidth = view.clientWidth;
    if (!viewWidth) return;
    const playerPx = (me.x / 100) * worldWidth;
    const margin = Math.min(viewWidth * 0.34, 260);
    setCamera((current) => {
      let next = current;
      if (playerPx - next < margin) next = playerPx - margin;
      if (playerPx - next > viewWidth - margin) next = viewWidth - margin;
      return Math.max(0, Math.min(Math.max(0, worldWidth - viewWidth), next));
    });
  }, [me.x, viewTick]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const box = boxRef.current;
      if (!box || !mine || placing) return;
      const width = box.offsetWidth || 1;
      const height = box.offsetHeight || 1;
      const keys = keysRef.current;
      let vx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
      let vy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
      if (vx || vy) {
        walkRef.current = null;
      } else if (walkRef.current) {
        const goal = walkRef.current;
        const gx = ((goal.x - meRef.current.x) / 100) * width;
        const gy = ((goal.y - meRef.current.y) / 100) * height;
        const distance = Math.hypot(gx, gy);
        if (distance < 6) {
          walkRef.current = null;
          return;
        }
        vx = gx / distance;
        vy = gy / distance;
      }
      if (!vx && !vy) return;

      const length = Math.hypot(vx, vy) || 1;
      const nx = vx / length;
      const ny = vy / length;
      const current = meRef.current;
      const next = {
        x: clamp(current.x + ((nx * MOVE_SPEED * dt) / width) * 100, 2, 98),
        y: clamp(current.y + ((ny * MOVE_SPEED * dt) / height) * 100, 14, 96),
        face: nx < -0.05 ? -1 : nx > 0.05 ? 1 : current.face,
      };
      meRef.current = next;
      if (now - lastPublishRef.current > 45) {
        lastPublishRef.current = now;
        setMe(next);
        move(next.x, next.y, next.face);
      }

      const pending = pendingOfferRef.current;
      if (pending) {
        const reach = distanceTo(pending.spot, next);
        if (reach !== null && reach <= REACH_PX) {
          pendingOfferRef.current = null;
          walkRef.current = null;
          openOfferRef.current?.(pending.resident, pending.spot);
        }
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mine, placing, move, distanceTo]);

  useEffect(() => {
    const KEYS = {
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
      const direction = KEYS[event.key?.toLowerCase()];
      if (!direction) return;
      event.preventDefault();
      keysRef.current.add(direction);
    };
    const onUp = (event) => {
      const direction = KEYS[event.key?.toLowerCase()];
      if (!direction) return;
      keysRef.current.delete(direction);
    };
    const clearKeys = () => keysRef.current.clear();
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, []);

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
    const point = toPercent(event);
    walkRef.current = { x: point.x, y: clamp(point.y, 14, 94) };
    pendingOfferRef.current = null;
  };

  const knock = (resident, spot) => {
    say(`house:${spot.item_id}`, pick(KNOCKS));
    if (!resident.is_me && Math.random() < 0.7) {
      say(resident.key, `${String(resident.name).split(' ')[0]} honks back.`);
    }
  };

  const openOffer = (resident, spot) => {
    if (!seat || !run) return;
    const distance = distanceTo(spot, meRef.current);
    if (distance !== null && distance > REACH_PX) {
      walkRef.current = { x: clamp(spot.x, 4, 96), y: clamp(spot.y + 6, 14, 94) };
      pendingOfferRef.current = { resident, spot };
      say(myKey, 'Coming over…');
      return;
    }
    setOfferError('');
    setOfferAmount(String(Math.max(1, Math.round(spot.price ?? 20))));
    setOfferTarget({
      owner_key: resident.key,
      owner_name: resident.name,
      item_id: spot.item_id,
      item_name: spot.name,
      emoji: spot.emoji,
      item_category: spot.category,
      price: spot.price ?? 0,
    });
  };

  openOfferRef.current = openOffer;

  const sendOffer = async () => {
    if (!offerTarget || !run) return;
    setOfferBusy(true);
    setOfferError('');
    try {
      const data = await run({
        action: 'makeOffer',
        to_key: offerTarget.owner_key,
        item_id: offerTarget.item_id,
        amount: Number(offerAmount),
      });
      if (data?.offers) onOffersChanged?.(data.offers);
      say(offerTarget.owner_key, 'Offer sent!');
      setOfferTarget(null);
    } catch (err) {
      setOfferError(err.message);
    } finally {
      setOfferBusy(false);
    }
  };

  const knockTarget = () => {
    if (!offerTarget) return;
    const resident = residents.find((entry) => entry.key === offerTarget.owner_key);
    if (resident) knock(resident, { item_id: offerTarget.item_id });
    setOfferTarget(null);
  };

  const honkAt = (targetSeat) => {
    say(myKey, 'HONK!');
    if (targetSeat) say(`seat:${targetSeat}`, 'HONK!');
    honk(targetSeat || 0);
  };

  const submitScore = useCallback(
    async (event, score) => {
      if (!run) return;
      try {
        const data = await run({ action: 'submitScore', event, score });
        if (data?.boards) onBoards?.(data.boards);
      } catch (err) {
        /* the event still ends even if the standings cannot be reached */
      }
    },
    [run, onBoards]
  );

  const live = people.filter((person) => person.seat !== seat);

  return (
    <div className="relative h-full w-full">
      <div
      ref={boxRef}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClick={handleClick}
      style={{ transform: `translateX(${-camera}px)`, transition: 'transform 260ms ease-out' }}
      className={`absolute inset-y-0 left-0 h-full w-[220%] min-w-[1400px] touch-none overflow-hidden bg-secondary/40 ${
        placing ? 'cursor-crosshair ring-1 ring-inset ring-primary/50' : ''
      }`}
    >
      <MeadowGround />

      <Realms />

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
        <p className="absolute left-0 top-0 z-30 flex h-full w-[45%] items-center justify-center px-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
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
            const distance = resident.is_me ? null : distanceTo(spot, me);
            const reachable = distance !== null && distance <= REACH_PX;
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
                  if (resident.is_me) return;
                  openOffer(resident, spot);
                }}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-[88%] ${
                  resident.is_me && !placing ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                } ${reachable ? 'rounded-md bg-primary/10 ring-1 ring-primary/40' : ''}`}
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
                  if (draggedRef.current) {
                    draggedRef.current = false;
                    return;
                  }
                  if (!resident.is_me) openOffer(resident, spot);
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
          speed="0.16s"
          onPoke={() => {
            say(myKey, 'HONK!');
            honk(0);
          }}
        />
      )}

      </div>

      {placing && (
        <div className="absolute left-2 top-2 z-40 flex items-center gap-2 rounded-sm border border-primary/50 bg-card/95 px-2.5 py-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
            Tap the meadow to place {placing.name}
          </span>
          <button
            type="button"
            onClick={onCancelPlace}
            className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {!placing && mine && (
        <button
          type="button"
          onClick={() => {
            say(myKey, 'HONK!');
            honk(0);
          }}
          className="absolute left-2 top-2 z-40 rounded-sm border border-primary/60 bg-card/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary hover:bg-primary/10"
        >
          Honk
        </button>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-end justify-between gap-2 p-2">
        <p className="max-w-[52%] rounded-sm border border-border/70 bg-card/90 px-2 py-1 font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
          Tap to walk · hold WASD to roam · tap a home nearby to trade
        </p>
        <div className="pointer-events-auto flex items-center gap-1.5">
          {connected && (
            <span className="rounded-sm border border-primary/40 bg-card/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-primary">
              {people.length} wandering now
            </span>
          )}
        </div>
      </div>

      {!panelsHidden && (
        <div className="absolute bottom-10 left-2 z-40 max-h-[54%] w-[216px] max-w-[calc(100%-1rem)] overflow-y-auto sm:w-[248px]">
          <ChampionIsle people={people} seat={seat} pong={pong} onPlay={setSport} />
        </div>
      )}

      {sport === 'choir' && (
        <ChoirGame onClose={() => setSport('')} onFinish={(score) => submitScore('choir', score)} />
      )}
      {sport === 'guard' && (
        <NestGuard onClose={() => setSport('')} onFinish={(score) => submitScore('guard', score)} />
      )}
      {sport === 'archery' && (
        <ArcheryGame
          onClose={() => setSport('')}
          onFinish={(score) => submitScore('archery', score)}
        />
      )}
      {sport === 'race' && (
        <RaceGame
          species={profile?.species}
          onClose={() => setSport('')}
          onFinish={(score) => submitScore('race', score)}
        />
      )}

      {sport === 'sprint' && (
        <SprintGame
          species={profile?.species}
          onClose={() => setSport('')}
          onFinish={(score) => submitScore('sprint', score)}
        />
      )}
      {sport === 'toss' && (
        <BreadToss onClose={() => setSport('')} onFinish={(score) => submitScore('toss', score)} />
      )}

      <NeighbourDialog
        target={offerTarget}
        amount={offerAmount}
        onAmount={setOfferAmount}
        onSend={sendOffer}
        onClose={() => setOfferTarget(null)}
        onKnock={knockTarget}
        busy={offerBusy}
        error={offerError}
        note=""
      />

      {pong.game && (
        <PongTable
          table={pong.table}
          role={pong.game.role}
          opponentName={pong.game.opponentName}
          result={pong.result}
          onMove={pong.setPaddle}
          onQuit={pong.quit}
        />
      )}
    </div>
  );
}