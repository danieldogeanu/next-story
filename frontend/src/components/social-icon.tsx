'use client';

import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { TablerIconsProps } from '@tabler/icons-react';

export interface SocialIconProps extends ActionIconProps, ElementProps<'a', keyof ActionIconProps> {
  icon: React.FC<TablerIconsProps>;
  label: string;
  href: string;
}

// TODO: Refactor the code to fix the type of icon so that it can be used as a React component. 
// TODO: React.FC<TablerIconsProps> is the correct type, change it in the other interfaces as well!

export default function SocialIcon({icon: TablerIcon, label, href, ...other}: SocialIconProps) {
  const {width} = useViewportSize();

  return (
    <ActionIcon 
      component='a'
      variant='subtle'
      radius='xl'
      size={(width > 360) ? 'xl' : 'lg'}
      aria-label={label} title={label}
      href={href}
      target='_blank'
      referrerPolicy='no-referrer'
      {...other}>
      <TablerIcon stroke={2} size={24} />
    </ActionIcon>
  );
}
