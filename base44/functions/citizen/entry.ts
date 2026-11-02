import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { MARKET, marketSnapshot, priceAt, currentTick } from '../../shared/market.ts';
import { hashPassword, normaliseUsername } from '../../shared/passport.ts';
import { JOBS, jobById } from '../../shared/jobs.ts';

const CHAT_REWARD = 5;
const CHAT_COOLDOWN_MS = 12000;
const BAKE_RATE = 1;
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

function workerCost(workers) {
  return Math.round(WORKER_BASE_COST * Math.pow(WORKER_COST_GROWTH, workers));
}

function earnedTotal(citizen) {
  return Math.max(0, Math.floor(citizen.bread_earned ?? 0));
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
  return {
    id: citizen.id,
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
    passport_code: citizen.passport_code,
    username: citizen.username || '',
    workers,
    next_worker_cost: workerCost(workers),
    job: citizen.job || '',
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
            return {
              item_id: item.id,
              name: item.name,
              emoji: item.emoji || '📦',
              category: item.category || 'decoration',
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

      const residents = residentsRaw.map((entry) => ({
        key: entry.id,
        worn: wornOf(entry),
        name: entry.goose_name || entry.full_name || entry.username || 'Anonymous honker',
        username: entry.username || '',
        species: entry.species || 'goose',
        avatar_url: entry.avatar_url || '',
        district: entry.district || '',
        job: entry.job || '',
        is_me: Boolean(rawCode) && entry.passport_code === rawCode,
        spots: spotsOf(entry),
      }));

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

      return Response.json({ residents, mine });
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

    if (action === 'profile') {
      const shelf = await admin.entities.ShopItem.list({ limit: 200 });
      const itemsById = new Map((shelf?.items ?? []).map((item) => [item.id, item]));
      const worn = (Array.isArray(citizen.decorations) ? citizen.decorations : [])
        .map((id) => itemsById.get(id))
        .filter(Boolean)
        .map((item) => item.emoji || '📦');
      return Response.json({ citizen: { ...publicCitizen(citizen, holdings), worn } });
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
      const earned = clicks * BAKE_RATE;
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + earned,
        bread_earned: earnedTotal(citizen) + earned,
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), earned });
    }

    if (action === 'collect') {
      const workers = Math.max(0, Math.floor(citizen.workers ?? 0));
      if (workers < 1) {
        return Response.json({ citizen: publicCitizen(citizen, holdings), earned: 0 });
      }
      const now = Date.now();
      const last = citizen.last_baked ? new Date(citizen.last_baked).getTime() : now;
      const seconds = Math.min(Math.max(0, (now - last) / 1000), MAX_OFFLINE_SECONDS);
      const earned = Math.min(Math.floor((seconds * workers) / WORKER_SECONDS_PER_LOAF), MAX_WORKER_EARN);
      if (earned < 1) {
        return Response.json({ citizen: publicCitizen(citizen, holdings), earned: 0 });
      }
      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) + earned,
        bread_earned: earnedTotal(citizen) + earned,
        last_baked: new Date(now).toISOString(),
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), earned });
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

    if (action === 'buyItem') {
      const itemId = String(body.item_id ?? '');
      const item = await admin.entities.ShopItem
        .get(itemId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));

      if (!item) {
        return Response.json({ error: 'That item is no longer sold.' }, { status: 404 });
      }

      const category = item.category || 'decoration';
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
        patch.possessions = [...owned, item.id];
        const spots = Array.isArray(citizen.world_spots) ? citizen.world_spots : [];
        patch.world_spots = [
          ...spots,
          {
            item_id: item.id,
            x: clampSpot(24 + (spots.length % 4) * 18, 2, 98),
            y: clampSpot(52 + (Math.floor(spots.length / 4) % 3) * 15, 6, 94),
          },
        ];
      }
      const updated = await admin.entities.Citizen.update(citizen.id, patch);
      return Response.json({ citizen: publicCitizen(updated, holdings) });
    }

    if (action === 'placeSpot') {
      const itemId = String(body.item_id ?? '');
      const owned = Array.isArray(citizen.possessions) ? citizen.possessions : [];
      if (!owned.includes(itemId)) {
        return Response.json({ error: 'You do not own that.' }, { status: 400 });
      }
      const spots = Array.isArray(citizen.world_spots) ? citizen.world_spots : [];
      const next = [
        ...spots.filter((spot) => spot.item_id !== itemId),
        { item_id: itemId, x: clampSpot(body.x, 2, 98), y: clampSpot(body.y, 6, 94) },
      ];
      const updated = await admin.entities.Citizen.update(citizen.id, { world_spots: next });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
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

      const buyerSpots = Array.isArray(buyer.world_spots) ? buyer.world_spots : [];
      await admin.entities.Citizen.update(buyer.id, {
        bread: buyerBread - amount,
        possessions: [...buyerItems, itemId],
        world_spots: [
          ...buyerSpots,
          {
            item_id: itemId,
            x: clampSpot(24 + (buyerSpots.length % 4) * 18, 2, 98),
            y: clampSpot(52 + (Math.floor(buyerSpots.length / 4) % 3) * 15, 6, 94),
          },
        ],
      });

      await admin.entities.TradeOffer.update(offer.id, { status: 'accepted' });

      return Response.json({
        citizen: publicCitizen(updatedSeller, holdings),
        offers: await loadOffers(admin, citizen.id),
        sold: amount,
      });
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