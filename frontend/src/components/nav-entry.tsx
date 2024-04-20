'use client';

import Link from 'next/link';
import { Button, Menu } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { NavEntryItem } from '@/data/types';
import { useState } from 'react';
import classNames from 'classnames';
import styles from '@/styles/sitenav.module.scss';

export interface NavEntryProps extends Omit<NavEntryItem, 'icon'> {}

export default function NavEntry({href, label, submenu}: NavEntryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => (pathname === href);
  const hasSubmenu = () => (submenu !== undefined && submenu.length > 0);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  return (
    <>
      {hasSubmenu() ?
        <Menu
          trigger='click'
          shadow='md'
          width={200}
          loop={false}
          withinPortal={false}
          trapFocus={false}
          menuItemTabIndex={0}
          opened={submenuOpened}
          onChange={setSubmenuOpened}
        >
          <Menu.Target>
            <Button
              component={Link}
              href={href}
              color='dark'
              variant={isActive(href) ? 'light' : 'subtle'}
              className={styles.navEntry}
              rightSection={submenuOpened ? <IconChevronUp /> : <IconChevronDown />}
              onClick={(e) => {
                if (submenuOpened) router.push(href);
                else e.preventDefault();
              }}
            >{label}</Button>
          </Menu.Target>

          <Menu.Dropdown className={styles.subMenuDropdown}>
            {submenu && submenu.map((item, index) => (
              <Menu.Item 
                key={index}
                component={Link}
                href={item.href}
                className={classNames(
                  styles.subMenuItem,
                  {[styles.active]: isActive(item.href)}
                )}
              >{item.label}</Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        :
        <Button
          component={Link}
          href={href}
          color='dark'
          variant={isActive(href) ? 'light' : 'subtle'}
          className={styles.navEntry}
        >{label}</Button>
      }
    </>
  );
}
