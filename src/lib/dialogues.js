// A goose stops to talk, one line at a time, and then asks you to choose.
// Every choice answers differently, and some of them change what you know about the world.

export const DIALOGUES = {
  gossip: {
    speaker: 'A goose of the Republic',
    lines: [
      'HONK. You are the new beak on the avenue, are you not?',
      'They say the old stone circle spills light when the shards are gathered.',
    ],
    choices: [
      {
        label: 'Ask about the shards',
        lines: [
          'Nine of them, buried under the boulders and stuffed into hollow trunks.',
          'Walk right up and search the rock. Do not use the beak, use the hands.',
        ],
        outcome: 'reveal',
      },
      {
        label: 'Ask about the bread',
        lines: [
          'Bread is the only honest currency in this Republic.',
          'Bake it, mine it, or pull it out of the lake. Just do not ask the Bank for it.',
        ],
        outcome: 'nothing',
      },
    ],
  },
  worker: {
    speaker: 'A tired clerk',
    lines: ['Another citizen. Splendid.', 'Do you want news, or do you want the truth?'],
    choices: [
      {
        label: 'Tell me the truth',
        lines: [
          'The vault in the National Bank is opened by three tumblers. Left, right, left.',
          'I never said that.',
        ],
        outcome: 'heist',
      },
      {
        label: 'Give me the news',
        lines: ['The Herald prints whatever the Parliament honks loudest. Same as ever.'],
        outcome: 'nothing',
      },
    ],
  },
  witch: {
    speaker: 'The Witch of the Pines',
    lines: [
      'You found the hut. Most do not.',
      'The Sift is thin here. Gather the nine shards and the stone will open.',
    ],
    choices: [
      {
        label: 'What is the Sift?',
        lines: [
          'A bright world behind the world. Pink sky, turquoise water, no Parliament.',
          'Its gate is in this very room. It simply does not answer to the poor.',
        ],
        outcome: 'reveal',
      },
      {
        label: 'Can you help me find them?',
        lines: ['No. But I will lean on the stone so it glows a little louder.'],
        outcome: 'reveal',
      },
    ],
  },
};

export const dialogueFor = (key) => DIALOGUES[key] || DIALOGUES.gossip;