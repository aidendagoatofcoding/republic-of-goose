import { AREAS } from '@/lib/commonsAreas';
import { VENUES } from '@/lib/isleVenues';
import { SPAWN } from '@/lib/spawn';

// The street plan of the Honk Commons: the grand avenue across the meadow, the boulevard
// running north to south through the spawn crossing, and a street from the avenue to the
// door of every plaza and every sports ground.
export const AVENUE_Y = SPAWN.y;
export const BOULEVARD_X = SPAWN.x;

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

// Only one street per place: two plazas standing near the same spot share a single spur
// instead of running two roads through each other.
const uniqueSpurs = (entries) => {
  const seen = [];
  return entries.filter((entry) => {
    const clash = seen.some((other) => Math.abs(other.x - entry.x) < 5);
    if (clash) return false;
    seen.push(entry);
    return true;
  });
};

const SPURS = [
  ...uniqueSpurs(AREAS.map((area) => spur(`plaza-${area.id}`, area.x, area.y))),
  ...uniqueSpurs(VENUES.map((venue) => spur(`ground-${venue.id}`, venue.x, venue.y))),
  // The boulevard already runs down that line.
].filter((entry) => Math.abs(entry.x - BOULEVARD_X) > 2.5);

export const ROADS = [
  { id: 'avenue', x1: 0, y1: AVENUE_Y, x2: 100, y2: AVENUE_Y },
  { id: 'boulevard', x1: BOULEVARD_X, y1: 3, x2: BOULEVARD_X, y2: 97 },
  ...SPURS,
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

// A route that keeps to the streets: along the nearest street to the avenue, across the
// avenue, then up or down the destination's own street to its door.
export const routeAlongRoads = (from, to) => {
  if (!from || !to) return [];
  const start = nearestRoad(from);
  const end = nearestRoad(to);
  const points = [from];

  const startRoad = start?.road;
  const endRoad = end?.road;
  if (!startRoad || !endRoad) return [...points, to];

  const isAvenue = (road) => road.id === 'avenue';
  const vertical = (road) => road.x1;

  const startJunction =
    isAvenue(startRoad) ? { x: from.x, y: AVENUE_Y } : { x: vertical(startRoad), y: AVENUE_Y };
  const endJunction =
    isAvenue(endRoad) ? { x: to.x, y: AVENUE_Y } : { x: vertical(endRoad), y: AVENUE_Y };

  if (!isAvenue(startRoad)) points.push(startJunction);
  else points.push({ x: from.x, y: AVENUE_Y });

  if (!isAvenue(endRoad)) points.push(endJunction);
  else points.push({ x: to.x, y: AVENUE_Y });

  points.push(to);
  return points;
};