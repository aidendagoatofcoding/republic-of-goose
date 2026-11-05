import { ROADS, AVENUE_Y, BOULEVARD_X } from '@/lib/roads';
import Bridge from '@/components/world/Bridge';

const RIVER_Y = 48;

// The street plan: the flagged avenue, the boulevard through the crossing, and a spur from
// the avenue to every plaza and sports ground. Where a street crosses the Odder it gets a
// proper bridge instead of a plank over the water.
export default function Roads() {
  const boulevard = ROADS.find((road) => road.id === 'boulevard');
  const crossings = ROADS.filter(
    (road) => road.x1 === road.x2 && road.y1 < RIVER_Y - 4 && road.y2 > RIVER_Y + 4
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {ROADS.map((road) => {
        const flat = road.y1 === road.y2;
        return (
          <div
            key={road.id}
            style={
              flat
                ? {
                    left: `${road.x1}%`,
                    top: `${road.y1}%`,
                    width: `${road.x2 - road.x1}%`,
                  }
                : {
                    left: `${road.x1}%`,
                    top: `${road.y1}%`,
                    height: `${road.y2 - road.y1}%`,
                  }
            }
            className={
              flat
                ? 'absolute h-[26px] -translate-y-1/2 overflow-hidden rounded-[13px] border border-black/35 bg-[#4b4433]/90'
                : 'absolute w-[26px] -translate-x-1/2 overflow-hidden rounded-[13px] border border-black/35 bg-[#4b4433]/90'
            }
          >
            <span
              className={
                flat
                  ? 'absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-[#c2ff85]/12'
                  : 'absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-[#c2ff85]/12'
              }
            />
            <span
              className={
                flat
                  ? 'absolute inset-x-0 top-0 h-[6px] bg-[#5d5540]/45'
                  : 'absolute inset-y-0 left-0 w-[6px] bg-[#5d5540]/45'
              }
            />
          </div>
        );
      })}

      {/* The four-way crossing: the avenue and the boulevard meeting at the fountain. */}
      <span
        style={{ left: `${BOULEVARD_X}%`, top: `${AVENUE_Y}%` }}
        className="absolute h-[38px] w-[38px] -translate-x-1/2 -translate-y-1/2 rounded-[6px] border border-black/35 bg-[#4b4433]"
      />
      <span
        style={{ left: `${BOULEVARD_X}%`, top: `${AVENUE_Y}%` }}
        className="absolute h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c2ff85]/25"
      />

      {/* Every spur meets the avenue at a little kerbed junction. */}
      {ROADS.filter((road) => road.y1 !== road.y2 && road.id !== 'boulevard').map((road) => (
        <span
          key={`junction-${road.id}`}
          style={{ left: `${road.x1}%`, top: `${road.y1}%` }}
          className="absolute h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 bg-[#4b4433]/95"
        />
      ))}

      {boulevard && null}

      {/* Stone and timber where the streets run over the river. */}
      {crossings.map((road) => (
        <Bridge key={`bridge-${road.id}`} x={road.x1} y={RIVER_Y} />
      ))}
    </div>
  );
}