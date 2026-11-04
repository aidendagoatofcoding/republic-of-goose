import HouseSprite from '@/components/world/HouseSprite';

// Cottages of the ordinary honkers. They sit out on the southern outskirts of the
// Commons, well away from the spawn, the bakery and the plazas at the centre.
const COTTAGES = [
  { key: 'cottage-1', name: 'Nest Cottage', x: 20, y: 89, size: 'w-[104px] sm:w-[126px]' },
  { key: 'cottage-2', name: 'Burrow', x: 28, y: 94, size: 'w-[92px] sm:w-[110px]' },
  { key: 'cottage-3', name: 'Reed Bungalow', x: 37, y: 90, size: 'w-[98px] sm:w-[118px]' },
  { key: 'cottage-4', name: 'Moss Manor', x: 68, y: 90, size: 'w-[112px] sm:w-[136px]' },
  { key: 'cottage-5', name: 'Pond Villa', x: 76, y: 95, size: 'w-[102px] sm:w-[122px]' },
  { key: 'cottage-6', name: 'Sky Nest', x: 85, y: 90, size: 'w-[90px] sm:w-[106px]' },
  { key: 'cottage-7', name: 'Nest Cottage', x: 12, y: 94, size: 'w-[96px] sm:w-[112px]' },
  { key: 'cottage-8', name: 'Burrow', x: 46, y: 95, size: 'w-[86px] sm:w-[98px]' },
];

export default function NeighbourHouses() {
  return (
    <>
      {COTTAGES.map((cottage) => (
        <div
          key={cottage.key}
          style={{ left: `${cottage.x}%`, top: `${cottage.y}%` }}
          className="pointer-events-none absolute z-[6] -translate-x-1/2 -translate-y-[88%] text-center"
        >
          <HouseSprite
            name={cottage.name}
            className={`${cottage.size} drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]`}
          />
          <span className="mt-0.5 block max-w-[140px] truncate font-mono text-[8px] uppercase tracking-[0.1em] text-foreground/45">
            {cottage.name}
          </span>
        </div>
      ))}
    </>
  );
}