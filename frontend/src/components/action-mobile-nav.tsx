'use client';

import { IconMenuDeep } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ActionEntry from '@/components/action-entry';
import SiteDrawer from '@/components/site-drawer';
import SideNav from '@/components/sidenav';
import { mockSiteNavEntries } from '@/data/mock';
import { NavEntryProps } from '@/data/types';
import { convertDynamicIcons } from '@/utils/convert-dynamic-icons';
import { useEffect, useState } from 'react';

export default function ActionMobileNav({...props}) {
  const [opened, {open, close}] = useDisclosure(false);
  const [mobileNavEntries, setMobileNavEntries] = useState<NavEntryProps[]>([]);
  
  useEffect(() => {
    // TODO: Replace mockup data with entries from the server.
    // Get SiteNavEntries and convert icons to `React.ReactElement<TablerIconsProps>`.
    // We must use `useEffect` in client components, because DynamicIcons is a server component.
    (async () => setMobileNavEntries(
      await convertDynamicIcons(mockSiteNavEntries) as NavEntryProps[]
    ))();
  });

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
