// The national sword ladder and the citizen experience curve.
export const SWORDS = [
  {
    name: 'Rusty Honkblade',
    cost: 0,
    power: 1,
    emoji: '🗡️',
    tint: '#9aa89a',
    blurb: 'Chipped, wobbling, but it is yours.',
  },
  {
    name: 'Bronze Beakblade',
    cost: 140,
    power: 1.25,
    emoji: '🗡️',
    tint: '#c89a5a',
    blurb: 'Forged in the Honkton smithy from bell bronze.',
  },
  {
    name: 'Silver Sabre',
    cost: 380,
    power: 1.5,
    emoji: '⚔️',
    tint: '#cfd8dd',
    blurb: 'Fast, bright, and favoured by the harbour guard.',
  },
  {
    name: 'Gilded Greatsword',
    cost: 850,
    power: 1.8,
    emoji: '⚔️',
    tint: '#f2c96b',
    blurb: 'Ceremonial, enormous, and entirely functional.',
  },
  {
    name: 'Honkbringer, the Dawn Blade',
    cost: 1800,
    power: 2.2,
    emoji: '🔱',
    tint: '#c2ff85',
    blurb: 'The last blade of the Republic. It hums when the ducks come.',
  },
];

const clampTier = (tier) => {
  const number = Math.floor(Number(tier) || 0);
  return Math.min(SWORDS.length - 1, Math.max(0, number));
};

export const swordFor = (tier) => SWORDS[clampTier(tier)];
export const swordPower = (tier) => swordFor(tier).power;
export const nextSword = (tier) => SWORDS[clampTier(tier) + 1] || null;
export const isTopSword = (tier) => clampTier(tier) >= SWORDS.length - 1;

export const XP_PER_LEVEL = 120;

export function levelFromXp(xp) {
  return Math.floor(Math.max(0, Math.floor(Number(xp) || 0)) / XP_PER_LEVEL) + 1;
}

export function levelProgress(xp) {
  const total = Math.max(0, Math.floor(Number(xp) || 0));
  const level = levelFromXp(total);
  const into = total % XP_PER_LEVEL;
  return { level, into, need: XP_PER_LEVEL, percent: Math.round((into / XP_PER_LEVEL) * 100) };
}