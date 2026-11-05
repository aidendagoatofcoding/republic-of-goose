// The beasts of the Republic, kept by the backend so a payout can only be made against a real one.
// Each beast drops its own trophy and one extra thing from what it was carrying.
export type BossLoot = {
  id: string;
  name: string;
  emoji: string;
  note: string;
  bonus?: { bread?: number; ore?: number; xp?: number };
};

export const BOSSES: {
  id: string;
  reward: { bread: number; xp: number };
  loot: BossLoot[];
}[] = [
  {
    id: 'ice-duck',
    reward: { bread: 420, xp: 160 },
    loot: [
      {
        id: 'ice-duck-feather',
        name: 'Frostbill Feather',
        emoji: '❄️',
        note: 'A wing feather that never thaws. It will keep a drink cold all summer.',
      },
      {
        id: 'ice-duck-egg',
        name: 'Frozen Egg',
        emoji: '🥚',
        note: 'Still faintly warm inside, which nobody can explain.',
        bonus: { bread: 120 },
      },
      {
        id: 'ice-duck-ice',
        name: 'Haul of Lake Ice',
        emoji: '🧊',
        note: 'Cut from the lake the day it froze over. The bank buys it by the block.',
        bonus: { ore: 6, bread: 40 },
      },
    ],
  },
  {
    id: 'sand-wyrm',
    reward: { bread: 520, xp: 190 },
    loot: [
      {
        id: 'sand-wyrm-scale',
        name: 'Wyrm Scale',
        emoji: '🟡',
        note: 'A plate of it, still warm from the sand. It does not cool down.',
      },
      {
        id: 'sand-wyrm-molar',
        name: 'Dune Molar',
        emoji: '🦷',
        note: 'A grinding tooth the size of a bread tin. The smith pays well for these.',
        bonus: { bread: 180 },
      },
      {
        id: 'sand-wyrm-silk',
        name: 'Spool of Sand Silk',
        emoji: '🧵',
        note: 'Spun out under the dunes. Stronger than the harbour rope.',
        bonus: { ore: 8, bread: 30 },
      },
    ],
  },
  {
    id: 'moss-troll',
    reward: { bread: 380, xp: 140 },
    loot: [
      {
        id: 'moss-troll-heart',
        name: 'Mossheart',
        emoji: '💚',
        note: 'It beats once a season, and the pine grove leans towards it.',
      },
      {
        id: 'moss-troll-root',
        name: 'Old Growth Root',
        emoji: '🪵',
        note: 'Older than the Republic. It will make a table that outlives the house.',
        bonus: { bread: 150 },
      },
      {
        id: 'moss-troll-amber',
        name: 'Pine Amber',
        emoji: '🟠',
        note: 'A fist of it, with a beetle asleep in the middle since before the oath.',
        bonus: { ore: 5, bread: 60 },
      },
    ],
  },
  {
    id: 'dragon',
    reward: { bread: 700, xp: 260 },
    loot: [
      {
        id: 'dragon-horn',
        name: 'Sift Dragon Horn',
        emoji: '🐉',
        note: 'It still hums, quietly, in a room that has gone otherwise silent.',
      },
      {
        id: 'dragon-hum',
        name: 'Bottle of Sift Hum',
        emoji: '🫧',
        note: 'Pink and turquoise, sealed tight. Worth a small fortune in the Old Town.',
        bonus: { bread: 300 },
      },
      {
        id: 'dragon-crystal',
        name: 'Humming Crystal',
        emoji: '💎',
        note: 'Cut from the folded sky itself. It sings when the bread ore is near.',
        bonus: { ore: 14, bread: 80 },
      },
    ],
  },
];

export const bossById = (id: string) => BOSSES.find((boss) => boss.id === id) || null;

export const lootFor = (id: string): BossLoot[] => bossById(id)?.loot ?? [];