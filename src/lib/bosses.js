// The great beasts of the Republic. Each keeps to one realm, and each wants a pet in front of it.
//
// Every beast fights to its own pattern. A pattern is not a pile of numbers: each step can
// carry an effect, and the bout shows which step is coming next, so a careful goose can plan.
//   charge  — the step does no damage, but the next blow lands harder
//   burrow  — the beast hides, and the next strike swings at nothing
//   drain   — the blow also knits a little health back into the beast
// A beast can also regrow every turn (regen) or turn dangerous once it is half beaten (enrage).

export const BOSSES = [
  {
    id: 'ice-duck',
    realm: 'tundra',
    name: 'The Ice Duck',
    title: 'The Frozen Menace',
    glyph: '🦆',
    accent: '#9fe0ff',
    hp: 75,
    at: { x: 12, y: 74 },
    blurb: 'A duck the size of a barn. The lake froze the day it arrived and has not thawed since.',
    intro: 'The Ice Duck banks out of the snowfall and settles in front of you, breathing frost.',
    style: 'Gathers all the cold, then spends it in one blow.',
    pattern: [
      { name: 'Frostbill', power: 8 },
      {
        name: 'Gather Frost',
        power: 0,
        effect: 'charge',
        bonus: 7,
        hint: 'the air goes still and cold — the next blow lands harder',
      },
      { name: 'Blizzard Honk', power: 14 },
      { name: 'Ice Slide', power: 9 },
    ],
    reward: { bread: 420, xp: 160 },
  },
  {
    id: 'sand-wyrm',
    realm: 'desert',
    name: 'The Sand Wyrm',
    title: 'The Dune That Moves',
    glyph: '🪱',
    accent: '#e8b96b',
    hp: 85,
    at: { x: 12, y: 74 },
    blurb: 'The caravans go round the long way now. Something under the sand has been swallowing the short road.',
    intro: 'The sand opens, and the Sand Wyrm comes up out of it in a cloud of grit.',
    style: 'Goes under, then comes up where you are standing.',
    pattern: [
      { name: 'Sand Spit', power: 9 },
      {
        name: 'Burrow',
        power: 0,
        effect: 'burrow',
        hint: 'it goes under the sand — a strike now hits nothing',
      },
      { name: 'Burrow Rush', power: 14 },
      { name: 'Dust Storm', power: 16 },
    ],
    reward: { bread: 520, xp: 190 },
  },
  {
    id: 'moss-troll',
    realm: 'forest',
    name: 'The Moss Troll',
    title: 'The Old Thing of the Pines',
    glyph: '🗿',
    accent: '#7fd6a0',
    hp: 65,
    at: { x: 62, y: 92 },
    blurb: 'It sits so still the forest grew over it. It has been sitting there since before the Republic.',
    intro: 'The hill stands up. It is not a hill.',
    style: 'Moss grows back over every wound. Hit it hard, and quickly.',
    regen: 3,
    pattern: [
      { name: 'Boulder Roll', power: 10 },
      {
        name: 'Root Snatch',
        power: 12,
        effect: 'drain',
        hint: 'it takes something back with the roots',
      },
      { name: 'Old Weight', power: 15 },
    ],
    reward: { bread: 380, xp: 140 },
  },
  {
    id: 'dragon',
    realm: 'sift',
    name: 'The Dragon of the Sift',
    title: 'The Hum Made Solid',
    glyph: '🐉',
    accent: '#ff9ad5',
    hp: 95,
    at: { x: 16, y: 72 },
    blurb: 'The Sift hums because it has to. This is what happens when the hum gets a temper.',
    intro: 'The pink sky folds, and the Dragon of the Sift comes down through it.',
    style: 'Worse than it was once it is half beaten.',
    enrage: 5,
    pattern: [
      { name: 'Bright Breath', power: 11 },
      { name: 'Tail Sweep', power: 15 },
      { name: 'Humming Roar', power: 19 },
    ],
    reward: { bread: 700, xp: 260 },
  },
];

export const bossFor = (id) => BOSSES.find((boss) => boss.id === id) || null;