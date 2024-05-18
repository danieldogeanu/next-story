'use client';

import { IconMenuDeep } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { mockSiteNavEntries } from '@/data/mock';
import { SideNavEntryProps } from './sidenav-entry';
import ActionEntry from '@/components/action-entry';
import SiteDrawer from '@/components/site-drawer';
import SideNav from '@/components/sidenav';

export default function ActionMobileNav({...props}) {
  const [opened, {open, close}] = useDisclosure(false);
  const mobileNavEntries: SideNavEntryProps[] = mockSiteNavEntries;

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
