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
    { id: 'counter', name: 'Bread counter', x: 32, y: 82, content: 'bakery' },
  ],
  forest: [
    { id: 'glade', name: 'The quiet glade', x: 50, y: 84, content: 'forest' },
  ],
};

export const stationsFor = (id) => STATIONS[id] || [];