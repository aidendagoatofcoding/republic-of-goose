// Vehicles drawn rather than emoji'd: a real wheel, a real hull, a real runner.
const KINDS = [
  ['balloon', 'balloon'],
  ['skiff', 'skiff'],
  ['ferry', 'skiff'],
  ['sleigh', 'sleigh'],
  ['reindeer', 'sleigh'],
  ['carriage', 'carriage'],
  ['coach', 'carriage'],
  ['scooter', 'scooter'],
  ['wagon', 'wagon'],
  ['boat', 'boat'],
  ['pond boat', 'boat'],
  ['cart', 'cart'],
];

const kindFor = (name) => {
  const clean = String(name || '').toLowerCase();
  const hit = KINDS.find(([word]) => clean.includes(word));
  return hit ? hit[1] : 'cart';
};

const WOOD = '#8b6134';
const WOOD_DARK = '#5b3d1f';
const WOOD_LIGHT = '#b98a4e';
const IRON = '#2f3330';
const CANVAS = '#cfd8c0';
const CANVAS_DARK = '#a9b79a';

function Wheel({ cx, cy, r = 9 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={IRON} />
      <circle cx={cx} cy={cy} r={r - 2.6} fill={WOOD_LIGHT} />
      <circle cx={cx} cy={cy} r={r - 2.6} fill="none" stroke={WOOD_DARK} strokeWidth="0.9" />
      <g stroke={WOOD_DARK} strokeWidth="0.9">
        <line x1={cx - r + 2.6} y1={cy} x2={cx + r - 2.6} y2={cy} />
        <line x1={cx} y1={cy - r + 2.6} x2={cx} y2={cy + r - 2.6} />
        <line x1={cx - (r - 3.4)} y1={cy - (r - 3.4)} x2={cx + (r - 3.4)} y2={cy + (r - 3.4)} />
        <line x1={cx + (r - 3.4)} y1={cy - (r - 3.4)} x2={cx - (r - 3.4)} y2={cy + (r - 3.4)} />
      </g>
      <circle cx={cx} cy={cy} r="2" fill={IRON} />
    </g>
  );
}

function Cart() {
  return (
    <g>
      <rect x="30" y="46" width="72" height="20" rx="2" fill={WOOD} />
      <rect x="30" y="46" width="72" height="5" rx="2" fill={WOOD_LIGHT} />
      <g stroke={WOOD_DARK} strokeWidth="1">
        <line x1="46" y1="47" x2="46" y2="65" />
        <line x1="62" y1="47" x2="62" y2="65" />
        <line x1="78" y1="47" x2="78" y2="65" />
        <line x1="94" y1="47" x2="94" y2="65" />
      </g>
      <path d="M100 52h16l6 7-6 7h-16z" fill={WOOD_LIGHT} stroke={WOOD_DARK} strokeWidth="1" />
      <path d="M28 52H14c-5 0-8 4-8 9s3 9 8 9" fill="none" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
      {/* the morning's loaves */}
      <g fill="#d9a95f" stroke="#8a6431" strokeWidth="0.9">
        <ellipse cx="46" cy="43" rx="8" ry="5" />
        <ellipse cx="64" cy="42" rx="9" ry="5.4" />
        <ellipse cx="84" cy="43" rx="8" ry="5" />
      </g>
      <Wheel cx="48" cy="70" />
      <Wheel cx="88" cy="70" />
    </g>
  );
}

function Wagon() {
  return (
    <g>
      <path d="M28 60V44c0-12 12-20 30-20s30 8 30 20v16z" fill={CANVAS} stroke={CANVAS_DARK} strokeWidth="1.4" />
      <g stroke={CANVAS_DARK} strokeWidth="1">
        <path d="M40 26c-4 10-4 22-3 34M58 24c-1 12-1 24 0 36M76 26c4 10 4 22 3 34" fill="none" />
      </g>
      <rect x="22" y="58" width="80" height="14" rx="2" fill={WOOD} />
      <rect x="22" y="58" width="80" height="4" fill={WOOD_LIGHT} />
      <rect x="96" y="56" width="10" height="8" rx="2" fill={WOOD_LIGHT} />
      <path d="M20 60H8" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
      <Wheel cx="40" cy="75" />
      <Wheel cx="86" cy="75" />
    </g>
  );
}

function Scooter() {
  return (
    <g>
      <path d="M28 66h38c6 0 10-4 10-9l-4-14" fill="none" stroke={WOOD_DARK} strokeWidth="6" strokeLinecap="round" />
      <path d="M62 42h18" stroke={IRON} strokeWidth="4" strokeLinecap="round" />
      <path d="M80 42l6-18" stroke={IRON} strokeWidth="4" strokeLinecap="round" />
      <path d="M78 22h14" stroke={IRON} strokeWidth="4" strokeLinecap="round" />
      <rect x="26" y="58" width="34" height="8" rx="3" fill="#c2ff85" />
      <circle cx="88" cy="20" r="4" fill="#ffe9a8" stroke={IRON} strokeWidth="1" />
      <path d="M34 58c0-8 6-12 12-12" fill="none" stroke={WOOD} strokeWidth="3" />
      <Wheel cx="34" cy="74" r="8" />
      <Wheel cx="86" cy="74" r="8" />
    </g>
  );
}

