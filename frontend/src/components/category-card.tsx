import NextImage from 'next/image';
import Link from 'next/link';
import { Box, Card, CardSection, Image, Title } from '@mantine/core';
import { CategoryCover, SingleCategory } from '@/data/categories';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL, getPageUrl } from '@/utils/urls';
import { capitalize } from '@/utils/strings';
import defaultCover from '@/assets/imgs/default-cover-small.webp';
import styles from '@/styles/category-card.module.scss';

export interface CategoryCardProps {
  data: SingleCategory;
}

export default function CategoryCard({data}: CategoryCardProps) {
  const categoryUrl = getPageUrl(data.slug, '/categories');
  const categoryCover = data?.cover?.data?.attributes as CategoryCover;
  const categoryCoverFormats = categoryCover?.formats as unknown as StrapiImageFormats;
  const categoryCoverUrl = (categoryCoverFormats?.small?.url)
    ? getFileURL(categoryCoverFormats.small.url) : getFileURL(defaultCover.src, 'frontend');

  return (
    <Card
      className={styles.card}
      padding='xs'
      radius='md'>

      <CardSection
        className={styles.cover}
        component={Link}
        href={categoryUrl || ''}
        title={`See Articles in ${capitalize(data.name)} Category`}
        data-event-name='Category Card - Cover'>
        <Box className={styles.preview}>
          <Title className={styles.title} order={2}>
            {capitalize(data.name)}
          </Title>
          <Image
            component={NextImage}
            src={categoryCoverUrl}
            width={categoryCoverFormats?.small?.width ?? defaultCover.width}
            height={categoryCoverFormats?.small?.height ?? defaultCover.height}
            alt={categoryCover?.alternativeText || ''}
            h={140} radius='md' />
        </Box>
      </CardSection>

    </Card>
  );
}
