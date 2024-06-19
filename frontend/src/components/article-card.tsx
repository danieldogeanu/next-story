import NextImage from 'next/image';
import Link from 'next/link';
import path from 'node:path';
import { ActionIcon, Card, CardSection, Group, Image, Text, Title } from '@mantine/core';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { convertToReadableDate, convertToUnixTime } from '@/utils/date';
import { SingleArticle } from '@/data/articles';
import { getFileURL } from '@/data/files';
import styles from '@/styles/article-card.module.scss';

export interface ArticleCardProps {
  data: SingleArticle;
}

export default function ArticleCard({data}: ArticleCardProps) {
  const articleHref = path.join('/articles', convertToUnixTime(data.createdAt), data.slug);
  const articleCover = data?.cover?.data.attributes;
  const articleCoverFormats = JSON.parse(JSON.stringify(articleCover?.formats));
  const articleCoverUrl = getFileURL(articleCoverFormats.small.url);
  const articleCategory = data.category?.data.attributes;
  const articleCategoryHref = path.join('/categories', articleCategory?.slug || '');
  const articleAuthor = data.author?.data.attributes;
  const articleAuthorHref = path.join('/authors', articleAuthor?.slug || '');
  
  return (
    <Card
      className={styles.card}
      component='article'
      padding='xs'
      radius='md'>

      <CardSection component={Link} href={articleHref} title='Read Article'>
        <Image
          component={NextImage}
          src={articleCoverUrl}
          width={articleCoverFormats.small.width}
          height={articleCoverFormats.small.height}
          alt={articleCover?.alternativeText || 'No Description'}
          h={200} radius='md' />
      </CardSection>
      
      <Group className={styles.meta} justify='space-between'>
        <Text title='Article Category'>
          <Link href={articleCategoryHref}>
            {articleCategory?.name}
          </Link>
        </Text>
        <Text title='Date Created'>
          {convertToReadableDate(data.createdAt)}
        </Text>
      </Group>

      <Link href={articleHref} title={data.title}>
        <Title className={styles.title} order={2}>
          {data.title.substring(0, 60)}
        </Title>
      </Link>

      <Group className={styles.author} justify='space-between'>
        <Text title='Article Author'>
          <Link href={articleAuthorHref}>
            {articleAuthor?.fullName}
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
