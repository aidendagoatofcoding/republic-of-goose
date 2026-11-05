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
import { OreVein, Rails, Timber } from '@/components/world/interiors/props/MineProps';
import { styleFor } from '@/lib/roomStyles';

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
  timber: Timber,
  ore: OreVein,
  rails: Rails,
};

const DUST = Array.from({ length: 16 }, (_, i) => ({
  left: 6 + ((i * 17) % 88),
  top: 26 + ((i * 29) % 60),
  delay: (i % 8) * 1.1,
  size: i % 3 === 0 ? 2 : 1,
}));

// Three arched windows of stained light: the old stone rooms of the Republic.
function TallWindows({ accent }) {
  return [22, 50, 78].map((x, index) => (
    <div
      key={`tall-${x}`}
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
  ));
}

// A home's own window: the meadow, the hills and the weather over the sill.
function GardenWindow({ accent }) {
  return (
    <div
      className="absolute left-1/2 top-[15%] -translate-x-1/2 border-4 shadow-lg"
      style={{ width: '42%', height: '30%', borderColor: '#9c7b4d', background: '#bfe4ef' }}
      aria-hidden="true"
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #cfeaf6 0%, #e8f4f8 44%, #cfe3b6 62%, #a9c98d 78%, #8bb06e 100%)',
        }}
      />
      <span
        className="absolute right-[14%] top-[10%] h-[18%] w-[18%] rounded-full"
        style={{ background: 'radial-gradient(circle, #fff3c4 0%, #ffe08a 60%, transparent 100%)' }}
      />
      <span className="absolute left-[8%] top-[38%] h-[14%] w-[26%] rounded-[50%] bg-[#7fa86a] opacity-80" />
      <span className="absolute right-[6%] top-[44%] h-[12%] w-[22%] rounded-[50%] bg-[#7fa86a] opacity-70" />
      <span
        className="absolute left-1/2 top-[20%] h-[70%] w-[3px] -translate-x-1/2"
        style={{ background: '#9c7b4d' }}
      />
      <span className="absolute left-0 top-[46%] h-[3px] w-full" style={{ background: '#9c7b4d' }} />
      <span
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 26px rgba(60,90,50,0.35)' }}
      />
      {/* the sill, and a potted bit of the garden on it */}
      <span
        className="absolute -bottom-3 left-1/2 h-3 w-[112%] -translate-x-1/2 rounded-sm"
        style={{ background: 'linear-gradient(180deg, #c3a878 0%, #9c7b4d 100%)' }}
      />
      <span
        className="absolute -bottom-8 left-[16%] h-5 w-6 rounded-b-sm"
        style={{ background: '#b4653f' }}
      />
      <span
        className="absolute -bottom-6 left-[18%] h-3 w-4 rounded-full"
        style={{ background: accent, opacity: 0.8 }}
      />
    </div>
  );
}

// Round windows, for the harbour, the ice and the Sift.
function RoundWindows({ accent }) {
  return [26, 74].map((x, index) => (
    <div
      key={`round-${x}`}
      className="absolute top-[22%] flex -translate-x-1/2 items-center justify-center rounded-full border-2"
      style={{
        left: `${x}%`,
        width: '13%',
        aspectRatio: '1 / 1',
        borderColor: `${accent}66`,
        background: `radial-gradient(circle at 50% 40%, ${accent}44 0%, ${accent}12 60%, transparent 100%)`,
        boxShadow: `inset 0 0 18px ${accent}44`,
        animationDelay: `${index * 0.8}s`,
      }}
      aria-hidden="true"
    >
      <span className="absolute h-full w-[2px]" style={{ background: `${accent}33` }} />
      <span className="glow-pulse absolute h-[2px] w-full" style={{ background: `${accent}33` }} />
    </div>
  ));
}

function RoomWindows({ kind, accent }) {
  if (kind === 'garden') return <GardenWindow accent={accent} />;
  if (kind === 'round') return <RoundWindows accent={accent} />;
  if (kind === 'none') return null;
  return <TallWindows accent={accent} />;
}

function InteriorRoom({ place }) {
  const style = styleFor(place);
  const accent = place.accent || '#f2c96b';
  const light = place.wood === true;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: style.floor }}>
      <div className="absolute inset-x-0 top-0 h-[66%]" style={{ background: style.wall }} />
      <div
        className="absolute inset-x-0 top-0 h-[66%]"
        style={{
          backgroundImage: style.wallTexture,
          opacity: style.wallAlpha,
        }}
        aria-hidden="true"
      />

      <RoomWindows kind={style.window} accent={accent} />

      {/* Floor: pale oak boards in homes, dressed timber and stone everywhere else. */}
      <div className="absolute inset-x-0 bottom-0 h-[34%]" style={{ background: style.floor }} />
      <div
        className="absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          backgroundImage: style.floorTexture,
          opacity: style.floorAlpha,
          maskImage: 'linear-gradient(180deg, transparent, #000 80%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 80%)',
        }}
        aria-hidden="true"
      />
      {/* the skirting board where wall meets floor */}
      <div
        className="absolute inset-x-0 top-[66%] h-[3px]"
        style={{ background: style.skirting, opacity: 0.65 }}
        aria-hidden="true"
      />

      <div
        className="absolute left-1/2 top-[6%] z-20 hidden -translate-x-1/2 whitespace-nowrap border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.32em] md:block"
        style={
          light
            ? { borderColor: '#b9a880', color: '#241d12', background: 'rgba(255,252,244,0.86)' }
            : { borderColor: `${accent}55`, color: accent, background: 'rgba(10,15,11,0.8)' }
        }
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
            opacity: light ? 0.5 : 1,
          }}
          aria-hidden="true"
        />
      ))}

      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: style.vignette }}
        aria-hidden="true"
      />
    </div>
  );
}

export default memo(InteriorRoom);