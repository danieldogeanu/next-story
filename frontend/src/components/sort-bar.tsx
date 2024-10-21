'use client';

import classNames from 'classnames';
import { useMediaQuery } from '@mantine/hooks';
import { ActionIcon, Box, BoxProps, Group, Select, Skeleton, Text } from '@mantine/core';
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

// Define the types for sort order, sort props and sort collection.
export type SortOrder = 'asc' | 'desc';
export type SortProps = typeof SortPropsMapping[keyof typeof SortPropsMapping][number];
export type SortCombined = `${SortProps}:${SortOrder}`;
export type SortCollection = keyof typeof SortPropsMapping;

export interface SortBarProps extends BoxProps {
  totalItems: number;
  collectionType: SortCollection;
}

export default function SortBar({ totalItems, collectionType, className, ...otherProps }: SortBarProps) {
  const isMobile = useMediaQuery(`(max-width: 480px)`, false);
  const actionButtonSize = isMobile ? 'lg' : 'md';
  const actionIconSize = isMobile ? 36 : 24;
  const sortSelectSize = isMobile ? 'md' : 'sm';
  const defaultSortParam = 'createdAt:desc';
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the current sort param from the URL, or use the default one.
  const sortParam = searchParams.get('sort') ?? defaultSortParam;

  // Get the allowed sort props for the current collection type.
  const allowedSortProps = Array.from(SortPropsMapping[collectionType]);

  // Validate the sort param based on the allowed sort props.
  let validatedSortParam = validateSortParam(sortParam, allowedSortProps);

  // Handle the validated sort param based on its type.
  // If it's an array, use the first value, if it's not valid, use the default value.
  if (Array.isArray(validatedSortParam)) {
    validatedSortParam = validatedSortParam[0];
  } else if (!validatedSortParam || typeof validatedSortParam !== 'string') {
    validatedSortParam = defaultSortParam;
  }

  // Split the validated sort param into sortProp and sortOrder.
  let [sortProp, sortOrder] = validatedSortParam.split(':') as [string, SortOrder | undefined];

  // We should set a default sort order in case we don't receive one through the URL.
  // The default sort order for Strapi is `asc`, we should use that.
  if (!sortOrder) sortOrder = 'asc';

  // Filter the `sortSelectData` to only include allowed sort props for the collection.
  const filteredSortSelectData = sortSelectData.filter((option) => {
    return (allowedSortProps as readonly string[]).includes(option.value as string);
  });

  // Helper function to update the search params in the URL.
  const updateSearchParams = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(key, value);
    router.push(`?${newSearchParams.toString()}`);
  };

  // Update the sort order in the URL independently for each button (asc/desc).
  const handleSortOrderChange = (newOrder: SortOrder) => {
    const newSortParam = `${sortProp}:${newOrder}`;
    updateSearchParams('sort', newSortParam);
  };

  // Update the sort prop in the URL, for the (Sort by) select dropdown.
  const handleSortPropChange = (value: string | null) => {
    if (value === null) return;
    const newSortParam = `${value}:${sortOrder}`;
    updateSearchParams('sort', newSortParam);
  };

  // Set correct labels to the buttons, including the selected sort order.
  const setButtonTitle = (sortDirection: SortOrder) => {
    const labels = { asc: 'Ascending', desc: 'Descending' };
    const activeLabel = (sortOrder === sortDirection) ? ' (Selected)' : '';
    return labels[sortDirection] + activeLabel;
  };

  // Set correct label for the select dropdown, including the current sort prop label.
  const setSelectTitle = () => {
    const selectedPropLabel = filteredSortSelectData.find(item => item.value === sortProp)?.label;
    return `Sort by: ${selectedPropLabel}`;
  };

  return (
    <Box className={classNames(styles.container, className)} {...otherProps}>
      <Text className={styles.total}>
        {totalItems} {capitalize(collectionType)}
      </Text>

      <Group className={styles.order} gap={0}>
        <ActionIcon
          className={classNames(styles.chevron, styles.up)}
          onClick={() => handleSortOrderChange('asc')}
          disabled={sortOrder === 'asc'}
          size={actionButtonSize}
          title={setButtonTitle('asc')}
          aria-label={setButtonTitle('asc')}
          variant='transparent'>
          <IconChevronUp size={actionIconSize} stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          className={classNames(styles.chevron, styles.down)}
          onClick={() => handleSortOrderChange('desc')}
          disabled={sortOrder === 'desc'}
          size={actionButtonSize}
          title={setButtonTitle('desc')}
          aria-label={setButtonTitle('desc')}
          variant='transparent'>
          <IconChevronDown size={actionIconSize} stroke={1.5} />
        </ActionIcon>
      </Group>

      <Select
        className={styles.sort}
        classNames={{dropdown: styles.sortDropdown}}
        data={filteredSortSelectData}
        size={sortSelectSize}
        value={sortProp}
        withCheckIcon={false}
        aria-label={setSelectTitle()}
        title={setSelectTitle()}
        onChange={handleSortPropChange}
      />
    </Box>
  );
}

// Fallback component for use in `Suspense`.
export function SortFallback() {
  const isMobile = useMediaQuery(`(max-width: 480px)`, false);
  return (
    <Box className={classNames(styles.container, styles.fallback)}>
      <Skeleton height={isMobile ? 42 : 36} radius='sm' />
    </Box>
  );
}
