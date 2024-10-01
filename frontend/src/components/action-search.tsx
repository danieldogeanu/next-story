'use client';

import { IconSearch, IconX } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import ActionEntry from '@/components/action-entry';

export default function ActionSearch({...props}) {
  return (
    <ActionEntry
      label='Search'
      icon={IconSearch}
      onClick={() => {
        showNotification({
          title: 'Not Implemented',
          message: 'The feature is not implemented yet.',
          autoClose: 4000,
          color: 'red',
          icon: <IconX stroke={1.5} size={24} />,
          limit: 1,
        });
      }}
      {...props}
    />
  );
}
