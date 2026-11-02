const SHAPES = {
  'pond villa': {
    kind: 'gable',
    wall: '#cdd9c3',
    roof: '#3f6350',
    trim: '#efe7d2',
    glow: '#f2d68b',
  },
  'nest cottage': {
    kind: 'thatch',
    wall: '#d7c49b',
    roof: '#8a6a3c',
    trim: '#f0e6cc',
    glow: '#f4d78d',
  },
  'moss manor': {
    kind: 'manor',
    wall: '#cfd6c2',
    roof: '#40584a',
    trim: '#efe8d6',
    glow: '#f6d78c',
  },
  'ice longhouse': {
    kind: 'ice',
    wall: '#a9c8d4',
    roof: '#6d99ab',
    trim: '#e8f4f8',
    glow: '#ffe2a5',
  },
  'lighthouse nest': {
    kind: 'tower',
    wall: '#dfe0d5',
    roof: '#3d4f45',
    trim: '#f1ede1',
    glow: '#ffe6a2',
  },
  'reed bungalow': {
    kind: 'thatch',
    wall: '#c9b98d',
    roof: '#6f7c46',
    trim: '#eee2c2',
    glow: '#f0cd7f',
  },
  'sky nest': {
    kind: 'tower',
    wall: '#d6cfc0',
    roof: '#5b4a63',
    trim: '#f2ecdf',
    glow: '#ffe1a0',
  },
  burrow: {
    kind: 'mound',
    wall: '#5c4630',
    roof: '#463422',
    trim: '#c3ad82',
    glow: '#f3ce84',
  },
};

const FALLBACK = {
  kind: 'gable',
  wall: '#cdd9c3',
  roof: '#3f6350',
  trim: '#efe7d2',
  glow: '#f2d68b',
};

const shapeFor = (name) => SHAPES[String(name || '').toLowerCase()] || FALLBACK;

function Smoke({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="7" height="16" rx="1.5" fill="#6b5a4a" />
      <rect x={x - 2} y={y - 3} width="11" height="4" rx="1" fill="#8a7660" />
      <circle className="house-smoke" cx={x + 3.5} cy={y - 6} r="3" fill="#dfe4dc" style={{ animationDelay: '0s' }} />
      <circle className="house-smoke" cx={x + 3.5} cy={y - 6} r="3" fill="#dfe4dc" style={{ animationDelay: '1.2s' }} />
      <circle className="house-smoke" cx={x + 3.5} cy={y - 6} r="3" fill="#dfe4dc" style={{ animationDelay: '2.4s' }} />
    </g>
  );
}

function Windows({ glow, coords }) {
  return coords.map(([x, y, w, h], index) => (
    <g key={`window-${index}`}>
      <rect x={x} y={y} width={w} height={h} rx="1.5" fill={glow} opacity="0.92" />
      <rect x={x} y={y} width={w} height={h} rx="1.5" fill="none" stroke="#2a332c" strokeWidth="1.4" />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#2a332c" strokeWidth="1" />
    </g>
  ));
}

