import HouseSprite from '@/components/world/HouseSprite';

// Cottages of the ordinary honkers. They sit out on the southern outskirts of the
// Commons, well away from the spawn, the bakery and the plazas at the centre.
const COTTAGES = [
  { key: 'cottage-1', name: 'Nest Cottage', x: 20, y: 89, size: 'w-[62px] sm:w-[74px]' },
  { key: 'cottage-2', name: 'Burrow', x: 28, y: 94, size: 'w-[54px] sm:w-[64px]' },
  { key: 'cottage-3', name: 'Reed Bungalow', x: 37, y: 90, size: 'w-[58px] sm:w-[70px]' },
  { key: 'cottage-4', name: 'Moss Manor', x: 68, y: 90, size: 'w-[66px] sm:w-[80px]' },
  { key: 'cottage-5', name: 'Pond Villa', x: 76, y: 95, size: 'w-[60px] sm:w-[72px]' },
  { key: 'cottage-6', name: 'Sky Nest', x: 85, y: 90, size: 'w-[52px] sm:w-[62px]' },
  { key: 'cottage-7', name: 'Nest Cottage', x: 12, y: 94, size: 'w-[56px] sm:w-[66px]' },
  { key: 'cottage-8', name: 'Burrow', x: 46, y: 95, size: 'w-[50px] sm:w-[58px]' },
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
            className={`${cottage.size} drop-shadow-[0_7px_9px_rgba(0,0,0,0.45)]`}
          />
          <span className="mt-0.5 block max-w-[100px] truncate font-mono text-[8px] uppercase tracking-[0.1em] text-foreground/45">
            {cottage.name}
          </span>
        </div>
      ))}
    </>
  );
}