import { REALMS } from '@/lib/realms';

// The plazas of the Honk Commons. Each realm portal stands in its own plaza, and the
// Government Plaza houses the civic offices of the Republic apart from the portals.
const CIVIC_AREAS = [
  { id: 'government', name: 'Government Plaza', x: 50, y: 77, rx: 6, ry: 4 },
];

export const AREAS = [
  ...REALMS.map((realm) => ({
    id: realm.id,
    name: realm.plazaName,
    ...realm.plaza,
  })),
  ...CIVIC_AREAS,
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