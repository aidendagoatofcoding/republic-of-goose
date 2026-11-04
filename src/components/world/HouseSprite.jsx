import { useId } from 'react';

const SHAPES = {
  'pond villa': { kind: 'gable', wall: '#cdd9c3', roof: '#3f6350', trim: '#efe7d2', glow: '#f2d68b' },
  'nest cottage': { kind: 'thatch', wall: '#d7c49b', roof: '#8a6a3c', trim: '#f0e6cc', glow: '#f4d78d' },
  'moss manor': { kind: 'manor', wall: '#cfd6c2', roof: '#40584a', trim: '#efe8d6', glow: '#f6d78c' },
  'ice longhouse': { kind: 'ice', wall: '#a9c8d4', roof: '#6d99ab', trim: '#e8f4f8', glow: '#ffe2a5' },
  'lighthouse nest': { kind: 'tower', wall: '#dfe0d5', roof: '#3d4f45', trim: '#f1ede1', glow: '#ffe6a2' },
  'reed bungalow': { kind: 'thatch', wall: '#c9b98d', roof: '#6f7c46', trim: '#eee2c2', glow: '#f0cd7f' },
  'sky nest': { kind: 'tower', wall: '#d6cfc0', roof: '#5b4a63', trim: '#f2ecdf', glow: '#ffe1a0' },
  burrow: { kind: 'mound', wall: '#5c4630', roof: '#463422', trim: '#c3ad82', glow: '#f3ce84' },
};

const FALLBACK = { kind: 'gable', wall: '#cdd9c3', roof: '#3f6350', trim: '#efe7d2', glow: '#f2d68b' };

const shapeFor = (name) => SHAPES[String(name || '').toLowerCase()] || FALLBACK;

