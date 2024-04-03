'use server';

import NavEntry, { NavEntryProps } from '@/components/nav-entry';
import styles from '@/styles/sitenav.module.scss';

export default async function SiteNav() {
  const navEntries: NavEntryProps[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/categories', label: 'Categories', submenu: [
      { href: '/categories/first', label: 'First' },
      { href: '/categories/second', label: 'Second' },
      { href: '/categories/third', label: 'Third' },
      { href: '/categories/fourth', label: 'Fourth' },
      { href: '/categories/fifth', label: 'Fifth' },
    ] },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={styles.container}>
      {navEntries && navEntries.map((entry, index) => (
        <NavEntry key={index} {...entry} />
      ))}
    </nav>
  );
}
