export const ISLE_EVENTS = [
  { id: 'sprint', name: 'Honk Sprint', unit: 'metres' },
  { id: 'toss', name: 'Bread Toss', unit: 'points' },
  { id: 'archery', name: 'Isle Archery', unit: 'points' },
  { id: 'race', name: 'Reed Race', unit: 'points' },
  { id: 'choir', name: 'Honk Choir', unit: 'levels' },
  { id: 'guard', name: 'Nest Guard', unit: 'caught' },
];

export const eventName = (id) =>
  ISLE_EVENTS.find((event) => event.id === id)?.name || 'Champion Isle';