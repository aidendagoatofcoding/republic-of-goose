// The lost things scattered out in the Republic, and the side quests that want them back.
// Anything with `hidden: true` is buried under a rock or a tree and must be searched for.
// The Sift shards are buried the same way: search the boulders and the hollow trees for them.

export const FINDS = [
  { id: 'lantern', name: "The witch's lantern", emoji: '🏮', x: 63, y: 29 },
  { id: 'pinecone-a', name: 'A pine cone', emoji: '🌰', x: 17, y: 43 },
  { id: 'pinecone-b', name: 'A pine cone', emoji: '🌰', x: 79, y: 21 },
  { id: 'pinecone-c', name: 'A pine cone', emoji: '🌰', x: 91, y: 60 },
  { id: 'letter', name: 'An undelivered letter', emoji: '✉️', x: 45, y: 73 },
  { id: 'ledger', name: 'The harbour ledger', emoji: '📘', x: 11, y: 67 },
  { id: 'lamp-oil', name: 'A can of lamp oil', emoji: '🛢️', x: 71, y: 79 },
  { id: 'seal', name: 'The registry seal', emoji: '🔏', x: 28, y: 19 },
  { id: 'mothkey', name: 'The brass key', emoji: '🗝️', x: 44, y: 40 },
  { id: 'shard-1', name: 'Sift shard', hidden: true, emoji: '🔷', x: 25, y: 56 },
  { id: 'shard-2', name: 'Sift shard', hidden: true, emoji: '🔶', x: 37, y: 36 },
  { id: 'shard-3', name: 'Sift shard', hidden: true, emoji: '🔷', x: 55, y: 28 },
  { id: 'shard-4', name: 'Sift shard', hidden: true, emoji: '🔶', x: 69, y: 44 },
  { id: 'shard-5', name: 'Sift shard', hidden: true, emoji: '🔷', x: 81, y: 66 },
  { id: 'shard-6', name: 'Sift shard', hidden: true, emoji: '🔶', x: 61, y: 61 },
  { id: 'shard-7', name: 'Sift shard', hidden: true, emoji: '🔷', x: 33, y: 74 },
  { id: 'shard-8', name: 'Sift shard', hidden: true, emoji: '🔶', x: 17, y: 84 },
  { id: 'shard-9', name: 'Sift shard', hidden: true, emoji: '🔷', x: 89, y: 84 },
  { id: 'artifact', name: 'The Glade Artifact', hidden: true, x: 40, y: 88 },
  { id: 'strongbox', name: 'A bank strongbox', hidden: true, x: 68, y: 90 },
  { id: 'mossstone', name: 'The moss stone', hidden: true, x: 12, y: 62 },
];

