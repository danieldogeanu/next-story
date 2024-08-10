import NextImage from 'next/image';
import classNames from 'classnames';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Title, Image, Box, Text } from '@mantine/core';
import { CategoryArticles, CategoryCover, CategoryMetaSocial, CategoryMetaSocialEntry, CategoryRobots, CategorySEO, getCategoriesCollection } from '@/data/categories';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import { getPageUrl } from '@/utils/urls';
import { getFileURL } from '@/data/files';
import ArticleCard from '@/components/article-card';
import pageStyles from '@/styles/page.module.scss';
import categoryStyles from '@/styles/category-page.module.scss';

export interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({params}: CategoryPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const categoryData = (await getCategoriesCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      cover: { populate: '*' },
      seo: { populate: {
        metaImage: { populate: '*' },
        metaSocial: { populate: '*' },
      } },
      robots: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const categoryCover = categoryData?.cover?.data?.attributes as CategoryCover;
  const categoryRobots = categoryData?.robots as CategoryRobots;
  const categorySEO = categoryData?.seo as CategorySEO;
  const categoryMetaImage = categorySEO.metaImage?.data?.attributes as CategoryCover;
  const categoryMetaSocials = categorySEO.metaSocial as CategoryMetaSocial;
  const categoryMetaFacebook = categoryMetaSocials.filter((social) => (social.socialNetwork === 'Facebook')).pop() as CategoryMetaSocialEntry;
  const categoryMetaFacebookImage = categoryMetaFacebook?.image?.data?.attributes as CategoryCover;

  return {
    title: makeSeoTitle((categorySEO?.metaTitle || categoryData?.name) + ' Category', parentData.applicationName),
    description: makeSeoDescription(categorySEO?.metaDescription || categoryData?.description),
    keywords: makeSeoKeywords(categorySEO?.keywords),
    robots: await generateRobotsObject(categoryRobots),
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl((categorySEO?.canonicalURL || categoryData?.slug), '/categories'),
      title: makeSeoTitle((categoryMetaFacebook?.title || categorySEO?.metaTitle || categoryData?.name) + ' Category', parentData.applicationName),
      description: makeSeoDescription(categoryMetaFacebook?.description || categorySEO?.metaDescription || categoryData?.description, 65),
      images: await generateCoverImageObject(categoryMetaFacebookImage || categoryMetaImage || categoryCover),
    },
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
