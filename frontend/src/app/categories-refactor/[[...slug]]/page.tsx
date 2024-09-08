import NextImage from 'next/image';
import classNames from 'classnames';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Title, Image, Box, Text } from '@mantine/core';
import {
  CategoryArticles, CategoryCover, CategoryMetaSocial, CategoryMetaSocialEntry, CategoryRobots, 
  CategorySEO, getCategoriesCollection, SingleCategory
} from '@/data/categories';
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getFileURL, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getSinglePageSettings } from '@/data/settings';
import { isSlugArrayValid } from '@/validation/urls';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import ArticleCard from '@/components/article-card';
import CategoryCard from '@/components/category-card';
import PagePagination from '@/components/page-pagination';
import defaultCover from '@/assets/imgs/default-cover.webp';
import pageStyles from '@/styles/page.module.scss';
import categoryStyles from '@/styles/category-page.module.scss';


export interface CategoriesPageProps {
  params: {
    slug: string[];
  };
}

const rootPageSlug = '/categories-refactor';

export async function generateMetadata({params}: CategoriesPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  if (!isSlugArrayValid(params.slug)) return {};
  const {slug, pageNumber} = extractSlugAndPage(params.slug);
  
  const parentData = await parent;

  return {};
}

export default async function CategoriesPage({params}: CategoriesPageProps) {
  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(params.slug, rootPageSlug);

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(params.slug);

  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect(slug, pageNumber, rootPageSlug);
  
  // Categories Page
  // -----------------------------------------------------------------------------
  
  // If there's no slug, we're on the root Categories page.
  const categoriesCollection = await getCategoriesCollection({
    populate: '*', sort: 'id:desc',
    pagination: { page: pageNumber || 1, pageSize: 12 },
  });
  const categoriesPageSettings = await getSinglePageSettings('categories');
  const categoriesPagination = categoriesCollection?.meta?.pagination;

  // If the page number is beyond of the page count, we return a 404.
  outOfBoundsRedirect(pageNumber, categoriesPagination?.pageCount, categoriesCollection?.data?.length);

  return (
    <main className={pageStyles.main}>

      <Title className={pageStyles.pageTitle}>
        {capitalize(categoriesPageSettings?.title.trim() || 'Categories')}
      </Title>

      <section className={pageStyles.grid}>
        {categoriesCollection.data.map((category) => {
          return (<CategoryCard key={category.id} data={category.attributes} />);
        })}
      </section>

      <PagePagination data={categoriesPagination} />

    </main>
  );
}
