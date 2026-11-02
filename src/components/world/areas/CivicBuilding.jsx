import { Link } from 'react-router-dom';

const STONE = '#5b5140';
const LIGHT = '#7a6a4e';
const INK = '#241a11';
const GLASS = '#f2c96b';

function Building({ variant }) {
  if (variant === 'capital') {
    return (
      <>
        <rect x="6" y="46" width="68" height="14" fill={STONE} stroke={INK} />
        <rect x="14" y="38" width="52" height="9" fill={LIGHT} stroke={INK} />
        <rect x="20" y="24" width="40" height="14" fill={LIGHT} stroke={INK} />
        <path d="M18 24 40 12 62 24Z" fill="#8b7a58" stroke={INK} />
        <circle cx="40" cy="19" r="2.6" fill={GLASS} />
        <g stroke={INK} strokeWidth="1.2">
          <path d="M26 30v8M34 30v8M46 30v8M54 30v8" />
        </g>
        <rect x="36" y="42" width="8" height="13" fill={GLASS} fillOpacity="0.55" />
      </>
    );
  }

  if (variant === 'temple') {
    return (
      <>
        <rect x="8" y="46" width="64" height="14" fill={STONE} stroke={INK} />
        <rect x="14" y="36" width="52" height="11" fill={LIGHT} stroke={INK} />
        <path d="M12 36 40 22 68 36Z" fill="#867554" stroke={INK} />
        <g stroke={INK} strokeWidth="1.6">
          <path d="M22 40v18M32 40v18M40 40v18M48 40v18M58 40v18" />
        </g>
        <rect x="36" y="48" width="8" height="12" fill={GLASS} fillOpacity="0.45" />
      </>
    );
  }

  if (variant === 'bank') {
    return (
      <>
        <rect x="8" y="46" width="64" height="14" fill={STONE} stroke={INK} />
        <rect x="12" y="26" width="56" height="20" fill={LIGHT} stroke={INK} />
        <path d="M10 26 40 14 70 26Z" fill="#867554" stroke={INK} />
        <circle cx="40" cy="36" r="7" fill={INK} />
        <circle cx="40" cy="36" r="4" fill={GLASS} fillOpacity="0.7" />
        <g stroke={INK} strokeWidth="1.2">
          <path d="M22 30v12M28 30v12M52 30v12M58 30v12" />
        </g>
      </>
    );
  }

  if (variant === 'tower') {
    return (
      <>
        <rect x="16" y="44" width="48" height="16" fill={STONE} stroke={INK} />
        <rect x="28" y="18" width="24" height="26" fill={LIGHT} stroke={INK} />
        <path d="M24 18 40 6 56 18Z" fill="#8b7a58" stroke={INK} />
        <path d="M40 6V0" stroke={INK} strokeWidth="1.6" />
        <path d="M40 1h10l-3 3 3 3H40Z" fill={GLASS} />
        <rect x="34" y="24" width="4" height="5" fill={GLASS} fillOpacity="0.7" />
        <rect x="42" y="24" width="4" height="5" fill={GLASS} fillOpacity="0.7" />
        <rect x="37" y="48" width="6" height="12" fill={GLASS} fillOpacity="0.45" />
      </>
    );
  }

  return (
    <>
      <rect x="20" y="40" width="40" height="20" fill={STONE} stroke={INK} />
      <path d="M16 40 40 22 64 40Z" fill="#7d4a3a" stroke={INK} />
      <rect x="36" y="46" width="9" height="14" fill={GLASS} fillOpacity="0.5" />
      <rect x="26" y="44" width="7" height="7" fill={GLASS} fillOpacity="0.35" />
    </>
  );
}

export default function CivicBuilding({ building }) {
  return (
    <Link
      to={building.to}
      title={`${building.name} — visit`}
      style={{ left: `${building.x}%`, top: `${building.y}%` }}
      className="group absolute z-10 -translate-x-1/2 -translate-y-[94%] text-center"
    >
      <svg
        viewBox="0 0 80 60"
        className="mx-auto w-[62px] drop-shadow-[0_10px_14px_rgba(0,0,0,0.5)] sm:w-[76px]"
        aria-hidden="true"
      >
        <Building variant={building.variant} />
      </svg>
      <span className="mt-0.5 block whitespace-nowrap rounded-sm border border-border/70 bg-card/85 px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.14em] text-foreground/75 group-hover:border-primary/60 group-hover:text-primary">
        {building.name}
      </span>
    </Link>
  );
}