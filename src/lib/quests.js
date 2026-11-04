// The lost things scattered out in the Republic, and the side quests that want them back.
// Anything with `hidden: true` is buried under a rock or a tree and must be searched for.

export const FINDS = [
  { id: 'lantern', name: "The witch's lantern", emoji: '🏮', x: 63, y: 29 },
  { id: 'pinecone-a', name: 'A pine cone', emoji: '🌰', x: 17, y: 43 },
  { id: 'pinecone-b', name: 'A pine cone', emoji: '🌰', x: 79, y: 21 },
  { id: 'pinecone-c', name: 'A pine cone', emoji: '🌰', x: 91, y: 60 },
  { id: 'letter', name: 'An undelivered letter', emoji: '✉️', x: 45, y: 73 },
  { id: 'ledger', name: 'The harbour ledger', emoji: '📘', x: 11, y: 67 },
  { id: 'lamp-oil', name: 'A can of lamp oil', emoji: '🛢️', x: 71, y: 79 },
  { id: 'seal', name: 'The registry seal', emoji: '🔏', x: 28, y: 19 },
  { id: 'shard-1', name: 'A sift shard', hidden: true, x: 16, y: 34 },
  { id: 'shard-2', name: 'A sift shard', hidden: true, x: 30, y: 24 },
  { id: 'shard-3', name: 'A sift shard', hidden: true, x: 47, y: 41 },
  { id: 'shard-4', name: 'A sift shard', hidden: true, x: 61, y: 22 },
  { id: 'shard-5', name: 'A sift shard', hidden: true, x: 76, y: 47 },
  { id: 'shard-6', name: 'A sift shard', hidden: true, x: 88, y: 30 },
  { id: 'shard-7', name: 'A sift shard', hidden: true, x: 24, y: 78 },
  { id: 'shard-8', name: 'A sift shard', hidden: true, x: 55, y: 84 },
  { id: 'shard-9', name: 'A sift shard', hidden: true, x: 82, y: 74 },
  { id: 'artifact', name: 'The Glade Artifact', hidden: true, x: 40, y: 88 },
  { id: 'strongbox', name: 'A bank strongbox', hidden: true, x: 68, y: 90 },
  { id: 'mothkey', name: 'The brass key', hidden: true, x: 92, y: 52 },
  { id: 'mossstone', name: 'The moss stone', hidden: true, x: 12, y: 62 },
];

export const QUESTS = [
  {
    id: 'glade-artifact',
    place: 'forest',
    giver: 'The Quiet Glade',
    title: 'The Glade Artifact',
    brief:
      'Something very old is buried out under the trees of the Commons. The glade wants it back, and it is patient about it.',
    finds: ['artifact'],
    reward: { bread: 220, xp: 70 },
  },
  {
    id: 'glade-seeds',
    place: 'forest',
    giver: 'The Forester',
    title: 'Seed Run',
    brief:
      'Three pine cones blew clean out of the grove. Find them in the Commons before the squirrels do.',
    finds: ['pinecone-a', 'pinecone-b', 'pinecone-c'],
    reward: { bread: 90, xp: 30 },
  },
  {
    id: 'owl-letter',
    place: 'owl-tower',
    giver: 'The Watchkeeper',
    title: 'The Undelivered Letter',
    brief: 'A letter fell from a courier over the avenue. The watch would like it back.',
    finds: ['letter'],
    reward: { bread: 110, xp: 35 },
  },
  {
    id: 'inn-key',
    place: 'inn',
    giver: 'The Landlord',
    title: 'The Brass Key',
    brief:
      'The key to the cellar went out with the last guest and never came back. Search the trunks along the avenue.',
    finds: ['mothkey'],
    reward: { bread: 150, xp: 50 },
  },
  {
    id: 'shrine-stone',
    place: 'shrine',
    giver: 'The Keeper',
    title: 'The Moss Stone',
    brief: 'A stone of the old shrine was rolled off into the meadow. The moss has not forgiven it.',
    finds: ['mossstone'],
    reward: { bread: 160, xp: 55 },
  },
  {
    id: 'den-strongbox',
    place: 'den',
    giver: 'The Denkeeper',
    title: 'The Strongbox',
    brief:
      'A strongbox slipped out of a wagon on the south road. Bring it to the Den and no questions are asked.',
    finds: ['strongbox'],
    reward: { bread: 200, xp: 65 },
  },
  {
    id: 'harbour-ledger',
    place: 'fishmarket',
    giver: 'The Fishmonger',
    title: 'The Harbour Ledger',
    brief: 'The ledger went out on the tide and washed up on the meadow. Bring it home.',
    finds: ['ledger'],
    reward: { bread: 130, xp: 45 },
  },
  {
    id: 'lighthouse-oil',
    place: 'lighthouse',
    giver: 'The Lamp Keeper',
    title: 'Lamp Oil',
    brief: 'A can of oil was left out in the Commons. Without it the light goes dark tonight.',
    finds: ['lamp-oil'],
    reward: { bread: 140, xp: 45 },
  },
  {
    id: 'registry-seal',
    place: 'registry',
    giver: 'The Registrar',
    title: 'The Missing Seal',
    brief: 'The national seal has gone missing. Half the Republic is unsigned until it is found.',
    finds: ['seal'],
    reward: { bread: 150, xp: 50 },
  },
  {
    id: 'lake-catch',
    place: 'fishmarket',
    giver: 'The Old Fisher',
    title: 'Three from the Lake',
    brief: 'Land three fish off the harbour dock. A rod is sold at the chandlery, if you have none.',
    fish: 3,
    reward: { bread: 160, xp: 50 },
  },
  {
    id: 'bank-heist',
    place: 'heist',
    giver: 'The Guild of Quiet Hands',
    title: 'The Honk Heist',
    brief:
      'Three tumblers guard the national vault. Left, right, left — get it right and the Bank never notices.',
    reward: { bread: 260, xp: 90 },
  },
];

export const QUESTS_FOR_PLACE = (place) => QUESTS.filter((quest) => quest.place === place);
export const findById = (id) => FINDS.find((entry) => entry.id === id) || null;
export const heistQuest = () => QUESTS.find((quest) => quest.id === 'bank-heist');