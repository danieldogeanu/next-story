import classNames from 'classnames';
import NextLink from 'next/link';
import { ActionIcon, Divider, Group, Stack, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { SingleArticleData } from '@/data/articles';
import styles from '@/styles/article-nav.module.scss';


export interface ArticleNavProps extends React.HTMLAttributes<HTMLElement> {
  prev: SingleArticleData | undefined;
  next: SingleArticleData | undefined;
}

export default function ArticleNav({prev, next, className, ...other}: ArticleNavProps) {
  
  return (
    <nav className={classNames(styles.container, className)} {...other}>

      <Group 
        title='Previous Article'
        className={classNames(styles.side, styles.prev)}
        justify='flex-start' align='stretch' wrap='nowrap'>

        <ActionIcon
          className={styles.navButton}
          component={NextLink}
          href='#'
          aria-label='Previous Article'
          variant='default'
          radius='md'
          size='xl'>
          <IconChevronLeft size={24} stroke={1.5} />
        </ActionIcon>

        <Stack
          className={styles.textStack}
          align='flex-start' justify='center' gap='xs'>
          <Text className={styles.label}>Previous Article</Text>
          <Text className={styles.title} component={NextLink} href='#'>Maecenas at sed lacinia mi tincidunt sapien</Text>
        </Stack>

      </Group>

      <Divider className={styles.divider} orientation='vertical' />

      <Group
        title='Next Article'
        className={classNames(styles.side, styles.next)}
        justify='flex-end' align='stretch' wrap='nowrap'>

        <Stack
          className={styles.textStack}
          align='flex-end' justify='center' gap='xs'>
          <Text className={styles.label}>Next Article</Text>
          <Text className={styles.title} component={NextLink} href='#'>Ut massa pellentesque nisi interdum mattis purus</Text>
        </Stack>

        <ActionIcon
          className={styles.navButton}
          component={NextLink}
          href='#'
          aria-label='Next Article'
          variant='default'
          radius='md'
          size='xl'>
          <IconChevronRight size={24} stroke={1.5} />
        </ActionIcon>

      </Group>

    </nav>
  );
}
