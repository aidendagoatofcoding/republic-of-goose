import { REALMS } from '@/lib/realms';

// The plazas of the Honk Commons. Each one holds the portal to its own city scene.
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