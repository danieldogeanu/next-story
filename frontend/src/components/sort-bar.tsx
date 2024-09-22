'use client';

import classNames from 'classnames';
import { useMediaQuery } from '@mantine/hooks';
import { ActionIcon, Box, Group, Select, Text } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { validateSortParam } from '@/validation/urls';
import { capitalize } from '@/utils/strings';
import styles from '@/styles/sort-bar.module.scss';


// Define the allowed sort props mapping for each collection.
const SortPropsMapping = {
  pages: ['id', 'title', 'createdAt', 'updatedAt'],
  articles: ['id', 'title', 'publishedAt', 'createdAt', 'updatedAt'],
  authors: ['id', 'fullName', 'createdAt', 'updatedAt'],
  categories: ['id', 'name', 'createdAt', 'updatedAt'],
  tags: ['id', 'name', 'createdAt', 'updatedAt'],
  comments: ['id', 'createdAt', 'updatedAt'],
} as const;

// Define the labels for each of the sort props.
const sortSelectData = [
  { value: 'id', label: 'ID' },
  { value: 'title', label: 'Title' },
  { value: 'fullName', label: 'Author Name' },
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
  { value: 'publishedAt', label: 'Published Date' },
];

// Define the types for sort order and sort collection.
export type SortOrder = 'asc' | 'desc';
export type SortCombined = `${string}:${SortOrder}`;
export type SortCollection = keyof typeof SortPropsMapping;

export interface SortBarProps {
  totalItems: number;
  collectionType: SortCollection;
}

export default function SortBar({ totalItems, collectionType }: SortBarProps) {
  const isMobile = useMediaQuery(`(max-width: 480px)`, false);
  const actionButtonSize = isMobile ? 'lg' : 'md';
  const actionIconSize = isMobile ? 36 : 24;
  const sortSelectSize = isMobile ? 'md' : 'sm';
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the sort param from the URL, or set the default one.
  const sortParam = searchParams.get('sort') ?? 'id:desc';

  // Get the allowed sort props for the current collection type.
  const allowedSortProps = Array.from(SortPropsMapping[collectionType]);

  // Validate the sort param based on the allowed sort props.
  let validatedSortParam = validateSortParam(sortParam, allowedSortProps);

  // Handle the validated sort param based on its type.
  // If it's an array, use the first value, if it's not valid, set a default value.
  if (Array.isArray(validatedSortParam)) {
    validatedSortParam = validatedSortParam[0];
  } else if (!validatedSortParam || typeof validatedSortParam !== 'string') {
    validatedSortParam = 'id:desc';
  }

  // Split the validated sort param into sortProp and sortOrder.
  let [sortProp, sortOrder] = validatedSortParam.split(':') as [string, SortOrder | undefined];

  // The default sort order for Strapi is `asc`, so we should set our `sortOrder` to that if it's undefined.
  if (!sortOrder) sortOrder = 'asc';

  // Filter the `sortSelectData` to only include allowed sort props for the collection.
  const filteredSortSelectData = sortSelectData.filter((option) => {
    return (allowedSortProps as readonly string[]).includes(option.value as string);
  });

  // We need a handler that can set the sort order independently for each button (asc/desc).
  const setSortOrder = (newOrder: SortOrder) => {
    const newSortParam = `${sortProp}:${newOrder}`;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('sort', newSortParam);
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <Box className={styles.container}>
      <Text className={styles.total}>
        {totalItems} {capitalize(collectionType)}
      </Text>

      <Group className={styles.order} justify='flex-end' gap={0}>
        <ActionIcon
          className={classNames(styles.chevron, styles.up)}
          onClick={() => setSortOrder('asc')}
          disabled={sortOrder === 'asc'}
          size={actionButtonSize}
          title='Ascending'
          aria-label='Ascending'
          variant='transparent'>
          <IconChevronUp size={actionIconSize} stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          className={classNames(styles.chevron, styles.down)}
          onClick={() => setSortOrder('desc')}
          disabled={sortOrder === 'desc'}
          size={actionButtonSize}
          title='Descending'
          aria-label='Descending'
          variant='transparent'>
          <IconChevronDown size={actionIconSize} stroke={1.5} />
        </ActionIcon>
      </Group>

      <Select
        className={styles.sort}
        data={filteredSortSelectData}
        size={sortSelectSize}
        defaultValue={sortProp}
        withCheckIcon={false}
        aria-label='Sort by:'
        title='Sort by:'
        onChange={(value) => {
          const newSortParam = `${value}:${sortOrder || 'desc'}`;
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.set('sort', newSortParam);
          router.push(`?${newSearchParams.toString()}`);
        }}
      />
    </Box>
  );
}
