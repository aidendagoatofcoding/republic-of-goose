import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { MARKET, marketSnapshot, priceAt, currentTick } from '../../shared/market.ts';
import { hashPassword, normaliseUsername } from '../../shared/passport.ts';
import { JOBS, jobById } from '../../shared/jobs.ts';
import { isFind, questById } from '../../shared/quests.ts';
import {
  XP_PER_LEVEL,
  MAX_ARENA_DUELS,
  MAX_ARENA_KILLS,
  levelFromXp,
  nextSwordFor,
  swordFor,
  swordTier,
  xpOf,
} from '../../shared/swords.ts';

const CHAT_REWARD = 5;
const CHAT_COOLDOWN_MS = 12000;
// The bakery pays by the batch: ten loaves out of the oven make one piece of bread.
const LOAVES_PER_BREAD = 10;
const MAX_BAKE_CLICKS = 40;
const MAX_SHARES = 5000;
const MAX_DECORATIONS = 40;
const WORKER_BASE_COST = 30;
const WORKER_COST_GROWTH = 1.18;
const WORKER_SECONDS_PER_LOAF = 4;
const MAX_WORKERS = 200;
const MAX_WORKER_EARN = 2000;
const MAX_OFFLINE_SECONDS = 6 * 60 * 60;
const MAX_SHIFT_SECONDS = 180;
const MAX_POSSESSIONS = 40;
const LOAN_BASE = 100;
const LOAN_PER_EARNED = 2;
const LOAN_CAP = 5000;
const LOAN_FEE = 1.2;

// Which fishing slot a tool fills, matched on its shop name.
function slotOfTackle(item) {
  if (!item || item.category !== 'tool') return '';
  const name = String(item.name || '');
  if (/rod/i.test(name)) return 'rod';
  if (/net|gaff/i.test(name)) return 'net';
  if (/bait|worm|dough|shrimp|maggot|grub/i.test(name)) return 'bait';
  if (/lure|spoon|spinner|jig|\bfly\b/i.test(name)) return 'lure';
  return '';
}

function workerCost(workers) {
  return Math.round(WORKER_BASE_COST * Math.pow(WORKER_COST_GROWTH, workers));
}

function earnedTotal(citizen) {
  return Math.max(0, Math.floor(citizen.bread_earned ?? 0));
}

function nameOf(citizen) {
  return citizen.goose_name || citizen.full_name || citizen.username || 'A goose';
}

// Every friendship row that touches this citizen, in either direction.
async function friendshipsFor(admin, id) {
  const [sent, received] = await Promise.all([
    admin.entities.Friendship.filter({ from_key: id }, { limit: 100 }),
    admin.entities.Friendship.filter({ to_key: id }, { limit: 100 }),
  ]);
  return [...(sent?.items ?? []), ...(received?.items ?? [])];
}

function friendState(rows, id, otherId) {
  const row = rows.find(
    (entry) =>
      (entry.from_key === id && entry.to_key === otherId) ||
      (entry.from_key === otherId && entry.to_key === id)
  );
  if (!row) return { status: 'none', incoming: false, id: '' };
  const accepted = row.status === 'accepted';
  return {
    status: accepted ? 'friend' : 'pending',
    incoming: !accepted && row.to_key === id,
    id: row.id,
  };
}

async function friendBundle(admin, citizen) {
  const rows = await friendshipsFor(admin, citizen.id);
  const friends = [];
  const incoming = [];
  const outgoing = [];
  rows.forEach((row) => {
    const otherId = row.from_key === citizen.id ? row.to_key : row.from_key;
    const otherName = row.from_key === citizen.id ? row.to_name : row.from_name;
    if (row.status === 'accepted') {
      friends.push({ key: otherId, name: otherName || 'A goose' });
    } else if (row.to_key === citizen.id) {
      incoming.push({ id: row.id, key: otherId, name: otherName || 'A goose' });
    } else {
      outgoing.push({ id: row.id, key: otherId, name: otherName || 'A goose' });
    }
  });
  return { friends, incoming, outgoing };
}

function loanCeiling(earned) {
  return Math.min(LOAN_CAP, LOAN_BASE + LOAN_PER_EARNED * earned);
}

function clampSpot(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return (min + max) / 2;
  return Math.min(max, Math.max(min, Math.round(number * 10) / 10));
}

function publicLoan(loan, earned) {
  if (!loan) return { active: false, limit: loanCeiling(earned) };
  return {
    active: true,
    id: loan.id,
    principal: Math.round(loan.principal ?? 0),
    outstanding: Math.round(loan.outstanding ?? 0),
    limit: loanCeiling(earned),
  };
}

function publicOffer(offer) {
  return {
    id: offer.id,
    from_key: offer.from_key || '',
    from_name: offer.from_name || 'A citizen',
    to_key: offer.to_key || '',
    to_name: offer.to_name || 'A citizen',
    item_id: offer.item_id,
    item_name: offer.item_name || 'Item',
    item_emoji: offer.item_emoji || '📦',
    item_category: offer.item_category || 'home',
    amount: Math.round(offer.amount ?? 0),
    status: offer.status || 'pending',
    created_date: offer.created_date,
  };
}

async function loadOffers(admin, citizenId) {
  const [incoming, outgoing] = await Promise.all([
    admin.entities.TradeOffer.filter(
      { to_key: citizenId, status: 'pending' },
      { limit: 40, sort: '-created_date' }
    ),
    admin.entities.TradeOffer.filter(
      { from_key: citizenId, status: 'pending' },
      { limit: 40, sort: '-created_date' }
    ),
  ]);
  return {
    incoming: (incoming?.items ?? []).map(publicOffer),
    outgoing: (outgoing?.items ?? []).map(publicOffer),
  };
}

async function loadLoan(admin, code) {
  const page = await admin.entities.Loan.filter(
    { passport_code: code, status: 'active' },
    { limit: 1 }
  );
  return page?.items?.[0] ?? null;
}

