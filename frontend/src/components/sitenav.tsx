'use server';

import NavEntry from '@/components/nav-entry';
import { mockSiteNavEntries } from '@/data/mock';
import { NavEntryProps } from '@/data/types';
import styles from '@/styles/sitenav.module.scss';

export default async function SiteNav() {
  // TODO: Replace mockup data with entries from the server.
  const navEntries: NavEntryProps[] = mockSiteNavEntries;

  return (
    <nav className={styles.container}>
      {navEntries && navEntries.map((entry, index) => (
        <NavEntry key={index} {...entry} />
      ))}
    </nav>
  );
}
