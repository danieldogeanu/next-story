'use client';

import { IconMenuDeep } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ActionEntry from '@/components/action-entry';
import SiteDrawer from '@/components/site-drawer';
import SideNav from '@/components/sidenav';
import { mockSiteNavEntries } from '@/data/mock';
import { NavEntryProps } from '@/data/types';
import styles from '@/styles/action-mobile-nav.module.scss';

export default function ActionMobileNav({...props}) {
  const [opened, {open, close}] = useDisclosure(false);

  // TODO: Replace mockup data with entries from the server.
  const mobileNavEntries: NavEntryProps[] = mockSiteNavEntries;

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
        size='auto'
        opened={opened}
        onClose={close}
        hasMenu>

        <SideNav entries={mobileNavEntries} />

      </SiteDrawer>
    </>
  );
}
