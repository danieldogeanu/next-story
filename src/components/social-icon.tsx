'use client';

import { ActionIcon, ActionIconProps, ElementProps, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';

export interface SocialIconProps extends ActionIconProps, ElementProps<'a', keyof ActionIconProps> {
  icon: React.FC<TablerIconsProps>;
  label: string;
  href: string;
}

export default function SocialIcon({icon, label, href, ...other}: SocialIconProps) {
  const TablerIcon = icon;
  const {colors} = useMantineTheme();
  const {colorScheme} = useMantineColorScheme();
  const linkColor = (colorScheme === 'light') ? colors.gray[6] : colors.gray[3];

  return (
    <ActionIcon 
      component='a'
      variant='subtle'
      size='xl' radius='xl'
      aria-label={label} title={label}
      color={linkColor}
      href={href}
      target='_blank'
      referrerPolicy='no-referrer'
      {...other}>
      <TablerIcon stroke={2} size={24} />
    </ActionIcon>
  );
}
