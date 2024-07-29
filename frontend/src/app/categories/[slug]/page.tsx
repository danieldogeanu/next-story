import NextImage from 'next/image';
import classNames from 'classnames';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Title, Image, Box, Text } from '@mantine/core';
import { CategoryArticles, CategoryCover, CategoryRobots, CategorySEO, getCategoriesCollection } from '@/data/categories';
import { getSiteSettings, SiteRobots, SiteSettings } from '@/data/settings';
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

export async function generateMetadata({params}: CategoryPageProps): Promise<Metadata> {
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteRobots = siteSettings?.siteRobots as SiteRobots;
  
  const categoryData = (await getCategoriesCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      seo: { populate: '*' },
      robots: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const categoryRobots = categoryData?.robots as CategoryRobots;
  const categorySEO = categoryData?.seo as CategorySEO;

  return {
    title: capitalize((categorySEO?.metaTitle.trim() || categoryData?.name.trim()) as string) + ' Category',
    description: categorySEO?.metaDescription.trim() || (categoryData?.description?.substring(0, 160 - 4) + '...').trim(),
    keywords: categorySEO?.keywords,
    robots: {
      index: (siteRobots.indexAllowed === false) ? false : categoryRobots.indexAllowed,
      follow: (siteRobots.followAllowed === false) ? false : categoryRobots.followAllowed,
      nocache: (siteRobots.cacheAllowed === false) ? true : !categoryRobots.cacheAllowed,
    }
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
