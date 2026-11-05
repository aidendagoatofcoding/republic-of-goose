import { useCallback, useEffect, useRef, useState } from 'react';
import HouseSprite from '@/components/world/HouseSprite';
import CommonsScenery from '@/components/world/CommonsScenery';
import Places from '@/components/world/Places';
import Walker from '@/components/world/Walker';
import WorldBubble from '@/components/world/WorldBubble';
import NeighbourDialog from '@/components/world/NeighbourDialog';
import ChampionIsle from '@/components/world/ChampionIsle';
import PongTable from '@/components/world/PongTable';
import SprintGame from '@/components/world/SprintGame';
import BreadToss from '@/components/world/BreadToss';
import ChoirGame from '@/components/world/ChoirGame';
import NestGuard from '@/components/world/NestGuard';
import RaceGame from '@/components/world/RaceGame';
import Realms from '@/components/world/Realms';
import { spotOnRoadNear, routeAlongRoads } from '@/lib/roads';
import GpsPanel from '@/components/world/GpsPanel';
import GpsRoute from '@/components/world/GpsRoute';
import PlayerChat from '@/components/world/PlayerChat';
import FriendsPanel from '@/components/world/FriendsPanel';
import BossLeaderboard from '@/components/world/BossLeaderboard';
import GuestHome from '@/components/world/GuestHome';
import { destinationById } from '@/lib/destinations';
import { sfx, isMuted, setMuted, startRiver, stopRiver } from '@/lib/sfx';
import SportVenue from '@/components/world/SportVenue';
import PlaceInterior from '@/components/world/interiors/PlaceInterior';
import PetPanel from '@/components/world/PetPanel';
import WeatherLayer from '@/components/world/WeatherLayer';
import useWeather from '@/hooks/useWeather';
import { VENUES, VENUE_BY_ID } from '@/lib/isleVenues';
import { placeFor } from '@/lib/places';
import RealmScene from '@/components/world/RealmScene';
import SiftWorld from '@/components/world/SiftWorld';
import VehicleSprite from '@/components/world/VehicleSprite';
import { REALMS, realmFor } from '@/lib/realms';
import useCommonsRoom from '@/hooks/useCommonsRoom';
import usePong from '@/hooks/usePong';
import HomeInterior from '@/components/world/interiors/HomeInterior';
import GameStage from '@/components/world/GameStage';
import CommonsChat from '@/components/world/CommonsChat';
import { SPAWN, PORTAL_RING_RADIUS } from '@/lib/spawn';
import { FINDS } from '@/lib/quests';
import { HIDDEN } from '@/lib/hidden';

import HiddenSpot from '@/components/world/HiddenSpot';
import ZeldaDialog from '@/components/world/ZeldaDialog';
import InventoryBar from '@/components/world/InventoryBar';
import SceneBoundary from '@/components/world/SceneBoundary';
import EdgeWarden, { EDGE_WARDEN } from '@/components/world/EdgeWarden';

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
const NOTHING = [
  'Damp leaves and a beetle. Nothing else.',
  'Roots, and one very put-upon snail.',
  'Empty. Somebody got here first.',
  'Just grit and an old feather.',
  'Nothing worth carrying home.',
];
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const REACH_PX = 190;
const MOVE_SPEED = 165;
const RIDE_BOOST = 1.9;

