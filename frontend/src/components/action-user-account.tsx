'use client';

import { IconUser } from '@tabler/icons-react';
import ActionEntry from '@/components/action-entry';

export default function ActionUserAccount({...props}) {
  return (
    <ActionEntry 
      label='User Account'
      icon={IconUser}
      {...props}
    />
  );
}
