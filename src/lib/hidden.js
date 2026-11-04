// Things hidden out in the Republic: buried under boulders, tucked into hollow trunks.
// Nothing here is visible until a citizen walks up and searches the rock or the tree.
// The Sift shards are not kept here — they lie out in the open, unlocked, for anyone to pick up.

export const HIDDEN = [
  { id: 'artifact', kind: 'tree', x: 40, y: 88, name: 'The Glade Artifact', glow: '#c2ff85' },
  { id: 'strongbox', kind: 'rock', x: 68, y: 90, name: 'A bank strongbox', glow: '#f2c96b' },
  { id: 'mossstone', kind: 'rock', x: 12, y: 62, name: 'The moss stone', glow: '#c2ff85' },
];

export const SIFT_SHARDS = [
  'shard-1',
  'shard-2',
  'shard-3',
  'shard-4',
  'shard-5',
  'shard-6',
  'shard-7',
  'shard-8',
  'shard-9',
];

export const SHARDS_NEEDED = SIFT_SHARDS.length;

export const hiddenById = (id) => HIDDEN.find((spot) => spot.id === id) || null;