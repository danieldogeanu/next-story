import NextImage from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Title, Image, Box, Text } from '@mantine/core';
import {
  CategoryArticles, CategoryCover, CategoryMetaSocial, CategoryMetaSocialEntry, CategoryRobots, 
  CategorySEO, getCategoriesCollection, SingleCategory
} from '@/data/categories';
import { getSinglePageSettings, PageCover, PageMetaSocial, PageMetaSocialEntry, PageRobots } from '@/data/settings';
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getFileURL, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import { isSlugArrayValid, validatePageParams, validateSearchParams, validateSortParam } from '@/validation/urls';
import { addPageNumber, makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getArticlesCollection } from '@/data/articles';
import { StrapiImageFormats } from '@/types/strapi';
import { PageProps } from '@/types/page';
import { capitalize } from '@/utils/strings';
import SortBar, { SortFallback } from '@/components/sort-bar';
import ArticleCard from '@/components/article-card';
import CategoryCard from '@/components/category-card';
import PagePagination from '@/components/page-pagination';
import defaultCover from '@/assets/imgs/default-cover.webp';
import pageStyles from '@/styles/page.module.scss';
import categoryStyles from '@/styles/category-page.module.scss';


const rootPageSlug = '/categories';

export async function generateMetadata({params}: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const validatedParams = validatePageParams(params);
  if (!validatedParams || !isSlugArrayValid(validatedParams?.slug)) return {};
  const {slug, pageNumber} = extractSlugAndPage(validatedParams.slug);
  
  const parentData = await parent;

  // Single Category Page
  // -----------------------------------------------------------------------------
  
  // If there's a slug, we're most likely on the Single Category page.
  if (typeof slug === 'string') {
    // Get single category data and return empty metadata if category is not found.
    // We don't need to handle pagination here, we only need one result.
    const categoryData = (await getCategoriesCollection({
      filters: { slug: { $eq: slug } },
      populate: {
        cover: { populate: '*' },
        seo: { populate: {
          metaImage: { populate: '*' },
          metaSocial: { populate: '*' },
        } },
        robots: { populate: '*' },
      },
      pagination: { start: 0, limit: 1 },
    })).data.pop()?.attributes as SingleCategory;  
    if (typeof categoryData === 'undefined') return {};
  
    const categoryCover = categoryData?.cover?.data?.attributes as CategoryCover;
    const categoryRobots = categoryData?.robots as CategoryRobots;
    const categorySEO = categoryData?.seo as CategorySEO;
    const categoryMetaImage = categorySEO?.metaImage?.data?.attributes as CategoryCover;
    const categoryMetaSocials = categorySEO?.metaSocial as CategoryMetaSocial;
    const categoryMetaFacebook = categoryMetaSocials?.filter((social) => (social.socialNetwork === 'Facebook')).pop() as CategoryMetaSocialEntry;
    const categoryMetaFacebookImage = categoryMetaFacebook?.image?.data?.attributes as CategoryCover;

    const makeCategoryTitle = (title: string) => (`${addPageNumber(title, pageNumber, 'title')} Category`);
  
    return {
      title: makeSeoTitle(makeCategoryTitle(categorySEO?.metaTitle || categoryData?.name), parentData.applicationName),
      description: makeSeoDescription(categorySEO?.metaDescription || categoryData?.description),
      keywords: makeSeoKeywords(categorySEO?.keywords),
      category: makeSeoTitle(categorySEO?.metaTitle || categoryData?.name),
      robots: await generateRobotsObject(categoryRobots),
      alternates: {
        canonical: getPageUrl(addPageNumber(categoryData?.slug, pageNumber, 'slug'), rootPageSlug),
      },
      openGraph: {
        ...parentData.openGraph,
        url: getPageUrl(addPageNumber(categoryData?.slug, pageNumber, 'slug'), rootPageSlug),
        title: makeSeoTitle(makeCategoryTitle(categoryMetaFacebook?.title || categorySEO?.metaTitle || categoryData?.name), parentData.applicationName),
        description: makeSeoDescription(categoryMetaFacebook?.description || categorySEO?.metaDescription || categoryData?.description, 65),
        images: await generateCoverImageObject(categoryMetaFacebookImage || categoryMetaImage || categoryCover),
      },
    };
  } // Single Category Page

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
    title: makeSeoTitle(addPageNumber(categoriesPageSettings?.title, pageNumber, 'title'), parentData.applicationName),
    description: makeSeoDescription(categoriesPageSettings?.description),
    keywords: makeSeoKeywords(categoriesPageSettings?.keywords),
    robots: await generateRobotsObject(categoriesPageRobots),
    alternates: {
      canonical: getPageUrl(addPageNumber(rootPageSlug, pageNumber, 'slug')),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(addPageNumber(rootPageSlug, pageNumber, 'slug')),
      title: makeSeoTitle(addPageNumber(categoriesMetaFacebook?.title || categoriesPageSettings?.title, pageNumber, 'title'), parentData.applicationName),
      description: makeSeoDescription(categoriesMetaFacebook?.description || categoriesPageSettings?.description, 65),
      images: await generateCoverImageObject(categoriesMetaFacebookImage || categoriesCover),
    },
  };
}

