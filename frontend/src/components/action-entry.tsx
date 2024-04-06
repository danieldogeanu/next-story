'use client';

import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { ForwardedRef, forwardRef } from 'react';
import { useViewportSize } from '@mantine/hooks';
import { TablerIconsProps } from '@tabler/icons-react';

export interface ActionEntryProps extends 
  ActionIconProps, ElementProps<'button', keyof ActionIconProps> {
  icon: React.FC<TablerIconsProps>;
  label: string;
}

const ActionEntry = forwardRef(function ActionEntry(
  {icon, label, ...other}: ActionEntryProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const {width} = useViewportSize();
  const TablerIcon = icon;
  
  return (
    <ActionIcon 
      variant='subtle' color='dark' 
      size={(width > 360) ? 'xl' : 'lg'}
      aria-label={label} title={label}
      {...other} ref={ref}>
      <TablerIcon stroke={2} size={24} />
    </ActionIcon>
  );
});

export default ActionEntry;
