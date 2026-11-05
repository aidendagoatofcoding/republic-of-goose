// Where each Champion Isle ground sits on the Commons map (percentages of the meadow).
export const VENUES = [
  { id: 'choir', name: 'Amphitheatre', glyph: '🎶', x: 27, y: 18 },
  { id: 'race', name: 'Reed Raceway', glyph: '🏁', x: 63, y: 15 },
  { id: 'guard', name: 'Nest Tower', glyph: '🪺', x: 79, y: 31 },
  { id: 'sprint', name: 'Honk Stadium', glyph: '🏟️', x: 58, y: 82 },
  { id: 'toss', name: 'Bread Field', glyph: '🥖', x: 90, y: 76 },
];

export const VENUE_BY_ID = Object.fromEntries(VENUES.map((venue) => [venue.id, venue]));