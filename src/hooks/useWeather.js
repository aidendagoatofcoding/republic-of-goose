import { useEffect, useState } from 'react';
import { weatherFor, NEXT_WEATHER, WEATHER_MS } from '@/lib/weather';

// One sky over the Republic, turning over on its own.
export default function useWeather(start = 'sunny') {
  const [weather, setWeather] = useState(() => weatherFor(start));

  useEffect(() => {
    const timer = setInterval(() => {
      setWeather((current) => weatherFor(NEXT_WEATHER[current.id] || 'sunny'));
    }, WEATHER_MS);
    return () => clearInterval(timer);
  }, []);

  return weather;
}