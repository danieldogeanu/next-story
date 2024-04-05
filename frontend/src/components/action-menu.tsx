'use client';

import { IconMenuDeep, IconMoonStars, IconSearch, IconSun, IconUser } from '@tabler/icons-react';
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
      <ActionEntry 
        icon={IconSearch} label='Search' 
      />
      <ActionEntry 
        className={styles.hideSmallMobile} 
        icon={themeIcon} label='Switch Theme' 
        onClick={toggleColorScheme} 
      />
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