function publicCitizen(citizen, holdings = []) {
  const decorations = Array.isArray(citizen.decorations) ? citizen.decorations : [];
  const possessions = Array.isArray(citizen.possessions) ? citizen.possessions : [];
  const worldSpots = Array.isArray(citizen.world_spots) ? citizen.world_spots : [];
  const workers = Math.max(0, Math.floor(citizen.workers ?? 0));
  const xp = xpOf(citizen);
  const tier = swordTier(citizen.sword_tier);
  const blade = swordFor(tier);
  return {
    id: citizen.id,
    xp,
    level: levelFromXp(xp),
    xp_into_level: xp % XP_PER_LEVEL,
    xp_per_level: XP_PER_LEVEL,
    sword_tier: tier,
    sword_name: blade.name,
    sword_power: blade.power,
    next_sword: nextSwordFor(tier),
    full_name: citizen.full_name,
    goose_name: citizen.goose_name || '',
    species: citizen.species || 'goose',
    district: citizen.district,
    honkish_level: citizen.honkish_level,
    avatar_url: citizen.avatar_url || '',
    bread: Math.round(citizen.bread ?? 0),
    bread_earned: earnedTotal(citizen),
    decorations,
    possessions,
    world_spots: worldSpots,
    home_items: Array.isArray(citizen.home_items) ? citizen.home_items : [],
    passport_code: citizen.passport_code,
    username: citizen.username || '',
    workers,
    next_worker_cost: workerCost(workers),
    home_open: citizen.home_open === true,
    bake_progress: Math.max(0, Math.floor(citizen.bake_progress ?? 0)),
    job: citizen.job || '',
    finds: Array.isArray(citizen.finds) ? citizen.finds : [],
    sift_keys: Array.isArray(citizen.sift_keys) ? citizen.sift_keys : [],
    fish_caught: Math.max(0, Math.floor(citizen.fish_caught ?? 0)),
    gear: Array.isArray(citizen.gear) ? citizen.gear : [],
    ore: Math.max(0, Math.floor(citizen.ore ?? 0)),
    quests: Array.isArray(citizen.quests) ? citizen.quests : [],
    created_date: citizen.created_date,
    holdings,
  };
}

async function loadHoldings(admin, code) {
  const page = await admin.entities.Holding.filter({ passport_code: code }, { limit: 100 });
  return (page?.items ?? []).map((holding) => ({
    id: holding.id,
    symbol: holding.symbol,
    shares: holding.shares,
    avg_price: holding.avg_price ?? 0,
  }));
}

const EVENT_IDS = ['sprint', 'toss', 'archery', 'race', 'choir', 'guard'];

// Only these are ever set down out in the Commons. Furniture belongs inside a home,
// tools and decorations stay in the pack, so nothing gets scattered across the meadow.
const WORLD_CATEGORIES = ['home', 'vehicle', 'pet'];

// The nine shards that open the Sift, by the ids of the things hidden out in the Republic.
const SIFT_SHARDS = [
  'shard-1',
  'shard-2',
  'shard-3',
  'shard-4',
  'shard-5',
  'shard-6',
  'shard-7',
  'shard-8',
  'shard-9',
];

async function loadBoards(admin) {
  const page = await admin.entities.EventScore.list({ limit: 400, sort: '-score' });
  const rows = page?.items ?? [];
  const boards = {};
  EVENT_IDS.forEach((id) => {
    boards[id] = [];
  });
  rows.forEach((row) => {
    const list = boards[row.event];
    if (!list || list.length >= 5) return;
    list.push({
      id: row.id,
      citizen_key: row.citizen_key || '',
      name: row.name || 'A citizen',
      species: row.species || 'goose',
      score: Math.round(row.score ?? 0),
    });
  });
  return boards;
}