// Lighten (positive) or darken (negative) a hex colour, so every house gets proper shading
// instead of flat blocks — the sun comes from the left of the meadow.
function shade(hex, amount) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.replace(/./g, '$&$&') : clean, 16);
  const clamp = (value) => Math.max(0, Math.min(255, value));
  const r = clamp(((num >> 16) & 255) + amount);
  const g = clamp(((num >> 8) & 255) + amount);
  const b = clamp((num & 255) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function Smoke({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="8" height="18" rx="1.5" fill="#6b5a4a" />
      <rect x={x} y={y} width="8" height="18" rx="1.5" fill="#000000" opacity="0.18" />
      <rect x={x - 2} y={y - 3} width="12" height="4" rx="1" fill="#8a7660" />
      {[0, 1.2, 2.4].map((delay) => (
        <circle
          key={delay}
          className="house-smoke"
          cx={x + 4}
          cy={y - 6}
          r="3"
          fill="#dfe4dc"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </g>
  );
}

function Windows({ glow, coords }) {
  return coords.map(([x, y, w, h], index) => (
    <g key={`window-${index}`}>
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={w} ry={h * 0.8} fill={glow} opacity="0.16" />
      <rect x={x} y={y} width={w} height={h} rx="1" fill={glow} opacity="0.92" />
      <rect x={x} y={y} width={w} height={h * 0.42} rx="1" fill="#ffffff" opacity="0.22" />
      <rect x={x} y={y} width={w} height={h} rx="1" fill="none" stroke="#2a332c" strokeWidth="1.6" />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#2a332c" strokeWidth="1.1" />
      <rect x={x - 1.5} y={y + h} width={w + 3} height="2" rx="0.6" fill="#2a332c" opacity="0.85" />
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
      </g>
      <rect x={x} y={y - 1.5} width={w} height="2" fill={trim} opacity="0.5" />
    </g>
  );
}

function Shrubs({ color = '#3f5a34' }) {
  return (
    <g>
      <ellipse cx="20" cy="103" rx="10" ry="5" fill={shade(color, -18)} />
      <ellipse cx="18" cy="101" rx="8" ry="4.4" fill={color} />
      <ellipse cx="100" cy="103" rx="11" ry="5.4" fill={shade(color, -18)} />
      <ellipse cx="102" cy="101" rx="8.6" ry="4.6" fill={color} />
    </g>
  );
}

export default function HouseSprite({ name, className = '' }) {
  const { kind, wall, roof, trim, glow } = shapeFor(name);
  const uid = useId().replace(/:/g, '');
  const wallFill = `url(#${uid}-wall)`;
  const roofFill = `url(#${uid}-roof)`;
  const roofDark = shade(roof, -30);
  const roofLight = shade(roof, 20);

  return (
    <svg viewBox="0 0 120 112" className={className} role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade(wall, 22)} />
          <stop offset="48%" stopColor={wall} />
          <stop offset="100%" stopColor={shade(wall, -30)} />
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

      <ellipse cx="62" cy="105" rx="50" ry="8" fill="#08120c" opacity="0.45" />
      <ellipse cx="62" cy="104" rx="34" ry="5" fill="#08120c" opacity="0.3" />

      {kind === 'mound' && (
        <>
          <path d="M12 104c0-33 22-56 50-56s50 23 50 56z" fill={`url(#${uid}-roof)`} />
          <path d="M18 104c0-29 20-49 44-49s44 20 44 49z" fill={wallFill} />
          <path d="M20 86c11-9 26-13 42-13s31 4 42 13" fill="none" stroke={shade(wall, 30)} strokeWidth="1.6" opacity="0.45" />
          <g stroke="#000000" strokeOpacity="0.16" strokeWidth="0.9" fill="none">
            <path d="M24 78c6-9 12-14 18-17M96 78c-6-9-12-14-18-17M34 96c8-6 16-9 26-9" />
          </g>
          <ellipse cx="62" cy="84" rx="15" ry="16" fill={`url(#${uid}-door)`} />
          <ellipse cx="62" cy="84" rx="15" ry="16" fill="none" stroke={shade(trim, -40)} strokeWidth="2.4" />
          <ellipse cx="62" cy="86" rx="11" ry="11" fill="#150e09" />
          <ellipse cx="62" cy="92" rx="18" ry="4" fill={glow} opacity="0.2" />
          <circle cx="68" cy="85" r="1.9" fill={glow} />
          <circle cx="42" cy="74" r="3.8" fill={glow} opacity="0.9" />
          <circle cx="86" cy="72" r="3.2" fill={glow} opacity="0.75" />
          <path d="M34 104c0-4 2-7 6-7s6 3 6 7M80 104c0-4 2-7 6-7s6 3 6 7" fill="#3f5a3a" />
          <g stroke="#5f7d4d" strokeWidth="1.6" fill="none">
            <path d="M40 70c-4-2-6-5-6-8M84 68c4-2 6-5 6-8" />
          </g>
          <circle cx="30" cy="98" r="2.6" fill="#c46a4a" />
          <circle cx="30" cy="98" r="2.6" fill="none" stroke="#f0d7bd" strokeWidth="0.8" />
        </>
      )}

      {kind === 'gable' && (
        <>
          <rect x="22" y="54" width="76" height="42" fill={wallFill} />
          <Siding x={22} y={54} w={76} h={42} rows={9} />
          <Foundation x={20} y={95} w={80} trim={trim} />
          <rect x="22" y="54" width="76" height="3.5" fill={trim} opacity="0.65" />
          <path d="M60 16 8 57h104z" fill={roofFill} />
          <path d="M60 22 18 57h84z" fill="#ffffff" opacity="0.09" />
          <g stroke={roofDark} strokeOpacity="0.5" strokeWidth="0.9">
            <path d="M26 50h68M34 42h52M42 34h36M50 26h20" />
          </g>
          <path d="M8 57h104" stroke={trim} strokeWidth="2.4" opacity="0.8" />
          <ellipse cx="61" cy="71" rx="12" ry="7" fill={`url(#${uid}-light)`} />
          <rect x="53" y="74" width="16" height="23" rx="1.5" fill={`url(#${uid}-door)`} />
          <rect x="53" y="74" width="16" height="23" rx="1.5" fill="none" stroke={trim} strokeWidth="1.2" opacity="0.7" />
          <rect x="56" y="78" width="10" height="7" fill={glow} opacity="0.85" />
          <circle cx="66.5" cy="88" r="1.5" fill={glow} />
          <rect x="49" y="97" width="24" height="3" rx="1" fill="#7a705c" />
          <Windows glow={glow} coords={[[30, 62, 14, 13], [76, 62, 14, 13]]} />
          <Smoke x={86} y={20} />
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
          </g>
          <path d="M14 60c16-6 31-8 46-8s30 2 46 8" fill="none" stroke={shade(roof, 32)} strokeWidth="2" opacity="0.6" />
          <ellipse cx="60" cy="74" rx="13" ry="8" fill={`url(#${uid}-light)`} />
          <path d="M52 78h16v18a8 8 0 0 1-16 0z" fill={`url(#${uid}-door)`} />
          <path d="M52 78h16v18a8 8 0 0 1-16 0z" fill="none" stroke={shade(trim, -30)} strokeWidth="1.4" />
          <rect x="55" y="82" width="10" height="7" fill={glow} opacity="0.85" />
          <circle cx="65" cy="90" r="1.5" fill={glow} />
          <rect x="48" y="98" width="24" height="3" rx="1" fill="#7a705c" />
          <Windows glow={glow} coords={[[32, 66, 13, 12], [76, 66, 13, 12]]} />
          <Shrubs color="#4d6b3a" />
        </>
      )}

      {kind === 'manor' && (
        <>
          <rect x="18" y="46" width="84" height="50" fill={wallFill} />
          <Siding x={18} y={46} w={84} h={50} rows={11} />
          <Foundation x={16} y={94} w={88} trim={trim} />
          <path d="M60 12 6 49h108z" fill={roofFill} />
          <path d="M60 18 14 49h92z" fill="#ffffff" opacity="0.08" />
          <g stroke={roofDark} strokeOpacity="0.5" strokeWidth="0.9">
            <path d="M18 45h84M28 37h64M40 28h40" />
          </g>
          <rect x="12" y="49" width="96" height="3.4" fill={trim} opacity="0.85" />
          <rect x="52" y="58" width="16" height="6" fill={trim} opacity="0.5" />
          <ellipse cx="61" cy="76" rx="14" ry="9" fill={`url(#${uid}-light)`} />
          <path d="M50 72h21v21a4 4 0 0 1-4 4h-13a4 4 0 0 1-4-4z" fill={`url(#${uid}-door)`} />
          <path d="M50 72h21v21a4 4 0 0 1-4 4h-13a4 4 0 0 1-4-4z" fill="none" stroke={shade(trim, -35)} strokeWidth="1.6" />
          <circle cx="66" cy="86" r="1.7" fill={glow} />
          <rect x="45" y="97" width="31" height="3.4" rx="1" fill="#8b8170" />
          <Windows glow={glow} coords={[[25, 56, 15, 14], [80, 56, 15, 14], [25, 78, 15, 13], [80, 78, 15, 13]]} />
          <Smoke x={92} y={14} />
          <ellipse cx="12" cy="94" rx="7" ry="9" fill={shade(wall, -16)} />
          <ellipse cx="108" cy="94" rx="7" ry="9" fill={shade(wall, -16)} />
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
          <path d="M26 30 60 58l34-28M60 30v28" stroke={trim} strokeWidth="1.4" opacity="0.55" fill="none" />
          <path d="M10 58c17-5 33-7 50-7s33 2 50 7" fill="none" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="2.6" />
          <path d="M22 34c10-3 20-4 30-4M74 30c8 1 14 3 20 6" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2.4" fill="none" />
          <path d="M30 58v7M46 58v9M78 58v8M94 58v6" stroke="#dff2f8" strokeWidth="1.6" strokeOpacity="0.75" />
          <ellipse cx="61" cy="80" rx="13" ry="8" fill={`url(#${uid}-light)`} />
          <rect x="53" y="76" width="16" height="21" rx="2" fill={`url(#${uid}-door)`} />
          <rect x="53" y="76" width="16" height="21" rx="2" fill="none" stroke="#e8f4f8" strokeWidth="1.2" opacity="0.6" />
          <rect x="56" y="80" width="10" height="7" fill={glow} opacity="0.9" />
          <Windows glow={glow} coords={[[22, 64, 12, 13], [86, 64, 12, 13]]} />
          <path d="M10 92h100" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.4" />
        </>
      )}

      {kind === 'tower' && (
        <>
          <ellipse cx="61" cy="104" rx="30" ry="5" fill="#08120c" opacity="0.3" />
          <Foundation x={40} y={93} w={42} trim={trim} />
          <path d="M44 93V50h34v43z" fill={wallFill} />
          <g stroke="#000000" strokeOpacity="0.16" strokeWidth="0.8">
            <path d="M44 58h34M44 68h34M44 78h34M44 86h34" />
            <path d="M52 50v43M70 50v43" strokeOpacity="0.08" />
          </g>
          <rect x="40" y="48" width="42" height="5" rx="1" fill={trim} opacity="0.95" />
          <rect x="49" y="24" width="24" height="24" rx="2" fill={roofFill} />
          <rect x="53" y="28" width="16" height="16" rx="1.5" fill={glow} opacity="0.92" />
          <rect x="53" y="28" width="16" height="16" rx="1.5" fill="none" stroke="#2a332c" strokeWidth="1.4" />
          <ellipse cx="61" cy="36" rx="16" ry="12" fill={glow} opacity="0.2" />
          <path d="M55 16h12v8H55z" fill={roofDark} />
          <path d="M53 24h16M61 24v-8" stroke={trim} strokeWidth="1.2" opacity="0.7" />
          <path d="M46 92V52" stroke="#000000" strokeOpacity="0.18" strokeWidth="2" />
          <ellipse cx="61" cy="80" rx="12" ry="8" fill={`url(#${uid}-light)`} />
          <path d="M54 76h14v17a7 7 0 0 1-14 0z" fill={`url(#${uid}-door)`} />
          <path d="M54 76h14v17a7 7 0 0 1-14 0z" fill="none" stroke={shade(trim, -30)} strokeWidth="1.2" />
          <rect x="57" y="80" width="8" height="6" fill={glow} opacity="0.85" />
          <circle cx="66" cy="86" r="1.3" fill={glow} />
          <path d="M84 40 104 30M84 50l20 8" stroke={glow} strokeWidth="2.2" opacity="0.35" />
          <path d="M34 100c6-4 12-4 16 0M72 100c4-4 10-4 16 0" fill="#4b6b4a" />
          <path d="M84 96c4-2 8-2 11 1" stroke="#5f7d4d" strokeWidth="1.6" fill="none" />
        </>
      )}
    </svg>
  );
}