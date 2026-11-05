import { useId } from 'react';
import {
  shade,
  BrickChimney,
  FlowerBox,
  DoorLantern,
  StonePath,
  PicketFence,
  GableTiles,
} from '@/components/world/houseParts';

// Homes are painted in pale, sunlit colours — cream walls and soft pale roofs.
const SHAPES = {
  'pond villa': { kind: 'gable', wall: '#f4f6ee', roof: '#a8c0ae', trim: '#ffffff', glow: '#ffe6a8' },
  'nest cottage': { kind: 'thatch', wall: '#faf1da', roof: '#d3b47c', trim: '#fffdf6', glow: '#ffe9b5' },
  'moss manor': { kind: 'manor', wall: '#f1f3ec', roof: '#b3c6b2', trim: '#ffffff', glow: '#ffeab0' },
  'ice longhouse': { kind: 'ice', wall: '#e2eff5', roof: '#aecfdd', trim: '#ffffff', glow: '#ffe9b8' },
  'lighthouse nest': { kind: 'tower', wall: '#f7f5eb', roof: '#b8c4bb', trim: '#ffffff', glow: '#ffe7ab' },
  'reed bungalow': { kind: 'thatch', wall: '#f4ecd6', roof: '#bcc794', trim: '#fffdf4', glow: '#ffe2a8' },
  'sky nest': { kind: 'tower', wall: '#f4f0e8', roof: '#c6b8d0', trim: '#ffffff', glow: '#ffe6b0' },
  burrow: { kind: 'mound', wall: '#8d6d49', roof: '#6f5438', trim: '#e0cda6', glow: '#ffe0a8' },
};

const FALLBACK = { kind: 'gable', wall: '#f4f6ee', roof: '#a8c0ae', trim: '#ffffff', glow: '#ffe6a8' };

const shapeFor = (name) => SHAPES[String(name || '').toLowerCase()] || FALLBACK;

function Windows({ glow, coords, boxes = [] }) {
  return coords.map(([x, y, w, h], index) => (
    <g key={`window-${index}`}>
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={w} ry={h * 0.8} fill={glow} opacity="0.16" />
      <rect x={x} y={y} width={w} height={h} rx="1" fill={glow} opacity="0.92" />
      <rect x={x} y={y} width={w} height={h * 0.42} rx="1" fill="#ffffff" opacity="0.22" />
      <rect x={x} y={y} width={w} height={h} rx="1" fill="none" stroke="#2a332c" strokeWidth="1.6" />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#2a332c" strokeWidth="1.1" />
      <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke="#2a332c" strokeWidth="0.9" opacity="0.8" />
      <rect x={x - 1.5} y={y + h} width={w + 3} height="2.4" rx="0.6" fill="#2a332c" opacity="0.9" />
      <path
        d={`M${x - 2.5} ${y + h + 2.4} h${w + 5} l-2 3.2 h-${w + 1}z`}
        fill="#5d4634"
        opacity="0.6"
      />
      {boxes.includes(index) && <FlowerBox x={x} y={y + h + 3} w={w} />}
    </g>
  ));
}

function Siding({ x, y, w, h, rows = 8 }) {
  return Array.from({ length: rows }, (_, i) => (
    <line
      key={`siding-${i}`}
      x1={x}
      y1={y + ((i + 1) * h) / (rows + 1)}
      x2={x + w}
      y2={y + ((i + 1) * h) / (rows + 1)}
      stroke="#000000"
      strokeOpacity="0.12"
      strokeWidth="0.8"
    />
  ));
}

function Foundation({ x, y, w, trim }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="9" fill="#6d6555" />
      <rect x={x} y={y} width={w} height="9" fill="none" stroke="#241d14" strokeWidth="1.2" />
      <g stroke="#4a4438" strokeWidth="0.8">
        <line x1={x} y1={y + 4.5} x2={x + w} y2={y + 4.5} />
        <line x1={x + w * 0.25} y1={y} x2={x + w * 0.25} y2={y + 4.5} />
        <line x1={x + w * 0.6} y1={y + 4.5} x2={x + w * 0.6} y2={y + 9} />
        <line x1={x + w * 0.85} y1={y} x2={x + w * 0.85} y2={y + 4.5} />
      </g>
      <rect x={x} y={y - 1.5} width={w} height="2" fill={trim} opacity="0.5" />
    </g>
  );
}

