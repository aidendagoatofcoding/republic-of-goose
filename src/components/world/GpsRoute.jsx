// The route the navigator is following, drawn along the streets of the meadow.
export default function GpsRoute({ route = [], destination }) {
  if (route.length < 2) return null;
  const points = route.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[6] h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#c2ff85"
        strokeOpacity="0.35"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#c2ff85"
        strokeWidth="2"
        strokeDasharray="7 6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {route.slice(1, -1).map((point, index) => (
        <circle
          key={`waypoint-${index}`}
          cx={point.x}
          cy={point.y}
          r="1.6"
          fill="#0b1310"
          stroke="#c2ff85"
          strokeWidth="0.7"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {destination && (
        <circle
          cx={destination.x}
          cy={destination.y}
          r="3.2"
          fill="none"
          stroke="#f2c96b"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}