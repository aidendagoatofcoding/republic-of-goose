// The small pieces every cottage in the Commons is built from: brickwork, flower boxes,
// door lanterns, garden paths and fences. Kept apart from the house itself so each stays
// small and readable.

// Lighten (positive) or darken (negative) a hex colour, so every house gets proper shading
// instead of flat blocks — the sun comes from the left of the meadow.
export function shade(hex, amount) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.replace(/./g, '$&$&') : clean, 16);
  const clamp = (value) => Math.max(0, Math.min(255, value));
  const r = clamp(((num >> 16) & 255) + amount);
  const g = clamp(((num >> 8) & 255) + amount);
  const b = clamp((num & 255) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// A proper brick chimney with a stone cap, and its smoke drifting off.
export function BrickChimney({ x, y, glow = '#f4d78d' }) {
  const rows = [0, 1, 2, 3, 4, 5];
  return (
    <g>
      <rect x={x} y={y} width="13" height="30" fill="#7d5647" stroke="#241a13" strokeWidth="1.1" />
      <g stroke="#3a2419" strokeOpacity="0.45" strokeWidth="0.9">
        {rows.map((row) => (
          <line key={`brow-${row}`} x1={x} y1={y + 5 + row * 5} x2={x + 13} y2={y + 5 + row * 5} />
        ))}
        <line x1={x + 6} y1={y} x2={x + 6} y2={y + 5} />
        <line x1={x + 3} y1={y + 10} x2={x + 3} y2={y + 15} />
        <line x1={x + 10} y1={y + 15} x2={x + 10} y2={y + 20} />
        <line x1={x + 4} y1={y + 20} x2={x + 4} y2={y + 25} />
      </g>
      <rect x={x - 2.5} y={y - 5} width="18" height="5.5" rx="1" fill="#93705d" stroke="#241a13" strokeWidth="1" />
      <rect x={x + 2} y={y - 7} width="9" height="2.4" rx="1" fill="#4b3b33" />
      <ellipse cx={x + 6.5} cy={y - 9} rx="4" ry="2" fill={glow} opacity="0.45" />
      {[0, 1.2, 2.4, 3.4].map((delay) => (
        <circle
          key={`puff-${delay}`}
          className="house-smoke"
          cx={x + 6.5}
          cy={y - 12}
          r={delay > 2 ? 3.6 : 3}
          fill="#dfe4dc"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </g>
  );
}

const BLOOMS = ['#e2707a', '#f0c46a', '#d8a4e0', '#f2f0d8'];

// A window box of flowers under a window.
export function FlowerBox({ x, y, w }) {
  const count = Math.max(3, Math.round(w / 4));
  return (
    <g>
      <rect x={x - 1.5} y={y} width={w + 3} height="5.5" rx="1" fill="#6a4a30" stroke="#2b1f15" strokeWidth="0.9" />
      <rect x={x - 1.5} y={y} width={w + 3} height="1.8" fill="#8b6543" />
      <g stroke="#3d5c31" strokeWidth="1.4" strokeLinecap="round">
        {Array.from({ length: count }, (_, i) => (
          <line key={`stem-${i}`} x1={x + 1 + (i * (w - 2)) / (count - 1 || 1)} y1={y} x2={x + 1 + (i * (w - 2)) / (count - 1 || 1)} y2={y - 3} />
        ))}
      </g>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={`bloom-${i}`}
          cx={x + 1 + (i * (w - 2)) / (count - 1 || 1)}
          cy={y - 4}
          r="2.1"
          fill={BLOOMS[i % BLOOMS.length]}
          stroke="#2b1f15"
          strokeWidth="0.5"
        />
      ))}
    </g>
  );
}

// The lamp hung beside the door, throwing a little warm light onto the step.
export function DoorLantern({ x, y, glow = '#f4d78d' }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 6} rx="13" ry="11" fill={glow} opacity="0.16" />
      <line x1={x} y1={y - 5} x2={x} y2={y - 1} stroke="#2b241c" strokeWidth="1.2" />
      <path d={`M${x - 4} ${y} h8 l1.5 3.5 -1.5 5.5 h-8 l-1.5 -5.5z`} fill={glow} stroke="#2b241c" strokeWidth="1" />
      <path d={`M${x - 5} ${y} h10 l-5 -3z`} fill="#4a3d2e" stroke="#2b241c" strokeWidth="0.9" />
      <rect x={x - 4.5} y={y + 9} width="9" height="1.8" rx="0.8" fill="#4a3d2e" />
    </g>
  );
}

// Flagstones leading away from the front door.
export function StonePath({ x = 62, y = 104 }) {
  return (
    <g fill="#8d8577" stroke="#4a4439" strokeWidth="0.8">
      <ellipse cx={x} cy={y} rx="9" ry="2.6" />
      <ellipse cx={x + 1} cy={y + 4} rx="7" ry="2.2" opacity="0.9" />
      <ellipse cx={x - 2} cy={y + 7.5} rx="5.4" ry="1.9" opacity="0.8" />
      <ellipse cx={x + 2} cy={y + 10} rx="4" ry="1.6" opacity="0.7" />
    </g>
  );
}

// A low picket fence hugging the front of the plot.
export function PicketFence({ y = 106, from = 14, to = 106 }) {
  const posts = Math.round((to - from) / 7);
  return (
    <g stroke="#6d5b45" strokeWidth="1.5" strokeLinecap="round">
      {Array.from({ length: posts }, (_, i) => {
        const px = from + (i * (to - from)) / (posts - 1 || 1);
        return <line key={`picket-${i}`} x1={px} y1={y - 5} x2={px} y2={y + 1} />;
      })}
      <line x1={from} y1={y - 3.4} x2={to} y2={y - 3.4} strokeWidth="1.1" strokeOpacity="0.85" />
      <line x1={from} y1={y - 0.6} x2={to} y2={y - 0.6} strokeWidth="1.1" strokeOpacity="0.85" />
    </g>
  );
}

// Rows of roof tiles that follow a gable's slope.
export function GableTiles({ roofDark, peak = 16, base = 58, half = 52 }) {
  const rows = [10, 18, 26, 34, 42];
  return (
    <g stroke={roofDark} strokeOpacity="0.4" strokeWidth="0.9">
      {rows.map((offset) => {
        const y = peak + offset;
        const spread = (offset / (base - peak)) * half;
        return <line key={`tile-${offset}`} x1={60 - spread} y1={y} x2={60 + spread} y2={y} />;
      })}
      <line x1="60" y1={peak} x2="60" y2={base} strokeOpacity="0.18" />
    </g>
  );
}