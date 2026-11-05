// Conversations in the Commons.
// A goose greets you, talks for a moment, sometimes asks something back, and often wants a favour.
// The chatter changes from visit to visit; the favour a goose wants stays the same.

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
  ['Saw the harbour master counting gulls this morning.', 'He writes the number down and then argues with it.'],
  ['My neighbour has painted his door three times this month.', 'Each time a slightly different green.'],
  ['There is a goose up on the granary roof and nobody will admit to it being theirs.'],
];

const ASIDES = [
  'Anyway. You did not come here for the weather report.',
  'That is the whole news from this end of the meadow.',
  'I have been standing here since the last bell, so take that as you like.',
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
  'I will be here. I am always here.',
];

const ASKS = [
  'Before you go — I could use a pair of hands.',
  'While you are out there, something of mine has gone missing.',
  'One thing, if you have the time for it.',
  'Do me this favour and I will not forget it.',
];

const THANKS = [
  'That business you settled for me — I have not forgotten it.',
  'You did me a good turn once. Ask me for one and it is yours.',
  'Still in your debt, and glad of it.',
];

const CHECKS = [
  'How is that business of mine coming along?',
  'Back again. Have you turned it up yet?',
  'I have been thinking about the thing I asked you for.',
];

const AGREES = [
  'Good bird. I will not forget it.',
  'Kind of you. Come back when you have it and I will pay you properly.',
  'That is a weight off my mind. No rush, but do not dawdle.',
];

const DECLINES = [
  'Fair enough. Ask me again another day.',
  'No harm done. I will keep it on the shelf for you.',
  'As you like. The offer keeps.',
];

const OFFERABLE = QUESTS.filter((quest) => quest.id !== 'bank-heist');

// The favour a goose wants is fixed, so the marker over their head never lies.
export function questFor({ key = '', questId = null } = {}) {
  if (questId) return QUESTS.find((quest) => quest.id === questId) || null;
  return pick(OFFERABLE, hashOf(key) >> 5) || null;
}

export function conversationFor({
  key = 'a-goose',
  name = 'A goose',
  species = 'goose',
  questId = null,
  questState = 'offer',
  questDone = false,
} = {}) {
  // Chatter is rolled fresh each visit, so the same goose does not repeat itself word for word.
  const seed = Math.floor(Math.random() * 100000);
  const beats = [];

  pick(OPENERS, seed).forEach((line) => beats.push({ text: line }));

  // Some visits are questions, some are just talk, and some never get to the point at all.
  if (seed % 3 !== 0) {
    beats.push({ text: pick(ASIDES, seed >> 4) });
  }
  if (seed % 5 < 3) {
    const question = pick(QUESTIONS, seed >> 3);
    beats.push({ prompt: question.prompt, options: question.options });
  }

  beats.push({ text: pick(SIGNOFFS, seed >> 7) });

  // The favour comes out of the conversation, never off a noticeboard.
  const quest = questFor({ key, questId });
  if (quest && (questState === 'done' || questDone)) {
    beats.push({ text: pick(THANKS, seed >> 11) });
  } else if (quest && questState === 'taken') {
    beats.push({ text: pick(CHECKS, seed >> 10) });
    beats.push({ quest: quest.id });
  } else if (quest) {
    beats.push({ text: pick(ASKS, seed >> 9) });
    beats.push({
      prompt: `${quest.title}. ${quest.brief}`,
      options: [
        {
          label: 'I will do it.',
          accept: quest.id,
          reply: [pick(AGREES, seed >> 12)],
        },
        {
          label: 'Not today.',
          reply: [pick(DECLINES, seed >> 13)],
        },
      ],
    });
  }

  return { speaker: name, species, beats };
}