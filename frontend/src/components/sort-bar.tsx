'use client';

import { ActionIcon, Box, Group, Select, Text } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import classNames from 'classnames';
import styles from '@/styles/sort-bar.module.scss';


export default function SortBar() {
  const sortSelectData = [
    { value: 'publishedAt', label: 'Published Date' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <Box className={styles.container}>
      
      <Text className={styles.total}>156 Articles</Text>

      <Group className={styles.order} justify='flex-end' gap={0}>
        <ActionIcon
          className={classNames(styles.chevron, styles.up)}
          variant='transparent'
          title='Ascending'
          aria-label='Ascending'>
          <IconChevronUp size={24} stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          className={classNames(styles.chevron, styles.down)}
          variant='transparent'
          title='Descending'
          aria-label='Descending'>
          <IconChevronDown size={24} stroke={1.5} />
        </ActionIcon>
      </Group>

      <Select
        className={styles.sort}
        data={sortSelectData}
        defaultValue='publishedAt'
        withCheckIcon={false}
        aria-label='Sort by:'
        title='Sort by:' />
    </Box>
  );
}
