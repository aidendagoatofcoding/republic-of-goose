import { AREAS } from '@/lib/commonsAreas';
import { VENUES } from '@/lib/isleVenues';

// Somewhere worth walking to, as the GPS lists them: the plazas of the realms and the
// Champion Isle grounds.
export const DESTINATIONS = [
  ...AREAS.map((area) => ({
    id: `plaza-${area.id}`,
    name: area.name,
    glyph: '🏛️',
    x: area.x,
    y: area.y,
    kind: 'plaza',
  })),
  ...VENUES.map((venue) => ({
    id: `ground-${venue.id}`,
    name: venue.name,
    glyph: venue.glyph,
    x: venue.x,
    y: venue.y,
    kind: 'ground',
  })),
];

export const destinationById = (id) => DESTINATIONS.find((entry) => entry.id === id) || null;