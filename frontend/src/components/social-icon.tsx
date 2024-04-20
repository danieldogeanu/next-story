'use client';

import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { SocialEntryItem } from '@/data/types';
import DynamicIcon from '@/components/dynamic-icon';

export interface SocialIconProps extends SocialEntryItem, ActionIconProps, 
  Omit<ElementProps<'a', keyof ActionIconProps>, 'href'> {}

export default function SocialIcon({icon, label, href, ...other}: SocialIconProps) {
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
      <DynamicIcon icon={icon} stroke={2} size={24} />
    </ActionIcon>
  );
}
