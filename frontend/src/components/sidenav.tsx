'use client';

import SideNavEntry from '@/components/sidenav-entry';
import { NavEntryProps } from '@/data/types';
import styles from '@/styles/sidenav.module.scss';

export interface SideNavProps {
  entries: NavEntryProps[];
}

export default function SideNav({entries}: SideNavProps) {
  return (
    <nav className={styles.menu}>
      {entries.map((entry, index) => {
        return <SideNavEntry key={index} {...entry} />
      })}
    </nav>
  );
}
