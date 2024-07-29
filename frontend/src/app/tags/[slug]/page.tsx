import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getTagsCollection, TagArticles } from '@/data/tags';
import { capitalize } from '@/utils/strings';
import ArticleCard from '@/components/article-card';
import SortBar from '@/components/sort-bar';
import styles from '@/styles/page.module.scss';

export interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({params}: TagPageProps): Promise<Metadata> {
  const tagData = (await getTagsCollection({
    filters: { slug: { $eq: params.slug } },
  })).data.pop()?.attributes;

  return {
    title: capitalize(tagData?.name.trim() as string) + ' Tag',
    description: null,
    keywords: null,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    }
  };
}

export default async function TagPage({params}: TagPageProps) {
  const tagData = (await getTagsCollection({
    filters: { slug: { $eq: params.slug } },
    populate: { articles: { populate: '*' } },
  })).data.pop()?.attributes;
  const articlesData = tagData?.articles?.data as TagArticles;

  // TODO: Remove populate for articles in this request, and do a separate request and use filters instead, so that we get pagination and sorting.

  if (!tagData) return notFound();

  return (
    <main className={styles.main}>

      <section className={styles.container}>
        <Title className={styles.pageTitle}>
          {tagData?.name} Tag
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

    </main>
  );
}