export default function HouseSprite({ name, className = '' }) {
  const { kind, wall, roof, trim, glow } = shapeFor(name);
  return (
    <svg viewBox="0 0 120 108" className={className} role="presentation" aria-hidden="true">
      <ellipse cx="60" cy="99" rx="44" ry="7" fill="#08120c" opacity="0.4" />

      {kind === 'mound' && (
        <>
          <path d="M14 99c0-29 20-49 46-49s46 20 46 49z" fill={roof} />
          <path d="M21 99c0-24 17-41 39-41s39 17 39 41z" fill={wall} />
          <path d="M22 83c10-8 24-12 38-12s28 4 38 12" fill="none" stroke={trim} strokeWidth="1.5" opacity="0.5" />
          <circle cx="60" cy="82" r="12" fill="#241a12" />
          <circle cx="60" cy="82" r="12" fill="none" stroke={trim} strokeWidth="2" />
          <circle cx="65" cy="82" r="1.7" fill={trim} />
          <circle cx="44" cy="74" r="3.4" fill={glow} opacity="0.85" />
          <path d="M34 99c0-4 2-7 6-7s6 3 6 7M78 99c0-4 2-7 6-7s6 3 6 7" fill="#3f5a3a" />
          <path d="M40 70c-4-2-6-5-6-8M80 70c4-2 6-5 6-8" stroke="#5f7d4d" strokeWidth="1.6" fill="none" />
        </>
      )}

      {kind === 'gable' && (
        <>
          <rect x="24" y="52" width="72" height="47" fill={wall} />
          <rect x="24" y="52" width="72" height="4" fill={trim} opacity="0.6" />
          <path d="M60 18 12 56h96z" fill={roof} />
          <path d="M60 24 22 56h76z" fill="#ffffff" opacity="0.08" />
          <rect x="52" y="74" width="16" height="25" rx="1.5" fill="#2f3b33" />
          <circle cx="64" cy="87" r="1.5" fill={glow} />
          <Windows glow={glow} coords={[[32, 62, 13, 12], [75, 62, 13, 12]]} />
          <Smoke x={84} y={22} />
        </>
      )}

      {kind === 'thatch' && (
        <>
          <rect x="26" y="56" width="68" height="43" fill={wall} />
          <rect x="26" y="56" width="68" height="3" fill={trim} opacity="0.7" />
          <path d="M18 58c4-24 24-38 42-38s38 14 42 38c-14-4-28-6-42-6s-28 2-42 6z" fill={roof} />
          <path d="M26 56c6-5 12-8 18-10M94 56c-6-5-12-8-18-10" stroke="#000000" strokeOpacity="0.15" strokeWidth="2" fill="none" />
          <rect x="52" y="76" width="16" height="23" rx="2" fill="#3a3128" />
          <circle cx="64" cy="88" r="1.5" fill={glow} />
          <Windows glow={glow} coords={[[34, 64, 12, 12], [74, 64, 12, 12]]} />
          <path d="M38 99h6M78 99h6" stroke={trim} strokeWidth="2" />
        </>
      )}

      {kind === 'manor' && (
        <>
          <rect x="20" y="46" width="80" height="53" fill={wall} />
          <rect x="20" y="46" width="80" height="4" fill={trim} opacity="0.6" />
          <path d="M60 14 10 50h100z" fill={roof} />
          <path d="M60 20 22 50h76z" fill="#ffffff" opacity="0.07" />
          <rect x="14" y="50" width="92" height="3" fill={trim} opacity="0.5" />
          <rect x="50" y="72" width="20" height="27" rx="2" fill="#333f36" />
          <circle cx="65" cy="86" r="1.6" fill={glow} />
          <Windows glow={glow} coords={[[28, 56, 14, 13], [78, 56, 14, 13], [28, 78, 14, 13], [78, 78, 14, 13]]} />
          <Smoke x={84} y={16} />
          <path d="M32 99v-4h10v4M78 99v-4h10v4" fill="#5f7d4d" />
        </>
      )}

      {kind === 'ice' && (
        <>
          <rect x="12" y="56" width="96" height="43" rx="2" fill={wall} />
          <path d="M12 56 26 34h68l14 22z" fill={roof} />
          <path d="M26 34 60 56l34-22M60 34v22" stroke={trim} strokeWidth="1.3" opacity="0.5" fill="none" />
          <rect x="54" y="76" width="16" height="23" rx="2" fill="#33505c" />
          <circle cx="66" cy="88" r="1.5" fill={glow} />
          <rect x="26" y="64" width="10" height="14" rx="1" fill={glow} opacity="0.9" />
          <rect x="86" y="64" width="10" height="14" rx="1" fill={glow} opacity="0.9" />
          <path d="M12 70h96" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
          <rect x="12" y="94" width="96" height="5" fill="#ffffff" opacity="0.12" />
        </>
      )}

      {kind === 'tower' && (
        <>
          <path d="M46 99V52h28v47z" fill={wall} />
          <path d="M42 52h36l-4-8H46z" fill={trim} opacity="0.9" />
          <rect x="50" y="26" width="20" height="20" fill={roof} />
          <rect x="54" y="30" width="12" height="12" rx="1" fill={glow} />
          <path d="M56 18h8v8h-8z" fill={roof} />
          <path d="M46 70h28M46 86h28" stroke={trim} strokeWidth="2" opacity="0.7" />
          <rect x="55" y="76" width="10" height="23" rx="4" fill="#3a4a40" />
          <circle cx="63" cy="88" r="1.3" fill={glow} />
          <path d="M76 36 96 30M76 44l20 6" stroke={glow} strokeWidth="2" opacity="0.45" />
          <path d="M30 99c6-4 12-4 16 0M74 99c4-4 10-4 16 0" fill="#4b6b4a" />
        </>
      )}
    </svg>
  );
}