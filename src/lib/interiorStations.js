// Where you can stand and do business inside each interior. Content keys resolve in StationContent.
export const STATIONS = {
  capital: [
    { id: 'doors', name: 'The four doors', x: 50, y: 78, content: 'capital' },
  ],
  bank: [
    { id: 'loans', name: 'Loans desk', x: 32, y: 78, content: 'bank-loans' },
    { id: 'vault', name: 'The vault', x: 78, y: 76, content: 'bank-vault' },
  ],
  parliament: [
    { id: 'speaker', name: "Speaker's podium", x: 50, y: 76, content: 'parliament' },
  ],
  government: [
    { id: 'desk', name: 'Government desk', x: 26, y: 82, content: 'government' },
    { id: 'board', name: 'Job board', x: 68, y: 80, content: 'job-board' },
  ],
  exchange: [
    { id: 'floor', name: 'Trading floor', x: 28, y: 82, content: 'exchange' },
  ],
  guild: [
    { id: 'goods', name: 'Goods counter', x: 50, y: 84, content: 'guild' },
  ],
  shop: [
    { id: 'till', name: 'The till', x: 50, y: 80, content: 'shop-all' },
    { id: 'decorations', name: 'Decorations', x: 12, y: 84, content: 'shop-decoration' },
    { id: 'homes', name: 'Homes', x: 30, y: 86, content: 'shop-home' },
    { id: 'furniture', name: 'Furniture', x: 50, y: 82, content: 'shop-furniture' },
    { id: 'vehicles', name: 'Vehicles', x: 70, y: 86, content: 'shop-vehicle' },
    { id: 'pets', name: 'Pets', x: 88, y: 84, content: 'shop-pet' },
  ],
  granary: [
    { id: 'office', name: 'Labour office', x: 62, y: 84, content: 'granary' },
  ],
  herald: [
    { id: 'editor', name: 'The editor', x: 38, y: 86, content: 'herald' },
  ],
  bakery: [
    {
      id: 'oven',
      name: 'The bread ovens',
      x: 24,
      y: 58,
      content: 'kitchen',
      game: 'toss',
      blurb: 'Sling dough at the cooling rings hung over the ovens. Every bullseye earns Champion Isle points.',
    },
    {
      id: 'knead',
      name: 'Kneading table',
      x: 50,
      y: 76,
      content: 'kitchen',
      game: 'race',
      blurb: 'Rolling pins down the bakery floor, first one to the bread rack wins the Reed Race.',
    },
    {
      id: 'loft',
      name: 'Flour loft',
      x: 13,
      y: 74,
      content: 'kitchen',
      game: 'sprint',
      blurb: 'A dash up the flour loft ladder before the sacks settle. Fast webbed feet required.',
    },
    {
      id: 'rack',
      name: 'Cooling rack',
      x: 80,
      y: 88,
      content: 'kitchen',
      game: 'guard',
      blurb: 'Keep the gulls off the cooling loaves — the Nest Guard of the National Bakery.',
    },
    { id: 'counter', name: 'Bread counter', x: 44, y: 92, content: 'bakery' },
  ],
  registry: [
    { id: 'register', name: 'The register', x: 50, y: 80, content: 'registry' },
  ],
  library: [
    { id: 'stacks', name: 'The grammar shelves', x: 50, y: 80, content: 'grammar' },
  ],
  forest: [
    { id: 'glade', name: 'The quiet glade', x: 50, y: 84, content: 'forest' },
  ],
};

export const stationsFor = (id) => STATIONS[id] || [];