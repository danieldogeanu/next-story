import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getTagsCollection } from '@/data/tags';
import ArticleCard from '@/components/article-card';
import SortBar from '@/components/sort-bar';
import styles from '@/styles/page.module.scss';

export interface TagPageProps {
  params: {
    slug: string;
  };
}

export default async function TagPage({params}: TagPageProps) {
  const tagData = (await getTagsCollection({
    filters: { slug: { $eq: params.slug } },
    populate: { articles: { populate: '*' } },
  })).data.pop()?.attributes;
  const articlesData = tagData?.articles?.data;

  if (!tagData) return notFound();

  return (
    <main className={styles.main}>

      <section className={styles.container}>
        <Title className={styles.pageTitle}>
          {tagData?.name} Tag
        </Title>
        <SortBar />
      </section>

      <section className={styles.grid}>
        {articlesData?.map((article) => {
          return <ArticleCard key={article.id} data={article.attributes} />;
        })}
      </section>

    </main>
  );
}
