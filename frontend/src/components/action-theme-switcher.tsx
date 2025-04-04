'use client';

import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import ActionEntry from '@/components/action-entry';

export default function ActionThemeSwitcher({...otherProps}) {
  const {toggleColorScheme} = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <ActionEntry 
      label='Switch Theme' 
      icon={(computedColorScheme === 'light') ? IconMoonStars : IconSun}
      onClick={toggleColorScheme}
      {...otherProps}
    />
  );
}
