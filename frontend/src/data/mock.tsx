import {
  IconBrandDribbble, IconBrandGithub, IconBrandInstagram, IconBrandLinkedin,
  IconCategory, IconHome, IconInfoSquareRounded, IconMail
} from '@tabler/icons-react';
import { NavEntryProps } from '@/data/types';
import { SocialIconProps } from '@/components/social-icon';

// TODO: Refactor how icons are imported; they need to be dynamically imported.

/** Main site navigation entries. */
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

/** Footer social navigation entries. */
export const mockSocialNavEntries: SocialIconProps[] = [
  { icon: IconBrandLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/danieldogeanu' },
  { icon: IconBrandGithub, label: 'GitHub', href: 'https://github.com/danieldogeanu' },
  { icon: IconBrandDribbble, label: 'Dribbble', href: 'https://dribbble.com/danieldogeanu' },
  { icon: IconBrandInstagram, label: 'Instagram', href: 'https://instagram.com/danieldogeanu' },
];
