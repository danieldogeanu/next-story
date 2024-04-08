'use client';

import { IconCategory, IconHome, IconInfoSquareRounded, IconMail, IconMenuDeep } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ActionEntry from '@/components/action-entry';
import SiteDrawer from '@/components/site-drawer';
import SideNav from '@/components/sidenav';
import { SideNavEntryProps } from '@/components/sidenav-entry';
import styles from '@/styles/action-mobile-nav.module.scss';

export default function ActionMobileNav({...props}) {
  const [opened, {open, close}] = useDisclosure(false);

  // TODO: Replace mockup data with entries from the server.
  // TODO: Maybe move all mock data to a separate file.
  const mobileNavEntries: SideNavEntryProps[] = [
    { href: '/', label: 'Home', icon: <IconHome /> },
    { href: '/about', label: 'About', icon: <IconInfoSquareRounded /> },
    { href: '/categories', label: 'Categories', icon: <IconCategory />, submenu: [
      { href: '/categories/first', label: 'First' },
      { href: '/categories/second', label: 'Second' },
      { href: '/categories/third', label: 'Third' },
      { href: '/categories/fourth', label: 'Fourth' },
      { href: '/categories/fifth', label: 'Fifth' },
    ] },
    { href: '/contact', label: 'Contact', icon: <IconMail /> },
  ];

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
