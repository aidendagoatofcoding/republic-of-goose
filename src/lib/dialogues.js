// Conversations in the Commons.
// A goose greets you, answers, sometimes asks something back, and almost always wants a favour.

import { QUESTS } from '@/lib/quests';

const hashOf = (value) => {
  let hash = 7;
  const text = String(value ?? '');
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100003;
  }
  return hash;
};

const pick = (list, seed) => list[Math.abs(seed) % list.length];

const OPENERS = [
  ['HONK.', "You're the beak from the east road, aren't you?"],
  [
    'Mind the puddles by the fountain.',
    'The cobbles are loose and the baker’s cart goes through them at a gallop.',
  ],
  ['Cold one today.', 'The wind comes off the lake and straight up the avenue.'],
  ['You walk like a bird with somewhere to be.', 'Most of us just stand about and honk at the weather.'],
  ['The bread queue is shorter at dawn.', 'Thought you should know. Nobody tells the new ones.'],
  [
    'Evening. Or morning. Hard to tell under this sky.',
    'The lamp on the corner burned out a week ago and nobody has been up that ladder.',
  ],
  ['Do not take the south road after dark.', 'Not because of anything out there. The ruts will break a wheel.'],
];

const QUESTIONS = [
  {
    prompt: 'Which is it with you — do you work, or do you wander?',
    options: [
      {
        label: 'I work, when there is work.',
        reply: ['Good answer.', 'The Bank respects a wage and the bakery respects a regular.'],
      },
      {
        label: 'I wander. It suits the wings.',
        reply: [
          'Then go west with the wind and you will see the whole meadow before noon.',
          'Or east, if you fancy the warden. He talks more than he admits.',
        ],
      },
      {
        label: 'A bit of both, depending on the day.',
        reply: ['That is the honest one.', 'Nobody here does only one thing. Except the cashier, and he is not real.'],
      },
    ],
  },
  {
    prompt: 'Have you been out to the Sift yet?',
    options: [
      {
        label: 'Not yet. Is it worth the walk?',
        reply: ['Worth it? The sky is pink and nothing there needs a signature.', 'Of course it is worth it.'],
      },
      {
        label: 'I have seen it. Made my feathers stand up.',
        reply: ['Mm. It does that to people.', 'Do not stare at the gate too long. It stares back, and it is better at it.'],
      },
      {
        label: 'I do not hold with that sort of thing.',
        reply: ['Sensible bird.', 'Stay by the fountain then, where the ground is honest and the water is not pink.'],
      },
    ],
  },
  {
    prompt: 'Do you trust the National Bank with your bread?',
    options: [
      {
        label: 'With my bread? Not for a moment.',
        reply: ['Wise.', 'They count in their own favour and call the result arithmetic.'],
      },
      {
        label: 'I keep an account there.',
        reply: ['Then keep a second count in your own head.', 'Paper gets eaten. Heads rarely do.'],
      },
      {
        label: 'I owe them, actually.',
        reply: ['Ah.', 'Then be polite to the cashier and quick on your feet.'],
      },
    ],
  },
  {
    prompt: 'What do you make of the warden out at the edge?',
    options: [
      {
        label: 'A fox with one lamp and a lot of opinions.',
        reply: ['Ha. He will like you.', 'He has been out there since the map was a good deal narrower.'],
      },
      {
        label: 'I have not walked that far.',
        reply: ['Walk east until the grass runs out and you will find him.', 'Bring him oil. He will not ask, but he wants it.'],
      },
      {
        label: 'He frightens me a bit.',
        reply: ['He frightens everyone a bit.', 'He is harmless. Mostly. Keep your bread in your coat.'],
      },
    ],
  },
  {
    prompt: 'Any fish off the dock lately?',
    options: [
      {
        label: 'None. My rod is a stick with string on it.',
        reply: ['Then buy a proper one at the chandlery, and a net while you are there.', 'The lake takes the stick personally.'],
      },
      {
        label: 'Three, before breakfast.',
        reply: ['Three! You will be wanting a boat next.', 'And then the harbour will want a mooring fee. It always does.'],
      },
      {
        label: 'I do not fish.',
        reply: ['Then you are paying harbour prices for nothing, friend.'],
      },
    ],
  },
  {
    prompt: 'Whose house do you reckon is the finest in the Commons?',
    options: [
      {
        label: 'Mine, obviously.',
        reply: ['Of course you would say that.', 'Walk past the pond villa first. Then say it again with a straight beak.'],
      },
      {
        label: 'The pond villa. It has a boat.',
        reply: ['It does. And a chimney that smokes all winter.', 'Some bird has been doing rather well for themselves.'],
      },
      {
        label: 'I do not like to judge a nest.',
        reply: ['Very diplomatic.', 'You would do badly in Parliament.'],
      },
    ],
  },
];

const SIGNOFFS = [
  'Right. Off you go — the bread will not fetch itself.',
  'Good honking to you.',
  'Watch the loose cobble by the fountain.',
  'Come and find me when the lamps are lit.',
];

const ASKS = [
  'Before you go — I could use a pair of hands.',
  'While you are out there, something of mine has gone missing.',
  'One thing, if you have the time for it.',
  'Do me this favour and I will not forget it.',
];

const OFFERABLE = QUESTS.filter((quest) => quest.id !== 'bank-heist');

export function conversationFor({ key = 'a-goose', name = 'A goose', species = 'goose', questId = null } = {}) {
  const seed = hashOf(key);
  const beats = [];

  pick(OPENERS, seed).forEach((line) => beats.push({ text: line }));

  // Not every goose has a question for you. Some simply want to be talked at.
  if (seed % 3 !== 0) {
    const question = pick(QUESTIONS, seed >> 2);
    beats.push({ prompt: question.prompt, options: question.options });
    beats.push({ text: pick(SIGNOFFS, seed >> 7) });
  }

  const quest = questId
    ? QUESTS.find((entry) => entry.id === questId) || null
    : pick(OFFERABLE, seed >> 5);

  if (quest) {
    beats.push({ text: pick(ASKS, seed >> 9) });
    beats.push({ quest: quest.id });
  }

  return { speaker: name, species, beats };
}