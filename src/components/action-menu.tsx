'use client';

import { IconMoonStars, IconSearch, IconUser } from '@tabler/icons-react';
import ActionEntry from './action-entry';
import styles from '@/styles/action-menu.module.scss';

export default function ActionMenu() {
  return (
    <div className={styles.container}>
      <ActionEntry icon={IconSearch} label='Search' />
      <ActionEntry icon={IconMoonStars} label='Switch Theme' />
      <ActionEntry icon={IconUser} label='User Account' />
    </div>
  );
}
