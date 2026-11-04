// Sword fighting rules shared by the arena and its HUD. Coordinates are 0-100 on both axes.
export const ARENA = {
  maxHp: 100,
  speed: 40,
  dash: 118,
  dashMs: 180,
  parryMs: 480,
  duckHp: 34,
  duckDamage: 9,
  duckSpeed: 9,
  maxAlive: 7,
  spawnMs: 1500,
  strikeRange: 18,
};

export const ARENA_ATTACKS = {
  slash: { label: 'Slash', key: 'J', cost: 10, cooldown: 340, damage: 14, reach: 17, cone: 0.1 },
  stab: { label: 'Stab', key: 'K', cost: 18, cooldown: 640, damage: 26, reach: 23, cone: 0.6 },
  bow: { label: 'Loose arrow', key: 'H', cost: 14, cooldown: 720, damage: 19, reach: 62, cone: 0.82 },
};

export const BLOCK_COST = 0.3;

// Is the target inside the swing? y is squashed a little so the field reads in perspective.
export function withinReach(from, target, spec) {
  const dx = target.x - from.x;
  const dy = (target.y - from.y) * 0.62;
  const dist = Math.hypot(dx, dy);
  if (dist > spec.reach || dist < 0.001) return false;
  const ax = from.aimX ?? 0;
  const ay = from.aimY ?? -1;
  const len = Math.hypot(ax, ay) || 1;
  const dot = (dx / dist) * (ax / len) + (dy / dist) * (ay / len);
  return dot >= spec.cone;
}