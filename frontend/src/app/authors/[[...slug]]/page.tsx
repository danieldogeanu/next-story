import NextImage from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { IconCoin, IconMailPlus, IconUser } from '@tabler/icons-react';
import { Box, Button, Group, Image, Text, Title } from '@mantine/core';
import {
  AuthorArticles, AuthorAvatar, AuthorMetaSocial, AuthorMetaSocialEntry, AuthorRobots,
  AuthorSEO, AuthorSocialEntry, getAuthorsCollection, SingleAuthor
} from '@/data/authors';
import { getSinglePageSettings, PageCover, PageMetaSocial, PageMetaSocialEntry, PageRobots } from '@/data/settings';
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getFileURL, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import { isSlugArrayValid, validatePageParams, validateSearchParams, validateSortParam } from '@/validation/urls';
import { addPageNumber, makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getArticlesCollection } from '@/data/articles';
import { StrapiImageFormats } from '@/types/strapi';
import { PageProps } from '@/types/page';
import { capitalize } from '@/utils/strings';
import { convertToRelativeDate } from '@/utils/date';
import SortBar, { SortFallback } from '@/components/sort-bar';
import PagePagination from '@/components/page-pagination';
import ArticleCard from '@/components/article-card';
import AuthorCard from '@/components/author-card';
import SocialIcon from '@/components/social-icon';
import pageStyles from '@/styles/page.module.scss';
import authorStyles from '@/styles/author-page.module.scss';


const rootPageSlug = '/authors';

export async function generateMetadata({params}: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const validatedParams = validatePageParams(params);
  if (!validatedParams || !isSlugArrayValid(validatedParams?.slug)) return {};
  const {slug, pageNumber} = extractSlugAndPage(validatedParams.slug);
  
  const parentData = await parent;

  // Single Author Page
  // ---------------------------------------------------------------------------
  
  // If there's a slug, we're most likely on the Single Author page.
  if (typeof slug === 'string') {
    // Get single author data and return empty metadata if author is not found.
    // We don't need to handle pagination here, we only need one result.
    const authorData = (await getAuthorsCollection({
      filters: { slug: { $eq: slug } },
      populate: {
        avatar: { populate: '*' },
        seo: { populate: {
          metaImage: { populate: '*' },
          metaSocial: { populate: '*' },
        } },
        robots: { populate: '*' },
      },
      pagination: { start: 0, limit: 1 },
    })).data.pop()?.attributes as SingleAuthor;
    if (typeof authorData === 'undefined') return {};
  
    const authorAvatar = authorData?.avatar?.data?.attributes as AuthorAvatar;
    const authorRobots = authorData?.robots as AuthorRobots;
    const authorSEO = authorData?.seo as AuthorSEO;
    const authorMetaImage = authorSEO?.metaImage?.data?.attributes as AuthorAvatar;
    const authorMetaSocials = authorSEO?.metaSocial as AuthorMetaSocial;
    const authorMetaFacebook = authorMetaSocials?.filter((social) => (social.socialNetwork === 'Facebook')).pop() as AuthorMetaSocialEntry;
    const authorMetaFacebookImage = authorMetaFacebook?.image?.data?.attributes as AuthorAvatar;

    const makeAuthorTitle = (title: string) => (`${addPageNumber(title, pageNumber, 'title')}'s Articles`);
  
    return {
      title: makeSeoTitle(makeAuthorTitle(authorSEO?.metaTitle || authorData?.fullName), parentData.applicationName),
      description: makeSeoDescription(authorSEO?.metaDescription || authorData?.biography),
      keywords: makeSeoKeywords(authorSEO?.keywords),
      authors: [{name: capitalize(authorData?.fullName), url: getPageUrl(authorData?.slug, rootPageSlug)}],
      robots: await generateRobotsObject(authorRobots),
      alternates: {
        canonical: getPageUrl(addPageNumber(authorData?.slug, pageNumber, 'slug'), rootPageSlug),
      },
      openGraph: {
        ...parentData.openGraph, 
        url: getPageUrl(addPageNumber(authorData?.slug, pageNumber, 'slug'), rootPageSlug),
        title: makeSeoTitle(makeAuthorTitle(authorMetaFacebook?.title || authorSEO?.metaTitle || authorData?.fullName), parentData.applicationName),
        description: makeSeoDescription(authorMetaFacebook?.description || authorSEO?.metaDescription || authorData?.biography, 65),
        images: await generateCoverImageObject(authorMetaFacebookImage || authorMetaImage || authorAvatar),
      },
    };
  } // Single Author Page

  // Authors Page
  // ---------------------------------------------------------------------------
  
  // If there's no slug, we're on the root Authors page, so we should get the page settings.
  const authorPageSettings = await getSinglePageSettings('authors');
  if (typeof authorPageSettings === 'undefined') return {};

  const authorPageRobots = authorPageSettings?.robots as PageRobots;
  const authorCover = authorPageSettings?.cover?.data?.attributes as PageCover;
  const authorMetaSocials = authorPageSettings?.metaSocial as PageMetaSocial;
  const authorMetaFacebook = authorMetaSocials?.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
  const authorMetaFacebookImage = authorMetaFacebook?.image?.data?.attributes as PageCover;

  return {
    title: makeSeoTitle(addPageNumber(authorPageSettings?.title, pageNumber, 'title'), parentData.applicationName),
    description: makeSeoDescription(authorPageSettings?.description),
    keywords: makeSeoKeywords(authorPageSettings?.keywords),
    robots: await generateRobotsObject(authorPageRobots),
    alternates: {
      canonical: getPageUrl(addPageNumber(rootPageSlug, pageNumber, 'slug')),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(addPageNumber(rootPageSlug, pageNumber, 'slug')),
      title: makeSeoTitle(addPageNumber(authorMetaFacebook?.title || authorPageSettings?.title, pageNumber, 'title'), parentData.applicationName),
      description: makeSeoDescription(authorMetaFacebook?.description || authorPageSettings?.description, 65),
      images: await generateCoverImageObject(authorMetaFacebookImage || authorCover),
    },
  };
}

