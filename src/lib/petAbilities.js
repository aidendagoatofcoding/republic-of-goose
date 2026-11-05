// Every pet carries three abilities of its own: a strike, a guard and a mend.
// No riddles and no sums — picking an ability simply spends the turn.

const KITS = {
  fang: {
    name: 'Fang and Ferocity',
    abilities: [
      { id: 'fang-bite', name: 'Bite', kind: 'strike', power: 18, note: 'Teeth first, questions later.' },
      { id: 'fang-bark', name: 'Bark', kind: 'guard', power: 9, note: 'A bark that makes the boss flinch.' },
      { id: 'fang-lick', name: 'Lick Wounds', kind: 'mend', power: 16, note: 'A quick wash of the feathers.' },
    ],
  },
  shell: {
    name: 'Shell and Stone',
    abilities: [
      { id: 'shell-ram', name: 'Shell Ram', kind: 'strike', power: 15, note: 'The whole shell behind it.' },
      { id: 'shell-hide', name: 'Draw In', kind: 'guard', power: 11, note: 'Head in, everything tucked.' },
      { id: 'shell-hum', name: 'Low Hum', kind: 'mend', power: 19, note: 'A slow note that settles the nerves.' },
    ],
  },
  pounce: {
    name: 'Pounce and Purr',
    abilities: [
      { id: 'pounce-paw', name: 'Pounce', kind: 'strike', power: 20, note: 'Straight off the back legs.' },
      { id: 'pounce-feint', name: 'Feint', kind: 'guard', power: 8, note: 'Sideways, then gone.' },
      { id: 'pounce-purr', name: 'Purr', kind: 'mend', power: 14, note: 'Steadies the whole body.' },
    ],
  },
  frost: {
    name: 'Frost and Feathers',
    abilities: [
      { id: 'frost-nip', name: 'Frost Nip', kind: 'strike', power: 19, note: 'A cold bite that stays cold.' },
      { id: 'frost-mist', name: 'Mist', kind: 'guard', power: 10, note: 'A cloud of breath and snow.' },
      { id: 'frost-coat', name: 'Warm Coat', kind: 'mend', power: 15, note: 'Curls up and shivers warm.' },
    ],
  },
  swim: {
    name: 'River and Ripple',
    abilities: [
      { id: 'swim-slap', name: 'Tail Slap', kind: 'strike', power: 17, note: 'Wet, fast and loud.' },
      { id: 'swim-dive', name: 'Dive', kind: 'guard', power: 10, note: 'Under, and out of reach.' },
      { id: 'swim-groom', name: 'Groom', kind: 'mend', power: 17, note: 'Water off, fur flat.' },
    ],
  },
  song: {
    name: 'Song and Silence',
    abilities: [
      { id: 'song-trill', name: 'Trill', kind: 'strike', power: 15, note: 'A note at exactly the wrong pitch.' },
      { id: 'song-hush', name: 'Hush', kind: 'guard', power: 9, note: 'Silence the room listens to.' },
      { id: 'song-warble', name: 'Warble', kind: 'mend', power: 21, note: 'The old song, sung properly.' },
    ],
  },
  tide: {
    name: 'Tide and Spear',
    abilities: [
      { id: 'tide-horn', name: 'Spear Rush', kind: 'strike', power: 21, note: 'Straight out of the water.' },
      { id: 'tide-fin', name: 'Fin Guard', kind: 'guard', power: 7, note: 'A fin held like a shield.' },
      { id: 'tide-brine', name: 'Brine', kind: 'mend', power: 13, note: 'Salt water on a cut.' },
    ],
  },
  glow: {
    name: 'Gold and Gleam',
    abilities: [
      { id: 'glow-peck', name: 'Golden Peck', kind: 'strike', power: 16, note: 'Bright and very quick.' },
      { id: 'glow-gleam', name: 'Gleam', kind: 'guard', power: 11, note: 'The boss looks away.' },
      { id: 'glow-down', name: 'Soft Down', kind: 'mend', power: 18, note: 'Sits down in its own gold.' },
    ],
  },
};

const BY_NAME = {
  'Honk Hound': 'fang',
  'Moss Cat': 'pounce',
  'Snow Hare': 'pounce',
  'Arctic Fox Cub': 'frost',
  'Pebble Tortoise': 'shell',
  'Pocket Turtle': 'shell',
  'Honest Beaver': 'shell',
  'Little Otter': 'swim',
  'Pond Duckling': 'swim',
  'Choir Canary': 'song',
  'Golden Gosling': 'glow',
  'Baby Marlin': 'tide',
};

const KIT_IDS = Object.keys(KITS);

const hashOf = (value) => {
  let hash = 7;
  const text = String(value ?? '');
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) % 100003;
  return hash;
};

// A pet always fights the same way, so nobody has to remember a new set each time.
export const kitFor = (petName) =>
  KITS[BY_NAME[petName]] || KITS[KIT_IDS[hashOf(petName) % KIT_IDS.length]];