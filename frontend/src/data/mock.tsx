import { IconCategory, IconHome, IconInfoSquareRounded, IconMail } from '@tabler/icons-react';
import { NavEntryProps } from '@/data/types';

export const mockSiteNavEntries: NavEntryProps[] = [
  { href: '/', label: 'Home', icon: <IconHome /> },
  { href: '/about', label: 'About', icon: <IconInfoSquareRounded /> },
  { href: '/categories', label: 'Categories', icon: <IconCategory />, submenu: [
    { href: '/categories/first', label: 'First' },
    { href: '/categories/second', label: 'Second', submenu: [
      { href: '/categories/second/first', label: 'First' },
      { href: '/categories/second/second', label: 'Second' },
      { href: '/categories/second/third', label: 'Third' },
    ] },
    { href: '/categories/third', label: 'Third' },
    { href: '/categories/fourth', label: 'Fourth' },
    { href: '/categories/fifth', label: 'Fifth' },
  ] },
  { href: '/contact', label: 'Contact', icon: <IconMail /> },
];