function Shrubs({ color = '#3f5a34' }) {
  return (
    <g>
      <ellipse cx="16" cy="103" rx="11" ry="5.4" fill={shade(color, -18)} />
      <ellipse cx="14" cy="101" rx="8.6" ry="4.6" fill={color} />
      <ellipse cx="13" cy="99" rx="4" ry="2.6" fill={shade(color, 22)} opacity="0.7" />
      <ellipse cx="104" cy="103" rx="12" ry="5.8" fill={shade(color, -18)} />
      <ellipse cx="106" cy="101" rx="9.2" ry="4.8" fill={color} />
      <ellipse cx="107" cy="99" rx="4.2" ry="2.6" fill={shade(color, 22)} opacity="0.7" />
    </g>
  );
}

export default function HouseSprite({ name, className = '' }) {
  const { kind, wall, roof, trim, glow } = shapeFor(name);
  const uid = useId().replace(/:/g, '');
  const wallFill = `url(#${uid}-wall)`;
  const roofFill = `url(#${uid}-roof)`;
  const roofDark = shade(roof, -34);
  const roofLight = shade(roof, 24);

  return (
    <svg viewBox="0 0 120 116" className={className} role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade(wall, 24)} />
          <stop offset="48%" stopColor={wall} />
          <stop offset="100%" stopColor={shade(wall, -32)} />
        </linearGradient>
        <linearGradient id={`${uid}-roof`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={roofLight} />
          <stop offset="55%" stopColor={roof} />
          <stop offset="100%" stopColor={roofDark} />
        </linearGradient>
        <linearGradient id={`${uid}-door`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4b3a29" />
          <stop offset="100%" stopColor="#2b2016" />
        </linearGradient>
        <radialGradient id={`${uid}-light`} cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.5" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="62" cy="107" rx="54" ry="8.5" fill="#08120c" opacity="0.45" />
      <ellipse cx="62" cy="106" rx="36" ry="5" fill="#08120c" opacity="0.3" />
      {/* grass tufts round the plot, so a house never floats on the meadow */}
      <g stroke={shade('#4d6b3a', -10)} strokeWidth="1.4" strokeLinecap="round" opacity="0.75">
        <path d="M28 108c1-3 2-4 3-5M32 108c0-3 1-4 2-6M92 108c1-3 2-4 3-5M96 108c0-3 1-4 2-6" />
      </g>

      {kind === 'mound' && (
        <>
          <path d="M12 106c0-34 22-58 50-58s50 24 50 58z" fill={`url(#${uid}-roof)`} />
          <path d="M18 106c0-30 20-51 44-51s44 21 44 51z" fill={wallFill} />
          <path d="M20 88c11-9 26-13 42-13s31 4 42 13" fill="none" stroke={shade(wall, 30)} strokeWidth="1.6" opacity="0.45" />
          <g stroke="#000000" strokeOpacity="0.16" strokeWidth="0.9" fill="none">
            <path d="M24 80c6-9 12-14 18-17M96 80c-6-9-12-14-18-17M34 98c8-6 16-9 26-9" />
          </g>
          <g fill="#6a5137" opacity="0.7">
            <ellipse cx="34" cy="70" rx="4.5" ry="2.6" />
            <ellipse cx="90" cy="74" rx="4" ry="2.4" />
            <ellipse cx="44" cy="62" rx="3.4" ry="2" />
          </g>
          <ellipse cx="62" cy="86" rx="15" ry="16" fill={`url(#${uid}-door)`} />
          <ellipse cx="62" cy="86" rx="15" ry="16" fill="none" stroke={shade(trim, -40)} strokeWidth="2.4" />
          <ellipse cx="62" cy="88" rx="11" ry="11" fill="#150e09" />
          <ellipse cx="62" cy="94" rx="18" ry="4" fill={glow} opacity="0.2" />
          <circle cx="68" cy="87" r="1.9" fill={glow} />
          <circle cx="42" cy="76" r="3.8" fill={glow} opacity="0.9" />
          <circle cx="86" cy="74" r="3.2" fill={glow} opacity="0.75" />
          <circle cx="42" cy="76" r="6.6" fill={glow} opacity="0.16" />
          <path d="M34 106c0-4 2-7 6-7s6 3 6 7M80 106c0-4 2-7 6-7s6 3 6 7" fill="#3f5a3a" />
          <g stroke="#5f7d4d" strokeWidth="1.6" fill="none">
            <path d="M40 72c-4-2-6-5-6-8M84 70c4-2 6-5 6-8" />
          </g>
          <circle cx="30" cy="98" r="2.6" fill="#c46a4a" />
          <circle cx="30" cy="98" r="2.6" fill="none" stroke="#f0d7bd" strokeWidth="0.8" />
          <circle cx="94" cy="96" r="2.2" fill="#d8c48a" />
          <StonePath x={62} y={104} />
        </>
      )}

      {kind === 'gable' && (
        <>
          <rect x="22" y="54" width="76" height="42" fill={wallFill} />
          <Siding x={22} y={54} w={76} h={42} rows={9} />
          <Foundation x={20} y={95} w={80} trim={trim} />
          <rect x="22" y="54" width="76" height="3.5" fill={trim} opacity="0.65" />
          <path d="M60 16 6 58h108z" fill={roofFill} />
          <path d="M60 22 16 58h88z" fill="#ffffff" opacity="0.09" />
          <GableTiles roofDark={roofDark} peak={16} base={58} half={54} />
          <path d="M6 58h108" stroke={trim} strokeWidth="2.6" opacity="0.85" />
          <path d="M6 58h108" stroke="#000000" strokeOpacity="0.18" strokeWidth="1" />
          {/* the ridge line and its finial */}
          <circle cx="60" cy="15" r="2.6" fill={shade(roof, 40)} stroke={roofDark} strokeWidth="0.9" />
          <line x1="60" y1="12" x2="60" y2="6" stroke={roofDark} strokeWidth="1.4" />
          <path d="M60 6h7l-2 2.4 2 2.4H60z" fill={glow} opacity="0.85" />
          <BrickChimney x={86} y={22} glow={glow} />
          <ellipse cx="61" cy="71" rx="13" ry="7.5" fill={`url(#${uid}-light)`} />
          <rect x="52" y="73" width="18" height="24" rx="1.5" fill={`url(#${uid}-door)`} />
          <rect x="52" y="73" width="18" height="24" rx="1.5" fill="none" stroke={trim} strokeWidth="1.3" opacity="0.75" />
          <line x1="61" y1="73" x2="61" y2="97" stroke="#000000" strokeOpacity="0.35" strokeWidth="0.9" />
          <rect x="55" y="77" width="12" height="8" fill={glow} opacity="0.85" />
          <rect x="55" y="87" width="12" height="6" fill={glow} opacity="0.35" />
          <circle cx="67.5" cy="88" r="1.6" fill={glow} />
          <rect x="47" y="97" width="28" height="3.4" rx="1" fill="#8b8170" />
          <rect x="47" y="97" width="28" height="1.2" rx="0.6" fill="#a9a091" />
          <DoorLantern x={44} y={78} glow={glow} />
          <Windows glow={glow} coords={[[28, 61, 15, 14], [75, 61, 15, 14]]} boxes={[0, 1]} />
          <StonePath x={62} y={103} />
          <PicketFence y={110} from={10} to={52} />
          <PicketFence y={110} from={70} to={112} />
          <Shrubs />
        </>
      )}

      {kind === 'thatch' && (
        <>
          <rect x="24" y="58" width="72" height="38" fill={wallFill} />
          <Siding x={24} y={58} w={72} h={38} rows={7} />
          <Foundation x={22} y={93} w={76} trim={trim} />
          <path d="M14 60c5-27 26-42 46-42s41 15 46 42c-15-5-29-7-46-7s-31 2-46 7z" fill={roofFill} />
          <g stroke={roofDark} strokeOpacity="0.45" strokeWidth="1" fill="none">
            <path d="M22 56c7-19 22-30 38-30M98 56c-7-19-22-30-38-30" />
            <path d="M18 50c9-19 24-29 42-29M102 50c-9-19-24-29-42-29" />
            <path d="M16 44c10-18 26-27 44-27M104 44c-10-18-26-27-44-27" />
          </g>
          {/* straw fringe along the eaves */}
          <path
            d="M14 60c4 4 6 7 7 10M24 59c3 4 5 7 6 10M36 58c2 4 4 7 5 10M50 57c1 4 3 7 3 10M66 57c0 4 2 7 2 10M80 58c-1 4-3 7-4 10M94 60c-3 4-5 7-6 10M104 62c-3 3-5 6-6 9"
            stroke={shade(roof, 26)}
            strokeWidth="1.3"
            fill="none"
            opacity="0.55"
          />
          <path d="M14 60c16-6 31-8 46-8s30 2 46 8" fill="none" stroke={shade(roof, 32)} strokeWidth="2.2" opacity="0.65" />
          <path d="M60 18c-6 4-10 12-12 24" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="3" fill="none" />
          <BrickChimney x={40} y={24} glow={glow} />
          <ellipse cx="60" cy="74" rx="14" ry="8" fill={`url(#${uid}-light)`} />
          <path d="M51 78h18v18a9 9 0 0 1-18 0z" fill={`url(#${uid}-door)`} />
          <path d="M51 78h18v18a9 9 0 0 1-18 0z" fill="none" stroke={shade(trim, -30)} strokeWidth="1.5" />
          <line x1="60" y1="78" x2="60" y2="94" stroke="#000000" strokeOpacity="0.3" strokeWidth="0.9" />
          <rect x="54" y="82" width="12" height="7" fill={glow} opacity="0.85" />
          <rect x="54" y="91" width="12" height="5" fill={glow} opacity="0.35" />
          <circle cx="66" cy="91" r="1.6" fill={glow} />
          <rect x="46" y="98" width="28" height="3.2" rx="1" fill="#8b8170" />
          <DoorLantern x={43} y={82} glow={glow} />
          <Windows glow={glow} coords={[[30, 65, 14, 13], [76, 65, 14, 13]]} boxes={[0, 1]} />
          <StonePath x={60} y={104} />
          <PicketFence y={110} from={12} to={50} />
          <PicketFence y={110} from={72} to={110} />
          <Shrubs color="#4d6b3a" />
        </>
      )}

      {kind === 'manor' && (
        <>
          <rect x="18" y="46" width="84" height="50" fill={wallFill} />
          <Siding x={18} y={46} w={84} h={50} rows={11} />
          <Foundation x={16} y={94} w={88} trim={trim} />
          <path d="M60 12 4 50h112z" fill={roofFill} />
          <path d="M60 18 12 50h96z" fill="#ffffff" opacity="0.08" />
          <GableTiles roofDark={roofDark} peak={12} base={50} half={56} />
          <rect x="8" y="49" width="104" height="3.8" fill={trim} opacity="0.9" />
          <circle cx="60" cy="11" r="3" fill={shade(roof, 44)} stroke={roofDark} strokeWidth="0.9" />
          <line x1="60" y1="7" x2="60" y2="1.5" stroke={roofDark} strokeWidth="1.4" />
          <BrickChimney x={28} y={18} glow={glow} />
          {/* dormer in the roof */}
          <path d="M52 30 60 23l8 7z" fill={roofLight} stroke={roofDark} strokeWidth="1" />
          <rect x="53" y="30" width="14" height="10" fill={wallFill} stroke={roofDark} strokeWidth="0.9" />
          <rect x="55.5" y="32" width="9" height="6" rx="0.8" fill={glow} opacity="0.9" />
          <ellipse cx="61" cy="76" rx="15" ry="9" fill={`url(#${uid}-light)`} />
          <path d="M49 72h24v21a4 4 0 0 1-4 4H53a4 4 0 0 1-4-4z" fill={`url(#${uid}-door)`} />
          <path d="M49 72h24v21a4 4 0 0 1-4 4H53a4 4 0 0 1-4-4z" fill="none" stroke={shade(trim, -35)} strokeWidth="1.7" />
          <line x1="61" y1="72" x2="61" y2="97" stroke="#000000" strokeOpacity="0.32" strokeWidth="1" />
          <rect x="53" y="76" width="16" height="9" fill={glow} opacity="0.85" />
          <circle cx="66" cy="87" r="1.8" fill={glow} />
          <rect x="43" y="97" width="36" height="3.6" rx="1" fill="#8b8170" />
          {/* portico posts */}
          <rect x="45" y="72" width="3" height="25" fill={trim} opacity="0.8" />
          <rect x="74" y="72" width="3" height="25" fill={trim} opacity="0.8" />
          <path d="M44 72h34l-3-4H47z" fill={shade(trim, -18)} opacity="0.9" />
          <DoorLantern x={41} y={78} glow={glow} />
          <DoorLantern x={81} y={78} glow={glow} />
          <Windows glow={glow} coords={[[23, 55, 16, 15], [81, 55, 16, 15], [23, 78, 16, 14], [81, 78, 16, 14]]} boxes={[2, 3]} />
          <StonePath x={61} y={103} />
          <PicketFence y={110} from={8} to={44} />
          <PicketFence y={110} from={78} to={114} />
          <ellipse cx="10" cy="94" rx="7.5" ry="9.5" fill={shade(wall, -16)} />
          <ellipse cx="110" cy="94" rx="7.5" ry="9.5" fill={shade(wall, -16)} />
          <Shrubs color="#42663c" />
        </>
      )}

      {kind === 'ice' && (
        <>
          <rect x="10" y="58" width="100" height="38" rx="2" fill={wallFill} />
          <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.9">
            <path d="M10 66h100M10 76h100M10 86h100" />
            <path d="M26 58v38M44 58v38M62 58v38M80 58v38M96 58v38" strokeOpacity="0.18" />
          </g>
          <Foundation x={8} y={93} w={104} trim={trim} />
          <path d="M10 58 26 30h68l16 28z" fill={roofFill} />
          <path d="M26 30 60 58l34-28M60 30v28" stroke={trim} strokeWidth="1.5" opacity="0.6" fill="none" />
          <g stroke="#000000" strokeOpacity="0.14" strokeWidth="0.9">
            <path d="M22 44h76M30 37h60" />
          </g>
          <path d="M10 58c17-5 33-7 50-7s33 2 50 7" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2.8" />
          <path d="M22 34c10-3 20-4 30-4M74 30c8 1 14 3 20 6" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2.4" fill="none" />
          <path d="M30 58v7M46 58v9M78 58v8M94 58v6" stroke="#dff2f8" strokeWidth="1.6" strokeOpacity="0.75" />
          {/* icicles under the eaves */}
          <g fill="#e8f6fb" opacity="0.85">
            <path d="M18 59l2 8 2-8zM34 59l2 10 2-10zM64 59l2 7 2-7zM88 59l2 9 2-9zM102 59l2 6 2-6z" />
          </g>
          <BrickChimney x={78} y={24} glow={glow} />
          <ellipse cx="61" cy="80" rx="14" ry="8" fill={`url(#${uid}-light)`} />
          <rect x="52" y="75" width="18" height="22" rx="2" fill={`url(#${uid}-door)`} />
          <rect x="52" y="75" width="18" height="22" rx="2" fill="none" stroke="#e8f4f8" strokeWidth="1.3" opacity="0.65" />
          <line x1="61" y1="75" x2="61" y2="97" stroke="#000000" strokeOpacity="0.3" strokeWidth="0.9" />
          <rect x="55" y="79" width="12" height="8" fill={glow} opacity="0.9" />
          <circle cx="67" cy="89" r="1.5" fill={glow} />
          <Windows glow={glow} coords={[[21, 64, 13, 13], [86, 64, 13, 13]]} boxes={[0, 1]} />
          <DoorLantern x={45} y={78} glow={glow} />
          <StonePath x={61} y={103} />
          <path d="M10 92h100" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.6" />
        </>
      )}

      {kind === 'tower' && (
        <>
          <ellipse cx="61" cy="105" rx="32" ry="5" fill="#08120c" opacity="0.3" />
          <Foundation x={40} y={93} w={42} trim={trim} />
          <path d="M44 93V50h34v43z" fill={wallFill} />
          <g stroke="#000000" strokeOpacity="0.16" strokeWidth="0.8">
            <path d="M44 58h34M44 68h34M44 78h34M44 86h34" />
            <path d="M52 50v43M70 50v43" strokeOpacity="0.08" />
          </g>
          <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2">
            <path d="M46 50v43M48 50v43" />
          </g>
          <rect x="40" y="48" width="42" height="5" rx="1" fill={trim} opacity="0.95" />
          {/* corbels under the parapet */}
          <g fill={shade(trim, -25)} opacity="0.8">
            <rect x="42" y="53" width="3.4" height="3" />
            <rect x="50" y="53" width="3.4" height="3" />
            <rect x="58" y="53" width="3.4" height="3" />
            <rect x="66" y="53" width="3.4" height="3" />
            <rect x="74" y="53" width="3.4" height="3" />
          </g>
          <rect x="49" y="24" width="24" height="24" rx="2" fill={roofFill} />
          <rect x="53" y="28" width="16" height="16" rx="1.5" fill={glow} opacity="0.92" />
          <rect x="53" y="28" width="16" height="16" rx="1.5" fill="none" stroke="#2a332c" strokeWidth="1.4" />
          <line x1="61" y1="28" x2="61" y2="44" stroke="#2a332c" strokeWidth="1" />
          <ellipse cx="61" cy="36" rx="17" ry="13" fill={glow} opacity="0.2" />
          <path d="M55 16h12v8H55z" fill={roofDark} />
          <path d="M53 24h16M61 24v-8" stroke={trim} strokeWidth="1.2" opacity="0.7" />
          <path d="M46 92V52" stroke="#000000" strokeOpacity="0.18" strokeWidth="2" />
          <ellipse cx="61" cy="80" rx="13" ry="8" fill={`url(#${uid}-light)`} />
          <path d="M53 76h16v18a8 8 0 0 1-16 0z" fill={`url(#${uid}-door)`} />
          <path d="M53 76h16v18a8 8 0 0 1-16 0z" fill="none" stroke={shade(trim, -30)} strokeWidth="1.3" />
          <rect x="56.5" y="80" width="9" height="7" fill={glow} opacity="0.85" />
          <circle cx="66" cy="87" r="1.4" fill={glow} />
          <path d="M84 40 104 30M84 50l20 8" stroke={glow} strokeWidth="2.2" opacity="0.35" />
          <DoorLantern x={45} y={80} glow={glow} />
          <Windows glow={glow} coords={[[47, 62, 10, 11]]} />
          <StonePath x={61} y={103} />
          <PicketFence y={110} from={34} to={88} />
          <path d="M34 102c6-4 12-4 16 0M72 102c4-4 10-4 16 0" fill="#4b6b4a" />
          <path d="M84 96c4-2 8-2 11 1" stroke="#5f7d4d" strokeWidth="1.6" fill="none" />
        </>
      )}
    </svg>
  );
}