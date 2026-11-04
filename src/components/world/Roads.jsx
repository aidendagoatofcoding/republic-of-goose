import { ROADS } from '@/lib/roads';

// The street plan: one flagged avenue with a lighter centre line, and a spur from it
// to every plaza and sports ground.
export default function Roads() {
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
      {ROADS.filter((road) => road.y1 !== road.y2).map((road) => (
        <span
          key={`junction-${road.id}`}
          style={{ left: `${road.x1}%`, top: `${road.y1}%` }}
          className="absolute h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 bg-[#4b4433]/95"
        />
      ))}
    </div>
  );
}