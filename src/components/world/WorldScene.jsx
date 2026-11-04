import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HouseSprite from '@/components/world/HouseSprite';
import MeadowGround from '@/components/world/MeadowGround';
import Places from '@/components/world/Places';
import Walker from '@/components/world/Walker';
import WorldBubble from '@/components/world/WorldBubble';
import NeighbourDialog from '@/components/world/NeighbourDialog';
import NeighbourTalk from '@/components/world/NeighbourTalk';
import ChampionIsle from '@/components/world/ChampionIsle';
import PongTable from '@/components/world/PongTable';
import SprintGame from '@/components/world/SprintGame';
import BreadToss from '@/components/world/BreadToss';
import ChoirGame from '@/components/world/ChoirGame';
import NestGuard from '@/components/world/NestGuard';
import ArcheryGame from '@/components/world/ArcheryGame';
import RaceGame from '@/components/world/RaceGame';
import Realms from '@/components/world/Realms';
import Roads from '@/components/world/Roads';
import NeighbourHouses from '@/components/world/NeighbourHouses';
import { nearestRoad, pointOnRoad, spotOnRoadNear } from '@/lib/roads';
import SportVenue from '@/components/world/SportVenue';
import PlaceInterior from '@/components/world/interiors/PlaceInterior';
import PetPanel from '@/components/world/PetPanel';
import WarzoneBattle from '@/components/arena/WarzoneBattle';
import CivicBuilding from '@/components/world/areas/CivicBuilding';
import { VENUES, VENUE_BY_ID } from '@/lib/isleVenues';
import { placeFor } from '@/lib/places';
import RealmScene from '@/components/world/RealmScene';
import { REALMS } from '@/lib/realms';
import useCommonsRoom from '@/hooks/useCommonsRoom';
import usePong from '@/hooks/usePong';
import SpawnCircle from '@/components/world/SpawnCircle';
import HomeInterior from '@/components/world/interiors/HomeInterior';
import GameStage from '@/components/world/GameStage';
import CommonsChat from '@/components/world/CommonsChat';
import { SPAWN, PORTAL_RING_RADIUS } from '@/lib/spawn';
import { FINDS } from '@/lib/quests';

const clamp = (value, min = 4, max = 96) => Math.min(max, Math.max(min, value));

const NPC_LINES = [
  'HONK!',
  'Lovely day for it.',
  'Any bread going spare?',
  'Mind the pond, it bites back.',
  'HONK honk.',
  'The bakery queue is shorter at dawn.',
  'Have you seen the new houses on the east road?',
  'The Bank pays better than it used to.',
];
const KNOCKS = ['Come in!', 'Who honks there?', 'Door is open.', 'Wipe your webbed feet.'];
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const REACH_PX = 190;
const MOVE_SPEED = 165;
const RIDE_BOOST = 1.9;

// The National Bakery stands among the stalls of the Market Square. The civic offices of the
// Republic sit inside the Government Plaza portal.
const CIVIC_BUILDINGS = [
  { id: 'bakery', name: 'The National Bakery', variant: 'cottage', x: 72, y: 67, place: 'bakery' },
];

