// A goose-size sword, drawn rather than typed, so it can be longer than an emoji and swing properly.
const SIZES = {
  sm: 42,
  md: 62,
  lg: 84,
};

export default function Blade({ tier = 0, size = 'md', swing = '', angle = 0, dim = false }) {
  const height = typeof size === 'number' ? size : SIZES[size] || SIZES.md;
  const tint = SWORD_TINTS[tier] || SWORD_TINTS[0];
  const glow = Math.min(1, tier / 6);
  const animation = swing === 'slash' ? 'blade-swing-slash' : swing === 'stab' ? 'blade-swing-stab' : 'blade-idle';

  return (
    <span
      className={`relative block ${animation} ${dim ? 'opacity-80' : ''}`}
      style={{ height, width: height * 0.36, transform: `rotate(${angle}deg)`, transformOrigin: '50% 92%' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 120" className="h-full w-full" style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.65))` }}>
        <defs>
          <linearGradient id={`steel-${tier}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={tint.dark} />
            <stop offset="45%" stopColor={tint.light} />
            <stop offset="100%" stopColor={tint.dark} />
          </linearGradient>
        </defs>
        <path d="M20 4 L27 30 L25 84 L20 92 L15 84 L13 30 Z" fill={`url(#steel-${tier})`} stroke="#0a0f0a" strokeWidth="1.4" />
        <path d="M20 12 L20 84" stroke={tint.spine} strokeWidth="1.2" opacity="0.65" />
        <rect x="8" y="84" width="24" height="6" rx="2" fill={tint.guard} stroke="#0a0f0a" strokeWidth="1.2" />
        <rect x="17" y="90" width="6" height="16" rx="2.4" fill="#4a3a26" stroke="#0a0f0a" strokeWidth="1.2" />
        <circle cx="20" cy="109" r="4" fill={tint.gem} stroke="#0a0f0a" strokeWidth="1.2" />
        <circle cx="20" cy="90" r="2.4" fill={tint.gem} stroke="#0a0f0a" strokeWidth="1" />
      </svg>
      {glow > 0 && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${tint.gem}${glow > 0.6 ? '66' : '33'} 0%, transparent 62%)`,
            filter: 'blur(3px)',
          }}
        />
      )}
    </span>
  );
}

const SWORD_TINTS = [
  { light: '#b9c3b9', dark: '#6f7a6f', spine: '#e4ece4', guard: '#8a7040', gem: '#9aa89a' },
  { light: '#e0b47a', dark: '#a06f36', spine: '#ffe0b0', guard: '#8a7040', gem: '#c89a5a' },
  { light: '#eef4f8', dark: '#9aa9b2', spine: '#ffffff', guard: '#c8c8b0', gem: '#cfd8dd' },
  { light: '#ffe9a8', dark: '#c8a24a', spine: '#fff6d8', guard: '#a8863c', gem: '#f2c96b' },
  { light: '#e4ffd0', dark: '#7fc45a', spine: '#f2ffe0', guard: '#9ad07a', gem: '#c2ff85' },
  { light: '#dbf3ff', dark: '#6fa8c8', spine: '#ffffff', guard: '#8ec8e0', gem: '#9fe0ff' },
  { light: '#fff0cc', dark: '#c0a05c', spine: '#fffbe8', guard: '#c0a05c', gem: '#e8cf8a' },
  { light: '#ffffff', dark: '#c8d8c8', spine: '#ffffff', guard: '#e4ece4', gem: '#ffffff' },
  { light: '#a89ac8', dark: '#4a3f66', spine: '#c8bce0', guard: '#4a3f66', gem: '#8a7fb0' },
  { light: '#e8faff', dark: '#8fc8e0', spine: '#ffffff', guard: '#bfe9ff', gem: '#bfe9ff' },
  { light: '#ffd6a0', dark: '#c86a30', spine: '#ffe8c8', guard: '#a8562c', gem: '#ffb347' },
  { light: '#fff6d8', dark: '#d8b85a', spine: '#ffffff', guard: '#f2c96b', gem: '#ffe9a8' },
];