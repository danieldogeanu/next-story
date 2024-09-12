import NextImage from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound, permanentRedirect, RedirectType } from 'next/navigation';
import { Box, Image, Title } from '@mantine/core';
import { getArticlesCollection } from '@/data/articles';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { getPagesCollection, PageContent, PageCover, PageMetaSocialEntry, PageMetaSocial, PageRobots, PageSEO, SinglePage } from '@/data/pages';
import { getPageUrl, getFileURL, checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, outOfBoundsRedirect } from '@/utils/urls';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
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
  
  return {};
}


export default async function Page({params}: PageProps) {
  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(params.slug, rootPageSlug);

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(params.slug);

  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect(slug, pageNumber, rootPageSlug);

  // Homepage
  // ---------------------------------------------------------------------------
  
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
