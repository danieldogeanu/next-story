import NextImage from 'next/image';
import Link from 'next/link';
import path from 'node:path';
import { ActionIcon, Box, Card, CardSection, Group, Image, Text, Title } from '@mantine/core';
import { IconArrowNarrowRight, IconEyeFilled } from '@tabler/icons-react';
import { convertToReadableDate, convertToUnixTime } from '@/utils/date';
import { ArticleAuthor, ArticleCategory, ArticleCover, SingleArticle } from '@/data/articles';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import { getFileURL } from '@/data/files';
import styles from '@/styles/article-card.module.scss';

export interface ArticleCardProps {
  data: SingleArticle;
}

export default function ArticleCard({data}: ArticleCardProps) {
  const articleHref = path.join('/articles', convertToUnixTime(data.createdAt), data.slug);
  const articleCover = data?.cover?.data?.attributes as ArticleCover;
  const articleCoverFormats = articleCover?.formats as unknown as StrapiImageFormats;
  const articleCoverUrl = (articleCoverFormats?.small?.url) ? getFileURL(articleCoverFormats.small.url) : '';
  const articleCategory = data.category?.data?.attributes as ArticleCategory;
  const articleCategoryHref = path.join('/categories', articleCategory?.slug || '');
  const articleAuthor = data.author?.data?.attributes as ArticleAuthor;
  const articleAuthorHref = path.join('/authors', articleAuthor?.slug || '');
  
  // TODO: Add image fallback in case the `articleCoverUrl` is undefined.

  return (
    <Card
      className={styles.card}
      component='article'
      padding='xs'
      radius='md'>

      <CardSection
        className={styles.cover}
        component={Link}
        href={articleHref}
        title='Read Article'>
        <Box className={styles.preview}>
          <IconEyeFilled size={120} />
          <Image
            component={NextImage}
            src={articleCoverUrl}
            width={articleCoverFormats?.small?.width}
            height={articleCoverFormats?.small?.height}
            alt={articleCover?.alternativeText || ''}
            h={200} radius='md' />
        </Box>
      </CardSection>
      
      <Group className={styles.meta} justify='space-between'>
        <Text title='Category'>
          <Link href={articleCategoryHref}>
            {capitalize(articleCategory?.name as string)}
          </Link>
        </Text>
        <Text className={styles.date} title='Date Created'>
          <span className={styles.long}>
            {convertToReadableDate(data.createdAt, 'long')}
          </span>
          <span className={styles.short}>
            {convertToReadableDate(data.createdAt, 'short')}
          </span>
        </Text>
      </Group>

      <Link href={articleHref} title={capitalize(data.title)}>
        <Title className={styles.title} order={2}>
          {capitalize(data.title.substring(0, 60))}
        </Title>
      </Link>

      <Group className={styles.author} justify='space-between'>
        <Text title='Author'>
          <Link href={articleAuthorHref}>
            {capitalize(articleAuthor?.fullName as string)}
          </Link>
        </Text>
        <ActionIcon 
          component={Link}
          href={articleHref}
          size='lg' variant='subtle'
          title='Read Article'
          aria-label='Read Article'>
          <IconArrowNarrowRight size={24} stroke={1.5} />
        </ActionIcon>
      </Group>

    </Card>
  );
}