export default function WorldScene({
  residents,
  placing,
  onPlace,
  profile,
  run,
  onOffersChanged,
  onBoards,
  boards = {},
  friends = null,
  onRefreshWorld,
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
  const [playerTap, setPlayerTap] = useState(null);
  const [visitor, setVisitor] = useState(null);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [beastsOpen, setBeastsOpen] = useState(false);
  const [friendsList, setFriendsList] = useState(null);
  const [gpsOpen, setGpsOpen] = useState(false);
  const [gpsTarget, setGpsTarget] = useState('');
  const [quiet, setQuiet] = useState(() => isMuted());
  const [me, setMe] = useState({ x: SPAWN.x, y: SPAWN.y, face: 1 });
  const meRef = useRef(me);
  const keysRef = useRef(new Set());
  const placedRef = useRef('');
  const lastPublishRef = useRef(0);
  const dirtyRef = useRef(false);
  const enterRef = useRef(null);
  const lastStepRef = useRef(0);

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
  const [inside, setInside] = useState('');
  const [realm, setRealm] = useState('');
  const [isleOpen, setIsleOpen] = useState(false);
  const myKey = seat ? `seat:${seat}` : 'me';

  const [talk, setTalk] = useState(null);
  const talkRef = useRef(null);
  talkRef.current = talk;
  const [revealed, setRevealed] = useState([]);
  const [searched, setSearched] = useState([]);

  // The sky turns over on its own while you wander.
  const weather = useWeather();

  // The Odder runs past the meadow, so its water is heard the whole time you wander.
  useEffect(() => {
    if (quiet) {
      stopRiver();
      return undefined;
    }
    startRiver();
    return () => stopRiver();
  }, [quiet]);

  // Stamina: hold Shift to run, and it comes back when you walk or stand.
  const staminaRef = useRef(100);
  const staminaShownRef = useRef(100);
  const sprintRef = useRef(false);
  const [stamina, setStamina] = useState(100);

  // A conversation stops the goose dead, so held keys are let go when one starts.
  useEffect(() => {
    if (!talk) return;
    keysRef.current.clear();
    sprintRef.current = false;
  }, [talk]);

  // First search uncovers what is under the stone or in the trunk; the second picks it up.
  const searchSpot = useCallback(
    (spot) => {
      if (!spot) return;
      if (!run) {
        say(myKey, 'Only citizens of the Republic may search out here.');
        return;
      }
      // Not everything out here is worth digging through.
      if (spot.empty) {
        setSearched((current) => (current.includes(spot.id) ? current : [...current, spot.id]));
        say(myKey, pick(NOTHING));
        return;
      }
      if (!revealed.includes(spot.id)) {
        setRevealed((current) => [...current, spot.id]);
        sfx.blip();
        say(myKey, `Something glints under the ${spot.kind === 'rock' ? 'boulder' : 'roots'}.`);
        return;
      }
      run({ action: 'collectFind', find_id: spot.id }).catch(() => {});
      sfx.pickup();
      say(myKey, `You take the ${spot.name.toLowerCase()}.`);
    },
    [run, say, myKey, revealed]
  );
  const [offerTarget, setOfferTarget] = useState(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerBusy, setOfferBusy] = useState(false);
  const [offerError, setOfferError] = useState('');

  useEffect(() => {
    if (connected) move(meRef.current.x, meRef.current.y, meRef.current.face);
  }, [connected, move]);

  // The Sift gate calls for a portal from inside the witch's hut.
  useEffect(() => {
    const onRealm = (event) => setRealm(String(event.detail?.realm || ''));
    window.addEventListener('goose:realm', onRealm);
    return () => window.removeEventListener('goose:realm', onRealm);
  }, []);

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
    const limit = Math.max(0, worldWidth - viewWidth);
    // One clamped target per frame: the view chases the goose and simply stops at the edge.
    setCamera(Math.round(Math.max(0, Math.min(limit, playerPx - viewWidth / 2))));
  }, [me.x, viewTick]);

  useEffect(() => {
    const box = boxRef.current;
    const view = box?.parentElement;
    if (!box || !view) return;
    const worldHeight = box.offsetHeight;
    const viewHeight = view.clientHeight;
    if (!worldHeight || !viewHeight) return;
    const playerPy = (me.y / 100) * worldHeight;
    const limit = Math.max(0, worldHeight - viewHeight);
    setCamY(Math.round(Math.max(0, Math.min(limit, playerPy - viewHeight / 2))));
  }, [me.y, viewTick]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const box = boxRef.current;
      if (!box || !mine || placing || inside || realm || homeOpen || talk) return;
      const width = box.offsetWidth || 1;
      const height = box.offsetHeight || 1;
      const keys = keysRef.current;
      const vx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
      const vy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
      const moving = Boolean(vx || vy);
      const running = moving && sprintRef.current && staminaRef.current > 1;
      if (moving && now - lastStepRef.current > (running ? 240 : 360)) {
        lastStepRef.current = now;
        sfx.step();
      }
      staminaRef.current = Math.min(
        100,
        Math.max(0, staminaRef.current + (running ? -26 : 15) * dt)
      );
      const shown = Math.round(staminaRef.current);
      if (shown !== staminaShownRef.current) {
        staminaShownRef.current = shown;
        setStamina(shown);
      }
      if (!moving) {
        // Settle the last frame so a goose never stops short of where it walked.
        if (dirtyRef.current) {
          dirtyRef.current = false;
          lastPublishRef.current = now;
          setMe(meRef.current);
          move(meRef.current.x, meRef.current.y, meRef.current.face);
        }
        return;
      }

      const speed = MOVE_SPEED * (riding ? RIDE_BOOST : 1) * (running ? 1.75 : 1);
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
      dirtyRef.current = true;
      if (now - lastPublishRef.current > 16) {
        lastPublishRef.current = now;
        dirtyRef.current = false;
        setMe(next);
        move(next.x, next.y, next.face);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mine, placing, move, inside, realm, homeOpen, riding, talk]);

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
      if (talkRef.current) return;
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (event.key?.toLowerCase() === 'shift') {
        sprintRef.current = true;
        return;
      }
      const direction = KEYS[event.key?.toLowerCase()];
      if (!direction) return;
      event.preventDefault();
      keysRef.current.add(direction);
    };
    const onUp = (event) => {
      if (event.key?.toLowerCase() === 'shift') {
        sprintRef.current = false;
        return;
      }
      const direction = KEYS[event.key?.toLowerCase()];
      if (!direction) return;
      keysRef.current.delete(direction);
    };
    const clearKeys = () => {
      keysRef.current.clear();
      sprintRef.current = false;
    };
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
      if (talkRef.current) return;
      // The pack has its own Enter, for setting a home down on the land.
      if (document.querySelector('[data-pack-open="true"]')) return;
      const tag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag)) return;
      const target = enterRef.current;
      if (!target) return;
      event.preventDefault();
      if (target.kind === 'sport') {
        sfx.door();
        setSport(target.id);
      } else if (target.kind === 'realm') {
        sfx.door();
        setRealm(target.id);
      } else if (target.kind === 'home') {
        sfx.door();
        setHomeOpen(true);
      } else if (target.kind === 'find') {
        run?.({ action: 'collectFind', find_id: target.id }).catch(() => {});
        sfx.pickup();
        say(myKey, 'Picked that up.');
      } else if (target.kind === 'hidden') {
        searchSpot(target.spot);
      } else if (target.kind === 'npc') {
        if (target.resident && !target.resident.friend) say(target.id, pick(NPC_LINES));
        sfx.choose();
        setPlayerTap(target.resident);
      } else if (target.kind === 'giver') {
        setTalk(target.talk);
      }
      else setInside(target.place);
    };
    window.addEventListener('keydown', onEnter);
    return () => window.removeEventListener('keydown', onEnter);
  }, [say, run, myKey, searchSpot]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWander((current) => {
        const next = { ...current };
        residents.forEach((resident, index) => {
          if (resident.is_me) return;
          const home = resident.spots.find((spot) => spot.category === 'home');
          const base = home || { x: 24 + ((index * 19) % 56), y: 46 + ((index * 13) % 32) };
          // Small, unhurried steps around their own door — no teleporting across the meadow.
          const from = current[resident.key] || base;
          if (Math.random() < 0.5) {
            next[resident.key] = {
              x: clamp(from.x + (Math.random() - 0.5) * 5, 6, 94),
              y: clamp(from.y + (Math.random() - 0.5) * 4, 18, 92),
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
    sfx.honk();
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
    // A portal only answers when you are standing on it.
    return Math.hypot(mx - px, my - py) <= 62;
  });

  const collected = profile?.finds ?? [];
  const doneQuests = profile?.quests ?? [];
  const takenQuests = profile?.taken_quests ?? [];

  const nearHidden = HIDDEN.filter(
    (spot) => !collected.includes(spot.id) && !(spot.empty && searched.includes(spot.id))
  ).find((spot) => {
    const distance = distanceTo(spot, me);
    return distance !== null && distance <= 132;
  });

  // Buried things are found by searching their rock or tree, never by walking over them.
  const nearFind = FINDS.filter((find) => !find.hidden && !collected.includes(find.id)).find((find) => {
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

  const wardenDistance = distanceTo(EDGE_WARDEN, me);
  const wardenNear = wardenDistance !== null && wardenDistance <= REACH_PX;

  const enterTarget = homeOpen
    ? null
    : wardenNear
    ? {
      kind: 'giver',
      id: 'edge',
      name: 'Speak to the Edge Warden',
      talk: {
        key: 'edge-warden',
        name: 'The Edge Warden',
        species: 'fox',
        questId: 'edge-lamp',
        questDone: doneQuests.includes('edge-lamp'),
      },
    }
    : nearOwnHome !== null && nearOwnHome <= REACH_PX
    ? { kind: 'home', id: 'home', name: 'Enter your home' }
    : nearVenue
    ? { kind: 'sport', id: nearVenue.id, name: `Enter the ${nearVenue.name}` }
    : nearPortal
      ? { kind: 'realm', id: nearPortal.id, name: `Enter ${nearPortal.name}` }
      : nearHidden
        ? {
          kind: 'hidden',
          id: nearHidden.id,
          spot: nearHidden,
          name:
            !nearHidden.empty && revealed.includes(nearHidden.id)
              ? `Take ${nearHidden.name}`
              : `Search the ${nearHidden.kind === 'rock' ? 'boulder' : 'tree'}`,
        }
        : nearFind
        ? { kind: 'find', id: nearFind.id, name: `Pick up ${nearFind.name}` }
        : nearNeighbour
        ? {
          kind: 'npc',
          id: nearNeighbour.resident.key,
          resident: nearNeighbour.resident,
          name: `Talk to ${String(nearNeighbour.resident.name).split(' ')[0]}`,
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
  const realmData = realm ? realmFor(realm) : null;

  // The navigator keeps a route along the streets to wherever it was pointed.
  const destination = destinationById(gpsTarget);
  const gpsRoute = destination ? routeAlongRoads({ x: me.x, y: me.y }, destination) : [];
  const gpsBox = boxRef.current;
  const gpsDistance =
    destination && gpsBox
      ? Math.max(
          1,
          Math.round(
            Math.hypot(
              ((destination.x - me.x) / 100) * gpsBox.offsetWidth,
              ((destination.y - me.y) / 100) * gpsBox.offsetHeight
            ) / 6
          )
        )
      : 0;

  return (
    <div className="relative h-full w-full">
      <div
      ref={boxRef}
      style={{
        transform: `translate(${-camera}px, ${-camY}px)`,
      }}
      className="absolute left-0 top-0 h-[240%] w-[560%] min-w-[4600px] overflow-hidden bg-secondary/40"
    >
      <CommonsScenery />

      <GpsRoute route={gpsRoute} destination={destination} />

      <EdgeWarden
        near={wardenNear}
        hasQuest={
          !doneQuests.includes('edge-lamp') && !takenQuests.includes('edge-lamp')
        }
        onOpen={() =>
          setTalk({
            key: 'edge-warden',
            name: 'The Edge Warden',
            species: 'fox',
            questId: 'edge-lamp',
            questDone: doneQuests.includes('edge-lamp'),
          })
        }
      />

      {FINDS.filter((find) => !find.hidden && !collected.includes(find.id)).map((find) => (
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
          <span
            className="block h-7 w-7 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-full w-full">
              <rect x="4" y="8" width="16" height="12" rx="3" fill="#7a6342" stroke="#2b2317" strokeWidth="1.4" />
              <path d="M8 8c0-2.4 1.8-4 4-4s4 1.6 4 4" fill="none" stroke="#c2ff85" strokeWidth="1.6" />
              <circle cx="12" cy="14" r="2" fill="#c2ff85" />
            </svg>
          </span>
          {nearFind?.id === find.id && (
            <span className="mt-1 block whitespace-nowrap rounded-sm border border-primary/50 bg-card/90 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-primary">
              ⏎ {find.name}
            </span>
          )}
        </button>
      ))}

      <Places />

      {HIDDEN.filter((spot) => !collected.includes(spot.id)).map((spot) => (
        <HiddenSpot
          key={spot.id}
          spot={spot}
          near={nearHidden?.id === spot.id}
          revealed={revealed.includes(spot.id)}
          collected={Boolean(spot.empty && searched.includes(spot.id))}
          onSearch={searchSpot}
        />
      ))}



      <Realms onEnter={setRealm} activeId={nearPortal?.id || ''} />

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
              <div
                key={spot.item_id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute z-10 -translate-x-1/2 -translate-y-[88%]"
              >
                {bubble && <WorldBubble text={bubble} />}

                {/* the name plate, hung above the door so the house is known from the road */}
                <span className="mb-0.5 block max-w-[220px] truncate rounded-sm border border-[#f2c96b]/35 bg-[#0a1310]/88 px-1.5 py-0.5 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-[#f2c96b]">
                  {resident.name}
                </span>

                <button
                  type="button"
                  aria-label={`${spot.name}, ${resident.is_me ? 'your home' : `${resident.name}'s home`}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (resident.is_me) {
                      sfx.door();
                      setHomeOpen(true);
                      return;
                    }
                    setPlayerTap(resident);
                  }}
                  className={`block w-full ${resident.is_me ? 'cursor-pointer' : 'cursor-pointer'} ${
                    reachable ? 'rounded-md bg-primary/10 ring-1 ring-primary/40' : ''
                  }`}
                >
                  <span
                    className="block"
                    style={{ width: `${68 + Math.min(54, Math.round((spot.price ?? 0) / 9))}px` }}
                  >
                    <HouseSprite
                      name={spot.name}
                      className="w-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.5)]"
                    />
                  </span>
                </button>

                {/* the driveway where the household's vehicle stands when nobody is riding it */}
                <span
                  className="mt-0.5 block h-[15px] w-[64px] rounded-[3px] border border-black/50"
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    background:
                      'repeating-linear-gradient(90deg, rgba(194,255,133,0.16) 0 2px, transparent 2px 10px), linear-gradient(180deg, #615c4e, #4d493e)',
                  }}
                  aria-hidden="true"
                />

                <span className="mt-0.5 block max-w-[220px] truncate text-center font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/65">
                  {spot.name}
                </span>
              </div>
            );
          })
      )}

      {residents.flatMap((resident) =>
        resident.spots
          .filter((spot) => spot.category !== 'home')
          .filter((spot) => !(riding && resident.is_me && spot.item_id === myRide?.item_id))
          .map((spot) => {
            const isPet = spot.category === 'pet';
            const drift = isPet ? wander[spot.item_id] : null;
            // A vehicle waits on its owner's driveway; everything else sits where it was set.
            const ownerHome = resident.spots.find((entry) => entry.category === 'home');
            const parked =
              spot.category === 'vehicle' && ownerHome
                ? {
                  x: ownerHome.x + (spot.x >= ownerHome.x ? 3.6 : -3.6),
                  y: ownerHome.y + 2.4,
                }
                : null;
            const x = parked ? parked.x : drift ? drift.x : spot.x;
            const y = parked ? parked.y : drift ? drift.y : spot.y;
            return (
              <div
                key={spot.item_id}
                title={spot.name}
                onClick={(event) => {
                  event.stopPropagation();
                  if (resident.is_me) {
                    if (isPet) setPet(spot);
                    else if (spot.category === 'vehicle') {
                      setRiding(true);
                      say(myKey, `You climb onto the ${spot.name.toLowerCase()}.`);
                    }
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
                  resident.is_me
                    ? isPet || spot.category === 'vehicle'
                      ? 'cursor-pointer'
                      : 'cursor-default'
                    : 'pointer-events-none'
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
                  {spot.category === 'vehicle' ? (
                    <VehicleSprite
                      name={spot.name}
                      className="block w-20 drop-shadow-[0_8px_8px_rgba(0,0,0,0.45)]"
                    />
                  ) : (
                    <span className={`block text-3xl ${isPet ? 'meadow-bob' : ''}`}>
                      {spot.emoji}
                    </span>
                  )}
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
          // A real neighbour is answered in ordinary words — no riddles and no favours.
          return (
            <Walker
              key={resident.key}
              label={resident.name}
              species={resident.species}
              avatar={resident.avatar_url}
              worn={resident.worn}
              x={position.x}
              y={position.y}
              face={
                playerTap?.key === resident.key ? (me.x < position.x ? -1 : 1) : position.face
              }
              hasQuest={false}
              bubble={bubbles[resident.key]?.text}
              speed="2.6s"
              onPoke={() => {
                sfx.choose();
                setPlayerTap(resident);
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
          className="pointer-events-none absolute z-[29] -translate-x-1/2 -translate-y-[62%]"
          aria-hidden="true"
        >
          <VehicleSprite
            name={myRide.name}
            className="block w-28 drop-shadow-[0_9px_9px_rgba(0,0,0,0.55)]"
          />
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
          lift={riding && myRide ? 26 : 0}
          speed="0s"
          onPoke={() => {
            say(myKey, 'HONK!');
            honk(0);
          }}
        />
      )}

      </div>

      <WeatherLayer weather={weather} />

      <span
        className="pointer-events-none absolute right-2 top-2 z-40 rounded-sm border border-border/70 bg-card/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em]"
        style={{ color: weather.tint }}
      >
        {weather.emoji} {weather.name}
      </span>

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

      {mine && !placing && (
        <div className="pointer-events-none absolute bottom-12 right-3 z-40 flex flex-col items-end gap-0.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
            Stamina {stamina}
          </span>
          <span className="block h-1.5 w-24 overflow-hidden rounded-full border border-border/70 bg-black/60">
            <span
              className="block h-full transition-[width] duration-150"
              style={{
                width: `${stamina}%`,
                background: stamina > 30 ? 'hsl(var(--primary))' : '#e0664a',
              }}
            />
          </span>
          <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted-foreground/70">
            Shift to sprint
          </span>
        </div>
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

      <button
        type="button"
        onClick={() => setFriendsOpen(true)}
        className="absolute bottom-3 left-[122px] z-40 rounded-sm border border-border bg-card/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
      >
        Friends
        {(friendsList ?? friends)?.incoming?.length > 0
          ? ` · ${(friendsList ?? friends).incoming.length}`
          : ''}
      </button>

      <button
        type="button"
        onClick={() => setBeastsOpen((value) => !value)}
        className="absolute bottom-3 left-[202px] z-40 rounded-sm border border-border bg-card/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
      >
        Beasts
      </button>

      {beastsOpen && (
        <div className="absolute bottom-12 left-3 z-40 max-h-[62%] w-[258px] max-w-[calc(100%-1.5rem)] overflow-y-auto">
          <BossLeaderboard onClose={() => setBeastsOpen(false)} />
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          const next = !quiet;
          setMuted(next);
          setQuiet(next);
        }}
        aria-label={quiet ? 'Turn the sound on' : 'Turn the sound off'}
        className="absolute right-2 top-9 z-40 rounded-sm border border-border/70 bg-card/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-primary"
      >
        {quiet ? '🔇' : '🔊'}
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

      <GpsPanel
        open={gpsOpen}
        onToggle={() => setGpsOpen((value) => !value)}
        destination={destination}
        distance={gpsDistance}
        onPick={(id) => {
          sfx.choose();
          setGpsTarget(id);
          setGpsOpen(false);
        }}
        onStop={() => setGpsTarget('')}
      />

      {playerTap && (
        <PlayerChat
          resident={playerTap}
          onClose={() => setPlayerTap(null)}
          onVisit={(resident) => {
            setPlayerTap(null);
            setVisitor(resident);
          }}
          onFriendsChanged={(bundle) => {
            setFriendsList(bundle);
            onRefreshWorld?.();
          }}
        />
      )}

      {visitor && <GuestHome resident={visitor} onExit={() => setVisitor(null)} />}

      {friendsOpen && (
        <FriendsPanel
          friends={friendsList ?? friends ?? { friends: [], incoming: [], outgoing: [] }}
          residents={residents}
          onClose={() => setFriendsOpen(false)}
          onVisit={(resident) => {
            setFriendsOpen(false);
            setVisitor(resident);
          }}
        />
      )}

      <ZeldaDialog target={talk} onClose={() => setTalk(null)} />

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

      <InventoryBar position={me} onPlaced={onRefreshWorld} />

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

      <SceneBoundary resetKey={`${realm}|${inside}`} onReset={() => setRealm('')}>
        {realm === 'sift' ? (
          <SiftWorld
            onExit={() => setRealm('')}
            onEnterPlace={setInside}
            blocked={Boolean(inside)}
          />
        ) : realmData ? (
          <RealmScene
            realm={realmData}
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
          />
        )}
      </SceneBoundary>
    </div>
  );
}