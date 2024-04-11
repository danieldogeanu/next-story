'use client';

import { NavLink, NavLinkProps } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/sidenav.module.scss';

export interface SideNavEntryProps extends NavLinkProps, LinkProps {
  href: string;
  icon?: React.ReactElement<TablerIconsProps>;
  submenu?: SideNavEntryProps[];
}

export default function SideNavEntry({href, label, icon, submenu, ...props}: SideNavEntryProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (pathname === href);
  const hasSubmenu = () => (submenu !== undefined && submenu.length > 0);
  const propsWithIcon: Partial<SideNavEntryProps> = icon ? {...props, leftSection: icon} : props;

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
