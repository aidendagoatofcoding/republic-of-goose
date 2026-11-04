// The same list the citizen function checks against, kept in one place for the backend.
export const FINDS = [
  'lantern',
  'pinecone-a',
  'pinecone-b',
  'pinecone-c',
  'letter',
  'ledger',
  'lamp-oil',
  'seal',
];

export const QUESTS = [
  { id: 'witch-lantern', finds: ['lantern'], reward: { bread: 120, xp: 40 } },
  {
    id: 'glade-seeds',
    finds: ['pinecone-a', 'pinecone-b', 'pinecone-c'],
    reward: { bread: 90, xp: 30 },
  },
  { id: 'owl-letter', finds: ['letter'], reward: { bread: 110, xp: 35 } },
  { id: 'harbour-ledger', finds: ['ledger'], reward: { bread: 130, xp: 45 } },
  { id: 'lighthouse-oil', finds: ['lamp-oil'], reward: { bread: 140, xp: 45 } },
  { id: 'registry-seal', finds: ['seal'], reward: { bread: 150, xp: 50 } },
  { id: 'lake-catch', fish: 3, reward: { bread: 160, xp: 50 } },
];

export const questById = (id) => QUESTS.find((quest) => quest.id === id) || null;
export const isFind = (id) => FINDS.includes(id);