import NextImage from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound, permanentRedirect, RedirectType } from 'next/navigation';
import { Box, Image, Title } from '@mantine/core';
import { getArticlesCollection } from '@/data/articles';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { getPagesCollection, PageContent, PageCover, PageMetaSocialEntry, PageMetaSocial, PageRobots, PageSEO, SinglePage } from '@/data/pages';
import { getPageUrl, getFileURL, checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, outOfBoundsRedirect } from '@/utils/urls';
import { addPageNumber, makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { isSlugArrayValid } from '@/validation/urls';
import { getFrontEndURL } from '@/utils/client/env';
import { StrapiImageFormats } from '@/types/strapi';
import ArticleCard from '@/components/article-card';
import ContentRenderer from '@/components/content-renderer';
import PagePagination from '@/components/page-pagination';
import defaultCover from '@/assets/imgs/default-cover.webp';
import styles from '@/styles/page.module.scss';


export interface PageProps {
  params: {
    slug: string[];
  };
}

const rootPageSlug = '/';

export async function generateMetadata({params}: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  if (!isSlugArrayValid(params.slug)) return {};
  const {slug, pageNumber} = extractSlugAndPage(params.slug);
  
  const parentData = await parent;

  // Single Page
  // ---------------------------------------------------------------------------
  
  // If there's a slug, we're most likely on the Single Page.
  if (typeof slug === 'string') {

    // We don't have pagination on single pages, so we must return 
    // an empty metadata object if the slug array contains 'page'.
    if (Array.isArray(params.slug) && params.slug.includes('page')) return {};

    // Get single page data and return empty metadata if page is not found.
    // We don't need to handle pagination here, we only need one result.
    const pageData = (await getPagesCollection({
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
    })).data.pop()?.attributes as SinglePage;
    if (typeof pageData === 'undefined') return {};
  
    const pageCover = pageData?.cover?.data?.attributes as PageCover;
    const pageRobots = pageData?.robots as PageRobots;
    const pageSEO = pageData?.seo as PageSEO;
    const pageMetaImage = pageSEO?.metaImage?.data?.attributes as PageCover;
    const pageMetaSocials = pageSEO?.metaSocial as PageMetaSocial;
    const pageMetaFacebook = pageMetaSocials?.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
    const pageMetaFacebookImage = pageMetaFacebook?.image?.data?.attributes as PageCover;
  
    return {
      title: makeSeoTitle(pageSEO?.metaTitle || pageData?.title, parentData.applicationName),
      description: makeSeoDescription(pageSEO?.metaDescription || pageData?.excerpt),
      keywords: makeSeoKeywords(pageSEO?.keywords),
      robots: await generateRobotsObject(pageRobots),
      alternates: {
        canonical: getPageUrl(pageData?.slug),
      },
      openGraph: {
        ...parentData.openGraph, url: getPageUrl(pageData?.slug),
        title: makeSeoTitle(pageMetaFacebook?.title || pageSEO?.metaTitle || pageData?.title, parentData.applicationName),
        description: makeSeoDescription(pageMetaFacebook?.description || pageSEO?.metaDescription || pageData?.excerpt, 65),
        images: await generateCoverImageObject(pageMetaFacebookImage || pageMetaImage || pageCover),
      },
    };

  } // Single Page

  // Homepage
  // ---------------------------------------------------------------------------
  
  // If there's no slug, we're on the homepage, so we should get the site settings.
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  if (typeof siteSettingsResponse === 'undefined') return {};

  return {
    title: {
      absolute: makeSeoTitle(addPageNumber(
        `${siteSettings?.siteName} > ${siteSettings?.siteTagline}`,
        pageNumber, 'title')) as string,
    },
    alternates: {
      canonical: getPageUrl(addPageNumber('', pageNumber, 'slug')),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(addPageNumber('', pageNumber, 'slug')),
      title: makeSeoTitle(addPageNumber(siteSettings?.siteTagline, pageNumber, 'title')),
    },
  };
}


export default async function Page({params}: PageProps) {
  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(params.slug, rootPageSlug);

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(params.slug);

  // Single Page
  // ---------------------------------------------------------------------------
  
  // If there's a slug, we're most likely on the Single Page.
  if (typeof slug === 'string') {

    // We don't have pagination on single pages, so we must return a 404 if the slug array contains 'page'.
    if (Array.isArray(params.slug) && params.slug.includes('page')) return notFound();

    // Get single page data; we don't need to handle pagination here as there is none.
    const pageData = (await getPagesCollection({
      populate: '*', filters: { slug: { $eq: slug } },
      pagination: { start: 0, limit: 1 },
    })).data.pop()?.attributes as SinglePage;
  
    if (typeof pageData === 'undefined') return notFound();
  
    const pageCover = pageData?.cover?.data?.attributes as PageCover;
    const pageCoverFormats = pageCover?.formats as unknown as StrapiImageFormats;
    const pageCoverUrl = (pageCoverFormats?.large?.url)
      ? getFileURL(pageCoverFormats.large.url) : getFileURL(defaultCover.src, 'frontend');
    const pageContent = pageData?.content as PageContent;
  
    return (
      <main className={styles.main}>
  
        <article className={styles.container}>
  
          <header className={styles.intro}>
  
            <Title className={styles.pageTitle}>
              {pageData?.title}
            </Title>
  
            <Box className={styles.cover}>
              <Image
                className={styles.image}
                component={NextImage}
                src={pageCoverUrl}
                width={pageCoverFormats?.large?.width ?? defaultCover.width}
                height={pageCoverFormats?.large?.height ?? defaultCover.height}
                alt={pageCover?.alternativeText || ''}
                priority={true} />
            </Box>
  
          </header>
  
          <section className={styles.content}>
            <ContentRenderer content={pageContent} />
          </section>
  
        </article>
        
      </main>
    );

  } // Single Page

  // Homepage
  // ---------------------------------------------------------------------------
  
  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect(slug, pageNumber, rootPageSlug);
  
  // If there's no slug, we're on the Homepage.
  const articlesCollection = await getArticlesCollection({
    populate: '*', sort: 'id:desc',
    pagination: { page: pageNumber || 1, pageSize: 24 },
  });
  const articlesPagination = articlesCollection?.meta?.pagination;

  // If the page number is beyond of the page count, we return a 404.
  outOfBoundsRedirect(pageNumber, articlesPagination.pageCount, articlesCollection.data.length);

  return (
    <main className={styles.main}>

      <section className={styles.grid}>
        {articlesCollection.data.map((article) => {
          return (<ArticleCard key={article.id} data={article.attributes} />);
        })}
      </section>

      <PagePagination data={articlesPagination} />

    </main>
  );
}
