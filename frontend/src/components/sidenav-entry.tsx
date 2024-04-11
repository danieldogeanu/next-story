'use client';

import { NavLink } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavEntryProps } from '@/data/types';
import styles from '@/styles/sidenav.module.scss';

export default function SideNavEntry({href, label, icon, submenu, ...props}: NavEntryProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (pathname === href);
  const hasSubmenu = () => (submenu !== undefined && submenu.length > 0);
  const propsWithIcon: Partial<NavEntryProps> = icon ? {...props, leftSection: icon} : props;

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
