import { useId } from 'react';

// Every piece of furniture in the Republic is drawn, not lettered: real timber, real cloth,
// real flame. Each drawing is its own little painting, sized by the home it stands in.

function Defs({ uid }) {
  return (
    <defs>
      <linearGradient id={`${uid}-oak`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a9793f" />
        <stop offset="45%" stopColor="#8a5f2e" />
        <stop offset="100%" stopColor="#6b4620" />
      </linearGradient>
      <linearGradient id={`${uid}-oakDark`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7d5527" />
        <stop offset="100%" stopColor="#4e3315" />
      </linearGradient>
      <linearGradient id={`${uid}-stone`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b9b3a4" />
        <stop offset="100%" stopColor="#7a7364" />
      </linearGradient>
      <linearGradient id={`${uid}-clay`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c97a4d" />
        <stop offset="55%" stopColor="#a75f38" />
        <stop offset="100%" stopColor="#7f4526" />
      </linearGradient>
      <linearGradient id={`${uid}-cloth`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbf7ee" />
        <stop offset="60%" stopColor="#eee7d8" />
        <stop offset="100%" stopColor="#d8ceba" />
      </linearGradient>
      <linearGradient id={`${uid}-straw`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8cf8a" />
        <stop offset="60%" stopColor="#cfae63" />
        <stop offset="100%" stopColor="#a8873f" />
      </linearGradient>
      <radialGradient id={`${uid}-fire`} cx="50%" cy="88%" r="62%">
        <stop offset="0%" stopColor="#fff3c4" />
        <stop offset="38%" stopColor="#ffc463" />
        <stop offset="72%" stopColor="#f07a2a" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#c2380f" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function Rug({ uid }) {
  return (
    <svg viewBox="0 0 170 96" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="85" cy="62" rx="78" ry="26" fill="#000000" opacity="0.22" />
      <g>
        <rect x="8" y="14" width="154" height="66" rx="10" fill="#8c3f36" />
        <rect x="8" y="14" width="154" height="66" rx="10" fill="none" stroke="#5e2620" strokeWidth="2" />
        <rect x="17" y="22" width="136" height="50" rx="6" fill="#b2554a" />
        <rect x="17" y="22" width="136" height="50" rx="6" fill="none" stroke="#f0dcb4" strokeWidth="1.6" strokeOpacity="0.8" />
        <g stroke="#f0dcb4" strokeOpacity="0.75" strokeWidth="1.2" fill="none">
          <path d="M35 47l10-9 10 9-10 9z" />
          <path d="M65 47l10-9 10 9-10 9z" />
          <path d="M95 47l10-9 10 9-10 9z" />
          <path d="M125 47l10-9 10 9-10 9z" />
        </g>
        <g stroke="#5e2620" strokeOpacity="0.35" strokeWidth="1">
          <path d="M17 32h136M17 62h136" />
        </g>
        <g stroke="#e8d3ae" strokeWidth="1.4">
          <path d="M10 16l-4-5M18 14l-2-6M26 13l-1-6M152 13l1-6M160 14l2-6M166 16l4-5" />
          <path d="M10 78l-4 5M18 80l-2 6M152 80l1 6M160 79l2 6" />
        </g>
      </g>
    </svg>
  );
}

function Fern({ uid }) {
  return (
    <svg viewBox="0 0 110 140" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="55" cy="130" rx="26" ry="6" fill="#000000" opacity="0.22" />
      <path d="M55 118c-14-2-22-10-26-22" stroke="#3f6b3a" strokeWidth="2" fill="none" />
      <g stroke="#2f6b37" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M55 96c-2-22-14-38-30-46" />
        <path d="M55 96c0-26 2-44 12-58" />
        <path d="M55 96c6-20 22-32 36-38" />
        <path d="M55 96c-8-14-24-20-36-20" />
        <path d="M55 96c10-12 26-14 38-10" />
      </g>
      <g fill="#3f8c45">
        <ellipse cx="30" cy="60" rx="8" ry="3.4" transform="rotate(-32 30 60)" />
        <ellipse cx="34" cy="72" rx="8" ry="3.4" transform="rotate(-24 34 72)" />
        <ellipse cx="26" cy="48" rx="7" ry="3" transform="rotate(-40 26 48)" />
        <ellipse cx="64" cy="44" rx="8" ry="3.4" transform="rotate(70 64 44)" />
        <ellipse cx="62" cy="60" rx="8" ry="3.4" transform="rotate(76 62 60)" />
        <ellipse cx="88" cy="62" rx="8" ry="3.4" transform="rotate(18 88 62)" />
        <ellipse cx="80" cy="74" rx="8" ry="3.4" transform="rotate(26 80 74)" />
        <ellipse cx="26" cy="80" rx="8" ry="3.4" transform="rotate(-8 26 80)" />
        <ellipse cx="86" cy="84" rx="8" ry="3.4" transform="rotate(8 86 84)" />
      </g>
      <g fill="#57a95c" opacity="0.9">
        <ellipse cx="36" cy="55" rx="5.4" ry="2.4" transform="rotate(-32 36 55)" />
        <ellipse cx="68" cy="52" rx="5.4" ry="2.4" transform="rotate(72 68 52)" />
        <ellipse cx="82" cy="68" rx="5.4" ry="2.4" transform="rotate(22 82 68)" />
      </g>
      <path d="M33 96h44l-7 30a5 5 0 0 1-5 4H45a5 5 0 0 1-5-4z" fill={`url(#${uid}-clay)`} />
      <path d="M33 96h44l-2 9H35z" fill="#d98a5a" opacity="0.55" />
      <ellipse cx="55" cy="96" rx="22" ry="4.4" fill="#5b3a1c" />
      <ellipse cx="55" cy="95" rx="22" ry="4" fill="none" stroke="#e0a06e" strokeWidth="1.6" />
      <g stroke="#8a4a24" strokeOpacity="0.4" strokeWidth="1.4">
        <path d="M40 110h30M42 118h26" />
      </g>
    </svg>
  );
}

function Fireplace({ uid }) {
  return (
    <svg viewBox="0 0 180 170" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="90" cy="162" rx="82" ry="9" fill="#000000" opacity="0.25" />
      <rect x="12" y="34" width="156" height="126" rx="4" fill={`url(#${uid}-stone)`} />
      <g stroke="#645e51" strokeOpacity="0.55" strokeWidth="1.4" fill="none">
        <path d="M12 56h156M12 80h34M56 80h62M128 80h40M12 104h48M70 104h40M120 104h48M12 128h30M52 128h72M134 128h34" />
        <path d="M46 34v22M104 34v22M150 34v22M34 80v24M96 80v24M140 80v24M46 104v24M104 104v24M146 104v24M30 128v32M80 128v32M128 128v32" />
      </g>
      <rect x="34" y="60" width="112" height="100" rx="3" fill="#3b2b1e" stroke="#2a1d13" strokeWidth="2" />
      <path d="M46 158V96a44 44 0 0 1 88 0v62z" fill="#140d08" />
      <path d="M52 156V98a38 38 0 0 1 76 0v58z" fill="#20140c" />
      <ellipse cx="90" cy="150" rx="34" ry="20" fill={`url(#${uid}-fire)`} opacity="0.9" />
      <g stroke="#5b3a20" strokeWidth="6" strokeLinecap="round">
        <path d="M68 150l44 8" />
        <path d="M112 148l-42 10" />
      </g>
      <path d="M90 122c6 10 2 16 0 22-4-6-8-10-6-16 1-4 4-6 6-6z" fill="#ffd67a" opacity="0.95" />
      <path d="M82 134c3 6 1 10 0 14-3-4-5-7-4-11 1-2 2-3 4-3z" fill="#ffe9b5" opacity="0.85" />
      <rect x="6" y="26" width="168" height="12" rx="3" fill={`url(#${uid}-oakDark)`} stroke="#3d2611" strokeWidth="1.6" />
      <rect x="158" y="40" width="20" height="118" rx="2" fill={`url(#${uid}-stone)`} opacity="0.7" />
      <g>
        <rect x="24" y="8" width="6" height="20" rx="1" fill="#d8cfa8" />
        <path d="M27 2c3 4 3 6 0 8-3-2-3-4 0-8z" fill="#ffcf72" />
        <rect x="150" y="10" width="6" height="18" rx="1" fill="#d8cfa8" />
        <path d="M153 4c3 4 3 6 0 8-3-2-3-4 0-8z" fill="#ffcf72" />
      </g>
      <rect x="20" y="156" width="140" height="10" rx="2" fill="#9a9384" stroke="#5e574a" strokeWidth="1.4" />
    </svg>
  );
}

function Bed({ uid, feather }) {
  return (
    <svg viewBox="0 0 200 140" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="100" cy="130" rx="88" ry="9" fill="#000000" opacity="0.22" />
      <rect x="16" y="42" width="14" height="80" rx="3" fill={`url(#${uid}-oakDark)`} />
      <rect x="16" y="24" width="14" height="24" rx="4" fill={`url(#${uid}-oak)`} />
      <rect x="170" y="56" width="14" height="66" rx="3" fill={`url(#${uid}-oakDark)`} />
      <rect x="30" y="58" width="140" height="16" rx="3" fill={`url(#${uid}-oakDark)`} />
      <rect x="30" y="70" width="140" height="18" rx="3" fill={`url(#${uid}-oak)`} opacity="0.9" />
      {feather ? (
        <>
          <rect x="34" y="44" width="132" height="30" rx="14" fill={`url(#${uid}-cloth)`} stroke="#cfc6b2" strokeWidth="1.4" />
          <g stroke="#cfc6b2" strokeWidth="1" opacity="0.7">
            <path d="M58 46v26M86 44v28M114 44v28M142 46v26" />
          </g>
          <rect x="42" y="34" width="44" height="22" rx="11" fill="#ffffff" stroke="#d6cdbb" strokeWidth="1.4" />
          <rect x="92" y="36" width="40" height="20" rx="10" fill="#f7f3ea" stroke="#d6cdbb" strokeWidth="1.4" />
          <path d="M34 74h132v14a4 4 0 0 1-4 4H38a4 4 0 0 1-4-4z" fill="#8fa3b8" />
          <g stroke="#7a8ea3" strokeWidth="1.2" opacity="0.8">
            <path d="M34 84h132" />
          </g>
        </>
      ) : (
        <>
          <rect x="34" y="46" width="132" height="30" rx="10" fill={`url(#${uid}-straw)`} stroke="#b39149" strokeWidth="1.4" />
          <g stroke="#a8873f" strokeWidth="1" opacity="0.7">
            <path d="M48 52l10 20M64 50l8 22M80 52l10 20M96 50l8 22M112 52l10 20M128 50l8 22M144 52l8 20" />
          </g>
          <rect x="40" y="34" width="42" height="20" rx="9" fill="#efe3c6" stroke="#cbb98f" strokeWidth="1.3" />
          <path d="M34 72h132v16a4 4 0 0 1-4 4H38a4 4 0 0 1-4-4z" fill="#9a5f4a" />
          <path d="M34 72h132v5H34z" fill="#b8735a" />
          <g stroke="#7d4a38" strokeWidth="1.2" opacity="0.8">
            <path d="M50 77v15M82 77v15M114 77v15M146 77v15" />
          </g>
        </>
      )}
      <rect x="30" y="96" width="140" height="6" rx="2" fill="#5d3d1e" />
      <g stroke="#4e3315" strokeWidth="4">
        <path d="M38 102v20M160 102v20" />
      </g>
    </svg>
  );
}

function Chair({ uid }) {
  return (
    <svg viewBox="0 0 110 150" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="55" cy="142" rx="34" ry="6" fill="#000000" opacity="0.22" />
      <rect x="26" y="12" width="58" height="10" rx="4" fill={`url(#${uid}-oak)`} stroke="#5d3d1e" strokeWidth="1.2" />
      <rect x="30" y="20" width="7" height="52" rx="3" fill={`url(#${uid}-oakDark)`} />
      <rect x="73" y="20" width="7" height="52" rx="3" fill={`url(#${uid}-oakDark)`} />
      <g stroke="#8a5f2e" strokeWidth="4" strokeLinecap="round">
        <path d="M40 26v44M52 24v46M64 24v46" />
      </g>
      <rect x="22" y="66" width="66" height="11" rx="4" fill={`url(#${uid}-oak)`} stroke="#5d3d1e" strokeWidth="1.3" />
      <rect x="22" y="75" width="66" height="6" rx="2" fill="#6b4620" />
      <g stroke={`url(#${uid}-oakDark)`} strokeWidth="7" strokeLinecap="round">
        <path d="M28 82v54" />
        <path d="M82 82v54" />
        <path d="M52 84v40" />
      </g>
      <g stroke="#4e3315" strokeWidth="5" strokeLinecap="round">
        <path d="M24 132h12M76 132h12" />
      </g>
      <rect x="26" y="118" width="58" height="4" rx="2" fill="#7d5527" />
    </svg>
  );
}

function Table({ uid }) {
  return (
    <svg viewBox="0 0 200 150" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="100" cy="140" rx="76" ry="8" fill="#000000" opacity="0.22" />
      <rect x="20" y="56" width="160" height="16" rx="4" fill={`url(#${uid}-oak)`} stroke="#563a1b" strokeWidth="1.4" />
      <rect x="20" y="56" width="160" height="5" rx="2" fill="#c08f52" opacity="0.65" />
      <g stroke="#5d3d1e" strokeWidth="1.2" opacity="0.55">
        <path d="M40 61h120M34 67h124" />
      </g>
      <g stroke={`url(#${uid}-oakDark)`} strokeWidth="9" strokeLinecap="round">
        <path d="M34 72v58" />
        <path d="M166 72v58" />
        <path d="M96 72v44" />
      </g>
      <rect x="30" y="118" width="140" height="6" rx="3" fill="#5d3d1e" />
      {/* a loaf on a board, a bowl and a mug, because this is the Republic */}
      <rect x="34" y="44" width="46" height="12" rx="3" fill="#b98a4f" stroke="#8a6134" strokeWidth="1.2" />
      <path d="M40 44c2-10 10-16 18-16s15 6 17 16z" fill="#c8954f" stroke="#8a6134" strokeWidth="1.3" />
      <g stroke="#8a6134" strokeWidth="1" opacity="0.8">
        <path d="M48 34l3 8M56 31l2 11M64 34l-2 8" />
      </g>
      <ellipse cx="112" cy="46" rx="18" ry="7" fill="#d8cfa8" stroke="#a89a74" strokeWidth="1.3" />
      <ellipse cx="112" cy="44" rx="14" ry="5" fill="#8f9a6a" />
      <path d="M138 34h16v12a8 8 0 0 1-16 0z" fill="#d8cfa8" stroke="#a89a74" strokeWidth="1.2" />
      <path d="M154 37h6a4 4 0 0 1 0 8h-6" fill="none" stroke="#a89a74" strokeWidth="1.6" />
    </svg>
  );
}

function BreadOven({ uid }) {
  return (
    <svg viewBox="0 0 170 175" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="85" cy="164" rx="74" ry="9" fill="#000000" opacity="0.24" />
      <rect x="18" y="118" width="134" height="44" rx="4" fill="#8c6a4e" stroke="#5b4040" strokeWidth="1.6" />
      <g fill="#a97b57" stroke="#6d4a34" strokeWidth="1">
        <rect x="22" y="124" width="24" height="12" rx="2" />
        <rect x="50" y="124" width="26" height="12" rx="2" />
        <rect x="80" y="124" width="24" height="12" rx="2" />
        <rect x="108" y="124" width="24" height="12" rx="2" />
        <rect x="24" y="142" width="28" height="12" rx="2" />
        <rect x="56" y="142" width="24" height="12" rx="2" />
        <rect x="84" y="142" width="28" height="12" rx="2" />
        <rect x="116" y="142" width="24" height="12" rx="2" />
      </g>
      <path d="M32 122c0-46 24-74 53-74s53 28 53 74z" fill="#b98a63" stroke="#6d4a34" strokeWidth="1.8" />
      <g stroke="#8a5f42" strokeOpacity="0.55" strokeWidth="1.2" fill="none">
        <path d="M40 112c4-30 22-48 45-48s41 18 45 48" />
        <path d="M46 100c6-22 20-34 39-34s33 12 39 34" />
        <path d="M60 122c-4-24 3-42 25-42s29 18 25 42" />
      </g>
      <path d="M56 122V104a29 29 0 0 1 58 0v18z" fill="#2a170d" />
      <path d="M62 122v-16a23 23 0 0 1 46 0v16z" fill="#180d07" />
      <ellipse cx="85" cy="118" rx="24" ry="14" fill={`url(#${uid}-fire)`} opacity="0.85" />
      <g stroke="#4e3315" strokeWidth="5" strokeLinecap="round">
        <path d="M68 118l32 6M100 116l-30 8" />
      </g>
      <rect x="70" y="10" width="20" height="42" rx="3" fill="#9c7455" stroke="#5b4040" strokeWidth="1.4" />
      <rect x="66" y="6" width="28" height="8" rx="2" fill="#7d5a42" stroke="#5b4040" strokeWidth="1.2" />
      <g className="ember-rise" opacity="0.6">
        <circle cx="80" cy="2" r="2" fill="#ffc463" />
        <circle cx="90" cy="0" r="1.5" fill="#ffb04a" />
      </g>
      <g stroke="#4e3315" strokeWidth="5" strokeLinecap="round">
        <path d="M18 152l-10 8M156 152l10 8" />
      </g>
      <rect x="136" y="128" width="8" height="26" rx="3" fill="#8b6134" />
      <rect x="146" y="134" width="8" height="20" rx="3" fill="#7d5527" />
    </svg>
  );
}

function Bookshelf({ uid }) {
  const shelves = [26, 62, 98, 134];
  const spines = ['#8c3f36', '#3f6b52', '#7a6a3a', '#3f4f78', '#8a5a2f', '#6b3f5c', '#4a6b6b'];
  return (
    <svg viewBox="0 0 130 180" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="65" cy="172" rx="58" ry="7" fill="#000000" opacity="0.22" />
      <rect x="6" y="8" width="118" height="160" rx="4" fill={`url(#${uid}-oakDark)`} stroke="#3d2611" strokeWidth="1.8" />
      <rect x="14" y="16" width="102" height="144" fill="#3d2a16" />
      {shelves.map((y, row) => (
        <g key={y}>
          {Array.from({ length: 8 }, (_, i) => {
            const w = 7 + ((row + i) % 3) * 2;
            const h = 22 + ((row * 3 + i) % 4) * 5;
            return (
              <rect
                key={i}
                x={18 + i * 12}
                y={y + (40 - h)}
                width={w}
                height={h}
                rx="1"
                fill={spines[(row + i) % spines.length]}
                stroke="#2c1c0c"
                strokeWidth="0.8"
              />
            );
          })}
          <rect x="14" y={y + 2} width="102" height="5" rx="1" fill={`url(#${uid}-oak)`} stroke="#4e3315" strokeWidth="1" />
        </g>
      ))}
      <g fill="#d8cfa8" opacity="0.85">
        <circle cx="104" cy="58" r="4" />
        <circle cx="104" cy="132" r="4" />
      </g>
      <rect x="6" y="8" width="118" height="8" rx="3" fill={`url(#${uid}-oak)`} stroke="#4e3315" strokeWidth="1.2" />
      <rect x="6" y="160" width="118" height="8" rx="3" fill={`url(#${uid}-oak)`} stroke="#4e3315" strokeWidth="1.2" />
    </svg>
  );
}

function Crate({ uid }) {
  return (
    <svg viewBox="0 0 120 120" className="h-auto w-full">
      <Defs uid={uid} />
      <ellipse cx="60" cy="112" rx="46" ry="7" fill="#000000" opacity="0.22" />
      <rect x="12" y="30" width="96" height="76" rx="3" fill={`url(#${uid}-oak)`} stroke="#4e3315" strokeWidth="2" />
      <g stroke="#5d3d1e" strokeWidth="2.4" opacity="0.8">
        <path d="M18 44h84M18 64h84M18 84h84" />
        <path d="M36 34v68M60 34v68M84 34v68" />
      </g>
      <rect x="8" y="22" width="104" height="12" rx="3" fill={`url(#${uid}-oakDark)`} stroke="#3d2611" strokeWidth="1.6" />
    </svg>
  );
}

const PIECES = {
  'house rug': { Art: Rug, width: 150 },
  'potted fern': { Art: Fern, width: 74 },
  'hearth fireplace': { Art: Fireplace, width: 118 },
  'straw bed': { Art: (p) => <Bed {...p} feather={false} />, width: 132 },
  'feather duvet': { Art: (p) => <Bed {...p} feather />, width: 132 },
  'wooden chair': { Art: Chair, width: 68 },
  'kitchen table': { Art: Table, width: 128 },
  'bread oven': { Art: BreadOven, width: 112 },
  bookshelf: { Art: Bookshelf, width: 86 },
};

const pieceFor = (name) => PIECES[String(name || '').trim().toLowerCase()] || { Art: Crate, width: 70 };

export default function Furnishing({ name, scale = 1, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const { Art, width } = pieceFor(name);

  return (
    <span
      className={`block ${className}`}
      style={{ width: `${Math.round(width * scale)}px` }}
      aria-hidden="true"
    >
      <Art uid={uid} />
    </span>
  );
}