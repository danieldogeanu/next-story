'use client';

import Link from 'next/link';
import { Button } from '@mantine/core';
import { usePathname } from 'next/navigation';

export interface NavEntryProps {
  href: string;
  children: React.ReactNode;
}

export default function NavEntry({href, children}: NavEntryProps) {
  const pathname = usePathname();
  const isActive = () => (pathname === href);

  return (
    <Button
      component={Link}
      href={href}
      color='dark'
      variant={isActive() ? 'light' : 'subtle'}
    >{children}</Button>
  );
}
