'use client';

import SideNavEntry, { SideNavEntryProps } from "@/components/sidenav-entry";
import styles from '@/styles/sidenav.module.scss';

export interface SideNavProps {
  entries: SideNavEntryProps[];
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
