import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getTagsCollection, SingleTag, TagArticles } from '@/data/tags';
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import { makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { getSinglePageSettings } from '@/data/settings';
import { isSlugArrayValid } from '@/validation/urls';
import { capitalize } from '@/utils/strings';
import PagePagination from '@/components/page-pagination';
import ArticleCard from '@/components/article-card';
import SortBar from '@/components/sort-bar';
import TagCard from '@/components/tag-card';
import styles from '@/styles/page.module.scss';


export interface TagsPageProps {
  params: {
    slug: string[];
  };
}

const rootPageSlug = '/tags-refactor';

export async function generateMetadata({params}: TagsPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  if (!isSlugArrayValid(params.slug)) return {};
  const {slug, pageNumber} = extractSlugAndPage(params.slug);

  const parentData = await parent;
  
  return {};
}

export default async function TagsPage({params}: TagsPageProps) {
  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(params.slug, rootPageSlug);

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(params.slug);

  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect(slug, pageNumber, rootPageSlug);

  // Tags Page
  // ---------------------------------------------------------------------------
  
  // If there's no slug, we're on the root Tags page. 
  const tagsCollection = await getTagsCollection({
    populate: '*', sort: 'id:desc',
    pagination: { page: pageNumber || 1, pageSize: 4 },
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
