// Vehicles drawn rather than emoji'd: a real wheel, a real hull, a real runner.
// Pass `rolling` while a goose is riding, and the wheels turn and the body works.
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
const WOOD_DARK = '#4d3319';
const WOOD_LIGHT = '#c1955a';
const IRON = '#2b2f2c';
const IRON_LIGHT = '#5b625c';
const CANVAS = '#d7dfc8';
const CANVAS_DARK = '#a3b393';
const BRASS = '#e0b662';
const LAMP = '#ffe9a8';

function Wheel({ cx, cy, r = 9, spin = false }) {
  return (
    <g>
      {/* tyre and tread */}
      <circle cx={cx} cy={cy} r={r} fill={IRON} />
      <circle cx={cx} cy={cy} r={r - 0.8} fill="none" stroke="#151814" strokeWidth="1.4" />
      {/* the wooden felloe */}
      <circle cx={cx} cy={cy} r={r - 2.2} fill={WOOD_LIGHT} />
      <circle cx={cx} cy={cy} r={r - 2.2} fill="none" stroke={WOOD_DARK} strokeWidth="0.9" />
      <g
        className={spin ? 'wheel-spin' : undefined}
        style={spin ? { transformBox: 'fill-box', transformOrigin: 'center' } : undefined}
      >
        <g stroke={WOOD_DARK} strokeWidth="0.9">
          <line x1={cx - r + 2.6} y1={cy} x2={cx + r - 2.6} y2={cy} />
          <line x1={cx} y1={cy - r + 2.6} x2={cx} y2={cy + r - 2.6} />
          <line x1={cx - (r - 3.4)} y1={cy - (r - 3.4)} x2={cx + (r - 3.4)} y2={cy + (r - 3.4)} />
          <line x1={cx + (r - 3.4)} y1={cy - (r - 3.4)} x2={cx - (r - 3.4)} y2={cy + (r - 3.4)} />
        </g>
      </g>
      {/* hub cap */}
      <circle cx={cx} cy={cy} r="2.4" fill={BRASS} />
      <circle cx={cx} cy={cy} r="1" fill="#6b4f1f" />
    </g>
  );
}

function Shadow({ cx = 70, cy = 90, rx = 54, ry = 5 }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity="0.38" />;
}

function Cart({ rolling }) {
  return (
    <g>
      <Shadow cx={70} cy={84} rx={56} ry={5} />
      {/* the bed of the cart */}
      <rect x="30" y="46" width="72" height="20" rx="2.5" fill={WOOD} />
      <rect x="30" y="46" width="72" height="5.5" rx="2" fill={WOOD_LIGHT} />
      <rect x="30" y="61" width="72" height="4" fill={WOOD_DARK} opacity="0.55" />
      <g stroke={WOOD_DARK} strokeWidth="1">
        <line x1="46" y1="47" x2="46" y2="65" />
        <line x1="62" y1="47" x2="62" y2="65" />
        <line x1="78" y1="47" x2="78" y2="65" />
        <line x1="94" y1="47" x2="94" y2="65" />
      </g>
      {/* the shafts and the draw bar */}
      <path d="M100 52h16l6 7-6 7h-16z" fill={WOOD_LIGHT} stroke={WOOD_DARK} strokeWidth="1" />
      <path d="M28 52H14c-5 0-8 4-8 9s3 9 8 9" fill="none" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
      {/* the morning's loaves */}
      <g fill="#d9a95f" stroke="#8a6431" strokeWidth="0.9">
        <ellipse cx="46" cy="43" rx="8" ry="5" />
        <ellipse cx="64" cy="42" rx="9" ry="5.4" />
        <ellipse cx="84" cy="43" rx="8" ry="5" />
      </g>
      <g stroke="#a37a44" strokeWidth="0.7">
        <path d="M42 41l3 2M61 40l3 2M81 41l3 2" />
      </g>
      <Wheel cx="48" cy="70" spin={rolling} />
      <Wheel cx="88" cy="70" spin={rolling} />
    </g>
  );
}

