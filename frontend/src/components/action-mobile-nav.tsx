'use client';

import { IconMenuDeep } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ActionEntry from '@/components/action-entry';
import SiteDrawer from '@/components/site-drawer';
import styles from '@/styles/action-mobile-nav.module.scss';

export default function ActionMobileNav({...props}) {
  const [opened, {open, close}] = useDisclosure(false);

  return (
    <>
      <ActionEntry
        label='Navigation'
        icon={IconMenuDeep}
        variant={opened ? 'light' : 'subtle'}
        onClick={open}
        {...props}
      />

      <SiteDrawer
        title='Navigation'
        size={300}
        opened={opened}
        onClose={close}>

      </SiteDrawer>
    </>
  );
}
