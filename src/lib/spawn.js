// Where every goose lands in the Commons: the fountain stands in the middle of the
// four-way crossing, where the grand avenue meets the north–south boulevard.
export const SPAWN = { x: 44, y: 64 };

// The crossing itself, kept in one place so the streets and the spawn circle agree.
export const CROSSING = { x: 44, y: 64 };

// The portals stand on a true circle measured in screen pixels, so they never squash
// into an oval however wide the meadow is. Tighter than the cobbles, right at the fountain.
export const PORTAL_RING_RADIUS = 215;