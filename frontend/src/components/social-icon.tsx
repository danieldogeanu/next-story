'use client';

import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import DynamicIcon, { IconKeys } from '@/components/dynamic-icon';

export interface SocialIconProps extends ActionIconProps, 
  Omit<ElementProps<'a', keyof ActionIconProps>, 'href'> {
  href: string;
  label: string;
  icon: IconKeys;
}

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
