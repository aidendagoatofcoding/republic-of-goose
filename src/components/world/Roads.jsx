import { ROADS } from '@/lib/roads';

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
                ? { left: `${road.x1}%`, top: `${road.y1}%`, width: `${road.x2 - road.x1}%` }
                : { left: `${road.x1}%`, top: `${road.y1}%`, height: `${road.y2 - road.y1}%` }
            }
            className={
              flat
                ? 'absolute h-8 -translate-y-1/2 bg-[#4a4334]/85 ring-1 ring-inset ring-black/25'
                : 'absolute w-8 -translate-x-1/2 bg-[#4a4334]/85 ring-1 ring-inset ring-black/25'
            }
          />
        );
      })}
    </div>
  );
}