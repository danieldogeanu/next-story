'use client';

import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';

export interface ActionEntryProps extends ActionIconProps, ElementProps<'button', keyof ActionIconProps> {
  icon: React.FC<TablerIconsProps>;
  label: string;
}

export default function ActionEntry({icon, label, ...other}: ActionEntryProps) {
  const TablerIcon = icon;

  return (
    <ActionIcon 
      variant='subtle'
      size='xl' color='dark' 
      aria-label={label} title={label}
      {...other}>
      <TablerIcon stroke={2} size={24} />
    </ActionIcon>
  );
}
