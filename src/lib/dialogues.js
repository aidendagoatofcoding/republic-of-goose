// Conversations in the Republic.
// Every goose speaks in a voice of their own — the same face always greets you the same way,
// but the sentences are rolled fresh each visit, so nobody repeats themselves word for word.

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

const VOICES = {
  gruff: {
    openers: [
      ['HONK.', "You're the beak from the east road, aren't you?"],
      ['Cold one today.', 'The wind comes off the lake and straight up the avenue.'],
      ['Do not take the south road after dark.', 'Not because of anything out there. The ruts will break a wheel.'],
      ['You walk like a bird with somewhere to be.', 'Most of us just stand about and honk at the weather.'],
    ],
    asides: [
      'Anyway. You did not come here for the weather report.',
      'I have been standing here since the last bell, so take that as you like.',
      'That is the whole news from this end of the meadow.',
    ],
    signoffs: [
      'Right. Off you go — the bread will not fetch itself.',
      'Good honking to you.',
      'Watch the loose cobble by the fountain.',
      'I will be here. I am always here.',
    ],
    asks: [
      'Before you go — I could use a pair of hands.',
      'One thing, if you have the time for it.',
    ],
    checks: [
      'How is that business of mine coming along?',
      'Back again. Have you turned it up yet?',
    ],
    thanks: [
      'That business you settled for me — I have not forgotten it.',
      'Still in your debt, and glad of it.',
    ],
    agrees: ['Good bird. I will not forget it.', 'That is a weight off my mind. No rush, but do not dawdle.'],
    declines: ['Fair enough. Ask me again another day.', 'As you like. The offer keeps.'],
    question: {
      prompt: 'Do you work, or do you wander? Be straight with me.',
      options: [
        { label: 'I work, when there is work.', reply: ['Good answer.', 'The Bank respects a wage and the bakery respects a regular.'] },
        { label: 'I wander. It suits the wings.', reply: ['Then go west with the wind.', 'Or east, if you fancy the warden. He talks more than he admits.'] },
        { label: 'A bit of both, depending on the day.', reply: ['That is the honest one.', 'Nobody here does only one thing.'] },
      ],
    },
  },
  gossip: {
    openers: [
      ['You did not hear this from me.', 'The neighbour has painted his door three times this month. Three.'],
      ['There is a goose up on the granary roof.', 'Nobody will admit to it being theirs, and I have asked everyone.'],
      ['Saw the harbour master counting gulls this morning.', 'He writes the number down and then argues with it.'],
      ['I have news, and it is not good, and it is delicious.', 'The Bank is short a ledger and has been very quiet about it.'],
    ],
    asides: [
      'Anyway. That is what I know, and I know it before most.',
      'Do not repeat that. Do repeat it, actually. Just not with my name on it.',
      'I could go on. I usually do.',
    ],
    signoffs: [
      'Come and find me when the lamps are lit. I will have more by then.',
      'Good honking. And keep your ears up.',
      'Off you go. Tell me everything after.',
    ],
    asks: [
      'While you are out there, something of mine has gone missing.',
      'Before you go — ask about for me, quietly.',
    ],
    checks: [
      'I have been thinking about the thing I asked you for.',
      'Well? Everyone is asking me and I have nothing to tell them.',
    ],
    thanks: [
      'You did me a good turn once. Ask me for one and it is yours.',
      'I have told everyone, obviously. They were all very impressed.',
    ],
    agrees: ['Kind of you. Come back when you have it and I will pay you properly.', 'Good bird. I will tell them you are on it.'],
    declines: ['No harm done. I will keep it on the shelf for you.', 'Sensible, honestly. But ask me again.'],
    question: {
      prompt: 'Have you been out to the Sift yet? Everyone is talking about the Sift.',
      options: [
        { label: 'Not yet. Is it worth the walk?', reply: ['Worth it? The sky is pink and nothing there needs a signature.', 'Of course it is worth it.'] },
        { label: 'I have seen it. Made my feathers stand up.', reply: ['Mm. It does that to people.', 'Do not stare at the gate too long. It stares back.'] },
        { label: 'I do not hold with that sort of thing.', reply: ['Sensible bird.', 'Stay by the fountain then, where the ground is honest.'] },
      ],
    },
  },
  clerk: {
    openers: [
      ['Your name, please. No — I know the name.', 'I have simply been writing it out all morning and it has gone strange.'],
      ['The forms are in the third drawer, which is locked.', 'The key is in the second drawer, which is also locked.'],
      ['Mind the puddles by the fountain.', 'The cobbles are loose and the baker’s cart goes through them at a gallop.'],
      ['Everything in this Republic is written down.', 'Which means everything in this Republic can be checked, and most of it is wrong.'],
    ],
    asides: [
      'I have logged this conversation. Do not be alarmed.',
      'That is the position on paper. On the ground it is worse.',
      'Sign nothing you have not read twice.',
    ],
    signoffs: [
      'The office closes at dusk. It then opens again at dusk.',
      'Very good. Do not lose the reference number.',
      'Good honking. Mind the step, it is not on the plan.',
    ],
    asks: [
      'While you are out there, a document of mine has gone missing.',
      'One thing, if you have the time for it.',
    ],
    checks: [
      'The matter you took on has not been closed. It is overdue.',
      'I have your case open in front of me. Well?',
    ],
    thanks: [
      'The file is closed and stamped. I have had it copied for the record.',
      'You did me a good turn once. Ask me for one and it is yours.',
    ],
    agrees: ['That is noted.', 'Come back when it is done and I will pay you properly.'],
    declines: ['That is your right. The offer stays open.', 'Noted. And a little disappointing.'],
    question: {
      prompt: 'Do you trust the National Bank with your bread? Answer for the record.',
      options: [
        { label: 'With my bread? Not for a moment.', reply: ['Recorded.', 'They count in their own favour and call the result arithmetic.'] },
        { label: 'I keep an account there.', reply: ['Then keep a second count in your own head.', 'Paper gets eaten. Heads rarely do.'] },
        { label: 'I owe them, actually.', reply: ['Ah.', 'Then be polite to the cashier and quick on your feet.'] },
      ],
    },
  },
  mystic: {
    openers: [
      ['You came in on the cold wind.', 'The kettle says we have met, but the kettle lies.'],
      ['Everything here was something else first.', 'That bench was a door. That door was a promise.'],
      ['The night is doing its old trick again.', 'It is pretending to be morning down at the harbour.'],
      ['There are nine holes in the Sift gate.', 'You have started filling them. I can hear it from here.'],
    ],
    asides: [
      'You did not come here for the weather report. Neither does the weather.',
      'Take that as you like. It will be true either way by morning.',
      'The moss is older than the Republic and has better manners.',
    ],
    signoffs: [
      'Go on. The road knows you now.',
      'Good honking. Keep your shadow behind you.',
      'Come and find me when the lamps are lit. I am usually the one lighting them.',
    ],
    asks: [
      'Before you go — I have misplaced something that minds being misplaced.',
      'While you are out there, look for a thing that does not want to be found.',
    ],
    checks: [
      'The thing I asked you for is still out there. It is humming.',
      'Back again. The pines told me you would be.',
    ],
    thanks: [
      'That business you settled for me — the forest noticed.',
      'Still in your debt. Debts like that do not spoil.',
    ],
    agrees: ['Good bird.', 'Come back when you have it and I will pay you properly.'],
    declines: ['The offer keeps. Everything here keeps.', 'As you like. It will wait. It is good at waiting.'],
    question: {
      prompt: 'What do you make of the warden out at the edge?',
      options: [
        { label: 'A fox with one lamp and a lot of opinions.', reply: ['Ha. He will like you.', 'He has been out there since the map was narrower.'] },
        { label: 'I have not walked that far.', reply: ['Walk east until the grass runs out.', 'Bring him oil. He will not ask, but he wants it.'] },
        { label: 'He frightens me a bit.', reply: ['He frightens everyone a bit.', 'Keep your bread in your coat.'] },
      ],
    },
  },
  bright: {
    openers: [
      ['Oh! A visitor. A proper one.', 'Stand anywhere, we are not particular.'],
      ['You have got the light on your feathers.', 'That is the good light. It does not last, so stand in it.'],
      ['The bread queue is shorter at dawn.', 'Thought you should know. Nobody tells the new ones.'],
      ['I have been up since the gulls.', 'They do not sleep either. It is a whole thing.'],
    ],
    asides: [
      'Anyway. You did not come here for the weather report.',
      'I could talk all day. I usually do. Sit down if you like.',
      'That is the whole news from this end of the meadow.',
    ],
    signoffs: [
      'Right. Off you go — the bread will not fetch itself.',
      'Good honking to you! Genuinely.',
      'Come and find me when the lamps are lit.',
    ],
    asks: [
      'Oh — before you go, could you do me a kindness?',
      'Something of mine has gone missing. I am being very calm about it.',
    ],
    checks: [
      'Any luck? I have been pacing, which is just walking without arriving.',
      'Back already! Is it done?',
    ],
    thanks: [
      'You did me a good turn once. Ask me for one and it is yours.',
      'That business you settled for me — I have told everyone twice.',
    ],
    agrees: ['Kind of you!', 'Come back when you have it and I will pay you properly.'],
    declines: ['No harm done! It keeps.', 'Fair enough. Ask me again another day.'],
    question: {
      prompt: 'Whose house do you reckon is the finest in the Commons?',
      options: [
        { label: 'Mine, obviously.', reply: ['Of course you would say that.', 'Walk past the pond villa first, then say it again.'] },
        { label: 'The pond villa. It has a boat.', reply: ['It does. And a chimney that smokes all winter.', 'Some bird has been doing rather well for themselves.'] },
        { label: 'I do not like to judge a nest.', reply: ['Very diplomatic.', 'You would do badly in Parliament.'] },
      ],
    },
  },
  terse: {
    openers: [
      ['HONK.'],
      ['Morning.', 'Or evening. Sky is the same.'],
      ['You are in my light.', 'No, stay. It is a big light.'],
    ],
    asides: ['Anyway.', 'That is all I have.', 'Hm.'],
    signoffs: ['Off you go.', 'Mind the cobbles.', 'I will be here.'],
    asks: ['Here — do something for me.', 'One thing, if you have the time for it.'],
    checks: ['Still waiting on that business of mine.', 'Back again? Is it done?'],
    thanks: ['That business you settled for me — I have not forgotten it.', 'In your debt.'],
    agrees: ['Good.', 'Come back when it is done.'],
    declines: ['Fine.', 'The offer keeps.'],
    question: {
      prompt: 'Any fish off the dock lately?',
      options: [
        { label: 'None. My rod is a stick with string on it.', reply: ['Then buy a proper one at the chandlery.', 'The lake takes the stick personally.'] },
        { label: 'Three, before breakfast.', reply: ['Three. You will be wanting a boat next.', 'And then the harbour will want a mooring fee.'] },
        { label: 'I do not fish.', reply: ['Then you are paying harbour prices for nothing.'] },
      ],
    },
  },
};

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
        reply: [
          'That is the honest one.',
          'Nobody here does only one thing. Except the cashier, and he is not real.',
        ],
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
    prompt: 'Whose house do you reckon is the finest in the Commons?',
    options: [
      {
        label: 'Mine, obviously.',
        reply: ['Of course you would say that.', 'Walk past the pond villa first. Then say it again.'],
      },
      {
        label: 'The pond villa. It has a boat.',
        reply: ['It does. And a chimney that smokes all winter.', 'Some bird has been doing rather well.'],
      },
      {
        label: 'I do not like to judge a nest.',
        reply: ['Very diplomatic.', 'You would do badly in Parliament.'],
      },
    ],
  },
];

