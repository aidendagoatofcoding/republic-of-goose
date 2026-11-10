const INK = '#221f19';

const SHADOW = <ellipse cx="32" cy="45" rx="13" ry="2.2" fill="#000" opacity="0.22" />;

const BODIES = {
  goose: () => (
    <>
      <path d="M26 37v7M36 37v7" stroke="#d99a35" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M23 44h6M33 44h6" stroke="#d99a35" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 32 6 28l3 5-4 3 10 1z" fill="#e7e4d7" stroke={INK} strokeWidth="1" />
      <ellipse cx="26" cy="33" rx="13" ry="8" fill="#f3f1e7" stroke={INK} strokeWidth="1.2" />
      <path d="M19 29c5-2 11-1 14 3-5 3-11 3-14-3z" fill="#e2dfd1" stroke={INK} strokeWidth="0.9" />
      <path d="M36 30c5-4 5-12 3-17l7-1c2 8 1 15-3 20z" fill="#f6f4ea" stroke={INK} strokeWidth="1.2" />
      <circle cx="44" cy="11.5" r="5" fill="#f8f6ed" stroke={INK} strokeWidth="1.2" />
      <path d="M48.6 10.2 57 13l-8.4 2.8z" fill="#d99a35" stroke={INK} strokeWidth="0.8" />
      <circle cx="45.8" cy="9.6" r="1.05" fill={INK} />
    </>
  ),
  fox: () => (
    <>
      <path d="M23 36v9M27 36v9M36 36v9M40 36v9" stroke="#7a3b18" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M18 33C8 34 1 28 4 19c4 5 8 7 14 8z" fill="#d9773f" stroke={INK} strokeWidth="1.1" />
      <circle cx="5" cy="20" r="3.4" fill="#f5efe2" />
      <ellipse cx="28" cy="32" rx="14" ry="8.4" fill="#d9773f" stroke={INK} strokeWidth="1.2" />
      <path d="M27 39c5 1 9-1 11-4" fill="none" stroke="#f5efe2" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 28c4-3 6-5 8-6" stroke="#d9773f" strokeWidth="8" strokeLinecap="round" />
      <circle cx="45" cy="19" r="7" fill="#e08a4e" stroke={INK} strokeWidth="1.2" />
      <path d="M40 13 38 6l7 4zM50 13l3-7-7 4z" fill="#d9773f" stroke={INK} strokeWidth="1" />
      <path d="M50 20 58 22l-8 2.8z" fill="#f5efe2" stroke={INK} strokeWidth="0.9" />
      <circle cx="56.4" cy="22" r="1" fill={INK} />
      <circle cx="47" cy="18" r="1.2" fill={INK} />
    </>
  ),
  squirrel: () => (
    <>
      <path d="M22 33C6 33 1 18 10 7c5 9 7 15 13 20z" fill="#a5713f" stroke={INK} strokeWidth="1.1" />
      <path d="M22 34c1 4 3 6 4 10M31 34c0 4 2 6 3 9" stroke="#8a5a30" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="30" cy="32" rx="11.5" ry="7.6" fill="#b47c45" stroke={INK} strokeWidth="1.2" />
      <ellipse cx="31" cy="34.5" rx="7" ry="4.2" fill="#e6d2b6" />
      <circle cx="41" cy="24" r="5.6" fill="#bd8449" stroke={INK} strokeWidth="1.2" />
      <path d="M38 19l1-5 4 4z" fill="#a5713f" stroke={INK} strokeWidth="1" />
      <circle cx="43" cy="23" r="1.1" fill={INK} />
      <circle cx="45.6" cy="26" r="1" fill="#3a2d22" />
      <path d="M24 40h4M32 40h4" stroke="#8a5a30" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  turtle: () => (
    <>
      <path d="M17 38v6M24 39v5M44 39v5M51 38v6" stroke="#6e8b52" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 38 6 35l4 5z" fill="#6e8b52" stroke={INK} strokeWidth="0.9" />
      <path d="M12 35c0-12 9-19 20-19s20 7 20 19z" fill="#5f7a45" stroke={INK} strokeWidth="1.3" />
      <path d="M20 34c0-8 5-13 12-13s12 5 12 13" fill="none" stroke="#7d9a5e" strokeWidth="1.4" />
      <path d="M32 21v13M20 34h24" stroke="#4c6538" strokeWidth="1.2" />
      <ellipse cx="54" cy="33" rx="6" ry="4.4" fill="#86a05c" stroke={INK} strokeWidth="1.1" />
      <circle cx="56" cy="31.5" r="1" fill={INK} />
    </>
  ),
  anteater: () => (
    <>
      <path d="M17 31C5 35 0 24 5 13c5 8 8 12 14 13z" fill="#8a6642" stroke={INK} strokeWidth="1.1" />
      <path d="M23 36v9M27 36v9M35 36v9M39 36v9" stroke="#5f452c" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="28" cy="31" rx="13" ry="8.4" fill="#b79468" stroke={INK} strokeWidth="1.2" />
      <path d="M24 24c3 6 3 10 1 14" stroke="#4a3623" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="26" r="5.4" fill="#c2a075" stroke={INK} strokeWidth="1.2" />
      <path d="M45 23 58 29l-13 2z" fill="#cdae82" stroke={INK} strokeWidth="1" />
      <circle cx="56.6" cy="29.4" r="1" fill={INK} />
      <circle cx="43" cy="24.5" r="1.05" fill={INK} />
      <path d="M39 21l-1-4 4 3z" fill="#b79468" stroke={INK} strokeWidth="0.9" />
    </>
  ),
  hummingbird: () => (
    <>
      <path d="M33 25C24 15 30 5 40 9c1 7-2 13-7 16z" fill="#3d8f7e" stroke={INK} strokeWidth="1.1" />
      <ellipse cx="33" cy="28" rx="10.5" ry="6" fill="#2f7f6b" stroke={INK} strokeWidth="1.2" transform="rotate(-18 33 28)" />
      <path d="M26 32c-5 2-9 1-12-2 3-1 5-1 7-1z" fill="#256a59" stroke={INK} strokeWidth="0.9" />
      <circle cx="43" cy="22" r="4.6" fill="#38917c" stroke={INK} strokeWidth="1.2" />
      <path d="M31 30c3 2 6 2 8 0" stroke="#c8457a" strokeWidth="3" strokeLinecap="round" />
      <path d="M47 21 60 24" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="45" cy="20.5" r="1" fill={INK} />
    </>
  ),
  redpanda: () => (
    <>
      {/* the ringed tail, carried behind */}
      <path d="M21 33C8 34 1 26 5 15c4 6 8 9 14 10z" fill="#b4552b" stroke={INK} strokeWidth="1.1" />
      <path d="M9 24c3 2 6 3 8 3M13 17c2 2 4 3 7 4" stroke="#f2dcbe" strokeWidth="1.7" strokeLinecap="round" />
      {/* dark legs */}
      <path d="M24 36v8M29 36v8M37 36v8M41 36v8" stroke="#3b2a20" strokeWidth="2.6" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="30" cy="32" rx="13.5" ry="8" fill="#c9612e" stroke={INK} strokeWidth="1.2" />
      <path d="M20 34c6 3 14 3 20 0-5 4-15 4-20 0z" fill="#3b2a20" opacity="0.55" />
      {/* neck and head */}
      <path d="M35 28c4-3 6-6 8-7" stroke="#c9612e" strokeWidth="9" strokeLinecap="round" />
      <circle cx="45" cy="19" r="6.6" fill="#d06a33" stroke={INK} strokeWidth="1.2" />
      <path d="M40 12.5 39 5.5l6 4zM50 12.5 53.5 5.5l-6 3.8z" fill="#b4552b" stroke={INK} strokeWidth="1" />
      {/* pale face with the tear marks */}
      <ellipse cx="45" cy="20.4" rx="4.8" ry="4" fill="#f7efe0" />
      <path d="M41.4 19.4c-.8 2-1.8 3.2-2.8 3.8M48.6 19.4c.8 2 1.8 3.2 2.8 3.8" stroke="#8c3f1c" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="43" cy="18.2" r="1.05" fill={INK} />
      <circle cx="47.4" cy="18.2" r="1.05" fill={INK} />
      <circle cx="45.2" cy="22" r="0.9" fill="#3b2a20" />
    </>
  ),
  marlin: () => (
    <>
      <path d="M12 27 3 19l3 8-3 8z" fill="#2f6b8a" stroke={INK} strokeWidth="1.1" />
      <path d="M24 21c5-9 15-9 19-1z" fill="#3f8bb0" stroke={INK} strokeWidth="1.1" />
      <path d="M12 27c8-9 26-9 34 0-8 9-26 9-34 0z" fill="#3f7c9c" stroke={INK} strokeWidth="1.3" />
      <path d="M16 31c8 4 20 4 27 0-8 3-20 3-27 0z" fill="#cfe4ee" opacity="0.85" />
      <path d="M46 27 63 29l-17 2z" fill="#2f6b8a" stroke={INK} strokeWidth="1" />
      <path d="M28 32c0 4 2 6 4 8-4-1-7-4-8-8z" fill="#3f8bb0" stroke={INK} strokeWidth="1" />
      <circle cx="40" cy="25" r="1.4" fill="#f6f6ec" stroke={INK} strokeWidth="0.6" />
    </>
  ),
};

export default function AnimalSprite({ species = 'goose', worn = [], className = '' }) {
  const body = (BODIES[species] || BODIES.goose)();
  const items = (worn || []).filter(Boolean).slice(0, 3);

  return (
    <span className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 64 48" className="block h-[46px] w-[62px]" aria-hidden="true">
        {SHADOW}
        {body}
      </svg>
      {items.length > 0 && (
        <span className="pointer-events-none absolute -top-1.5 left-1/2 flex -translate-x-1/2 gap-0.5 text-[10px] leading-none">
          {items.map((emoji, index) => (
            <span key={`${emoji}-${index}`} aria-hidden="true">
              {emoji}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}