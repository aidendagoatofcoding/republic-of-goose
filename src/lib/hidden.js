// Things hidden out in the Republic: buried under boulders, tucked into hollow trunks.
// Nothing here is visible until a citizen walks up and searches the rock or the tree.
// The Sift shards are kept in here too — nothing marks which boulder or trunk holds one.

export const HIDDEN = [
  { id: 'artifact', kind: 'tree', x: 40, y: 88, name: 'The Glade Artifact', glow: '#c2ff85' },
  { id: 'strongbox', kind: 'rock', x: 68, y: 90, name: 'A bank strongbox', glow: '#f2c96b' },
  { id: 'mossstone', kind: 'rock', x: 12, y: 62, name: 'The moss stone', glow: '#c2ff85' },
  { id: 'shard-1', kind: 'rock', x: 25, y: 56, name: 'Sift shard', glow: '#ff9ad5' },
  { id: 'shard-2', kind: 'tree', x: 37, y: 36, name: 'Sift shard', glow: '#ff9ad5' },
  { id: 'shard-3', kind: 'rock', x: 55, y: 28, name: 'Sift shard', glow: '#ff9ad5' },
  { id: 'shard-4', kind: 'tree', x: 69, y: 44, name: 'Sift shard', glow: '#ff9ad5' },
  { id: 'shard-5', kind: 'rock', x: 81, y: 66, name: 'Sift shard', glow: '#ff9ad5' },
  { id: 'shard-6', kind: 'tree', x: 61, y: 61, name: 'Sift shard', glow: '#ff9ad5' },
  { id: 'shard-7', kind: 'rock', x: 33, y: 74, name: 'Sift shard', glow: '#ff9ad5' },
  { id: 'shard-8', kind: 'tree', x: 17, y: 84, name: 'Sift shard', glow: '#ff9ad5' },
  { id: 'shard-9', kind: 'rock', x: 89, y: 84, name: 'Sift shard', glow: '#ff9ad5' },
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