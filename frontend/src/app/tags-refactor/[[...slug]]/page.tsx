import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getTagsCollection, SingleTag, TagArticles } from '@/data/tags';
import { makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { getPageUrl } from '@/utils/urls';
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
  
  return {};
}

export default async function TagsPage({params}: TagsPageProps) {
  
  return (
    <main className={styles.main}>

      <Title className={styles.pageTitle}>
        Tags Refactor
      </Title>

    </main>
  );
}
