'use client';

import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import ActionEntry from '@/components/action-entry';

export default function ThemeSwitcher({...props}) {
  const {toggleColorScheme} = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <ActionEntry 
      label='Switch Theme' 
      icon={(computedColorScheme === 'light') ? IconMoonStars : IconSun}
      onClick={toggleColorScheme}
      {...props}
    />
  );
}
