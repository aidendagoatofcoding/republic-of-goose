// Things hidden out in the Republic: buried under boulders, tucked into hollow trunks.
// Nothing here is visible until a citizen walks up and searches the rock or the tree.

export const HIDDEN = [
  { id: 'shard-1', kind: 'rock', x: 16, y: 34, name: 'A sift shard', glow: '#ff9ad5' },
  { id: 'shard-2', kind: 'tree', x: 30, y: 24, name: 'A sift shard', glow: '#8ff2e0' },
  { id: 'shard-3', kind: 'rock', x: 47, y: 41, name: 'A sift shard', glow: '#ff9ad5' },
  { id: 'shard-4', kind: 'tree', x: 61, y: 22, name: 'A sift shard', glow: '#8ff2e0' },
  { id: 'shard-5', kind: 'rock', x: 76, y: 47, name: 'A sift shard', glow: '#ff9ad5' },
  { id: 'shard-6', kind: 'tree', x: 88, y: 30, name: 'A sift shard', glow: '#8ff2e0' },
  { id: 'shard-7', kind: 'rock', x: 24, y: 78, name: 'A sift shard', glow: '#ff9ad5' },
  { id: 'shard-8', kind: 'tree', x: 55, y: 84, name: 'A sift shard', glow: '#8ff2e0' },
  { id: 'shard-9', kind: 'rock', x: 82, y: 74, name: 'A sift shard', glow: '#ff9ad5' },
  { id: 'artifact', kind: 'tree', x: 40, y: 88, name: 'The Glade Artifact', glow: '#c2ff85' },
  { id: 'strongbox', kind: 'rock', x: 68, y: 90, name: 'A bank strongbox', glow: '#f2c96b' },
  { id: 'mothkey', kind: 'tree', x: 92, y: 52, name: 'The brass key', glow: '#f2c96b' },
  { id: 'mossstone', kind: 'rock', x: 12, y: 62, name: 'The moss stone', glow: '#c2ff85' },
];

export const SIFT_SHARDS = HIDDEN.filter((spot) => spot.id.startsWith('shard-')).map(
  (spot) => spot.id
);

export const SHARDS_NEEDED = SIFT_SHARDS.length;

export const hiddenById = (id) => HIDDEN.find((spot) => spot.id === id) || null;