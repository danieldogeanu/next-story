'use server';

import NavEntry from '@/components/nav-entry';
import { mockSiteNavEntries } from '@/data/mock';
import { NavEntryProps } from '@/data/types';
import { convertDynamicIcons } from '@/utils/convert-dynamic-icons';
import styles from '@/styles/sitenav.module.scss';

export default async function SiteNav() {
  // TODO: Replace mockup data with entries from the server.
  // This is a server component, so we can just await the `convertDynamicIcons` function.
  const navEntries: NavEntryProps[] = await convertDynamicIcons(mockSiteNavEntries) as NavEntryProps[];

  return (
    <nav className={styles.container}>
      {navEntries && navEntries.map((entry, index) => (
        <NavEntry key={index} {...entry} />
      ))}
    </nav>
  );
}
