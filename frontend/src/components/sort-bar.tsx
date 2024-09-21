'use client';

import classNames from 'classnames';
import { useMediaQuery } from '@mantine/hooks';
import { ActionIcon, Box, Group, Select, Text } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import styles from '@/styles/sort-bar.module.scss';


// Construct the allowed sort props and collections for the SortBar.
export type SortCollection = 'pages' | 'articles' | 'authors' | 'categories' | 'tags' | 'comments';
export type SortProps = 'id' | 'name' | 'title' | 'fullName' | 'createdAt' | 'updatedAt' | 'publishedAt';
export type SortOrder = 'asc' | 'desc';
export type SortCombined = `${SortProps}:${SortOrder}`;
export type SortValue = SortProps | SortCombined;

export interface SortBarProps {
  totalItems: number;
  collectionType: SortCollection;
}

export default function SortBar({totalItems, collectionType}: SortBarProps) {
  const isMobile = useMediaQuery(`(max-width: 480px)`, false);
  const actionButtonSize = isMobile ? 'lg' : 'md';
  const actionIconSize = isMobile ? 36 : 24;
  const sortSelectSize = isMobile ? 'md' : 'sm';
  const sortSelectData = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Title' },
    { value: 'name', label: 'Name' },
    { value: 'fullName', label: 'Author Name' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'publishedAt', label: 'Published Date' },
  ];

  return (
    <Box className={styles.container}>
      
      <Text className={styles.total}>156 Articles</Text>

      <Group className={styles.order} justify='flex-end' gap={0}>
        <ActionIcon
          className={classNames(styles.chevron, styles.up)}
          size={actionButtonSize}
          variant='transparent'
          title='Ascending'
          aria-label='Ascending'>
          <IconChevronUp size={actionIconSize} stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          className={classNames(styles.chevron, styles.down)}
          size={actionButtonSize}
          variant='transparent'
          title='Descending'
          aria-label='Descending'>
          <IconChevronDown size={actionIconSize} stroke={1.5} />
        </ActionIcon>
      </Group>

      <Select
        className={styles.sort}
        data={sortSelectData}
        size={sortSelectSize}
        defaultValue='publishedAt'
        withCheckIcon={false}
        aria-label='Sort by:'
        title='Sort by:' />
    </Box>
  );
}
