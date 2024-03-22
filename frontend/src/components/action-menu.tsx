'use client';

import { IconMoonStars, IconSearch, IconSun, IconUser } from '@tabler/icons-react';
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import ActionEntry from '@/components/action-entry';
import styles from '@/styles/action-menu.module.scss';

export default function ActionMenu() {
  // Enable theme color scheme switcher.
  const {toggleColorScheme} = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const themeIcon = computedColorScheme === 'light' ? IconMoonStars : IconSun;

  return (
    <div className={styles.container}>
      <ActionEntry icon={IconSearch} label='Search' />
      <ActionEntry icon={themeIcon} label='Switch Theme' onClick={toggleColorScheme} />
      <ActionEntry icon={IconUser} label='User Account' />
    </div>
  );
}
