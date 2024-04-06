'use client';

import { IconMenuDeep, IconSearch, IconUser } from '@tabler/icons-react';
import ActionEntry from '@/components/action-entry';
import ThemeSwitcher from '@/components/theme-switcher';
import styles from '@/styles/action-menu.module.scss';

export default function ActionMenu() {
  return (
    <div className={styles.container}>
      <ActionEntry 
        icon={IconSearch} label='Search' 
      />
      <ThemeSwitcher className={styles.hideSmallMobile} />
      <ActionEntry 
        className={styles.hideSmallMobile} 
        icon={IconUser} label='User Account' 
      />
      <ActionEntry 
        className={styles.mobileNav} 
        icon={IconMenuDeep} label='Navigation' 
      />
    </div>
  );
}