function Boat() {
  return (
    <g>
      <path d="M14 54h112l-16 24H34z" fill={WOOD} />
      <path d="M14 54h112l-4 6H20z" fill={WOOD_LIGHT} />
      <path d="M34 66h74" stroke={WOOD_DARK} strokeWidth="2" />
      <rect x="46" y="48" width="26" height="6" rx="2" fill={WOOD_LIGHT} stroke={WOOD_DARK} strokeWidth="0.8" />
      <path d="M26 56 8 44M112 56l18-12" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
      <path d="M4 40l6 6M124 40l-6 6" stroke="#c2e8f2" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="70" cy="80" rx="52" ry="5" fill="#0d2b33" opacity="0.35" />
    </g>
  );
}

function Skiff() {
  return (
    <g>
      <path d="M12 58h116l-14 20H30z" fill={WOOD} />
      <path d="M12 58h116l-3 5H16z" fill={WOOD_LIGHT} />
      <path d="M40 52h44v6H40z" fill={WOOD_DARK} />
      <rect x="44" y="36" width="38" height="16" rx="3" fill={CANVAS} stroke={CANVAS_DARK} strokeWidth="1.2" />
      <rect x="52" y="40" width="10" height="8" rx="1.5" fill="#8ec8e0" />
      <path d="M88 44h26" stroke={IRON} strokeWidth="3" strokeLinecap="round" />
      <path d="M114 44v10h-8" fill="none" stroke={IRON} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 30v-8h10l-3 3 3 3h-10" fill="#ff9ad5" stroke="#b3558f" strokeWidth="0.8" />
      <path d="M62 30v-8" stroke={IRON} strokeWidth="2" />
      <ellipse cx="70" cy="82" rx="54" ry="5" fill="#0d2b33" opacity="0.35" />
    </g>
  );
}

function Carriage() {
  return (
    <g>
      <rect x="26" y="30" width="62" height="30" rx="4" fill="#3a4a52" stroke="#1f2b31" strokeWidth="1.4" />
      <rect x="32" y="36" width="20" height="16" rx="2" fill="#a9d8e4" opacity="0.9" />
      <rect x="58" y="36" width="20" height="16" rx="2" fill="#a9d8e4" opacity="0.9" />
      <path d="M24 30h66l-4-6H28z" fill="#203038" />
      <rect x="20" y="58" width="74" height="6" rx="3" fill={WOOD_DARK} />
      <path d="M94 56h18l6 6-6 6h-18z" fill={WOOD_LIGHT} stroke={WOOD_DARK} strokeWidth="1" />
      <Wheel cx="34" cy="72" r="10" />
      <Wheel cx="84" cy="72" r="10" />
      <path d="M6 62h12" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Sleigh() {
  return (
    <g>
      {/* the runner, curled at the front */}
      <path
        d="M18 78c0 4 3 6 7 6h74c5 0 8-3 8-7 0-3-3-5-6-5"
        fill="none"
        stroke={IRON}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M30 84v-8M96 84v-8" stroke={WOOD_DARK} strokeWidth="3" />
      <path d="M32 44h58c6 0 10 4 10 10v14H32z" fill="#a83a4a" stroke="#6d2230" strokeWidth="1.2" />
      <path d="M32 44h58c6 0 10 4 10 10H32z" fill="#c94f5f" />
      <path d="M40 50h30v8H40z" fill="#f3d9a0" opacity="0.35" />
      <path d="M96 46c10-4 16-2 20 4" fill="none" stroke="#c9a45f" strokeWidth="2.4" strokeLinecap="round" />
      {/* the deer out front */}
      <g fill="#8a6a44" stroke="#5b4526" strokeWidth="0.9">
        <ellipse cx="112" cy="58" rx="11" ry="6" />
        <path d="M120 54c2-4 6-6 8-6-2 1-3 3-4 6z" />
        <path d="M116 50l2-7 3 4 3-3-1 6z" />
        <path d="M106 63v10M114 63v10" stroke="#5b4526" strokeWidth="2" />
      </g>
      <ellipse cx="66" cy="92" rx="46" ry="4" fill="#2b0f18" opacity="0.4" />
    </g>
  );
}

function Balloon() {
  return (
    <g>
      <path d="M70 8c-16 0-28 12-28 26 0 16 14 24 28 32 14-8 28-16 28-32 0-14-12-26-28-26z" fill="#ff9ad5" stroke="#a8507f" strokeWidth="1.3" />
      <path d="M70 8c-7 0-12 12-12 26 0 14 5 24 12 32 7-8 12-18 12-32 0-14-5-26-12-26z" fill="#8ff2e0" opacity="0.85" />
      <path d="M50 30h40M46 44h48" stroke="#ffffff" strokeWidth="1.4" opacity="0.35" />
      <path d="M56 64l8 16M84 64l-8 16" stroke="#5b4526" strokeWidth="1.4" />
      <rect x="58" y="78" width="24" height="16" rx="3" fill={WOOD} stroke={WOOD_DARK} strokeWidth="1.2" />
      <path d="M58 82h24M58 88h24" stroke={WOOD_DARK} strokeWidth="1" />
      <path d="M100 22c6 2 10 6 12 10-4-1-8-1-12 1z" fill="#c2ff85" opacity="0.75" />
    </g>
  );
}

const ART = {
  cart: Cart,
  wagon: Wagon,
  scooter: Scooter,
  boat: Boat,
  skiff: Skiff,
  carriage: Carriage,
  sleigh: Sleigh,
  balloon: Balloon,
};

export default function VehicleSprite({ name, className = '' }) {
  const Art = ART[kindFor(name)] || Cart;
  return (
    <svg viewBox="0 0 140 104" className={className} role="presentation" aria-hidden="true">
      <Art />
    </svg>
  );
}