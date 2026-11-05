import { memo } from 'react';
import {
  Board,
  Benches,
  Counter,
  MapProp,
  Mill,
  Oven,
  Podium,
  Press,
  Sacks,
  Shelf,
  Vault,
} from '@/components/world/interiors/props/Furniture';
import { Banner, Chandelier, Coins, Trees } from '@/components/world/interiors/props/Scenery';

const PROPS = {
  counter: Counter,
  vault: Vault,
  board: Board,
  map: MapProp,
  shelf: Shelf,
  sacks: Sacks,
  mill: Mill,
  press: Press,
  oven: Oven,
  benches: Benches,
  podium: Podium,
  chandelier: Chandelier,
  banner: Banner,
  trees: Trees,
  coins: Coins,
};

const DUST = Array.from({ length: 16 }, (_, i) => ({
  left: 6 + ((i * 17) % 88),
  top: 26 + ((i * 29) % 60),
  delay: (i % 8) * 1.1,
  size: i % 3 === 0 ? 2 : 1,
}));

function InteriorRoom({ place }) {
  const accent = place.accent || '#f2c96b';

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#080d09]">
      <div
        className="absolute inset-x-0 top-0 h-[66%]"
        style={{
          background: place.wood
            ? 'linear-gradient(180deg, #fbf7ec 0%, #efe8d8 70%, #e2d9c5 100%)'
            : 'linear-gradient(180deg, #1b2419 0%, #101610 70%, #0c120d 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[66%] opacity-[0.16]"
        style={{
          backgroundImage: place.wood
            ? 'repeating-linear-gradient(0deg, #8a7a5c 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, #8a7a5c 0 1px, transparent 1px 96px)'
            : 'repeating-linear-gradient(0deg, #e8d9b0 0 1px, transparent 1px 38px), repeating-linear-gradient(90deg, #e8d9b0 0 1px, transparent 1px 94px)',
        }}
        aria-hidden="true"
      />

      {[22, 50, 78].map((x, index) => (
        <div
          key={x}
          className="absolute top-[26%] -translate-x-1/2 overflow-hidden rounded-t-full border border-[#c8a86a]/30"
          style={{ left: `${x}%`, width: '13%', height: '30%' }}
          aria-hidden="true"
        >
          <span
            className="glow-pulse absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${accent}55, ${accent}10 55%, transparent 78%)`,
              animationDelay: `${index * 0.6}s`,
            }}
          />
          <span className="absolute left-1/2 top-0 h-full w-[1px] bg-[#c8a86a]/25" />
        </div>
      ))}

      {/* Floor: homes are laid in pale oak boards, civic rooms in dark timber. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          background: place.wood
            ? 'linear-gradient(180deg, #d8ac70 0%, #c4955a 55%, #ab7c45 100%)'
            : 'linear-gradient(180deg, #2c2417 0%, #17110a 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          backgroundImage: place.wood
            ? 'repeating-linear-gradient(90deg, #8d6435 0 2px, rgba(255,255,255,0.10) 2px 3px, transparent 3px 94px), repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 17px)'
            : 'repeating-linear-gradient(90deg, #e8d9b0 0 1px, transparent 1px 46px)',
          opacity: place.wood ? 0.75 : 0.25,
          maskImage: 'linear-gradient(180deg, transparent, #000 80%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 80%)',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute left-1/2 top-[6%] z-20 hidden -translate-x-1/2 whitespace-nowrap border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.32em] md:block"
        style={{ borderColor: `${accent}55`, color: accent, background: 'rgba(10,15,11,0.8)' }}
      >
        {place.sign}
      </div>

      {place.props.map((prop, index) => {
        const Prop = PROPS[prop.type];
        if (!Prop) return null;
        return <Prop key={`${prop.type}-${index}`} p={prop} accent={accent} />;
      })}

      {DUST.map((mote, index) => (
        <span
          key={`dust-${index}`}
          className="dust-mote pointer-events-none absolute rounded-full bg-[#f6ecc9]"
          style={{
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            height: `${mote.size}px`,
            width: `${mote.size}px`,
            animationDelay: `${mote.delay}s`,
          }}
          aria-hidden="true"
        />
      ))}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: place.wood
            ? 'inset 0 0 120px 24px rgba(90,62,32,0.35)'
            : 'inset 0 0 140px 40px rgba(0,0,0,0.75)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

export default memo(InteriorRoom);