import NextImage from 'next/image';
import Link from 'next/link';
import { IconArrowNarrowRight, IconEyeFilled } from '@tabler/icons-react';
import { ActionIcon, Box, Card, CardSection, Group, Image, Text, Title } from '@mantine/core';
import { ArticleAuthor, ArticleCategory, ArticleCover, SingleArticle } from '@/data/articles';
import { getArticleUrl, getFileURL, getPageUrl } from '@/utils/urls';
import { convertToReadableDate } from '@/utils/date';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import defaultCover from '@/assets/imgs/default-cover-small.webp';
import styles from '@/styles/article-card.module.scss';

export interface ArticleCardProps {
  data: SingleArticle;
}

export default function ArticleCard({data}: ArticleCardProps) {
  const articleUrl = getArticleUrl(data?.createdAt, data?.slug);
  const articleCover = data?.cover?.data?.attributes as ArticleCover;
  const articleCoverFormats = articleCover?.formats as unknown as StrapiImageFormats;
  const articleCoverUrl = (articleCoverFormats?.small?.url)
    ? getFileURL(articleCoverFormats.small.url) : getFileURL(defaultCover.src, 'frontend');
  const articleCategory = data.category?.data?.attributes as ArticleCategory;
  const articleCategoryUrl = getPageUrl(articleCategory?.slug, '/categories');
  const articleAuthor = data.author?.data?.attributes as ArticleAuthor;
  const articleAuthorUrl = getPageUrl(articleAuthor?.slug, '/authors');
  
  return (
    <Card
      className={styles.card}
      component='article'
      padding='xs'
      radius='md'>

      <CardSection
        className={styles.cover}
        component={Link}
        href={articleUrl || ''}
        title='Read Article'
        data-event-name='Article Card - Cover'>
        <Box className={styles.preview}>
          <IconEyeFilled size={120} />
          <Image
            component={NextImage}
            src={articleCoverUrl}
            width={articleCoverFormats?.small?.width ?? defaultCover.width}
            height={articleCoverFormats?.small?.height ?? defaultCover.height}
            alt={articleCover?.alternativeText || ''}
            h={200} radius='md' />
        </Box>
      </CardSection>
      
      <Group className={styles.meta} justify='space-between'>
        <Text title='Category'>
          <Link href={articleCategoryUrl || ''}
            data-event-name='Article Card - Category'>
            {capitalize(articleCategory?.name)}
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

      <Link href={articleUrl || ''}
        title={capitalize(data.title)}
        data-event-name='Article Card - Title'>
        <Title className={styles.title} order={2}>
          {capitalize(data.title.substring(0, 60))}
        </Title>
      </Link>

      <Group className={styles.author} justify='space-between'>
        <Text title='Author'>
          <Link href={articleAuthorUrl || ''}
            data-event-name='Article Card - Author'>
            {capitalize(articleAuthor?.fullName)}
          </Link>
        </Text>
        <ActionIcon 
          component={Link}
          href={articleUrl || ''}
          size='lg' variant='subtle'
          title='Read Article'
          aria-label='Read Article'
          data-event-name='Article Card - Arrow'>
          <IconArrowNarrowRight size={24} stroke={1.5} />
        </ActionIcon>
      </Group>

    </Card>
  );
}
