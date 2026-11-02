import {
  Home,
  Map,
  Languages,
  Type,
  BookOpen,
  Lock,
  MessageSquare,
  Newspaper,
  UserRound,
  Users,
} from 'lucide-react';

// The bank, e-shop, stock market, labour office, job board, goose games, citizenship
// office and national laws are all reached inside the Honk Commons, so they are not
// listed in the site menu. Their pages still exist and keep their titles.
export const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { path: '/', label: 'Homepage', title: 'Homepage', icon: Home },
      { path: '/country', label: 'About the Country', title: 'About the Country', icon: Map },
      { path: '/news', label: 'Goose News', title: 'The Goose Gazette', icon: Newspaper },
    ],
  },
  {
    label: 'Language',
    items: [
      { path: '/translator', label: 'Translator', title: 'HONKISH Translator', icon: Languages },
      { path: '/alphabet', label: 'Alphabet', title: 'HONKISH Alphabet', icon: Type },
      { path: '/dictionary', label: 'Dictionary', title: 'National Dictionary', icon: BookOpen },
    ],
  },
  {
    label: 'Community',
    items: [
      { path: '/chat', label: 'Goose Chat', title: 'The Honk Hall', icon: MessageSquare },
      { path: '/world', label: 'The Commons', title: 'The Honk Commons', icon: Users },
    ],
  },
  {
    label: 'Economy',
    items: [
      { path: '/passport', label: 'My Passport', title: 'Citizen Passport', icon: UserRound },
    ],
  },
  {
    label: 'Administration',
    items: [
      { path: '/admin', label: 'Master Goose Admin', title: 'Master Goose Admin', icon: Lock },
    ],
  },
];

const HIDDEN_TITLES = {
  '/bank': 'The National Bank',
  '/shop': 'The National E-Shop',
  '/market': 'Goose Stock Market',
  '/jobs': 'National Labour Office',
  '/job-board': 'The Government Job Board',
  '/games': 'Goose Games',
  '/citizenship': 'Citizenship Office',
  '/laws': 'National Laws',
  '/grammar': 'HONKISH Grammar',
};

export const PAGE_TITLES = {
  ...NAV_GROUPS.reduce((acc, group) => {
    group.items.forEach((item) => {
      acc[item.path] = item.title;
    });
    return acc;
  }, {}),
  ...HIDDEN_TITLES,
};