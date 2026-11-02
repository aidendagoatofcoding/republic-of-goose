// The national goose stock market.
// Prices are derived from the current minute, so every visitor in the Republic
// sees the same price for the same stock at the same time, with no scheduled job.

export const TICK_MS = 60 * 1000;
const WALK_LENGTH = 24;

export const MARKET = [
  { symbol: 'BRD', name: 'Bread Holdings', base: 120, vol: 0.05 },
  { symbol: 'HONK', name: 'Honkish Telecom', base: 88, vol: 0.07 },
  { symbol: 'FTHR', name: 'Feather & Wing', base: 46, vol: 0.1 },
  { symbol: 'POND', name: 'Pond Realty', base: 210, vol: 0.04 },
  { symbol: 'DUCK', name: 'Duck Defence Systems', base: 34, vol: 0.14 },
  { symbol: 'MIGR', name: 'Migration Airways', base: 158, vol: 0.06 },
  { symbol: 'NEST', name: 'Nest & Twig Co.', base: 72, vol: 0.09 },
  { symbol: 'MOSS', name: 'Moss & Marsh Fertiliser', base: 58, vol: 0.07 },
  { symbol: 'GULL', name: 'Gull Shipping Lines', base: 96, vol: 0.09 },
  { symbol: 'SYLP', name: 'Sylph Pharmaceuticals', base: 142, vol: 0.06 },
  { symbol: 'REED', name: 'Reed & Rush Paper', base: 43, vol: 0.12 },
  { symbol: 'COMB', name: 'Comb Capital', base: 176, vol: 0.05 },
];

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function currentTick(now = Date.now()) {
  return Math.floor(now / TICK_MS);
}

export function priceAt(symbol, tick) {
  const stock = MARKET.find((entry) => entry.symbol === symbol);
  if (!stock) return null;

  const start = Math.max(0, tick - WALK_LENGTH);
  let price = stock.base;

  for (let step = start; step <= tick; step += 1) {
    const drift = (seeded(hashString(`${symbol}:${step}`))() - 0.5) * 2 * stock.vol;
    price *= 1 + drift;
  }

  return Math.max(1, Math.round(price));
}

export function marketSnapshot(now = Date.now()) {
  const tick = currentTick(now);

  return {
    tick,
    secondsToNextTick: Math.max(0, Math.ceil(((tick + 1) * TICK_MS - now) / 1000)),
    stocks: MARKET.map((stock) => {
      const price = priceAt(stock.symbol, tick);
      const previous = tick > 0 ? priceAt(stock.symbol, tick - 1) : price;
      return {
        symbol: stock.symbol,
        name: stock.name,
        price,
        change: price - previous,
        changePct: previous ? ((price - previous) / previous) * 100 : 0,
        history: Array.from({ length: 20 }, (_, index) =>
          priceAt(stock.symbol, tick - (19 - index))
        ),
      };
    }),
  };
}