async function findCitizen(admin, code) {
  if (!code) return null;
  const page = await admin.entities.Citizen.filter({ passport_code: code }, { limit: 1 });
  return page?.items?.[0] ?? null;
}

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? '');
    const admin = createClientFromRequest(req).asServiceRole;

    if (action === 'market') {
      return Response.json({ market: marketSnapshot() });
    }

    if (action === 'jobs') {
      return Response.json({ jobs: JOBS });
    }

    if (action === 'leaderboard') {
      const viewerCode = String(body.code ?? '').trim().toLowerCase();
      const viewer = viewerCode ? await findCitizen(admin, viewerCode) : null;
      const personal: Record<string, number> = {};
      if (viewer) {
        const mine = await admin.entities.EventScore.filter(
          { citizen_key: viewer.id },
          { limit: 20 }
        );
        (mine?.items ?? []).forEach((row) => {
          const event = String(row.event ?? '');
          if (EVENT_IDS.includes(event)) {
            personal[event] = Math.max(personal[event] ?? 0, Math.round(row.score ?? 0));
          }
        });
      }
      return Response.json({ boards: await loadBoards(admin), personal });
    }

    if (action === 'world') {
      const itemsPage = await admin.entities.ShopItem.list({ limit: 200 });
      const itemsById = new Map((itemsPage?.items ?? []).map((item) => [item.id, item]));
      const citizensPage = await admin.entities.Citizen.list({ limit: 200, sort: 'created_date' });
      const residentsRaw = citizensPage?.items ?? [];
      const rawCode = String(body.code ?? '').trim().toLowerCase();

      const spotsOf = (citizen) =>
        (Array.isArray(citizen.world_spots) ? citizen.world_spots : [])
          .map((spot) => {
            const item = itemsById.get(spot.item_id);
            if (!item) return null;
            const category = item.category || 'decoration';
            if (!WORLD_CATEGORIES.includes(category)) return null;
            return {
              item_id: item.id,
              name: item.name,
              emoji: item.emoji || '📦',
              category,
              price: Math.round(item.price ?? 0),
              x: clampSpot(spot.x, 2, 98),
              y: clampSpot(spot.y, 6, 94),
            };
          })
          .filter(Boolean);

      const wornOf = (entry) =>
        (Array.isArray(entry.decorations) ? entry.decorations : [])
          .map((id) => itemsById.get(id))
          .filter(Boolean)
          .map((item) => item.emoji || '📦');

      const viewer = rawCode
        ? residentsRaw.find((entry) => entry.passport_code === rawCode) ?? null
        : null;
      const myFriendships = viewer ? await friendshipsFor(admin, viewer.id) : [];

      const residents = residentsRaw.map((entry) => {
        const spots = spotsOf(entry);
        const home = spots.find((spot) => spot.category === 'home');
        const state = viewer
          ? friendState(myFriendships, viewer.id, entry.id)
          : { status: 'none', incoming: false, id: '' };
        return {
          key: entry.id,
          worn: wornOf(entry),
          name: entry.goose_name || entry.full_name || entry.username || 'Anonymous honker',
          username: entry.username || '',
          species: entry.species || 'goose',
          avatar_url: entry.avatar_url || '',
          district: entry.district || '',
          job: entry.job || '',
          is_me: Boolean(rawCode) && entry.passport_code === rawCode,
          spots,
          home_price: home?.price ?? 0,
          home_open: entry.home_open === true,
          friend: state.status === 'friend',
          friend_pending: state.status === 'pending',
          friend_incoming: state.incoming,
          friend_request: state.id,
          can_enter: entry.home_open === true || state.status === 'friend',
        };
      });

      const mineEntry = rawCode
        ? residentsRaw.find((entry) => entry.passport_code === rawCode) ?? null
        : null;
      let mine = null;
      if (mineEntry) {
        const placedSpots = spotsOf(mineEntry);
        mine = {
          name: mineEntry.goose_name || mineEntry.full_name || 'You',
          items: (Array.isArray(mineEntry.possessions) ? mineEntry.possessions : [])
            .map((id) => itemsById.get(id))
            .filter(Boolean)
            .map((item) => ({
              item_id: item.id,
              name: item.name,
              emoji: item.emoji || '📦',
              category: item.category || 'decoration',
              placed: placedSpots.some((spot) => spot.item_id === item.id),
            })),
        };
      }

      return Response.json({
        residents,
        mine,
        me_key: viewer?.id || '',
        friends: viewer
          ? await friendBundle(admin, viewer)
          : { friends: [], incoming: [], outgoing: [] },
      });
    }

    if (action === 'googleLogin') {
      const email = String(body.email ?? '').trim().toLowerCase();
      const userId = String(body.user_id ?? '').trim();
      if (!email && !userId) {
        return Response.json(
          { error: 'Google did not share an address with the passport office.' },
          { status: 400 }
        );
      }

      let found = null;
      if (userId) {
        const byAccount = await admin.entities.Citizen.filter({ auth_user_id: userId }, { limit: 1 });
        found = byAccount?.items?.[0] ?? null;
      }
      if (!found && email) {
        const byEmail = await admin.entities.Citizen.filter({ email }, { limit: 1 });
        found = byEmail?.items?.[0] ?? null;
      }
      if (!found) {
        return Response.json(
          {
            error:
              'No passport on the register uses that Google address. Register at the Citizenship Office with it, or sign in with your username and password.',
          },
          { status: 404 }
        );
      }
      if (userId && found.auth_user_id !== userId) {
        await admin.entities.Citizen.update(found.id, { auth_user_id: userId });
      }

      const googleHoldings = await loadHoldings(admin, found.passport_code);
      return Response.json({ citizen: publicCitizen(found, googleHoldings) });
    }

    if (action === 'login') {
      const username = normaliseUsername(body.username);
      const password = String(body.password ?? '');
      if (!username || !password) {
        return Response.json(
          { error: 'Enter your citizen username and password.' },
          { status: 400 }
        );
      }
      const page = await admin.entities.Citizen.filter({ username }, { limit: 1 });
      const found = page?.items?.[0] ?? null;
      const hash = found?.password_hash || '';
      const computed = hash ? await hashPassword(password, found.password_salt || '') : '';
      if (!found || !hash || computed !== hash) {
        return Response.json(
          { error: 'That username and password do not match a citizen on the register.' },
          { status: 401 }
        );
      }
      const loginHoldings = await loadHoldings(admin, found.passport_code);
      return Response.json({ citizen: publicCitizen(found, loginHoldings) });
    }

    const code = String(body.code ?? '').trim().toLowerCase();
    if (!code) {
      return Response.json({ error: 'Enter your citizen passport code.' }, { status: 400 });
    }

    const citizen = await findCitizen(admin, code);
    if (!citizen) {
      return Response.json(
        { error: 'That passport code is not on the national register.' },
        { status: 404 }
      );
    }

    const holdings = await loadHoldings(admin, code);

    if (action === 'submitScore') {
      const event = String(body.event ?? '');
      if (!EVENT_IDS.includes(event)) {
        return Response.json({ error: 'That is not a Champion Isle event.' }, { status: 400 });
      }
      const score = Math.floor(Number(body.score));
      if (!Number.isFinite(score) || score < 0 || score > 100000) {
        return Response.json({ error: 'That score could not be recorded.' }, { status: 400 });
      }
      const name = citizen.goose_name || citizen.full_name || 'A citizen';
      const existing = await admin.entities.EventScore.filter(
        { citizen_key: citizen.id, event },
        { limit: 1 }
      );
      const best = existing?.items?.[0] ?? null;
      const previousBest = Math.round(best?.score ?? 0);
      if (!best) {
        await admin.entities.EventScore.create({
          event,
          citizen_key: citizen.id,
          name,
          species: citizen.species || 'goose',
          score,
        });
      } else if (score > previousBest) {
        await admin.entities.EventScore.update(best.id, {
          name,
          species: citizen.species || 'goose',
          score,
        });
      }
      const improved = score > previousBest;
      let scored = citizen;
      let xpGained = 0;
      if (improved) {
        xpGained = 15;
        scored = await admin.entities.Citizen.update(citizen.id, {
          xp: xpOf(citizen) + xpGained,
        });
      }
      return Response.json({
        boards: await loadBoards(admin),
        best: Math.max(score, previousBest),
        improved,
        xp_gained: xpGained,
        citizen: publicCitizen(scored, holdings),
      });
    }

    if (action === 'profile') {
      const shelf = await admin.entities.ShopItem.list({ limit: 200 });
      const itemsById = new Map((shelf?.items ?? []).map((item) => [item.id, item]));
      const worn = (Array.isArray(citizen.decorations) ? citizen.decorations : [])
        .map((id) => itemsById.get(id))
        .filter(Boolean)
        .map((item) => item.emoji || '📦');
      return Response.json({ citizen: { ...publicCitizen(citizen, holdings), worn } });
    }

    if (action === 'arenaResult') {
      const kills = Math.min(MAX_ARENA_KILLS, Math.max(0, Math.floor(Number(body.kills) || 0)));
      const duels = Math.min(MAX_ARENA_DUELS, Math.max(0, Math.floor(Number(body.duels) || 0)));
      const gain = kills * 12 + duels * 25;
      if (gain < 1) {
        return Response.json({ citizen: publicCitizen(citizen, holdings), gained: 0 });
      }
      const updated = await admin.entities.Citizen.update(citizen.id, {
        xp: xpOf(citizen) + gain,
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), gained: gain });
    }

    if (action === 'upgradeSword') {
      const tier = swordTier(citizen.sword_tier);
      const next = nextSwordFor(tier);
      if (!next) {
        return Response.json(
          { error: 'Dawnpiercer is already yours. There is nothing finer in the Republic.' },
          { status: 400 }
        );
      }
      const bread = Math.round(citizen.bread ?? 0);
      if (bread < next.cost) {
        return Response.json(
          { error: `The smith wants 🍞 ${next.cost} for the ${next.name}.` },
          { status: 400 }
        );
      }
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: bread - next.cost,
        sword_tier: tier + 1,
      });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'setAvatar') {
      const avatarUrl = String(body.avatar_url ?? '').trim().slice(0, 600);
      if (!/^https:\/\/\S+$/.test(avatarUrl)) {
        return Response.json({ error: 'That portrait could not be used.' }, { status: 400 });
      }
      const updated = await admin.entities.Citizen.update(citizen.id, { avatar_url: avatarUrl });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'bake') {
      const clicks = Math.floor(Number(body.clicks));
      if (!Number.isFinite(clicks) || clicks < 1 || clicks > MAX_BAKE_CLICKS) {
        return Response.json({ error: 'The oven rejected that batch.' }, { status: 400 });
      }
      // Ten loaves make one bread; the rest wait in the oven for the next batch.
      const carried = Math.max(0, Math.floor(citizen.bake_progress ?? 0));
      const loaves = carried + clicks;
      const earned = Math.floor(loaves / LOAVES_PER_BREAD);
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + earned,
        bread_earned: earnedTotal(citizen) + earned,
        bake_progress: loaves % LOAVES_PER_BREAD,
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), earned, loaves: clicks });
    }

    if (action === 'collect') {
      const workers = Math.max(0, Math.floor(citizen.workers ?? 0));
      if (workers < 1) {
        return Response.json({ citizen: publicCitizen(citizen, holdings), earned: 0 });
      }
      const now = Date.now();
      const last = citizen.last_baked ? new Date(citizen.last_baked).getTime() : now;
      const seconds = Math.min(Math.max(0, (now - last) / 1000), MAX_OFFLINE_SECONDS);
      const loaves = Math.floor((seconds * workers) / WORKER_SECONDS_PER_LOAF);
      if (loaves < 1) {
        return Response.json({ citizen: publicCitizen(citizen, holdings), earned: 0, loaves: 0 });
      }
      const carried = Math.max(0, Math.floor(citizen.bake_progress ?? 0));
      const batch = carried + loaves;
      const earned = Math.min(Math.floor(batch / LOAVES_PER_BREAD), MAX_WORKER_EARN);
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + earned,
        bread_earned: earnedTotal(citizen) + earned,
        bake_progress: batch % LOAVES_PER_BREAD,
        last_baked: new Date(now).toISOString(),
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), earned, loaves });
    }

    if (action === 'hireWorker') {
      const workers = Math.max(0, Math.floor(citizen.workers ?? 0));
      if (workers >= MAX_WORKERS) {
        return Response.json({ error: 'The kitchen is already full of hands.' }, { status: 400 });
      }
      const cost = workerCost(workers);
      const bread = Math.round(citizen.bread ?? 0);
      if (bread < cost) {
        return Response.json(
          { error: `A new bakery hand costs ${cost} bread. Keep honking the lever.` },
          { status: 400 }
        );
      }
      const patch = { bread: bread - cost, workers: workers + 1 };
      if (!citizen.last_baked || workers < 1) patch.last_baked = new Date().toISOString();
      const updated = await admin.entities.Citizen.update(citizen.id, patch);
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'chatReward') {
      const last = citizen.last_chat_reward ? new Date(citizen.last_chat_reward).getTime() : 0;
      if (Date.now() - last < CHAT_COOLDOWN_MS) {
        return Response.json({ citizen: publicCitizen(citizen, holdings), earned: 0 });
      }
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + CHAT_REWARD,
        bread_earned: earnedTotal(citizen) + CHAT_REWARD,
        last_chat_reward: new Date().toISOString(),
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), earned: CHAT_REWARD });
    }

    if (action === 'takeJob') {
      const job = jobById(String(body.job ?? ''));
      if (!job) {
        return Response.json({ error: 'That post is not on the national register.' }, { status: 400 });
      }
      if (citizen.job === job.id) {
        return Response.json({ citizen: publicCitizen(citizen, holdings) });
      }
      const earned = earnedTotal(citizen);
      if (earned < job.unlock_bread) {
        return Response.json(
          {
            error: `${job.title} only opens once you have earned ${job.unlock_bread} bread in the Republic. You have earned ${earned}.`,
          },
          { status: 400 }
        );
      }
      const updated = await admin.entities.Citizen.update(citizen.id, {
        job: job.id,
        last_wage: new Date().toISOString(),
      });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'quitJob') {
      const updated = await admin.entities.Citizen.update(citizen.id, { job: '', last_wage: '' });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'workShift') {
      const job = jobById(citizen.job);
      if (!job) {
        return Response.json({ citizen: publicCitizen(citizen, holdings), earned: 0 });
      }
      const now = Date.now();
      const last = citizen.last_wage ? new Date(citizen.last_wage).getTime() : now;
      const seconds = Math.min(Math.max(0, (now - last) / 1000), MAX_SHIFT_SECONDS);
      const earned = Math.floor((seconds / 60) * job.wage);
      if (earned < 1) {
        return Response.json({ citizen: publicCitizen(citizen, holdings), earned: 0 });
      }
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + earned,
        bread_earned: earnedTotal(citizen) + earned,
        last_wage: new Date(now).toISOString(),
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), earned });
    }

    if (action === 'collectFind') {
      const findId = String(body.find_id ?? '');
      if (!isFind(findId)) {
        return Response.json({ error: 'That is not one of the lost things.' }, { status: 400 });
      }
      const finds = Array.isArray(citizen.finds) ? citizen.finds : [];
      if (finds.includes(findId)) {
        return Response.json({ citizen: publicCitizen(citizen, holdings) });
      }
      const updated = await admin.entities.Citizen.update(citizen.id, {
        finds: [...finds, findId],
      });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    // The Sift gate: nine holes in the witch's stone, one shard set into each.
    if (action === 'siftKey') {
      const finds = Array.isArray(citizen.finds) ? citizen.finds : [];
      const carried = finds.filter((id) => SIFT_SHARDS.includes(id)).length;
      const holes = (Array.isArray(citizen.sift_keys) ? citizen.sift_keys : [])
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value >= 0 && value < SIFT_SHARDS.length);
      const hole = Number(body.hole);
      if (!Number.isInteger(hole) || hole < 0 || hole >= SIFT_SHARDS.length) {
        return Response.json({ error: 'That is not one of the nine holes.' }, { status: 400 });
      }
      let next: number[];
      if (holes.includes(hole)) {
        next = holes.filter((value) => value !== hole);
      } else {
        if (carried === 0) {
          return Response.json(
            { error: 'You are carrying no shards to set in the gate.' },
            { status: 400 }
          );
        }
        if (holes.length >= carried) {
          return Response.json(
            { error: 'Every shard you carry is already set in a hole.' },
            { status: 400 }
          );
        }
        next = [...holes, hole].sort((a, b) => a - b);
      }
      const updated = await admin.entities.Citizen.update(citizen.id, { sift_keys: next });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'equip' || action === 'unequip') {
      const itemId = String(body.item_id ?? '');
      const owned = Array.isArray(citizen.possessions) ? citizen.possessions : [];
      if (!owned.includes(itemId)) {
        return Response.json({ error: 'That is not in your pack.' }, { status: 400 });
      }
      const item = await admin.entities.ShopItem
        .get(itemId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      const slot = slotOfTackle(item);
      if (!slot) {
        return Response.json({ error: 'That is not fishing tackle.' }, { status: 400 });
      }
      const gearIds = Array.isArray(citizen.gear) ? citizen.gear : [];
      let next = gearIds;
      if (action === 'unequip') {
        next = gearIds.filter((id: string) => id !== itemId);
      } else {
        const shelf = await admin.entities.ShopItem.list({ limit: 200 });
        const byId = new Map((shelf?.items ?? []).map((row) => [row.id, row]));
        next = [
          ...gearIds.filter((id: string) => slotOfTackle(byId.get(id)) !== slot),
          itemId,
        ];
      }
      const updated = await admin.entities.Citizen.update(citizen.id, { gear: next });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'fishCatch') {
      const quality = Math.max(0, Math.min(3, Math.floor(Number(body.quality ?? 1)) || 1));
      const earned = 2 + quality * 2;
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + earned,
        bread_earned: earnedTotal(citizen) + earned,
        fish_caught: Math.max(0, Math.floor(citizen.fish_caught ?? 0)) + 1,
      });
      return Response.json({
        citizen: publicCitizen(updated, holdings),
        earned,
        fish_caught: Math.max(0, Math.floor(citizen.fish_caught ?? 0)) + 1,
      });
    }

    if (action === 'claimQuest') {
      const quest = questById(String(body.quest_id ?? ''));
      if (!quest) {
        return Response.json({ error: 'That is not a quest of the Republic.' }, { status: 400 });
      }
      const done = Array.isArray(citizen.quests) ? citizen.quests : [];
      if (done.includes(quest.id)) {
        return Response.json({ error: 'You have already been paid for that one.' }, { status: 400 });
      }
      const finds = Array.isArray(citizen.finds) ? citizen.finds : [];
      const missing = (quest.finds ?? []).filter((id: string) => !finds.includes(id));
      if (missing.length > 0) {
        return Response.json({ error: 'You have not found everything yet.' }, { status: 400 });
      }
      if ((quest.fish ?? 0) > Math.max(0, Math.floor(citizen.fish_caught ?? 0))) {
        return Response.json(
          { error: `Not enough fish yet — ${quest.fish} are wanted.` },
          { status: 400 }
        );
      }
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + quest.reward.bread,
        bread_earned: earnedTotal(citizen) + quest.reward.bread,
        xp: xpOf(citizen) + quest.reward.xp,
        quests: [...done, quest.id],
      });
      return Response.json({
        citizen: publicCitizen(updated, holdings),
        reward: quest.reward,
      });
    }

    if (action === 'buyItem') {
      const itemId = String(body.item_id ?? '');
      const item = await admin.entities.ShopItem
        .get(itemId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));

      if (!item) {
        return Response.json({ error: 'That item is no longer sold.' }, { status: 404 });
      }

      const category = item.category || 'decoration';

      if (category === 'furniture') {
        const current = Array.isArray(citizen.possessions) ? citizen.possessions : [];
        const shelf = await admin.entities.ShopItem.list({ limit: 200 });
        const shelfById = new Map((shelf?.items ?? []).map((row) => [row.id, row]));
        const placedSpots = Array.isArray(citizen.world_spots) ? citizen.world_spots : [];
        const hasHome =
          current.some((id) => (shelfById.get(id)?.category || '') === 'home') ||
          placedSpots.some((spot) => (shelfById.get(spot.item_id)?.category || '') === 'home');
        if (!hasHome) {
          return Response.json(
            { error: 'Buy a home in the Commons before you furnish it.' },
            { status: 400 }
          );
        }
      }

      const worn = Array.isArray(citizen.decorations) ? citizen.decorations : [];
      const owned = Array.isArray(citizen.possessions) ? citizen.possessions : [];
      const collection = category === 'decoration' ? worn : owned;

      if (collection.includes(item.id)) {
        return Response.json({ error: 'You already own that.' }, { status: 400 });
      }
      if (collection.length >= (category === 'decoration' ? MAX_DECORATIONS : MAX_POSSESSIONS)) {
        return Response.json({ error: 'You already hold as many as the Republic allows.' }, { status: 400 });
      }
      if (Math.round(citizen.bread ?? 0) < item.price) {
        return Response.json(
          { error: 'Not enough bread. Bake some in Goose Games or sell shares in the market.' },
          { status: 400 }
        );
      }

      const patch = { bread: Math.round(citizen.bread ?? 0) - item.price };
      if (category === 'decoration') {
        patch.decorations = [...worn, item.id];
      } else {
        // Everything bought waits in the pack until the citizen sets it down.
        patch.possessions = [...owned, item.id];
      }
      const updated = await admin.entities.Citizen.update(citizen.id, patch);
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    // A home, vehicle or pet set down on the land leaves the pack for good.
    if (action === 'placeSpot') {
      const itemId = String(body.item_id ?? '');
      const item = await admin.entities.ShopItem
        .get(itemId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!item || !WORLD_CATEGORIES.includes(item.category || '')) {
        return Response.json(
          { error: 'Only a home, a vehicle or a pet can be set down out here.' },
          { status: 400 }
        );
      }
      const owned = Array.isArray(citizen.possessions) ? citizen.possessions : [];
      const spots = Array.isArray(citizen.world_spots) ? citizen.world_spots : [];
      const placed = spots.some((spot) => spot.item_id === itemId);
      if (!owned.includes(itemId) && !placed) {
        return Response.json({ error: 'You do not own that.' }, { status: 400 });
      }
      const next = [
        ...spots.filter((spot) => spot.item_id !== itemId),
        { item_id: itemId, x: clampSpot(body.x, 2, 98), y: clampSpot(body.y, 6, 94) },
      ];
      const patch: Record<string, unknown> = { world_spots: next };
      if (owned.includes(itemId)) patch.possessions = owned.filter((id) => id !== itemId);
      const updated = await admin.entities.Citizen.update(citizen.id, patch);
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'homeItem') {
      const itemId = String(body.item_id ?? '').trim();
      const owned = Array.isArray(citizen.possessions) ? citizen.possessions : [];
      const room = Array.isArray(citizen.home_items) ? citizen.home_items : [];
      const inRoom = room.some((entry) => entry.item_id === itemId);
      if (!owned.includes(itemId) && !inRoom) {
        return Response.json({ error: 'You do not own that.' }, { status: 400 });
      }
      const item = await admin.entities.ShopItem
        .get(itemId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!item || (item.category || '') !== 'furniture') {
        return Response.json(
          { error: 'Only furniture can be set out inside a home.' },
          { status: 400 }
        );
      }
      const kept = room.filter((entry) => entry.item_id !== itemId);
      const placing = body.x !== undefined && body.y !== undefined;
      // A piece set down leaves the pack; lifted off the floor it goes back in.
      const next = placing
        ? [...kept, { item_id: itemId, x: clampSpot(body.x, 6, 94), y: clampSpot(body.y, 40, 92) }]
        : kept;
      const rest = owned.filter((id) => id !== itemId);
      const updated = await admin.entities.Citizen.update(citizen.id, {
        home_items: next,
        possessions: placing ? rest : [...rest, itemId],
      });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'mine') {
      const now = Date.now();
      const last = Date.parse(citizen.last_mined || '') || 0;
      if (now - last < 2500) {
        return Response.json({ error: 'Catch your breath before the next swing.' }, { status: 429 });
      }
      // A better pick in the pack breaks off more of the seam with every swing.
      const shelf = await admin.entities.ShopItem.list({ limit: 300 });
      const shelfById = new Map((shelf?.items ?? []).map((row) => [row.id, row]));
      const picks = (Array.isArray(citizen.possessions) ? citizen.possessions : [])
        .map((id) => shelfById.get(id))
        .filter((item) => item && /pick/i.test(String(item.name ?? '')));
      const bestPick = picks.reduce((best, item) => Math.max(best, Number(item.price ?? 0)), 0);
      const swing =
        bestPick >= 2000 ? 3 : bestPick >= 900 ? 2.2 : bestPick >= 300 ? 1.6 : bestPick > 0 ? 1.25 : 1;
      const chunks = bestPick >= 900 ? 2 : 1;
      const haul = Math.round((5 + Math.random() * 9) * swing);
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + haul,
        bread_earned: earnedTotal(citizen) + haul,
        ore: Math.max(0, Math.floor(citizen.ore ?? 0)) + chunks,
        xp: xpOf(citizen) + 1,
        last_mined: new Date(now).toISOString(),
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), haul });
    }

    if (action === 'sellItem') {
      const itemId = String(body.item_id ?? '');
      const owned = Array.isArray(citizen.possessions) ? citizen.possessions : [];
      const worn = Array.isArray(citizen.decorations) ? citizen.decorations : [];
      const inPossessions = owned.includes(itemId);
      const inDecorations = worn.includes(itemId);
      if (!inPossessions && !inDecorations) {
        return Response.json({ error: 'You do not own that.' }, { status: 400 });
      }
      const item = await admin.entities.ShopItem
        .get(itemId)
        .catch(() => null);
      const refund = Math.floor(Number(item?.price ?? 0) * 0.8);
      const patch: Record<string, unknown> = { bread: Math.round(citizen.bread ?? 0) + refund };
      if (inPossessions) {
        patch.possessions = owned.filter((id) => id !== itemId);
        patch.world_spots = (Array.isArray(citizen.world_spots) ? citizen.world_spots : []).filter(
          (spot) => spot.item_id !== itemId
        );
      } else {
        patch.decorations = worn.filter((id) => id !== itemId);
      }
      const updated = await admin.entities.Citizen.update(citizen.id, patch);
      return Response.json({ citizen: publicCitizen(updated, holdings), refund });
    }

    if (action === 'offers') {
      return Response.json({ offers: await loadOffers(admin, citizen.id) });
    }

    if (action === 'makeOffer') {
      const itemId = String(body.item_id ?? '').trim();
      const toKey = String(body.to_key ?? '').trim();
      const amount = Math.floor(Number(body.amount));

      if (!itemId || !toKey) {
        return Response.json({ error: 'That item is no longer in the Commons.' }, { status: 400 });
      }
      if (toKey === citizen.id) {
        return Response.json({ error: 'That already belongs to you.' }, { status: 400 });
      }
      if (!Number.isFinite(amount) || amount < 1) {
        return Response.json({ error: 'Offer at least 1 bread.' }, { status: 400 });
      }
      const bread = Math.round(citizen.bread ?? 0);
      if (amount > bread) {
        return Response.json({ error: `You only hold ${bread} bread in hand.` }, { status: 400 });
      }

      const seller = await admin.entities.Citizen
        .get(toKey)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!seller) {
        return Response.json({ error: 'That citizen has left the register.' }, { status: 404 });
      }

      const sellerItems = Array.isArray(seller.possessions) ? seller.possessions : [];
      if (!sellerItems.includes(itemId)) {
        return Response.json({ error: 'That item is no longer in their meadow.' }, { status: 400 });
      }
      const myItems = Array.isArray(citizen.possessions) ? citizen.possessions : [];
      if (myItems.includes(itemId)) {
        return Response.json({ error: 'You already own one of those.' }, { status: 400 });
      }

      const item = await admin.entities.ShopItem
        .get(itemId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!item) {
        return Response.json({ error: 'That item is no longer sold.' }, { status: 404 });
      }

      const payload = {
        from_key: citizen.id,
        from_name: citizen.goose_name || citizen.full_name || 'A citizen',
        to_key: seller.id,
        to_name: seller.goose_name || seller.full_name || 'A citizen',
        item_id: itemId,
        item_name: item.name,
        item_emoji: item.emoji || '📦',
        item_category: item.category || 'home',
        amount,
        status: 'pending',
      };

      const existing = await admin.entities.TradeOffer.filter(
        { from_key: citizen.id, to_key: seller.id, item_id: itemId, status: 'pending' },
        { limit: 1 }
      );
      const previous = existing?.items?.[0];
      if (previous) {
        await admin.entities.TradeOffer.update(previous.id, payload);
      } else {
        await admin.entities.TradeOffer.create(payload);
      }

      return Response.json({ offers: await loadOffers(admin, citizen.id) });
    }

    if (action === 'withdrawOffer') {
      const offerId = String(body.offer_id ?? '');
      const offer = await admin.entities.TradeOffer
        .get(offerId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!offer || offer.from_key !== citizen.id) {
        return Response.json({ error: 'That offer is not yours.' }, { status: 404 });
      }
      if (offer.status === 'pending') {
        await admin.entities.TradeOffer.update(offer.id, { status: 'withdrawn' });
      }
      return Response.json({ offers: await loadOffers(admin, citizen.id) });
    }

    if (action === 'replyOffer') {
      const offerId = String(body.offer_id ?? '');
      const accept = body.accept === true;
      const offer = await admin.entities.TradeOffer
        .get(offerId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));

      if (!offer || offer.to_key !== citizen.id) {
        return Response.json({ error: 'That offer is not yours to answer.' }, { status: 404 });
      }
      if (offer.status !== 'pending') {
        return Response.json({ error: 'That offer was already settled.' }, { status: 400 });
      }

      if (!accept) {
        await admin.entities.TradeOffer.update(offer.id, { status: 'declined' });
        return Response.json({ offers: await loadOffers(admin, citizen.id) });
      }

      const itemId = offer.item_id;
      const amount = Math.round(offer.amount ?? 0);
      const sellerItems = Array.isArray(citizen.possessions) ? citizen.possessions : [];
      if (!sellerItems.includes(itemId)) {
        await admin.entities.TradeOffer.update(offer.id, { status: 'expired' });
        return Response.json(
          { error: 'You no longer own that item, so the offer is void.' },
          { status: 400 }
        );
      }

      const buyer = await admin.entities.Citizen
        .get(offer.from_key)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!buyer) {
        await admin.entities.TradeOffer.update(offer.id, { status: 'expired' });
        return Response.json({ error: 'That buyer has left the register.' }, { status: 400 });
      }

      const buyerItems = Array.isArray(buyer.possessions) ? buyer.possessions : [];
      if (buyerItems.includes(itemId)) {
        return Response.json({ error: 'They already own one of those.' }, { status: 400 });
      }
      const buyerBread = Math.round(buyer.bread ?? 0);
      if (buyerBread < amount) {
        return Response.json(
          { error: `They no longer hold the ${amount} bread they offered.` },
          { status: 400 }
        );
      }
      if (buyerItems.length >= MAX_POSSESSIONS) {
        return Response.json({ error: 'Their meadow is already full.' }, { status: 400 });
      }

      const sellerSpots = (Array.isArray(citizen.world_spots) ? citizen.world_spots : []).filter(
        (spot) => spot.item_id !== itemId
      );
      const updatedSeller = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + amount,
        possessions: sellerItems.filter((id) => id !== itemId),
        world_spots: sellerSpots,
      });

      // The buyer's new thing waits in their pack until they set it down themselves.
      await admin.entities.Citizen.update(buyer.id, {
        bread: buyerBread - amount,
        possessions: [...buyerItems, itemId],
      });

      await admin.entities.TradeOffer.update(offer.id, { status: 'accepted' });

      return Response.json({
        citizen: publicCitizen(updatedSeller, holdings),
        offers: await loadOffers(admin, citizen.id),
        sold: amount,
      });
    }

    if (action === 'friendRequest') {
      const toKey = String(body.to_key ?? '');
      if (!toKey || toKey === citizen.id) {
        return Response.json({ error: 'That is not a neighbour.' }, { status: 400 });
      }
      const target = await admin.entities.Citizen
        .get(toKey)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!target) {
        return Response.json({ error: 'That citizen is not on the register.' }, { status: 404 });
      }
      const rows = await friendshipsFor(admin, citizen.id);
      const existing = friendState(rows, citizen.id, toKey);
      if (!existing.id) {
        await admin.entities.Friendship.create({
          from_key: citizen.id,
          to_key: toKey,
          from_name: nameOf(citizen),
          to_name: nameOf(target),
          status: 'pending',
        });
      }
      return Response.json({ friends: await friendBundle(admin, citizen) });
    }

    if (action === 'friendReply') {
      const requestId = String(body.request_id ?? '');
      const accept = body.accept === true;
      const row = await admin.entities.Friendship
        .get(requestId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!row || (row.to_key !== citizen.id && row.from_key !== citizen.id)) {
        return Response.json({ error: 'That request is not yours.' }, { status: 404 });
      }
      if (accept) {
        await admin.entities.Friendship.update(row.id, { status: 'accepted' });
      } else {
        await admin.entities.Friendship.delete(row.id);
      }
      return Response.json({ friends: await friendBundle(admin, citizen) });
    }

    if (action === 'friendRemove') {
      const toKey = String(body.to_key ?? '');
      const rows = await friendshipsFor(admin, citizen.id);
      const row = rows.find(
        (entry) =>
          (entry.from_key === citizen.id && entry.to_key === toKey) ||
          (entry.from_key === toKey && entry.to_key === citizen.id)
      );
      if (row) await admin.entities.Friendship.delete(row.id);
      return Response.json({ friends: await friendBundle(admin, citizen) });
    }

    if (action === 'homeOpen') {
      const updated = await admin.entities.Citizen.update(citizen.id, {
        home_open: body.open === true,
      });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'guestHome') {
      const ownerKey = String(body.key ?? '');
      const owner = await admin.entities.Citizen
        .get(ownerKey)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));
      if (!owner) {
        return Response.json({ error: 'That home has no keeper.' }, { status: 404 });
      }
      const rows = await friendshipsFor(admin, citizen.id);
      const state = friendState(rows, citizen.id, owner.id);
      const allowed = owner.home_open === true || state.status === 'friend';
      if (!allowed) {
        return Response.json({ locked: true, name: nameOf(owner) });
      }
      const shelf = await admin.entities.ShopItem.list({ limit: 300 });
      const byId = new Map((shelf?.items ?? []).map((item) => [item.id, item]));
      const home = (Array.isArray(owner.world_spots) ? owner.world_spots : [])
        .map((spot) => byId.get(spot.item_id))
        .find((item) => item && (item.category || '') === 'home');
      const furniture = (Array.isArray(owner.home_items) ? owner.home_items : [])
        .map((entry) => {
          const item = byId.get(entry.item_id);
          if (!item) return null;
          return { item_id: item.id, emoji: item.emoji || '🪑', name: item.name, x: entry.x, y: entry.y };
        })
        .filter(Boolean);
      return Response.json({
        name: nameOf(owner),
        species: owner.species || 'goose',
        price: Math.round(home?.price ?? 0),
        furniture,
        is_friend: state.status === 'friend',
        open: owner.home_open === true,
      });
    }

    if (action === 'whisper') {
      const toKey = String(body.to_key ?? '');
      const [sent, received] = await Promise.all([
        admin.entities.Whisper.filter({ from_key: citizen.id, to_key: toKey }, { limit: 60 }),
        admin.entities.Whisper.filter({ from_key: toKey, to_key: citizen.id }, { limit: 60 }),
      ]);
      const messages = [...(sent?.items ?? []), ...(received?.items ?? [])]
        .sort((a, b) => String(a.created_date || '').localeCompare(String(b.created_date || '')))
        .slice(-40)
        .map((row) => ({
          id: row.id,
          mine: row.from_key === citizen.id,
          body: row.body,
          at: row.created_date,
        }));
      return Response.json({ messages });
    }

    if (action === 'whisperSend') {
      const toKey = String(body.to_key ?? '');
      const text = String(body.body ?? '').trim().slice(0, 300);
      if (!toKey || !text) {
        return Response.json({ error: 'Say something first.' }, { status: 400 });
      }
      await admin.entities.Whisper.create({
        from_key: citizen.id,
        to_key: toKey,
        from_name: nameOf(citizen),
        body: text,
      });
      return Response.json({ sent: true });
    }

    if (action === 'loan') {
      const loan = await loadLoan(admin, code);
      return Response.json({ loan: publicLoan(loan, earnedTotal(citizen)) });
    }

    if (action === 'takeLoan') {
      const earned = earnedTotal(citizen);
      const limit = loanCeiling(earned);
      const active = await loadLoan(admin, code);
      if (active) {
        return Response.json(
          { error: 'The bank is still owed for your last loan. Settle it first.' },
          { status: 400 }
        );
      }
      const amount = Math.floor(Number(body.amount));
      if (!Number.isFinite(amount) || amount < 10) {
        return Response.json({ error: 'The bank lends at least 10 bread.' }, { status: 400 });
      }
      if (amount > limit) {
        return Response.json(
          {
            error: `The bank will lend you up to ${limit} bread. Earn more in the Republic to raise your ceiling.`,
          },
          { status: 400 }
        );
      }
      const loan = await admin.entities.Loan.create({
        passport_code: code,
        principal: amount,
        outstanding: Math.round(amount * LOAN_FEE),
        status: 'active',
      });
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + amount,
      });
      return Response.json({
        citizen: publicCitizen(updated, holdings),
        loan: publicLoan(loan, earned),
      });
    }

    if (action === 'repayLoan') {
      const loan = await loadLoan(admin, code);
      if (!loan) {
        return Response.json({ error: 'You owe the bank nothing.' }, { status: 400 });
      }
      const bread = Math.round(citizen.bread ?? 0);
      const amount = Math.floor(Number(body.amount));
      if (!Number.isFinite(amount) || amount < 1) {
        return Response.json({ error: 'Repay at least 1 bread.' }, { status: 400 });
      }
      if (bread < amount) {
        return Response.json({ error: 'Not enough bread in hand.' }, { status: 400 });
      }
      const outstanding = Math.round(loan.outstanding ?? 0);
      const paid = Math.min(amount, outstanding);
      const remaining = outstanding - paid;
      const saved = await admin.entities.Loan.update(loan.id, {
        outstanding: remaining,
        status: remaining === 0 ? 'repaid' : 'active',
      });
      const updated = await admin.entities.Citizen.update(citizen.id, { bread: bread - paid });
      return Response.json({
        citizen: publicCitizen(updated, holdings),
        loan: publicLoan(remaining === 0 ? null : saved, earnedTotal(citizen)),
        paid,
      });
    }

    if (action === 'trade') {
      const stock = MARKET.find((entry) => entry.symbol === body.symbol);
      const side = body.side === 'sell' ? 'sell' : 'buy';
      const shares = Math.floor(Number(body.shares));

      if (!stock) {
        return Response.json({ error: 'Unknown listing.' }, { status: 400 });
      }
      if (!Number.isFinite(shares) || shares < 1 || shares > MAX_SHARES) {
        return Response.json({ error: 'Enter a number of shares between 1 and 5000.' }, { status: 400 });
      }

      const price = priceAt(stock.symbol, currentTick());
      const holding = holdings.find((entry) => entry.symbol === stock.symbol);
      const bread = Math.round(citizen.bread ?? 0);

      if (side === 'buy') {
        const cost = price * shares;
        if (bread < cost) {
          return Response.json(
            { error: `Not enough bread. ${shares} × ${stock.symbol} costs ${cost} bread.` },
            { status: 400 }
          );
        }
        const updated = await admin.entities.Citizen.update(citizen.id, { bread: bread - cost });
        if (holding) {
          const totalShares = holding.shares + shares;
          const average =
            (holding.avg_price * holding.shares + price * shares) / (totalShares || 1);
          await admin.entities.Holding.update(holding.id, {
            shares: totalShares,
            avg_price: average,
          });
        } else {
          await admin.entities.Holding.create({
            passport_code: code,
            symbol: stock.symbol,
            shares,
            avg_price: price,
          });
        }
        const nextHoldings = await loadHoldings(admin, code);
        return Response.json({ citizen: publicCitizen(updated, nextHoldings), price });
      }

      if (!holding || holding.shares < shares) {
        return Response.json({ error: 'You do not own that many shares.' }, { status: 400 });
      }

      const proceeds = price * shares;
      const updated = await admin.entities.Citizen.update(citizen.id, { bread: bread + proceeds });

      if (holding.shares === shares) {
        await admin.entities.Holding.delete(holding.id);
      } else {
        await admin.entities.Holding.update(holding.id, { shares: holding.shares - shares });
      }

      const nextHoldings = await loadHoldings(admin, code);
      return Response.json({ citizen: publicCitizen(updated, nextHoldings), price });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}