export const QUESTS = [
  // The capital, the ministries and the counting houses.
  {
    id: 'capital-mace',
    place: 'capital',
    giver: 'The Sergeant-at-Wings',
    title: 'The Missing Mace',
    brief:
      'The chamber cannot open without its mace. Somebody carried it out to the meadow and set it down to eat a bun.',
    finds: ['seal'],
    reward: { bread: 180, xp: 60 },
  },
  {
    id: 'bank-counterfeit',
    place: 'bank',
    giver: 'The Banker',
    title: 'The Counterfeit Crumb',
    brief:
      'A bad loaf has been passed off as national bread. The Bank wants the ledger that names the baker.',
    finds: ['ledger'],
    reward: { bread: 190, xp: 60 },
  },
  {
    id: 'parliament-act',
    place: 'parliament',
    giver: 'The Speaker',
    title: 'The Unsigned Act',
    brief:
      'An act is law the moment the seal touches it. The seal has gone wandering, and the House is shouting about it.',
    finds: ['letter', 'seal'],
    reward: { bread: 210, xp: 70 },
  },
  {
    id: 'government-survey',
    place: 'government',
    giver: 'The Clerk of Maps',
    title: 'The District Survey',
    brief:
      'Government House is re-drawing the districts and the survey markers have blown away. Bring the oil and a cone.',
    finds: ['lamp-oil', 'pinecone-a'],
    reward: { bread: 170, xp: 55 },
  },
  {
    id: 'exchange-futures',
    place: 'exchange',
    giver: 'The Broker',
    title: 'Bread Futures',
    brief:
      'The floor is short of two things: the ledger, and something to burn in the lamps while they argue.',
    finds: ['ledger', 'lamp-oil'],
    reward: { bread: 200, xp: 65 },
  },
  {
    id: 'guild-sample',
    place: 'guild',
    giver: 'The Guildmaster',
    title: "The Shopkeeper's Sample",
    brief:
      'A lantern was sent out as a sample and never came back. The Guild would like it on the shelf again.',
    finds: ['lantern'],
    reward: { bread: 150, xp: 50 },
  },
  {
    id: 'shop-stocktake',
    place: 'shop',
    giver: 'The Stockkeeper',
    title: 'Stocktake',
    brief:
      'Two pine cones went out the back door in a goose’s beak. The till does not pay for stock it cannot count.',
    finds: ['pinecone-b', 'pinecone-c'],
    reward: { bread: 160, xp: 50 },
  },
  {
    id: 'granary-foreman',
    place: 'granary',
    giver: 'The Foreman',
    title: 'The Sacks That Walked',
    brief:
      'The granary has lost a sack of seed to the wind. It landed somewhere out past the market road.',
    finds: ['pinecone-a'],
    reward: { bread: 140, xp: 45 },
  },
  {
    id: 'herald-story',
    place: 'herald',
    giver: 'The Editor',
    title: 'A Story That Ran Away',
    brief:
      'A courier dropped the Herald’s best letter over the avenue and the printer is holding the front page.',
    finds: ['letter'],
    reward: { bread: 150, xp: 50 },
  },
  {
    id: 'bakery-starter',
    place: 'bakery',
    giver: 'The Head Baker',
    title: 'The Lost Starter',
    brief:
      'The oven needs oil, and the starter needs feeding. Fetch the can and the ovens keep singing.',
    finds: ['lamp-oil'],
    reward: { bread: 165, xp: 55 },
  },
  {
    id: 'library-atlas',
    place: 'library',
    giver: 'The Librarian',
    title: 'An Overdue Atlas',
    brief:
      'An atlas has been out since the flood and the shelves have a gap shaped like it. The ledger knows who took it.',
    finds: ['ledger'],
    reward: { bread: 155, xp: 50 },
  },
  {
    id: 'dealership-wheel',
    place: 'dealership',
    giver: 'The Salesbird',
    title: 'The Missing Wheel',
    brief:
      'Honk Motors sold a carriage with four wheels and delivered three. The fourth is still out on the meadow.',
    finds: ['strongbox'],
    reward: { bread: 175, xp: 55 },
  },
  {
    id: 'warzone-blade',
    place: 'warzone',
    giver: 'The Captain',
    title: 'Blade in the Mud',
    brief:
      'A lantern went over the ridge with the last patrol. The Captain wants it lit again before dusk.',
    finds: ['lantern'],
    reward: { bread: 210, xp: 75 },
  },
  {
    id: 'witch-jar',
    place: 'witch',
    giver: 'The Witch',
    title: 'A Jar of Fireflies',
    brief:
      'The witch needs a lantern to hold a summer’s worth of fireflies. Bring one and she will not turn you into anything.',
    finds: ['lantern'],
    reward: { bread: 190, xp: 60 },
  },
  {
    id: 'chandlery-rope',
    place: 'chandlery',
    giver: 'The Chandler',
    title: 'The Rope Order',
    brief:
      'A boat went out without its oil and came back without its order. The Chandler is out of both now.',
    finds: ['lamp-oil'],
    reward: { bread: 145, xp: 45 },
  },
  {
    id: 'mineshaft-seam',
    place: 'mineshaft',
    giver: 'The Pit Boss',
    title: 'A Rich Seam',
    brief:
      'The Pit Boss swears a mossy stone marks a seam richer than the deep gallery. Bring the stone and prove it.',
    finds: ['mossstone'],
    reward: { bread: 200, xp: 65 },
  },
  {
    id: 'assay-crumb',
    place: 'assay',
    giver: 'The Assayer',
    title: 'The False Crumb',
    brief:
      'A strongbox of suspect crumbs is missing. The Assayer needs it weighed before anyone else bites it.',
    finds: ['strongbox'],
    reward: { bread: 205, xp: 70 },
  },

  // The Sift.
  {
    id: 'sift-garden-shards',
    place: 'sift-garden',
    giver: 'The Gardener',
    title: 'Shards in the Bloom',
    brief: 'Three shards fell out of the glass garden and landed out in the Republic. Bring them back to the blooms.',
    finds: ['shard-1', 'shard-2', 'shard-3'],
    reward: { bread: 240, xp: 80 },
  },
  {
    id: 'sift-archive-shards',
    place: 'sift-archive',
    giver: 'The Archivist',
    title: 'The Recorded Honk',
    brief: 'The archive files every honk on a shard. Three are loose in the meadow and the catalogue is furious.',
    finds: ['shard-4', 'shard-5', 'shard-6'],
    reward: { bread: 240, xp: 80 },
  },
  {
    id: 'sift-court-shards',
    place: 'sift-court',
    giver: 'The Hummer',
    title: 'The Quiet Argument',
    brief: 'A court cannot hum without its shards. Three are lying out in the open, which the Hummer finds untidy.',
    finds: ['shard-7', 'shard-8', 'shard-9'],
    reward: { bread: 260, xp: 85 },
  },

  // The forest and the harbour.
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