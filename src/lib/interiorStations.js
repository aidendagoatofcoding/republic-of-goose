// Where you can stand and do business inside each interior. Content keys resolve in StationContent.
export const STATIONS = {
  capital: [
    { id: 'doors', name: 'The four doors', x: 50, y: 78, content: 'capital' },
  ],
  bank: [
    { id: 'loans', name: 'Loans desk', x: 32, y: 78, content: 'bank-loans' },
    { id: 'vault', name: 'The vault', x: 78, y: 76, content: 'bank-vault' },
    { id: 'quiet-hands', name: 'A goose in a long coat', x: 18, y: 84, content: 'heist' },
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
    { id: 'goods', name: 'Decorations counter', x: 50, y: 84, content: 'shop-decoration' },
  ],
  shop: [
    { id: 'till', name: 'The till', x: 50, y: 80, content: 'shop-decoration' },
    { id: 'decorations', name: 'Decorations', x: 22, y: 86, content: 'shop-decoration' },
  ],
  homes: [
    { id: 'deeds', name: 'The deeds desk', x: 50, y: 82, content: 'shop-home' },
  ],
  furniture: [
    { id: 'bench', name: 'The cabinet bench', x: 50, y: 82, content: 'shop-furniture' },
  ],
  pets: [
    { id: 'kennels', name: 'The kennels', x: 50, y: 82, content: 'shop-pet' },
  ],
  granary: [
    { id: 'office', name: 'Labour office', x: 62, y: 84, content: 'granary' },
  ],
  herald: [
    { id: 'editor', name: 'The editor', x: 38, y: 86, content: 'herald' },
  ],
  witch: [
    { id: 'brew', name: 'The brewing pot', x: 46, y: 62, content: 'witch-brew' },
    { id: 'sift-gate', name: 'The Sift gate', x: 30, y: 84, content: 'sift-gate' },
  ],
  inn: [
    { id: 'bar', name: 'The inn bar', x: 74, y: 74, content: 'inn-bar' },
    { id: 'landlord', name: 'The landlord', x: 62, y: 84, content: 'quests:inn' },
  ],
  mineshaft: [
    { id: 'seam', name: 'The bread seam', x: 50, y: 80, content: 'mine' },
  ],
  assay: [
    { id: 'scales', name: 'The assay scales', x: 50, y: 82, content: 'shop-tool' },
  ],
  'sift-garden': [
    { id: 'blooms', name: 'The glass blooms', x: 50, y: 82, content: 'shop-decoration' },
  ],
  'sift-archive': [
    { id: 'stacks', name: 'The bright stacks', x: 50, y: 82, content: 'grammar' },
  ],
  'sift-court': [
    { id: 'hum', name: 'The hum', x: 50, y: 76, content: 'parliament' },
  ],
  'owl-tower': [
    { id: 'watch', name: 'The watch desk', x: 50, y: 74, content: 'owl-watch' },
    { id: 'owl-quest', name: 'The watchkeeper', x: 20, y: 82, content: 'quests:owl-tower' },
  ],
  shrine: [{ id: 'stone', name: 'The mossy stone', x: 50, y: 62, content: 'shrine-stone' }],
  den: [{ id: 'table', name: 'The card table', x: 72, y: 68, content: 'den-table' }],
  fishmarket: [
    { id: 'slab', name: 'The fish slab', x: 50, y: 78, content: 'quests:fishmarket' },
    { id: 'tackle', name: 'The tackle counter', x: 22, y: 84, content: 'shop-tool' },
  ],
  chandlery: [
    { id: 'rods', name: 'The rod rack', x: 50, y: 84, content: 'shop-tool' },
    { id: 'boats', name: 'Boats for the lake', x: 20, y: 84, content: 'shop-vehicle' },
  ],
  lighthouse: [
    { id: 'lamp', name: 'The lamp room', x: 50, y: 82, content: 'quests:lighthouse' },
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
    { id: 'clerk', name: 'The clerk', x: 22, y: 84, content: 'quests:registry' },
  ],
  library: [
    { id: 'stacks', name: 'The grammar shelves', x: 50, y: 80, content: 'grammar' },
  ],
  dealership: [
    { id: 'lot', name: 'The lot', x: 50, y: 80, content: 'shop-vehicle' },
  ],
  forest: [
    { id: 'glade', name: 'The quiet glade', x: 50, y: 84, content: 'forest' },
    { id: 'forester', name: 'The forester', x: 24, y: 88, content: 'quests:forest' },
  ],
  charcoal: [
    { id: 'burner', name: 'The charcoal burner', x: 62, y: 86, content: 'quests:charcoal' },
  ],
  moonwell: [
    { id: 'keeper', name: 'The well keeper', x: 50, y: 82, content: 'quests:moonwell' },
  ],
  caravanserai: [
    { id: 'master', name: 'The caravan master', x: 70, y: 84, content: 'quests:caravanserai' },
  ],
  bazaar: [
    { id: 'keeper', name: 'The bazaar keeper', x: 34, y: 84, content: 'quests:bazaar' },
    { id: 'stalls', name: 'The stalls', x: 72, y: 86, content: 'shop-decoration' },
  ],
  well: [{ id: 'drawer', name: 'The well drawer', x: 50, y: 80, content: 'quests:well' }],
  tomb: [{ id: 'keeper', name: 'The tomb keeper', x: 62, y: 82, content: 'quests:tomb' }],
  observatory: [
    { id: 'stargazer', name: 'The stargazer', x: 72, y: 82, content: 'quests:observatory' },
  ],
  cactus: [
    { id: 'postmaster', name: 'The postmaster', x: 62, y: 86, content: 'quests:cactus' },
  ],
  icehouse: [{ id: 'keeper', name: 'The ice keeper', x: 70, y: 82, content: 'quests:icehouse' }],
  lodge: [{ id: 'trapper', name: 'The trapper', x: 74, y: 82, content: 'quests:lodge' }],
  chapel: [{ id: 'chaplain', name: 'The chaplain', x: 50, y: 80, content: 'quests:chapel' }],
  bothy: [{ id: 'observer', name: 'The observer', x: 70, y: 86, content: 'quests:bothy' }],
  sled: [
    { id: 'yard', name: 'The yard keeper', x: 50, y: 84, content: 'quests:sled' },
    { id: 'sleds', name: 'Sleds for the snow', x: 76, y: 84, content: 'shop-vehicle' },
  ],
  hotspring: [{ id: 'keeper', name: 'The spring keeper', x: 50, y: 80, content: 'quests:hotspring' }],
};

export const stationsFor = (id) => STATIONS[id] || [];