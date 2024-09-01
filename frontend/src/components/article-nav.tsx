import classNames from 'classnames';
import NextLink from 'next/link';
import { Fragment } from 'react';
import { ActionIcon, Divider, Group, Stack, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { SingleArticle, SingleArticleData } from '@/data/articles';
import { makeSeoTitle } from '@/utils/client/seo';
import { getArticleUrl } from '@/utils/urls';
import styles from '@/styles/article-nav.module.scss';


export interface ArticleNavProps extends React.HTMLAttributes<HTMLElement> {
  prev: SingleArticleData | undefined;
  next: SingleArticleData | undefined;
}

export default function ArticleNav({prev, next, className, ...other}: ArticleNavProps) {
  // Process previous article data.
  const prevArticleData = prev?.attributes as SingleArticle;
  const prevArticleTitle = makeSeoTitle(prevArticleData?.title);
  const prevArticleLabel = `Previous Article: ${prevArticleTitle}`;
  const prevArticleUrl = getArticleUrl(prevArticleData?.createdAt, prevArticleData?.slug);
  
  // Process next article data.
  const nextArticleData = next?.attributes as SingleArticle;
  const nextArticleTitle = makeSeoTitle(nextArticleData?.title);
  const nextArticleLabel = `Next Article: ${nextArticleTitle}`;
  const nextArticleUrl = getArticleUrl(nextArticleData?.createdAt, nextArticleData?.slug);
  
  return (
    <nav className={classNames(styles.container, className)} {...other}>

      <Group 
        title={prevArticleLabel}
        className={classNames(styles.side, styles.prev)}
        justify='flex-start' align='stretch' wrap='nowrap'>

        {(typeof prev !== 'undefined') && (
          <Fragment>
            <ActionIcon
              className={styles.navButton}
              component={NextLink}
              href={prevArticleUrl || ''}
              aria-label={prevArticleLabel}
              rel='prev'
              variant='default'
              radius='md'
              size='xl'>
              <IconChevronLeft size={24} stroke={1.5} />
            </ActionIcon>

            <Stack
              className={styles.textStack}
              align='flex-start' justify='center' gap='xs'>
              <Text className={styles.label}>Previous Article</Text>
              <Text className={styles.title} component={NextLink} href={prevArticleUrl || ''} rel='prev'>
                {prevArticleTitle}
              </Text>
            </Stack>
          </Fragment>
        )}

      </Group>

      <Divider className={styles.divider} orientation='vertical' />

      <Group
        title={nextArticleLabel}
        className={classNames(styles.side, styles.next)}
        justify='flex-end' align='stretch' wrap='nowrap'>

        {(typeof next !== 'undefined') && (
          <Fragment>
            <Stack
              className={styles.textStack}
              align='flex-end' justify='center' gap='xs'>
              <Text className={styles.label}>Next Article</Text>
              <Text className={styles.title} component={NextLink} href={nextArticleUrl || ''} rel='next'>
                {nextArticleTitle}
              </Text>
            </Stack>

            <ActionIcon
              className={styles.navButton}
              component={NextLink}
              href={nextArticleUrl || ''}
              aria-label={nextArticleLabel}
              rel='next'
              variant='default'
              radius='md'
              size='xl'>
              <IconChevronRight size={24} stroke={1.5} />
            </ActionIcon>
          </Fragment>
        )}

      </Group>

    </nav>
  );
}
