import { AREAS } from '@/lib/commonsAreas';
import { VENUES } from '@/lib/isleVenues';

// The street plan of the Honk Commons: one long avenue across the meadow, with a
// street running from it to the door of every plaza and every sports ground.
export const AVENUE_Y = 64;

// The meadow is far wider than it is tall, so a step sideways covers much more
// ground than a step up: horizontal gaps count for more when finding a street.
const WIDE = 3.1;

const spur = (id, x, y) => ({
  id,
  x1: x,
  y1: Math.min(AVENUE_Y, y),
  x2: x,
  y2: Math.max(AVENUE_Y, y),
});

export const ROADS = [
  { id: 'avenue', x1: 0, y1: AVENUE_Y, x2: 100, y2: AVENUE_Y },
  ...AREAS.map((area) => spur(`plaza-${area.id}`, area.x, area.y)),
  ...VENUES.map((venue) => spur(`ground-${venue.id}`, venue.x, venue.y)),
];

const project = (point, road) => {
  const dx = (road.x2 - road.x1) * WIDE;
  const dy = road.y2 - road.y1;
  const length = dx * dx + dy * dy;
  if (!length) {
    return { t: 0, gap: Math.hypot((point.x - road.x1) * WIDE, point.y - road.y1) };
  }
  const t = Math.min(
    1,
    Math.max(
      0,
      (((point.x - road.x1) * WIDE) * dx + (point.y - road.y1) * dy) / length
    )
  );
  const x = road.x1 + t * (road.x2 - road.x1);
  const y = road.y1 + t * (road.y2 - road.y1);
  return { t, gap: Math.hypot((point.x - x) * WIDE, point.y - y) };
};

export const nearestRoad = (point) =>
  ROADS.reduce((best, road) => {
    const found = project(point, road);
    return !best || found.gap < best.gap ? { road, ...found } : best;
  }, null);

export const pointOnRoad = (road, t) => ({
  x: road.x1 + (road.x2 - road.x1) * t,
  y: road.y1 + (road.y2 - road.y1) * t,
});

// A spot on the street nearest to where someone lives — where their walk starts.
export const spotOnRoadNear = (point, t) => {
  const nearest = nearestRoad(point);
  if (!nearest) return { x: point.x, y: point.y };
  return pointOnRoad(nearest.road, t);
};