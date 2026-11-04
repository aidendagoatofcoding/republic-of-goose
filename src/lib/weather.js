// The weather over the Republic. One sky at a time, changing every few minutes.

export const WEATHERS = [
  {
    id: 'sunny',
    name: 'Sunny',
    emoji: '☀️',
    tint: '#f2c96b',
    blurb: 'A clear, honest sky over the meadow.',
  },
  {
    id: 'cloudy',
    name: 'Overcast',
    emoji: '☁️',
    tint: '#c8d8d0',
    blurb: 'Flat grey light and no shadows anywhere.',
  },
  {
    id: 'windy',
    name: 'Windy',
    emoji: '🌬️',
    tint: '#bfe9ff',
    blurb: 'Everything loose is going east, whether it agrees or not.',
  },
  {
    id: 'rain',
    name: 'Rain',
    emoji: '🌧️',
    tint: '#8ec8e0',
    blurb: 'Rain on the cobbles, and the bread stays under cover.',
  },
  {
    id: 'storm',
    name: 'Thunder',
    emoji: '⛈️',
    tint: '#b48adc',
    blurb: 'The sky arguing with itself over the lake.',
  },
  {
    id: 'fog',
    name: 'Fog',
    emoji: '🌫️',
    tint: '#c8c8c0',
    blurb: 'The far end of the meadow has gone missing.',
  },
  {
    id: 'snow',
    name: 'Snow',
    emoji: '❄️',
    tint: '#e8f6ff',
    blurb: 'Quiet, cold, and the fountain has a hat on.',
  },
  {
    id: 'hail',
    name: 'Hail',
    emoji: '🧊',
    tint: '#dbefff',
    blurb: 'The sky has started throwing the small pieces.',
  },
];

export const WEATHER_BY_ID = Object.fromEntries(WEATHERS.map((w) => [w.id, w]));

export const weatherFor = (id) => WEATHER_BY_ID[id] || WEATHERS[0];

// The sky turns over on its own, in a fixed run so the day has a rhythm to it.
export const NEXT_WEATHER = {
  sunny: 'cloudy',
  cloudy: 'windy',
  windy: 'rain',
  rain: 'storm',
  storm: 'fog',
  fog: 'snow',
  snow: 'hail',
  hail: 'sunny',
};

export const WEATHER_MS = 150000;