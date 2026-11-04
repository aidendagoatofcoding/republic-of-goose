// Shared sword ladder and experience curve, used by the citizen function.

export const SWORDS = [
  { name: 'Rusty Honkblade', cost: 0, power: 1 },
  { name: 'Bronze Beakblade', cost: 140, power: 1.25 },
  { name: 'Silver Sabre', cost: 380, power: 1.5 },
  { name: 'Gilded Greatsword', cost: 850, power: 1.8 },
  { name: 'Honkbringer, the Dawn Blade', cost: 1800, power: 2.2 },
];

export const XP_PER_LEVEL = 120;
export const MAX_ARENA_KILLS = 400;
export const MAX_ARENA_DUELS = 200;

export function swordTier(value) {
  const number = Math.floor(Number(value) || 0);
  return Math.min(SWORDS.length - 1, Math.max(0, number));
}

export function swordFor(value) {
  return SWORDS[swordTier(value)];
}

export function nextSwordFor(value) {
  return SWORDS[swordTier(value) + 1] || null;
}

export function levelFromXp(xp) {
  return Math.floor(Math.max(0, Math.floor(Number(xp) || 0)) / XP_PER_LEVEL) + 1;
}

export function xpOf(citizen) {
  return Math.max(0, Math.floor(citizen?.xp ?? 0));
}