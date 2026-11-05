// The beasts of the Republic, kept by the backend so a payout can only be made against a real one.
export const BOSSES = [
  { id: 'ice-duck', reward: { bread: 420, xp: 160 } },
  { id: 'sand-wyrm', reward: { bread: 520, xp: 190 } },
  { id: 'moss-troll', reward: { bread: 380, xp: 140 } },
  { id: 'dragon', reward: { bread: 700, xp: 260 } },
];

export const bossById = (id: string) => BOSSES.find((boss) => boss.id === id) || null;