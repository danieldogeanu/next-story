'use client';

import Link, { LinkProps } from 'next/link';
import { NavLink, NavLinkProps } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { NavEntryItem } from '@/data/types';
import DynamicIcon from '@/components/dynamic-icon';
import styles from '@/styles/sidenav.module.scss';

export interface SideNavEntryProps extends NavEntryItem, Omit<NavLinkProps, 'label'>, Omit<LinkProps, 'href'> {}

export default function SideNavEntry({href, label, icon, submenu, ...props}: SideNavEntryProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (pathname === href);
  const hasSubmenu = () => (submenu !== undefined && submenu.length > 0);
  const propsWithIcon: Partial<SideNavEntryProps> = icon ? {...props, leftSection: <DynamicIcon icon={icon} />} : props;

  return hasSubmenu() ? (
    <NavLink
      component={Link}
      href={href}
      label={label}
      active={isActive(href)}
      className={styles.entry}
      color='dark'
      {...propsWithIcon}>
      {submenu?.map((item, index) => {
        return <SideNavEntry key={index} {...item} />;
      })}
    </NavLink>
  ) : (
    <NavLink
      component={Link}
      href={href}
      label={label}
      active={isActive(href)}
      className={styles.entry}
      color='dark'
      {...propsWithIcon}
    />
  );
}
