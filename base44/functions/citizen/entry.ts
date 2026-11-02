import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { MARKET, marketSnapshot, priceAt, currentTick } from '../../shared/market.ts';
import { hashPassword, normaliseUsername } from '../../shared/passport.ts';

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

function workerCost(workers) {
  return Math.round(WORKER_BASE_COST * Math.pow(WORKER_COST_GROWTH, workers));
}

function publicCitizen(citizen, holdings = []) {
  const decorations = Array.isArray(citizen.decorations) ? citizen.decorations : [];
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
    decorations,
    passport_code: citizen.passport_code,
    username: citizen.username || '',
    workers,
    next_worker_cost: workerCost(workers),
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
      return Response.json({ citizen: publicCitizen(citizen, holdings) });
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
        last_chat_reward: new Date().toISOString(),
      });
      return Response.json({ citizen: publicCitizen(updated, holdings), earned: CHAT_REWARD });
    }

    if (action === 'buyDecoration') {
      const itemId = String(body.item_id ?? '');
      const item = await admin.entities.ShopItem
        .get(itemId)
        .catch((error) => (error.status === 404 ? null : Promise.reject(error)));

      if (!item) {
        return Response.json({ error: 'That decoration is no longer sold.' }, { status: 404 });
      }

      const owned = Array.isArray(citizen.decorations) ? citizen.decorations : [];
      if (owned.includes(item.id)) {
        return Response.json({ error: 'You already own that decoration.' }, { status: 400 });
      }
      if (owned.length >= MAX_DECORATIONS) {
        return Response.json({ error: 'Your animal is carrying enough decoration.' }, { status: 400 });
      }
      if (Math.round(citizen.bread ?? 0) < item.price) {
        return Response.json(
          { error: 'Not enough bread. Bake some in Goose Games or sell shares in the market.' },
          { status: 400 }
        );
      }

      const updated = await admin.entities.Citizen.update(citizen.id, {
        bread: Math.round(citizen.bread ?? 0) - item.price,
        decorations: [...owned, item.id],
      });
      return Response.json({ citizen: publicCitizen(updated, holdings) });
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