// Fishing tackle: which slot a tool fills, and what it does to the cast.
// Anything the chandlery sells as a tool with the right word in its name works here,
// so new rods, baits, lures and nets can be added to the shop without touching this file.

const SLOT_RULES = [
  { id: 'rod', label: 'Rod', emoji: '🎣', test: /rod/i },
  { id: 'net', label: 'Net', emoji: '🥅', test: /net|gaff/i },
  { id: 'bait', label: 'Bait', emoji: '🪱', test: /bait|worm|dough|shrimp|maggot|grub/i },
  { id: 'lure', label: 'Lure', emoji: '✨', test: /lure|spoon|spinner|jig|\bfly\b/i },
];

export const TACKLE_SLOTS = SLOT_RULES.map(({ id, label, emoji }) => ({ id, label, emoji }));

export const tackleSlot = (item) => {
  if (!item || item.category !== 'tool') return null;
  const rule = SLOT_RULES.find((entry) => entry.test.test(item.name || ''));
  return rule ? rule.id : null;
};

const tierOf = (item) => {
  if (!item) return 0;
  return Math.max(0, Math.min(1, (item.price ?? 0) / 2600));
};

// A profile of how the equipped tackle changes the cast and the fight.
export function gearProfile(equipped = []) {
  const find = (slot) => equipped.find((item) => tackleSlot(item) === slot) || null;
  const rod = find('rod');
  const bait = find('bait');
  const lure = find('lure');
  const net = find('net');

  const rodTier = tierOf(rod);
  const baitTier = tierOf(bait);
  const lureTier = tierOf(lure);
  const netTier = tierOf(net);

  return {
    rod,
    bait,
    lure,
    net,
    // How fast the power bar sweeps — a better rod is steadier and easier to place.
    castSpeed: 92 - rodTier * 38,
    // How long the fish holds the hook once it bites.
    hookWindow: 900 + baitTier * 900 + netTier * 250,
    // Seconds of quiet water before something bites.
    biteDelay: 2.4 - baitTier * 1.3 - lureTier * 0.3,
    // Bread per landing, before the depth bonus.
    landing: 2 + Math.round(lureTier * 2) + (net ? 1 : 0),
    // Reel speed and how hard the fish can pull against the line.
    reel: 20 + rodTier * 18,
    give: 30 + rodTier * 16,
    luck: 0.15 + lureTier * 0.55 + baitTier * 0.2,
    label: rod ? rod.name : '',
  };
}

// What lives out in the lake: deeper casts reach bigger fish.
export const FISH_KINDS = [
  { id: 'minnow', name: 'Pond minnow', emoji: '🐟', depth: 'shallow', value: 1, fight: 0.7 },
  { id: 'roach', name: 'Reed roach', emoji: '🐠', depth: 'shallow', value: 1, fight: 0.9 },
  { id: 'perch', name: 'Yellow perch', emoji: '🐡', depth: 'mid', value: 2, fight: 1.1 },
  { id: 'trout', name: 'Lake trout', emoji: '🐟', depth: 'mid', value: 2, fight: 1.35 },
  { id: 'pike', name: 'Grey pike', emoji: '🐊', depth: 'deep', value: 3, fight: 1.7 },
  { id: 'marlin', name: 'Honk marlin', emoji: '🐬', depth: 'deep', value: 3, fight: 1.95 },
];

export const depthFromCast = (power) => (power < 36 ? 'shallow' : power < 72 ? 'mid' : 'deep');

export const fishFor = (depth, luck) => {
  const pool = FISH_KINDS.filter((fish) => fish.depth === depth);
  const bold = Math.random() < luck;
  return bold ? pool[pool.length - 1] : pool[0];
};