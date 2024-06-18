import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getArticlesCollection } from '@/data/articles';
import { convertToISODate } from '@/utils/date';
import styles from '@/styles/page.module.scss';

export interface ArticlePageProps {
  params: {
    created: string;
    slug: string;
  };
}

export default async function ArticlePage({params}: ArticlePageProps) {
  const articleData = (await getArticlesCollection({
    populate: '*', filters: {
      createdAt: { $eq: convertToISODate(params.created) },
      slug: { $eq: params.slug },
    }
  })).data.pop()?.attributes;

  // Filters must match both createdAt and slug fields.
  // If not return a 404 Not Found error page.
  if (!articleData) return notFound();

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {articleData?.title}
      </Title>
      <p>{articleData?.excerpt}</p>
    </main>
  );
}
