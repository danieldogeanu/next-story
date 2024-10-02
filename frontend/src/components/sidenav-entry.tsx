'use client';

import Link, { LinkProps } from 'next/link';
import { NavLink, NavLinkProps } from '@mantine/core';
import { usePathname } from 'next/navigation';
import DynamicIcon, { IconKeys } from '@/components/dynamic-icon';
import styles from '@/styles/sidenav.module.scss';

export interface SideNavEntryProps extends 
  Omit<NavLinkProps, 'label'>, Omit<LinkProps, 'href'> {
  href: string;
  label: string;
  icon?: IconKeys;
  submenu?: SideNavEntryProps[];
}

export default function SideNavEntry({href, label, icon, submenu, ...otherProps}: SideNavEntryProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (pathname === href);
  const hasSubmenu = () => (submenu !== undefined && submenu.length > 0);
  const propsWithIcon: Partial<SideNavEntryProps> = icon ? {
    ...otherProps, leftSection: <DynamicIcon icon={icon} />
  } : otherProps;

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
