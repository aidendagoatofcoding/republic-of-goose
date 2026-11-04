import { REALMS } from '@/lib/realms';

// The plazas of the Honk Commons. Every realm portal stands in its own plaza; the civic
// offices of the Republic are all inside the Government Plaza portal.
export const AREAS = REALMS.map((realm) => ({
  id: realm.id,
  name: realm.plazaName,
  ...realm.plaza,
}));

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