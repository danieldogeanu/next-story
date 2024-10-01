'use client';

import { IconSearch } from '@tabler/icons-react';
import { showNotImplemented } from '@/utils/react';
import ActionEntry from '@/components/action-entry';

export default function ActionSearch({...props}) {
  return (
    <ActionEntry
      label='Search'
      icon={IconSearch}
      onClick={showNotImplemented}
      {...props}
    />
  );
}
