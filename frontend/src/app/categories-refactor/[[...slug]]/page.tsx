import NextImage from 'next/image';
import classNames from 'classnames';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Title, Image, Box, Text } from '@mantine/core';
import {
  CategoryArticles, CategoryCover, CategoryMetaSocial, CategoryMetaSocialEntry, CategoryRobots, 
  CategorySEO, getCategoriesCollection, SingleCategory
} from '@/data/categories';
import { getSinglePageSettings, PageCover, PageMetaSocial, PageMetaSocialEntry, PageRobots } from '@/data/settings';
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getFileURL, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import { makeSeoDescription, makeSeoKeywords, makeSeoPageNumber, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getArticlesCollection } from '@/data/articles';
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
  const {pageNumberSlug, pageNumberTitle, pageNumberDescription, pageNumberKeyword} = makeSeoPageNumber(pageNumber);
  
  const parentData = await parent;

  // Categories Page
  // ---------------------------------------------------------------------------
  
  // If there's no slug, we're on the root Categories page, so we should get the page settings.
  const categoriesPageSettings = await getSinglePageSettings('categories');
  if (typeof categoriesPageSettings === 'undefined') return {};

  const categoriesPageRobots = categoriesPageSettings?.robots as PageRobots;
  const categoriesCover = categoriesPageSettings?.cover?.data?.attributes as PageCover;
  const categoriesMetaSocials = categoriesPageSettings?.metaSocial as PageMetaSocial;
  const categoriesMetaFacebook = categoriesMetaSocials?.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
  const categoriesMetaFacebookImage = categoriesMetaFacebook?.image?.data?.attributes as PageCover;

  return {
    title: makeSeoTitle(pageNumberTitle + categoriesPageSettings?.title, parentData.applicationName),
    description: makeSeoDescription(pageNumberDescription + categoriesPageSettings?.description),
    keywords: makeSeoKeywords(pageNumberKeyword + categoriesPageSettings?.keywords),
    robots: await generateRobotsObject(categoriesPageRobots),
    alternates: {
      canonical: getPageUrl(rootPageSlug + pageNumberSlug),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(rootPageSlug + pageNumberSlug),
      title: makeSeoTitle(pageNumberTitle + (categoriesMetaFacebook?.title || categoriesPageSettings?.title), parentData.applicationName),
      description: makeSeoDescription(pageNumberDescription + (categoriesMetaFacebook?.description || categoriesPageSettings?.description), 65),
      images: await generateCoverImageObject(categoriesMetaFacebookImage || categoriesCover),
    },
  };
}

export default async function CategoriesPage({params}: CategoriesPageProps) {
  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(params.slug, rootPageSlug);

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(params.slug);

  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect(slug, pageNumber, rootPageSlug);

  // Single Category Page
  // ---------------------------------------------------------------------------
  
  // If there's a slug, we're most likely on the Single Category page.
  if (typeof slug === 'string') {

    // Get single category data without articles, so we can handle pagination later.
    const categoryData = (await getCategoriesCollection({
      filters: { slug: { $eq: slug } },
      populate: {
        cover: { populate: '*' },
        seo: { populate: '*' },
      },
      pagination: { start: 0, limit: 1 },
    })).data.pop()?.attributes as SingleCategory;
  
    // If the categoryData array is empty or undefined, it means no author was found.
    if (typeof categoryData === 'undefined') return notFound();
  
    // Process category data so we can use it in our page.
    const categoryCover = categoryData?.cover?.data?.attributes as CategoryCover;
    const categoryCoverFormats = categoryCover?.formats as unknown as StrapiImageFormats;
    const categoryCoverUrl = (categoryCoverFormats?.large?.url)
      ? getFileURL(categoryCoverFormats.large.url) : getFileURL(defaultCover.src, 'frontend');

    // Get all articles that belong to the current category, and split it into pages.
    const articlesResponse = (await getArticlesCollection({
      populate: '*', filters: { category: { slug: { $eq: slug } } },
      pagination: { page: pageNumber || 1, pageSize: 24 },
    }));
    const articlesData = articlesResponse?.data as CategoryArticles;
    const articlesPagination = articlesResponse?.meta?.pagination;

    // If the page number is beyond of the page count, we return a 404.
    outOfBoundsRedirect(pageNumber, articlesPagination?.pageCount, articlesData?.length);

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
              width={categoryCoverFormats?.large?.width ?? defaultCover.width}
              height={categoryCoverFormats?.large?.height ?? defaultCover.height}
              alt={categoryCover?.alternativeText || ''}
              radius='lg' />
            <Box className={categoryStyles.description}>
              <Text>{categoryData?.description}</Text>
            </Box>
          </Box>
  
        </section>
  
        <section className={pageStyles.grid}>
          {articlesData?.map((article) => {
            return <ArticleCard key={article.id} data={article.attributes} />;
          })}
        </section>

        <PagePagination data={articlesPagination} />
  
      </main>
    );

  } // Single Category Page
  
  // Categories Page
  // ---------------------------------------------------------------------------
  
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
