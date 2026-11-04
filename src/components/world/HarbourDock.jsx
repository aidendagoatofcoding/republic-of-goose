import { useCitizen } from '@/hooks/useCitizen';
import useShopItems from '@/hooks/useShopItems';

const isBoat = (item) =>
  Boolean(item) &&
  item.category === 'vehicle' &&
  (/boat|skiff|barge|charter/i.test(item.name || '') || item.emoji === '⛵');

// The working end of the harbour: the lake from the shoreline down, one plank jetty
// running out over it, and every boat the citizen owns tied along the side.
export default function HarbourDock() {
  const { citizen } = useCitizen();
  const items = useShopItems();
  const boats = (citizen?.possessions ?? [])
    .map((id) => items.find((item) => item.id === id))
    .filter(isBoat);

  return (
    <>
      {/* the lake */}
      <div
        className="absolute inset-x-0 bottom-0 h-[34%] overflow-hidden"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, #17414d 0%, #103039 42%, #081a20 100%)',
          boxShadow: 'inset 0 12px 24px rgba(0,0,0,0.55)',
        }}
      >
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(180,231,240,0.16) 0 1px, transparent 1px 14px)',
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[6px] bg-[#0c232a]"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
        />
      </div>

      {/* the shoreline */}
      <div
        className="absolute inset-x-0 h-[3%]"
        style={{
          top: '65%',
          background: 'repeating-linear-gradient(90deg, #6b573b 0 22px, #57462f 22px 26px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}
        aria-hidden="true"
      />

      {/* the jetty, from the shore out into the lake */}
      <div
        className="absolute left-1/2 w-[15%] -translate-x-1/2"
        style={{
          top: '66%',
          height: '22%',
          background:
            'repeating-linear-gradient(0deg, #7a6342 0px, #7a6342 10px, #5a472c 10px, #5a472c 13px)',
          borderLeft: '2px solid #3d301c',
          borderRight: '2px solid #3d301c',
          boxShadow: '0 8px 20px rgba(0,0,0,0.55)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 h-[3%] w-[22%] -translate-x-1/2 rounded-sm"
        style={{ top: '86%', background: '#6b573b', boxShadow: '0 6px 14px rgba(0,0,0,0.5)' }}
        aria-hidden="true"
      />

      {/* mooring posts */}
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className="absolute h-3 w-1.5 rounded-sm bg-[#8a7350] shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          style={{ left: `${43 + index * 4.6}%`, top: `${70 + (index % 2) * 6}%` }}
          aria-hidden="true"
        />
      ))}

      {boats.map((boat, index) => (
        <div
          key={boat.id}
          style={{
            left: `${index % 2 === 0 ? 33 : 67}%`,
            top: `${72 + Math.floor(index / 2) * 8}%`,
            animation: `meadow-bob ${2.6 + index * 0.4}s ease-in-out infinite`,
          }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
          aria-hidden="true"
        >
          <span className="block text-3xl drop-shadow-[0_6px_8px_rgba(0,0,0,0.6)]">
            {boat.emoji || '⛵'}
          </span>
          <span className="mt-0.5 block whitespace-nowrap font-mono text-[7px] uppercase tracking-[0.1em] text-[#bfe9f2]/80">
            {boat.name}
          </span>
        </div>
      ))}

      {boats.length === 0 && (
        <span className="pointer-events-none absolute left-1/2 top-[95%] -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.14em] text-[#bfe9f2]/60">
          Buy a boat and it will be moored here
        </span>
      )}

      <span className="pointer-events-none absolute left-1/2 top-[62%] -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.2em] text-[#bfe9f2]/70">
        Honk Lake · the jetty
      </span>
    </>
  );
}