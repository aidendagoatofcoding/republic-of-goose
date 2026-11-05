// Every trade keeps its own shop, so a citizen knows which door to knock on.
export const SHOPS = [
  {
    id: 'decorations',
    key: 'decoration',
    name: 'The Decorations Emporium',
    sign: 'DECORATIONS',
    emoji: '🎀',
    blurb: 'Ribbons, hats and small shiny things, worn on your animal in the Hall of Honks.',
  },
  {
    id: 'homes',
    key: 'home',
    name: 'The Homes Office',
    sign: 'HOMES',
    emoji: '🏠',
    blurb: 'A roof of your own out in the Honk Commons, deeds signed at the counter.',
  },
  {
    id: 'furniture',
    key: 'furniture',
    name: 'The Cabinetmaker',
    sign: 'FURNITURE',
    emoji: '🛏️',
    blurb: 'Beds, chairs and shelves for a home you already own.',
  },
  {
    id: 'dealership',
    key: 'vehicle',
    name: 'The Dealership',
    sign: 'VEHICLES',
    emoji: '🚗',
    blurb: 'Motorcars and boats parked out on the lot, keys in the door.',
  },
  {
    id: 'menagerie',
    key: 'pet',
    name: 'The Menagerie',
    sign: 'PETS',
    emoji: '🦫',
    blurb: 'Small companions that wander your plot and answer to nobody.',
  },
  {
    id: 'chandlery',
    key: 'tool',
    name: 'The Chandlery',
    sign: 'TOOLS',
    emoji: '🎣',
    blurb: 'Rods, tackle and picks for the harbour dock and the bread mines.',
  },
];

export const shopById = (id) => SHOPS.find((shop) => shop.id === id) || null;
export const shopForCategory = (key) => SHOPS.find((shop) => shop.key === key) || null;