export const SPECIES = [
  { value: 'goose', label: 'Goose', emoji: '🪿', note: 'The national standard' },
  { value: 'fox', label: 'Fox', emoji: '🦊', note: 'Arctic division' },
  { value: 'squirrel', label: 'Squirrel', emoji: '🐿️', note: 'Bread reserve guard' },
  { value: 'turtle', label: 'Turtle', emoji: '🐢', note: 'Lake HONK patrol' },
  { value: 'anteater', label: 'Anteater', emoji: '🐜', note: 'Forest sanitation' },
  { value: 'hummingbird', label: 'Hummingbird', emoji: '🐦', note: 'Air courier service' },
  { value: 'marlin', label: 'Marlin', emoji: '🐟', note: 'Deep water envoy' },
  { value: 'redpanda', label: 'Red panda', emoji: '🦝', note: 'Bamboo ridge climber' },
];

export function speciesInfo(value) {
  return SPECIES.find((entry) => entry.value === value) || SPECIES[0];
}