const VOICE_KEYS = Object.keys(VOICES);
const OFFERABLE = QUESTS.filter((quest) => quest.id !== 'bank-heist');

// The voice a goose speaks in never changes, so the same face always sounds like itself.
export const voiceFor = (name) => VOICES[VOICE_KEYS[hashOf(name) % VOICE_KEYS.length]];

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
  const voice = voiceFor(name);
  // Rolled fresh each visit: the greeting, the aside and the signoff all change.
  const seed = Math.floor(Math.random() * 100000);
  const beats = [];

  pick(voice.openers, seed).forEach((line) => beats.push({ text: line }));

  if (seed % 3 !== 0) beats.push({ text: pick(voice.asides, seed >> 4) });

  if (seed % 5 < 3) {
    const question =
      seed % 2 === 0 ? voice.question : pick(QUESTIONS, seed >> 3);
    beats.push({ prompt: question.prompt, options: question.options });
  }

  beats.push({ text: pick(voice.signoffs, seed >> 7) });

  // The favour comes out of the conversation, never off a noticeboard.
  const quest = questFor({ key, questId });
  if (quest && (questState === 'done' || questDone)) {
    beats.push({ text: pick(voice.thanks, seed >> 11) });
  } else if (quest && questState === 'taken') {
    beats.push({ text: pick(voice.checks, seed >> 10) });
    beats.push({ quest: quest.id });
  } else if (quest) {
    beats.push({ text: pick(voice.asks, seed >> 9) });
    beats.push({
      prompt: `${quest.title}. ${quest.brief}`,
      options: [
        {
          label: 'I will do it.',
          accept: quest.id,
          reply: [pick(voice.agrees, seed >> 12)],
        },
        {
          label: 'Not today.',
          reply: [pick(voice.declines, seed >> 13)],
        },
      ],
    });
  }

  return { speaker: name, species, beats };
}