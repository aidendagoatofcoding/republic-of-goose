// The official HONKISH language engine.
// Alphabet codes: five bits, written h for 1 and k for 0, closed with an nk.
// Dictionary codes: GOOSEK + twelve bits (h/k) + nk.

export function bitsOf(value, width) {
  return value
    .toString(2)
    .padStart(width, '0')
    .split('')
    .map((bit) => (bit === '1' ? 'h' : 'k'))
    .join('');
}

export const ALPHABET = {};

for (let i = 0; i < 26; i += 1) {
  ALPHABET[String.fromCharCode(65 + i)] = `${bitsOf(i, 5)}nk`;
}

const NORMAL_WORDS = `
hello hi hey greetings goodbye bye farewell
yes no maybe please thanks thank you sorry welcome
goose geese duck ducks human humans friend enemy family
baby king queen leader citizen flock parliament president
government country nation republic empire kingdom citizen
food bread water fish corn seed snack meal apple
happy sad angry scared excited tired hungry confused love
hate funny boring beautiful strong weak good bad
eat sleep run walk fly swim think help stop
attack defend win lose want need give take come go
house home pond sun moon tree sky world nest forest
danger war victory secret mission army guard freedom
honor glory territory capital mountain lake river snow
what why where when who how you i me we they
it this that and or but because not very
good big small fast slow old new hot cold
morning night today tomorrow yesterday now later always never
duckling eagle hawk pigeon chicken swan penguin bird animal
fox dog cat horse cow bear wolf rabbit moose
breadth feather wing beak tail bill egg nest feather
school teacher student book language word sentence alphabet
computer internet website code program translator dictionary
music song sound honk honking speech talk listen
north south east west winter summer spring autumn
one two three four five six seven eight nine ten
eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen
nineteen twenty hundred thousand million
beautifully quickly slowly carefully loudly quietly
run away come here look out watch out be careful
i am you are we are they are it is
my your our their his her its
i love you i hate you hello my child
welcome home good morning good night thank you
good luck long live the goose empire
united we honk bread is life
`
  .trim()
  .split(/\s+/);

const PHRASES = [
  'thank you',
  'good morning',
  'good night',
  'good luck',
  'i love you',
  'i hate you',
  'hello my child',
  'welcome home',
  'long live the goose empire',
  'united we honk',
  'bread is life',
  'come here',
  'look out',
  'watch out',
  'be careful',
  'i am',
  'you are',
  'we are',
  'they are',
  'it is',
];

export const INSULTS = [
  'featherless chicken',
  'you absolute bread thief',
  'you useless duck',
  'your honk is weak',
  'you have no feathers',
  'you are a fake goose',
  'you walk like a pigeon',
  'your nest is terrible',
  'you are a pond disappointment',
  'you smell like wet bread',
  'you are a disgrace to the flock',
  'your wings are decorative',
  'you have the intelligence of a rock',
  'you are an embarrassment to geese',
  'your feathers are crooked',
  'you cannot even honk properly',
  'you are allergic to flying',
  'you are not worthy of bread',
  'you are a walking bread shortage',
  'your honk sounds like a squeaky toy',
  'you are the weakest goose',
  'you have the brain of a duck',
  'your nest has negative value',
  'you are a featherless fraud',
  'you are a disgrace to bread',
  'your pond privileges are revoked',
  'you are a terrible goose',
  'you are banned from the flock',
  'you are a failed goose',
  'your feathers look borrowed',
  'you have the charisma of a wet sock',
  'your honk has been rejected',
  'you are a discount pigeon',
  'your beak is unemployed',
  'you are a professional bread loser',
  'you have been out-honked',
  'you are the reason ducks exist',
  'you are a national embarrassment',
  'your goose license is revoked',
  'you are a walking honk malfunction',
];

const ALL_ENTRIES = [...new Set([...NORMAL_WORDS, ...PHRASES, ...INSULTS])];

export const DICTIONARY = {};
export const REVERSE_DICTIONARY = {};

function makeDictionaryCode(index) {
  return `GOOSEK${bitsOf(index, 12)}nk`;
}

ALL_ENTRIES.forEach((word, index) => {
  const code = makeDictionaryCode(index + 1);
  DICTIONARY[word] = code;
  REVERSE_DICTIONARY[code] = word;
});

const INSULT_SET = new Set(INSULTS);

export const DICTIONARY_ENTRIES = Object.entries(DICTIONARY).filter(
  ([word]) => !INSULT_SET.has(word)
);

export const INSULT_ENTRIES = INSULTS.map((word) => [word, DICTIONARY[word]]);

const SORTED_PHRASES = Object.keys(DICTIONARY)
  .filter((word) => word.includes(' '))
  .sort((a, b) => b.split(' ').length - a.split(' ').length);

export function encodeWord(word) {
  return word
    .toUpperCase()
    .split('')
    .map((letter) => ALPHABET[letter] || '')
    .filter(Boolean)
    .join(' | ');
}

export function decodeLetters(code) {
  return code
    .split('|')
    .map((part) => {
      const normalized = part.trim().split(/\s+/).join(' ');
      const match = Object.entries(ALPHABET).find(([, honk]) => honk === normalized);
      return match ? match[0] : '?';
    })
    .join('');
}

export function tokenize(text) {
  return text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?|[.,!?;:]/g) || [];
}

export function translateEnglish(text) {
  const tokens = tokenize(text);
  const result = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (/^[.,!?;:]$/.test(token)) {
      result.push(token);
      i += 1;
      continue;
    }

    let found = false;

    for (const phrase of SORTED_PHRASES) {
      const parts = phrase.split(' ');
      const matches = parts.every((part, offset) => tokens[i + offset] === part);
      if (matches) {
        result.push(DICTIONARY[phrase]);
        i += parts.length;
        found = true;
        break;
      }
    }

    if (found) continue;

    if (DICTIONARY[token]) {
      result.push(DICTIONARY[token]);
    } else {
      result.push(encodeWord(token));
    }

    i += 1;
  }

  return result.join(' / ');
}

export function translateHonkish(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';

  return trimmed
    .split(/\s*\/\s*/)
    .map((token) => {
      const code = token.trim();
      if (!code) return '';
      if (REVERSE_DICTIONARY[code]) return REVERSE_DICTIONARY[code];
      if (/^[.,!?;:]$/.test(code)) return code;
      return decodeLetters(code);
    })
    .join(' ');
}