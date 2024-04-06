'use client';

import { IconMenuDeep, IconSearch } from '@tabler/icons-react';
import ActionEntry from '@/components/action-entry';
import ActionThemeSwitcher from '@/components/action-theme-switcher';
import ActionUserAccount from '@/components/action-user-account';
import styles from '@/styles/action-menu.module.scss';

export default function ActionMenu() {
  return (
    <div className={styles.container}>
      <ActionEntry  icon={IconSearch} label='Search' />
      <ActionThemeSwitcher className={styles.hideSmallMobile} />
      <ActionUserAccount className={styles.hideSmallMobile} />
      <ActionEntry className={styles.mobileNav} icon={IconMenuDeep} label='Navigation' />
    </div>
  );
}
