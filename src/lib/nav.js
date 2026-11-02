import {
  Home,
  Map,
  Languages,
  Type,
  BookOpen,
  Scale,
  PenLine,
  Lock,
  BadgeCheck,
  MessageSquare,
  Newspaper,
  Gamepad2,
  Store,
  TrendingUp,
  UserRound,
} from 'lucide-react';

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
      { path: '/games', label: 'Goose Games', title: 'Goose Games', icon: Gamepad2 },
    ],
  },
  {
    label: 'Economy',
    items: [
      { path: '/passport', label: 'My Passport', title: 'Citizen Passport', icon: UserRound },
      { path: '/shop', label: 'E-Shop', title: 'The National E-Shop', icon: Store },
      { path: '/market', label: 'Stock Market', title: 'Goose Stock Market', icon: TrendingUp },
    ],
  },
  {
    label: 'Government',
    items: [
      { path: '/citizenship', label: 'Citizenship', title: 'Citizenship Office', icon: BadgeCheck },
      { path: '/laws', label: 'National Laws', title: 'National Laws', icon: Scale },
      { path: '/grammar', label: 'Grammar Rules', title: 'HONKISH Grammar', icon: PenLine },
    ],
  },
  {
    label: 'Administration',
    items: [
      { path: '/admin', label: 'Master Goose Admin', title: 'Master Goose Admin', icon: Lock },
    ],
  },
];

export const PAGE_TITLES = NAV_GROUPS.reduce((acc, group) => {
  group.items.forEach((item) => {
    acc[item.path] = item.title;
  });
  return acc;
}, {});