'use client';

import { IconMenuDeep } from '@tabler/icons-react';
import ActionEntry from '@/components/action-entry';
import ActionThemeSwitcher from '@/components/action-theme-switcher';
import ActionUserAccount from '@/components/action-user-account';
import ActionSearch from '@/components/action-search';
import styles from '@/styles/action-menu.module.scss';

export default function ActionMenu() {
  return (
    <div className={styles.container}>
      <ActionSearch />
      <ActionThemeSwitcher className={styles.hideSmallMobile} />
      <ActionUserAccount className={styles.hideSmallMobile} />
      <ActionEntry className={styles.mobileNav} icon={IconMenuDeep} label='Navigation' />
    </div>
  );
}