function Wagon({ rolling }) {
  return (
    <g>
      <Shadow cx={68} cy={84} rx={58} ry={5} />
      {/* the canvas hood, with seams and a strap */}
      <path d="M28 60V44c0-12 12-20 30-20s30 8 30 20v16z" fill={CANVAS} stroke={CANVAS_DARK} strokeWidth="1.4" />
      <g stroke={CANVAS_DARK} strokeWidth="1">
        <path d="M40 26c-4 10-4 22-3 34M58 24c-1 12-1 24 0 36M76 26c4 10 4 22 3 34" fill="none" />
      </g>
      <path d="M28 42c26 6 54 6 80 0" fill="none" stroke={CANVAS_DARK} strokeWidth="1.6" />
      <path d="M32 34c22 5 48 5 72 0" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.35" />
      {/* the bed */}
      <rect x="22" y="58" width="80" height="14" rx="2.5" fill={WOOD} />
      <rect x="22" y="58" width="80" height="4" fill={WOOD_LIGHT} />
      <rect x="22" y="67" width="80" height="3" fill={WOOD_DARK} opacity="0.5" />
      <rect x="96" y="56" width="10" height="8" rx="2" fill={WOOD_LIGHT} />
      <path d="M20 60H8" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
      <Wheel cx="40" cy="75" spin={rolling} />
      <Wheel cx="86" cy="75" spin={rolling} />
    </g>
  );
}

function Scooter({ rolling }) {
  return (
    <g>
      <Shadow cx={66} cy={84} rx={50} ry={4.5} />
      {/* the frame */}
      <path d="M28 66h38c6 0 10-4 10-9l-4-14" fill="none" stroke={WOOD_DARK} strokeWidth="6" strokeLinecap="round" />
      <path d="M62 42h18" stroke={IRON} strokeWidth="4" strokeLinecap="round" />
      <path d="M80 42l6-18" stroke={IRON_LIGHT} strokeWidth="4" strokeLinecap="round" />
      <path d="M78 22h14" stroke={IRON} strokeWidth="4" strokeLinecap="round" />
      {/* the deck and the seat */}
      <rect x="26" y="58" width="34" height="8" rx="3" fill="#c2ff85" />
      <rect x="26" y="58" width="34" height="3" rx="1.5" fill="#e6ffc9" opacity="0.7" />
      <path d="M34 58c0-8 6-12 12-12" fill="none" stroke={WOOD} strokeWidth="3" />
      {/* the lamp */}
      <circle cx="88" cy="20" r="4" fill={LAMP} stroke={IRON} strokeWidth="1" />
      <path d="M92 20h8" stroke={LAMP} strokeWidth="2" opacity="0.35" />
      <Wheel cx="34" cy="74" r="8" spin={rolling} />
      <Wheel cx="86" cy="74" r="8" spin={rolling} />
    </g>
  );
}

