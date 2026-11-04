import { REALMS } from '@/lib/realms';
import { SPAWN, PORTAL_RING_RADIUS } from '@/lib/spawn';

// The portals hang on a pixel-perfect circle around the fountain, each one a slowly
// turning void with a bright rim of light.
export default function Realms({ onEnter, activeId = '' }) {
  const size = PORTAL_RING_RADIUS * 2;

  return (
    <div
      style={{ left: `${SPAWN.x}%`, top: `${SPAWN.y}%`, width: size, height: size }}
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
    >
      {REALMS.map((realm) => {
        const active = activeId === realm.id;
        const rad = (realm.portalAngle * Math.PI) / 180;
        const left = 50 + Math.cos(rad) * 50;
        const top = 50 + Math.sin(rad) * 50;
        return (
          <button
            key={realm.id}
            type="button"
            title={`${realm.name} — press Enter to step through`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onEnter(realm.id);
            }}
            style={{ left: `${left}%`, top: `${top}%` }}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <span className="relative mx-auto flex h-12 w-12 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full opacity-80"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0%, #c2ff85 16%, transparent 42%, #8fd7ff 68%, transparent 94%)',
                  filter: 'blur(2px)',
                  animation: 'portal-spin 6s linear infinite',
                }}
                aria-hidden="true"
              />
              <span
                className="absolute inset-[5px] rounded-full"
                style={{
                  background: 'radial-gradient(circle at 50% 45%, #0d150f 0%, #040705 78%)',
                  boxShadow: active
                    ? 'inset 0 0 12px rgba(194,255,133,0.75), 0 0 14px rgba(194,255,133,0.45)'
                    : 'inset 0 0 10px rgba(194,255,133,0.35)',
                }}
                aria-hidden="true"
              />
              <span className="relative text-lg leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {realm.glyph}
              </span>
            </span>
            <span
              className={`mt-1 block whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] ${
                active ? 'text-primary' : 'text-primary/70'
              }`}
            >
              {active ? `⏎ ${realm.portalLabel}` : realm.portalLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}