import { NavLinkProps } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { LinkProps } from 'next/link';

export interface NavEntryProps extends NavLinkProps, LinkProps {
  href: string;
  icon?: React.ReactElement<TablerIconsProps>;
  submenu?: NavEntryProps[];
}
