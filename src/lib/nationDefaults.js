export const DEFAULT_ANNOUNCEMENT = [
  'The Republic of Goose officially recognizes HONKISH as its national language.',
  'All citizens are encouraged to learn the alphabet, respect the national laws, and protect bread supplies.',
];

// The About the Country page, as published until the Master Goose edits it.
export const DEFAULT_ABOUT = {
  intro: [
    'The Republic of Goose is a fictional sovereign nation located in the imagined territory between Canada and Alaska. It is a northern country known for its vast forests, frozen lakes, enormous goose populations, and abundant bread reserves.',
    'The state is governed from Honkton by the Goose Parliament, which convenes whenever the lake thaws. Citizenship is granted on sight to anyone able to produce a convincing honk.',
  ],
  facts: [
    { label: 'Official Name', value: 'Republic of Goose' },
    { label: 'Capital', value: 'Honkton' },
    { label: 'Location', value: 'Between Canada and Alaska (fictional)' },
    { label: 'Official Language', value: 'HONKISH' },
    { label: 'Currency', value: 'Goose Dollar (G$)' },
    { label: 'National Animal', value: 'Canada Goose' },
    { label: 'Government', value: 'Federal Goose Republic' },
    { label: 'National Food', value: 'Bread' },
    { label: 'National Bird', value: 'Goose' },
    { label: 'National Motto', value: 'United We Honk' },
  ],
  borders: ['North — Arctic Ocean', 'West — Alaska', 'East — Canada', 'South — Great Goose Forest'],
  regions: [
    { name: 'Honkton', note: 'National Capital' },
    { name: 'Bread Valley', note: 'Agricultural Region' },
    { name: 'Great Goose Forest', note: 'Wildlife Region' },
    { name: 'Lake HONK', note: 'Largest National Lake' },
    { name: 'Feather Mountains', note: 'Northern Highlands' },
  ],
};

const lines = (text) =>
  String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const pairs = (text) =>
  lines(text)
    .map((line) => {
      const [head, ...rest] = line.split('|');
      return { name: head.trim(), note: rest.join('|').trim() };
    })
    .filter((entry) => entry.name);

// Read whatever the Master Goose has saved, falling back to the published defaults.
export function aboutFromConfig(config) {
  const intro = lines(config?.about_intro);
  const facts = pairs(config?.about_facts)
    .filter((entry) => entry.note)
    .map((entry) => ({ label: entry.name, value: entry.note }));
  const borders = lines(config?.about_borders);
  const regions = pairs(config?.about_regions);

  return {
    intro: intro.length ? intro : DEFAULT_ABOUT.intro,
    facts: facts.length ? facts : DEFAULT_ABOUT.facts,
    borders: borders.length ? borders : DEFAULT_ABOUT.borders,
    regions: regions.length ? regions : DEFAULT_ABOUT.regions,
  };
}

// The editor works in plain text: one paragraph or entry per line, values after a pipe.
export function aboutToText(about) {
  return {
    about_intro: about.intro.join('\n'),
    about_facts: about.facts.map((fact) => `${fact.label} | ${fact.value}`).join('\n'),
    about_borders: about.borders.join('\n'),
    about_regions: about.regions.map((region) => `${region.name} | ${region.note}`).join('\n'),
  };
}

export const DEFAULT_LAWS = [
  {
    title: 'Official Language',
    description:
      'HONKISH is the official national language. Every citizen has the right to communicate in honks.',
  },
  {
    title: 'National Animal',
    description:
      'The goose is the official national animal and shall be respected throughout the country.',
  },
  {
    title: 'Bread Protection Act',
    description:
      'Bread is a protected national resource. Unauthorized bread theft is punishable under national goose regulations.',
  },
  {
    title: 'Mandatory Honking',
    description: 'All citizens are encouraged to HONK at least once every day.',
  },
  {
    title: 'Duck Regulations',
    description:
      'Ducks must respect national goose customs. All disputes between ducks and geese shall be reviewed by the Goose Parliament.',
  },
  {
    title: 'National Territory',
    description:
      'The fictional territory of the Republic of Goose is located between Alaska and Canada.',
  },
  {
    title: 'National Flag',
    description: 'The national flag must be displayed during official goose holidays.',
  },
];