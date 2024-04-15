import { NavLinkProps } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { LinkProps } from 'next/link';

/**
 * NavEntryProps is the interface that we use after we fetched and
 * converted the icons from string to ReactElement.
 */
export interface NavEntryProps extends NavLinkProps, LinkProps {
  href: string;
  icon?: React.ReactElement<TablerIconsProps>;
  submenu?: NavEntryProps[];
}

/**
 * Icons fetched from the server must be in string format.
 * We only convert them to ReactElement after we get the data from the server.
 */
export interface FetchedNavEntryProps extends NavLinkProps, LinkProps {
  href: string;
  icon?: string;
  submenu?: FetchedNavEntryProps[];
}
