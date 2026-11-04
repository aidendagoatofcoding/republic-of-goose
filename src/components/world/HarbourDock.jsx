import { useCitizen } from '@/hooks/useCitizen';
import useShopItems from '@/hooks/useShopItems';

const isBoat = (item) =>
  Boolean(item) &&
  item.category === 'vehicle' &&
  (/boat|skiff|barge|charter/i.test(item.name || '') || item.emoji === '⛵');

// The working end of the harbour: water, a planked dock, and every boat the citizen owns.
export default function HarbourDock() {
  const { citizen } = useCitizen();
  const items = useShopItems();
  const boats = (citizen?.possessions ?? [])
    .map((id) => items.find((item) => item.id === id))
    .filter(isBoat);

  return (
    <>
      <div
        className="absolute inset-x-0 bottom-0 h-[34%] overflow-hidden"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, #13323c 0%, #0e2830 45%, #0a1d23 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(180,231,240,0.14) 0 1px, transparent 1px 12px)',
          }}
        />
      </div>

      {/* the dock itself */}
      <div
        className="absolute left-1/2 h-[16%] w-[26%] -translate-x-1/2 rounded-sm border border-black/40"
        style={{
          top: '79%',
          background:
            'repeating-linear-gradient(90deg, #6b573b 0px, #6b573b 13px, #4d3f2b 13px, #4d3f2b 15px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.55)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 h-[9%] w-[9%] -translate-x-1/2"
        style={{ top: '73%', background: '#4d3f2b' }}
        aria-hidden="true"
      />

      {[22, 50, 78].map((left) => (
        <span
          key={left}
          className="absolute h-2 w-2 rounded-full bg-[#8a7350] shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          style={{ left: `${left}%`, top: '94%' }}
          aria-hidden="true"
        />
      ))}

      {boats.map((boat, index) => (
        <div
          key={boat.id}
          style={{
            left: `${22 + index * 15}%`,
            top: '86%',
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
        <span className="pointer-events-none absolute left-1/2 top-[96%] -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.14em] text-[#bfe9f2]/60">
          Buy a boat and it will be moored here
        </span>
      )}

      <span className="pointer-events-none absolute left-1/2 top-[70%] -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.2em] text-[#bfe9f2]/70">
        Honk Lake · the dock
      </span>
    </>
  );
}