// The districts of the Honk Commons. Each area is a place you walk into, with its own landmarks.
export const AREAS = [
  {
    id: 'capital',
    name: 'Capital of Honkton',
    x: 30,
    y: 81,
    rx: 14,
    ry: 12,
    buildings: [
      { id: 'capital-hall', name: 'Capital Building', variant: 'capital', x: 30, y: 71, place: 'capital' },
      { id: 'parliament', name: 'Parliament', variant: 'temple', x: 26.5, y: 84, place: 'parliament' },
      { id: 'bank', name: 'National Bank', variant: 'bank', x: 33.5, y: 84, place: 'bank' },
      { id: 'government', name: 'Government House', variant: 'tower', x: 30, y: 92, place: 'government' },
    ],
  },
  {
    id: 'market',
    name: 'Market Square',
    x: 74,
    y: 70,
    rx: 10,
    ry: 10,
    buildings: [
      { id: 'exchange', name: 'The Exchange', variant: 'tower', x: 72.5, y: 67, place: 'exchange' },
      { id: 'guild', name: 'Shop Guild', variant: 'cottage', x: 78, y: 74, place: 'guild' },
    ],
  },
  {
    id: 'farmlands',
    name: 'Wheat Reserve',
    x: 12,
    y: 77,
    rx: 11,
    ry: 12,
    buildings: [{ id: 'granary', name: 'Granary', variant: 'cottage', x: 17, y: 70, place: 'granary' }],
  },
  {
    id: 'harbour',
    name: 'Honk Lake Harbour',
    x: 87,
    y: 46,
    rx: 9,
    ry: 12,
    buildings: [{ id: 'herald', name: 'Honk Herald', variant: 'tower', x: 94, y: 53, place: 'herald' }],
  },
];

export const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area]));

export const areaAt = (position) => {
  if (!position) return null;
  return (
    AREAS.find((area) => {
      const dx = (position.x - area.x) / area.rx;
      const dy = (position.y - area.y) / area.ry;
      return dx * dx + dy * dy <= 1;
    }) || null
  );
};