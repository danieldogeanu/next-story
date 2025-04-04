'use client';

import { IconMenuDeep } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { ModalBaseCloseButtonProps } from '@mantine/core';
import { SideNavEntryProps } from '@/components/sidenav-entry';
import { SingleNavResponse } from '@/data/navigation';
import ActionEntry from '@/components/action-entry';
import SiteDrawer from '@/components/site-drawer';
import SideNav from '@/components/sidenav';

export interface ActionMobileNavProps extends 
  React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement> {
  data: SingleNavResponse[];
}

// Add extra property for the modal close button.
type ModalExtraCloseButtonProps = ModalBaseCloseButtonProps & { 'data-event-name'?: string };

export default function ActionMobileNav({data, ...otherProps}: ActionMobileNavProps) {
  const [opened, {open, close}] = useDisclosure(false);

  // Map the Strapi response to match the SideNavEntryProps props shape.
  // TODO: Refactor this mapping to be recursive, so that it can map any level of submenu depth.
  const mobileNavEntries = data && data.map((item) => {
    const entry: SideNavEntryProps = {
      href: item.path || '',
      label: item.title,
    };

    // Add icon if the menu entry has an icon.
    if (item.icon !== '') entry.icon = item.icon;

    // Add submenu if the menu entry has children entries.
    if (item.items.length > 0) entry.submenu = item.items.map((subItem) => ({
      href: subItem.path || '',
      label: subItem.title,
    }));

    return entry;
  }) as SideNavEntryProps[];

  return (
    <>
      <ActionEntry
        label='Navigation'
        icon={IconMenuDeep}
        variant={opened ? 'light' : 'subtle'}
        onClick={open}
        {...otherProps}
      />

      <SiteDrawer
        title='Navigation'
        size='auto'
        opened={opened}
        onClose={close}
        closeButtonProps={{
          'data-event-name': 'Site Drawer - Close',
        } as ModalExtraCloseButtonProps}
        hasMenu>

        <SideNav entries={mobileNavEntries} />

      </SiteDrawer>
    </>
  );
}
