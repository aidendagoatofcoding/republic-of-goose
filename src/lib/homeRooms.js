// A home's size on the outside decides how much room there is on the inside.
export const HOME_ROOMS = {
  cottage: {
    id: 'home',
    name: 'Your Home',
    sign: 'YOUR HOME · COTTAGE',
    honkish: 'HONK HONK',
    accent: '#e0b98a',
    wood: true,
    props: [
      { type: 'chandelier', x: 50, y: 14 },
      { type: 'shelf', x: 14, y: 44 },
      { type: 'shelf', x: 86, y: 44 },
      { type: 'benches', x: 30, y: 60 },
      { type: 'counter', x: 66, y: 56, label: 'YOUR HEARTH' },
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
      { type: 'chandelier', x: 32, y: 13 },
      { type: 'chandelier', x: 68, y: 13 },
      { type: 'shelf', x: 10, y: 42 },
      { type: 'shelf', x: 90, y: 42 },
      { type: 'banner', x: 24, y: 26 },
      { type: 'banner', x: 76, y: 26 },
      { type: 'benches', x: 22, y: 62 },
      { type: 'benches', x: 78, y: 62 },
      { type: 'counter', x: 50, y: 54, label: 'YOUR HEARTH' },
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
      { type: 'chandelier', x: 26, y: 12 },
      { type: 'chandelier', x: 50, y: 10 },
      { type: 'chandelier', x: 74, y: 12 },
      { type: 'shelf', x: 8, y: 40 },
      { type: 'shelf', x: 50, y: 36 },
      { type: 'shelf', x: 92, y: 40 },
      { type: 'banner', x: 18, y: 26 },
      { type: 'banner', x: 82, y: 26 },
      { type: 'map', x: 66, y: 30 },
      { type: 'benches', x: 18, y: 64 },
      { type: 'benches', x: 82, y: 64 },
      { type: 'counter', x: 50, y: 58, label: 'YOUR GREAT HEARTH' },
      { type: 'coins', x: 12, y: 86 },
    ],
    actors: [],
  },
};

export const tierFor = (price) => (price >= 900 ? 'manor' : price >= 400 ? 'hall' : 'cottage');

export const FURNITURE_SIZE = { cottage: 'text-3xl', hall: 'text-4xl', manor: 'text-5xl' };