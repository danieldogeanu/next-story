import Link from 'next/link';
import path from 'node:path';
import { Title } from '@mantine/core';
import { getArticlesCollection } from '@/data/articles';
import { convertToUnixTime } from '@/utils/date';
import styles from '@/styles/page.module.scss';

export default async function Home() {
  const articlesCollection = await getArticlesCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Home</Title>
      {articlesCollection.data.map((article) => {
        const articleData = article.attributes;
        const articleHref = path.join('articles', convertToUnixTime(articleData.createdAt), articleData.slug);
        return (<li key={article.id}>
          <Link href={articleHref}>{articleData.title}</Link>
        </li>);
      })}
    </main>
  );
}
