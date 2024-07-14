import NextImage from 'next/image';
import classNames from 'classnames';
import { notFound } from 'next/navigation';
import { Title, Image, Box, Text } from '@mantine/core';
import { CategoryArticles, CategoryCover, getCategoriesCollection } from '@/data/categories';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import { getFileURL } from '@/data/files';
import ArticleCard from '@/components/article-card';
import pageStyles from '@/styles/page.module.scss';
import categoryStyles from '@/styles/category-page.module.scss';

export interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({params}: CategoryPageProps) {
  const categoryData = (await getCategoriesCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      cover: { populate: '*' },
      seo: { populate: '*' },
      articles: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const categoryCover = categoryData?.cover?.data?.attributes as CategoryCover;
  const categoryCoverFormats = categoryCover?.formats as unknown as StrapiImageFormats;
  const categoryCoverUrl = (categoryCoverFormats?.large?.url) ? getFileURL(categoryCoverFormats.large.url) : '';
  const categoryArticles = categoryData?.articles?.data as CategoryArticles;

  // TODO: Add image fallback in case the `categoryCoverUrl` is undefined.
  // TODO: Add larger image format that is more suitable for cover images.

  if (!categoryData) return notFound();

  return (
    <main className={pageStyles.main}>

      <section className={classNames(pageStyles.container, categoryStyles.intro)}>

        <Title className={pageStyles.pageTitle}>
          {capitalize(categoryData?.name)} Category
        </Title>

        <Box className={categoryStyles.hero}>
          <Image
            className={categoryStyles.cover}
            component={NextImage}
            src={categoryCoverUrl}
            width={categoryCoverFormats?.large?.width}
            height={categoryCoverFormats?.large?.height}
            alt={categoryCover?.alternativeText || ''}
            radius='lg' />
          <Box className={categoryStyles.description}>
            <Text>{categoryData?.description}</Text>
          </Box>
        </Box>

      </section>

      <section className={pageStyles.grid}>
        {categoryArticles?.map((article) => {
          return <ArticleCard key={article.id} data={article.attributes} />;
        })}
      </section>

    </main>
  );
}
