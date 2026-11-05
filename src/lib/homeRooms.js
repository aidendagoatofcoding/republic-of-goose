// A home's size on the outside decides how much room there is on the inside.
export const HOME_ROOMS = {
  cottage: {
    id: 'home',
    name: 'Your Home',
    sign: 'YOUR HOME · COTTAGE',
    honkish: 'HONK HONK',
    accent: '#e0b98a',
    wood: true,
    // Nothing hangs or stands in the middle of the wall: the garden window has that space.
    props: [
      { type: 'chandelier', x: 22, y: 14 },
      { type: 'shelf', x: 11, y: 46 },
      { type: 'shelf', x: 89, y: 46 },
      { type: 'benches', x: 26, y: 62 },
      { type: 'counter', x: 68, y: 58, label: 'YOUR HEARTH' },
    ],
    actors: [],
  },
  hall: {
    id: 'home',
    name: 'Your Home',
    sign: 'YOUR HOME · HALL',
    honkish: 'HONK HONK HONK',
    accent: '#e0b98a',
    wood: true,
    props: [
      { type: 'chandelier', x: 18, y: 13 },
      { type: 'chandelier', x: 82, y: 13 },
      { type: 'shelf', x: 9, y: 44 },
      { type: 'shelf', x: 91, y: 44 },
      { type: 'banner', x: 23, y: 27 },
      { type: 'banner', x: 77, y: 27 },
      { type: 'benches', x: 20, y: 64 },
      { type: 'benches', x: 80, y: 64 },
      { type: 'counter', x: 50, y: 56, label: 'YOUR HEARTH' },
    ],
    actors: [],
  },
  manor: {
    id: 'home',
    name: 'Your Home',
    sign: 'YOUR HOME · MANOR',
    honkish: 'HONK HOOONKK HONK',
    accent: '#f2c96b',
    wood: true,
    props: [
      { type: 'chandelier', x: 19, y: 12 },
      { type: 'chandelier', x: 81, y: 12 },
      { type: 'shelf', x: 8, y: 42 },
      { type: 'shelf', x: 92, y: 42 },
      { type: 'banner', x: 24, y: 26 },
      { type: 'banner', x: 76, y: 26 },
      { type: 'map', x: 85, y: 33 },
      { type: 'benches', x: 16, y: 66 },
      { type: 'benches', x: 84, y: 66 },
      { type: 'counter', x: 50, y: 60, label: 'YOUR GREAT HEARTH' },
      { type: 'coins', x: 12, y: 86 },
    ],
    actors: [],
  },
};

export const tierFor = (price) => (price >= 900 ? 'manor' : price >= 400 ? 'hall' : 'cottage');

export const FURNITURE_SIZE = { cottage: 'text-3xl', hall: 'text-4xl', manor: 'text-5xl' };