export const JOBS = [
  {
    id: 'pond_scraper',
    title: 'Pond Scraper',
    emoji: '🪣',
    wage: 2,
    description: 'Skim the leaves, the feathers and the occasional duck off the national ponds.',
  },
  {
    id: 'bread_courier',
    title: 'Bread Courier',
    emoji: '🥖',
    wage: 3,
    description: 'Carry warm loaves from the bakery to every nest in the district before they cool.',
  },
  {
    id: 'feather_inspector',
    title: 'Feather Inspector',
    emoji: '🪶',
    wage: 4,
    description: 'Certify that every citizen feather meets the national standard of fluff.',
  },
  {
    id: 'nest_architect',
    title: 'Nest Architect',
    emoji: '🌿',
    wage: 5,
    description: 'Design twig structures sturdy enough for a family of geese and one opinionated turtle.',
  },
  {
    id: 'pond_warden',
    title: 'Pond Warden',
    emoji: '🚨',
    wage: 7,
    description: 'Guard the shoreline, log every honk after dark and chase off foxes politely.',
  },
  {
    id: 'chief_honk_officer',
    title: 'Chief Honk Officer',
    emoji: '🎺',
    wage: 10,
    description: 'Lead the national honk at dawn. A loud voice and a clean conscience required.',
  },
];

export function jobById(id) {
  return JOBS.find((job) => job.id === id) || null;
}