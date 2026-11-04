// The national goose stock market and the Honkton coin exchange.
// Prices are derived from the current minute, so every visitor in the Republic
// sees the same price for the same listing at the same time, with no scheduled job.

export const TICK_MS = 60 * 1000;
const WALK_LENGTH = 24;

export const MARKET = [
  { symbol: 'BRD', name: 'Bread Holdings', base: 120, vol: 0.05, kind: 'stock' },
  { symbol: 'HONK', name: 'Honkish Telecom', base: 88, vol: 0.07, kind: 'stock' },
  { symbol: 'FTHR', name: 'Feather & Wing', base: 46, vol: 0.1, kind: 'stock' },
  { symbol: 'POND', name: 'Pond Realty', base: 210, vol: 0.04, kind: 'stock' },
  { symbol: 'DUCK', name: 'Duck Defence Systems', base: 34, vol: 0.14, kind: 'stock' },
  { symbol: 'MIGR', name: 'Migration Airways', base: 158, vol: 0.06, kind: 'stock' },
  { symbol: 'NEST', name: 'Nest & Twig Co.', base: 72, vol: 0.09, kind: 'stock' },
  { symbol: 'MOSS', name: 'Moss & Marsh Fertiliser', base: 58, vol: 0.07, kind: 'stock' },
  { symbol: 'GULL', name: 'Gull Shipping Lines', base: 96, vol: 0.09, kind: 'stock' },
  { symbol: 'SYLP', name: 'Sylph Pharmaceuticals', base: 142, vol: 0.06, kind: 'stock' },
  { symbol: 'REED', name: 'Reed & Rush Paper', base: 43, vol: 0.12, kind: 'stock' },
  { symbol: 'COMB', name: 'Comb Capital', base: 176, vol: 0.05, kind: 'stock' },
  { symbol: 'SAGE', name: 'Sage & Sons Herbalists', base: 64, vol: 0.08, kind: 'stock' },
  { symbol: 'PLUM', name: 'Plume & Quill Publishing', base: 51, vol: 0.11, kind: 'stock' },
  { symbol: 'TIDE', name: 'Tidewater Ferries', base: 132, vol: 0.07, kind: 'stock' },
  { symbol: 'ARCT', name: 'Arctic Wool Mills', base: 79, vol: 0.06, kind: 'stock' },
  { symbol: 'HONE', name: 'Honeybrook Apiaries', base: 112, vol: 0.08, kind: 'stock' },
  { symbol: 'BLDR', name: 'Boulder Quarry Works', base: 92, vol: 0.1, kind: 'stock' },
  { symbol: 'SILT', name: 'Silt & Sons Dredging', base: 39, vol: 0.12, kind: 'stock' },
  { symbol: 'WIND', name: 'Windmill Power', base: 104, vol: 0.06, kind: 'stock' },
  { symbol: 'OTTR', name: 'Otter Ferry Lines', base: 68, vol: 0.09, kind: 'stock' },
  { symbol: 'LANT', name: 'Lantern Oil Co.', base: 47, vol: 0.1, kind: 'stock' },
  { symbol: 'GLAC', name: 'Glacier Cold Storage', base: 126, vol: 0.05, kind: 'stock' },
  { symbol: 'MEAD', name: 'Meadow Mutual', base: 188, vol: 0.04, kind: 'stock' },
  { symbol: 'NECT', name: 'Nectar Bottling', base: 61, vol: 0.09, kind: 'stock' },
  { symbol: 'TUFT', name: 'Tuft Textiles', base: 84, vol: 0.07, kind: 'stock' },
  { symbol: 'QUIL', name: 'Quill & Ink Stationers', base: 73, vol: 0.08, kind: 'stock' },
  { symbol: 'HONKC', name: 'Honkcoin', base: 9, vol: 0.22, kind: 'crypto' },
  { symbol: 'BEAK', name: 'Beak Token', base: 4, vol: 0.28, kind: 'crypto' },
  { symbol: 'EGG', name: 'Golden Egg', base: 26, vol: 0.2, kind: 'crypto' },
  { symbol: 'WING', name: 'Wingcoin', base: 14, vol: 0.25, kind: 'crypto' },
  { symbol: 'NSTC', name: 'Nestcoin', base: 6, vol: 0.3, kind: 'crypto' },
  { symbol: 'MGLT', name: 'Moonlight', base: 38, vol: 0.24, kind: 'crypto' },
  { symbol: 'FEKR', name: 'Feather Token', base: 12, vol: 0.26, kind: 'crypto' },
  { symbol: 'HONKX', name: 'HonkX', base: 3, vol: 0.32, kind: 'crypto' },
  { symbol: 'QACK', name: 'Quackchain', base: 21, vol: 0.3, kind: 'crypto' },
  { symbol: 'WDL', name: 'Waddle', base: 7, vol: 0.27, kind: 'crypto' },
  { symbol: 'SHDW', name: 'Shadowcoin', base: 44, vol: 0.35, kind: 'crypto' },
  { symbol: 'PFIN', name: 'Plume Finance', base: 18, vol: 0.29, kind: 'crypto' },
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
        kind: stock.kind,
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