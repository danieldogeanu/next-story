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
  const articleAuthor = data.author?.data.attributes;
  
  return (
    <Card
      className={styles.card}
      padding='xs'
      radius='md'>

      <CardSection component={Link} href={articleHref}>
        <Image
          component={NextImage}
          src={articleCoverUrl}
          width={articleCoverFormats.small.width}
          height={articleCoverFormats.small.height}
          alt={articleCover?.alternativeText || 'No Description'}
          h={200} radius='md' />
      </CardSection>
      
      <Group className={styles.meta} justify='space-between'>
        <Text>{articleCategory?.name}</Text>
        <Text>{convertToReadableDate(data.createdAt)}</Text>
      </Group>

      <Link href={articleHref}>
        <Title className={styles.title} order={2}>
          {data.title.substring(0, 60)}
        </Title>
      </Link>

      <Group className={styles.author} justify='space-between'>
        <Text>{articleAuthor?.fullName}</Text>
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
