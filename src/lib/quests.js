// The lost things scattered out in the Republic, and the side quests that want them back.
export const FINDS = [
  { id: 'lantern', name: "The witch's lantern", emoji: '🏮', x: 63, y: 29 },
  { id: 'pinecone-a', name: 'A pine cone', emoji: '🌰', x: 17, y: 43 },
  { id: 'pinecone-b', name: 'A pine cone', emoji: '🌰', x: 79, y: 21 },
  { id: 'pinecone-c', name: 'A pine cone', emoji: '🌰', x: 91, y: 60 },
  { id: 'letter', name: 'An undelivered letter', emoji: '✉️', x: 45, y: 73 },
  { id: 'ledger', name: 'The harbour ledger', emoji: '📘', x: 11, y: 67 },
  { id: 'lamp-oil', name: 'A can of lamp oil', emoji: '🛢️', x: 71, y: 79 },
  { id: 'seal', name: 'The registry seal', emoji: '🔏', x: 28, y: 19 },
];

export const QUESTS = [
  {
    id: 'witch-lantern',
    place: 'witch',
    giver: 'The Witch of the Pines',
    title: 'The Lost Lantern',
    brief:
      'My lantern rolled off down the avenue and I am not chasing it. Fetch it back and the bread is yours.',
    finds: ['lantern'],
    reward: { bread: 120, xp: 40 },
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
];

export const QUESTS_FOR_PLACE = (place) => QUESTS.filter((quest) => quest.place === place);
export const findById = (id) => FINDS.find((entry) => entry.id === id) || null;