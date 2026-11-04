import { useMemo } from 'react';

// A few dozen pieces of weather over the meadow. Purely visual, never in the way of a click.
const SPECK_COUNT = 46;

export default function WeatherLayer({ weather }) {
  const id = weather?.id || 'sunny';

  const specks = useMemo(
    () =>
      Array.from({ length: SPECK_COUNT }, (_, index) => {
        const seed = (index * 37) % 100;
        return {
          left: seed,
          delay: ((index * 13) % 40) / 10,
          duration: 1.1 + ((index * 7) % 18) / 10,
          size: 1 + ((index * 5) % 4),
          drift: ((index * 11) % 30) - 15,
        };
      }),
    []
  );

  if (id === 'sunny' || id === 'cloudy') {
    return (
      <div className="pointer-events-none absolute inset-0 z-[35] overflow-hidden" aria-hidden="true">
        {id === 'sunny' ? (
          <span
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 72% 6%, rgba(242,201,107,0.30) 0%, rgba(242,201,107,0.06) 26%, transparent 58%)',
            }}
          />
        ) : (
          <span
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(200,216,208,0.18), transparent 55%)' }}
          />
        )}
      </div>
    );
  }

  if (id === 'fog') {
    return (
      <div className="pointer-events-none absolute inset-0 z-[35] overflow-hidden" aria-hidden="true">
        <span
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(200,200,192,0.34) 0%, rgba(200,200,192,0.16) 50%, rgba(200,200,192,0.30) 100%)',
          }}
        />
        <span className="fog-bank absolute -left-[30%] top-[30%] h-24 w-[160%] rounded-full bg-[#d8d8d0]/20 blur-2xl" />
        <span className="fog-bank-slow absolute -left-[30%] top-[62%] h-20 w-[160%] rounded-full bg-[#d8d8d0]/16 blur-2xl" />
      </div>
    );
  }

  const isSnowy = id === 'snow' || id === 'hail';
  const isStorm = id === 'storm';

  return (
    <div className="pointer-events-none absolute inset-0 z-[35] overflow-hidden" aria-hidden="true">
      {isStorm && <span className="storm-flash absolute inset-0 bg-[#dfe8ff]" />}
      {id === 'rain' || isStorm ? (
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(30,46,40,0.30), rgba(12,20,16,0.16))' }}
        />
      ) : null}
      {isSnowy && (
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(214,238,255,0.20), transparent 60%)' }}
        />
      )}
      {specks.map((speck, index) => (
        <span
          key={index}
          className={
            isSnowy
              ? 'snow-flake absolute top-[-8%] rounded-full bg-white/85'
              : id === 'windy'
                ? 'wind-streak absolute top-[8%] h-[2px] rounded-full bg-[#dff3ff]/40'
                : 'rain-drop absolute top-[-10%] rounded-full bg-[#bfe9ff]/60'
          }
          style={{
            left: `${speck.left}%`,
            width: isSnowy ? `${speck.size + 1}px` : id === 'windy' ? `${24 + speck.size * 8}px` : '2px',
            height: isSnowy ? `${speck.size + 1}px` : id === 'windy' ? '2px' : `${10 + speck.size * 3}px`,
            animationDelay: `${speck.delay}s`,
            animationDuration: isSnowy ? `${speck.duration * 2.4}s` : `${speck.duration}s`,
            ['--drift']: `${speck.drift}px`,
          }}
        />
      ))}
    </div>
  );
}