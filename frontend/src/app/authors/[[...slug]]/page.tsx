import NextImage from 'next/image';
import classNames from 'classnames';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { IconCoin, IconMailPlus, IconUser } from '@tabler/icons-react';
import { Box, Button, Group, Image, Text, Title } from '@mantine/core';
import {
  AuthorArticles, AuthorAvatar, AuthorMetaSocial, AuthorMetaSocialEntry, AuthorRobots,
  AuthorSEO, AuthorSocialEntry, getAuthorsCollection, SingleAuthor
} from '@/data/authors';
import { getSinglePageSettings, PageCover, PageMetaSocial, PageMetaSocialEntry, PageRobots } from '@/data/settings';
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getFileURL, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import { makeSeoDescription, makeSeoKeywords, makeSeoPageNumber, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getArticlesCollection } from '@/data/articles';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import { convertToRelativeDate } from '@/utils/date';
import { isSlugArrayValid } from '@/validation/urls';
import PagePagination from '@/components/page-pagination';
import ArticleCard from '@/components/article-card';
import AuthorCard from '@/components/author-card';
import SocialIcon from '@/components/social-icon';
import pageStyles from '@/styles/page.module.scss';
import authorStyles from '@/styles/author-page.module.scss';

export interface AuthorPageProps {
  params: {
    slug: string[];
  },
}

const rootPageSlug = '/authors';

export async function generateMetadata({params}: AuthorPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  if (!isSlugArrayValid(params.slug)) return {};
  const {slug, pageNumber} = extractSlugAndPage(params.slug);
  const {pageNumberSlug, pageNumberTitle, pageNumberDescription, pageNumberKeyword} = makeSeoPageNumber(pageNumber);
  
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

    const makeAuthorTitle = (title: string) => (`${pageNumberTitle + title}'s Articles`);
  
    return {
      title: makeSeoTitle(makeAuthorTitle(authorSEO?.metaTitle || authorData?.fullName), parentData.applicationName),
      description: makeSeoDescription(pageNumberDescription + (authorSEO?.metaDescription || authorData?.biography)),
      keywords: makeSeoKeywords(pageNumberKeyword + authorSEO?.keywords),
      authors: [{name: capitalize(authorData?.fullName), url: getPageUrl(authorData?.slug, rootPageSlug)}],
      robots: await generateRobotsObject(authorRobots),
      alternates: {
        canonical: getPageUrl(authorData?.slug + pageNumberSlug, rootPageSlug),
      },
      openGraph: {
        ...parentData.openGraph, 
        url: getPageUrl(authorData?.slug + pageNumberSlug, rootPageSlug),
        title: makeSeoTitle(makeAuthorTitle(authorMetaFacebook?.title || authorSEO?.metaTitle || authorData?.fullName), parentData.applicationName),
        description: makeSeoDescription(pageNumberDescription + (authorMetaFacebook?.description || authorSEO?.metaDescription || authorData?.biography), 65),
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
    title: makeSeoTitle(pageNumberTitle + authorPageSettings?.title, parentData.applicationName),
    description: makeSeoDescription(pageNumberDescription + authorPageSettings?.description),
    keywords: makeSeoKeywords(pageNumberKeyword + authorPageSettings?.keywords),
    robots: await generateRobotsObject(authorPageRobots),
    alternates: {
      canonical: getPageUrl(rootPageSlug + pageNumberSlug),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(rootPageSlug + pageNumberSlug),
      title: makeSeoTitle(pageNumberTitle + (authorMetaFacebook?.title || authorPageSettings?.title), parentData.applicationName),
      description: makeSeoDescription(pageNumberDescription + (authorMetaFacebook?.description || authorPageSettings?.description), 65),
      images: await generateCoverImageObject(authorMetaFacebookImage || authorCover),
    },
  };
}

export default async function AuthorsPage({params}: AuthorPageProps) {
  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(params.slug, rootPageSlug);

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(params.slug);

  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect(slug, pageNumber, rootPageSlug);

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
    
    // Get all articles that belong to the current author, and split it into pages.
    const articlesResponse = (await getArticlesCollection({
      populate: '*', filters: { author: { slug: { $eq: slug } } },
      pagination: { page: pageNumber || 1, pageSize: 24 },
    }));
    const articlesData = articlesResponse?.data as AuthorArticles;
    const articlesPagination = articlesResponse?.meta?.pagination;
    const articlesNumber = articlesPagination?.total || 0;

    // If the page number is beyond of the page count, we return a 404.
    outOfBoundsRedirect(pageNumber, articlesPagination?.pageCount, articlesData?.length);

    return (
      <main className={pageStyles.main}>
  
        <section className={classNames(pageStyles.container, authorStyles.intro)}>
  
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
  
        </section>
  
        <section className={pageStyles.grid}>
          {articlesData?.map((article) => {
            return <ArticleCard key={article.id} data={article.attributes} />
          })}
        </section>

        <PagePagination data={articlesPagination} />
  
      </main>
    );

  } // Single Author Page
  
  // Authors Page
  // ---------------------------------------------------------------------------

  // If there's no slug, we're on the root Authors page. 
  const authorsCollection = await getAuthorsCollection({
    populate: '*', sort: 'id:desc',
    pagination: { page: pageNumber || 1, pageSize: 12 },
  });
  const authorPageSettings = await getSinglePageSettings('authors');
  const authorPagination = authorsCollection?.meta?.pagination;

  // If the page number is beyond of the page count, we return a 404.
  outOfBoundsRedirect(pageNumber, authorPagination?.pageCount, authorsCollection?.data?.length);

  return (
    <main className={pageStyles.main}>

      <Title className={pageStyles.pageTitle}>
        {capitalize(authorPageSettings?.title.trim() || 'Authors')}
      </Title>

      <section className={pageStyles.grid}>
        {authorsCollection.data.map((author) => {
          return (<AuthorCard key={author.id} data={author.attributes} />);
        })}
      </section>

      <PagePagination data={authorPagination} />

    </main>
  );
}