export default function WorldScene({
  residents,
  placing,
  onPlace,
  profile,
  run,
  onOffersChanged,
  onBoards,
  boards = {},
}) {
  const boxRef = useRef(null);
  const [camera, setCamera] = useState(0);
  const [camY, setCamY] = useState(0);
  const [viewTick, setViewTick] = useState(0);
  const [bubbles, setBubbles] = useState({});
  const [wander, setWander] = useState({});

  const mine = residents.find((resident) => resident.is_me) || null;
  const myHome = mine?.spots.find((spot) => spot.category === 'home');
  const myRide = mine?.spots.find((spot) => spot.category === 'vehicle');
  const [riding, setRiding] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [pet, setPet] = useState(null);
  const [me, setMe] = useState({ x: SPAWN.x, y: SPAWN.y, face: 1 });
  const meRef = useRef(me);
  const keysRef = useRef(new Set());
  const placedRef = useRef('');
  const lastPublishRef = useRef(0);
  const centeredRef = useRef(false);
  const enterRef = useRef(null);

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
  const arenaListeners = useRef(new Set());
  const handleArena = useCallback((msg) => {
    arenaListeners.current.forEach((listener) => listener(msg));
  }, []);
  const { people, seat, connected, move, honk, send: sendRoom } = useCommonsRoom({
    profile,
    onHonk: handleHonk,
    onPong: (msg) => pongHandler.current?.(msg),
    onArena: handleArena,
  });

  const arenaBus = useMemo(
    () => ({
      seat,
      people,
      send: sendRoom,
      subscribe: (listener) => {
        arenaListeners.current.add(listener);
        return () => arenaListeners.current.delete(listener);
      },
    }),
    [seat, people, sendRoom]
  );
  const pong = usePong({ seat, send: sendRoom });
  pongHandler.current = pong.handlePong;
  const [sport, setSport] = useState('');
  const [inside, setInside] = useState('');
  const [realm, setRealm] = useState('');
  const [isleOpen, setIsleOpen] = useState(false);
  const myKey = seat ? `seat:${seat}` : 'me';

  const [talk, setTalk] = useState(null);
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
    const box = boxRef.current;
    const observer =
      box && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (box && observer) observer.observe(box);
    return () => {
      window.removeEventListener('resize', onResize);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    const view = box?.parentElement;
    if (!box || !view) return;
    const worldWidth = box.offsetWidth;
    const viewWidth = view.clientWidth;
    if (!worldWidth || !viewWidth) return;
    const playerPx = (me.x / 100) * worldWidth;
    const margin = Math.min(viewWidth * 0.34, 260);
    const limit = Math.max(0, worldWidth - viewWidth);
    setCamera((current) => {
      let next = centeredRef.current ? current : playerPx - viewWidth / 2;
      centeredRef.current = true;
      if (playerPx - next < margin) next = playerPx - margin;
      if (playerPx - next > viewWidth - margin) next = playerPx - viewWidth + margin;
      return Math.max(0, Math.min(limit, next));
    });
  }, [me.x, viewTick]);

  useEffect(() => {
    const box = boxRef.current;
    const view = box?.parentElement;
    if (!box || !view) return;
    const worldHeight = box.offsetHeight;
    const viewHeight = view.clientHeight;
    if (!worldHeight || !viewHeight) return;
    const playerPy = (me.y / 100) * worldHeight;
    const margin = Math.min(viewHeight * 0.3, 200);
    const limit = Math.max(0, worldHeight - viewHeight);
    let next = playerPy - viewHeight / 2;
    if (playerPy - next < margin) next = playerPy - margin;
    if (playerPy - next > viewHeight - margin) next = playerPy - viewHeight + margin;
    setCamY(Math.max(0, Math.min(limit, next)));
  }, [me.y, viewTick]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const box = boxRef.current;
      if (!box || !mine || placing || inside || realm || homeOpen) return;
      const width = box.offsetWidth || 1;
      const height = box.offsetHeight || 1;
      const keys = keysRef.current;
      const vx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
      const vy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
      if (!vx && !vy) return;

      const speed = MOVE_SPEED * (riding ? RIDE_BOOST : 1);
      const length = Math.hypot(vx, vy) || 1;
      const nx = vx / length;
      const ny = vy / length;
      const current = meRef.current;
      const next = {
        x: clamp(current.x + ((nx * speed * dt) / width) * 100, 2, 98),
        y: clamp(current.y + ((ny * speed * dt) / height) * 100, 2, 98),
        face: nx < -0.05 ? -1 : nx > 0.05 ? 1 : current.face,
      };
      meRef.current = next;
      if (now - lastPublishRef.current > 45) {
        lastPublishRef.current = now;
        setMe(next);
        move(next.x, next.y, next.face);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mine, placing, move, inside, realm, homeOpen, riding]);

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
    const onEnter = (event) => {
      if (event.key !== 'Enter') return;
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag)) return;
      const target = enterRef.current;
      if (!target) return;
      event.preventDefault();
      if (target.kind === 'sport') setSport(target.id);
      else if (target.kind === 'realm') setRealm(target.id);
      else if (target.kind === 'home') setHomeOpen(true);
      else if (target.kind === 'find') {
        run?.({ action: 'collectFind', find_id: target.id }).catch(() => {});
        say(myKey, 'Picked that up.');
      } else if (target.kind === 'npc') {
        const line = pick(NPC_LINES);
        say(target.id, line);
        setTalk({ ...target.talk, line });
      }
      else setInside(target.place);
    };
    window.addEventListener('keydown', onEnter);
    return () => window.removeEventListener('keydown', onEnter);
  }, [say, run, myKey]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWander((current) => {
        const next = { ...current };
        residents.forEach((resident, index) => {
          if (resident.is_me) return;
          const home = resident.spots.find((spot) => spot.category === 'home');
          const base = home || { x: 24 + ((index * 19) % 56), y: 46 + ((index * 13) % 32) };
          const street = nearestRoad(base);
          if (Math.random() < 0.55 && street) {
            const t = Math.min(0.97, Math.max(0.03, street.t + (Math.random() - 0.5) * 0.12));
            const spot = pointOnRoad(street.road, t);
            next[resident.key] = { x: spot.x, y: spot.y, face: Math.random() > 0.5 ? 1 : -1 };
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

  const openVenue = (id) => {
    const venue = VENUE_BY_ID[id];
    if (!venue) return;
    const distance = distanceTo(venue, meRef.current);
    if (distance !== null && distance > REACH_PX) {
      say(myKey, `Walk closer to the ${venue.name} to compete.`);
      return;
    }
    setSport(id);
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
      say(myKey, 'Walk closer to trade.');
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

  const nearCivic = CIVIC_BUILDINGS.find((building) => {
    const distance = distanceTo(building, me);
    return distance !== null && distance <= REACH_PX;
  });

  const nearVenue = VENUES.find((venue) => {
    const distance = distanceTo(venue, me);
    return distance !== null && distance <= REACH_PX;
  });

  const nearPortal = REALMS.find((entry) => {
    const box = boxRef.current;
    if (!box) return false;
    const rad = (entry.portalAngle * Math.PI) / 180;
    const px = (SPAWN.x / 100) * box.offsetWidth + Math.cos(rad) * PORTAL_RING_RADIUS;
    const py = (SPAWN.y / 100) * box.offsetHeight + Math.sin(rad) * PORTAL_RING_RADIUS;
    const mx = (me.x / 100) * box.offsetWidth;
    const my = (me.y / 100) * box.offsetHeight;
    return Math.hypot(mx - px, my - py) <= REACH_PX * 0.8;
  });

  const collected = profile?.finds ?? [];
  const nearFind = FINDS.filter((find) => !collected.includes(find.id)).find((find) => {
    const distance = distanceTo(find, me);
    return distance !== null && distance <= 140;
  });

  const nearNeighbour = residents
    .filter((resident) => !resident.is_me)
    .map((resident) => {
      const home = resident.spots.find((spot) => spot.category === 'home');
      const drift = wander[resident.key];
      const spot = drift || { x: home?.x ?? 50, y: home?.y ?? 60 };
      return { resident, distance: distanceTo(spot, me) };
    })
    .filter((entry) => entry.distance !== null && entry.distance <= REACH_PX)
    .sort((a, b) => a.distance - b.distance)[0];

  const nearOwnHome = myHome ? distanceTo(myHome, me) : null;

  const enterTarget = homeOpen
    ? null
    : nearOwnHome !== null && nearOwnHome <= REACH_PX
    ? { kind: 'home', id: 'home', name: 'Enter your home' }
    : nearCivic
    ? { kind: 'place', id: nearCivic.id, place: nearCivic.place, name: `Enter ${nearCivic.name}` }
    : nearVenue
    ? { kind: 'sport', id: nearVenue.id, name: `Enter the ${nearVenue.name}` }
    : nearPortal
      ? { kind: 'realm', id: nearPortal.id, name: `Enter ${nearPortal.name}` }
      : nearFind
        ? { kind: 'find', id: nearFind.id, name: `Pick up ${nearFind.name}` }
        : nearNeighbour
        ? {
          kind: 'npc',
          id: nearNeighbour.resident.key,
          name: `Talk to ${String(nearNeighbour.resident.name).split(' ')[0]}`,
          talk: {
            name: nearNeighbour.resident.name,
            species: nearNeighbour.resident.species,
          },
        }
        : null;

  enterRef.current = sport || placing || inside || realm ? null : enterTarget;

  useEffect(() => {
    if (!placing) {
      placedRef.current = '';
      return;
    }
    if (placedRef.current === placing.item_id) return;
    placedRef.current = placing.item_id;
    onPlace(clamp(meRef.current.x + 2, 2, 98), clamp(meRef.current.y + 3, 6, 94));
  }, [placing, onPlace]);

  const live = people.filter((person) => person.seat !== seat);

  return (
    <div className="relative h-full w-full">
      <div
      ref={boxRef}
      style={{
        transform: `translate(${-camera}px, ${-camY}px)`,
        transition: 'transform 260ms ease-out',
      }}
      className="absolute left-0 top-0 h-[180%] w-[560%] min-w-[4600px] overflow-hidden bg-secondary/40"
    >
      <MeadowGround />

      <SpawnCircle />

      <Roads />

      {FINDS.filter((find) => !collected.includes(find.id)).map((find) => (
        <button
          key={find.id}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            run?.({ action: 'collectFind', find_id: find.id }).catch(() => {});
            say(myKey, 'Picked that up.');
          }}
          style={{ left: `${find.x}%`, top: `${find.y}%` }}
          className="meadow-bob absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center"
          title={find.name}
        >
          <span className="block text-2xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)]">
            {find.emoji}
          </span>
          {nearFind?.id === find.id && (
            <span className="mt-1 block whitespace-nowrap rounded-sm border border-primary/50 bg-card/90 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-primary">
              ⏎ {find.name}
            </span>
          )}
        </button>
      ))}

      <Places />

      <NeighbourHouses />

      <Realms onEnter={setRealm} activeId={nearPortal?.id || ''} />

      {CIVIC_BUILDINGS.map((building) => (
        <CivicBuilding
          key={building.id}
          building={building}
          reachable={nearCivic?.id === building.id}
          onEnter={setInside}
        />
      ))}

      {VENUES.map((venue) => {
        const distance = distanceTo(venue, me);
        return (
          <SportVenue
            key={venue.id}
            venue={venue}
            reachable={distance !== null && distance <= REACH_PX}
            onSelect={openVenue}
          />
        );
      })}

      {residents.length === 0 && (
        <p className="absolute left-0 top-0 z-30 flex h-full w-[45%] items-center justify-center px-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          The Commons are empty. Be the first to build here.
        </p>
      )}

      {residents.flatMap((resident) =>
        resident.spots
          .filter((spot) => spot.category === 'home')
          .map((spot) => {
            const x = spot.x;
            const y = spot.y;
            const bubble = bubbles[`house:${spot.item_id}`]?.text;
            const distance = resident.is_me ? null : distanceTo(spot, me);
            const reachable = distance !== null && distance <= REACH_PX;
            return (
              <button
                key={spot.item_id}
                type="button"
                aria-label={`${spot.name}, ${resident.is_me ? 'your home' : `${resident.name}'s home`}`}
                onClick={(event) => {
                  event.stopPropagation();
                  if (resident.is_me) {
                    setHomeOpen(true);
                    return;
                  }
                  openOffer(resident, spot);
                }}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-[88%] ${
                  resident.is_me ? 'cursor-default' : 'cursor-pointer'
                } ${reachable ? 'rounded-md bg-primary/10 ring-1 ring-primary/40' : ''}`}
              >
                {bubble && <WorldBubble text={bubble} />}
                <span
                  className="block"
                  style={{ width: `${68 + Math.min(54, Math.round((spot.price ?? 0) / 9))}px` }}
                >
                  <HouseSprite
                    name={spot.name}
                    className="w-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]"
                  />
                </span>
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
            const isPet = spot.category === 'pet';
            const drift = isPet ? wander[spot.item_id] : null;
            const x = drift ? drift.x : spot.x;
            const y = drift ? drift.y : spot.y;
            return (
              <div
                key={spot.item_id}
                title={spot.name}
                onClick={(event) => {
                  event.stopPropagation();
                  if (resident.is_me) {
                    if (isPet) setPet(spot);
                    return;
                  }
                  openOffer(resident, spot);
                }}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transition: 'left 2.6s linear, top 2.6s linear',
                }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none text-center leading-none ${
                  resident.is_me ? (isPet ? 'cursor-pointer' : 'cursor-default') : 'pointer-events-none'
                }`}
              >
                {bubbles[`pet:${spot.item_id}`]?.text && (
                  <WorldBubble text={bubbles[`pet:${spot.item_id}`].text} />
                )}
                <span
                  className="block"
                  style={{ transform: drift?.face === -1 ? 'scaleX(-1)' : undefined }}
                  aria-hidden="true"
                >
                  <span className={`block text-3xl ${isPet ? 'meadow-bob' : ''}`}>
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
          const streetStart = spotOnRoadNear(base, 0.2 + ((index * 7) % 50) / 100);
          const position = wander[resident.key] || {
            x: streetStart.x,
            y: streetStart.y,
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
                const line = pick(NPC_LINES);
                say(resident.key, line);
                setTalk({ name: resident.name, species: resident.species, line });
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

      {riding && myRide && (
        <div
          style={{ left: `${me.x}%`, top: `${me.y}%` }}
          className="pointer-events-none absolute z-[15] -translate-x-1/2 -translate-y-[92%] text-3xl drop-shadow-[0_6px_6px_rgba(0,0,0,0.55)]"
          aria-hidden="true"
        >
          {myRide.emoji}
        </div>
      )}

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

      {enterTarget && !sport && !placing && (
        <div className="pointer-events-none absolute bottom-14 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-sm border border-primary/50 bg-card/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary shadow-lg">
          ⏎ {enterTarget.name}
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

      {!placing && mine && myRide && (
        <button
          type="button"
          onClick={() => setRiding((value) => !value)}
          className={`absolute left-2 top-12 z-40 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] ${
            riding
              ? 'border-primary bg-primary/20 text-primary'
              : 'border-border bg-card/90 text-muted-foreground hover:text-primary'
          }`}
        >
          {riding ? `Dismount ${myRide.emoji}` : `Ride ${myRide.emoji}`}
        </button>
      )}

      {connected && (
        <span className="pointer-events-none absolute bottom-3 right-3 z-40 rounded-sm border border-primary/40 bg-card/85 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-primary">
          {people.length} wandering now
        </span>
      )}

      {isleOpen && (
        <div className="absolute bottom-12 left-3 z-40 max-h-[62%] w-[236px] max-w-[calc(100%-1.5rem)] overflow-y-auto sm:w-[262px]">
          <ChampionIsle
            people={people}
            seat={seat}
            pong={pong}
            onPlay={openVenue}
            nearId={nearVenue?.id || ''}
            boards={boards}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsleOpen((value) => !value)}
        className="absolute bottom-3 left-3 z-40 rounded-sm border border-border bg-card/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
      >
        {isleOpen ? 'Hide Isle' : 'Isle & sports'}
      </button>

      {sport === 'choir' && (
        <GameStage title="The Choir of Honkton" onClose={() => setSport('')}>
          <ChoirGame onClose={() => setSport('')} onFinish={(score) => submitScore('choir', score)} />
        </GameStage>
      )}
      {sport === 'guard' && (
        <GameStage title="Nest Guard" onClose={() => setSport('')}>
          <NestGuard onClose={() => setSport('')} onFinish={(score) => submitScore('guard', score)} />
        </GameStage>
      )}
      {sport === 'archery' && (
        <GameStage title="The Reed Archery Range" onClose={() => setSport('')}>
          <ArcheryGame
            onClose={() => setSport('')}
            onFinish={(score) => submitScore('archery', score)}
          />
        </GameStage>
      )}
      {sport === 'race' && (
        <GameStage title="The Reed Race" onClose={() => setSport('')}>
          <RaceGame
            species={profile?.species}
            onClose={() => setSport('')}
            onFinish={(score) => submitScore('race', score)}
          />
        </GameStage>
      )}
      {sport === 'sprint' && (
        <GameStage title="The Heatsprint" onClose={() => setSport('')}>
          <SprintGame
            species={profile?.species}
            onClose={() => setSport('')}
            onFinish={(score) => submitScore('sprint', score)}
          />
        </GameStage>
      )}
      {sport === 'toss' && (
        <GameStage title="The Bread Toss" onClose={() => setSport('')}>
          <BreadToss onClose={() => setSport('')} onFinish={(score) => submitScore('toss', score)} />
        </GameStage>
      )}

      <NeighbourTalk target={talk} onClose={() => setTalk(null)} />

      {homeOpen && (
        <HomeInterior price={myHome?.price ?? 0} onExit={() => setHomeOpen(false)} />
      )}

      <PetPanel
        pet={pet}
        onClose={() => setPet(null)}
        onAction={(reply) => {
          if (pet) say(`pet:${pet.item_id}`, reply);
        }}
      />

      <CommonsChat name={profile?.name || 'A wanderer'} />

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

      {realm === 'warzone' || realm === 'duelling' ? (
        <WarzoneBattle bus={arenaBus} onExit={() => setRealm('')} />
      ) : realm ? (
        <RealmScene
          realm={REALMS.find((entry) => entry.id === realm)}
          onExit={() => setRealm('')}
          onEnterPlace={setInside}
          blocked={Boolean(inside)}
        />
      ) : null}

      {inside && (
        <PlaceInterior
          place={placeFor(inside)}
          onEnterPlace={setInside}
          onExit={() => setInside('')}
          onPlay={setSport}
          arenaBus={arenaBus}
        />
      )}
    </div>
  );
}