export default async function CategoriesPage({params, searchParams}: PageProps) {
  // Validate the page params and search params before proceeding with rendering the page.
  const validatedParams = validatePageParams(params);
  const validatedSearchParams = validateSearchParams(searchParams);

  if (!validatedParams) return notFound();

  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(validatedParams.slug, rootPageSlug);

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(validatedParams.slug);

  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect({
    slug: slug,
    pageNumber: pageNumber,
    rootPage: rootPageSlug,
    searchParams: validatedSearchParams,
  });

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

    // Validate the `sort` param and pass it to the collection's get request.
    const validatedSort = validateSortParam(validatedSearchParams?.sort, ['title', 'publishedAt']);
    
    // Get all articles that belong to the current category, and split it into pages.
    const articlesResponse = (await getArticlesCollection({
      populate: '*', sort: validatedSort || 'createdAt:desc',
      filters: { category: { slug: { $eq: slug } } },
      pagination: { page: pageNumber || 1, pageSize: 24 },
    }));
    const articlesData = articlesResponse?.data as CategoryArticles;
    const articlesPagination = articlesResponse?.meta?.pagination;

    // If the page number is beyond of the page count, we return a 404.
    outOfBoundsRedirect(pageNumber, articlesPagination?.pageCount, articlesData?.length);

    return (
      <main className={pageStyles.main}>

        <section className={pageStyles.container}>

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
    
          <Suspense fallback={<SortFallback />}>
            <SortBar totalItems={articlesPagination.total} collectionType='articles' />
          </Suspense>
          
          <section className={pageStyles.grid}>
            {articlesData?.map((article) => {
              return <ArticleCard key={article.id} data={article.attributes} />;
            })}
          </section>

          <PagePagination data={articlesPagination} />

        </section>  
  
      </main>
    );

  } // Single Category Page
  
  // Categories Page
  // ---------------------------------------------------------------------------
  
  // If there's no slug, we're on the root Categories page.

  // Validate the `sort` param and pass it to the collection's get request.
  const validatedSort = validateSortParam(validatedSearchParams?.sort, ['name', 'publishedAt']);

  // Get all the categories and split them into pages.
  const categoriesCollection = await getCategoriesCollection({
    populate: '*', sort: validatedSort || 'createdAt:desc',
    pagination: { page: pageNumber || 1, pageSize: 12 },
  });
  const categoriesPageSettings = await getSinglePageSettings('categories');
  const categoriesPagination = categoriesCollection?.meta?.pagination;

  // If the page number is beyond of the page count, we return a 404.
  outOfBoundsRedirect(pageNumber, categoriesPagination?.pageCount, categoriesCollection?.data?.length);

  return (
    <main className={pageStyles.main}>

      <section className={pageStyles.container}>

        <Title className={pageStyles.pageTitle}>
          {capitalize(categoriesPageSettings?.title.trim() || 'Categories')}
        </Title>

        <Suspense fallback={<SortFallback />}>
          <SortBar totalItems={categoriesPagination.total} collectionType='categories' />
        </Suspense>

        <section className={pageStyles.grid}>
          {categoriesCollection.data.map((category) => {
            return (<CategoryCard key={category.id} data={category.attributes} />);
          })}
        </section>

        <PagePagination data={categoriesPagination} />

      </section>

    </main>
  );
}
