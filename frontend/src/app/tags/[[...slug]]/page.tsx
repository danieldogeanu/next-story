import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getTagsCollection, SingleTag, TagArticles } from '@/data/tags';
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import { getSinglePageSettings, PageCover, PageMetaSocial, PageMetaSocialEntry, PageRobots } from '@/data/settings';
import { addPageNumber, makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { isSlugArrayValid, validateParams, validateSearchParams, validateSortParam } from '@/validation/urls';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getArticlesCollection } from '@/data/articles';
import { capitalize } from '@/utils/strings';
import { PageProps } from '@/types/page';
import PagePagination from '@/components/page-pagination';
import ArticleCard from '@/components/article-card';
import SortBar from '@/components/sort-bar';
import TagCard from '@/components/tag-card';
import styles from '@/styles/page.module.scss';


const rootPageSlug = '/tags';

export async function generateMetadata({params}: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const validatedParams = validateParams(params);
  if (!isSlugArrayValid(validatedParams?.slug)) return {};
  const {slug, pageNumber} = extractSlugAndPage(validatedParams?.slug as string[]);

  const parentData = await parent;

  // Single Tag Page
  // -----------------------------------------------------------------------------
  
  // If there's a slug, we're most likely on the Single Tag page.
  if (typeof slug === 'string') {
    // Get single tag data and return empty metadata if tag is not found.
    // We don't need to handle pagination here, we only need one result.
    const tagData = (await getTagsCollection({
      filters: { slug: { $eq: slug } },
      pagination: { start: 0, limit: 1 },
    })).data.pop()?.attributes as SingleTag;
    if (typeof tagData === 'undefined') return {};
  
    const makeTagTitle = (title: string) => (`${addPageNumber(title, pageNumber, 'title')} Tag`);

    return {
      title: makeSeoTitle(makeTagTitle(tagData?.name), parentData.applicationName),
      keywords: makeSeoKeywords(tagData?.slug),
      description: undefined,
      alternates: {
        canonical: getPageUrl(addPageNumber(tagData?.slug, pageNumber, 'slug'), rootPageSlug),
      },
      robots: {
        index: false, follow: false, nocache: true,
      },
      openGraph: {
        ...parentData.openGraph,
        url: getPageUrl(addPageNumber(tagData?.slug, pageNumber, 'slug'), rootPageSlug),
        title: makeSeoTitle(makeTagTitle(tagData?.name), parentData.applicationName),
        description: undefined,
      },
    };

  } // Single Tag Page

  // Tags Page
  // ---------------------------------------------------------------------------
  
  // If there's no slug, we're on the root Tags page, so we should get the page settings.
  const tagsPageSettings = await getSinglePageSettings('tags');
  if (typeof tagsPageSettings === 'undefined') return {};

  const tagsPageRobots = tagsPageSettings?.robots as PageRobots;
  const tagsCover = tagsPageSettings?.cover?.data?.attributes as PageCover;
  const tagsMetaSocials = tagsPageSettings?.metaSocial as PageMetaSocial;
  const tagsMetaFacebook = tagsMetaSocials?.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
  const tagsMetaFacebookImage = tagsMetaFacebook?.image?.data?.attributes as PageCover;

  return {
    title: makeSeoTitle(addPageNumber(tagsPageSettings?.title, pageNumber, 'title'), parentData.applicationName),
    description: makeSeoDescription(tagsPageSettings?.description),
    keywords: makeSeoKeywords(tagsPageSettings?.keywords),
    robots: await generateRobotsObject(tagsPageRobots),
    alternates: {
      canonical: getPageUrl(addPageNumber(rootPageSlug, pageNumber, 'slug')),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(addPageNumber(rootPageSlug, pageNumber, 'slug')),
      title: makeSeoTitle(addPageNumber(tagsMetaFacebook?.title || tagsPageSettings?.title, pageNumber, 'title'), parentData.applicationName),
      description: makeSeoDescription(tagsMetaFacebook?.description || tagsPageSettings?.description, 65),
      images: await generateCoverImageObject(tagsMetaFacebookImage || tagsCover),
    },
  };
}

export default async function TagsPage({params, searchParams}: PageProps) {
  // Validate the page params and search params before proceeding with rendering the page.
  const validatedParams = validateParams(params);
  const validatedSearchParams = validateSearchParams(searchParams);

  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(validatedParams?.slug as string[], rootPageSlug);

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(validatedParams?.slug as string[]);

  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect(slug, pageNumber, rootPageSlug);

  // Single Tag Page
  // ---------------------------------------------------------------------------
  
  // If there's a slug, we're most likely on the Single Tag page.
  if (typeof slug === 'string') {

    // Get single tag data without articles, so we can handle pagination later.
    const tagData = (await getTagsCollection({
      filters: { slug: { $eq: slug } },
      pagination: { start: 0, limit: 1 },
    })).data.pop()?.attributes as SingleTag;
  
    // If the tagData array is empty or undefined, it means no tag was found.
    if (typeof tagData === 'undefined') return notFound();
  
    // Validate the `sort` param and pass it to the collection's get request.
    const validatedSort = validateSortParam(validatedSearchParams?.sort, ['title', 'publishedAt']);

    // Get all articles that belong to the current tag, and split it into pages.
    const articlesResponse = (await getArticlesCollection({
      populate: '*', sort: validatedSort || 'id:desc',
      filters: { tags: { slug: { $eq: slug } } },
      pagination: { page: pageNumber || 1, pageSize: 24 },
    }));
    const articlesData = articlesResponse?.data as TagArticles;
    const articlesPagination = articlesResponse?.meta?.pagination;
  
    // If the page number is beyond of the page count, we return a 404.
    outOfBoundsRedirect(pageNumber, articlesPagination?.pageCount, articlesData?.length);

    return (
      <main className={styles.main}>
  
        <section className={styles.container}>

          <Title className={styles.pageTitle}>
            {capitalize(tagData?.name.trim())} Tag
          </Title>

          <Suspense fallback={null}>
            <SortBar />
          </Suspense>

        </section>
  
        <section className={styles.grid}>
          {articlesData?.map((article) => {
            return <ArticleCard key={article.id} data={article.attributes} />;
          })}
        </section>

        <PagePagination data={articlesPagination} />
  
      </main>
    );

  } // Single Tag Page

  // Tags Page
  // ---------------------------------------------------------------------------
  
  // If there's no slug, we're on the root Tags page.

  // Validate the `sort` param and pass it to the collection's get request.
  const validatedSort = validateSortParam(validatedSearchParams?.sort, ['name']);

  // Get all the tags and split them into pages.
  const tagsCollection = await getTagsCollection({
    populate: '*', sort: validatedSort || 'id:desc',
    pagination: { page: pageNumber || 1, pageSize: 24 },
  });
  const tagsPageSettings = await getSinglePageSettings('tags');
  const tagsPagination = tagsCollection?.meta?.pagination;

  // If the page number is beyond of the page count, we return a 404.
  outOfBoundsRedirect(pageNumber, tagsPagination?.pageCount, tagsCollection?.data?.length);

  return (
    <main className={styles.main}>

      <Title className={styles.pageTitle}>
        {capitalize(tagsPageSettings?.title.trim() || 'Tags')}
      </Title>

      <section className={styles.grid}>
        {tagsCollection.data.map((tag) => {
          return (<TagCard key={tag.id} data={tag.attributes} />);
        })}
      </section>

      <PagePagination data={tagsPagination} />

    </main>
  );
}
