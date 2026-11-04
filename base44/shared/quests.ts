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
  'shard-1',
  'shard-2',
  'shard-3',
  'shard-4',
  'shard-5',
  'shard-6',
  'shard-7',
  'shard-8',
  'shard-9',
  'artifact',
  'strongbox',
  'mothkey',
  'mossstone',
];

export const QUESTS = [
  { id: 'glade-artifact', finds: ['artifact'], reward: { bread: 220, xp: 70 } },
  { id: 'inn-key', finds: ['mothkey'], reward: { bread: 150, xp: 50 } },
  { id: 'shrine-stone', finds: ['mossstone'], reward: { bread: 160, xp: 55 } },
  { id: 'den-strongbox', finds: ['strongbox'], reward: { bread: 200, xp: 65 } },
  { id: 'bank-heist', finds: [], reward: { bread: 260, xp: 90 } },
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