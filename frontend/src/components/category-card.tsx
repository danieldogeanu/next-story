import NextImage from 'next/image';
import Link from 'next/link';
import path from 'node:path';
import { Box, Card, CardSection, Image, Title } from '@mantine/core';
import { SingleCategory } from '@/data/categories';
import { getFileURL } from '@/data/files';
import styles from '@/styles/category-card.module.scss';

export interface CategoryCardProps {
  data: SingleCategory;
}

export default function CategoryCard({data}: CategoryCardProps) {
  const categoryHref = path.join('/categories', data.slug);
  const categoryCover = data?.cover?.data.attributes;
  const categoryCoverFormats = JSON.parse(JSON.stringify(categoryCover?.formats));
  const categoryCoverUrl = getFileURL(categoryCoverFormats.small.url);
  
  return (
    <Card
      className={styles.card}
      padding='xs'
      radius='md'>

      <CardSection
        className={styles.cover}
        component={Link}
        href={categoryHref}
        title={`See Articles in ${data.name} Category`}>
        <Box className={styles.preview}>
          <Title className={styles.title} order={2}>
            {data.name}
          </Title>
          <Image
            component={NextImage}
            src={categoryCoverUrl}
            width={categoryCoverFormats.small.width}
            height={categoryCoverFormats.small.height}
            alt={categoryCover?.alternativeText || 'No Description'}
            h={140} radius='md' />
        </Box>
      </CardSection>

    </Card>
  );
}
