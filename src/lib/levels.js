// The citizen experience curve. Every 120 xp is another level.
export const levelFromXp = (xp = 0) => Math.max(1, Math.floor(Number(xp || 0) / 120) + 1);