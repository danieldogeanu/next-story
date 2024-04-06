'use client';

import { IconMenuDeep } from '@tabler/icons-react';
import ActionEntry from '@/components/action-entry';

export default function ActionMobileNav({...props}) {
  return (
    <ActionEntry
      label='Navigation'
      icon={IconMenuDeep}
      {...props}
    />
  );
}
