import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getTagsCollection, SingleTag, TagArticles } from '@/data/tags';
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getPageUrl } from '@/utils/urls';
import { makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { isSlugArrayValid } from '@/validation/urls';
import ArticleCard from '@/components/article-card';
import SortBar from '@/components/sort-bar';
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
  
  return (
    <main className={styles.main}>

      <Title className={styles.pageTitle}>
        Tags Refactor
      </Title>

    </main>
  );
}