function Boat({ rolling }) {
  return (
    <g>
      {/* the water it sits in */}
      <ellipse cx="70" cy="80" rx="56" ry="6" fill="#0d2b33" opacity="0.45" />
      <g stroke="#8fd6e4" strokeWidth="1.4" opacity="0.35" className={rolling ? 'water-drift' : undefined}>
        <line x1="18" y1="86" x2="48" y2="86" />
        <line x1="62" y1="90" x2="104" y2="90" />
      </g>
      {/* hull */}
      <path d="M14 54h112l-16 24H34z" fill={WOOD} />
      <path d="M14 54h112l-4 6H20z" fill={WOOD_LIGHT} />
      <path d="M34 66h74" stroke={WOOD_DARK} strokeWidth="2" />
      <path d="M30 70h78l-3 4H33z" fill={WOOD_DARK} opacity="0.55" />
      {/* thwart and a coil of rope */}
      <rect x="46" y="48" width="26" height="6" rx="2" fill={WOOD_LIGHT} stroke={WOOD_DARK} strokeWidth="0.8" />
      <g fill="none" stroke="#d9c69a" strokeWidth="1.4">
        <ellipse cx="92" cy="60" rx="8" ry="3.4" />
        <ellipse cx="92" cy="60" rx="4.5" ry="1.8" />
      </g>
      {/* oars shipped across the thwarts */}
      <path d="M26 56 8 44M112 56l18-12" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
      <path d="M8 44l-4-3 3-4 5 3z" fill={WOOD_LIGHT} stroke={WOOD_DARK} strokeWidth="0.8" />
      <path d="M130 44l4-3-3-4-5 3z" fill={WOOD_LIGHT} stroke={WOOD_DARK} strokeWidth="0.8" />
      <path d="M4 40l6 6M124 40l-6 6" stroke="#c2e8f2" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

function Skiff({ rolling }) {
  return (
    <g>
      <ellipse cx="70" cy="82" rx="58" ry="6" fill="#0d2b33" opacity="0.45" />
      <g stroke="#8ff2e0" strokeWidth="1.2" opacity="0.3">
        <line x1="10" y1="86" x2="52" y2="86" />
        <line x1="70" y1="90" x2="118" y2="90" />
      </g>
      {/* hull */}
      <path d="M12 58h116l-14 20H30z" fill={WOOD} />
      <path d="M12 58h116l-3 5H16z" fill={WOOD_LIGHT} />
      <path d="M30 72h80l-2 6H32z" fill={WOOD_DARK} opacity="0.5" />
      {/* cabin */}
      <path d="M40 52h44v6H40z" fill={WOOD_DARK} />
      <rect x="44" y="34" width="38" height="18" rx="3" fill={CANVAS} stroke={CANVAS_DARK} strokeWidth="1.2" />
      <rect x="52" y="38" width="10" height="9" rx="1.5" fill="#8ec8e0" />
      <path d="M54 38v9" stroke="#e8f6fb" strokeWidth="1" opacity="0.6" />
      {/* the funnel and its pennant */}
      <path d="M88 44h26" stroke={IRON_LIGHT} strokeWidth="3" strokeLinecap="round" />
      <path d="M114 44v10h-8" fill="none" stroke={IRON_LIGHT} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 30v-8h10l-3 3 3 3h-10" fill="#ff9ad5" stroke="#b3558f" strokeWidth="0.8" />
      <path d="M62 30v-8" stroke={IRON} strokeWidth="2" />
      {/* lamp at the bow */}
      <circle cx="122" cy="52" r="2.6" fill={LAMP} />
      {rolling && (
        <g stroke="#d8f6ff" strokeWidth="1.4" opacity="0.45" strokeLinecap="round">
          <line x1="6" y1="78" x2="30" y2="78" />
          <line x1="2" y1="86" x2="22" y2="86" />
        </g>
      )}
    </g>
  );
}

function Carriage({ rolling }) {
  return (
    <g>
      <Shadow cx={68} cy={84} rx={56} ry={5} />
      {/* the cabin with a curved roof */}
      <path d="M26 32h62c4 0 6 3 6 7v19H26z" fill="#3f515a" stroke="#1b262c" strokeWidth="1.4" />
      <path d="M24 30h66l-3-7H28z" fill="#203038" />
      <path d="M27 23h60" stroke={BRASS} strokeWidth="1.2" opacity="0.7" />
      <rect x="32" y="37" width="20" height="15" rx="2" fill="#a9d8e4" opacity="0.92" />
      <rect x="58" y="37" width="20" height="15" rx="2" fill="#a9d8e4" opacity="0.92" />
      <path d="M42 37v15M68 37v15" stroke="#6f8b95" strokeWidth="1.2" />
      <path d="M32 34h46" stroke="#8b9ea6" strokeWidth="1" opacity="0.6" />
      {/* the running board and step */}
      <rect x="20" y="58" width="74" height="6" rx="3" fill={WOOD_DARK} />
      <path d="M24 64h10v4H24z" fill={WOOD_LIGHT} />
      {/* driver's bench */}
      <path d="M94 56h18l6 6-6 6h-18z" fill={WOOD_LIGHT} stroke={WOOD_DARK} strokeWidth="1" />
      <g fill="none" stroke={BRASS} strokeWidth="1.4">
        <path d="M104 56v-8h6" />
      </g>
      <circle cx="112" cy="46" r="2.4" fill={LAMP} />
      <path d="M6 62h12" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
      <Wheel cx="34" cy="72" r="10" spin={rolling} />
      <Wheel cx="84" cy="72" r="10" spin={rolling} />
    </g>
  );
}

function Sleigh({ rolling }) {
  return (
    <g>
      <ellipse cx="66" cy="92" rx="50" ry="4.5" fill="#2b0f18" opacity="0.45" />
      {/* the runner, curled at the front */}
      <path
        d="M18 78c0 4 3 6 7 6h74c5 0 8-3 8-7 0-3-3-5-6-5"
        fill="none"
        stroke={IRON}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M18 78c0 4 3 6 7 6h74c5 0 8-3 8-7 0-3-3-5-6-5"
        fill="none"
        stroke={IRON_LIGHT}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path d="M30 84v-8M96 84v-8" stroke={WOOD_DARK} strokeWidth="3" />
      {/* the body */}
      <path d="M32 44h58c6 0 10 4 10 10v14H32z" fill="#a83a4a" stroke="#6d2230" strokeWidth="1.2" />
      <path d="M32 44h58c6 0 10 4 10 10H32z" fill="#c94f5f" />
      <path d="M40 50h30v8H40z" fill="#f3d9a0" opacity="0.35" />
      {/* brass rail along the back */}
      <path d="M36 44v-4h60v4" fill="none" stroke={BRASS} strokeWidth="1.6" />
      <path d="M96 46c10-4 16-2 20 4" fill="none" stroke={BRASS} strokeWidth="2.4" strokeLinecap="round" />
      {/* a lantern hanging off the rail */}
      <g className="sway">
        <path d="M100 30v6" stroke={IRON} strokeWidth="1.2" />
        <rect x="96" y="36" width="8" height="9" rx="1.6" fill={LAMP} stroke={IRON} strokeWidth="1" />
      </g>
      {/* the deer out front */}
      <g fill="#8a6a44" stroke="#5b4526" strokeWidth="0.9">
        <ellipse cx="112" cy="58" rx="11" ry="6" />
        <path d="M120 54c2-4 6-6 8-6-2 1-3 3-4 6z" />
        <path d="M116 50l2-7 3 4 3-3-1 6z" />
        <path d="M106 63v10M114 63v10" stroke="#5b4526" strokeWidth="2" />
        <circle cx="125" cy="49" r="0.9" fill="#1a1206" stroke="none" />
      </g>
      {rolling && (
        <g stroke="#e8f4ff" strokeWidth="1.2" opacity="0.5">
          <line x1="4" y1="70" x2="22" y2="70" />
          <line x1="2" y1="78" x2="16" y2="78" />
        </g>
      )}
    </g>
  );
}

function Balloon({ rolling }) {
  return (
    <g>
      <ellipse cx="70" cy="98" rx="26" ry="4" fill="#1a0f16" opacity="0.4" />
      {/* the envelope, panel by panel */}
      <path d="M70 6c-17 0-30 13-30 28 0 17 15 26 30 34 15-8 30-17 30-34 0-15-13-28-30-28z" fill="#ff9ad5" stroke="#a8507f" strokeWidth="1.3" />
      <path d="M70 6c-8 0-14 13-14 28 0 15 6 26 14 34 8-8 14-19 14-34 0-15-6-28-14-28z" fill="#8ff2e0" opacity="0.85" />
      <path d="M70 6c-4 0-7 13-7 28 0 15 3 26 7 34 4-8 7-19 7-34 0-15-3-28-7-28z" fill="#ffffff" opacity="0.25" />
      <path d="M48 28h44M44 42h52" stroke="#ffffff" strokeWidth="1.2" opacity="0.4" />
      <path d="M40 34c-6 10-6 22 0 32" fill="none" stroke="#a8507f" strokeWidth="1" opacity="0.6" />
      <path d="M100 34c6 10 6 22 0 32" fill="none" stroke="#a8507f" strokeWidth="1" opacity="0.6" />
      {/* the rigging and the basket */}
      <path d="M56 64l8 16M84 64l-8 16" stroke="#5b4526" strokeWidth="1.4" />
      <path d="M60 64l4 16M80 64l-4 16" stroke="#5b4526" strokeWidth="1" opacity="0.6" />
      <rect x="54" y="78" width="32" height="16" rx="3" fill={WOOD} stroke={WOOD_DARK} strokeWidth="1.2" />
      <path d="M54 82h32M54 88h32" stroke={WOOD_DARK} strokeWidth="1" />
      <rect x="54" y="78" width="32" height="3" rx="1.5" fill={WOOD_LIGHT} />
      {/* the sandbag */}
      <path d="M86 92c4 0 6 3 6 5s-2 4-6 4-6-2-6-4 2-5 6-5z" fill="#b9a37a" stroke="#7d6b45" strokeWidth="0.9" />
      {/* burner glow */}
      <ellipse cx="70" cy="70" rx="4" ry="6" fill={LAMP} opacity="0.85" />
      <path d="M100 22c6 2 10 6 12 10-4-1-8-1-12 1z" fill="#c2ff85" opacity="0.75" />
      {rolling && (
        <g stroke="#ffffff" strokeWidth="1" opacity="0.35">
          <line x1="14" y1="52" x2="32" y2="52" />
          <line x1="8" y1="62" x2="28" y2="62" />
        </g>
      )}
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

export default function VehicleSprite({ name, className = '', rolling = false }) {
  const Art = ART[kindFor(name)] || Cart;
  return (
    <span className={`block ${rolling ? 'vehicle-bob' : ''} ${className}`}>
      <svg viewBox="0 0 140 104" className="block h-auto w-full" role="presentation" aria-hidden="true">
        <Art rolling={rolling} />
      </svg>
    </span>
  );
}