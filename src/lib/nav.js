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
} from 'lucide-react';

export const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { path: '/', label: 'Homepage', title: 'Homepage', icon: Home },
      { path: '/country', label: 'About the Country', title: 'About the Country', icon: Map },
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