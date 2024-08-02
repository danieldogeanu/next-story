import type { Metadata } from 'next';
import { Title } from '@mantine/core';
import { getAuthorsCollection } from '@/data/authors';
import { getSinglePageSettings, PageRobots } from '@/data/settings';
import { generateRobotsObject } from '@/utils/server/seo';
import { capitalize } from '@/utils/strings';
import AuthorCard from '@/components/author-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const authorPageSettings = await getSinglePageSettings('authors');
  const authorPageRobots = authorPageSettings?.robots as PageRobots;

  return {
    title: capitalize(authorPageSettings?.title.trim() as string),
    description: authorPageSettings?.description?.trim().substring(0, 160),
    keywords: authorPageSettings?.keywords,
    robots: await generateRobotsObject(authorPageRobots),
  };
}

export default async function AuthorsPage() {
  const authorsCollection = await getAuthorsCollection({populate: '*'});
  const authorPageSettings = await getSinglePageSettings('authors');

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {capitalize(authorPageSettings?.title.trim() as string)}
      </Title>
      <section className={styles.grid}>
        {authorsCollection.data.map((author) => {
          return (<AuthorCard key={author.id} data={author.attributes} />);
        })}
      </section>
    </main>
  );
}