export default async function AuthorsPage({params, searchParams}: PageProps) {
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

  // Single Author Page
  // ---------------------------------------------------------------------------
  
  // If there's a slug, we're most likely on the Single Author page.
  if (typeof slug === 'string') {
    
    // Get single author data without articles, so we can handle pagination later.
    const authorData = (await getAuthorsCollection({
      filters: { slug: { $eq: slug } },
      populate: {
        avatar: { populate: '*' },
        socialNetworks: { populate: '*' },
        seo: { populate: '*' },
      },
      pagination: { start: 0, limit: 1 },
    })).data.pop()?.attributes as SingleAuthor;

    // If the authorData array is empty or undefined, it means no author was found.
    if (typeof authorData === 'undefined') return notFound();
  
    // Process author data so we can use it in our page.
    const authorAvatar = authorData?.avatar?.data?.attributes as AuthorAvatar;
    const authorAvatarFormats = authorAvatar?.formats as unknown as StrapiImageFormats;
    const authorAvatarUrl = (authorAvatarFormats?.small?.url) ? getFileURL(authorAvatarFormats.small.url) : null;
    const authorSocials = authorData?.socialNetworks as unknown as AuthorSocialEntry[];
    
    // Validate the `sort` param and pass it to the collection's get request.
    const validatedSort = validateSortParam(validatedSearchParams?.sort, ['title', 'publishedAt']);

    // Get all articles that belong to the current author, and split it into pages.
    const articlesResponse = (await getArticlesCollection({
      populate: '*', sort: validatedSort || 'id:desc',
      filters: { author: { slug: { $eq: slug } } },
      pagination: { page: pageNumber || 1, pageSize: 24 },
    }));
    const articlesData = articlesResponse?.data as AuthorArticles;
    const articlesPagination = articlesResponse?.meta?.pagination;
    const articlesNumber = articlesPagination?.total || 0;

    // If the page number is beyond of the page count, we return a 404.
    outOfBoundsRedirect(pageNumber, articlesPagination?.pageCount, articlesData?.length);

    return (
      <main className={pageStyles.main}>
  
        <section className={pageStyles.container}>
  
          <Title className={pageStyles.pageTitle}>
            {capitalize(authorData?.fullName) + '\'s'} Articles
          </Title>
  
          <Box className={authorStyles.author}>
  
            <Box className={authorStyles.left}>
  
              <Box className={authorStyles.avatar}>
                {(authorAvatar && authorAvatarUrl) ?
                  <Image
                    className={authorStyles.image}
                    component={NextImage}
                    src={authorAvatarUrl}
                    width={authorAvatarFormats.small?.width}
                    height={authorAvatarFormats.small?.height}
                    alt={authorAvatar?.alternativeText || ''} />
                  :  
                  <Box className={authorStyles.default}>
                    <IconUser size={100} stroke={1} />
                  </Box>
                }
              </Box>
  
              <Text className={authorStyles.joined} title='Date Joined'>
                Joined {capitalize(convertToRelativeDate(authorData.publishedAt))}
              </Text>
  
              <Group className={authorStyles.socials} justify='center'>
                {(authorSocials && authorSocials.length > 0) && authorSocials.map((social) => (
                  <SocialIcon
                    key={social.id}
                    href={social.link}
                    label={social.label}
                    icon={social.icon || 'IconCircleX'}
                    className={authorStyles.icon}
                    color='dark' />
                ))}
              </Group>
  
              <Text className={authorStyles.total} title='Total Articles'>
                Written {articlesNumber} {(articlesNumber === 1) ? 'Article' : 'Articles'}
              </Text>
  
            </Box>
  
            <Box className={authorStyles.right}>
  
              <Title className={authorStyles.name} order={2}>
                {capitalize(authorData?.fullName)}
              </Title>
  
              <Box className={authorStyles.biography}>
                {authorData?.biography.split('\n\n').map((paragraph, index) => {
                  return <Text key={index}>{paragraph.trim()}</Text>;
                })}
              </Box>
  
              <Group className={authorStyles.actions}>
  
                <Button
                  className={authorStyles.subscribeButton}
                  leftSection={<IconMailPlus size={24} stroke={1.5} />}
                  color='blue' variant='filled' size='md'>Subscribe</Button>
  
                <Button
                  className={authorStyles.sponsorButton}
                  leftSection={<IconCoin size={24} stroke={1.5} />}
                  variant='filled' size='md'>Sponsor</Button>
  
              </Group>
  
            </Box>
  
          </Box>
    
          <Suspense fallback={<SortFallback />}>
            <SortBar totalItems={articlesPagination.total} collectionType='articles' />
          </Suspense>
          
          <section className={pageStyles.grid}>
            {articlesData?.map((article) => {
              return <ArticleCard key={article.id} data={article.attributes} />
            })}
          </section>

          <PagePagination data={articlesPagination} />
  
        </section>
  
      </main>
    );

  } // Single Author Page
  
  // Authors Page
  // ---------------------------------------------------------------------------

  // If there's no slug, we're on the root Authors page.

  // Validate the `sort` param and pass it to the collection's get request.
  const validatedSort = validateSortParam(validatedSearchParams?.sort, ['fullName', 'publishedAt']);

  // Get all the authors and split them into pages.
  const authorsCollection = await getAuthorsCollection({
    populate: '*', sort: validatedSort || 'id:desc',
    pagination: { page: pageNumber || 1, pageSize: 12 },
  });
  const authorPageSettings = await getSinglePageSettings('authors');
  const authorPagination = authorsCollection?.meta?.pagination;

  // If the page number is beyond of the page count, we return a 404.
  outOfBoundsRedirect(pageNumber, authorPagination?.pageCount, authorsCollection?.data?.length);

  return (
    <main className={pageStyles.main}>

      <section className={pageStyles.container}>

        <Title className={pageStyles.pageTitle}>
          {capitalize(authorPageSettings?.title.trim() || 'Authors')}
        </Title>

        <Suspense fallback={<SortFallback />}>
          <SortBar totalItems={authorPagination.total} collectionType='authors' />
        </Suspense>

        <section className={pageStyles.grid}>
          {authorsCollection.data.map((author) => {
            return (<AuthorCard key={author.id} data={author.attributes} />);
          })}
        </section>

        <PagePagination data={authorPagination} />

      </section>

    </main>
  );
}
